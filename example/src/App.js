import React from 'react'

import DateTimePicker from 'react-datetime-pickers'
import 'react-datetime-pickers/dist/index.css'

import './App.scss'

const App = () => {
	const [selected, setSelected] = React.useState(new Date());
	const [selector, setSelector] = React.useState("day");
	const [showTimePicker, setShowTimePicker] = React.useState(true);
	const [logs, setLogs] = React.useState([]);

	const handleDateChange = React.useCallback((date) => {
		setSelected(date);
		setLogs((logs) => [`Date changed: ${date.toLocaleString()}`, ...logs])
	}, []);

	const handleSelectorChange = React.useCallback((e) => {
		setSelector(e.target.value);
	}, []);
	const handleShowTimePickerChange = React.useCallback((e) => {
		setShowTimePicker(!!e.target.checked);
	}, []);

	return (
		<>
			<div>
				<label>Selector</label>
				<select onChange={handleSelectorChange} value={selector}>
					<option value={"day"}>Day</option>
					<option value={"week"}>Week</option>
					<option value={"month"}>Month</option>
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
					showTimePicker={showTimePicker}
					onChange={handleDateChange}
				/>
			</div>

			<pre style={{display: 'none'}}>
				{logs.join("\n")}
			</pre>
		</>
	);
}

export default App
