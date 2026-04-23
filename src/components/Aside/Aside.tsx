'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import Logo from '@/components/Logo/Logo'
import AsideLink from '@/components/Aside/AsideLink'
import { PAGES } from '@/configs/pages.config'
import AsideButton from '@/components/Aside/AsideButton'
import type { TAsideLink } from '@/shared/types/aside-link.type'
import { usePathname } from 'next/navigation'
import AsideMiniLink from '@/components/Aside/AsideMiniLink'
import CreateTemplateLink from '@/components/Aside/CreateTemplateLink'
import AsideToggleButton from '@/components/Aside/AsideToggleButton'

interface Props {
	dbId: string
}

const fakeHistory: TAsideLink[] = [
	{
		id: '123123',
		name: 'Название истории'
	},
	{
		id: 'dkfjgkdflgj',
		name: 'Какой-то текст'
	},
	{
		id: '438',
		name: 'бла бла бла'
	}
]

const fakeTemplates: TAsideLink[] = [
	{
		id: '123123123',
		name: 'Название шаблона'
	},
	{
		id: 'dkfjgdasdasdkdflgj',
		name: 'Какой-asdasdas текст'
	},
	{
		id: 'asdasdasd',
		name: 'бла блasdasdа бла'
	}
]

const Aside = ({ dbId }: Props) => {
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const [isHidden, setIsHidden] = useState<boolean>(false)
	const [listType, setListType] = useState<'none' | 'history' | 'templates'>(
		'none'
	)
	const isTransitioning = useRef(false)

	const pathname = usePathname()

	const onToggleIsOpen = () => {
		if (isTransitioning.current) {
			return
		}
		const newState = !isOpen
		if (!newState) {
			setIsOpen(false)
			setIsHidden(false)
		} else {
			setIsHidden(false)
			requestAnimationFrame(() => {
				setIsOpen(true)
			})
		}
	}

	const handleTransitionEnd = () => {
		isTransitioning.current = false
		if (!isOpen) {
			setIsHidden(true)
		}
	}

	const handleTransitionStart = () => {
		isTransitioning.current = true
	}

	const onMenuButtonClick = (type: 'history' | 'templates') => {
		if (listType === type) {
			return setListType('none')
		}
		setListType(type)
	}

	return (
		<>
			<div
				inert={isOpen}
				className={cn('absolute top-5 left-5 transition duration-300', {
					'pointer-events-none opacity-0': isOpen,
					'pointer-events-auto opacity-100': !isOpen
				})}
			>
				<AsideToggleButton
					onClick={onToggleIsOpen}
					isOpen={isOpen}
					className={'px-3'}
				/>
			</div>
			<aside
				onTransitionEnd={handleTransitionEnd}
				onTransitionStart={handleTransitionStart}
				inert={!isOpen}
				className={cn(
					'w-42 bg-dark-menu rounded-tr-20 rounded-br-20 py-5 text-gray-light transition duration-300',
					{
						'opacity-100 translate-x-0 pointer-events-auto': isOpen,
						'opacity-0 -translate-x-full pointer-events-none': !isOpen,
						hidden: isHidden
					}
				)}
			>
				<div className={'flex items-center justify-between pr-3 pl-5 pb-11.5'}>
					<Logo dbId={dbId} />
					<AsideToggleButton onClick={onToggleIsOpen} isOpen={isOpen} />
				</div>
				<ul
					className={
						'flex flex-col gap-2.5 pb-7.5 pl-2 pr-3 border-b border-gray-main'
					}
				>
					{pathname === PAGES.CHAT(dbId) ? (
						<AsideLink label={'Сменить базу'} href={PAGES.MAIN} />
					) : (
						<AsideLink label={'Новый чат'} href={PAGES.CHAT(dbId)} />
					)}
					<AsideButton
						isActive={pathname.startsWith(PAGES.CHAT(dbId))}
						onClick={() => onMenuButtonClick('history')}
						label={'История'}
					/>
					<AsideButton
						isActive={pathname.startsWith(PAGES.TEMPLATE(dbId))}
						onClick={() => onMenuButtonClick('templates')}
						label={'Шаблоны'}
					/>
					<AsideLink
						isActive={pathname === PAGES.DICTIONARY(dbId)}
						label={'Словарь'}
						href={PAGES.DICTIONARY(dbId)}
					/>
				</ul>
				{listType !== 'none' && (
					<ul className={'flex flex-col gap-5 pt-5 pl-2 pr-3'}>
						{listType === 'history' &&
							fakeHistory.map(({ id, name }) => (
								<AsideMiniLink
									isActive={pathname === PAGES.CHAT(dbId, id)}
									key={id}
									href={PAGES.CHAT(dbId, id)}
									label={name}
								/>
							))}
						{listType === 'templates' && (
							<>
								<CreateTemplateLink dbId={dbId} />
								{fakeTemplates.map(({ id, name }) => (
									<AsideMiniLink
										isActive={pathname === PAGES.TEMPLATE(dbId, id)}
										key={id}
										href={PAGES.TEMPLATE(dbId, id)}
										label={name}
									/>
								))}
							</>
						)}
					</ul>
				)}
			</aside>
		</>
	)
}

export default Aside
