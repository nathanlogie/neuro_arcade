import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";

export function Button(name, link, direction) {
    return (
        <div
            className={'button'}
            

        >
                JBHEIUFUIEBFjkenf
        </div>
    );
}

function Arrow(direction) {
    if (direction === 'left') {
        return (
            <FaAngleLeft></FaAngleLeft>
        );
    } else if (direction === 'right') {
        return (
            <FaAngleRight></FaAngleRight>
        );
    } else if (direction === 'up') {
        return (
            <FaAngleUp></FaAngleUp>
        );
    } else if (direction === 'down') {
        return (
            <FaAngleDown></FaAngleDown>
        )
    }
}