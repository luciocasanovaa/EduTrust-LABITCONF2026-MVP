import { useState } from 'react';
import { ChartTooltip, TooltipContent, useChartTooltip } from './ChartTooltip';

export interface StackedSegment {
  id: string;
  label: string;
  value: number;
  color: string;
  /** Shown in the legend, e.g. "$84.350". */
  valueLabel: string;
  /** Share of the whole bar, 0-100. */
  sharePct: number;
  tooltip: TooltipContent;
}

interface StackedBarProps {
  segments: StackedSegment[];
  ariaLabel: string;
}

/**
 * Part-to-whole in one 24px bar: 2px surface gaps between segments, 4px rounded
 * outer ends. The legend carries label + value + share, so nothing is color-only.
 */
export function StackedBar({ segments, ariaLabel }: StackedBarProps) {
  const { containerRef, tooltip, showAtPointer, showAtElement, hide } = useChartTooltip();
  const [activeId, setActiveId] = useState<string | null>(null);
  const visible = segments.filter((s) => s.value > 0);

  const clear = () => {
    setActiveId(null);
    hide();
  };

  return (
    <div ref={containerRef} className="relative">
      <div role="group" aria-label={ariaLabel} className="flex">
        {visible.map((segment, i) => (
          <div
            key={segment.id}
            tabIndex={0}
            aria-label={`${segment.label}: ${segment.valueLabel}, ${Math.round(segment.sharePct)}%`}
            onPointerMove={(e) => {
              setActiveId(segment.id);
              showAtPointer(e, segment.tooltip);
            }}
            onPointerDown={(e) => {
              setActiveId(segment.id);
              showAtPointer(e, segment.tooltip);
            }}
            onPointerLeave={clear}
            onFocus={(e) => {
              setActiveId(segment.id);
              showAtElement(e.currentTarget, segment.tooltip);
            }}
            onBlur={clear}
            // The padding is the 2px surface gap *and* a taller hit area than the 24px mark.
            className="min-w-[5px] cursor-default px-px py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#2B59FF]/40"
            style={{ flex: `${segment.value} 1 0` }}
          >
            <div
              className={`h-6 transition-[filter] ${i === 0 ? 'rounded-l-[4px]' : ''} ${
                i === visible.length - 1 ? 'rounded-r-[4px]' : ''
              }`}
              style={{
                backgroundColor: segment.color,
                filter: activeId === segment.id ? 'brightness(1.1)' : undefined,
              }}
            />
          </div>
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {segments.map((segment) => (
          <li key={segment.id} className="flex items-start gap-2.5">
            <span
              aria-hidden="true"
              className="mt-1 h-3 w-3 shrink-0 rounded-[3px]"
              style={{ backgroundColor: segment.color }}
            />
            <div className="min-w-0">
              <div className="text-xs text-[var(--viz-ink-2)]">{segment.label}</div>
              <div className="text-sm font-semibold tnum text-[var(--viz-ink)]">
                {segment.valueLabel}{' '}
                <span className="text-xs font-medium text-[var(--viz-ink-3)]">
                  · {Math.round(segment.sharePct)}%
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <ChartTooltip state={tooltip} />
    </div>
  );
}
