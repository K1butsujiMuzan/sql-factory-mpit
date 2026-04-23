import Aside from '@/components/Aside/Aside'

interface Props {
	params: Promise<{ dbId: string }>
	children: React.ReactNode
}

export default async function ChatLayout({ children, params }: Props) {
	const { dbId } = await params

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
