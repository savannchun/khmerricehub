import { useEffect, useMemo, useRef, useState } from "react";
import { cx, formatCompact } from "../lib/utils";

function useMeasure() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

const TOOLTIP_STYLE = {
  position: "absolute",
  transform: "translate(-50%, calc(-100% - 12px))",
  background: "var(--color-ink)",
  color: "#fff",
  fontSize: "12px",
  fontWeight: 600,
  padding: "6px 10px",
  borderRadius: "10px",
  whiteSpace: "nowrap",
  boxShadow: "var(--shadow-pop)",
  pointerEvents: "none",
  zIndex: 10,
};

/* ==================== Area / Line Chart ==================== */
export function AreaChart({
  data,
  labels,
  height = 260,
  color = "#2e7d32",
  format = formatCompact,
  className,
}) {
  const [ref, width] = useMeasure();
  const [hover, setHover] = useState(null);
  const pad = useMemo(() => ({ top: 16, right: 12, bottom: 26, left: 12 }), []);
  const chartW = Math.max(width - pad.left - pad.right, 0);
  const chartH = height - pad.top - pad.bottom;
  const max = Math.max(...data) * 1.15;

  const points = useMemo(() => {
    if (!chartW) return [];
    return data.map((value, i) => ({
      x: pad.left + (i * chartW) / Math.max(data.length - 1, 1),
      y: pad.top + chartH - (value / max) * chartH,
      value,
      label: labels?.[i] || i,
    }));
  }, [data, labels, chartW, chartH, max, pad]);

  if (!width) return <div ref={ref} style={{ height }} className={className} />;

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${pad.top + chartH} L ${points[0].x} ${pad.top + chartH} Z`;

  return (
    <div ref={ref} className={cx("relative w-full select-none", className)} style={{ height }}>
      <svg width="100%" height={height} role="img" aria-label="Chart">
        <defs>
          <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={pad.left}
            x2={width - pad.right}
            y1={pad.top + chartH * t}
            y2={pad.top + chartH * t}
            stroke="var(--color-line)"
            strokeDasharray={t === 1 ? "0" : "4 4"}
            strokeWidth="1"
          />
        ))}
        <path d={areaPath} fill={`url(#grad-${color.replace("#", "")})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {hover != null && (
          <g>
            <line
              x1={points[hover].x}
              x2={points[hover].x}
              y1={pad.top}
              y2={pad.top + chartH}
              stroke={color}
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
            <circle cx={points[hover].x} cy={points[hover].y} r="5" fill={color} stroke="#fff" strokeWidth="2" />
          </g>
        )}
        {points.map((p) => (
          <text
            key={p.x}
            x={p.x}
            y={height - 8}
            textAnchor="middle"
            fontSize="11"
            fill="var(--color-faint)"
            fontWeight="500"
          >
            {p.label}
          </text>
        ))}
      </svg>
      <div
        className="pointer-events-none absolute inset-0"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left - pad.left;
          const index = Math.round((x / chartW) * (data.length - 1));
          if (index >= 0 && index < data.length) setHover(index);
        }}
      />
      {hover != null && points[hover] && (
        <div style={{ ...TOOLTIP_STYLE, left: points[hover].x, top: points[hover].y }}>
          {points[hover].label}: {format(points[hover].value)}
        </div>
      )}
    </div>
  );
}

/* ==================== Bar Chart ==================== */
export function BarChart({
  data,
  labels,
  height = 260,
  color = "#2e7d32",
  format = formatCompact,
  rounded = true,
  className,
}) {
  const [ref, width] = useMeasure();
  const [hover, setHover] = useState(null);
  const pad = useMemo(() => ({ top: 16, right: 8, bottom: 26, left: 8 }), []);
  const chartW = Math.max(width - pad.left - pad.right, 0);
  const chartH = height - pad.top - pad.bottom;
  const max = Math.max(...data) * 1.1;
  const slot = chartW / Math.max(data.length, 1);
  const barW = Math.min(slot * 0.55, 42);

  if (!width) return <div ref={ref} style={{ height }} className={className} />;

  return (
    <div ref={ref} className={cx("relative w-full select-none", className)} style={{ height }}>
      <svg width="100%" height={height} role="img" aria-label="Bar chart">
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={pad.left}
            x2={width - pad.right}
            y1={pad.top + chartH * t}
            y2={pad.top + chartH * t}
            stroke="var(--color-line)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
        ))}
        {data.map((value, i) => {
          const x = pad.left + i * slot + (slot - barW) / 2;
          const barH = (value / max) * chartH;
          const y = pad.top + chartH - barH;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={rounded ? 6 : 2}
              fill={hover === i ? color : `${color}88`}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
        {labels?.map((label, i) => (
          <text
            key={i}
            x={pad.left + i * slot + slot / 2}
            y={height - 8}
            textAnchor="middle"
            fontSize="11"
            fill="var(--color-faint)"
            fontWeight="500"
          >
            {label}
          </text>
        ))}
      </svg>
      {hover != null && (
        <div
          style={{
            ...TOOLTIP_STYLE,
            left: pad.left + hover * slot + slot / 2,
            top: pad.top + chartH - (data[hover] / max) * chartH,
          }}
        >
          {labels?.[hover]}: {format(data[hover])}
        </div>
      )}
    </div>
  );
}

/* ==================== Horizontal bars / ranking ==================== */
export function HBarList({ items, format = formatCompact, className }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <div className={cx("space-y-4", className)}>
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-semibold text-ink">{item.label}</span>
            <span className="font-bold text-primary">{format(item.value)}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-primary-50">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color || "var(--color-primary)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ==================== Donut Chart ==================== */
export function DonutChart({
  segments,
  size = 190,
  thickness = 24,
  centerValue,
  centerLabel,
  className,
}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cumulative = segments.reduce((acc, seg, i) => {
    const prev = i === 0 ? 0 : acc[i - 1];
    acc.push(prev + (seg.value / total) * circumference);
    return acc;
  }, []);

  return (
    <div className={cx("flex w-full flex-col items-center", className)}>
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Donut chart">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth={thickness}
          />
          {segments.map((seg, i) => {
            const dash = (seg.value / total) * circumference;
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-cumulative[i]}
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <span className="text-2xl font-bold text-ink">{centerValue}</span>}
            {centerLabel && <span className="mt-0.5 text-xs font-medium text-subtle">{centerLabel}</span>}
          </div>
        )}
      </div>
      <div className="mt-4 grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs font-medium text-subtle">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: seg.color }} />
            {seg.label} · {Math.round((seg.value / total) * 100)}%
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== Progress Ring ==================== */
export function ProgressRing({ value, size = 96, thickness = 9, color = "#2e7d32", label }) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-line)" strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          style={{ transition: "stroke-dasharray .8s ease" }}
        />
      </svg>
      <span className="absolute text-lg font-bold text-ink">{label ?? `${value}%`}</span>
    </div>
  );
}
