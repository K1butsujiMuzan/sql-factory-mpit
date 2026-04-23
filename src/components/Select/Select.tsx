import type { TSelect } from '@/shared/types/select.type'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
	list: TSelect[]
	selectId: string
	selectLabel: string
}

const Select = ({ list, selectId, selectLabel, ...rest }: Props) => {
	return (
		<div className={'relative w-full'}>
			<label className={'sr-only'} htmlFor={selectId}>
				{selectLabel}
			</label>
			<select
				{...rest}
				id={selectId}
				className={
					'peer cursor-pointer appearance-none text-sm text-gray-main outline-none w-full border border-gray-main rounded-20 px-3 py-2.5'
				}
			>
				{list.map(({ text, value }, index) => (
					<option className={'bg-dark'} key={value} value={value}>
						{text}
					</option>
				))}
			</select>
			<svg
				className={
					'cursor-pointer text-gray-light absolute right-3 top-[calc(50%-4px)] peer-open:rotate-180 transition duration-300'
				}
				role={'img'}
				aria-hidden={true}
				width="18"
				height="10"
				viewBox="0 0 18 10"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M16.75 0.75L10.1641 8.09907C9.38636 8.96698 8.11364 8.96698 7.33586 8.09907L0.75 0.75"
					stroke="black"
					strokeWidth="1.5"
					strokeMiterlimit="10"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	)
}

export default Select
