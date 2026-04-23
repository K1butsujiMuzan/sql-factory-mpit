interface Props {
	message: string
}

const ErrorMessage = ({ message }: Props) => {
	return (
		<small
			className={'text-xs leading-4 font-normal text-left text-error pl-3'}
			role={'alert'}
		>
			*{message}
		</small>
	)
}

export default ErrorMessage
