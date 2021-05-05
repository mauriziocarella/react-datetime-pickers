import React from 'react'
import classNames from 'classnames'
import { IconArrowDown, IconArrowLeft, IconArrowRight, IconArrowUp, IconCalendar, IconClock } from './icons'
import PropTypes from 'prop-types'

import './index.scss'

const useDidMountEffect = function(fn, inputs) {
	const didMountRef = React.useRef(false);

	React.useEffect(() => {
		if (didMountRef.current)
			fn();
		else
			didMountRef.current = true;
	}, inputs);
};

const Helper = function(firstDayOfWeek) {
	let months = [
		{
			month: 0,
			name: 'January'
		},
		{
			month: 1,
			name: 'February'
		},
		{
			month: 2,
			name: 'March'
		},
		{
			month: 3,
			name: 'April'
		},
		{
			month: 4,
			name: 'May'
		},
		{
			month: 5,
			name: 'June'
		},
		{
			month: 6,
			name: 'July'
		},
		{
			month: 7,
			name: 'August'
		},
		{
			month: 8,
			name: 'September'
		},
		{
			month: 9,
			name: 'October'
		},
		{
			month: 10,
			name: 'November'
		},
		{
			month: 11,
			name: 'December'
		}
	];
	let dows = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

	dows = dows.concat(dows.splice(0, firstDayOfWeek));

	return {
		months,
		dows,

		isSameDayAs(a, b) {
			return (
				a.getFullYear() === b.getFullYear() &&
				a.getMonth() === b.getMonth() &&
				a.getDate() === b.getDate()
			)
		},
		isSameMonthAs(a, b) {
			return (
				a.getFullYear() === b.getFullYear() &&
				a.getMonth() === b.getMonth()
			)
		},
		isSameYearAs(a, b) {
			return (
				a.getFullYear() === b.getFullYear()
			)
		},
		isSameTimeAs(a, b) {
			return (
				a.getHours() === b.getHours() &&
				a.getMinutes() === b.getMinutes() &&
				a.getSeconds() === b.getSeconds() &&
				a.getMilliseconds() === b.getMilliseconds()
			)
		},

		dayStart(date) {
			let ret = new Date(date)
			ret.setHours(0, 0, 0, 0)
			return ret
		},
		dayEnd(date) {
			let ret = new Date(date)
			ret.setHours(23, 59, 59, 999)
			return ret
		},

		weekStart(date) {
			let ret = new Date(date)
			ret.setDate(date.getDate() - date.getDay() + firstDayOfWeek)
			return ret
		},
		weekEnd(date) {
			let ret = this.weekStart(date)
			ret.setDate(ret.getDate() + 6)
			ret.setHours(23, 59, 59, 999)
			return ret
		},
		monthStart(date) {
			let ret = new Date(date)
			ret.setDate(1)
			return ret
		},
		monthEnd(date) {
			return new Date(date.getFullYear(), date.getMonth() + 1, 0)
		},
		yearStart(date) {
			return new Date(date.getFullYear(), 0, 1)
		},
		yearEnd(date) {
			return new Date(date.getFullYear(), 11, 31)
		},

		getMonthWeeks(year, month) {
			let lastDayOfMonth = (new Date(year, month + 1, 0))

			let weeks = []

			let date = new Date(year, month, 1)
			let week
			do {
				week = {
					start: this.weekStart(date),
					end: this.weekEnd(date),
					days: []
				}

				for (let d = new Date(week.start); d.getTime() <= week.end.getTime(); d.setDate(d.getDate() + 1)) {
					let day = new Date(d)
					week.days.push({
						date: day,
						disabled: day.getMonth() !== month
					})
				}

				date = new Date(week.end)
				date.setDate(date.getDate() + 1)

				weeks.push(week)
			} while (week.end.getTime() <= lastDayOfMonth.getTime() || weeks.length < 6)

			return weeks;
		}
	}
};

const TimePicker = ({selected, onChange, helper}) => {
	const times = React.useMemo(() => {
		let start = (new Date(selected)).setHours(0,0,0,0);
		let end = (new Date(selected)).setHours(23,59,59,999);
		let times = [];

		for (let m = start; m < end; m += (600*1000)) {
			times.push({
				date: new Date(m),
			});
		}

		return times;
	}, []);

	const handleClick = React.useCallback(({date}) => () => {
		selected.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

		onChange(selected);
	}, [selected]);

	const isSelectedTime = ({date}) => {
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

const TimePickerScroller = ({selected, onChange}) => {
	const timeout = React.useRef(null);
	const interval = React.useRef(null);

	const setHour = (h) => {
		if (h >= 24) h = 0
		else if (h < 0) h = 23

		selected.setHours(h)

		onChange(selected)
	}
	const addHour = (offset) => setHour(selected.getHours() + offset);
	const handleHourChange = (e) => {
		setHour(e.target.value)
	}

	const setMinute = (m) => {
		if (m >= 60) m = 0
		else if (m < 0) m = 59

		selected.setMinutes(m)

		onChange(selected)
	}
	const addMinute = (offset) => setMinute(selected.getMinutes() + offset);
	const handleMinuteChange = (e) => {
		setMinute(e.target.value)
	}

	const clearTimers = () => {
		clearTimeout(timeout.current);
		clearInterval(interval.current)
	}
	const startAddHour = (offset) => {
		clearTimers()

		timeout.current = setTimeout(() => {
			interval.current = setInterval(() => {
				addHour(offset)
			}, 100)
		}, 100)
	}
	const startAddMinute = (offset) => {
		clearTimers()

		timeout.current = setTimeout(() => {
			interval.current = setInterval(() => {
				addMinute(offset)
			}, 100)
		}, 100)
	}

	React.useEffect(() => {
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

const TimeToggle = (props) => {
	const {timePicker, timeOpen, toggleTime} = props;

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

const Calendar = (props) => {
	const {view, setView, timeOpen, toggleTime, selector, selected, setDate, minDate, maxDate, firstDayOfWeek} = props;
	const [year, setYear] = React.useState(selected.getFullYear());
	const [month, setMonth] = React.useState(selected.getMonth());

	const helper = React.useMemo(() => Helper(firstDayOfWeek), [firstDayOfWeek]);

	const handleChange = (offset) => {
		switch (view) {
			case 'week':
			case 'day': {
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
			case 'month': {
				let _year = year

				_year += offset

				setYear(_year)
				break
			}
			case 'year': {
				let _year = year

				_year += offset * 15

				setYear(_year)
				break
			}
		}
	};
	const handleNext = () => handleChange(1);
	const handlePrevious = () => handleChange(-1);

	switch (timeOpen ? 'time' : view) {
		case 'time': {
			return (
				<React.Fragment>
					<div className={classNames("react-datetime-pickers-body")}>
						<TimePicker
							selected={selected}
							onChange={setDate}
							helper={helper}
						/>
					</div>
					<div className={classNames("react-datetime-pickers-footer")}>
						<TimeToggle
							timeOpen={timeOpen}
							toggleTime={toggleTime}
							{...props}
						/>
					</div>
				</React.Fragment>
			)
		}

		case 'week':
		case 'day': {
			if (selector !== 'day' && selector !== 'week') return null

			const weeks = helper.getMonthWeeks(year, month).map((week) => {
				week.days.map((day) => {
					if (minDate && day.date < helper.dayStart(minDate)) {
						day.disabled = true
					}

					if (maxDate && day.date > helper.dayEnd(maxDate)) {
						day.disabled = true
					}

					return day
				});

				return week
			});

			const isSelectedDay = ({date}) => {
				if (selected) {
					return helper.isSameDayAs(date, selected)
				}

				return false
			}
			const isTodayDay = ({date}) => {
				const today = new Date()

				return helper.isSameDayAs(date, today)
			};

			const onDayClick = ({date}) => {
				let _selected = selected
				_selected.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())

				switch (selector) {
					case 'week': {
						_selected = helper.weekStart(_selected)
						break
					}
				}

				setDate(_selected)
			};

			return (
				<React.Fragment>
					<div className={classNames("react-datetime-pickers-head")}>
						<div className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")} onClick={handlePrevious}>
							<IconArrowLeft/>
						</div>
						<div className={classNames("react-datetime-pickers-selector")} onClick={() => setView('month')}>
							{month + 1}/{year}
						</div>
						<div className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")} onClick={handleNext}>
							<IconArrowRight/>
						</div>
					</div>
					<div className={classNames("react-datetime-pickers-body")}>
						<div className={classNames("react-datetime-pickers-week-days")}>
							{helper.dows.map((d, i) => <div key={i} className={classNames("react-datetime-pickers-week-day")}>{d}</div>)}
						</div>
						<div className={classNames("react-datetime-pickers-days")}>
							{weeks.map((week, index) => (
								<div key={index} className={classNames("react-datetime-pickers-week", {
									selected: selector === 'week' && isSelectedDay(week.days[0])
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
							timeOpen={timeOpen}
							toggleTime={toggleTime}
							{...props}
						/>
					</div>
				</React.Fragment>
			)
		}

		case 'month': {
			const months = helper.months.map((month, index) => {
				month.date = new Date(year, month.month, 1);

				if (minDate && helper.monthEnd(month.date) < minDate) {
					month.disabled = true
				}
				if (maxDate && month.date > maxDate) {
					month.disabled = true
				}

				return month;
			})

			const isSelectedMonth = ({date}) => {
				if (selected) {
					return helper.isSameMonthAs(date, selected)
				}

				return false
			}
			const isTodayMonth = ({date}) => {
				const today = new Date()

				return helper.isSameMonthAs(date, today)
			};

			const onMonthClick = ({month}) => {
				setMonth(month)
				if (selector === 'month') {
					let _selected = selected
					_selected.setMonth(month, 1)
					setDate(_selected)
				} else {
					setView('day')
				}
			};

			return (
				<React.Fragment>
					<div className={classNames("react-datetime-pickers-head")}>
						<div className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")} onClick={handlePrevious}>
							<IconArrowLeft/>
						</div>
						<div className={classNames("react-datetime-pickers-selector")} onClick={() => setView('year')}>
							{year}
						</div>
						<div className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")} onClick={handleNext}>
							<IconArrowRight/>
						</div>
					</div>
					<div className={classNames("react-datetime-pickers-body")}>
						<div className={classNames("react-datetime-pickers-months")}>
							{months.map((month, index) => (
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
					</div>
					<div className={classNames("react-datetime-pickers-footer")}>
						<TimeToggle
							timeOpen={timeOpen}
							toggleTime={toggleTime}
							{...props}
						/>
					</div>
				</React.Fragment>
			)
		}

		case 'year': {
			const years = []
			for (let i = year - 7; i <= year + 7; i++) {
				const year = {
					year: i,
					date: new Date(i, 0, 1)
				};

				if (minDate && helper.yearEnd(year.date) < minDate) {
					year.disabled = true
				}
				if (maxDate && year.date > maxDate) {
					year.disabled = true
				}

				years.push(year)
			}

			const isSelectedYear = ({date}) => {
				if (selected) {
					return helper.isSameYearAs(date, selected)
				}

				return false
			}
			const isTodayYear = ({date}) => {
				const today = new Date()

				return helper.isSameYearAs(date, today)
			};

			const onYearClick = ({year}) => {
				setYear(year)

				//TODO Check if is year picker
				// let selected = this.state.selected;
				// selected.setFullYear(year);
				// this.setState({selected: new Date(selected)})

				setView('month')
			};

			return (
				<React.Fragment>
					<div className={classNames("react-datetime-pickers-head")}>
						<div className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")} onClick={handlePrevious}>
							<IconArrowLeft/>
						</div>
						<div className={classNames("react-datetime-pickers-selector")} onClick={() => setView('year')}>
							{year}
						</div>
						<div className={classNames("react-datetime-pickers-button react-datetime-pickers-button-outline react-datetime-pickers-button-icon")} onClick={handleNext}>
							<IconArrowRight/>
						</div>
					</div>
					<div className={classNames("react-datetime-pickers-body")}>
						<div className={classNames("react-datetime-pickers-years")}>
							{years.map((year, index) => (
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
					</div>
					<div className={classNames("react-datetime-pickers-footer")}>
						<TimeToggle
							timeOpen={timeOpen}
							toggleTime={toggleTime}
							{...props}
						/>
					</div>
				</React.Fragment>
			)
		}
	}

	return null
}

const Container = (props) => {
	const {selector, minDate, maxDate} = props;

	const [open, setOpen] = React.useState(false);
	const [view, setView] = React.useState(selector);
	const [timeOpen, setTimeOpen] = React.useState(false);
	const [selected, setSelected] = React.useState(props.selected || new Date());

	const container = React.useRef(null);
	const overlay = React.useRef(null);
	const input = React.useRef(null);

	const toggleOpen = React.useCallback(() => setOpen((open) => !open), []);
	const toggleTime = React.useCallback(() => setTimeOpen((open) => !open), []);

	const setDate = React.useCallback((date) => {
		let d = new Date(date);

		if (d < minDate) d = minDate;
		if (d > maxDate) d = maxDate;

		setSelected(d);
	}, [minDate, maxDate]);

	const Input = React.useCallback(({onClick}) => {
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

	React.useEffect(() => {
		if (input.current) {
			const formatter = (date) => {
				if (typeof props.formatter === 'function') return props.formatter(date)

				let value = date.toLocaleDateString()
				if (props.timePicker) value = date.toLocaleString()

				return value
			}

			input.current.value = formatter(selected)
		}
	}, [selected, view, selector, timeOpen])

	React.useEffect(() => {
		const onClick = (e) => {
			if (!container.current.contains(e.target)) {
				setOpen(false)
			}
		}

		document.addEventListener('click', onClick, {capture: true})

		return () => {
			document.removeEventListener('click', onClick, {capture: true})
		}
	}, []);

	React.useEffect(() => setView(selector), [selector]);

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
					view={view}
					setView={setView}
					selected={selected}
					setDate={setDate}
					timeOpen={timeOpen}
					toggleTime={toggleTime}
				/>
			</div>
		</div>
	)
}

Container.defaultProps = {
	selected: new Date(),
	selector: 'month',
	firstDayOfWeek: 1,
	timePicker: false,
	closeOnSelect: true,
};

Container.propTypes = {
	formatter: PropTypes.func,
	onChange: PropTypes.func,
}

export default Container
