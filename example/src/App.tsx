import React, { useCallback, useState } from 'react'

import DateTimePicker, {DateTimePickerSelectorType} from 'react-datetime-pickers'
import 'react-datetime-pickers/dist/index.css'

import './App.scss'

const App = () => {
	const [selected, setSelected] = useState();
	const [selector, setSelector] = useState<DateTimePickerSelectorType>("day");
	const [showTimePicker, setShowTimePicker] = useState(true);
	const [disabled, setDisabled] = useState(false);
	const [logs, setLogs] = useState<string[]>([]);

	const handleDateChange = useCallback((date) => {
		console.debug('DatePicker', 'onChange', date);
		setSelected(date);
		setLogs((logs) => [date ? `Date changed: ${date.toLocaleString()}` : `Date cleared`, ...logs])
	}, []);

	const handleSelectorChange = useCallback((e) => {
		setSelector(e.target.value);
	}, []);
	const handleShowTimePickerChange = useCallback((e) => {
		setShowTimePicker(!!e.target.checked);
	}, []);
	const handleDisabledChange = useCallback((e) => {
		setDisabled(!!e.target.checked);
	}, []);

	const minDate = new Date(2018, 2, 20);
	const maxDate = new Date(2021, 10, 15);

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
