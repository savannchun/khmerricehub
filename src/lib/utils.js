export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCompact(value) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(iso) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secondsPer] of units) {
    const value = Math.floor(seconds / secondsPer);
    if (value >= 1) return `${value} ${name}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function classForStatus(status) {
  const map = {
    Published: "success",
    Active: "success",
    Paid: "success",
    Delivered: "success",
    Completed: "success",
    Approved: "success",
    Verified: "success",
    Online: "success",
    Draft: "neutral",
    Processing: "info",
    Pending: "warning",
    Shipped: "info",
    Paused: "warning",
    Low: "warning",
    Suspended: "danger",
    Rejected: "danger",
    Failed: "danger",
    Canceled: "danger",
    Sold_Out: "neutral",
    "Sold Out": "neutral",
  };
  return map[status] || "neutral";
}
