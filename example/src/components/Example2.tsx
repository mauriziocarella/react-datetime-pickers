import React, { useState } from "react";
import {TimePicker, DateTimePickerSelectedType} from "react-datetime-pickers"

export const Example2: React.VFC<React.HTMLProps<HTMLDivElement>> = ({...props}) => {
	const [selected, setSelected] = useState<DateTimePickerSelectedType>();

	const handleDateChange = (date?: DateTimePickerSelectedType) => {
		console.debug("TimePicker", "onChange", date);
		setSelected(date);
	};

	return (
		<div {...props}>
			<h1>Time Picker</h1>
			<div className="mb-2">
				<TimePicker
					selected={selected}
					onChange={handleDateChange}
				/>
			</div>

			<pre>{JSON.stringify(selected)}</pre>
		</div>
	)
}
