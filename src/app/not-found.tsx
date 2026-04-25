import Link from 'next/link'
import { PAGES } from '@/configs/pages.config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Страница не найдена'
}

const NotFound = () => {
	return (
		<main
			className={'flex justify-center items-center text-center text-nowrap'}
		>
			<div className={'relative'}>
				<h1 className={'text-300 font-bold text-accent leading-75'}>404</h1>
				<div
					className={
						'flex flex-col gap-5 p-5 rounded-10 backdrop-blur-sm absolute -translate-x-1/2 top-3/5 left-1/2 z-10 bg-white/50'
					}
				>
					<p>404 страница не найдена или была перенесена</p>
					<Link
						className={'bg-dark-menu rounded-10 py-2 px-19 text-white '}
						href={PAGES.MAIN}
					>
						На главную
					</Link>
				</div>
			</div>
		</main>
	)
}

export default NotFound
