'use client'

import Input from '@/components/Input/Input'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { dbLinkSchema, type TDbLink } from '@/shared/schemes/db-link.schema'
import { z } from 'zod'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'
import { useRouter } from 'next/navigation'
import { PAGES } from '@/configs/pages.config'
import Select from '@/components/Select/Select'
import { linkFormData } from '@/components/LinkForm/link-form.data'
import { API } from '@/configs/api.config'
import { setDb } from '@/stores/db-store'
import Cookies from 'js-cookie'
import { COOKIES } from '@/configs/cookies.config'
import { ERRORS } from '@/configs/errors.config'
import Loader from '@/components/Loader/Loader'

const linkFormSchema = z.object({
	host: z.string().min(1, { message: 'Хост обязателен' }),
	port: z
		.string()
		.min(1, { message: 'Порт обязателен' })
		.refine((value) => /^\d+$/.test(value), {
			message: 'Порт должен быть числом'
		})
		.refine(
			(value) => {
				const port = Number(value)
				return Number.isInteger(port) && port >= 1 && port <= 65535
			},
			{ message: 'Порт должен быть в диапазоне 1-65535' }
		),
	user: z.string().min(1, { message: 'Имя пользователя обязательно' }),
	password: z.string().min(1, { message: 'Пароль обязателен' }),
	dbName: z.string().min(1, { message: 'Имя базы данных обязательно' }),
	dbType: z.enum(['postgres', 'mysql'])
})

type TLinkForm = z.infer<typeof linkFormSchema>

const LinkForm = () => {
	const router = useRouter()

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting }
	} = useForm<TLinkForm>({
		resolver: zodResolver(linkFormSchema),
		defaultValues: {
			host: '',
			port: '',
			user: '',
			password: '',
			dbName: '',
			dbType: 'postgres'
		},
		mode: 'onSubmit',
		reValidateMode: 'onSubmit'
	})

	const onFormSubmit: SubmitHandler<TLinkForm> = async (data) => {
		const parsed = dbLinkSchema.safeParse({
			...data,
			port: Number(data.port)
		})
		if (!parsed.success) {
			const msg = parsed.error.flatten().fieldErrors.port?.[0]
			if (msg) {
				return setError('port', { message: msg })
			}
			return setError('dbType', { message: ERRORS.SOMETHING_WENT_WRONG })
		}
		const validData: TDbLink = parsed.data

		const formData = new URLSearchParams()

		formData.append('host', validData.host)
		formData.append('port', validData.port.toString())
		formData.append('user', validData.user)
		formData.append('password', validData.password)
		formData.append('database', validData.dbName)
		formData.append('db_type', validData.dbType)

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

			setDb(validData)
			Cookies.set(COOKIES.DB_ID, serverData.id, { expires: 7, path: '/' })
			router.push(PAGES.CHAT(serverData.id))
		} catch (error) {
			console.error(error)
			setError('dbType', { message: ERRORS.SOMETHING_WENT_WRONG })
		}
	}

	return (
		<form
			className={'w-full flex flex-col gap-5 items-center'}
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
								type={'text'}
								inputMode={'numeric'}
								pattern={'[0-9]*'}
								{...field}
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
					'flex gap-2 justify-center pt-1.5 pb-2 bg-accent not-disabled:hover:bg-gray-main text-white rounded-20 max-w-71.5 w-full disabled:cursor-not-allowed! transition duration-300'
				}
			>
				{isSubmitting ? <Loader className={'w-4 text-white'} /> : 'Войти'}
			</button>
		</form>
	)
}

export default LinkForm
