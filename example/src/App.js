import React from 'react'

import Picker from 'react-date-pickers'
import 'react-date-pickers/dist/index.css'

import './App.css'


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
				<Picker
					selected={selected}
					selector={selector}
					showTimePicker={showTimePicker}
					onChange={handleDateChange}
				>
					<input type={"text"}/>
				</Picker>
			</div>

			<pre
				style={{
					position: 'absolute',
					top: 0,
					right: 0,
					margin: 16,
				}}
			>
				{logs.join("\n")}
			</pre>
		</>
	);
}

export default App
