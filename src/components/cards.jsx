import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  Eye,
  Package,
  Download,
  Repeat,
  MessageSquare,
  BadgeCheck,
  Clock,
  Paperclip,
  FileText,
} from "lucide-react";
import { cx, formatDate, formatPrice, timeAgo } from "../lib/utils";
import { Avatar, Rating, StatusChip, Badge } from "./ui/display";
import { Button, IconButton } from "./ui/core";

/* ==================== Rice Card ==================== */
export function RiceCard({ item, view = "grid", favorite, onToggleFavorite, className }) {
  const image = (
    <div className="relative h-52 overflow-hidden bg-primary-50 sm:h-56">
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite?.(item);
        }}
        aria-label={favorite ? `Remove ${item.name} from favorites` : `Save ${item.name} to favorites`}
        aria-pressed={favorite}
        className="absolute right-3.5 top-3.5 grid h-10 w-10 place-items-center rounded-full bg-surface/95 text-ink shadow-card backdrop-blur transition-all duration-200 hover:scale-110"
      >
        <Heart
          className={cx("h-5 w-5 transition-colors", favorite && "fill-danger text-danger")}
          aria-hidden
        />
      </button>
      {item.status && item.status !== "Published" && (
        <div className="absolute left-3.5 top-3.5">
          <StatusChip status={item.status} />
        </div>
      )}
      {item.organic && (
        <Badge variant="success" className="absolute bottom-3.5 left-3.5 bg-surface/95 ring-0">
          Organic
        </Badge>
      )}
    </div>
  );

  if (view === "list") {
    return (
      <article className={cx("card group flex flex-col gap-5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row", className)}>
        <Link
          to={`/rice/${item.id}`}
          className="block h-44 w-full shrink-0 overflow-hidden rounded-xl bg-primary-50 sm:w-56"
        >
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {item.type}
              </p>
              <Link
                to={`/rice/${item.id}`}
                className="mt-1 block font-display text-lg font-bold text-ink transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-subtle">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {item.province} · {item.district}
              </p>
            </div>
            <IconButton
              label={favorite ? "Remove from favorites" : "Save to favorites"}
              onClick={() => onToggleFavorite?.(item)}
              className={favorite ? "text-danger" : ""}
            >
              <Heart className={cx("h-5 w-5", favorite && "fill-danger text-danger")} />
            </IconButton>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Rating value={item.rating} showValue />
            <span className="text-sm text-faint">({item.reviews} reviews)</span>
          </div>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
            <div>
              <p className="text-xs text-faint">Price</p>
              <p className="text-xl font-bold text-primary">
                {formatPrice(item.price)}
                <span className="text-xs font-medium text-subtle"> / kg</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm text-subtle">
                <Package className="h-4 w-4" aria-hidden />
                {item.quantity.toLocaleString()} kg
              </span>
              <span className="flex items-center gap-1.5 text-sm text-subtle">
                <BadgeCheck className="h-4 w-4 text-primary" aria-hidden />
                {item.farmer}
              </span>
            </div>
            <Button as={Link} to={`/rice/${item.id}`} variant="secondary" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cx("card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover", className)}>
      <Link to={`/rice/${item.id}`} className="block" aria-label={item.name}>
        {image}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {item.type}
            </p>
            <Link
              to={`/rice/${item.id}`}
              className="mt-1 block truncate font-display text-base font-bold text-ink transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-subtle">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{item.province}</span>
            </p>
          </div>
          <span className="flex items-center gap-1 whitespace-nowrap text-sm font-bold text-gold-dark">
            <Rating value={item.rating} />
            <span>{item.rating}</span>
          </span>
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="text-xs text-faint">Price</p>
            <p className="text-xl font-bold text-primary">
              {formatPrice(item.price)}
              <span className="text-xs font-medium text-subtle"> / kg</span>
            </p>
          </div>
          <div className="text-right text-xs text-subtle">
            <p>{item.quantity.toLocaleString()} kg in stock</p>
            <p className="mt-0.5 font-semibold text-ink">{item.farmer}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            as={Link}
            to={`/rice/${item.id}`}
            variant="secondary"
            size="sm"
            icon={Eye}
          >
            Details
          </Button>
          <Button
            as={Link}
            to={`/checkout?item=${item.id}`}
            size="sm"
            icon={Package}
            className="bg-primary-50 text-primary hover:bg-primary-100"
          >
            Order
          </Button>
        </div>
      </div>
    </article>
  );
}

/* ==================== Farmer Card ==================== */
export function FarmerCard({ farmer, className }) {
  return (
    <article className={cx("card flex flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover", className)}>
      <Avatar name={farmer.owner} size="xl" online={farmer.verified} />
      <div className="mt-4 flex items-center gap-2">
        <h3 className="font-display text-lg font-bold text-ink">{farmer.name}</h3>
        {farmer.verified && <BadgeCheck className="h-5 w-5 text-primary" aria-label="Verified" />}
      </div>
      <p className="mt-1 text-sm text-subtle">
        {farmer.province} · {farmer.owner}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Rating value={farmer.rating} />
        <span className="text-sm font-bold text-ink">{farmer.rating}</span>
        <span className="text-sm text-faint">({farmer.reviews})</span>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-subtle">{farmer.bio}</p>
      <div className="mt-5 grid w-full grid-cols-2 gap-3 border-t border-line pt-4 text-center">
        <div>
          <p className="text-lg font-bold text-ink">{farmer.products}</p>
          <p className="text-xs text-subtle">Products</p>
        </div>
        <div>
          <p className="text-lg font-bold text-ink">
            {farmer.followers.toLocaleString()}
          </p>
          <p className="text-xs text-subtle">Followers</p>
        </div>
      </div>
      <Button as={Link} to="/marketplace" variant="secondary" className="mt-5 w-full" icon={MessageSquare}>
        Visit store
      </Button>
    </article>
  );
}

/* ==================== Order Card ==================== */
export function OrderCard({ order, className }) {
  return (
    <article className={cx("card overflow-hidden transition-all duration-300 hover:shadow-card-hover", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-bold text-ink">{order.id}</span>
          <StatusChip status={order.status} />
        </div>
        <div className="flex items-center gap-4 text-sm text-subtle">
          <span>{formatDate(order.date)}</span>
          <span className="font-bold text-ink">{formatPrice(order.total)}</span>
        </div>
      </div>
      <div className="divide-y divide-line">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary">
              <Package className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <Link
                to={`/rice/${item.listingId}`}
                className="truncate text-sm font-semibold text-ink transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
              <p className="text-xs text-subtle">
                {item.qty.toLocaleString()} kg × {formatPrice(item.unitPrice)}
              </p>
            </div>
            <span className="text-sm font-bold text-ink">
              {formatPrice(item.qty * item.unitPrice)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-4">
        <Button as={Link} to={`/buyer/orders/${order.id}`} variant="secondary" size="sm" icon={FileText}>
          Track order
        </Button>
        <Button variant="ghost" size="sm" icon={Download}>
          Invoice
        </Button>
        <Button variant="ghost" size="sm" icon={Repeat}>
          Reorder
        </Button>
      </div>
    </article>
  );
}

/* ==================== Review Card ==================== */
export function ReviewCard({ review, className }) {
  return (
    <figure className={cx("card p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={review.name} size="md" />
          <div>
            <figcaption className="text-sm font-bold text-ink">{review.name}</figcaption>
            <p className="text-xs text-subtle">{review.role}</p>
          </div>
        </div>
        <time className="text-xs text-faint">{formatDate(review.date)}</time>
      </div>
      <Rating value={review.rating} className="mt-4" />
      <blockquote className="mt-3 text-sm leading-7 text-ink-soft">
        “{review.text}”
      </blockquote>
    </figure>
  );
}

/* ==================== Notification Card ==================== */
export function NotificationCard({ item, className, onMarkRead }) {
  return (
    <button
      type="button"
      onClick={onMarkRead}
      className={cx(
        "flex w-full items-start gap-4 rounded-card border p-4 text-left transition-all hover:shadow-card",
        item.read ? "border-line bg-surface" : "border-primary/20 bg-primary-50/60",
        className,
      )}
    >
      <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <span
          className={cx(
            "absolute inline-flex h-3.5 w-3.5 rounded-full",
            item.read ? "bg-line-dark" : "animate-pulse-soft bg-danger",
          )}
        />
        {!item.read && (
          <span className="absolute inline-flex h-3.5 w-3.5 animate-ping rounded-full bg-danger/40" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wide text-primary">
            {item.type}
          </span>
          <time className="shrink-0 text-xs text-faint">{timeAgo(item.time)}</time>
        </div>
        <p className="mt-1 text-sm font-bold text-ink">{item.title}</p>
        <p className="mt-0.5 text-sm leading-6 text-subtle">{item.body}</p>
      </div>
    </button>
  );
}

/* ==================== Conversation Card ==================== */
export function ConversationCard({ conversation, active, onClick }) {
  const last = conversation.messages[conversation.messages.length - 1];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cx(
        "flex w-full items-start gap-3 rounded-card border p-4 text-left transition-all",
        active
          ? "border-primary bg-primary-50/70 ring-2 ring-primary/10"
          : "border-transparent hover:border-line hover:bg-surface",
      )}
    >
      <Avatar name={conversation.with.name} size="md" online={conversation.with.online} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-bold text-ink">{conversation.with.name}</p>
          <time className="shrink-0 text-xs text-faint">{timeAgo(last.time)}</time>
        </div>
        <p
          className={cx(
            "mt-0.5 flex items-center gap-1.5 truncate text-sm",
            conversation.unread ? "font-semibold text-ink" : "text-subtle",
          )}
        >
          {last.from === "me" && <Clock className="h-3.5 w-3.5 shrink-0 text-faint" aria-hidden />}
          {last.text}
        </p>
      </div>
      {conversation.unread > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
          {conversation.unread}
        </span>
      )}
    </button>
  );
}

/* ==================== Attachment (for messages) ==================== */
export function AttachmentButton({ className }) {
  return (
    <IconButton label="Attach file" variant="ghost" className={className}>
      <Paperclip className="h-5 w-5" />
    </IconButton>
  );
}
