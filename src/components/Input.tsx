import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';

interface InputProps {
	formatter?: (date?: Date, showTime?: boolean) => string,
	selected?: Date,
	timePicker?: boolean,
}

const Input = forwardRef<HTMLInputElement, InputProps & Omit<React.HTMLProps<HTMLInputElement>, keyof InputProps>>(({selected, children, timePicker, ...props}, ref) => {
	const input = useRef<HTMLInputElement>(null);

	// const value = useMemo(() => {
	// 	if (typeof props.formatter === 'function') return props.formatter(selected, timePicker)
	//
	// 	if (!selected) return;
	//
	// 	let value = selected.toLocaleDateString()
	// 	if (timePicker) value = selected.toLocaleString()
	//
	// 	return value
	// }, [selected, timePicker])

	useEffect(() => {
		if (input.current) {
			const formatter = (date?: Date): string => {
				if (typeof props.formatter === 'function') return props.formatter(date, timePicker)

				if (!date) return '';

				let value = date.toLocaleDateString()
				if (timePicker) value = date.toLocaleString()

				return value
			}

			const value = formatter(selected);
			input.current!.value = value
		}
	}, [selected, timePicker])

	if (React.isValidElement(children)) {
		return React.cloneElement(children, {
			ref: input,
			className: classNames(children.props.className, "react-datetime-pickers-input"),
			...props,
			// value,
		})
	}

	return (
		<input
			ref={input}
			type="text"
			className="react-datetime-pickers-input"
			{...props}
			// value={value}
		/>
	);
})

export default Input;
