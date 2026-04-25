import type { TOperationType } from './operation-type.type'
import Loader from '@/components/Loader/Loader'
import type { ReactNode } from 'react'
import {
	DeleteIcon,
	SaveIcon,
	StartIcon
} from '@/components/CreateTemplateSection/TemplateIcons'
import { cn } from '@/lib/cn'

interface Props {
	loadingType: null | TOperationType
	type: TOperationType
	onClick: () => void
}

const labels: Record<TOperationType, string> = {
	run: 'Запустить',
	save: 'Сохранить',
	delete: 'Удалить'
}

const icons: Record<TOperationType, ReactNode> = {
	run: <StartIcon />,
	save: <SaveIcon />,
	delete: <DeleteIcon />
}

export default function TemplateButton({ loadingType, type, onClick }: Props) {
	const isLoading = loadingType === type

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isLoading}
			className={cn(
				'flex gap-2 px-3 py-0.5 items-center border rounded-20 transition duration-300',
				{
					'border-accent bg-accent text-white hover:text-accent hover:bg-transparent':
						type === 'save',
					'border-accent text-accent hover:text-white hover:bg-accent':
						type === 'run',
					'border-error-100 text-error-100 hover:text-white hover:bg-error-100':
						type === 'delete'
				}
			)}
		>
			{isLoading ? <Loader /> : icons[type]}
			{labels[type]}
		</button>
	)
}
