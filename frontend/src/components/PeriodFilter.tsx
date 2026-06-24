import type { ChangeEvent } from 'react'

export type DateFilter = 'dia' | 'semana' | 'mes' | 'anio' | 'rango'

type PeriodFilterProps = {
  dateFilter: DateFilter
  fromDate: string
  toDate: string
  onDateFilterChange: (value: DateFilter) => void
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
}

const periodOptions: Array<{ value: DateFilter; label: string }> = [
  { value: 'dia', label: 'Día' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
  { value: 'anio', label: 'Año' },
  { value: 'rango', label: 'Rango de fechas' },
]

export default function PeriodFilter({
  dateFilter,
  fromDate,
  toDate,
  onDateFilterChange,
  onFromDateChange,
  onToDateChange,
}: PeriodFilterProps) {
  return (
    <>
      <label>
        Periodo
        <select value={dateFilter} onChange={(event: ChangeEvent<HTMLSelectElement>) => onDateFilterChange(event.target.value as DateFilter)}>
          {periodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {dateFilter === 'rango' ? (
        <>
          <label>
            Desde
            <input type="date" value={fromDate} onChange={(event) => onFromDateChange(event.target.value)} />
          </label>
          <label>
            Hasta
            <input type="date" value={toDate} onChange={(event) => onToDateChange(event.target.value)} />
          </label>
        </>
      ) : (
        <label>
          Fecha
          <input type="date" value={fromDate} onChange={(event) => onFromDateChange(event.target.value)} />
        </label>
      )}
    </>
  )
}
