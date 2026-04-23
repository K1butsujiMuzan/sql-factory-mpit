import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	label: string
	inputId: string
	className?: string
}

const Input = ({ label, inputId, className, ...rest }: Props) => {
	return (
		<>
			<label className={'sr-only'} htmlFor={inputId}>
				{label}
			</label>
			<input
				className={cn(
					'[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm placeholder:text-gray-light outline-none text-gray-light w-full',
					className
				)}
				placeholder={label}
				{...rest}
				id={inputId}
			/>
		</>
	)
}

export default Input
