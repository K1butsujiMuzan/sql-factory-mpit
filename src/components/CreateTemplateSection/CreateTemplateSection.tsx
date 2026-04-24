'use client'

import { type ChangeEvent, useState } from 'react'
import Input from '@/components/Input/Input'
import ReactCodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import BackLink from '@/components/CreateTemplateSection/BackLink'
import { CHART_SELECT, type TChartType } from '@/constants/chart-types'
import Select from '@/components/Select/Select'
import TemplateButton from '@/components/CreateTemplateSection/TemplateButton'
import { ERRORS } from '@/configs/errors.config'
import { API } from '@/configs/api.config'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/configs/query-keys.config'
import { useRouter } from 'next/navigation'
import { PAGES } from '@/configs/pages.config'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'
import type { TOperationType } from '@/components/CreateTemplateSection/operation-type.type'

interface Props {
	dbId: string
}

const CreateTemplateSection = ({ dbId }: Props) => {
	const [title, setTitle] = useState<string>('')
	const [code, setCode] = useState<string>('')
	const [chartType, setChartType] = useState<TChartType>('none')
	const [error, setError] = useState<string>('')
	const [loadingType, setLoadingType] = useState<TOperationType>('none')

	const queryClient = useQueryClient()
	const router = useRouter()

	const onStart = async () => {
		setError('')

		if (title.length < 1) {
			return setError('название обязательно')
		}

		if (code.length < 1) {
			return setError('код sql обязателен')
		}

		try {
			setLoadingType('start')
			const response = await fetch(API.CREATE_TEMPLATE, {
				method: 'POST',
				body: JSON.stringify({
					db: dbId,
					title,
					query: code,
					chart_type: chartType
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (!response.ok) {
				return setError(ERRORS.SOMETHING_WENT_WRONG)
			}

			const data: { error: string } | { id: number } = await response.json()

			if ('error' in data) {
				return setError(data.error)
			}

			await queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.ASIDE_TEMPLATES, dbId]
			})
			router.push(PAGES.TEMPLATE(dbId, data.id.toString()))
		} catch (error) {
			console.error(error)
			setError(ERRORS.SOMETHING_WENT_WRONG)
		} finally {
			setLoadingType('none')
		}
	}

	const onSave = async () => {
		console.log('Сохранение черновика (пока не реализовано)')
	}

	const onDelete = async () => {
		console.log('Удаление (пока не реализовано)')
	}

	return (
		<div
			className={
				'flex items-center flex-col gap-5 w-full max-w-370 mx-auto p-5'
			}
		>
			<div className={'relative w-full flex justify-center'}>
				<BackLink dbId={dbId} />
				<div
					className={
						'border-1 border-gray-main rounded-20 px-3 py-2.5 flex items-center w-full max-w-79'
					}
				>
					<Input
						className={'text-center'}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setTitle(event.target.value)
						}
						value={title}
						label={'Введите название'}
						inputId={'template-id'}
					/>
				</div>
			</div>
			<div className={'flex flex-col w-full gap-1'}>
				<div className={'flex justify-between gap-2 w-full'}>
					<div className={'flex gap-5 items-center w-full'}>
						<TemplateButton
							loadingType={loadingType}
							type={'start'}
							onClick={onStart}
						/>
						<Select
							list={CHART_SELECT}
							selectId={'chart-type'}
							selectLabel={'Chart type'}
							className={'max-w-35'}
							selectClassName={'py-1'}
							onChange={(e: ChangeEvent<HTMLSelectElement>) =>
								setChartType(e.target.value as TChartType)
							}
						/>
					</div>
					<div className={'flex gap-2.5 items-center'}>
						<TemplateButton
							loadingType={loadingType}
							type={'save'}
							onClick={onSave}
						/>
						<TemplateButton
							loadingType={loadingType}
							type={'delete'}
							onClick={onDelete}
						/>
					</div>
				</div>
				{error.length > 0 && <ErrorMessage message={error} className={'p-0'} />}
			</div>
			<ReactCodeMirror
				className={
					'flex-1 bg-white rounded-20 border-1 border-gray-100 overflow-auto w-full'
				}
				value={code}
				extensions={[sql()]}
				theme={'light'}
				height={'100%'}
				onChange={(value: string) => setCode(value)}
			/>
		</div>
	)
}

export default CreateTemplateSection
