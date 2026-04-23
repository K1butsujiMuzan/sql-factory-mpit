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
import { setDb } from '@/stores/db-store'
import Cookies from 'js-cookie'

const LinkForm = () => {
	const router = useRouter()

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting }
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
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})

			if (!response.ok) {
				return setError('dbType', { message: 'ошибка подключения к бд' })
			}

			const serverData: { id: string } | { error: string } =
				await response.json()

			if ('error' in serverData) {
				return setError('dbType', { message: serverData.error })
			}

			setDb(data)
			Cookies.set('db_id', serverData.id, { expires: 7, path: '/' })
			router.push(PAGES.CHAT(serverData.id))
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
			<div className={'flex gap-1 flex-col w-full'}>
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
				{!!errors.dbType?.message && (
					<ErrorMessage message={errors.dbType?.message} />
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
				disabled={isSubmitting}
				type={'submit'}
				className={
					'pt-1.5 pb-2 bg-accent text-white rounded-20 max-w-71.5 w-full disabled:cursor-not-allowed!'
				}
			>
				Войти
			</button>
		</form>
	)
}

export default LinkForm
