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
			<main className={'p-5'}>{children}</main>
		</>
	)
}
