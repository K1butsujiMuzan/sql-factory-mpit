'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import Logo from '@/components/Logo/Logo'
import AsideLink from '@/components/Aside/AsideLink'
import { PAGES } from '@/configs/pages.config'
import AsideButton from '@/components/Aside/AsideButton'
import { usePathname } from 'next/navigation'
import AsideMiniLink from '@/components/Aside/AsideMiniLink'
import CreateTemplateLink from '@/components/Aside/CreateTemplateLink'
import AsideToggleButton from '@/components/Aside/AsideToggleButton'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/configs/query-keys.config'
import { API } from '@/configs/api.config'
import type { TAsideHistory } from '@/shared/types/aside-history.type'
import type { TAsideTemplate } from '@/shared/types/aside-templates.type'
import { formatIsoUtcDatesInText } from '@/lib/format-iso-date'

interface Props {
	dbId: string
}

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
				if (!response.ok) return []
				return (await response.json()) as TAsideHistory[]
			} catch (error) {
				console.error(error)
				return []
			}
		},
		queryKey: [QUERY_KEYS.ASIDE_HISTORY, dbId]
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
				if (!response.ok) return []
				return (await response.json()) as TAsideTemplate[]
			} catch (error) {
				console.error(error)
				return []
			}
		},
		queryKey: [QUERY_KEYS.ASIDE_TEMPLATES, dbId]
	})

	const [isOpen, setIsOpen] = useState<boolean>(true)
	const [isShown, setIsShown] = useState<boolean>(false)
	const [listType, setListType] = useState<'history' | 'templates'>('history')
	const pathname = usePathname()

	const onToggleIsOpen = () => {
		if (isOpen) {
			setIsShown(false)
			setIsOpen(false)
		} else {
			setIsOpen(true)
			setIsShown(false)
		}
	}

	const handleTransitionEnd = (e: React.TransitionEvent<HTMLElement>) => {
		if (e.propertyName === 'width' && !isOpen) {
			setIsShown(true)
		}
	}

	return (
		<>
			{isShown && (
				<AsideToggleButton
					onClick={onToggleIsOpen}
					className="px-3 rounded-20 border border-gray-100 absolute top-5 left-5 transition duration-300 z-10"
				/>
			)}
			<aside
				inert={!isOpen}
				onTransitionEnd={handleTransitionEnd}
				className={cn(
					'bg-white py-5 transition-all duration-300 overflow-hidden',
					isOpen ? 'w-54' : 'w-0'
				)}
			>
				<div className="w-54 pl-3 pr-3">
					<div className="flex items-center justify-between pr-5.5 pb-10">
						<Logo dbId={dbId} />
						<AsideToggleButton className="p-1.5" onClick={onToggleIsOpen} />
					</div>
					<ul className="flex flex-col gap-2.5 pb-5 pr-5.5 border-b border-gray-100">
						{pathname === PAGES.CHAT(dbId) ? (
							<AsideLink label="Сменить базу" href={PAGES.MAIN} />
						) : (
							<AsideLink label="Новый чат" href={PAGES.CHAT(dbId)} />
						)}
						<AsideButton
							isActive={
								pathname.startsWith(PAGES.CHAT(dbId)) &&
								pathname !== PAGES.CHAT(dbId)
							}
							onClick={() => setListType('history')}
							label="История"
						/>
						<AsideButton
							isActive={pathname.startsWith(PAGES.TEMPLATE(dbId))}
							onClick={() => setListType('templates')}
							label="Шаблоны"
						/>
						<AsideLink
							isActive={pathname === PAGES.DICTIONARY(dbId)}
							label="Словарь"
							href={PAGES.DICTIONARY(dbId)}
						/>
					</ul>
					<ul className="flex flex-col gap-5 pt-5 pl-2 pr-3">
						{(historyQuery.isPending || templateQuery.isPending) &&
							[...Array(3)].map((_, index) => (
								<li
									key={index}
									className="block h-5 py-1 px-3 bg-gray-150 rounded-sm bg-gradient-to-r from-gray-150 via-gray-100 to-gray-150 bg-[length:200%_100%] animate-shimmer"
								/>
							))}
						{listType === 'history' &&
							historyQuery.data?.map(({ id, title }) => (
								<AsideMiniLink
									isActive={pathname === PAGES.CHAT(dbId, id.toString())}
									key={id}
									href={PAGES.CHAT(dbId, id.toString())}
									label={
										typeof title === 'string'
											? formatIsoUtcDatesInText(title)
											: String(title)
									}
								/>
							))}
						{listType === 'templates' && (
							<>
								<CreateTemplateLink dbId={dbId} />
								{templateQuery.data?.map(({ id, title }) => (
									<AsideMiniLink
										isActive={pathname === PAGES.TEMPLATE(dbId, id.toString())}
										key={id}
										href={PAGES.TEMPLATE(dbId, id.toString())}
										label={
											typeof title === 'string'
												? formatIsoUtcDatesInText(title)
												: String(title)
										}
									/>
								))}
							</>
						)}
					</ul>
				</div>
			</aside>
		</>
	)
}

export default Aside
