import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar,
  CreditCard,
  Landmark,
  Lock,
  MapPin,
  Package,
  ShoppingBag,
  Tag,
  Truck,
  Wallet,
} from "../lib/fa";
import { Navbar, Footer } from "../components/layout/Navbar";
import { Button, Reveal } from "../components/ui/core";
import { Input, RadioGroup, Select, Textarea } from "../components/ui/forms";
import { Breadcrumb, EmptyState } from "../components/ui/display";
import { useToast } from "../components/ui/overlays";
import { PROVINCES } from "../lib/data";
import { createOrder, getListings } from "../lib/services";
import { useAsyncData } from "../lib/useAsyncData";
import { useAuth } from "../context/AuthContext.jsx";
import { formatPrice } from "../lib/utils";

const DELIVERY_OPTIONS = [
  { value: "standard", label: "Standard delivery", sub: "$5.00 · 3–5 days" },
  { value: "express", label: "Express delivery", sub: "$12.00 · 24 hours" },
];

const PAYMENT_OPTIONS = [
  { value: "cod", label: "Cash on delivery", sub: "Pay when it arrives" },
  { value: "bank", label: "Bank transfer", sub: "ABA & ACLEDA" },
  { value: "card", label: "Card payment", sub: "Visa / Mastercard" },
];

export default function Checkout() {
  const [params] = useSearchParams();
  const requestedId = params.get("item");
  const requestedQty = Math.max(1, Number(params.get("qty")) || 100);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [listings] = useAsyncData(getListings, []);

  const items = useMemo(() => {
    if (requestedId) {
      const match = listings.find((listing) => listing.id === requestedId);
      if (match) return [{ ...match, qty: requestedQty }];
      return [];
    }
    return listings.slice(0, 1).map((listing) => ({ ...listing, qty: 100 }));
  }, [requestedId, requestedQty, listings]);

  const [shipping, setShipping] = useState({ fullName: "", phone: "", province: "", district: "", address: "" });
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("cod");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [placing, setPlacing] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items],
  );
  const deliveryCost = delivery === "express" ? 12 : 5;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryCost - discount;

  const setField = (field) => (e) =>
    setShipping((prev) => ({ ...prev, [field]: e.target.value }));

  const applyCoupon = (e) => {
    e.preventDefault();
    if (!coupon.trim()) {
      toast.warning("Enter a code", "Type your coupon code before applying.");
      return;
    }
    if (coupon.trim().toUpperCase() === "RICE10") {
      setCouponApplied(true);
      toast.success("Coupon applied!", "You saved 10% on your order.");
    } else {
      setCouponApplied(false);
      toast.error("Invalid coupon", "That code doesn't exist or has expired.");
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in required", "Please log in to place an order.");
      navigate("/login");
      return;
    }
    if (!shipping.fullName || !shipping.phone) {
      toast.error("Shipping details missing", "Please add your name and phone number.");
      return;
    }
    if (payment === "card" && (!card.number || !card.expiry || !card.cvc)) {
      toast.error("Card details missing", "Please complete your card information.");
      return;
    }
    setPlacing(true);
    const orderNumber = `KRH-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().slice(0, 10);
    const result = await createOrder({
      orderNumber,
      date: today,
      status: "Processing",
      buyerId: user.uid,
      buyerName: user.name || user.displayName || shipping.fullName,
      items: items.map(({ id, name, qty, price, farmerId, farmer }) => ({
        listingId: id,
        name,
        qty,
        unitPrice: price,
        farmerId: farmerId || null,
        farmer: farmer || "Farmer",
      })),
      farmerId: items[0]?.farmerId || null,
      total,
      payment: payment === "cod" ? "Pending" : "Paid",
      delivery,
      address: `${shipping.address || shipping.district || shipping.province || "Phnom Penh"}`,
      tracking: [
        { label: "Order placed", date: today, done: true },
        { label: "Confirmed by farmer", date: null, done: false },
        { label: "In transit", date: null, done: false },
        { label: "Delivered", date: null, done: false },
      ],
    });
    setPlacing(false);
    if (!result.ok) {
      toast.error("Could not place order", "Check your connection and try again.");
      return;
    }
    toast.success("Order placed!", "Your harvest is being prepared by the farm.");
    navigate("/order-success", {
      state: {
        orderNumber,
        items,
        subtotal,
        deliveryCost,
        discount,
        total,
        delivery,
        payment,
        address: `${shipping.address || shipping.district || shipping.province || "Phnom Penh"}`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Marketplace", to: "/marketplace" },
            { label: "Checkout" },
          ]}
        />

        <div className="mt-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary">
            <ShoppingBag className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Checkout</h1>
            <p className="text-sm text-subtle">Almost there — confirm your order details.</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={Package}
              title="Nothing to check out"
              description="This rice listing isn't available right now. Pick another harvest from the marketplace."
              action={
                <Button as={Link} to="/marketplace">
                  Back to marketplace
                </Button>
              }
            />
          </div>
        ) : (
          <form onSubmit={placeOrder} className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <Reveal className="card p-7 sm:p-8">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <MapPin className="h-5 w-5 text-primary" aria-hidden />
                Shipping information
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Input
                  label="Full name"
                  placeholder="Dara K."
                  value={shipping.fullName}
                  onChange={setField("fullName")}
                />
                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="+855 12 345 678"
                  value={shipping.phone}
                  onChange={setField("phone")}
                />
                <Select
                  label="Province"
                  value={shipping.province}
                  onChange={setField("province")}
                >
                  <option value="">Select a province</option>
                  {PROVINCES.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </Select>
                <Input
                  label="District / Commune"
                  placeholder="e.g. Banan"
                  value={shipping.district}
                  onChange={setField("district")}
                />
                <Textarea
                  label="Delivery address"
                  placeholder="Street, village, and landmark for the driver…"
                  rows={3}
                  className="sm:col-span-2"
                  value={shipping.address}
                  onChange={setField("address")}
                />
              </div>
            </Reveal>

            <Reveal className="card p-7 sm:p-8" delay={80}>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <Truck className="h-5 w-5 text-primary" aria-hidden />
                Delivery method
              </h2>
              <RadioGroup
                className="mt-6"
                value={delivery}
                onChange={setDelivery}
                options={DELIVERY_OPTIONS}
              />
            </Reveal>

            <Reveal className="card p-7 sm:p-8" delay={120}>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <Wallet className="h-5 w-5 text-primary" aria-hidden />
                Payment method
              </h2>
              <RadioGroup
                className="mt-6"
                value={payment}
                onChange={setPayment}
                options={PAYMENT_OPTIONS}
              />
              {payment === "card" && (
                <div className="mt-6 grid gap-5 rounded-card border border-line bg-bg p-5 sm:grid-cols-[1fr_120px_100px]">
                  <Input
                    label="Card number"
                    placeholder="4242 4242 4242 4242"
                    icon={CreditCard}
                    value={card.number}
                    onChange={(e) => setCard((prev) => ({ ...prev, number: e.target.value }))}
                  />
                  <Input
                    label="Expiry"
                    placeholder="MM/YY"
                    icon={Calendar}
                    value={card.expiry}
                    onChange={(e) => setCard((prev) => ({ ...prev, expiry: e.target.value }))}
                  />
                  <Input
                    label="CVC"
                    placeholder="123"
                    icon={Lock}
                    value={card.cvc}
                    onChange={(e) => setCard((prev) => ({ ...prev, cvc: e.target.value }))}
                  />
                </div>
              )}
              {payment === "bank" && (
                <div className="mt-6 flex items-center gap-4 rounded-card border border-line bg-bg p-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary">
                    <Landmark className="h-6 w-6" aria-hidden />
                  </span>
                  <p className="text-sm leading-6 text-subtle">
                    We'll send our ABA and ACLEDA account details to your email after you
                    place the order.
                  </p>
                </div>
              )}
            </Reveal>

            <Reveal className="card p-7 sm:p-8" delay={160}>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <Tag className="h-5 w-5 text-primary" aria-hidden />
                Coupon code
              </h2>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="Try RICE10"
                  icon={Tag}
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1"
                  disabled={couponApplied}
                />
                <Button type="button" variant="secondary" onClick={applyCoupon} disabled={couponApplied}>
                  {couponApplied ? "Applied" : "Apply"}
                </Button>
              </div>
              {couponApplied && (
                <p className="mt-3 text-sm font-semibold text-success">
                  RICE10 applied — 10% off your subtotal.
                </p>
              )}
            </Reveal>
          </div>

          <Reveal className="card sticky top-24 p-6" delay={120}>
            <h2 className="font-display text-lg font-bold text-ink">Order summary</h2>
            <div className="mt-5 divide-y divide-line">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-4 first:pt-0">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary">
                    <Package className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/rice/${item.id}`}
                      className="block truncate text-sm font-semibold text-ink transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-subtle">
                      {item.qty.toLocaleString()} kg × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-ink">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
              <div className="flex items-center justify-between text-subtle">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-subtle">
                <span>Delivery</span>
                <span className="font-semibold text-ink">
                  {delivery === "express" ? formatPrice(12) : formatPrice(5)}
                </span>
              </div>
              {couponApplied && (
                <div className="flex items-center justify-between text-success">
                  <span>Coupon (10%)</span>
                  <span className="font-semibold">−{formatPrice(discount)}</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="font-display text-base font-bold text-ink">Total</span>
              <span className="font-display text-2xl font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>
            <Button type="submit" size="lg" className="mt-6 w-full" loading={placing} icon={Lock}>
              Place order
            </Button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-faint">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Payments are encrypted and secure
            </p>
          </Reveal>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
