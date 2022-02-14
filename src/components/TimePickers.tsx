import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import classNames from "classnames";
import {IconArrowDown, IconArrowUp} from "./icons/Icons";
import Helper from "../Helper";
import {DateTimePickerProps} from "../index";

export interface TimePickerGridProps extends DateTimePickerProps {
    helper?: ReturnType<typeof Helper>,
    step?: number,
}
export const TimePickerGrid: React.VFC<TimePickerGridProps & {
    open: boolean,
    setDate: (date?: Date) => void,
}> = ({
    open,
    selected: _selected,
    setDate,
    helper: _helper,
    step = 1800,
    firstDayOfWeek,
    minDate,
    maxDate,
}) => {
    const [selected, setSelected] = useState(_selected);
    const container = useRef<HTMLDivElement>(null);

    const helper = useMemo(() => {
        if (_helper) return _helper;

        return Helper(firstDayOfWeek)
    }, [firstDayOfWeek, _helper])

    const times = useMemo(() => {
        const start = (selected && selected instanceof Date) ? new Date(selected?.getTime()) : new Date();
        const end = (selected && selected instanceof Date) ? new Date(selected?.getTime()) : new Date();

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        const times = [];
        for (let m = start.getTime(); m < end.getTime(); m += (step * 1000)) {
            const time = {
                date: new Date(m),
                disabled: false,
            };

            if (minDate && helper.isBefore(time.date, minDate)) {
                time.disabled = true;
            }
            else if (maxDate && helper.isAfter(time.date, maxDate)) {
                time.disabled = true;
            }

            times.push(time);
        }

        return times;
    }, []);

    const handleClick = useCallback(({date}) => () => {
        let d
        if (selected instanceof Date) d = selected
        if (!d) d = new Date()
        d.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

        if (typeof setDate === "function") setDate(d);
    }, [selected]);

    const isSelectedTime = ({date}: {date: Date}) => {
        if (selected && selected instanceof Date) {
            return helper.isSameTimeAs(date, selected)
        }

        return false
    }

    useEffect(() => {
        if (_selected && _selected instanceof Date && (!selected || selected instanceof Date)) {
            if (_selected.getTime() !== selected?.getTime()) {
                setSelected(_selected)
            }
        }
    }, [_selected])

    useEffect(() => {
        if (open && container.current) {
            const target = container.current.querySelector(".selected")

            if (target && target instanceof HTMLElement) {
                container.current.scrollTop = target.offsetTop - (container.current.clientHeight / 2);
            }
        }
    }, [open])

    return (
        <div ref={container} className="react-datetime-pickers-times">
            {times.map((time, index) => (
                <button
                    key={`time-${index}`}
                    type="button"
                    className={classNames("react-datetime-pickers-time", {
                        disabled: time.disabled,
                        selected: isSelectedTime(time),
                    })}
                    onClick={handleClick(time)}
                    disabled={time.disabled}
                >
                    {`${time.date.getHours()}`.padStart(2, "0")}:{`${time.date.getMinutes()}`.padStart(2, "0")}
                </button>
            ))}
        </div>
    )
}

export type TimePickerScrollerProps = {
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

        document.addEventListener("mouseup", onMouseUp, {capture: true})

        return () => {
            document.removeEventListener("mouseup", onMouseUp, {capture: true})
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
                    value={`${selected.getHours()}`.padStart(2, "0")}
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
                    value={`${selected.getMinutes()}`.padStart(2, "0")}
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