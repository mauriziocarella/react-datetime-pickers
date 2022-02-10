import React, {useCallback, useEffect, useRef, useState} from "react"
import classNames from "classnames"

import {useDidMountEffect} from "../helper/hooks";

import Input, { DateTimePickerInputProps } from "./Input";
import { DateTimePickerProps, DateTimePickerSelectedType } from "../index";
import Calendar, {CalendarProps} from "./Calendar";
import { TimePickerGridProps } from "./TimePickers";

export type ContainerProps = DateTimePickerProps &
    Omit<DateTimePickerInputProps, keyof DateTimePickerProps | keyof TimePickerGridProps>;

export type ContainerComponentProps =
    ContainerProps &
    {
        Content: (props: React.ComponentProps<typeof Calendar>) => React.ReactElement,
    } &
    Pick<CalendarProps, "timePicker">
export const Container: React.FC<ContainerComponentProps> = ({
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
    const [selected, setSelected] = useState<DateTimePickerSelectedType | undefined>(_selected);

    const container = useRef<HTMLDivElement>(null);
    const overlay = useRef(null);

    const toggleOpen = useCallback(() => setOpen((open) => !open), []);

    const setDate = (date?: DateTimePickerSelectedType) => {
        if (date instanceof Date) {
            let d = new Date(date);

            if (minDate && d < minDate) d = minDate;
            if (maxDate && d > maxDate) d = maxDate;
            setSelected(d);
        }
        else {
            setSelected(date)
        }
    };

    useDidMountEffect(() => {
        if (selected instanceof Date || (selected instanceof Array && selected.length >= 2)) {
            if (typeof props.onChange === "function") {
                props.onChange(selected)
            }

            if (closeOnSelect) {
                setOpen(false)
            }
        }
        else if (!selected) {
            if (typeof props.onChange === "function") {
                props.onChange(selected || undefined)
            }
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
        if (_selected && _selected instanceof Date && (!selected || selected instanceof Date)) {
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
                    if (!e.currentTarget.value) setDate()
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
