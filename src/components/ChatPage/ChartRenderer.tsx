'use client'

import React, { forwardRef, useImperativeHandle, useRef } from 'react'
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
	Filler,
	type ChartOptions,
	type TooltipItem
} from 'chart.js'
import { Line, Pie, Bar } from 'react-chartjs-2'
import type { TChartType } from '@/constants/chart-types'
import { formatIsoUtcDate } from '@/lib/format-iso-date'

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

export type ChartRendererRef = {
	getImage: () => string | null
}

const truncate = (str: string, maxLen = 10) =>
	str.length <= maxLen ? str : str.slice(0, maxLen) + '...'

const transformForAxisChart = (
	header: string[],
	rows: string[][],
	isBar: boolean
) => {
	const labels = rows.map((row) => truncate(formatIsoUtcDate(row[0])))
	const numericHeaders = header.slice(1)

	const colors = [
		'#3b82f6',
		'#ef4444',
		'#10b981',
		'#f59e0b',
		'#8b5cf6',
		'#ec489a'
	]

	return {
		labels,
		datasets: numericHeaders.map((name, idx) => ({
			label: name,
			data: rows.map((r) => {
				const v = parseFloat(r[idx + 1])
				return isNaN(v) ? 0 : v
			}),
			borderColor: colors[idx % colors.length],
			backgroundColor: isBar
				? `${colors[idx % colors.length]}20`
				: 'transparent',
			borderWidth: 2,
			tension: 0.4
		}))
	}
}

const transformForPieChart = (rows: string[][]) => ({
	labels: rows.map((r) => truncate(formatIsoUtcDate(r[0]))),
	datasets: [
		{
			data: rows.map((r) => {
				const v = parseFloat(r[1])
				return isNaN(v) ? 0 : v
			}),
			backgroundColor: [
				'#3b82f6',
				'#ef4444',
				'#10b981',
				'#f59e0b',
				'#8b5cf6',
				'#ec489a'
			]
		}
	]
})

interface ChartWithImage {
	toBase64Image?: () => string
}

const ChartRenderer = forwardRef<ChartRendererRef, ChartRendererProps>(
	({ chartType, header, data }, ref) => {
		const chartRef = useRef<ChartWithImage | null>(null)

		useImperativeHandle(ref, () => ({
			getImage: () => {
				return chartRef.current?.toBase64Image?.() || null
			}
		}))

		const lineOptions: ChartOptions<'line'> = {
			responsive: true,
			animation: false,
			scales: {
				y: { grid: { color: '#e5e7eb' } }
			}
		}

		const barOptions: ChartOptions<'bar'> = {
			responsive: true,
			animation: false,
			scales: {
				y: { grid: { color: '#e5e7eb' } }
			}
		}

		const pieOptions: ChartOptions<'pie'> = {
			responsive: true,
			animation: false,
			plugins: {
				legend: { position: 'top' },
				tooltip: {
					callbacks: {
						label: (ctx: TooltipItem<'pie'>) => `${ctx.label}: ${ctx.raw}`
					}
				}
			}
		}

		if (!data?.length || !header?.length) return <div>Нет данных</div>

		const setChartRef = (instance: unknown) => {
			if (
				instance &&
				typeof instance === 'object' &&
				'toBase64Image' in instance
			) {
				chartRef.current = instance as ChartWithImage
			} else {
				chartRef.current = null
			}
		}

		return (
			<div className="w-full h-full">
				{chartType === 'line' && (
					<Line
						ref={setChartRef}
						data={transformForAxisChart(header, data, false)}
						options={lineOptions}
					/>
				)}

				{chartType === 'histogram' && (
					<Bar
						ref={setChartRef}
						data={transformForAxisChart(header, data, true)}
						options={barOptions}
					/>
				)}

				{chartType === 'pie' && (
					<Pie
						ref={setChartRef}
						data={transformForPieChart(data)}
						options={pieOptions}
					/>
				)}
			</div>
		)
	}
)

ChartRenderer.displayName = 'ChartRenderer'

export default ChartRenderer
