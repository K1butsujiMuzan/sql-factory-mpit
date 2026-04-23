import { cn } from '@/lib/cn'

interface Props {
	onClick: () => void
	isOpen: boolean
	className?: string
	disabled?: boolean
}

const AsideToggleButton = ({ onClick, isOpen, className, disabled }: Props) => {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={cn('p-0.75 rounded-full text-dark-menu', className, {
				'': isOpen,
				'': !isOpen
			})}
			type={'button'}
		>
			<svg
				aria-hidden={true}
				role={'img'}
				width="18"
				height="18"
				viewBox="0 0 18 18"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M2.925 2.92499H15.075C15.254 2.92499 15.4257 2.9961 15.5523 3.12269C15.6789 3.24928 15.75 3.42097 15.75 3.59999V14.4C15.75 14.579 15.6789 14.7507 15.5523 14.8773C15.4257 15.0039 15.254 15.075 15.075 15.075H2.925C2.74598 15.075 2.57429 15.0039 2.4477 14.8773C2.32112 14.7507 2.25 14.579 2.25 14.4V3.59999C2.25 3.42097 2.32112 3.24928 2.4477 3.12269C2.57429 2.9961 2.74598 2.92499 2.925 2.92499V2.92499ZM6.3 4.27499H3.6V13.725H6.3V4.27499ZM7.65 4.27499V13.725H14.4V4.27499H7.65Z"
					fill="#0C0F0A"
				/>
			</svg>
		</button>
	)
}

export default AsideToggleButton
