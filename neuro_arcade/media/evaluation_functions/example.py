from enum import Enum
from typing import NamedTuple, Optional, Callable, cast
import json

import numpy as np
import pandas as pd


# types of actions
class ActionType(Enum):
    MOUSE_DOWN_START = 0
    MOUSE_DOWN = 1
    MOUSE_UP = 2

# one action as coming from unity (of type ActionType)
class ActionRecordUnity(NamedTuple):
    # from Unity
    action_type: ActionType
    timestamp: int
    xy_wrt_bounding_box: list[float]
    frame: int
    xy_wrt_world: list[int]
    is_dragged: bool
    clicked_object: str
    raycasted_objects_during_collect: list[str]
    targeted_valued_object: bool
    collected_value: Optional[float]

# processed actions
# multiple ActionRecordUnity compose one ActionEvent
# e.g., one event might be a MOUSE_DOWN_START, then multiple MOUSE_DOWN, and then one MOUSE_UP record
# the function action_list_to_action_events() will transform ActionRecordUnity into ActionEvents
class ActionEvent(NamedTuple):
    targeted_object: str
    collected_value: float
    start: int
    end: int
    duration: int
    targeted_valued_object: bool 
    clicked_on_occluder: bool
    xy_wrt_bounding_box: np.ndarray
    frames: np.ndarray
    xy_wrt_world: np.ndarray
    is_dragged: bool
    clicked_object: str
    raycasted_objects_during_collect: list[str]
    def __repr__(self):
        fields_to_show = [x for x in self._fields if x not in ['xy_wrt_bounding_box', 'xy_wrt_world', 'frames']]
        with np.printoptions(precision=3, suppress=True):
            return 'ActionEvent('+', '.join([f'{x}={getattr(self, x)}' for x in fields_to_show])+')'
            


def new_action_record(action_dict: dict) -> ActionRecordUnity:
    """ converts action dict from Unity to ActionRecordUnity

        changes type of action_type into ActionType
        replaces -9999 with np.nan for collected_values
    Args:
        action_dict (dict): action dict from Unity data

    Returns:
        ActionRecordUnity
    """
    action_dict = action_dict.copy()
    action_dict.update(dict(action_type=ActionType(action_dict['action_type']), 
                            collected_value=action_dict['collected_value'] if action_dict['collected_value'] >-9999 else np.nan))
    action = ActionRecordUnity(**action_dict)
    return action


def action_list_to_action_events(actions_from_unity: list[dict] | list[ActionRecordUnity], 
                                 target_str: str = 'Target',
                                 distractor_str: str = 'Distractor',
                                 occluder_str: str = 'Occluder') -> list[ActionEvent]:
    """ takes a list of unity action dicts and returns a list of events

        one event is a sequence of actions:
            - starts with a MOUSE_DOWN_START action
            - then several frames of MOUSE_DOWN action
            - then MOUSE_UP action (during which valued object collection happens)
        

    Args:
        actions_from_unity (List[dict]): [description]

    Returns:
        List[ActionEvent]: [description]
    """

    if all([isinstance(x, dict) for x in actions_from_unity]):
        # cast only for static typing
        actions = [new_action_record(cast(dict, action_dict)) for action_dict in actions_from_unity]
    elif all([isinstance(x, ActionRecordUnity) for x in actions_from_unity]):
        actions = cast(list[ActionRecordUnity], actions_from_unity)
    
    action_events = []
    mouse_ups = np.where([action.action_type.name == ActionType.MOUSE_UP.name for action in actions])[0]
    
    # one group of actions is one MOUSE_DOWN_START, several MOUSE_DOWN, and one MOUSE_UP    
    mouse_ups = [-1] + mouse_ups.tolist()
    group_actions_by_mouse_up = [actions[mouse_ups[x-1]+1:mouse_ups[x]+1] for x in range(1, len(mouse_ups))] # list of lists, each list is a sequence of action events ending with a mouse up event        
    
    for grouped_actions in group_actions_by_mouse_up:
        # each grouped action should be MOUSE_DOWN_START, a number of MOUSE_DOWN, and then a MOUSE_UP
        if len(grouped_actions) <= 1:
            pass
        else:
            mouse_down_start, *mouse_downs, mouse_up = grouped_actions
            targeted_object, clicked_on_occluder = None, None
            if mouse_down_start.action_type==ActionType.MOUSE_DOWN_START and mouse_up.action_type==ActionType.MOUSE_UP:
                match [mouse_up.raycasted_objects_during_collect, mouse_up.clicked_object]:            
                    case [[],'']:
                        # there was no raycasting happening -> the spotlight was not clicked but sth else (e.g., empty space)
                        targeted_object = 'empty'
                    case [[],clicked_object]:
                        # there was no raycasting happening -> the spotlight was not clicked but sth else (e.g., occluder)
                        targeted_object = clicked_object
                    case [raycasted_objects, clicked_object]:
                        # there was raycasting and one of the objects during raycasting is a target or a distractor                    
                        targets_or_distractors = [x for x in raycasted_objects if target_str in x or distractor_str in x]
                        if len(targets_or_distractors) > 1:
                            print('there should actually only be one target or one distractor in the raycasting list (during spotlight collect())')

                        targets_or_distractors = targets_or_distractors[:1]
                        
                        if len(targets_or_distractors) == 1:
                            targeted_object = targets_or_distractors[0]
                            
                    case _:
                        raise Exception(f"something does not match. clicked_object={mouse_up.clicked_object} || raycasted_objects_during_collect={raycasted_objects}")
                            
            if any([occluder_str in obj_name for obj_name in mouse_up.raycasted_objects_during_collect]) or occluder_str in mouse_up.clicked_object:
                clicked_on_occluder = True
            else:
                clicked_on_occluder = False
            
            start = mouse_down_start.timestamp
            end = mouse_up.timestamp
            duration = end - start

            in_between_mouse_downs = [action for action in actions if action.action_type == ActionType.MOUSE_DOWN
                                                                    and action.timestamp > mouse_down_start.timestamp
                                                                    and action.timestamp < mouse_up.timestamp]
            frames = np.array([mouse_down_start.frame] 
                                            + [x.frame for x in in_between_mouse_downs] 
                                            + [mouse_up.frame])

            xy_wrt_bounding_box = np.array([mouse_down_start.xy_wrt_bounding_box] 
                                            + [x.xy_wrt_bounding_box for x in in_between_mouse_downs] 
                                            + [mouse_up.xy_wrt_bounding_box])
            xy_wrt_world = np.array([mouse_down_start.xy_wrt_world] 
                                            + [x.xy_wrt_world for x in in_between_mouse_downs] 
                                            + [mouse_up.xy_wrt_world])                           
            value = np.nan if mouse_up.collected_value is None else mouse_up.collected_value  
            action_event = ActionEvent(targeted_object=targeted_object, clicked_on_occluder=clicked_on_occluder,
                                    start=start, end=end, duration=duration,
                                    xy_wrt_bounding_box=xy_wrt_bounding_box,
                                    frames=frames,
                                    xy_wrt_world=xy_wrt_world,
                                    is_dragged=mouse_up.is_dragged,
                                    clicked_object=mouse_up.clicked_object, 
                                    raycasted_objects_during_collect=mouse_up.raycasted_objects_during_collect,
                                    targeted_valued_object=mouse_up.targeted_valued_object,
                                    collected_value=value)        
            
            action_events.append(action_event)

    return action_events

def process_responses_from_actionevent_list(action_events: list[ActionEvent],
                                            rt_baseline: int = 0,
                                            sort_responses_by_timestamp: bool = True) -> pd.DataFrame:

    responses_df = pd.DataFrame(columns=['response_order', 'collected_value',
                                       'correct', 'response_at', 'rt', 'targeted_object_name',
                                       'x', 'y'])

    responses_to_filtered_objects = [r for r in action_events if r.targeted_valued_object]
        
    if sort_responses_by_timestamp:
        timestamps = [r2fo.start for r2fo in responses_to_filtered_objects]
        responses_to_filtered_objects = [x for _, x in sorted(zip(timestamps, responses_to_filtered_objects))]
                
    for ii, r2fo in enumerate(responses_to_filtered_objects):            
        responses_df = pd.concat((responses_df,
                pd.DataFrame({
            'response_order': [f'response_{ii}'],
            'collected_value': [r2fo.collected_value],
            'correct': [r2fo.collected_value > 0],
            'response_at': [r2fo.start],
            'rt': [r2fo.start - rt_baseline],
            'targeted_object_name': [r2fo.targeted_object],
            'response_type': 'select', # could be click or tap (on a touchscreen)
            'x': [float(r2fo.xy_wrt_bounding_box[0][0])],
            'y': [float(r2fo.xy_wrt_bounding_box[0][1])],
            })), ignore_index=True)

    return responses_df


def collected_coins(responses_df: pd.DataFrame) -> int:
    return responses_df['collected_value'].sum()

def accuracy(responses_df: pd.DataFrame) -> float:
    return responses_df['correct'].mean()


def classic_mot_process_trial_data(trial_list: list[dict], single_trial_metric_funs: dict[str,Callable]) -> list:

    trial_blueprint_information_list = []
    
    single_trial_metrics = {metric_name: [] for metric_name in single_trial_metric_funs.keys()}
    
    # loop over trials. trial_data is one trial
    for trial_idx, trial_data in enumerate(trial_list):
        trial_data['trial_idx'] = trial_idx
        
        # BLUEPRINT INFORMATION
        trial_blueprint_information = trial_data['blueprint']
        trial_blueprint_information_list.append(trial_blueprint_information)
        
        # BEHAVIORAL DATA
        action_events = action_list_to_action_events(trial_data['actions'])
        responses_df = process_responses_from_actionevent_list(action_events)
        
        for metric_name, metric_fun in single_trial_metric_funs.items():
            single_trial_metrics[metric_name].append(metric_fun(responses_df))
        
    return single_trial_metrics


if __name__ == '__main__':

    # load the three trials        
    trial_list = []
    for ii in range(3):
        with open(f'trial_{ii}.json') as json_file:
            trial_list.append(json.load(json_file))

    # compute metric for each trial
    single_trial_metrics = classic_mot_process_trial_data(trial_list, 
                                                          dict(collected_coins=collected_coins, 
                                                               accuracy=accuracy))

    # print/output the average metric across all trials
    print(f'average metric across {len(trial_list)} trials:')
    for metric_name, metric_values in single_trial_metrics.items():
        print(f'{metric_name}: {np.mean(metric_values)}')