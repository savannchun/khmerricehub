import { Link } from "react-router-dom";
import {
  Users,
  Wheat,
  ShoppingCart,
  Package,
  ClipboardList,
  DollarSign,
  Clock,
  Activity,
  ShoppingBag,
  CircleDollarSign,
  Flag,
  UserPlus,
  BadgeCheck,
  ShieldCheck,
  BarChart3,
  ArrowUpRight,
} from "../../lib/fa";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AreaChart, BarChart, DonutChart } from "../../components/charts";
import { StatCard } from "../../components/ui/display";
import { cx, timeAgo } from "../../lib/utils";
import {
  NAV_ADMIN,
  STATS,
  MONTHS,
  REVENUE_SERIES,
  ORDERS_SERIES,
  VISITORS_SERIES,
  USER_BREAKDOWN,
  RECENT_ACTIVITIES,
} from "../../lib/data";

const ACTIVITY_STYLES = {
  user: { icon: Users, classes: "bg-info-50 text-info" },
  farmer: { icon: Wheat, classes: "bg-success-50 text-success" },
  product: { icon: Package, classes: "bg-primary-50 text-primary" },
  order: { icon: ShoppingBag, classes: "bg-gold-50 text-gold-dark" },
  payment: { icon: CircleDollarSign, classes: "bg-warning-50 text-warning" },
  report: { icon: Flag, classes: "bg-danger-50 text-danger" },
};

const QUICK_ACTIONS = [
  { label: "Manage users", description: "9,821 accounts", to: "/admin/users", icon: UserPlus },
  { label: "Approve farmers", description: "3 pending requests", to: "/admin/farmers", icon: BadgeCheck },
  { label: "Moderate products", description: "3 in review", to: "/admin/moderation", icon: ShieldCheck },
  { label: "View reports", description: "Analytics overview", to: "/admin/reports", icon: BarChart3 },
];

function ChartCard({ title, subtitle, className, children }) {
  return (
    <section className={cx("card p-5", className)}>
      <h2 className="font-display text-base font-bold text-ink">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-subtle">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function QuickAction({ icon: Icon, label, description, to }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-line bg-bg p-3.5 transition-all duration-200 hover:border-primary hover:bg-primary-50"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface text-primary shadow-card">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-ink">{label}</span>
        <span className="mt-0.5 block truncate text-xs text-subtle">{description}</span>
      </span>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-faint transition-colors group-hover:text-primary"
        aria-hidden
      />
    </Link>
  );
}

export default function AdminDashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <DashboardLayout
      nav={NAV_ADMIN}
      title="Admin Dashboard"
      subtitle="Website overview"
      notificationPath="/admin/dashboard"
      accent="bg-ink"
    >
      <div className="space-y-6">
        <section className="card relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-50" aria-hidden />
          <div className="pointer-events-none absolute -bottom-20 right-32 h-48 w-48 rounded-full bg-gold-50" aria-hidden />
          <div className="relative">
            <p className="text-sm font-semibold text-primary">{today}</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
              {greeting}, Vannak
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-subtle sm:text-base">
              Here's what's happening on KhmerRiceHub. Trading is healthy across {STATS.provinces}{" "}
              provinces with a {STATS.satisfaction}% satisfaction rate this week.
            </p>
            <p className="mt-5 rounded-xl border border-line bg-surface px-4 py-3 text-xs leading-5 text-subtle">
              All marketplace data — listings, orders, and users — is read live from Firestore.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total Users" value="9,821" delta={5} icon={Users} />
          <StatCard
            label="Total Farmers"
            value={STATS.farmers}
            delta={3}
            icon={Wheat}
            iconClassName="bg-gold-50 text-gold-dark"
          />
          <StatCard label="Total Buyers" value={STATS.buyers} delta={6} icon={ShoppingCart} />
          <StatCard
            label="Total Products"
            value={STATS.listings}
            delta={8}
            icon={Package}
            iconClassName="bg-info-50 text-info"
          />
          <StatCard
            label="Orders"
            value={STATS.monthlyOrders}
            delta={12}
            icon={ClipboardList}
            iconClassName="bg-gold-50 text-gold-dark"
          />
          <StatCard
            label="Revenue"
            value="$212k"
            delta={9}
            icon={DollarSign}
            iconClassName="bg-success-50 text-success"
          />
          <StatCard
            label="Pending Approvals"
            value={6}
            delta={4}
            trend="down"
            icon={Clock}
            iconClassName="bg-warning-50 text-warning"
          />
          <StatCard
            label="System Health"
            value="98%"
            delta={1}
            icon={Activity}
            iconClassName="bg-success-50 text-success"
          />
        </section>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <ChartCard
            title="Revenue Analytics"
            subtitle="Monthly revenue in thousands of US dollars"
            className="xl:col-span-2"
          >
            <AreaChart
              data={REVENUE_SERIES}
              labels={MONTHS}
              height={280}
              format={(value) => `$${value}k`}
            />
          </ChartCard>

          <ChartCard title="Orders Analytics" subtitle="Monthly order volume">
            <BarChart
              data={ORDERS_SERIES}
              labels={MONTHS}
              height={280}
              format={(value) => `${value} orders`}
            />
          </ChartCard>

          <ChartCard
            title="Traffic Analytics"
            subtitle="Monthly visitors"
            className="xl:col-span-2"
          >
            <AreaChart
              data={VISITORS_SERIES}
              labels={MONTHS}
              height={280}
              color="#f9a825"
            />
          </ChartCard>

          <ChartCard title="Users Breakdown" subtitle="Share of registered accounts">
            <DonutChart
              segments={USER_BREAKDOWN}
              centerValue="9.8k"
              centerLabel="Total users"
            />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <section className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-base font-bold text-ink">Recent activity</h2>
              <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary">
                {RECENT_ACTIVITIES.length} updates
              </span>
            </div>
            <ul className="mt-3 divide-y divide-line">
              {RECENT_ACTIVITIES.map((activity) => {
                const style = ACTIVITY_STYLES[activity.type] || ACTIVITY_STYLES.user;
                const Icon = style.icon;
                return (
                  <li key={activity.id} className="flex items-start gap-3 py-3">
                    <span
                      className={cx(
                        "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                        style.classes,
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">{activity.text}</p>
                      <p className="mt-0.5 truncate text-xs text-subtle">{activity.meta}</p>
                    </div>
                    <time className="shrink-0 text-xs text-faint">{timeAgo(activity.time)}</time>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="card p-5">
            <h2 className="font-display text-base font-bold text-ink">Quick actions</h2>
            <div className="mt-3 space-y-2.5">
              {QUICK_ACTIONS.map((action) => (
                <QuickAction key={action.to} {...action} />
              ))}
            </div>
          </section>

          <section className="card p-5">
            <h2 className="font-display text-base font-bold text-ink">Pending approvals</h2>
            <p className="mt-0.5 text-sm text-subtle">Action required from your team</p>
            <div className="mt-4 space-y-3">
              <Link
                to="/admin/farmers"
                className="group flex items-center gap-3 rounded-xl border border-line p-4 transition-all duration-200 hover:border-primary hover:bg-primary-50/50"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-warning-50 text-warning">
                  <BadgeCheck className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-ink">Farmer applications</span>
                  <span className="mt-0.5 block text-xs text-subtle">3 awaiting verification</span>
                </span>
                <span className="grid h-7 min-w-7 place-items-center rounded-full bg-primary px-2 text-xs font-bold text-white">
                  3
                </span>
              </Link>
              <Link
                to="/admin/moderation"
                className="group flex items-center gap-3 rounded-xl border border-line p-4 transition-all duration-200 hover:border-primary hover:bg-primary-50/50"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-danger-50 text-danger">
                  <ShieldCheck className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-ink">Product listings</span>
                  <span className="mt-0.5 block text-xs text-subtle">3 in moderation queue</span>
                </span>
                <span className="grid h-7 min-w-7 place-items-center rounded-full bg-primary px-2 text-xs font-bold text-white">
                  3
                </span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
