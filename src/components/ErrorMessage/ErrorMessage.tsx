interface Props {
  message: string
}

const ErrorMessage = ({message}: Props) => {
  return (
    <small
      className={'text-xs leading-4 font-semibold text-red-700 text-left pl-3'}
      role={'alert'}
    >
      *{message}
    </small>
  )
}

export default ErrorMessage