import React, {forwardRef, useEffect, useRef} from 'react';
import classNames from 'classnames';

interface InputProps {
	formatter?: (date?: Date, showTime?: boolean) => string,
	selected?: Date,
	timePicker?: boolean,
}

const Input = forwardRef<HTMLInputElement, InputProps & Omit<React.HTMLProps<HTMLInputElement>, keyof InputProps>>(({selected, children, timePicker, formatter, ...props}) => {
	const input = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (input.current) {
			const formatValue = (date?: Date): string => {
				if (typeof formatter === 'function') return formatter(date, timePicker)

				if (!date) return '';

				let value = date.toLocaleDateString()
				if (timePicker) value = date.toLocaleString()

				return value
			}

			if (input.current) {
				input.current.value = formatValue(selected)
			}
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
