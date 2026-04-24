import Aside from '@/components/Aside/Aside'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PAGES } from '@/configs/pages.config'
import { COOKIES } from '@/configs/cookies.config'

interface Props {
	params: Promise<{ dbId: string }>
	children: React.ReactNode
}

export default async function ChatLayout({ children, params }: Props) {
	const { dbId } = await params
	const cookieStore = await cookies()
	const dbIdFromCookie = cookieStore.get(COOKIES.DB_ID)?.value

	if (!dbIdFromCookie) {
		return redirect(PAGES.MAIN)
	}

	if (dbId !== dbIdFromCookie) {
		return redirect(PAGES.CHAT(dbIdFromCookie))
	}

	return (
		<>
			<Aside dbId={dbId} />
			<main className={'bg-white p-1.5'}>
				<div
					className={
						'bg-white h-full w-full flex items-center justify-center rounded-3xl border border-gray-100'
					}
				>
					{children}
				</div>
			</main>
		</>
	)
}
