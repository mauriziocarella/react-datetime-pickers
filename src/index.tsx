import React, {useCallback, useEffect, useRef, useState} from 'react'
import classNames from 'classnames'

import {useDidMountEffect} from "./helper/hooks";

import './index.scss'
import Calendar from "./components/Calendar";

export type DateTimePickerSelectorType = "day" | "week" | "month" | "year";

export interface DateTimePickerProps {
    selector?: DateTimePickerSelectorType,
    selected?: Date,
    onChange?: (date: Date) => void,
    minDate?: Date,
    maxDate?: Date,
    formatter?: (date: Date) => string,
    timePicker?: boolean,
    firstDayOfWeek?: number,
    closeOnSelect?: boolean,
}

const Container: React.FC<DateTimePickerProps> = (props) => {
    const {selector, minDate, maxDate, timePicker, selected: _selected} = props;

    const [open, setOpen] = useState(false);
    const [view, setView] = useState(selector);
    const [timeOpen, setTimeOpen] = useState(false);
    const [selected, setSelected] = useState(_selected || new Date());

    const container = useRef<HTMLDivElement>(null);
    const overlay = useRef(null);
    const input = useRef<HTMLInputElement>(null);

    const toggleOpen = useCallback(() => setOpen((open) => !open), []);
    const toggleTime = useCallback(() => setTimeOpen((open) => !open), []);

    const setDate = useCallback((date) => {
        let d = new Date(date);

        if (minDate && d < minDate) d = minDate;
        if (maxDate && d > maxDate) d = maxDate;

        setSelected(d);
    }, [minDate, maxDate]);

    const Input = useCallback(({onClick}) => {
        if (React.isValidElement(props.children)) {
            return React.cloneElement(props.children, {
                ...props.children.props,
                ref: input,
                className: classNames(props.children.props.className, "react-datetime-pickers-input"),
                onClick,
            })
        }

        return (
            <input
                ref={input}
                type="text"
                className="react-datetime-pickers-input"
                onClick={onClick}
            />
        );
    }, []);

    useDidMountEffect(() => {
        if (typeof props.onChange === "function") {
            props.onChange(selected)
        }

        if (props.closeOnSelect) {
            setOpen(false);
        }
    }, [selected, props.closeOnSelect])

    useDidMountEffect(() => {
        if (!open) {
            setTimeOpen(false);
        }
    }, [open]);

    useEffect(() => {
        if (input.current) {
            const formatter = (date: Date) => {
                if (typeof props.formatter === 'function') return props.formatter(date)

                let value = date.toLocaleDateString()
                if (timePicker) value = date.toLocaleString()

                return value
            }

            input.current!.value = formatter(selected)
        }
    }, [selected, view, selector, timeOpen, timePicker])

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (container.current && !container.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('click', onClick, {capture: true})

        return () => {
            document.removeEventListener('click', onClick, {capture: true})
        }
    }, []);

    useEffect(() => setView(selector), [selector]);

    useEffect(() => {
        if (_selected) {
            if (_selected.getTime() !== selected.getTime()) {
                setSelected(_selected)
            }
        }
    }, [_selected])

    return (
        <div
            ref={container}
            className={classNames("react-datetime-pickers", `react-datetime-pickers-selector-${selector}`)}
        >
            <Input onClick={toggleOpen}/>
            <div
                ref={overlay}
                className={classNames("react-datetime-pickers-overlay", `react-datetime-pickers-mode-${view}`)}
                hidden={!open}
            >
                <Calendar
                    {...props}
                    open={open}
                    view={view || 'day'}
                    setView={setView}
                    selected={selected}
                    setDate={setDate}
                    timeOpen={timeOpen}
                    toggleTime={toggleTime}
                    timePicker={timePicker || false}
                />
            </div>
        </div>
    )
}
const defaultProps: DateTimePickerProps = {
    selector: 'day',
    timePicker: false,
    firstDayOfWeek: 1,
    closeOnSelect: true,
}

Container.defaultProps = defaultProps;
export default Container
