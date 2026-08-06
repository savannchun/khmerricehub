import { Link, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Package, ShoppingBag, Truck, Wallet } from "lucide-react";
import { Navbar, Footer } from "../components/layout/Navbar";
import { Button } from "../components/ui/core";
import { RICE_LISTINGS as DEMO_LISTINGS } from "../lib/data";
import { getListings } from "../lib/services";
import { useAsyncData } from "../lib/useAsyncData";
import { formatPrice } from "../lib/utils";

const PAYMENT_LABELS = {
  cod: "Cash on delivery",
  bank: "Bank transfer (ABA / ACLEDA)",
  card: "Card payment",
};

const DELIVERY_LABELS = {
  standard: "Standard delivery · 3–5 days",
  express: "Express delivery · 24 hours",
};

export default function OrderSuccess() {
  const location = useLocation();
  const state = location.state || {};
  const [listings] = useAsyncData(getListings, DEMO_LISTINGS);

  const orderNumber = state.orderNumber || "KRH-1042";
  const items = state.items?.length
    ? state.items
    : listings.slice(0, 2).map((listing) => ({ ...listing, qty: 100 }));
  const subtotal = state.subtotal ?? items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryCost = state.deliveryCost ?? 5;
  const discount = state.discount ?? 0;
  const total = state.total ?? subtotal + deliveryCost - discount;
  const payment = state.payment || "cod";
  const delivery = state.delivery || "standard";
  const address = state.address || "Phnom Penh, Cambodia";

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="mx-auto max-w-2xl px-5 py-20 sm:py-24">
        <div className="text-center">
          <div className="relative mx-auto h-24 w-24">
            <span className="absolute inset-0 animate-ping rounded-full bg-success/20" aria-hidden />
            <svg viewBox="0 0 96 96" className="relative h-24 w-24 animate-scale-in" role="img" aria-label="Order confirmed">
              <circle cx="48" cy="48" r="46" fill="#ecfdf3" stroke="#22c55e" strokeWidth="2" />
              <path
                d="M30 50 l12 12 L66 36"
                fill="none"
                stroke="#22c55e"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink sm:text-4xl">
            Order confirmed!
          </h1>
          <p className="mt-3 text-subtle">
            Your harvest is being prepared by the farm. We'll keep you updated at every step.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-ink shadow-card">
            <Package className="h-4 w-4 text-primary" aria-hidden />
            Order {orderNumber}
          </p>
        </div>

        <section className="card mt-10 overflow-hidden">
          <div className="border-b border-line bg-bg px-6 py-4">
            <h2 className="font-display text-base font-bold text-ink">Receipt</h2>
          </div>
          <div className="divide-y divide-line px-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                  <p className="mt-0.5 text-xs text-subtle">
                    {item.qty.toLocaleString()} kg × {formatPrice(item.price)}
                  </p>
                </div>
                <span className="text-sm font-bold text-ink">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 px-6 py-5">
            <div className="flex items-center justify-between text-sm text-subtle">
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" aria-hidden />
                Delivery estimate
              </span>
              <span className="font-semibold text-ink">{DELIVERY_LABELS[delivery]}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-subtle">
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" aria-hidden />
                Payment method
              </span>
              <span className="font-semibold text-ink">{PAYMENT_LABELS[payment]}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm text-subtle">
              <span className="flex shrink-0 items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden />
                Ship to
              </span>
              <span className="truncate font-semibold text-ink">{address}</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-line bg-bg px-6 py-5">
            <span className="font-display text-base font-bold text-ink">Total paid</span>
            <span className="font-display text-2xl font-bold text-primary">{formatPrice(total)}</span>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button as={Link} to="/buyer/orders" size="lg" icon={ShoppingBag}>
            Track order
          </Button>
          <Button as={Link} to="/marketplace" size="lg" variant="secondary" icon={ArrowRight}>
            Continue shopping
          </Button>
        </div>

        <p className="mt-10 text-center text-sm text-subtle">
          A confirmation email with your receipt has been sent to your inbox.
        </p>
      </main>

      <Footer />
    </div>
  );
}
