import React, { useMemo, useState } from "react";
import { DateTimePicker, DateTimePickerSelectedType, DateTimePickerSelectorType } from "react-datetime-pickers";

export const Example3: React.VFC<React.HTMLProps<HTMLDivElement>> = ({...props}) => {
	const [selected, setSelected] = useState<DateTimePickerSelectedType>();

	const handleDateChange = (date?: DateTimePickerSelectedType) => {
		console.debug("RangeDateTimePicker", "onChange", date);
		setSelected(date);
	};

	const {minDate, maxDate} = useMemo(() => {
		const minDate = new Date();
		const maxDate = new Date();

		minDate.setDate(minDate.getDate() - 90)
		maxDate.setDate(maxDate.getDate() + 60)

		return {
			minDate,
			maxDate,
		}
	}, [])

	return (
		<div {...props}>
			<h1>Range Picker</h1>

			<div className="mb-2">
				<DateTimePicker
					selected={selected}
					selector={DateTimePickerSelectorType.DAY_RANGE}
					onChange={handleDateChange}
					minDate={minDate}
					maxDate={maxDate}
				/>
			</div>

			<pre>{JSON.stringify(selected)}</pre>
		</div>
	)
}