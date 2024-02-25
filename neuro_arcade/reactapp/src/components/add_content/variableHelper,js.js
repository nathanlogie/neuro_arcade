const IMAGE_EXTENSION = ['png', 'jpg', 'jpeg'];
const EVAL_EXTENSION = ['py']
const SCORE_EXTENSION = ['json']
const MAX_NAME_LENGTH = 64
const MAX_DESCRIPTION_LENGTH = 1024

export function get_image_extension() {
    return IMAGE_EXTENSION;
}

export function get_eval_extension() {
    return EVAL_EXTENSION;
}

export function get_score_extension() {
    return SCORE_EXTENSION;
}

export function get_name_length() {
    return MAX_NAME_LENGTH;
}

export function get_description_length() {
    return MAX_DESCRIPTION_LENGTH
}