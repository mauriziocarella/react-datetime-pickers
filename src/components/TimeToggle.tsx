import React from "react";
import classNames from "classnames";
import {IconCalendar, IconClock} from "./icons/Icons";

interface TimeToggleProps {
    timePicker: boolean,
    timeOpen: boolean,
    toggleTime: () => void
}

const TimeToggle: React.FC<TimeToggleProps> = ({timePicker, timeOpen, toggleTime}) => {
    if (!timePicker) return null

    return (
        <button
            type="button"
            className={classNames("react-datetime-pickers-button react-datetime-pickers-time-toggle react-datetime-pickers-button-outline")}
            onClick={toggleTime}
        >
            {timeOpen ? <IconCalendar/> : <IconClock/>}
        </button>
    )
};

export default TimeToggle;
