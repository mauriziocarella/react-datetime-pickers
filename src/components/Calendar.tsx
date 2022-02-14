import React, { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";

import Helper from "../Helper";
import { TimePickerGrid } from "./TimePickers";
import { ContainerProps } from "./Container";
import TimeToggle from "./TimeToggle";
import { IconArrowLeft, IconArrowRight } from "./icons/Icons";
import axios, { AxiosRequestConfig } from "axios";
import { Loading } from "./Loading";
import { useDidMountEffect } from "../helper/hooks";
import { DateTimePickerSelectedType, DateTimePickerSelectorType } from "../index";

export interface CalendarProps {
    disabledDates?: Array<Date | string> | AxiosRequestConfig,
    timePicker?: boolean,
    timeStep?: number,
}

const Calendar: React.FC<CalendarProps & ContainerProps & {
    open: boolean,
    setDate: (date?: DateTimePickerSelectedType) => void,
}> = (props) => {
    const {
        open = false,
        selector,
        selected = new Date(),
        setDate,
        minDate,
        maxDate,
        disabledDates: _disabledDates,
        firstDayOfWeek,
        timePicker = false,
        timeStep
    } = props;
    const [view, setView] = useState(selector);
    const [year, setYear] = useState(selected instanceof Date ? selected.getFullYear() : new Date().getFullYear());
    const [month, setMonth] = useState(selected instanceof Date ? selected.getMonth() : new Date().getMonth());
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);
    const [loading, setLoading] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);

    const [hovered, setHovered] = useState<Date | null>(null);

    const helper = useMemo(() => Helper(firstDayOfWeek), [firstDayOfWeek]);

    const handleChange = (offset: number) => {
        switch (view) {
            case DateTimePickerSelectorType.DAY_RANGE:
            case DateTimePickerSelectorType.WEEK:
            case DateTimePickerSelectorType.DAY: {
                let _month = month
                let _year = year

                _month += offset

                if (_month === -1) {
                    _month = 11
                    _year -= 1
                } else if (_month === 12) {
                    _month = 0
                    _year += 1
                }

                setMonth(_month)
                setYear(_year)
                break
            }
            case DateTimePickerSelectorType.MONTH: {
                let _year = year

                _year += offset

                setYear(_year)
                break
            }
            case DateTimePickerSelectorType.YEAR: {
                let _year = year

                _year += offset * 15

                setYear(_year)
                break
            }
        }
    };
    const handleNext = () => handleChange(1);
    const handlePrevious = () => handleChange(-1);

    const toggleTime = useCallback(() => setTimeOpen((open) => !open), []);

    useEffect(() => {
        if (typeof _disabledDates === "object") {
            if (Array.isArray(_disabledDates)) {
                const dates = _disabledDates.map((d) => {
                    if (typeof d === "string") return new Date(d)

                    return d
                })

                setDisabledDates(dates)
            }
            else {
                setLoading(true)
                axios({
                    ..._disabledDates,
                    params: {
                        ..._disabledDates.params,
                        year,
                        month,
                        view,
                    }
                })
                    .then(({data}) => {
                        if (typeof data !== "object" || !Array.isArray(data)) throw "Response should be an array of date strings";

                        const dates = data.map((d) => new Date(d))
                        setDisabledDates(dates)
                    })
                    .catch(() => setDisabledDates([]))
                    .finally(() => setLoading(false))
            }
        }
    }, [year, month, view])

    useEffect(() => setView(selector), [selector]);

    useDidMountEffect(() => {
        if (!open) {
            setHovered(null);
            setTimeOpen(false);

            switch (selector) {
                case DateTimePickerSelectorType.DAY_RANGE: {
                    if (selected instanceof Array && selected.length < 2) {
                        setDate();
                    }
                    break;
                }
            }
        }
    }, [open, selector, selected]);

    switch (timeOpen ? DateTimePickerSelectorType.TIME : view) {
        case DateTimePickerSelectorType.TIME: {
            return (
                <React.Fragment>
                    {loading && <Loading/>}
                    <div className={classNames("react-datetime-pickers-body")}>
                        <TimePickerGrid
                            open={open}
                            selected={selected}
                            setDate={setDate}
                            helper={helper}
                            step={timeStep}
                            minDate={minDate}
                            maxDate={maxDate}
                        />
                    </div>
                    <div className={classNames("react-datetime-pickers-footer")}>
                        <TimeToggle
                            timeOpen={timeOpen}
                            toggleTime={toggleTime}
                            timePicker={timePicker}
                        />
                    </div>
                </React.Fragment>
            )
        }

        case DateTimePickerSelectorType.WEEK:
        case DateTimePickerSelectorType.DAY: {
            if (selector !== DateTimePickerSelectorType.DAY && selector !== DateTimePickerSelectorType.WEEK) return null

            const weeks = helper.getMonthWeeks(year, month).map((week) => {
                week.days.map((day) => {
                    if (minDate && day.date < helper.dayStart(minDate)) {
                        day.disabled = true
                    }

                    if (maxDate && day.date > helper.dayEnd(maxDate)) {
                        day.disabled = true
                    }

                    if (!day.disabled) {
                        day.disabled = disabledDates.some((d) => helper.isSameDayAs(day.date, d))
                    }

                    return day
                });

                return week
            });

            const isSelectedDay = ({ date }: { date: Date }) => {
                if (selected && selected instanceof Date) {
                    return helper.isSameDayAs(date, selected)
                }

                return false
            }
            const isTodayDay = ({ date }: { date: Date }) => {
                const today = new Date()

                return helper.isSameDayAs(date, today)
            };

            const onDayClick = ({ date }: { date: Date }) => {
                if (selected instanceof Date) {
                    let _selected = selected
                    _selected.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())

                    switch (selector) {
                        case DateTimePickerSelectorType.WEEK: {
                            _selected = helper.weekStart(_selected)
                            break
                        }
                    }

                    setDate(_selected)
                }
            };

            return (
                <React.Fragment>
                    {loading && <Loading/>}
                    <div className={classNames("react-datetime-pickers-head")}>
                        <div
                            className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")}
                            onClick={handlePrevious}
                        >
                            <IconArrowLeft/>
                        </div>
                        <div className={classNames("react-datetime-pickers-selector")} onClick={() => setView(DateTimePickerSelectorType.MONTH)}>
                            {helper.months[month].name}/{year}
                        </div>
                        <div
                            className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")}
                            onClick={handleNext}
                        >
                            <IconArrowRight/>
                        </div>
                    </div>
                    <div className={classNames("react-datetime-pickers-body")}>
                        <div className={classNames("react-datetime-pickers-week-days")}>
                            {helper.dows.map((d, i) => (
                                <div key={i} className={classNames("react-datetime-pickers-week-day")}>{d}</div>
                            ))}
                        </div>
                        <div className={classNames("react-datetime-pickers-days")}>
                            {weeks.map((week, index) => (
                                <div key={index} className={classNames("react-datetime-pickers-week", {
                                    selected: selector === DateTimePickerSelectorType.WEEK && isSelectedDay(week.days[0])
                                })}>
                                    {week.days.map((day, index) => (
                                        <button
                                            type="button"
                                            className={classNames("react-datetime-pickers-day", {
                                                disabled: day.disabled,
                                                selected: isSelectedDay(day),
                                                today: isTodayDay(day)
                                            })}
                                            key={index}
                                            onClick={() => onDayClick(day)}
                                            disabled={day.disabled}
                                        >
                                            {day.date.getDate()}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={classNames("react-datetime-pickers-footer")}>
                        <TimeToggle
                            timePicker={timePicker}
                            timeOpen={timeOpen}
                            toggleTime={toggleTime}
                        />
                    </div>
                </React.Fragment>
            )
        }

        case DateTimePickerSelectorType.MONTH: {
            const months =
                helper.months.map((_month) => {
                    const month = {
                        ..._month,
                        date: new Date(year, _month.month, 1),
                        disabled: false,
                    }

                    if (minDate && helper.monthEnd(month.date) < minDate) {
                        month.disabled = true
                    }
                    if (maxDate && month.date > maxDate) {
                        month.disabled = true
                    }

                    if (!month.disabled) {
                        if (selector === "month") {
                            month.disabled = disabledDates.some((d) => helper.isSameMonthAs(month.date, d))
                        }
                    }

                    return month
                })
                .reduce((rows: Array<Array<typeof helper.months[number] & {date: Date, disabled: boolean}>>, month) => {
                    if (rows.length === 0 || rows[rows.length-1].length >= 3) rows.push([]);

                    rows[rows.length-1].push(month)

                    return rows;
                }, [])

            const isSelectedMonth = ({ date }: { date: Date }) => {
                if (selected && selected instanceof Date) {
                    return helper.isSameMonthAs(date, selected)
                }

                return false
            }
            const isTodayMonth = ({ date }: { date: Date }) => {
                const today = new Date()

                return helper.isSameMonthAs(date, today)
            };

            const onMonthClick = ({ month }: { month: number }) => {
                setMonth(month)
                if (selector === DateTimePickerSelectorType.MONTH) {
                    if (selected instanceof Date) {
                        const _selected = selected
                        _selected.setMonth(month, 1)
                        _selected.setFullYear(year)
                        setDate(_selected)
                    }
                } else if (selector === DateTimePickerSelectorType.DAY_RANGE) {
                    setView(DateTimePickerSelectorType.DAY_RANGE)
                }
                else {
                    setView(DateTimePickerSelectorType.DAY)
                }
            };

            return (
                <React.Fragment>
                    <div className={classNames("react-datetime-pickers-head")}>
                        <div
                            className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")}
                            onClick={handlePrevious}>
                            <IconArrowLeft/>
                        </div>
                        <div className={classNames("react-datetime-pickers-selector")} onClick={() => setView(DateTimePickerSelectorType.YEAR)}>
                            {year}
                        </div>
                        <div
                            className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")}
                            onClick={handleNext}>
                            <IconArrowRight/>
                        </div>
                    </div>
                    <div className={classNames("react-datetime-pickers-body")}>
                        <div className={classNames("react-datetime-pickers-months")}>
                            {months.map((rows, index) => (
                                <div key={index} className={classNames("react-datetime-pickers-row")}>
                                    {rows.map((month, index) => (
                                        <button
                                            type="button"
                                            className={classNames("react-datetime-pickers-month", {
                                                disabled: month.disabled,
                                                selected: isSelectedMonth(month),
                                                today: isTodayMonth(month)
                                            })}
                                            key={index}
                                            onClick={() => onMonthClick(month)}
                                            disabled={month.disabled}
                                        >
                                            {month.name}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={classNames("react-datetime-pickers-footer")}>
                        <TimeToggle
                            timePicker={timePicker}
                            timeOpen={timeOpen}
                            toggleTime={toggleTime}
                        />
                    </div>
                </React.Fragment>
            )
        }

        case DateTimePickerSelectorType.YEAR: {
            let years = []
            for (let i = year - 7; i <= year + 7; i++) {
                const year = {
                    year: i,
                    date: new Date(i, 0, 1),
                    disabled: false,
                };

                if (minDate && helper.yearEnd(year.date) < minDate) {
                    year.disabled = true
                }
                if (maxDate && year.date > maxDate) {
                    year.disabled = true
                }

                if (!year.disabled) {
                    if (selector === "year") {
                        year.disabled = disabledDates.some((d) => helper.isSameYearAs(year.date, d))
                    }
                }

                years.push(year)
            }

            years = years
                .reduce((rows: Array<Array<{year: number, date: Date, disabled: boolean}>>, year) => {
                    if (rows.length === 0 || rows[rows.length-1].length >= 3) rows.push([]);

                    rows[rows.length-1].push(year)

                    return rows;
                }, [])

            const isSelectedYear = ({ date }: { date: Date }) => {
                if (selected && selected instanceof Date) {
                    return helper.isSameYearAs(date, selected)
                }

                return false
            }
            const isTodayYear = ({ date }: { date: Date }) => {
                const today = new Date()

                return helper.isSameYearAs(date, today)
            };

            const onYearClick = ({ year }: { year: number }) => {
                setYear(year)

                if (selector === DateTimePickerSelectorType.YEAR) {
                    if (selected instanceof Date) {
                        const _selected = selected
                        _selected.setMonth(0, 1)
                        _selected.setFullYear(year)
                        setDate(_selected)
                    }
                } else {
                    setView(DateTimePickerSelectorType.MONTH)
                }
            };

            return (
                <React.Fragment>
                    <div className={classNames("react-datetime-pickers-head")}>
                        <div
                            className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")}
                            onClick={handlePrevious}>
                            <IconArrowLeft/>
                        </div>
                        <div className={classNames("react-datetime-pickers-selector")} onClick={() => setView(DateTimePickerSelectorType.YEAR)}>
                            {year}
                        </div>
                        <div
                            className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")}
                            onClick={handleNext}>
                            <IconArrowRight/>
                        </div>
                    </div>
                    <div className={classNames("react-datetime-pickers-body")}>
                        <div className={classNames("react-datetime-pickers-years")}>
                            {years.map((rows, index) => (
                                <div key={index} className={classNames("react-datetime-pickers-row")}>
                                    {rows.map((year, index) => (
                                        <button
                                            type="button"
                                            className={classNames("react-datetime-pickers-year", {
                                                disabled: year.disabled,
                                                selected: isSelectedYear(year),
                                                today: isTodayYear(year)
                                            })}
                                            key={index}
                                            onClick={() => onYearClick(year)}
                                            disabled={year.disabled}
                                        >
                                            {year.year}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={classNames("react-datetime-pickers-footer")}>
                        <TimeToggle
                            timePicker={timePicker}
                            timeOpen={timeOpen}
                            toggleTime={toggleTime}
                        />
                    </div>
                </React.Fragment>
            )
        }

        case DateTimePickerSelectorType.DAY_RANGE: {
            const weeks = helper.getMonthWeeks(year, month).map((week) => {
                week.days.map((day) => {
                    if (minDate && day.date < helper.dayStart(minDate)) {
                        day.disabled = true
                    }

                    if (maxDate && day.date > helper.dayEnd(maxDate)) {
                        day.disabled = true
                    }

                    if (!day.disabled) {
                        day.disabled = disabledDates.some((d) => helper.isSameDayAs(day.date, d))
                    }

                    return day
                });

                return week
            });

            const isSelectedDay = ({ date }: { date: Date }) => {
                if (selected && typeof selected === "object" && Array.isArray(selected)) {
                    return selected.some((s) => s ? helper.isSameDayAs(date, s) : false) ||
                        (!!selected[0] && !!selected[1] && helper.isAfter(date, selected[0]) && helper.isBefore(date, selected[1]))
                        || (!!selected[0] && !selected[1] && !!hovered && (helper.isBetween(date, selected[0], hovered) || helper.isBetween(date, hovered, selected[0])))
                }

                return false
            }
            const isTodayDay = ({ date }: { date: Date }) => {
                const today = new Date()

                return helper.isSameDayAs(date, today)
            };

            const onDayClick = ({ date }: { date: Date }) => {
                let _selected = selected

                if (!(_selected instanceof Array)) _selected = []
                if (_selected.length >= 2) _selected = []

                if (!_selected[0]) {
                    _selected = [date]
                }
                // If selected date is before first selected date
                else if (helper.isBefore(date, _selected[0])) {
                    _selected = [date, _selected[0]]
                }
                else {
                    _selected = [_selected[0], date]
                }

                setDate(_selected)
            };

            return (
                <React.Fragment>
                    {loading && <Loading/>}
                    <div className={classNames("react-datetime-pickers-head")}>
                        <div
                            className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")}
                            onClick={handlePrevious}
                        >
                            <IconArrowLeft/>
                        </div>
                        <div className={classNames("react-datetime-pickers-selector")} onClick={() => setView(DateTimePickerSelectorType.MONTH)}>
                            {helper.months[month].name}/{year}
                        </div>
                        <div
                            className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")}
                            onClick={handleNext}
                        >
                            <IconArrowRight/>
                        </div>
                    </div>
                    <div className={classNames("react-datetime-pickers-body")}>
                        <div className={classNames("react-datetime-pickers-week-days")}>
                            {helper.dows.map((d, i) => (
                                <div key={i} className={classNames("react-datetime-pickers-week-day")}>{d}</div>
                            ))}
                        </div>
                        <div className={classNames("react-datetime-pickers-days")}>
                            {weeks.map((week, index) => (
                                <div
                                    key={index}
                                    className={classNames("react-datetime-pickers-week", {
                                        selected: selector === DateTimePickerSelectorType.WEEK && isSelectedDay(week.days[0])
                                    })}
                                >
                                    {week.days.map((day, index) => (
                                        <div
                                            key={index}
                                            onMouseEnter={() => !day.disabled && setHovered(day.date)}
                                            onMouseLeave={() => setHovered(null)}
                                        >
                                            <button
                                                type="button"
                                                className={classNames("react-datetime-pickers-day", {
                                                    disabled: day.disabled,
                                                    selected: isSelectedDay(day),
                                                    today: isTodayDay(day)
                                                })}
                                                onClick={() => onDayClick(day)}
                                                disabled={day.disabled}
                                            >
                                                {day.date.getDate()}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }

    return null
}

// {/*<CalendarDayRange*/}
// {/*    helper={helper}*/}
// {/*    year={year}*/}
// {/*    month={month}*/}
// {/*    loading={loading}*/}
// {/*    handlePrevious={handlePrevious}*/}
// {/*    handleNext={handleNext}*/}
// {/*    setView={setView}*/}
// {/*    selector={selector}*/}
// {/*    {...props}*/}
// {/*    disabledDates={disabledDates}*/}
// {/*/>*/}
// const CalendarDayRange: React.VFC<Omit<React.ComponentProps<typeof Calendar>, "disabledDates"> & {
//     helper: ReturnType<typeof Helper>,
//     year: number,
//     month: number,
//     loading: boolean,
//     disabledDates: Date[],
//     handlePrevious: () => void,
//     handleNext: () => void,
//     setView: (view: DateTimePickerSelectorType) => void,
// }> = ({
//     helper,
//     year,
//     month,
//     minDate,
//     maxDate,
//     disabledDates,
//     selected,
//     setDate,
//     loading,
//     handlePrevious,
//     handleNext,
//     setView,
//     selector,
// }) => {
//     const [hovered, setHovered] = useState();
// }

export default Calendar;
