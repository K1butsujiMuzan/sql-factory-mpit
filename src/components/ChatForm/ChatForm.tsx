'use client'

import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@/components/Input/Input'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'
import { chatSchema, type TChat } from '@/shared/schemes/chat.schema'
import { getDbData } from '@/stores/db-store'
import { API } from '@/configs/api.config'
import { PAGES } from '@/configs/pages.config'
import { useRouter } from 'next/navigation'
import type { TPrompt } from '@/shared/types/prompt.type'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/configs/query-keys.config'
import { ERRORS } from '@/configs/errors.config'
import Loader from '@/components/Loader/Loader'

interface Props {
	dbId: string
}

const ChatForm = ({ dbId }: Props) => {
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting }
	} = useForm<TChat>({
		resolver: zodResolver(chatSchema),
		defaultValues: {
			text: ''
		},
		mode: 'onSubmit',
		reValidateMode: 'onSubmit'
	})

	const router = useRouter()

	const queryClient = useQueryClient()

	const onFormSubmit: SubmitHandler<TChat> = async (data) => {
		const dbData = getDbData()

		const formData = new URLSearchParams()

		formData.append('host', dbData.host)
		formData.append('port', dbData.port.toString())
		formData.append('user', dbData.user)
		formData.append('password', dbData.password)
		formData.append('database', dbData.dbName)
		formData.append('db_type', dbData.dbType)
		formData.append('prompt', data.text)

		try {
			const response = await fetch(API.CREATE_PROMPT, {
				method: 'POST',
				body: formData,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})

			if (!response.ok) {
				return setError('text', { message: ERRORS.SOMETHING_WENT_WRONG })
			}

			const serverData: TPrompt | { error: string } | { llm_error: string } =
				await response.json()

			if ('error' in serverData) {
				return setError('text', { message: serverData.error })
			}

			if ('llm_error' in serverData) {
				return setError('text', { message: serverData.llm_error })
			}
			await queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.ASIDE_HISTORY, dbId]
			})
			router.push(PAGES.CHAT(dbId, serverData.history_id.toString()))
		} catch (error) {
			console.error(error)
			setError('text', { message: ERRORS.SOMETHING_WENT_WRONG })
		}
	}

	return (
		<form
			className={'w-full flex flex-col gap-1'}
			onSubmit={handleSubmit(onFormSubmit)}
		>
			<div
				className={
					'shadow-md rounded-20 py-1.5 pl-3 pr-2.5 flex items-center w-full gap-2'
				}
			>
				<Controller
					render={({ field }) => (
						<Input
							autoComplete={'off'}
							type={'text'}
							{...field}
							label={'Введите ваш запрос'}
							inputId={'text'}
							className={'py-2.5'}
						/>
					)}
					name={'text'}
					control={control}
				/>
				<button
					disabled={isSubmitting}
					type={'submit'}
					className={
						'text-sm py-1.5 px-1.5 text-icon-dark bg-accent-light rounded-10 disabled:cursor-not-allowed! not-disabled:hover:bg-accent-light-hover not-disabled:active:bg-accent-light-hover duration-300'
					}
				>
					{!isSubmitting && (
						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.75 6.871V16H9.25V6.871L5.227 10.894L4.1665 9.8335L10 4L15.8335 9.8335L14.773 10.894L10.75 6.871Z"
								fill="#5C5C5C"
							/>
						</svg>
					)}
					{isSubmitting && <Loader className={'w-5'} />}
				</button>
			</div>
			{!!errors.text?.message && <ErrorMessage message={errors.text.message} />}
		</form>
	)
}

export default ChatForm
