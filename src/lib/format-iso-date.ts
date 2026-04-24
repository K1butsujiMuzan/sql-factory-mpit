const ISO_UTC_DATETIME_RE =
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/

const ISO_UTC_DATETIME_GLOBAL_RE =
	/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z/g

export function formatIsoUtcDate(value: string): string {
	if (!ISO_UTC_DATETIME_RE.test(value)) return value

	const d = new Date(value)
	if (Number.isNaN(d.getTime())) return value

	const dd = String(d.getUTCDate()).padStart(2, '0')
	const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
	const yyyy = String(d.getUTCFullYear())

	return `${dd}.${mm}.${yyyy}`
}

export function formatIsoUtcDatesInText(value: string): string {
	return value.replace(ISO_UTC_DATETIME_GLOBAL_RE, formatIsoUtcDate)
}

