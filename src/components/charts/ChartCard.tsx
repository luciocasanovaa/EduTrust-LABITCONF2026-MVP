import { ReactNode, useState } from 'react';

export interface ChartTable {
  columns: Array<{ label: string; numeric?: boolean }>;
  rows: string[][];
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** Every chart has a table twin: the same numbers without color or hover. */
  table: ChartTable;
  children: ReactNode;
  className?: string;
}

/** Card frame shared by all charts: title, "Gráfico | Tabla" switch, body. */
export function ChartCard({ title, subtitle, table, children, className = '' }: ChartCardProps) {
  const [view, setView] = useState<'grafico' | 'tabla'>('grafico');

  return (
    <section className={`viz-root card-ambient p-5 sm:p-6 ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[var(--viz-ink)] tracking-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-[var(--viz-ink-2)]">{subtitle}</p>}
        </div>

        <div
          role="group"
          aria-label={`Vista de ${title}`}
          className="inline-flex shrink-0 items-center gap-0.5 rounded-lg bg-slate-100 p-0.5"
        >
          {(
            [
              { id: 'grafico', label: 'Gráfico' },
              { id: 'tabla', label: 'Tabla' },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={view === option.id}
              onClick={() => setView(option.id)}
              className={`cursor-pointer rounded-md px-2.5 py-1 text-xs transition-colors ${
                view === option.id
                  ? 'bg-white font-semibold text-[var(--viz-ink)] shadow-xs'
                  : 'font-medium text-[var(--viz-ink-2)] hover:text-[var(--viz-ink)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'grafico' ? (
        children
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-[var(--viz-axis)] text-[var(--viz-ink-2)]">
                {table.columns.map((col) => (
                  <th
                    key={col.label}
                    scope="col"
                    className={`py-2 pr-3 font-semibold ${col.numeric ? 'text-right' : ''}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i} className="border-b border-[var(--viz-grid)] last:border-0">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`py-2 pr-3 text-[var(--viz-ink)] ${
                        table.columns[j]?.numeric ? 'text-right tnum' : ''
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
