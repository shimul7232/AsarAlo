import React from 'react'
import './Input.css'

/**
 * Reusable Input component
 * props:
 * - label: optional label text
 * - type: input type (text, email, password, number, file, etc.)
 * - size: 'sm' | 'md' | 'lg' (controls padding/font-size)
 * - value, onChange, placeholder, name, className
 */
function Input({
	label,
	type = 'text',
	size = 'md',
	value,
	onChange,
	placeholder,
	name,
	className = '',
	...rest
}) {
	const sizeClass = `input-${size}`

	return (
		<div className={`input-wrap ${className}`}>
			{label && <label className="input-label">{label}</label>}
			<input
				className={`input-base ${sizeClass}`}
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				name={name}
				{...rest}
			/>
		</div>
	)
}

export default Input

