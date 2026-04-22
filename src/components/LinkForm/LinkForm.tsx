'use client'

import Input from "@/components/Input/Input";
import {Controller, type SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  dbLinkSchema,
  type TDbLink
} from "@/shared/schemes/db-link.schema";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import {useRouter} from "next/navigation";
import {PAGES} from "@/configs/pages.config";
import Select from "@/components/Select/Select";
import {linkFormData} from "@/components/LinkForm/link-form.data";

const LinkForm = () => {
  const router = useRouter()

  const {control, handleSubmit, formState: {errors, isSubmitting, isValid}} = useForm<TDbLink>({
    resolver: zodResolver(dbLinkSchema),
    defaultValues: {
      link: '',
      dbType: 'postgresql'
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const onFormSubmit: SubmitHandler<TDbLink> = (data) => {
    if(!isValid) {
      return
    }
    router.push(PAGES.CHAT())
    console.log(data)
  }

  return (
    <form className={'w-full flex flex-col gap-3 items-center'} onSubmit={handleSubmit(onFormSubmit)}>
      <div className={'flex gap-1 flex-col w-full'}>
        <div className={'border-1 border-gray-400 rounded-20 px-3 py-2.5 flex items-center'}>
          <Controller
            render={({field}) => (
              <Input
                type={'text'}
                {...field}
                label={'Введите ссылку'}
                inputId={'link'}
              />
            )}
            name={'link'}
            control={control}
          />
        </div>
        {!!errors.link?.message && (
          <ErrorMessage message={errors.link.message} />
        )}
      </div>
      <Controller
        render={({field}) => (
          <Select
            list={linkFormData}
            {...field}
            selectId={'db-type'}
            selectLabel={'Тип базы данных'}
          />
        )}
        name={'dbType'}
        control={control}
      />
      <button
        type={'submit'}
        className={'pt-1.5 pb-2 bg-gray-300 rounded-20 max-w-71.5 w-full mt-4.5'}
      >
        Продолжить
      </button>
    </form>
  )
}

export default LinkForm