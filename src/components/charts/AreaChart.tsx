import React, { useState } from 'react';
import { formatCompactAxis, niceTicks } from '../../utils/sponsorAnalytics';
import { ChartTooltip, TooltipContent, useChartTooltip } from './ChartTooltip';
import { useContainerWidth } from './useContainerWidth';

export interface AreaPoint {
  id: string;
  /** Position on the x axis (a timestamp, so uneven gaps look uneven). */
  x: number;
  xLabel: string;
  y: number;
  tooltip: TooltipContent;
}

interface AreaChartProps {
  points: AreaPoint[];
  ariaLabel: string;
  /** Label above the last point, e.g. "$153.500". */
  endLabel: string;
}

const HEIGHT = 290;
const MARGIN = { top: 28, right: 20, bottom: 32, left: 52 };
const MIN_LABEL_GAP_PX = 56;

/**
 * One series over time: 2px line, ~10% area wash, 8px dots with a 2px surface
 * ring. A hairline crosshair snaps to the nearest date; the end value is
 * labeled directly, everything else lives in the axis, tooltip and table.
 */
export function AreaChart({ points, ariaLabel, endLabel }: AreaChartProps) {
  const { containerRef, tooltip, showAt, hide } = useChartTooltip();
  const width = useContainerWidth(containerRef);
  const [activeId, setActiveId] = useState<string | null>(null);

  const plotW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
  const baseY = MARGIN.top + plotH;

  const maxY = Math.max(0, ...points.map((p) => p.y));
  const { max: yMax, ticks } = niceTicks(maxY);
  const xMin = points[0]?.x ?? 0;
  const xMax = points[points.length - 1]?.x ?? 0;

  const px = (x: number) =>
    points.length < 2 || xMax === xMin
      ? MARGIN.left + plotW / 2
      : MARGIN.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const py = (y: number) => baseY - (y / yMax) * plotH;

  const coords = points.map((p) => ({ ...p, cx: px(p.x), cy: py(p.y) }));
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.cx},${c.cy}`).join(' ');
  const areaPath = coords.length
    ? `${linePath} L${coords[coords.length - 1].cx},${baseY} L${coords[0].cx},${baseY} Z`
    : '';

  // Left-to-right: keep a date label only when it clears the previous one (and the last stays).
  const labelIds = new Set<string>();
  let lastShownX = -Infinity;
  coords.forEach((c, i) => {
    const isLast = i === coords.length - 1;
    const clearsPrevious = c.cx - lastShownX >= MIN_LABEL_GAP_PX;
    const clearsLast = isLast || coords[coords.length - 1].cx - c.cx >= MIN_LABEL_GAP_PX;
    if (clearsPrevious && clearsLast) {
      labelIds.add(c.id);
      lastShownX = c.cx;
    }
  });

  const activate = (c: (typeof coords)[number]) => {
    setActiveId(c.id);
    showAt(c.cx, c.cy, c.tooltip);
  };
  const clear = () => {
    setActiveId(null);
    hide();
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!coords.length) return;
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const nearest = coords.reduce((best, c) => (Math.abs(c.cx - x) < Math.abs(best.cx - x) ? c : best));
    activate(nearest);
  };

  const active = coords.find((c) => c.id === activeId);
  const last = coords[coords.length - 1];

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: HEIGHT }}>
      {width > 0 && coords.length > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={ariaLabel}
          onPointerMove={onPointerMove}
          onPointerDown={onPointerMove}
          onPointerLeave={clear}
          className="block touch-pan-y"
        >
          {/* Hairline grid + y labels */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={MARGIN.left}
                x2={MARGIN.left + plotW}
                y1={py(t)}
                y2={py(t)}
                stroke={t === 0 ? 'var(--viz-axis)' : 'var(--viz-grid)'}
                strokeWidth={1}
              />
              <text
                x={MARGIN.left - 8}
                y={py(t)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={11}
                fill="var(--viz-ink-3)"
                className="tnum"
              >
                {formatCompactAxis(t)}
              </text>
            </g>
          ))}

          {/* x labels */}
          {coords
            .filter((c) => labelIds.has(c.id))
            .map((c) => (
              <text
                key={c.id}
                x={c.cx}
                y={baseY + 20}
                textAnchor="middle"
                fontSize={11}
                fill="var(--viz-ink-3)"
              >
                {c.xLabel}
              </text>
            ))}

          <path d={areaPath} fill="var(--viz-series-1)" fillOpacity={0.1} />

          {active && (
            <line
              x1={active.cx}
              x2={active.cx}
              y1={MARGIN.top}
              y2={baseY}
              stroke="var(--viz-axis)"
              strokeWidth={1}
            />
          )}

          <path
            d={linePath}
            fill="none"
            stroke="var(--viz-series-1)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {coords.map((c) => (
            <g key={c.id}>
              <circle
                cx={c.cx}
                cy={c.cy}
                r={c.id === activeId ? 5 : 4}
                fill="var(--viz-series-1)"
                stroke="var(--viz-surface)"
                strokeWidth={2}
              />
              {/* Hit/focus target well beyond the 8px dot */}
              <circle
                cx={c.cx}
                cy={c.cy}
                r={14}
                fill="transparent"
                tabIndex={0}
                aria-label={`${c.xLabel}: ${c.tooltip.rows.map((r) => `${r.value} ${r.label}`).join(', ')}`}
                onFocus={() => activate(c)}
                onBlur={clear}
                className="outline-none focus-visible:stroke-[#2B59FF]/60 focus-visible:stroke-2"
              />
            </g>
          ))}

          {/* Direct label on the end value only */}
          <text
            x={last.cx}
            y={last.cy - 12}
            textAnchor="end"
            fontSize={12}
            fontWeight={600}
            fill="var(--viz-ink)"
            className="tnum"
          >
            {endLabel}
          </text>
        </svg>
      )}
      <ChartTooltip state={tooltip} />
    </div>
  );
}
