import type { SVGProps } from 'react'

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden={true}
			role="img"
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M7.5 0.5L7.5 14.5" stroke="#222222" strokeLinecap="round" />
			<path d="M14.5 7.5L0.5 7.5" stroke="#222222" strokeLinecap="round" />
		</svg>
	)
}
