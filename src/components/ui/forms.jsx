import { useId } from "react";
import { Search, Eye, EyeOff } from "../../lib/fa";
import { cx } from "../../lib/utils";

/* ---------------- Field wrapper ---------------- */
export function Field({ label, hint, error, required, children, className }) {
  const id = useId();
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      {children({ id })}
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

/* ---------------- Input ---------------- */
export function Input({
  label,
  hint,
  error,
  required,
  icon: Icon,
  type = "text",
  className,
  inputClassName,
  right,
  ...props
}) {
  return (
    <Field label={label} hint={hint} error={error} required={required} className={className}>
      {({ id }) => (
        <div className="relative">
          {Icon && (
            <Icon
              className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-faint"
              aria-hidden
            />
          )}
          <input
            id={id}
            type={type}
            className={cx(
              "input-base",
              Icon && "pl-11",
              right && "pr-11",
              error && "border-danger focus:border-danger focus:ring-danger/10",
              inputClassName,
            )}
            aria-invalid={!!error}
            {...props}
          />
          {right}
        </div>
      )}
    </Field>
  );
}

export function PasswordInput(props) {
  return (
    <Input
      {...props}
      type={props.show ? "text" : "password"}
      right={
        <button
          type="button"
          tabIndex={-1}
          aria-label={props.show ? "Hide password" : "Show password"}
          onClick={props.onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-faint transition hover:text-primary"
        >
          {props.show ? (
            <EyeOff className="h-[18px] w-[18px]" />
          ) : (
            <Eye className="h-[18px] w-[18px]" />
          )}
        </button>
      }
    />
  );
}

/* ---------------- Textarea ---------------- */
export function Textarea({
  label,
  hint,
  error,
  required,
  className,
  rows = 4,
  ...props
}) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      {({ id }) => (
        <textarea
          id={id}
          rows={rows}
          className={cx(
            "input-base resize-y",
            error && "border-danger focus:border-danger",
            className,
          )}
          aria-invalid={!!error}
          {...props}
        />
      )}
    </Field>
  );
}

/* ---------------- Select ---------------- */
export function Select({
  label,
  hint,
  error,
  required,
  className,
  children,
  ...props
}) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      {({ id }) => (
        <select
          id={id}
          className={cx(
            "input-base appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10",
            error && "border-danger",
            className,
          )}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>
      )}
    </Field>
  );
}

/* ---------------- Checkbox ---------------- */
export function Checkbox({ label, description, checked, onChange, className, ...props }) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cx(
        "group flex cursor-pointer items-start gap-3 text-sm text-ink",
        className,
      )}
    >
      <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-[6px] border border-line-dark bg-surface transition checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-primary"
          {...props}
        />
        <svg
          viewBox="0 0 12 10"
          className="pointer-events-none absolute h-3 w-3 stroke-white opacity-0 transition group-hover:opacity-60 peer-checked:opacity-100"
          fill="none"
        >
          <path d="M1 5.5 4.2 8.7 11 1.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>
        {label && <span className="font-medium">{label}</span>}
        {description && (
          <span className="mt-0.5 block text-subtle">{description}</span>
        )}
      </span>
    </label>
  );
}

/* ---------------- Radio ---------------- */
export function RadioGroup({ label, value, onChange, options, columns = 1 }) {
  return (
    <fieldset>
      {label && (
        <legend className="mb-2 text-sm font-semibold text-ink">{label}</legend>
      )}
      <div
        className={cx(
          "grid gap-3",
          columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
        )}
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={cx(
                "flex cursor-pointer items-center gap-3 rounded-card border p-4 transition-all",
                selected
                  ? "border-primary bg-primary-50 ring-2 ring-primary/15"
                  : "border-line bg-surface hover:border-line-dark",
              )}
            >
              <input
                type="radio"
                name={label}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 shrink-0 accent-primary"
              />
              <span className="text-sm font-medium text-ink">{option.label}</span>
              {option.sub && (
                <span className="ml-auto text-xs text-subtle">{option.sub}</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ---------------- Switch ---------------- */
export function Switch({ label, description, checked, onChange, className }) {
  const id = useId();
  return (
    <label htmlFor={id} className={cx("flex cursor-pointer items-center justify-between gap-4", className)}>
      <span>
        {label && <span className="block text-sm font-medium text-ink">{label}</span>}
        {description && <span className="mt-0.5 block text-sm text-subtle">{description}</span>}
      </span>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-line-dark transition-colors peer-checked:bg-primary" />
        <span className="absolute left-0.5 h-5 w-5 translate-x-0 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

/* ---------------- Search Bar ---------------- */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  size = "md",
  className,
  onSubmit,
  ...props
}) {
  const sizes = { sm: "h-11", md: "h-13", lg: "h-14 text-base" };
  return (
    <form
      className={cx(
        "flex w-full items-center gap-2 rounded-btn border border-line bg-surface px-4 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10",
        sizes[size],
        className,
      )}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
    >
      <Search className="h-[18px] w-[18px] shrink-0 text-faint" aria-hidden />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-ink outline-none placeholder:text-faint"
        {...props}
      />
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
}
