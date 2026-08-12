import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
} from "../../lib/fa";
import { cx } from "../../lib/utils";

/* ==================== Modal ==================== */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  footer,
  hideClose,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="absolute inset-0 animate-fade-in bg-ink/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cx(
          "relative z-10 w-full animate-scale-in rounded-card bg-surface shadow-pop",
          sizes[size],
        )}
      >
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div>
              {title && <h2 className="text-lg font-bold text-ink">{title}</h2>}
              {description && (
                <p className="mt-1 text-sm text-subtle">{description}</p>
              )}
            </div>
            {!hideClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-subtle transition hover:bg-primary-50 hover:text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-3 border-t border-line bg-bg px-6 py-4 sm:flex-row sm:justify-end sm:rounded-b-card">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== Dialog (confirm) ==================== */
export function Dialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "danger",
  loading,
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm" hideClose>
      <div className="flex flex-col items-center text-center">
        <span
          className={cx(
            "grid h-14 w-14 place-items-center rounded-2xl",
            variant === "danger"
              ? "bg-danger-50 text-danger"
              : "bg-primary-50 text-primary",
          )}
        >
          {variant === "danger" ? (
            <AlertTriangle className="h-7 w-7" />
          ) : (
            <Info className="h-7 w-7" />
          )}
        </span>
        <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
        {description && <p className="mt-2 text-sm leading-6 text-subtle">{description}</p>}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onClose}
          className="h-11 rounded-btn border border-line bg-surface font-semibold text-ink transition hover:bg-bg"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={cx(
            "h-11 rounded-btn font-semibold text-white transition",
            variant === "danger"
              ? "bg-danger hover:bg-red-700"
              : "bg-primary hover:bg-primary-dark",
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

/* ==================== Drawer ==================== */
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  footer,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="absolute inset-0 animate-fade-in bg-ink/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cx(
          "absolute top-0 flex h-full w-full max-w-sm flex-col bg-surface shadow-pop",
          side === "right" ? "right-0 animate-slide-in-right rounded-l-card" : "left-0 animate-slide-in-left rounded-r-card",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-base font-bold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="grid h-9 w-9 place-items-center rounded-xl text-subtle transition hover:bg-primary-50 hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="border-t border-line bg-surface px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}

/* ==================== Alert ==================== */
export function Alert({ variant = "info", title, children, onClose, className }) {
  const styles = {
    success: "border-success/30 bg-success-50 text-ink",
    warning: "border-warning/30 bg-warning-50 text-ink",
    danger: "border-danger/30 bg-danger-50 text-ink",
    info: "border-info/30 bg-info-50 text-ink",
  };
  const icons = {
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: XCircle,
    info: Info,
  };
  const Icon = icons[variant];
  return (
    <div
      role={variant === "danger" ? "alert" : "status"}
      className={cx("flex items-start gap-3 rounded-card border p-4", styles[variant], className)}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="flex-1">
        {title && <p className="text-sm font-bold text-ink">{title}</p>}
        {children && <p className="mt-0.5 text-sm leading-6 text-ink-soft">{children}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="shrink-0 rounded-lg p-1 text-current opacity-60 transition hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ==================== Tooltip ==================== */
export function Tooltip({ label, children, side = "top" }) {
  const positions = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
  };
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cx(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-pop transition-opacity duration-200 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
          positions[side],
        )}
      >
        {label}
      </span>
    </span>
  );
}

/* ==================== Toast ==================== */
const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: { icon: CheckCircle2, ring: "border-success/30", iconColor: "text-success" },
  error: { icon: XCircle, ring: "border-danger/30", iconColor: "text-danger" },
  warning: { icon: AlertTriangle, ring: "border-warning/30", iconColor: "text-warning" },
  info: { icon: Info, ring: "border-info/30", iconColor: "text-info" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, title, message) => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list, { id, type, title, message }]);
      setTimeout(() => remove(id), 4200);
    },
    [remove],
  );

  const toast = useMemo(
    () => ({
      success: (title, message) => push("success", title, message),
      error: (title, message) => push("error", title, message),
      warning: (title, message) => push("warning", title, message),
      info: (title, message) => push("info", title, message),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3" aria-live="polite">
        {toasts.map((t) => {
          const style = TOAST_STYLES[t.type];
          const Icon = style.icon;
          return (
            <div
              key={t.id}
              className={cx(
                "pointer-events-auto flex animate-toast-in items-start gap-3 rounded-card border bg-surface p-4 shadow-pop",
                style.ring,
              )}
            >
              <Icon className={cx("mt-0.5 h-5 w-5 shrink-0", style.iconColor)} aria-hidden />
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">{t.title}</p>
                {t.message && <p className="mt-0.5 text-sm text-subtle">{t.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => remove(t.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded-lg p-1 text-faint transition hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

/* ==================== Dropdown menu ==================== */
export function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return { open, setOpen, ref };
}
