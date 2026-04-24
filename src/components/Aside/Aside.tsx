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
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/configs/query-keys.config'
import { API } from '@/configs/api.config'
import type { TAsideHistory } from '@/shared/types/aside-history.type'
import type { TAsideTemplate } from '@/shared/types/aside-templates.type'

interface Props {
	dbId: string
}

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
	const historyQuery = useQuery({
		queryFn: async () => {
			try {
				const response = await fetch(API.GET_HISTORY(dbId), {
					method: 'GET',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				})

				if (!response.ok) {
					return []
				}

				return (await response.json()) as TAsideHistory[]
			} catch (error) {
				console.error(error)
				return []
			}
		},
		queryKey: [QUERY_KEYS.ASIDE_HISTORY]
	})

	const templateQuery = useQuery({
		queryFn: async () => {
			try {
				const response = await fetch(API.GET_TEMPLATES(dbId), {
					method: 'GET',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				})

				if (!response.ok) {
					return []
				}

				return (await response.json()) as TAsideTemplate[]
			} catch (error) {
				console.error(error)
				return []
			}
		},
		queryKey: [QUERY_KEYS.ASIDE_TEMPLATES]
	})

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
			<AsideToggleButton
				disabled={isOpen}
				onClick={onToggleIsOpen}
				isOpen={isOpen}
				className={
					'px-3 rounded-20 border border-gray-100 absolute top-5 left-5 transition duration-300'
				}
			/>
			<aside
				onTransitionEnd={handleTransitionEnd}
				onTransitionStart={handleTransitionStart}
				inert={!isOpen}
				className={cn('w-54 bg-white py-5  transition duration-300', {
					'opacity-100 translate-x-0 pointer-events-auto': isOpen,
					'opacity-0 -translate-x-full pointer-events-none': !isOpen,
					hidden: isHidden
				})}
			>
				<div className={'flex items-center justify-between pr-5.5 pl-3 pb-10'}>
					<Logo dbId={dbId} />
					<AsideToggleButton onClick={onToggleIsOpen} isOpen={isOpen} />
				</div>
				<ul
					className={
						'flex flex-col gap-2.5 pb-5 pr-5.5 pl-3 border-b border-gray-100'
					}
				>
					{pathname === PAGES.CHAT(dbId) ? (
						<AsideLink label={'Сменить базу'} href={PAGES.MAIN} />
					) : (
						<AsideLink label={'Новый чат'} href={PAGES.CHAT(dbId)} />
					)}
					<AsideButton
						isActive={
							pathname.startsWith(PAGES.CHAT(dbId)) &&
							pathname !== PAGES.CHAT(dbId)
						}
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
							historyQuery.data &&
							historyQuery.data.length > 0 &&
							historyQuery.data.map(({ id, title }) => (
								<AsideMiniLink
									isActive={pathname === PAGES.CHAT(dbId, id.toString())}
									key={id}
									href={PAGES.CHAT(dbId, id.toString())}
									label={title}
								/>
							))}
						{listType === 'templates' && (
							<>
								<CreateTemplateLink dbId={dbId} />
								{templateQuery.data &&
									templateQuery.data.length > 0 &&
									templateQuery.data.map(({ id, title }) => (
										<AsideMiniLink
											isActive={
												pathname === PAGES.TEMPLATE(dbId, id.toString())
											}
											key={id}
											href={PAGES.TEMPLATE(dbId, id.toString())}
											label={title}
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
