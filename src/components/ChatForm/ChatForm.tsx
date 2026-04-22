'use client'

import {Controller, type SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Input from "@/components/Input/Input";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import {chatSchema, type TChat} from "@/shared/schemes/chat.schema";

const ChatForm = () => {
  const {control, handleSubmit, formState: {errors, isSubmitting, isValid}} = useForm<TChat>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      text: ''
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const onFormSubmit: SubmitHandler<TChat> = (data) => {
    console.log(data)
  }

  return (
    <form className={'w-full flex flex-col gap-1'} onSubmit={handleSubmit(onFormSubmit)}>
      <div className={'border border-gray-400 rounded-20 py-1.5 pl-3 pr-2.5 flex items-center w-full gap-2'}>
        <Controller
          render={({field}) => (
            <Input
              autoComplete={'off'}
              type={'text'}
              {...field}
              label={'Введите ваш запрос'}
              inputId={'text'}
            />
          )}
          name={'text'}
          control={control}
        />
        <button
          type={'submit'}
          className={'text-sm py-1.5 px-1.5 bg-gray-300 rounded-full'}
        >
          <svg
            role={'img'}
            aria-hidden={true}
            className={'text-dark'}
            width="14" height="14" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.86124 4.26143C11.4223 5.04197 12.2028 5.43257 12.2028 6.0506C12.2025 6.66831 11.4223 7.05888 9.86193 7.83908L4.0283 10.7559C1.80992 11.8651 0.700724 12.4192 0.191004 11.9098C-0.318637 11.4001 0.235625 10.291 1.34489 8.07248L1.85657 7.0498L7.2821 7.05049C7.83412 7.05035 8.28176 6.6026 8.28199 6.0506C8.28199 5.49841 7.83426 5.05085 7.2821 5.05071L1.85657 5.05002L1.34558 4.02803C0.236475 1.80982 -0.31883 0.700516 0.190314 0.190729C0.699929 -0.318886 1.80932 0.235464 4.02761 1.34461L9.86124 4.26143Z" fill="#222222"/>
          </svg>
        </button>
      </div>
      {!!errors.text?.message && (
        <ErrorMessage message={errors.text.message} />
      )}
    </form>
  )
}

export default ChatForm