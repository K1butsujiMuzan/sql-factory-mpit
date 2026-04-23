export default function ReasoningText({ text }: { text: string }) {
	const lines = text.split('\n')

	const nodes: React.ReactNode[] = []
	let pendingBullets: string[] = []

	const flushBullets = (keyBase: string) => {
		if (!pendingBullets.length) return
		const items = pendingBullets
			.map((x) => x.replace(/^\s*•\s*/, '').trim())
			.filter(Boolean)
		pendingBullets = []

		if (!items.length) return
		nodes.push(
			<ul key={`${keyBase}-ul`} className="list-disc pl-5 space-y-1">
				{items.map((item, idx) => (
					<li key={`${keyBase}-li-${idx}`}>{item}</li>
				))}
			</ul>
		)
	}

	for (let i = 0; i < lines.length; i++) {
		const raw = lines[i] ?? ''
		const line = raw.trim()

		if (!line) {
			flushBullets(`b-${i}`)
			nodes.push(<div key={`sp-${i}`} className="h-3" />)
			continue
		}

		if (line.startsWith('•')) {
			pendingBullets.push(line)
			continue
		}

		flushBullets(`b-${i}`)

		const next = (lines[i + 1] ?? '').trim()
		const looksLikeHeading =
			!!next &&
			!line.endsWith('.') &&
			!line.endsWith(':') &&
			(next.startsWith('•') || next.length > 0)

		if (looksLikeHeading) {
			nodes.push(
				<div key={`h-${i}`} className="font-medium text-icon-dark">
					{line}
				</div>
			)
			continue
		}

		nodes.push(
			<p key={`p-${i}`} className="text-gray-main">
				{line}
			</p>
		)
	}

	flushBullets(`b-end`)

	return <div className="text-sm leading-relaxed text-gray-main">{nodes}</div>
}

