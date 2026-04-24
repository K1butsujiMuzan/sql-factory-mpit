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
					'border border-gray-main rounded-20 py-1.5 pl-3 pr-2.5 flex items-center w-full gap-2'
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
						/>
					)}
					name={'text'}
					control={control}
				/>
				<button
					disabled={isSubmitting}
					type={'submit'}
					className={
						'text-sm py-1.5 px-1.5 text-icon-dark bg-accent-light rounded-full disabled:cursor-not-allowed!'
					}
				>
					{!isSubmitting && (
						<svg
							role={'img'}
							aria-hidden={true}
							className={''}
							width="14"
							height="14"
							viewBox="0 0 13 13"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M9.86124 4.26143C11.4223 5.04197 12.2028 5.43257 12.2028 6.0506C12.2025 6.66831 11.4223 7.05888 9.86193 7.83908L4.0283 10.7559C1.80992 11.8651 0.700724 12.4192 0.191004 11.9098C-0.318637 11.4001 0.235625 10.291 1.34489 8.07248L1.85657 7.0498L7.2821 7.05049C7.83412 7.05035 8.28176 6.6026 8.28199 6.0506C8.28199 5.49841 7.83426 5.05085 7.2821 5.05071L1.85657 5.05002L1.34558 4.02803C0.236475 1.80982 -0.31883 0.700516 0.190314 0.190729C0.699929 -0.318886 1.80932 0.235464 4.02761 1.34461L9.86124 4.26143Z"
								fill="#222222"
							/>
						</svg>
					)}
					{isSubmitting && <Loader className={'w-3.5'} />}
				</button>
			</div>
			{!!errors.text?.message && <ErrorMessage message={errors.text.message} />}
		</form>
	)
}

export default ChatForm
