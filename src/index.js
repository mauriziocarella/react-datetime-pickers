import React, {Fragment} from "react"
import ReactDOM from "react-dom"
import classNames from "classnames"
import range from "lodash/range"

import { IconArrowRight, IconArrowLeft, IconArrowUp, IconArrowDown, IconClock, IconCalendar } from './icons'

import './index.scss'

const firstDayOfWeek = 1;

const Helper = (function() {
	let daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	let dowMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	let monthsMap = [
		{
			month: 0,
			name: 'January',
		},
		{
			month: 1,
			name: 'February',
		},
		{
			month: 2,
			name: 'March',
		},
		{
			month: 3,
			name: 'April',
		},
		{
			month: 4,
			name: 'May',
		},
		{
			month: 5,
			name: 'June',
		},
		{
			month: 6,
			name: 'July',
		},
		{
			month: 7,
			name: 'August',
		},
		{
			month: 8,
			name: 'September',
		},
		{
			month: 9,
			name: 'October',
		},
		{
			month: 10,
			name: 'November',
		},
		{
			month: 11,
			name: 'December',
		}];

	daysMap = daysMap.concat(daysMap.splice(0,firstDayOfWeek));
	dowMap = dowMap.concat(dowMap.splice(0,firstDayOfWeek));

	return {
		days: daysMap,
		dow: dowMap,
		months: monthsMap,
		isSameDateAs(a, b) {
			return (
				a.getFullYear() === b.getFullYear() &&
				a.getMonth() === b.getMonth() &&
				a.getDate() === b.getDate()
			);
		},
		isSameMonthAs(a, b) {
			return (
				a.getFullYear() === b.getFullYear() &&
				a.getMonth() === b.getMonth()
			);
		},
		isSameYearAs(a, b) {
			return (
				a.getFullYear() === b.getFullYear()
			);
		},
		monthStart(date) {
			let ret = new Date(date);
			ret.setDate(1)
			return ret
		},
		weekStart(date) {
			let ret = new Date(date);
			ret.setDate(date.getDate()-date.getDay()+firstDayOfWeek)
			return ret
		},
		weekEnd(date) {
			let ret = this.weekStart(date)
			ret.setDate(ret.getDate()+6)
			ret.setHours(23,59,59,999);
			return ret
		},
		getDayDetails(args) {
			let _date = args.index - args.firstDay
			let day = args.index % 7

			let prevMonth = args.month - 1
			let prevYear = args.year
			if (prevMonth === -1) {
				prevMonth = 11
				prevYear--
			}

			let nextMonth = args.month + 1
			let nextYear = args.year
			if (nextMonth === 12) {
				nextMonth = 0
				nextYear++
			}

			let prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth)

			let date = (_date < 0 ? prevMonthNumberOfDays + _date : _date % args.numberOfDays) + 1
			let month = _date < 0 ? prevMonth : _date >= args.numberOfDays ? nextMonth : args.month
			let year = _date < 0 ? prevYear : _date >= args.numberOfDays ? nextYear : args.year
			let disabled = _date < 0 || _date >= args.numberOfDays
			return {
				_date: new Date(year, month, date),
				date,
				day,
				disabled,
			}
		},
		getNumberOfDays(year, month) {
			return 40 - new Date(year, month, 40).getDate()
		},
		getMonthDetails(year, month) {


			let lastDayOfMonth = (new Date(year, month+1, 0))

			// let previousMonthDays = (new Date(year, month)).getDay()-firstDayOfWeek
			// let nextMonthDays = 7-(new Date(year, month+1, 1)).getDay()+firstDayOfWeek
			// for(let i=previousMonthDays;i>=0;i--) {
			// 	const date = new Date(year, month)
			// 	date.setDate(date.getDate()-i-1)
			// 	days.push(date)
			// }

			let weeks = [];

			let date = new Date(year, month, 1)
			let week;
			do  {
				week = {
					start: this.weekStart(date),
					end: this.weekEnd(date),
					days: [],
				}

				for(let d=new Date(week.start); d.getTime()<=week.end.getTime(); d.setDate(d.getDate()+1)) {
					let day = new Date(d)
					week.days.push({
						date: day,
						disabled: day.getMonth() !== month,
					});
				}

				date = new Date(week.end)
				date.setDate(date.getDate()+1)

				weeks.push(week)
			} while(week.end.getTime() <= lastDayOfMonth.getTime() || weeks.length < 6)

			return weeks;



			// let firstDay = (new Date(year, month)).getDay()-firstDayOfWeek
			// let numberOfDays = this.getNumberOfDays(year, month)
			// let monthArray = []
			// let rows = 6
			// let currentDay = null
			// let index = 0
			// let cols = 7
			//
			// for (let row = 0; row < rows; row++) {
			// 	for (let col = 0; col < cols; col++) {
			// 		currentDay = this.getDayDetails({
			// 			index,
			// 			numberOfDays,
			// 			firstDay,
			// 			year,
			// 			month
			// 		})
			// 		monthArray.push(currentDay)
			// 		index++
			// 	}
			// }
			// return monthArray
		},
	}
})();

class TimePickerComponent extends React.PureComponent {
	componentDidMount() {
		window.addEventListener('mouseup', () => {
			this.clearTimers()
		})
	}

	setHours = (value) => {
		let selected = this.props.selected
		if (value >= 24) value = 0
		else if (value < 0) value = 23

		selected.setHours(value)

		this.props.onChange(selected)
	}

	setMinutes = (value) => {
		let selected = this.props.selected
		if (value >= 60) value = 0
		else if (value < 0) value = 59

		selected.setMinutes(value)

		this.props.onChange(selected)
	}

	onHoursChange = (e) => {
		this.setHours(e.target.value)
	}
	onMinutesChange = (e) => {
		this.setMinutes(e.target.value)
	}

	addHours = (offset) => {
		let selected = this.props.selected
		this.setHours(selected.getHours()+offset)
	}
	addMinutes = (offset) => {
		let selected = this.props.selected
		this.setMinutes(selected.getMinutes()+offset)
	}

	startAddHour = (offset) => () => {
		this.clearTimers()

		this.timeout = setTimeout(() => {
			this.interval = setInterval(() => {
				this.addHours(offset)
			}, 100)
		}, 100)
	}

	startAddMinute = (offset) => () => {
		this.clearTimers()

		this.timeout = setTimeout(() => {
			this.interval = setInterval(() => {
				this.addMinutes(offset)
			}, 100)
		}, 100)
	}

	clearTimers = () => {
		clearTimeout(this.timeout)
		clearInterval(this.interval)
	}

	render() {
		return (
			<div className={classNames("react-date-picker-time")}>
				<div className={classNames("react-date-picker-time-hour")}>
					<button
						className={classNames("react-date-picker-button react-date-picker-button-icon")}
						onClick={() => this.addHours(1)}
						onMouseDown={this.startAddHour(1)}
					>
						<IconArrowUp/>
					</button>
					<input
						type="number"
						value={this.props.selected.getHours()}
						onChange={this.onHoursChange}
					/>
					<button
						className={classNames("react-date-picker-button react-date-picker-button-icon")}
						onClick={() => this.addHours(-1)}
						onMouseDown={this.startAddHour(-1)}
					>
						<IconArrowDown/>
					</button>
				</div>
				<div className={classNames("react-date-picker-time-minute")}>
					<button
						className={classNames("react-date-picker-button react-date-picker-button-icon")}
						onClick={() => this.addMinutes(1)}
						onMouseDown={this.startAddMinute(1)}
					>
						<IconArrowUp/>
					</button>
					<input
						type="number"
						value={this.props.selected.getMinutes()}
						onChange={this.onMinutesChange}
					/>
					<button
						className={classNames("react-date-picker-button react-date-picker-button-icon")}
						onClick={() => this.addMinutes(-1)}
						onMouseDown={this.startAddMinute(-1)}
					>
						<IconArrowDown/>
					</button>
				</div>
			</div>
		);
	}
}

class Picker extends React.PureComponent {
	state = {
		visible: false,
		timePickerVisible: false,
		view: 'day',
	}

	constructor(props) {
		super(props);

		this.state.selected = this.props.selected;
		this.state.year = this.state.selected.getFullYear();
		this.state.month = this.state.selected.getMonth();

		switch (this.props.selector) {
			case 'day': this.state.view = 'day'; break;
			case 'week': this.state.view = 'day'; break;
			case 'month': this.state.view = 'month'; break;
			case 'year': this.state.view = 'year'; break;
		}

		this.container = React.createRef()
		this.input = React.createRef()
		this.overlay = React.createRef()
	}

	componentDidMount() {
		window.addEventListener('click', (e) => {
			if (!this.container.current.contains(e.target)) this.setState({visible: false})
		})
	}
	componentDidUpdate(prevProps, prevState) {
		if ((!prevProps.selected && this.props.selected) || (prevProps.selected && this.props.selected && !Helper.isSameDateAs(this.props.selected, prevProps.selected))) {
			this.setState({selected: this.props.selected})
		}

		if (prevProps.selector !== this.props.selector) {
			switch (this.props.selector) {
				case 'day': this.setState({view: 'day'}); break;
				case 'week': {
					const selected = Helper.weekStart(this.state.selected)
					this.setState({view: 'day', selected})
					break
				}
				case 'month': {
					const selected = Helper.monthStart(this.state.selected)
					this.setState({view: 'month', selected})

					break
				}
				case 'year': this.setState({view: 'year'}); break;
			}
		}

		if (prevProps.showTimePicker !== this.props.showTimePicker) {
			this.setState({timePickerVisible: false})
		}
	}

	toggleVisibility = () => {
		this.setState({
			visible: !this.state.visible,
		})
	}
	toggleTime = () => {
		this.setState({
			timePickerVisible: !this.state.timePickerVisible,
		})
	}

	isTodayDay = ({ date }) => {
		const today = new Date();

		return Helper.isSameDateAs(date, today);
	}
	isSelectedDay = ({ date }) => {
		if (this.state.selected) {
			return Helper.isSameDateAs(date, this.state.selected);
		}

		return false;
	}
	isTodayMonth = ({ date }) => {
		const today = new Date();

		return Helper.isSameMonthAs(date, today);
	}
	isSelectedMonth = ({ date }) => {
		if (this.state.selected) {
			return Helper.isSameMonthAs(date, this.state.selected);
		}

		return false;
	}
	isTodayYear = ({ date }) => {
		const today = new Date();

		return Helper.isSameYearAs(date, today);
	}
	isSelectedYear = ({ date }) => {
		if (this.state.selected) {
			return Helper.isSameYearAs(date, this.state.selected);
		}

		return false;
	}

	onDayClick = ({ date }) => () => {
		let selected = this.state.selected
		selected.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())

		switch (this.props.selector) {
			case 'week': {
				selected = Helper.weekStart(selected)
				break;
			}
		}

		this.setSelected(selected)
	};
	onMonthClick = ({ month }) => () => {
		this.setState({
			month,
		}, () => {
			if (this.props.selector === "month") {
				let selected = this.state.selected;
				selected.setMonth(month, 1);
				this.setSelected(selected)
			}
			else {
				this.setView('day');
			}
		});
	}
	onYearClick = ({ year }) => () => {
		this.setState({
			year,
		}, () => {
			//TODO Check if is year picker
			// let selected = this.state.selected;
			// selected.setFullYear(year);
			// this.setState({selected: new Date(selected)})

			this.setView('month');
		});
	}

	change = (offset) => {
		switch (this.state.view) {
			case 'day': {
				let month = this.state.month
				let year = this.state.year

				month += offset

				if (month === -1) {
					month = 11
					year -= 1
				}
				else if (month === 12) {
					month = 0
					year += 1
				}

				this.setState({
					month,
					year,
				});
				break;
			}
			case 'month': {
				let year = this.state.year

				year += offset

				this.setState({
					year,
				});
				break;
			}
			case 'year': {
				let year = this.state.year

				year += offset*15

				this.setState({
					year,
				});
				break;
			}
		}
	}
	next = () => {
		this.change(1)
	}
	previous = () => {
		this.change(-1)
	}

	setView = (view) => {
		this.setState({view})
	};
	setSelected = (date) => {
		this.setState({selected: new Date(date)}, () => {
			if (typeof this.props.onChange === "function") this.props.onChange(this.state.selected)

			const formatter = (date) => {
				if (typeof this.props.inputFormatter === "function") return this.props.inputFormatter(date)

				let value = date.toLocaleDateString()
				if (this.props.showTimePicker) value = date.toLocaleString()

				return value
			}
			this.input.current.value = formatter(this.state.selected)
		})
	}

	renderTimeToggle = () => {
		if (!this.props.showTimePicker) return null;
		return (
			<button className={classNames("react-date-picker-button react-date-picker-time-toggle")} onClick={this.toggleTime}>
				{this.state.timePickerVisible ? <IconCalendar/> : <IconClock/>}
			</button>
		);
	}

	renderOverlay = () => {
		if (this.state.timePickerVisible) {
			if (!this.props.showTimePicker) return false;

			return (
				<>
					<div className={classNames("react-date-picker-body")}>
						<TimePickerComponent
							selected={this.state.selected}
							onChange={(date) => this.setSelected(date)}
						/>
					</div>
					<div className={classNames("react-date-picker-footer")}>
						{this.renderTimeToggle()}
					</div>
				</>
			);
		}

		switch (this.state.view) {
			case 'day': {
				if (this.props.selector !== "day" && this.props.selector !== "week") return null;

				const weeks = Helper.getMonthDetails(this.state.year, this.state.month);

				return (
					<>
						<div className={classNames("react-date-picker-head")}>
							<div className={classNames("react-date-picker-button react-date-picker-button-icon")} onClick={this.previous}>
								<IconArrowLeft/>
							</div>
							<div className={classNames("react-date-picker-selector")} onClick={() => this.setView('month')}>
								{this.state.month}/{this.state.year}
							</div>
							<div className={classNames("react-date-picker-button react-date-picker-button-icon")} onClick={this.next}>
								<IconArrowRight/>
							</div>
						</div>
						<div className={classNames("react-date-picker-body")}>
							<div className={classNames("react-date-picker-week-days")}>
								{Helper.dow.map((d, i) => <div key={i} className={classNames("react-date-picker-week-day")}>{d}</div>)}
							</div>
							<div className={classNames("react-date-picker-days")}>
								{weeks.map((week, index) => (
									<div key={index} className={classNames("react-date-picker-week", {
										selected: this.props.selector === "week" && this.isSelectedDay(week.days[0])
									})}>
										{week.days.map((day, index) => (
											<button
												className={classNames("react-date-picker-day", {
													disabled: day.disabled,
													selected: this.isSelectedDay(day),
													today: this.isTodayDay(day),
												})}
												key={index}
												onClick={this.onDayClick(day)}
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
							{this.renderTimeToggle()}
						</div>
					</>
				);
			}

			case 'month': {
				const months = Helper.months.map((month, index) => ({
					...month,
					date: new Date(this.state.year, month.month, 1),
				}));

				return (
					<>
						<div className={classNames("react-date-picker-head")}>
							<div className={classNames("react-date-picker-button react-date-picker-button-icon")} onClick={this.previous}>
								<IconArrowLeft/>
							</div>
							<div className={classNames("react-date-picker-selector")} onClick={() => this.setView('year')}>
								{this.state.year}
							</div>
							<div className={classNames("react-date-picker-button react-date-picker-button-icon")} onClick={this.next}>
								<IconArrowRight/>
							</div>
						</div>
						<div className={classNames("react-date-picker-body")}>
							<div className={classNames("react-date-picker-months")}>
								{months.map((month, index) => (
									<button
										className={classNames("react-date-picker-month", {
											disabled: month.disabled,
											selected: this.isSelectedMonth(month),
											today: this.isTodayMonth(month),
										})}
										key={index}
										onClick={this.onMonthClick(month)}
									>
										{month.name}
									</button>
								))}
							</div>
						</div>
						<div className={classNames("react-date-picker-footer")}>
							{this.renderTimeToggle()}
						</div>
					</>
				);
			}

			case 'year': {
				const years = [];
				for(let i=this.state.year-7; i<=this.state.year+7; i++) years.push({
					year: i,
					date: new Date(i, 0, 1),
				})

				return (
					<>
						<div className={classNames("react-date-picker-head")}>
							<div className={classNames("react-date-picker-button react-date-picker-button-icon")} onClick={this.previous}>
								<IconArrowLeft/>
							</div>
							<div className={classNames("react-date-picker-selector")} onClick={() => this.setView('year')}>
								{this.state.year}
							</div>
							<div className={classNames("react-date-picker-button react-date-picker-button-icon")} onClick={this.next}>
								<IconArrowRight/>
							</div>
						</div>
						<div className={classNames("react-date-picker-body")}>
							<div className={classNames("react-date-picker-months")}>
								{years.map((year, index) => (
									<button
										className={classNames("react-date-picker-month", {
											// disabled: year.disabled,
											selected: this.isSelectedYear(year),
											today: this.isTodayYear(year),
										})}
										key={index}
										onClick={this.onYearClick(year)}
									>
										{year.year}
									</button>
								))}
							</div>
						</div>
						<div className={classNames("react-date-picker-footer")}>
							{this.renderTimeToggle()}
						</div>
					</>
				);
			}
		}

		return null;
	}

	renderInput = () => {
		if (React.isValidElement(this.props.children)) {
			return React.cloneElement(this.props.children, {
				ref: this.input,
			});
		}

		return (
			<input
				ref={this.input}
				type="text"
			/>
		);
	}

	render() {
		return (
			<div
				ref={this.container}
				className={classNames("react-date-picker", `react-date-picker-selector-${this.props.selector}`)}
			>
				<div className={classNames("react-date-picker-input")} onClick={this.toggleVisibility}>
					{this.renderInput()}
				</div>
				<div
					ref={this.overlay}
					className={classNames("react-date-picker-overlay", `react-date-picker-mode-${this.state.view}`)}
					hidden={!this.state.visible}
				>
					{this.renderOverlay()}
				</div>
			</div>
		)
	}
}

Picker.defaultProps = {
	selector: 'month',
	showTimePicker: true,
};

let oneDay = 60 * 60 * 24 * 1000
let todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60)
let inputRef = React.createRef()
class MyDatePicker extends React.Component {

	state = {
		getMonthDetails: []
	}

	constructor() {
		super()
		let date = new Date()
		let year = date.getFullYear()
		let month = date.getMonth()
		this.state = {
			year,
			month,
			selectedDay: todayTimestamp,
			monthDetails: this.getMonthDetails(year, month)
		}
	}

	componentDidMount() {
		window.addEventListener('click', this.addBackDrop)
		this.setDateToInput(this.state.selectedDay)
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.addBackDrop)
	}

	addBackDrop = e => {
		if (this.state.showDatePicker && !ReactDOM.findDOMNode(this).contains(e.target)) {
			this.showDatePicker(false)
		}
	}

	showDatePicker = (showDatePicker = true) => {
		this.setState({ showDatePicker })
	}

	/**
	 *  Core
	 */

	daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

	getDayDetails = args => {
		let date = args.index - args.firstDay
		let day = args.index % 7
		let prevMonth = args.month - 1
		let prevYear = args.year
		if (prevMonth < 0) {
			prevMonth = 11
			prevYear--
		}
		let prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth)
		let _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1
		let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0
		let timestamp = new Date(args.year, args.month, _date).getTime()
		return {
			date: _date,
			day,
			month,
			timestamp,
			dayString: this.daysMap[day]
		}
	}

	getNumberOfDays = (year, month) => {
		return 40 - new Date(year, month, 40).getDate()
	}

	getMonthDetails = (year, month) => {
		let firstDay = (new Date(year, month)).getDay()
		let numberOfDays = this.getNumberOfDays(year, month)
		let monthArray = []
		let rows = 6
		let currentDay = null
		let index = 0
		let cols = 7

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				currentDay = this.getDayDetails({
					index,
					numberOfDays,
					firstDay,
					year,
					month
				})
				monthArray.push(currentDay)
				index++
			}
		}
		return monthArray
	}

	isCurrentDay = day => {
		return day.timestamp === todayTimestamp
	}

	isSelectedDay = day => {
		return day.timestamp === this.state.selectedDay
	}

	getDateFromDateString = dateValue => {
		let dateData = dateValue.split('-').map(d => parseInt(d, 10))
		if (dateData.length < 3)
			return null

		let year = dateData[0]
		let month = dateData[1]
		let date = dateData[2]
		return { year, month, date }
	}

	getMonthStr = month => this.monthMap[Math.max(Math.min(11, month), 0)] || 'Month'

	getDateStringFromTimestamp = timestamp => {
		let dateObject = new Date(timestamp)
		let month = dateObject.getMonth() + 1
		let date = dateObject.getDate()
		return dateObject.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
	}

	setDate = dateData => {
		let selectedDay = new Date(dateData.year, dateData.month - 1, dateData.date).getTime()
		this.setState({ selectedDay })
		if (this.props.onChange) {
			this.props.onChange(selectedDay)
		}
	}

	updateDateFromInput = () => {
		let dateValue = inputRef.current.value
		let dateData = this.getDateFromDateString(dateValue)
		if (dateData !== null) {
			this.setDate(dateData)
			this.setState({
				year: dateData.year,
				month: dateData.month - 1,
				monthDetails: this.getMonthDetails(dateData.year, dateData.month - 1)
			})
		}
	}

	setDateToInput = (timestamp) => {
		let dateString = this.getDateStringFromTimestamp(timestamp)
		inputRef.current.value = dateString
	}

	onDateClick = day => {
		this.setState({ selectedDay: day.timestamp }, () => this.setDateToInput(day.timestamp))
		if (this.props.onChange) {
			this.props.onChange(day.timestamp)
		}
	}

	setYear = offset => {
		let year = this.state.year + offset
		let month = this.state.month
		this.setState({
			year,
			monthDetails: this.getMonthDetails(year, month)
		})
	}

	setMonth = offset => {
		let year = this.state.year
		let month = this.state.month + offset
		if (month === -1) {
			month = 11
			year--
		} else if (month === 12) {
			month = 0
			year++
		}
		this.setState({
			year,
			month,
			monthDetails: this.getMonthDetails(year, month)
		})
	}

	/**
	 *  Renderers
	 */

	renderCalendar() {
		let days = this.state.monthDetails.map((day, index) => {
			return (
				<div className={'c-day-container ' + (day.month !== 0 ? ' disabled' : '') +
				(this.isCurrentDay(day) ? ' highlight' : '') + (this.isSelectedDay(day) ? ' highlight-green' : '')}
					 key={index}>
					<div className='cdc-day'>
                        <span onClick={() => this.onDateClick(day)}>
                            {day.date}
                        </span>
					</div>
				</div>
			)
		})

		return (
			<div className='c-container'>
				<div className='cc-head'>
					{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => <div key={i}
																						  className='cch-name'>{d}</div>)}
				</div>
				<div className='cc-body'>
					{days}
				</div>
			</div>
		)
	}

	render() {
		return (
			<div className='react-date-picker'>
				<div className='mdp-input' onClick={() => this.showDatePicker(true)}>
					<input type='date' onChange={this.updateDateFromInput} ref={inputRef} />
				</div>
				{JSON.stringify(this.state.showDatePicker)}
				{this.state.showDatePicker ? (
					<div className='mdp-container'>
						<div className='mdpc-head'>
							<div className='mdpch-button'>
								<div className='mdpchb-inner' onClick={() => this.setYear(-1)}>
									<span className='mdpchbi-left-arrows'></span>
								</div>
							</div>
							<div className='mdpch-button'>
								<div className='mdpchb-inner' onClick={() => this.setMonth(-1)}>
									<span className='mdpchbi-left-arrow'></span>
								</div>
							</div>
							<div className='mdpch-container'>
								<div className='mdpchc-year'>{this.state.year}</div>
								<div className='mdpchc-month'>{this.getMonthStr(this.state.month)}</div>
							</div>
							<div className='mdpch-button'>
								<div className='mdpchb-inner' onClick={() => this.setMonth(1)}>
									<span className='mdpchbi-right-arrow'></span>
								</div>
							</div>
							<div className='mdpch-button' onClick={() => this.setYear(1)}>
								<div className='mdpchb-inner'>
									<span className='mdpchbi-right-arrows'></span>
								</div>
							</div>
						</div>
						<div className='mdpc-body'>
							{this.renderCalendar()}
						</div>
					</div>
				) : ''}
			</div>
		)
	}

}


export default Picker