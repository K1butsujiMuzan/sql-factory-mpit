import type { TOperationType } from './operation-type.type'

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

export default function TemplateButton({ loadingType, type, onClick }: Props) {
	const isLoading = loadingType === type

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isLoading}
			className={`py-1.5 px-4 rounded-10 font-medium disabled:opacity-50 ${
				type === 'delete' ? 'bg-red-500 text-white' : 'bg-accent text-white'
			}`}
		>
			{isLoading ? 'Загрузка...' : labels[type]}
		</button>
	)
}
