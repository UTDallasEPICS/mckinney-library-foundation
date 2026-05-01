type CsvValue = string | number | boolean | null | undefined

type CsvRow = Record<string, CsvValue>

function escapeCsvValue(value: CsvValue): string {
  if (value == null) {
    return ''
  }

  const stringValue = String(value)
  const escapedValue = stringValue.replace(/"/g, '""')

  if (/[",\r\n]/.test(escapedValue)) {
    return `"${escapedValue}"`
  }

  return escapedValue
}

export function useCsvExport() {
  function downloadCsv(filename: string, rows: CsvRow[]) {
    if (!rows.length) {
      return
    }

    const headers = Object.keys(rows[0])
    const csvLines = [
      headers.join(','),
      ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(',')),
    ]

    const csvContent = csvLines.join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    downloadCsv,
  }
}
