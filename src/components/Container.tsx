import React, {useCallback, useEffect, useRef, useState} from "react"
import classNames from "classnames"

import {useDidMountEffect} from "../helper/hooks";

import Input from "./Input";
import {DateTimePickerProps} from "../index";
import Calendar, {CalendarProps} from "./Calendar";

export interface ContainerProps extends DateTimePickerProps {
    formatter?: (date?: Date, showTime?: boolean) => string,
    disabled?: boolean,
    readOnly?: boolean,
}

export const Container: React.FC<ContainerProps & {
    Content: (props: React.ComponentProps<typeof Calendar>) => React.ReactElement,
} & Pick<CalendarProps, "timePicker">> = ({
    selector,
    minDate,
    maxDate,
    selected: _selected,
    formatter,
    closeOnSelect = true,
    disabled = false,
    readOnly= false,
    children,
    timePicker,
    ...props
}) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(_selected);

    const container = useRef<HTMLDivElement>(null);
    const overlay = useRef(null);

    const toggleOpen = useCallback(() => setOpen((open) => !open), []);

    const setDate = useCallback((date) => {
        let d = new Date(date);

        if (minDate && d < minDate) d = minDate;
        if (maxDate && d > maxDate) d = maxDate;
        setSelected(d);
    }, [minDate, maxDate]);

    useDidMountEffect(() => {
        console.log("selected changed", closeOnSelect)
        if (typeof props.onChange === "function") {
            props.onChange(selected)
        }

        if (closeOnSelect) {
            setOpen(false);
        }
    }, [selected, closeOnSelect])

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (container.current && !container.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener("click", onClick, {capture: true})

        return () => {
            document.removeEventListener("click", onClick, {capture: true})
        }
    }, []);

    useEffect(() => {
        if (_selected) {
            if (_selected.getTime() !== selected?.getTime()) {
                setSelected(_selected)
            }
        }
    }, [_selected])

    return (
        <div
            ref={container}
            className={classNames("react-datetime-pickers", `react-datetime-pickers-selector-${selector}`)}
        >
            <Input
                selected={selected}
                formatter={formatter}
                onClick={toggleOpen}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!e.currentTarget.value) setSelected(undefined)
                }}
                disabled={disabled}
                readOnly={readOnly}
                children={children}
                timePicker={timePicker}
            />
            <div
                ref={overlay}
                className={classNames("react-datetime-pickers-overlay")}
                hidden={!open}
            >
                {props.Content({
                    open,
                    selected: selected || new Date(),
                    setDate,
                })}
            </div>
        </div>
    )
}
