import { useState } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
} from "lucide-react";
import { cx, initials } from "../../lib/utils";
import { IconButton } from "./core";

/* ---------------- Badge ---------------- */
const BADGE_VARIANTS = {
  success: "bg-success-50 text-success ring-success/20",
  warning: "bg-warning-50 text-warning ring-warning/20",
  danger: "bg-danger-50 text-danger ring-danger/20",
  info: "bg-info-50 text-info ring-info/20",
  primary: "bg-primary-50 text-primary ring-primary/20",
  gold: "bg-gold-50 text-gold-dark ring-gold/30",
  neutral: "bg-slate-100 text-subtle ring-line-dark/40",
};

export function Badge({ variant = "neutral", children, className, dot }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        BADGE_VARIANTS[variant],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

/* ---------------- Status Chip (maps status → badge) ---------------- */
export function StatusChip({ status }) {
  const map = {
    Published: "success",
    Active: "success",
    Completed: "success",
    Delivered: "success",
    Paid: "success",
    Verified: "success",
    Approved: "success",
    Online: "success",
    InStock: "success",
    Draft: "neutral",
    Pending: "warning",
    Shipped: "info",
    Processing: "info",
    More_Info: "warning",
    "More Info": "warning",
    Low: "warning",
    Suspended: "danger",
    Rejected: "danger",
    Canceled: "danger",
    Failed: "danger",
    Flagged: "danger",
    Sold_Out: "neutral",
    "Sold Out": "neutral",
    Refunded: "info",
    Returned: "warning",
  };
  return <Badge variant={map[status] || "neutral"}>{status}</Badge>;
}

/* ---------------- Chip ---------------- */
export function Chip({ active, children, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
        active
          ? "bg-primary text-white shadow-float"
          : "border border-line bg-surface text-subtle hover:border-primary hover:text-primary",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ---------------- Avatar ---------------- */
const AVATAR_COLORS = [
  "bg-primary-100 text-primary-dark",
  "bg-gold-100 text-gold-dark",
  "bg-info-50 text-info",
  "bg-red-100 text-danger",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
];

export function Avatar({
  name,
  src,
  size = "md",
  className,
  online,
  ring,
}) {
  const sizes = {
    xs: "h-7 w-7 text-[10px]",
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl",
  };
  const dotSizes = { xs: "h-2 w-2", sm: "h-2.5 w-2.5", md: "h-3 w-3", lg: "h-3.5 w-3.5", xl: "h-4 w-4" };
  const colorIndex = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;

  return (
    <span className={cx("relative inline-flex shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          className={cx(
            "rounded-full object-cover",
            sizes[size],
            ring && "ring-2 ring-white shadow-card",
          )}
        />
      ) : (
        <span
          className={cx(
            "inline-flex items-center justify-center rounded-full font-bold",
            sizes[size],
            ring && "ring-2 ring-white shadow-card",
            AVATAR_COLORS[colorIndex],
          )}
          aria-hidden
        >
          {initials(name || "?")}
        </span>
      )}
      {online && (
        <span
          className={cx(
            "absolute bottom-0 right-0 rounded-full border-2 border-white bg-success",
            dotSizes[size],
          )}
          aria-label="Online"
        />
      )}
    </span>
  );
}

/* ---------------- Rating ---------------- */
export function Rating({ value, showValue, className, onRate }) {
  return (
    <span
      className={cx("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = value >= star ? "full" : value >= star - 0.5 ? "half" : "empty";
          if (onRate) {
            return (
              <button
                key={star}
                type="button"
                onClick={() => onRate(star)}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                className="transition-transform hover:scale-125"
              >
                <Star
                  className="h-[18px] w-[18px]"
                  style={{ color: "#f9a825" }}
                  fill={star <= value ? "#f9a825" : "transparent"}
                />
              </button>
            );
          }
          if (fill === "half") {
            return (
              <span key={star} className="relative inline-flex">
                <Star className="h-[16px] w-[16px] text-line-dark" fill="#e2e8f0" />
                <Star
                  className="absolute inset-0 h-[16px] w-[16px] text-gold"
                  fill="#f9a825"
                  style={{ clipPath: "inset(0 50% 0 0)" }}
                />
              </span>
            );
          }
          return (
            <Star
              key={star}
              className="h-[16px] w-[16px]"
              style={{ color: "#f9a825" }}
              fill={fill === "full" ? "#f9a825" : "transparent"}
            />
          );
        })}
      </span>
      {showValue && (
        <span className="text-sm font-bold text-ink">{value?.toFixed(1)}</span>
      )}
    </span>
  );
}

/* ---------------- Stat Card ---------------- */
export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  iconClassName,
  trend = "up",
  suffix,
  className,
}) {
  return (
    <div className={cx("card group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover", className)}>
      <div className="flex items-start justify-between">
        <span
          className={cx(
            "grid h-11 w-11 place-items-center rounded-xl",
            iconClassName || "bg-primary-50 text-primary",
          )}
        >
          {Icon && <Icon className="h-5 w-5" aria-hidden />}
        </span>
        {delta != null && (
          <span
            className={cx(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
              trend === "down" ? "bg-danger-50 text-danger" : "bg-success-50 text-success",
            )}
          >
            {trend === "down" ? (
              <TrendingDown className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            )}
            {delta}%
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-ink">
        {value}
        {suffix && <span className="ml-1 text-base font-semibold text-subtle">{suffix}</span>}
      </p>
      <p className="mt-1 text-sm font-medium text-subtle">{label}</p>
    </div>
  );
}

/* ---------------- Progress Bar ---------------- */
export function ProgressBar({ value, color, className, label }) {
  return (
    <div className={cx("w-full", className)}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
          <span className="text-subtle">{label}</span>
          <span className="text-ink">{value}%</span>
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-primary-50"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background: color || "var(--color-primary)",
          }}
        />
      </div>
    </div>
  );
}

/* ---------------- Empty State ---------------- */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cx(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-line-dark bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-50 text-primary">
          <Icon className="h-8 w-8" aria-hidden />
        </span>
      )}
      <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-6 text-subtle">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ---------------- Pagination ---------------- */
export function Pagination({ page, total, onChange, className }) {
  const pages = Array.from({ length: Math.min(total, 7) }, (_, i) => i + 1);
  return (
    <nav
      className={cx("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      <IconButton
        label="Previous page"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </IconButton>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cx(
            "h-9 w-9 rounded-xl text-sm font-semibold transition-all",
            p === page
              ? "bg-primary text-white shadow-float"
              : "text-subtle hover:bg-primary-50 hover:text-primary",
          )}
        >
          {p}
        </button>
      ))}
      <span className="px-2 text-sm font-medium text-faint">
        of {total}
      </span>
      <IconButton
        label="Next page"
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
      >
        <ChevronRight className="h-4 w-4" />
      </IconButton>
    </nav>
  );
}

/* ---------------- Breadcrumb ---------------- */
export function Breadcrumb({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cx("flex flex-wrap items-center gap-2 text-sm", className)}>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {item.to ? (
            <a
              href={item.to}
              className="font-medium text-subtle transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ) : (
            <span className="font-semibold text-ink" aria-current="page">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="text-faint" aria-hidden>
              /
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ---------------- Tabs ---------------- */
export function Tabs({ items, active, onChange, className, variant = "underline" }) {
  if (variant === "pill") {
    return (
      <div className={cx("inline-flex flex-wrap gap-2 rounded-card bg-surface p-1.5 ring-1 ring-line", className)} role="tablist">
        {items.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active === tab.value}
            onClick={() => onChange(tab.value)}
            className={cx(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
              active === tab.value
                ? "bg-primary text-white shadow-float"
                : "text-subtle hover:text-primary",
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count != null && (
              <span
                className={cx(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-bold",
                  active === tab.value ? "bg-white/20" : "bg-primary-50 text-primary",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className={cx("flex gap-1 border-b border-line", className)} role="tablist">
      {items.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          onClick={() => onChange(tab.value)}
          className={cx(
            "relative -mb-px flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors",
            active === tab.value
              ? "text-primary"
              : "text-subtle hover:text-ink",
          )}
        >
          {tab.label}
          {active === tab.value && (
            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Accordion ---------------- */
export function Accordion({ items, className }) {
  const [open, setOpen] = useState(items[0]?.id ?? null);
  return (
    <div className={cx("divide-y divide-line overflow-hidden rounded-card border border-line bg-surface", className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-primary-50/50"
            >
              <span className="text-base font-semibold text-ink">{item.question}</span>
              <ChevronDown
                className={cx(
                  "h-5 w-5 shrink-0 text-subtle transition-transform duration-300",
                  isOpen && "rotate-180 text-primary",
                )}
                aria-hidden
              />
            </button>
            <div
              className={cx(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 leading-7 text-subtle">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Timeline ---------------- */
export function Timeline({ items, className }) {
  return (
    <ol className={cx("relative space-y-0", className)}>
      {items.map((item, index) => (
        <li key={index} className="relative flex gap-4 pb-8 last:pb-0">
          {index < items.length - 1 && (
            <span
              className={cx(
                "absolute left-[13px] top-8 h-[calc(100%-32px)] w-0.5",
                item.done ? "bg-primary" : "bg-line",
              )}
              aria-hidden
            />
          )}
          <span
            className={cx(
              "relative z-10 mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold",
              item.done
                ? "bg-primary text-white"
                : "border-2 border-line-dark bg-surface text-subtle",
            )}
            aria-hidden
          >
            {item.done ? "✓" : index + 1}
          </span>
          <div className="pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-ink">{item.label}</p>
              {item.date && <span className="text-xs text-faint">{item.date}</span>}
            </div>
            {item.description && (
              <p className="mt-1 text-sm text-subtle">{item.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- Table ---------------- */
export function Table({ children, className }) {
  return (
    <div className={cx("overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function THead({ children, className }) {
  return (
    <thead className={cx("bg-bg", className)}>
      <tr>{children}</tr>
    </thead>
  );
}

export function TH({ children, className }) {
  return (
    <th className={cx("whitespace-nowrap px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-subtle", className)}>
      {children}
    </th>
  );
}

export function TR({ children, className, ...props }) {
  return (
    <tr className={cx("border-t border-line transition-colors hover:bg-primary-50/40", className)} {...props}>
      {children}
    </tr>
  );
}

export function TD({ children, className }) {
  return <td className={cx("px-5 py-4 align-middle", className)}>{children}</td>;
}

export function RowActions({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <IconButton label="Actions" onClick={() => setOpen((v) => !v)} className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </IconButton>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close actions"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 w-44 animate-scale-in overflow-hidden rounded-card border border-line bg-surface py-1.5 shadow-pop">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

export function RowAction({ icon: Icon, children, danger, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm font-medium transition-colors",
        danger ? "text-danger hover:bg-danger-50" : "text-ink hover:bg-primary-50 hover:text-primary",
      )}
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden />}
      {children}
    </button>
  );
}
