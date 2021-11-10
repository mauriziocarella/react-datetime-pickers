import React, {useCallback, useEffect, useRef, useState} from 'react'
import classNames from 'classnames'

import {useDidMountEffect} from "./helper/hooks";

import './index.scss'
import Calendar from "./components/Calendar";
import Input from './components/Input';

export type DateTimePickerSelectorType = "day" | "week" | "month" | "year";

export interface DateTimePickerProps {
    selector?: DateTimePickerSelectorType,
    selected?: Date,
    onChange?: (date?: Date) => void,
    minDate?: Date,
    maxDate?: Date,
    formatter?: (date?: Date, showTime?: boolean) => string,
    timePicker?: boolean,
    firstDayOfWeek?: number,
    closeOnSelect?: boolean,
    timeStep?: number,
    disabled?: boolean,
    readOnly?: boolean
}
const defaultProps: DateTimePickerProps = {
    selector: 'day',
    timePicker: false,
    firstDayOfWeek: 1,
    closeOnSelect: true,
    timeStep: 600,
}

const Container: React.FC<DateTimePickerProps> = (props) => {
    const {selector, minDate, maxDate, timePicker, selected: _selected, disabled, readOnly, timeStep, formatter} = props;

    const [open, setOpen] = useState(false);
    const [view, setView] = useState(selector);
    const [timeOpen, setTimeOpen] = useState(false);
    const [selected, setSelected] = useState(_selected);

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
                disabled={disabled}
                readOnly={readOnly}
                timePicker={timePicker}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!e.currentTarget.value) setSelected(undefined)
                }}
                children={props.children}
            />
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
                    selected={selected || new Date()}
                    setDate={setDate}
                    timeOpen={timeOpen}
                    toggleTime={toggleTime}
                    timePicker={timePicker || false}
                    timeStep={timeStep || 600}
                />
            </div>
        </div>
    )
}
Container.defaultProps = defaultProps;

export default Container
