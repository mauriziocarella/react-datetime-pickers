import React from 'react'
import classNames from 'classnames'
import { IconArrowDown, IconArrowLeft, IconArrowRight, IconArrowUp, IconCalendar, IconClock } from './icons'
import PropTypes from 'prop-types';

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
		monthStart(date) {
			let ret = new Date(date)
			ret.setDate(1)
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

const TimePicker = ({selected, onChange}) => {
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
		<div className={classNames("react-date-picker-time")}>
			<div className={classNames("react-date-picker-time-hour")}>
				<button
					className={classNames("react-date-picker-button react-date-picker-button-outline react-date-picker-button-icon")}
					onClick={() => addHour(1)}
					onMouseDown={() => startAddHour(1)}
				>
					<IconArrowUp/>
				</button>
				<input
					type="number"
					value={selected.getHours()}
					onChange={handleHourChange}
				/>
				<button
					className={classNames("react-date-picker-button react-date-picker-button-outline react-date-picker-button-icon")}
					onClick={() => addHour(-1)}
					onMouseDown={() => startAddHour(-1)}
				>
					<IconArrowDown/>
				</button>
			</div>
			<div className={classNames("react-date-picker-time-minute")}>
				<button
					className={classNames("react-date-picker-button react-date-picker-button-outline react-date-picker-button-icon")}
					onClick={() => addMinute(1)}
					onMouseDown={() => startAddMinute(1)}
				>
					<IconArrowUp/>
				</button>
				<input
					type="number"
					value={selected.getMinutes()}
					onChange={handleMinuteChange}
				/>
				<button
					className={classNames("react-date-picker-button react-date-picker-button-outline react-date-picker-button-icon")}
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
	const {showTimePicker, timeOpen, toggleTime} = props;

	if (!showTimePicker) return null

	return (
		<button className={classNames("react-date-picker-button react-date-picker-time-toggle react-date-picker-button-outline")} onClick={toggleTime}>
			{timeOpen ? <IconCalendar/> : <IconClock/>}
		</button>
	)
};

const Calendar = (props) => {
	const {view, setView, selector, selected, setDate, showTimePicker, firstDayOfWeek} = props;
	const [timeOpen, setTimeOpen] = React.useState(false);
	const [year, setYear] = React.useState(selected.getFullYear());
	const [month, setMonth] = React.useState(selected.getMonth());

	const toggleTime = React.useCallback(() => setTimeOpen((open) => !open), []);

	const helper = React.useMemo(() => Helper(firstDayOfWeek), [firstDayOfWeek]);

	const handleChange = (offset) => {
		switch (view) {
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
					<div className={classNames("react-date-picker-body")}>
						<TimePicker
							selected={selected}
							onChange={setDate}
						/>
					</div>
					<div className={classNames("react-date-picker-footer")}>
						<TimeToggle
							timeOpen={timeOpen}
							toggleTime={toggleTime}
							{...props}
						/>
					</div>
				</React.Fragment>
			)
		}

		case 'day': {
			if (selector !== 'day' && selector !== 'week') return null

			const weeks = helper.getMonthWeeks(year, month)

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
					<div className={classNames("react-date-picker-head")}>
						<div className={classNames("react-date-picker-button react-date-picker-button-outline react-date-picker-button-icon")} onClick={handlePrevious}>
							<IconArrowLeft/>
						</div>
						<div className={classNames("react-date-picker-selector")} onClick={() => setView('month')}>
							{month + 1}/{year}
						</div>
						<div className={classNames("react-date-picker-button react-date-picker-button-outline react-date-picker-button-icon")} onClick={handleNext}>
							<IconArrowRight/>
						</div>
					</div>
					<div className={classNames("react-date-picker-body")}>
						<div className={classNames("react-date-picker-week-days")}>
							{helper.dows.map((d, i) => <div key={i} className={classNames("react-date-picker-week-day")}>{d}</div>)}
						</div>
						<div className={classNames("react-date-picker-days")}>
							{weeks.map((week, index) => (
								<div key={index} className={classNames("react-date-picker-week", {
									selected: selector === 'week' && isSelectedDay(week.days[0])
								})}>
									{week.days.map((day, index) => (
										<button
											className={classNames("react-date-picker-day", {
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
					<div className={classNames("react-date-picker-footer")}>
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
			const months = helper.months.map((month, index) => ({
				...month,
				date: new Date(year, month.month, 1)
			}))

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
				console.log(selector)
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
					<div className={classNames("react-date-picker-head")}>
						<div className={classNames("react-date-picker-button react-date-picker-button-outline react-date-picker-button-icon")} onClick={handlePrevious}>
							<IconArrowLeft/>
						</div>
						<div className={classNames("react-date-picker-selector")} onClick={() => setView('year')}>
							{year}
						</div>
						<div className={classNames("react-date-picker-button react-date-picker-button-outline react-date-picker-button-icon")} onClick={handleNext}>
							<IconArrowRight/>
						</div>
					</div>
					<div className={classNames("react-date-picker-body")}>
						<div className={classNames("react-date-picker-months")}>
							{months.map((month, index) => (
								<button
									className={classNames("react-date-picker-month", {
										disabled: month.disabled,
										selected: isSelectedMonth(month),
										today: isTodayMonth(month)
									})}
									key={index}
									onClick={() => onMonthClick(month)}
								>
									{month.name}
								</button>
							))}
						</div>
					</div>
					<div className={classNames("react-date-picker-footer")}>
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
				years.push({
					year: i,
					date: new Date(i, 0, 1)
				})
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
					<div className={classNames("react-date-picker-head")}>
						<div className={classNames("react-date-picker-button react-date-picker-button-outline react-date-picker-button-icon")} onClick={handlePrevious}>
							<IconArrowLeft/>
						</div>
						<div className={classNames("react-date-picker-selector")} onClick={() => setView('year')}>
							{year}
						</div>
						<div className={classNames("react-date-picker-button react-date-picker-button-outline react-date-picker-button-icon")} onClick={handleNext}>
							<IconArrowRight/>
						</div>
					</div>
					<div className={classNames("react-date-picker-body")}>
						<div className={classNames("react-date-picker-months")}>
							{years.map((year, index) => (
								<button
									className={classNames("react-date-picker-month", {
										// disabled: year.disabled,
										selected: isSelectedYear(year),
										today: isTodayYear(year)
									})}
									key={index}
									onClick={() => onYearClick(year)}
								>
									{year.year}
								</button>
							))}
						</div>
					</div>
					<div className={classNames("react-date-picker-footer")}>
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
	const {selector} = props;

	const [open, setOpen] = React.useState(false);
	const [view, setView] = React.useState(selector);
	const [selected, setSelected] = React.useState(props.selected || new Date());

	const container = React.useRef(null);
	const overlay = React.useRef(null);
	const input = React.useRef(null);

	const toggleOpen = React.useCallback(() => setOpen((open) => !open), []);

	const setDate = React.useCallback((date) => setSelected(new Date(date)), []);

	const Input = React.useCallback(() => {
		if (React.isValidElement(props.children)) {
			return React.cloneElement(props.children, {
				ref: input
			})
		}

		return (
			<input
				ref={input}
				type="text"
			/>
		);
	}, []);

	React.useEffect(() => {
		if (typeof props.onChange === "function") {
			props.onChange(selected)
		}

		if (input.current) {
			const formatter = (date) => {
				if (typeof props.inputFormatter === 'function') return props.inputFormatter(date)

				let value = date.toLocaleDateString()
				if (props.showTimePicker) value = date.toLocaleString()

				return value
			}

			input.current.value = formatter(selected)
		}
	}, [selected]);

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

	return (
		<div
			ref={container}
			className={classNames("react-date-picker", `react-date-picker-selector-${selector}`)}
		>
			<div className={classNames("react-date-picker-input")} onClick={toggleOpen}>
				<Input/>
			</div>
			<div
				ref={overlay}
				className={classNames("react-date-picker-overlay", `react-date-picker-mode-${view}`)}
				hidden={!open}
			>
				<Calendar
					{...props}
					view={view}
					setView={setView}
					selected={selected}
					setDate={setDate}
				/>
			</div>
		</div>
	)
}

Container.defaultProps = {
	selected: new Date(),
	selector: 'month',
	firstDayOfWeek: 1,
	showTimePicker: false,
};

Container.propTypes = {
	inputFormatter: PropTypes.func,
	onChange: PropTypes.func,
}

export default Container
