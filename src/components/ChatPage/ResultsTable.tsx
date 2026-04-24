'use client'

import { useEffect, useState } from 'react'

interface Props {
	header: string[]
	data: string[][]
}

export default function ResultsTable({ header, data }: Props) {
	const [isFullscreen, setIsFullscreen] = useState(false)

	useEffect(() => {
		if (!isFullscreen) return

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsFullscreen(false)
		}

		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [isFullscreen])

	return (
		<>
			<div className="group w-full bg-white flex-1 rounded-[10px] border border-[#ECECEC] overflow-hidden flex flex-col relative">
				<button
					type="button"
					aria-label={isFullscreen ? 'Свернуть таблицу' : 'Развернуть таблицу'}
					onClick={() => setIsFullscreen((v) => !v)}
					className="absolute right-3 top-3 z-20 w-9 h-9 rounded-full border border-[#0000001A] bg-icon-dark text-white shadow-sm hover:shadow flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 transition-opacity"
				>
					<svg
						role={'img'}
						aria-hidden={true}
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6 2H3.5C2.67157 2 2 2.67157 2 3.5V6"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path
							d="M10 14H12.5C13.3284 14 14 13.3284 14 12.5V10"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path
							d="M10 2H12.5C13.3284 2 14 2.67157 14 3.5V6"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path
							d="M6 14H3.5C2.67157 14 2 13.3284 2 12.5V10"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				</button>

				<div data-chat-scroll className="flex-1 min-h-0 overflow-auto">
					<table className="min-w-full text-sm">
						<thead className="sticky top-0 bg-white">
							<tr>
								{header.map((cell) => (
									<th
										key={cell}
										className="text-left font-medium text-gray-main px-4 py-3 border-b border-[#ECECEC] whitespace-nowrap"
									>
										{cell}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{data.map((row, rowIdx) => (
								<tr key={rowIdx} className="hover:bg-gray-50">
									{row.map((cell, cellIdx) => (
										<td
											key={`${rowIdx}-${cellIdx}`}
											className="px-4 py-3 border-b border-[#ECECEC] whitespace-nowrap"
										>
											{cell}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{isFullscreen && (
				<div
					className="fixed inset-0 z-50 bg-black/40 p-6"
					onClick={(e) => {
						if (e.target === e.currentTarget) setIsFullscreen(false)
					}}
				>
					<div className="w-full h-full bg-white rounded-[10px] border border-[#ECECEC] overflow-hidden flex flex-col relative">
						<button
							type="button"
							aria-label="Закрыть"
							onClick={() => setIsFullscreen(false)}
							className="absolute right-3 top-3 z-30 w-9 h-9 rounded-full border border-[#0000001A] bg-icon-dark text-white shadow-sm hover:shadow flex items-center justify-center"
						>
							<svg
								role={'img'}
								aria-hidden={true}
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M6 2H3.5C2.67157 2 2 2.67157 2 3.5V6"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>
								<path
									d="M10 14H12.5C13.3284 14 14 13.3284 14 12.5V10"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>
								<path
									d="M10 2H12.5C13.3284 2 14 2.67157 14 3.5V6"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>
								<path
									d="M6 14H3.5C2.67157 14 2 13.3284 2 12.5V10"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>
							</svg>
						</button>

						<div data-chat-scroll className="flex-1 min-h-0 overflow-auto">
							<table className="min-w-full text-sm">
								<thead className="sticky top-0 bg-white">
									<tr>
										{header.map((cell) => (
											<th
												key={cell}
												className="text-left font-medium text-gray-main px-4 py-3 border-b border-[#ECECEC] whitespace-nowrap"
											>
												{cell}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{data.map((row, rowIdx) => (
										<tr key={rowIdx} className="hover:bg-gray-50">
											{row.map((cell, cellIdx) => (
												<td
													key={`${rowIdx}-${cellIdx}`}
													className="px-4 py-3 border-b border-[#ECECEC] whitespace-nowrap"
												>
													{cell}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
