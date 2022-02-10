import React, { useMemo, useState } from "react";
import {DateTimePicker, DateTimePickerSelectedType, DateTimePickerSelectorType} from "react-datetime-pickers"

export const Example1: React.VFC<React.HTMLProps<HTMLDivElement>> = ({...props}) => {
	const [selected, setSelected] = useState<DateTimePickerSelectedType>();
	const [selector, setSelector] = useState<DateTimePickerSelectorType>(DateTimePickerSelectorType.DAY);
	const [showTimePicker, setShowTimePicker] = useState(true);
	const [disabled, setDisabled] = useState(false);

	const handleDateChange = (date?: DateTimePickerSelectedType) => {
		console.debug("DatePicker", "onChange", date);
		setSelected(date);
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

		minDate.setDate(minDate.getDate() - 90)
		maxDate.setDate(maxDate.getDate() + 7)

		return {
			minDate,
			maxDate,
		}
	}, [])

	return (
		<div {...props}>
			<h1>Example</h1>
			<div className="mb-2">
				<label className="block">Selector</label>
				<select onChange={handleSelectorChange} value={selector}>
					<option value="day">Day</option>
					<option value="week">Week</option>
					<option value="month">Month</option>
					<option value="year">Year</option>
				</select>
			</div>
			<div className="mb-2">
				<input
					type="checkbox"
					id="checkbox-show-time-picker"
					checked={showTimePicker}
					onChange={handleShowTimePickerChange}
					className="mr-1"
				/>
				<label htmlFor="checkbox-show-time-picker">Show time picker</label>
			</div>
			<div className="mb-2">
				<input
					type="checkbox"
					id="checkbox-disabled"
					checked={disabled}
					onChange={handleDisabledChange}
					className="mr-1"
				/>
				<label htmlFor="checkbox-disabled">Disabled</label>
			</div>
			<div className="mb-2">
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
						url: "/data/disabled-dates.json"
					}}
					formatter={(date) => {
						if (date instanceof Date) return date.toISOString();
						if (date instanceof Array) return date.map((d) => d?.toISOString()).join(" - ");
						return "";
					}}
				/>
			</div>

			<pre>{JSON.stringify(selected)}</pre>
		</div>
	);
}