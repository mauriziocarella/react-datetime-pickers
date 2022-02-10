import React, {forwardRef, useEffect, useRef} from "react";
import classNames from "classnames";
import {mergeRefs} from "../helper/utils";

interface InputProps {
	formatter?: (date?: Date, showTime?: boolean) => string,
	selected?: Date,
	timePicker?: boolean,
}

const Input = forwardRef<HTMLInputElement, InputProps & Omit<React.HTMLProps<HTMLInputElement>, keyof InputProps>>(({selected, children, timePicker, formatter, ...props}, ref) => {
	const innerRef = useRef<HTMLInputElement>(null);

	const mergedRef = mergeRefs([innerRef, ref])

	useEffect(() => {
		if (innerRef.current) {
			const formatValue = (date?: Date): string => {
				if (typeof formatter === "function") return formatter(date, timePicker)

				if (!date) return "";

				let value = date.toLocaleDateString()
				if (timePicker) value = date.toLocaleString()

				return value
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
