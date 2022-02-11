import React from "react";
import { Container, ContainerProps } from "./components/Container";
import Calendar, {CalendarProps} from "./components/Calendar";
import "./index.scss"
import { TimePickerGrid, TimePickerGridProps } from "./components/TimePickers";
import classNames from "classnames";

export enum DateTimePickerSelectorType {
    TIME = "time",
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year",

    DAY_RANGE = "day-range",
}
export type DateTimePickerSelectedType = Date | [Date?, Date?];
export interface DateTimePickerProps {
    selector?: DateTimePickerSelectorType,
    selected?: DateTimePickerSelectedType,
    onChange?: (date?: DateTimePickerSelectedType) => void,
    minDate?: Date,
    maxDate?: Date,
    firstDayOfWeek?: number,
    closeOnSelect?: boolean,
}

export const DateTimePicker: React.VFC<ContainerProps & CalendarProps> = ({...props}) => {
    return (
        <Container
            {...props}
            Content={(p) => (
                <Calendar
                    {...props}
                    {...p}
                />
            )}
        />
    )
}
export const TimePicker: React.VFC<ContainerProps & TimePickerGridProps> = ({...props}) => {
    return (
        <Container
            {...props}
            formatter={date => date && date instanceof Date ? date.toLocaleTimeString() : ""}
            Content={(p) => (
                <div className={classNames("react-datetime-pickers-body")}>
                    <TimePickerGrid
                        {...props}
                        {...p}
                    />
                </div>
            )}
        />
    )
}