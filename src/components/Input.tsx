import React, {forwardRef, useEffect, useRef} from "react";
import classNames from "classnames";
import {mergeRefs} from "../helper/utils";
import { DateTimePickerSelectedType } from "../index";

export type DateTimePickerInputProps = Omit<React.HTMLProps<HTMLInputElement>, keyof InputComponentProps> & {
	formatter?: (date?: DateTimePickerSelectedType | null, showTime?: boolean) => string,
}

type InputComponentProps = {
	selected?: DateTimePickerSelectedType | null,
	timePicker?: boolean,
}
const Input = forwardRef<HTMLInputElement, DateTimePickerInputProps & InputComponentProps >(({selected, children, timePicker, formatter, ...props}, ref) => {
	const innerRef = useRef<HTMLInputElement>(null);

	const mergedRef = mergeRefs([innerRef, ref])

	useEffect(() => {
		if (innerRef.current) {
			const formatValue = (date?: DateTimePickerSelectedType | null): string => {
				if (typeof formatter === "function") return formatter(date, timePicker)

				if (!date) return "";

				if (date instanceof Date) {
					let value = date.toLocaleDateString()
					if (timePicker) value = date.toLocaleString()

					return value
				}
				else if (date instanceof Array) {
					return date
						.reduce((arr: string[], d) => {
							if (d) {
								let value = d.toLocaleDateString()
								if (timePicker) value = d.toLocaleString()

								arr.push(value)
							}

							return arr
						}, [])
						.join(" - ")
				}

				return ""
			}

			if (innerRef.current) {
				innerRef.current.value = formatValue(selected)
			}
		}
	}, [selected, timePicker])

	if (React.isValidElement(children)) {
		return React.cloneElement(children, {
			ref: mergedRef,
			className: classNames(children.props.className, "react-datetime-pickers-input"),
			...props,
			// value,
		})
	}

	return (
		<input
			ref={mergedRef}
			type="text"
			className="react-datetime-pickers-input"
			{...props}
			// value={value}
		/>
	);
})

export default Input;
