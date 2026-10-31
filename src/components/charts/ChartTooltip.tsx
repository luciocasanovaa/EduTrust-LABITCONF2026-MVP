import React, { useRef, useState } from 'react';

export interface TooltipRow {
  label: string;
  value: string;
  /** Series color: drawn as a short line key beside the row. */
  color?: string;
}

export interface TooltipContent {
  title?: string;
  rows: TooltipRow[];
}

interface TooltipState extends TooltipContent {
  x: number;
  y: number;
  /** Open to the left of the anchor when it is near the right edge. */
  flip: boolean;
}

/**
 * Shared hover/focus tooltip for the HTML charts. The container must be
 * `position: relative`; coordinates are kept relative to it.
 */
export function useChartTooltip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const place = (clientX: number, clientY: number, content: TooltipContent) => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = clientX - box.left;
    setTooltip({ ...content, x, y: clientY - box.top, flip: x > box.width * 0.55 });
  };

  return {
    containerRef,
    tooltip,
    showAtPointer: (e: React.PointerEvent, content: TooltipContent) =>
      place(e.clientX, e.clientY, content),
    /** Container-relative position, for charts that snap to a data point. */
    showAt: (x: number, y: number, content: TooltipContent) => {
      const width = containerRef.current?.clientWidth ?? 0;
      setTooltip({ ...content, x, y, flip: x > width * 0.55 });
    },
    /** Keyboard focus: anchor to the right-middle of the focused mark. */
    showAtElement: (el: Element, content: TooltipContent) => {
      const r = el.getBoundingClientRect();
      place(r.right, r.top + r.height / 2, content);
    },
    hide: () => setTooltip(null),
  };
}

export function ChartTooltip({ state }: { state: ReturnType<typeof useChartTooltip>['tooltip'] }) {
  if (!state) return null;
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 min-w-[160px] max-w-[260px] rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg"
      style={{
        left: state.x,
        top: state.y,
        transform: `translate(${state.flip ? 'calc(-100% - 12px)' : '12px'}, -50%)`,
      }}
    >
      {state.title && (
        <div className="mb-1 text-[11px] font-medium leading-snug text-[var(--viz-ink-2)]">
          {state.title}
        </div>
      )}
      <ul className="space-y-0.5">
        {state.rows.map((row) => (
          <li key={row.label} className="flex items-center gap-2 text-xs">
            {row.color && (
              <span
                aria-hidden="true"
                className="h-0.5 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: row.color }}
              />
            )}
            <strong className="font-semibold tnum text-[var(--viz-ink)]">{row.value}</strong>
            <span className="text-[var(--viz-ink-2)]">{row.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
