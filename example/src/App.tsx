import React from 'react'

import DateTimePicker, {DateTimePickerSelectorType} from 'react-datetime-pickers'
import 'react-datetime-pickers/dist/index.css'

import './App.scss'

const App = () => {
	const [selected, setSelected] = React.useState();
	const [selector, setSelector] = React.useState<DateTimePickerSelectorType>("day");
	const [showTimePicker, setShowTimePicker] = React.useState(true);
	const [logs, setLogs] = React.useState<string[]>([]);

	const handleDateChange = React.useCallback((date) => {
		console.debug('DatePicker', 'onChange', date);
		setSelected(date);
		setLogs((logs) => [`Date changed: ${date.toLocaleString()}`, ...logs])
	}, []);

	const handleSelectorChange = React.useCallback((e) => {
		setSelector(e.target.value);
	}, []);
	const handleShowTimePickerChange = React.useCallback((e) => {
		setShowTimePicker(!!e.target.checked);
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
					type={"checkbox"}
					checked={showTimePicker}
					onChange={handleShowTimePickerChange}
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
