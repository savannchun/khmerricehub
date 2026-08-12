import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  MessageSquare,
  Bell,
  Store,
  ShoppingCart,
  CircleHelp,
} from "../../lib/fa";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/core";
import { Avatar, Rating, StatCard } from "../../components/ui/display";
import { NotificationCard, OrderCard, RiceCard } from "../../components/cards";
import { useToast } from "../../components/ui/overlays";
import { useAuth } from "../../context/AuthContext";
import {
  FARMERS as DEMO_FARMERS,
  NAV_BUYER,
  NOTIFICATIONS as DEMO_NOTIFICATIONS,
} from "../../lib/data";
import { getFarmers, getListings, getNotifications, getOrders } from "../../lib/services";
import { useAsyncData } from "../../lib/useAsyncData";
import { useFavorites } from "./useFavorites";

function QuickAction({ icon: Icon, label, description, to }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-card border border-line bg-surface p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-ink transition-colors group-hover:text-primary">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-xs text-subtle">{description}</span>
      </span>
    </Link>
  );
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const { count, isFavorite, toggle } = useFavorites();
  const [notifications, setNotifications] = useAsyncData(getNotifications, DEMO_NOTIFICATIONS);
  const loadMine = async () => {
    if (!user) return [];
    const all = await getOrders();
    return all.filter((o) => o.buyerId === user.uid);
  };
  const [orders] = useAsyncData(loadMine, [], [user?.uid]);
  const [listings] = useAsyncData(getListings, []);
  const [farmers] = useAsyncData(getFarmers, DEMO_FARMERS);
  const [following, setFollowing] = useState(() => new Set());

  const firstName = (user?.name || "Dara").split(" ")[0];

  const handleFavorite = (item) => {
    const removing = isFavorite(item.id);
    toggle(item.id);
    if (removing) toast.info("Removed from favorites", item.name);
    else toast.success("Added to favorites", item.name);
  };

  const markRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const toggleFollow = (farmer) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(farmer.id)) {
        next.delete(farmer.id);
        toast.info("Unfollowed", `You unfollowed ${farmer.name}.`);
      } else {
        next.add(farmer.id);
        toast.success("Now following", `You are now following ${farmer.name}.`);
      }
      return next;
    });
  };

  const quickActions = [
    { label: "Browse rice", description: "Explore fresh harvests", to: "/marketplace", icon: Store },
    { label: "Favorites", description: `${count} saved listings`, to: "/buyer/favorites", icon: Heart },
    { label: "New order", description: "Order bulk rice", to: "/marketplace", icon: ShoppingCart },
    { label: "Help", description: "Guides and FAQs", to: "/faq", icon: CircleHelp },
  ];

  return (
    <DashboardLayout
      nav={NAV_BUYER}
      title="Dashboard"
      subtitle="Welcome back, Dara"
      notificationPath="/buyer/notifications"
    >
      <div className="space-y-8">
        <section className="card relative overflow-hidden p-6 sm:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-50"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 right-32 h-48 w-48 rounded-full bg-gold-50"
            aria-hidden
          />
          <div className="relative">
            <p className="text-sm font-semibold text-primary">Welcome back</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
              Hello, {firstName}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-subtle sm:text-base">
              What would you like to do today? Browse fresh harvests or check on your latest
              orders.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total orders" value={String(orders.length)} icon={ShoppingBag} />
          <StatCard
            label="Favorites"
            value={count}
            delta={4}
            icon={Heart}
            iconClassName="bg-danger-50 text-danger"
          />
          <StatCard
            label="Messages"
            value="3"
            suffix="unread"
            delta={-2}
            trend="down"
            icon={MessageSquare}
            iconClassName="bg-info-50 text-info"
          />
          <StatCard
            label="Notifications"
            value="5"
            suffix="new"
            delta={12}
            icon={Bell}
            iconClassName="bg-gold-50 text-gold-dark"
          />
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold text-ink">Quick actions</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => (
              <QuickAction key={action.label} {...action} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section>
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-lg font-bold text-ink">Recent orders</h2>
                <Link
                  to="/buyer/orders"
                  className="text-sm font-semibold text-primary transition hover:text-primary-dark"
                >
                  View all
                </Link>
              </div>
              <div className="mt-4 space-y-4">
                {orders.length ? (
                  orders.slice(0, 2).map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <p className="rounded-card border border-dashed border-line bg-bg px-4 py-6 text-center text-sm text-subtle">
                    No orders yet —{" "}
                    <Link to="/marketplace" className="font-semibold text-primary hover:text-primary-dark">
                      browse the marketplace
                    </Link>
                  </p>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-lg font-bold text-ink">Recommended for you</h2>
                <Link
                  to="/marketplace"
                  className="text-sm font-semibold text-primary transition hover:text-primary-dark"
                >
                  Browse all
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {listings.length ? (
                  listings.slice(0, 3).map((item) => (
                    <RiceCard
                      key={item.id}
                      item={item}
                      favorite={isFavorite(item.id)}
                      onToggleFavorite={handleFavorite}
                    />
                  ))
                ) : (
                  <p className="rounded-card border border-dashed border-line bg-bg px-4 py-6 text-center text-sm text-subtle">
                    No rice listings published yet.
                  </p>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="card p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-lg font-bold text-ink">Notifications</h2>
                <Link
                  to="/buyer/notifications"
                  className="text-sm font-semibold text-primary transition hover:text-primary-dark"
                >
                  View all
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {notifications.slice(0, 4).map((item) => (
                  <NotificationCard
                    key={item.id}
                    item={item}
                    onMarkRead={() => markRead(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="card p-5">
              <h2 className="font-display text-lg font-bold text-ink">Top farmers to follow</h2>
              <ul className="mt-4 space-y-3">
                {farmers.slice(0, 4).map((farmer) => {
                  const isFollowing = following.has(farmer.id);
                  return (
                    <li key={farmer.id} className="flex items-center gap-3">
                      <Avatar name={farmer.owner} size="md" online={farmer.verified} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink">{farmer.name}</p>
                        <p className="flex items-center gap-1.5 text-xs text-subtle">
                          <Rating value={farmer.rating} />
                          <span className="font-bold text-ink">{farmer.rating}</span>
                          <span className="text-faint">({farmer.reviews})</span>
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={isFollowing ? "ghost" : "secondary"}
                        onClick={() => toggleFollow(farmer)}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
