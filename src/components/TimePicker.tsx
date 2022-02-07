import React, {useCallback, useEffect, useMemo, useRef} from "react";
import classNames from "classnames";
import {IconArrowDown, IconArrowUp} from "./icons/Icons";
import Helper from "../Helper";

interface TimePickerGridProps {
    selected: Date,
    onChange: (date: Date) => void,
    helper: ReturnType<typeof Helper>,
    step: number,
}
export const TimePickerGrid: React.FC<TimePickerGridProps> = ({selected, onChange, helper, step}) => {
    const times = useMemo(() => {
        const start = (new Date(selected)).setHours(0, 0, 0, 0);
        const end = (new Date(selected)).setHours(23, 59, 59, 999);
        const times = [];

        for (let m = start; m < end; m += (step * 1000)) {
            times.push({
                date: new Date(m),
                disabled: false,
            });
        }

        return times;
    }, []);

    const handleClick = useCallback(({date}) => () => {
        selected.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

        onChange(selected);
    }, [selected]);

    const isSelectedTime = ({date}: {date: Date}) => {
        if (selected) {
            return helper.isSameTimeAs(date, selected)
        }

        return false
    }

    return (
        <div className="react-datetime-pickers-times">
            {times.map((time, index) => (
                <button
                    key={`time-${index}`}
                    type="button"
                    className={classNames("react-datetime-pickers-time", {
                        disabled: time.disabled,
                        selected: isSelectedTime(time),
                    })}
                    onClick={handleClick(time)}
                >
                    {`${time.date.getHours()}`.padStart(2, '0')}:{`${time.date.getMinutes()}`.padStart(2, '0')}
                </button>
            ))}
        </div>
    )
}

interface TimePickerScrollerProps {
    selected: Date,
    onChange: (date: Date) => void,
}
export const TimePickerScroller: React.FC<TimePickerScrollerProps> = ({selected, onChange}) => {
    const timeout = useRef<number | null>(null);
    const interval = useRef<number | null>(null);

    const setHour = (h: number) => {
        if (h >= 24) h = 0
        else if (h < 0) h = 23

        selected.setHours(h)

        onChange(selected)
    }
    const addHour = (offset: number) => setHour(selected.getHours() + offset);
    const handleHourChange = (e: React.FormEvent<HTMLInputElement>) => {
        setHour(parseInt(e.currentTarget.value))
    }

    const setMinute = (m: number) => {
        if (m >= 60) m = 0
        else if (m < 0) m = 59

        selected.setMinutes(m)

        onChange(selected)
    }
    const addMinute = (offset: number) => setMinute(selected.getMinutes() + offset);
    const handleMinuteChange = (e: React.FormEvent<HTMLInputElement>) => {
        setMinute(parseInt(e.currentTarget.value))
    }

    const clearTimers = () => {
        window.clearTimeout(timeout.current || 0);
        window.clearInterval(interval.current || 0)
    }
    const startAddHour = (offset: number) => {
        clearTimers()

        timeout.current = window.setTimeout(() => {
            interval.current = window.setInterval(() => {
                addHour(offset)
            }, 100)
        }, 100)
    }
    const startAddMinute = (offset: number) => {
        clearTimers()

        timeout.current = window.setTimeout(() => {
            interval.current = window.setInterval(() => {
                addMinute(offset)
            }, 100)
        }, 100)
    }

    useEffect(() => {
        const onMouseUp = () => clearTimers();

        document.addEventListener('mouseup', onMouseUp, {capture: true})

        return () => {
            document.removeEventListener('mouseup', onMouseUp, {capture: true})
        }
    }, [])

    return (
        <div className={classNames("react-datetime-pickers-time")}>
            <div className={classNames("react-datetime-pickers-time-hour")}>
                <button
                    type="button"
                    className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")}
                    onClick={() => addHour(1)}
                    onMouseDown={() => startAddHour(1)}
                >
                    <IconArrowUp/>
                </button>
                <input
                    type="number"
                    value={`${selected.getHours()}`.padStart(2, '0')}
                    onChange={handleHourChange}
                />
                <button
                    type="button"
                    className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")}
                    onClick={() => addHour(-1)}
                    onMouseDown={() => startAddHour(-1)}
                >
                    <IconArrowDown/>
                </button>
            </div>
            <div className={classNames("react-datetime-pickers-time-minute")}>
                <button
                    type="button"
                    className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")}
                    onClick={() => addMinute(1)}
                    onMouseDown={() => startAddMinute(1)}
                >
                    <IconArrowUp/>
                </button>
                <input
                    type="number"
                    value={`${selected.getMinutes()}`.padStart(2, '0')}
                    onChange={handleMinuteChange}
                />
                <button
                    type="button"
                    className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")}
                    onClick={() => addMinute(-1)}
                    onMouseDown={() => startAddMinute(-1)}
                >
                    <IconArrowDown/>
                </button>
            </div>
        </div>
    )
};
