import { useState } from 'react';
import { ChartTooltip, TooltipContent, useChartTooltip } from './ChartTooltip';

export interface HBarItem {
  id: string;
  label: string;
  value: number;
  /** Text at the tip of the bar. */
  valueLabel: string;
  color: string;
  tooltip: TooltipContent;
}

interface HBarChartProps {
  items: HBarItem[];
  ariaLabel: string;
  /** Room kept free at the right so the value label never leaves the card. */
  valueGutterPx?: number;
}

/**
 * Horizontal bars: label above, 20px bar growing from a single baseline,
 * 4px rounded data end, value at the tip. The whole row is the hover/focus target.
 */
export function HBarChart({ items, ariaLabel, valueGutterPx = 96 }: HBarChartProps) {
  const { containerRef, tooltip, showAtPointer, showAtElement, hide } = useChartTooltip();
  const [activeId, setActiveId] = useState<string | null>(null);
  const max = Math.max(0, ...items.map((i) => i.value));

  const clear = () => {
    setActiveId(null);
    hide();
  };

  return (
    <div ref={containerRef} className="relative">
      <ul aria-label={ariaLabel} className="space-y-3">
        {items.map((item) => {
          const frac = max > 0 ? item.value / max : 0;
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              tabIndex={0}
              aria-label={`${item.label}: ${item.valueLabel}`}
              onPointerMove={(e) => {
                setActiveId(item.id);
                showAtPointer(e, item.tooltip);
              }}
              onPointerDown={(e) => {
                setActiveId(item.id);
                showAtPointer(e, item.tooltip);
              }}
              onPointerLeave={clear}
              onFocus={(e) => {
                setActiveId(item.id);
                showAtElement(e.currentTarget, item.tooltip);
              }}
              onBlur={clear}
              className={`-mx-2 rounded-lg px-2 py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2B59FF]/40 ${
                isActive ? 'bg-slate-50' : ''
              }`}
            >
              <div className="mb-1.5 text-xs leading-snug text-[var(--viz-ink-2)]">{item.label}</div>
              <div className="relative h-5 border-l border-[var(--viz-axis)]">
                <div
                  className="h-full rounded-r-[4px] transition-[filter]"
                  style={{
                    width:
                      item.value > 0
                        ? `max(3px, calc((100% - ${valueGutterPx}px) * ${frac}))`
                        : 0,
                    backgroundColor: item.color,
                    filter: isActive ? 'brightness(1.1)' : undefined,
                  }}
                />
                <span
                  className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-semibold tnum text-[var(--viz-ink)]"
                  style={{ left: `calc((100% - ${valueGutterPx}px) * ${frac} + 8px)` }}
                >
                  {item.valueLabel}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <ChartTooltip state={tooltip} />
    </div>
  );
}
