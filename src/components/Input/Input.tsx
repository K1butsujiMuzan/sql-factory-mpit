import type {InputHTMLAttributes} from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string,
  inputId: string
}

const Input = ({label, inputId, ...rest}: Props) => {
  return (
    <>
      <label className={'sr-only'} htmlFor={inputId}>{label}</label>
      <input
        className={'text-sm placeholder:text-black outline-none w-full'}
        placeholder={label}
        {...rest}
        id={inputId}
        type="text"
      />
    </>
  )
}

export default Input