import React from "react";
import {Container, ContainerProps} from "./components/Container";
import Calendar, {CalendarProps} from "./components/Calendar";
import './index.scss'

export enum DateTimePickerSelectorType {
    TIME = "time",
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year",
}
export interface DateTimePickerProps {
    selector?: DateTimePickerSelectorType,
    selected?: Date,
    onChange?: (date?: Date) => void,
    minDate?: Date,
    maxDate?: Date,
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