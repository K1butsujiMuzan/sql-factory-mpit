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
import { getDbData } from '@/stores/db-store'

interface Props {
	dbId: string
	initialTitle?: string
	initialQuery?: string
	initialChartType?: string
	templateId?: number
}

const CreateTemplateSection = ({
	dbId,
	initialTitle,
	initialQuery,
	initialChartType,
	templateId: initialTemplateId
}: Props) => {
	const [title, setTitle] = useState<string>(initialTitle ?? '')
	const [code, setCode] = useState<string>(initialQuery ?? '')
	const [chartType, setChartType] = useState<TChartType>(
		(initialChartType as TChartType) ?? 'none'
	)
	const [error, setError] = useState<string>('')
	const [loadingType, setLoadingType] = useState<null | TOperationType>(null)
	const [templateId, setTemplateId] = useState<number | null>(
		initialTemplateId ?? null
	)
	const [saveSuccess, setSaveSuccess] = useState(false)

	const queryClient = useQueryClient()
	const router = useRouter()

	const saveOrUpdateTemplate = async (): Promise<number> => {
		if (templateId) {
			const response = await fetch(API.UPDATE_TEMPLATE, {
				method: 'PUT',
				body: JSON.stringify({
					id: templateId,
					db: dbId,
					title,
					query: code,
					chart_type: chartType
				}),
				headers: { 'Content-Type': 'application/json' }
			})
			if (!response.ok) throw new Error(ERRORS.SOMETHING_WENT_WRONG)
			return templateId
		} else {
			const response = await fetch(API.CREATE_TEMPLATE, {
				method: 'POST',
				body: JSON.stringify({
					db: dbId,
					title,
					query: code,
					chart_type: chartType
				}),
				headers: { 'Content-Type': 'application/json' }
			})
			if (!response.ok) throw new Error(ERRORS.SOMETHING_WENT_WRONG)
			const data: { error: string } | { id: number } = await response.json()
			if ('error' in data) throw new Error(data.error)
			return data.id
		}
	}

	const handleSave = async () => {
		setError('')
		setSaveSuccess(false)
		if (title.length < 1) return setError('название обязательно')
		if (code.length < 1) return setError('код sql обязателен')

		try {
			setLoadingType('save')
			const id = await saveOrUpdateTemplate()
			setTemplateId(id)
			setSaveSuccess(true)
			await queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.ASIDE_TEMPLATES, dbId]
			})
		} catch (err: unknown) {
			const msg =
				err instanceof Error ? err.message : ERRORS.SOMETHING_WENT_WRONG
			setError(msg)
		} finally {
			setLoadingType(null)
		}
	}

	const handleRun = async () => {
		setError('')
		setSaveSuccess(false)
		if (title.length < 1) return setError('название обязательно')
		if (code.length < 1) return setError('код sql обязателен')

		let currentTemplateId = templateId

		if (!currentTemplateId) {
			try {
				setLoadingType('save')
				currentTemplateId = await saveOrUpdateTemplate()
				setTemplateId(currentTemplateId)
				await queryClient.invalidateQueries({
					queryKey: [QUERY_KEYS.ASIDE_TEMPLATES, dbId]
				})
			} catch (err: unknown) {
				const msg =
					err instanceof Error ? err.message : ERRORS.SOMETHING_WENT_WRONG
				setError(msg)
				setLoadingType(null)
				return
			}
		} else {
			try {
				setLoadingType('save')
				await saveOrUpdateTemplate()
			} catch (err: unknown) {
				const msg =
					err instanceof Error ? err.message : ERRORS.SOMETHING_WENT_WRONG
				setError(msg)
				setLoadingType(null)
				return
			}
		}

		try {
			setLoadingType('run')
			const dbData = getDbData()
			const formData = new URLSearchParams()
			formData.append('host', dbData.host)
			formData.append('port', dbData.port.toString())
			formData.append('user', dbData.user)
			formData.append('password', dbData.password)
			formData.append('database', dbData.dbName)
			formData.append('db_type', dbData.dbType)
			formData.append('template_id', currentTemplateId!.toString())

			const response = await fetch(API.RUN_TEMPLATE, {
				method: 'POST',
				body: formData,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			})

			if (!response.ok) throw new Error(ERRORS.SOMETHING_WENT_WRONG)

			const result = await response.json()

			if (result.error) throw new Error(result.error)

			if (result.execute_error) {
				setError(`Ошибка выполнения: ${result.execute_error}`)
				setLoadingType(null)
				return
			}

			router.push(PAGES.TEMPLATE(dbId, currentTemplateId!.toString()))
		} catch (err: unknown) {
			const msg =
				err instanceof Error ? err.message : ERRORS.SOMETHING_WENT_WRONG
			setError(msg)
		} finally {
			setLoadingType(null)
		}
	}

	const handleDelete = async () => {
		if (!templateId) return

		setError('')
		try {
			setLoadingType('delete')
			const response = await fetch(API.DELETE_TEMPLATE(templateId.toString()), {
				method: 'DELETE'
			})
			if (!response.ok) throw new Error(ERRORS.SOMETHING_WENT_WRONG)

			await queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.ASIDE_TEMPLATES, dbId]
			})
			router.push(PAGES.CHAT(dbId))
		} catch (err: unknown) {
			const msg =
				err instanceof Error ? err.message : ERRORS.SOMETHING_WENT_WRONG
			setError(msg)
		} finally {
			setLoadingType(null)
		}
	}

	return (
		<div className="flex items-center flex-col gap-5 w-full max-w-370 mx-auto p-5">
			<div className="relative w-full flex justify-center">
				<BackLink dbId={dbId} />
				<div className="border border-gray-main rounded-20 px-3 py-2.5 flex items-center w-full max-w-79">
					<Input
						className="text-center"
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setTitle(e.target.value)
						}
						value={title}
						label="Введите название"
						inputId="template-id"
					/>
				</div>
			</div>

			<div className="flex flex-col w-full gap-1">
				<div className="flex justify-between gap-2 w-full">
					<div className="flex gap-5 items-center w-full">
						<TemplateButton
							loadingType={loadingType}
							type="run"
							onClick={handleRun}
						/>
						<Select
							list={CHART_SELECT}
							selectId="chart-type"
							selectLabel="Chart type"
							className="max-w-35"
							selectClassName="py-1"
							value={chartType}
							onChange={(e: ChangeEvent<HTMLSelectElement>) =>
								setChartType(e.target.value as TChartType)
							}
						/>
					</div>
					<div className="flex gap-2.5 items-center">
						<TemplateButton
							loadingType={loadingType}
							type="save"
							onClick={handleSave}
						/>
						{templateId && (
							<TemplateButton
								loadingType={loadingType}
								type="delete"
								onClick={handleDelete}
							/>
						)}
					</div>
				</div>
				{error.length > 0 && <ErrorMessage message={error} className="p-0" />}
				{saveSuccess && (
					<div className="text-green-600 text-sm">Шаблон успешно сохранён</div>
				)}
			</div>

			<ReactCodeMirror
				className="flex-1 bg-white rounded-20 border border-gray-100 overflow-auto w-full"
				value={code}
				extensions={[sql()]}
				theme="light"
				height="100%"
				onChange={(value: string) => setCode(value)}
			/>
		</div>
	)
}

export default CreateTemplateSection
