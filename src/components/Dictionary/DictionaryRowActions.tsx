import { cn } from '@/lib/cn'

interface Props {
	onEdit: () => void
	onDelete: () => void
	className?: string
}

const DictionaryRowActions = ({ onEdit, onDelete, className }: Props) => {
	return (
		<div
			className={cn(
				'w-[76px] flex items-center justify-between gap-3',
				className
			)}
		>
			<button
				type="button"
				onClick={onEdit}
				aria-label="Редактировать"
				className="w-8 h-8 rounded-full border border-accent-light flex items-center justify-center"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					role="img"
					aria-hidden={true}
				>
					<path
						d="M10.373 0.601196C10.7467 0.613486 11.0454 0.77621 11.3047 0.976196C11.5513 1.16644 11.8224 1.43825 12.1299 1.74573C12.4374 2.0532 12.7092 2.32433 12.8994 2.57092C13.0994 2.83017 13.2621 3.12888 13.2744 3.50256C13.2756 3.53757 13.2756 3.57302 13.2744 3.60803C13.262 3.98143 13.0993 4.2796 12.8994 4.5387C12.7092 4.78526 12.4373 5.05646 12.1299 5.36389L5.59766 11.8951C5.42566 12.0671 5.26494 12.2358 5.05957 12.3522C4.85416 12.4685 4.62662 12.5197 4.39062 12.5787L2.04395 13.1656C1.88301 13.2059 1.69579 13.2547 1.53809 13.2701C1.37296 13.2863 1.07331 13.2849 0.832031 13.0436C0.590747 12.8023 0.589316 12.5026 0.605469 12.3375C0.620898 12.1798 0.669725 11.9926 0.709961 11.8317L1.29688 9.48499C1.35587 9.24899 1.40713 9.02145 1.52344 8.81604C1.63977 8.61067 1.80846 8.44995 1.98047 8.27795L8.51172 1.74573C8.81915 1.4383 9.09035 1.1664 9.33691 0.976196C9.59601 0.776348 9.89418 0.613601 10.2676 0.601196C10.3026 0.600045 10.338 0.600048 10.373 0.601196Z"
						stroke="#33363F"
						strokeWidth="1.2"
					/>
				</svg>
			</button>

			<button
				type="button"
				onClick={onDelete}
				aria-label="Удалить"
				className="w-8 h-8 rounded-full border border-error-100 flex items-center justify-center"
			>
				<span className="relative rounded-[1px]">
					<svg
						width="14"
						height="15"
						viewBox="0 0 14 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						role="img"
						aria-hidden={true}
					>
						<path
							d="M5.35352 9.77649L5.35352 7.48237"
							stroke="#222222"
							strokeWidth="1.2"
							strokeLinecap="round"
						/>
						<path
							d="M8.41113 9.77649L8.41113 7.48237"
							stroke="#222222"
							strokeWidth="1.2"
							strokeLinecap="round"
						/>
						<path
							d="M0 3.65881H13.7647C13.4916 3.65881 13.355 3.65881 13.2401 3.67214C12.3181 3.77911 11.5909 4.50634 11.4839 5.42833C11.4706 5.54318 11.4706 5.67977 11.4706 5.95293V9.6C11.4706 11.4856 11.4706 12.4284 10.8848 13.0142C10.299 13.6 9.35622 13.6 7.4706 13.6H6.29412C4.4085 13.6 3.46569 13.6 2.87991 13.0142C2.29412 12.4284 2.29412 11.4856 2.29412 9.6V5.95293C2.29412 5.67977 2.29412 5.54318 2.28079 5.42833C2.17383 4.50634 1.44659 3.77911 0.524608 3.67214C0.409749 3.65881 0.273166 3.65881 0 3.65881Z"
							fill="none"
							stroke="#222222"
							strokeWidth="1.2"
							strokeLinecap="round"
						/>
						<path
							d="M5.40442 0.883369C5.49156 0.802068 5.68357 0.730227 5.95067 0.678988C6.21777 0.627749 6.54504 0.599976 6.88172 0.599976C7.2184 0.599976 7.54566 0.627749 7.81277 0.678988C8.07987 0.730226 8.27188 0.802067 8.35902 0.883368"
							stroke="#222222"
							strokeWidth="1.2"
							strokeLinecap="round"
						/>
					</svg>
				</span>
			</button>
		</div>
	)
}

export default DictionaryRowActions
