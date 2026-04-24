'use client'

import {
	DeleteIcon,
	SaveIcon,
	StartIcon
} from '@/components/CreateTemplateSection/TemplateIcons'
import { cn } from '@/lib/cn'
import type { TOperationType } from '@/components/CreateTemplateSection/operation-type.type'
import Loader from '@/components/Loader/Loader'

interface Props {
	type: TOperationType
	onClick: () => void
	loadingType: TOperationType
}

const TemplateButton = ({ type, onClick, loadingType }: Props) => {
	return (
		<button
			disabled={loadingType === type}
			onClick={onClick}
			type="button"
			className={cn('flex gap-2 px-3 py-0.5 items-center border rounded-20', {
				'border-accent bg-accent text-white': type === 'save',
				'border-accent text-accent': type === 'start',
				'border-error-100 text-error-100': type === 'delete'
			})}
		>
			{type === 'save' && loadingType !== 'save' && <SaveIcon />}
			{type === 'start' && loadingType !== 'start' && <StartIcon />}
			{type === 'delete' && loadingType !== 'delete' && <DeleteIcon />}
			{type === 'save' && loadingType === 'save' && (
				<Loader className={'w-3 text-white'} />
			)}
			{type === 'start' && loadingType === 'start' && (
				<Loader className={'w-3 text-accent'} />
			)}
			{type === 'delete' && loadingType === 'delete' && (
				<Loader className={'w-3 text-error-100'} />
			)}
			<span>
				{type === 'save' && 'Сохранить'}
				{type === 'start' && 'Запустить'}
				{type === 'delete' && 'Удалить'}
			</span>
		</button>
	)
}

export default TemplateButton
