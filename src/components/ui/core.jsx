import { useEffect, useRef, useState } from "react";
import { cx } from "../../lib/utils";

/* ---------------- Button ---------------- */
const BUTTON_VARIANTS = {
  primary:
    "bg-primary text-white shadow-float hover:bg-primary-dark focus-visible:outline-primary",
  secondary:
    "border border-line bg-surface text-ink hover:border-primary hover:text-primary focus-visible:outline-primary",
  ghost:
    "bg-transparent text-ink hover:bg-primary-50 hover:text-primary focus-visible:outline-primary",
  gold:
    "bg-gold text-ink shadow-float hover:bg-gold-dark focus-visible:outline-gold",
  danger:
    "bg-danger text-white shadow-float hover:bg-red-700 focus-visible:outline-danger",
  dark: "bg-ink text-white hover:bg-ink-soft focus-visible:outline-ink",
  white:
    "bg-white text-primary shadow-card hover:bg-primary-50 focus-visible:outline-primary",
  outlinePrimary:
    "border border-primary bg-transparent text-primary hover:bg-primary-50 focus-visible:outline-primary",
};

const BUTTON_SIZES = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  xl: "h-14 px-8 text-base gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  as: Tag = "button",
  className,
  loading,
  icon: Icon,
  children,
  ...props
}) {
  return (
    <Tag
      className={cx(
        "inline-flex select-none items-center justify-center rounded-btn font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <Spinner className="h-4 w-4" />
      ) : Icon ? (
        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
      ) : null}
      {children}
    </Tag>
  );
}

/* ---------------- Icon Button ---------------- */
export function IconButton({
  variant = "ghost",
  size = "md",
  as: Tag = "button",
  className,
  label,
  children,
  ...props
}) {
  const sizes = {
    sm: "h-9 w-9",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };
  const variants = {
    ghost: "text-subtle hover:bg-primary-50 hover:text-primary",
    surface: "border border-line bg-surface text-subtle hover:text-primary hover:border-primary",
    primary: "bg-primary text-white hover:bg-primary-dark",
    soft: "bg-primary-50 text-primary hover:bg-primary-100",
  };
  return (
    <Tag
      aria-label={label}
      className={cx(
        "inline-flex items-center justify-center rounded-xl transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ---------------- Spinner ---------------- */
export function Spinner({ className }) {
  return (
    <svg
      className={cx("animate-spin", className || "h-5 w-5")}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/* ---------------- Skeleton ---------------- */
export function Skeleton({ className }) {
  return <div className={cx("skeleton", className)} aria-hidden />;
}

/* ---------------- Reveal (fade-in on scroll) ---------------- */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cx(
        "transition-all duration-700 ease-out will-change-transform",
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
