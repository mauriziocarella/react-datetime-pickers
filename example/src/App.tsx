import React, {useMemo, useState} from 'react'

import {DateTimePicker, DateTimePickerSelectorType} from 'react-datetime-pickers'
import 'react-datetime-pickers/dist/index.css'

import './App.scss'

const App: React.VFC = () => {
	const [selected, setSelected] = useState<Date>();
	const [selector, setSelector] = useState<DateTimePickerSelectorType>(DateTimePickerSelectorType.MONTH);
	const [showTimePicker, setShowTimePicker] = useState(true);
	const [disabled, setDisabled] = useState(false);
	const [logs, setLogs] = useState<string[]>([]);

	const handleDateChange = (date?: Date) => {
		console.debug('DatePicker', 'onChange', date);
		setSelected(date);
		setLogs((logs) => [date ? `Date changed: ${date.toLocaleString()}` : `Date cleared`, ...logs])
	};

	const handleSelectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelector(e.target.value as DateTimePickerSelectorType);
	};
	const handleShowTimePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShowTimePicker(e.target.checked);
	};
	const handleDisabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDisabled(e.target.checked);
	};

	const {minDate, maxDate} = useMemo(() => {
		const minDate = new Date();
		const maxDate = new Date();

		minDate.setDate(minDate.getDate() - 40)
		maxDate.setDate(maxDate.getDate() + 7)

		return {
			minDate,
			maxDate,
		}
	}, [])

	return (
		<>
			<div>
				<label>Selector</label>
				<select onChange={handleSelectorChange} value={selector}>
					<option value="day">Day</option>
					<option value="week">Week</option>
					<option value="month">Month</option>
					<option value="year">Year</option>
				</select>
			</div>
			<div>
				<label>Show time picker</label>
				<input
					type="checkbox"
					checked={showTimePicker}
					onChange={handleShowTimePickerChange}
				/>
			</div>
			<div>
				<label>Disabled</label>
				<input
					type="checkbox"
					checked={disabled}
					onChange={handleDisabledChange}
				/>
			</div>
			<div>
				<DateTimePicker
					selected={selected}
					selector={selector}
					timePicker={showTimePicker}
					onChange={handleDateChange}
					maxDate={maxDate}
					minDate={minDate}
					timeStep={600}
					disabled={disabled}
					disabledDates={{
						url: '/data/disabled-dates.json'
					}}
				/>
			</div>

			<pre>{JSON.stringify(selected)}</pre>

			<pre style={{display: 'none'}}>
				{logs.join("\n")}
			</pre>
		</>
	);
}

export default App
