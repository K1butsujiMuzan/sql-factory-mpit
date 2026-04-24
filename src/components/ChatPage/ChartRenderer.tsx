'use client'

import React from 'react'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler
} from 'chart.js'
import { Line, Pie, Bar } from 'react-chartjs-2'
import type { TChartType } from '@/constants/chart-types'
import type { TooltipItem } from 'chart.js'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler
)

interface ChartRendererProps {
	chartType: TChartType
	header: string[]
	data: string[][]
}

const truncate = (str: string, maxLen = 10) => {
	if (str.length <= maxLen) return str
	return str.slice(0, maxLen) + '...'
}

const transformForAxisChart = (
	header: string[],
	rows: string[][],
	isBar: boolean
) => {
	const labels = rows.map((row) => truncate(row[0]))
	const numericHeaders = header.slice(1)
	const datasets = numericHeaders.map((headerName, idx) => {
		const columnData = rows.map((row) => {
			const rawValue = row[idx + 1]
			const numericValue = parseFloat(rawValue)
			return isNaN(numericValue) ? 0 : numericValue
		})
		const colors = [
			'#3b82f6',
			'#ef4444',
			'#10b981',
			'#f59e0b',
			'#8b5cf6',
			'#ec489a'
		]
		const color = colors[idx % colors.length]
		return {
			label: headerName,
			data: columnData,
			borderColor: color,
			backgroundColor: isBar ? `${color}20` : 'transparent',
			borderWidth: 2.5,
			tension: 0.4,
			pointRadius: 4,
			pointHoverRadius: 6,
			pointBackgroundColor: color,
			pointBorderColor: '#fff',
			pointBorderWidth: 2,
			fill: false
		}
	})
	return { labels, datasets }
}

const transformForPieChart = (_header: string[], rows: string[][]) => {
	const labels = rows.map((row) => truncate(row[0]))
	const pieData = rows.map((row) => {
		const value = parseFloat(row[1])
		return isNaN(value) ? 0 : value
	})
	return {
		labels,
		datasets: [
			{
				data: pieData,
				backgroundColor: [
					'#3b82f6',
					'#ef4444',
					'#10b981',
					'#f59e0b',
					'#8b5cf6',
					'#ec489a',
					'#06b6d4',
					'#84cc16',
					'#f97316',
					'#6366f1'
				],
				borderWidth: 0,
				hoverOffset: 15
			}
		]
	}
}

export default function ChartRenderer({
	chartType,
	header,
	data
}: ChartRendererProps) {
	const commonOptions = {
		responsive: true,
		maintainAspectRatio: false,
		animation: { duration: 800, easing: 'easeOutQuart' as const },
		layout: { padding: { top: 10, bottom: 10, left: 10, right: 10 } },
		scales: {
			y: {
				grid: { color: '#e5e7eb', drawBorder: true },
				ticks: { color: '#4b5563', font: { size: 11 } }
			},
			x: {
				grid: { display: false },
				ticks: {
					color: '#4b5563',
					font: { size: 11 },
					rotation: 0,
					autoSkip: true
				}
			}
		},
		plugins: {
			legend: {
				position: 'top' as const,
				labels: {
					font: { size: 12, weight: 'bold' as const },
					color: '#374151',
					usePointStyle: true,
					boxWidth: 10
				}
			},
			tooltip: {
				backgroundColor: '#ffffff',
				titleColor: '#111827',
				bodyColor: '#4b5563',
				borderColor: '#e5e7eb',
				borderWidth: 1,
				padding: 10,
				cornerRadius: 8,
				bodyFont: { size: 12 },
				titleFont: { size: 13, weight: 'bold' as const }
			}
		}
	}

	const pieOptions = {
		...commonOptions,
		scales: undefined,
		plugins: {
			...commonOptions.plugins,
			tooltip: {
				...commonOptions.plugins.tooltip,
				callbacks: {
					label: (context: TooltipItem<'pie'>) =>
						`${context.label}: ${context.raw}`
				}
			}
		}
	}

	const wrapperClass =
		'w-full h-full relative bg-white rounded-xl border border-gray-200 p-2 shadow-sm chart-fade-in'
	const placeholderClass =
		'w-full h-full flex items-center justify-center bg-white rounded-xl border border-gray-200 chart-fade-in'

	if (chartType === 'none') {
		return (
			<div className={placeholderClass}>
				<p className="text-gray-500 text-lg">График отсутствует</p>
			</div>
		)
	}

	if (!data?.length || !header?.length) {
		return (
			<div className={placeholderClass}>
				<p className="text-gray-500 text-center px-1">
					Недостаточно данных, чтобы построить график
				</p>
			</div>
		)
	}

	if (chartType === 'line') {
		return (
			<div className={wrapperClass}>
				<Line
					data={transformForAxisChart(header, data, false)}
					options={commonOptions}
				/>
			</div>
		)
	}
	if (chartType === 'pie') {
		return (
			<div className={wrapperClass}>
				<Pie data={transformForPieChart(header, data)} options={pieOptions} />
			</div>
		)
	}
	if (chartType === 'histogram') {
		return (
			<div className={wrapperClass}>
				<Bar
					data={transformForAxisChart(header, data, true)}
					options={commonOptions}
				/>
			</div>
		)
	}
	return null
}
