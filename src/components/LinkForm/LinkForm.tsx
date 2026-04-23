'use client'

import Input from '@/components/Input/Input'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { dbLinkSchema, type TDbLink } from '@/shared/schemes/db-link.schema'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'
import { useRouter } from 'next/navigation'
import { PAGES } from '@/configs/pages.config'
import Select from '@/components/Select/Select'
import { linkFormData } from '@/components/LinkForm/link-form.data'
import { API } from '@/configs/api.config'
import Logo from '@/components/Logo/Logo'

const LinkForm = () => {
	const router = useRouter()

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting, isValid }
	} = useForm<TDbLink>({
		resolver: zodResolver(dbLinkSchema),
		defaultValues: {
			host: '',
			port: 1,
			user: '',
			password: '',
			dbName: '',
			dbType: 'postgres'
		},
		mode: 'onSubmit',
		reValidateMode: 'onSubmit'
	})

	const onFormSubmit: SubmitHandler<TDbLink> = async (data) => {
		if (!isValid) {
			return
		}

		const formData = new URLSearchParams()

		formData.append('host', data.host)
		formData.append('port', data.port.toString())
		formData.append('user', data.user)
		formData.append('password', data.password)
		formData.append('database', data.dbName)
		formData.append('db_type', data.dbType)

		try {
			const response = await fetch(API.GET_DB_ID, {
				method: 'POST',
				body: formData,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzIjoxNzc2OTQ0NzI5LCJpZCI6MX0.CB7Z7gm06MRsmCSFJ49Aat27sUsTqb_cYNipI-v_TRRepi11XeA1MyqPVZ8ffAahNEkomgQ3w3ENJeY7PgiGyA`
				}
			})

			if (!response.ok) {
				setError('dbType', { message: 'ошибка подключения к бд' })
				return
			}

			const serverData: { id: string } | { error: string } =
				await response.json()

			if ('error' in serverData) {
				setError('dbType', { message: serverData.error })
				return
			}

			console.log(serverData)
		} catch (error) {
			console.error(error)
			setError('dbType', { message: 'что-то пошло не так...' })
		}
	}

	return (
		<form
			className={'w-full flex flex-col gap-7.5 items-center'}
			onSubmit={handleSubmit(onFormSubmit)}
		>
			<Controller
				render={({ field }) => (
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
			<div className={'flex gap-1 flex-col w-full'}>
				<div
					className={
						'border-1 border-gray-main rounded-20 px-3 py-2.5 flex items-center'
					}
				>
					<Controller
						render={({ field }) => (
							<Input type={'text'} {...field} label={'Host'} inputId={'host'} />
						)}
						name={'host'}
						control={control}
					/>
				</div>
				{!!errors.host?.message && (
					<ErrorMessage message={errors.host.message} />
				)}
			</div>
			<div className={'flex gap-1 flex-col w-full'}>
				<div
					className={
						'border-1 border-gray-main rounded-20 px-3 py-2.5 flex items-center'
					}
				>
					<Controller
						render={({ field }) => (
							<Input
								type={'number'}
								{...field}
								onChange={(event) => field.onChange(Number(event.target.value))}
								label={'Port'}
								inputId={'port'}
							/>
						)}
						name={'port'}
						control={control}
					/>
				</div>
				{!!errors.port?.message && (
					<ErrorMessage message={errors.port.message} />
				)}
			</div>
			<div className={'flex gap-1 flex-col w-full'}>
				<div
					className={
						'border-1 border-gray-main rounded-20 px-3 py-2.5 flex items-center'
					}
				>
					<Controller
						render={({ field }) => (
							<Input type={'text'} {...field} label={'User'} inputId={'user'} />
						)}
						name={'user'}
						control={control}
					/>
				</div>
				{!!errors.user?.message && (
					<ErrorMessage message={errors.user.message} />
				)}
			</div>
			<div className={'flex gap-1 flex-col w-full'}>
				<div
					className={
						'border-1 border-gray-main rounded-20 px-3 py-2.5 flex items-center'
					}
				>
					<Controller
						render={({ field }) => (
							<Input
								type={'text'}
								{...field}
								label={'Пароль'}
								inputId={'password'}
							/>
						)}
						name={'password'}
						control={control}
					/>
				</div>
				{!!errors.password?.message && (
					<ErrorMessage message={errors.password.message} />
				)}
			</div>
			<div className={'flex gap-1 flex-col w-full'}>
				<div
					className={
						'border-1 border-gray-main rounded-20 px-3 py-2.5 flex items-center'
					}
				>
					<Controller
						render={({ field }) => (
							<Input
								type={'text'}
								{...field}
								label={'Имя базы данных'}
								inputId={'db-name'}
							/>
						)}
						name={'dbName'}
						control={control}
					/>
				</div>
				{!!errors.dbName?.message && (
					<ErrorMessage message={errors.dbName.message} />
				)}
			</div>
			<button
				type={'submit'}
				className={
					'pt-1.5 pb-2 bg-accent text-white rounded-20 max-w-71.5 w-full'
				}
			>
				Войти
			</button>
		</form>
	)
}

export default LinkForm
