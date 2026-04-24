import { cn } from '@/lib/cn'

interface Props {
	message: string
	className?: string
}

const ErrorMessage = ({ message, className }: Props) => {
	return (
		<small
			className={cn(
				'text-xs leading-4 font-normal text-left text-error pl-3',
				className
			)}
			role={'alert'}
		>
			*{message}
		</small>
	)
}

export default ErrorMessage
