import { Link } from "react-router-dom";
import {
  Wheat,
  ShoppingBag,
  DollarSign,
  MessageSquare,
  Eye,
  Users,
  Plus,
  ListChecks,
  TrendingUp,
  BadgeCheck,
} from "../../lib/fa";
import { DashboardLayout } from "../../components/layout/DashboardLayout.jsx";
import { StatCard } from "../../components/ui/display.jsx";
import { Button, IconButton } from "../../components/ui/core.jsx";
import { Avatar, Rating, ProgressBar, StatusChip, Badge } from "../../components/ui/display.jsx";
import { Table, THead, TH, TR, TD, RowActions, RowAction } from "../../components/ui/display.jsx";
import { AreaChart, BarChart, HBarList, ProgressRing } from "../../components/charts.jsx";
import {
  NAV_FARMER,
  FARMERS as DEMO_FARMERS,
  MONTHS,
  REVENUE_SERIES,
  ORDERS_SERIES,
  TOP_PRODUCTS,
} from "../../lib/data.js";
import { getFarmers, getListings, getOrders } from "../../lib/services.js";
import { useAsyncData } from "../../lib/useAsyncData.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatPrice, formatDate } from "../../lib/utils.js";

const QUICK_ACTIONS = [
  { label: "Add listing", to: "/farmer/listings/add", icon: Plus, accent: "bg-primary-50 text-primary" },
  { label: "Manage listings", to: "/farmer/listings", icon: ListChecks, accent: "bg-gold-50 text-gold-dark" },
  { label: "Messages", to: "/farmer/messages", icon: MessageSquare, accent: "bg-info-50 text-info" },
  { label: "Browse market", to: "/marketplace", icon: TrendingUp, accent: "bg-success-50 text-success" },
];

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [farmers] = useAsyncData(getFarmers, DEMO_FARMERS);
  const [listings] = useAsyncData(getListings, []);
  const loadMine = async () => {
    if (!user) return [];
    const all = await getOrders();
    return all.filter((o) => o.farmerId === user.uid);
  };
  const [orders] = useAsyncData(loadMine, [], [user?.uid]);

  const store = farmers[0] || DEMO_FARMERS[0];
  const storeProducts = listings.filter((r) => r.farmerId === user?.uid);

  return (
    <DashboardLayout
      nav={NAV_FARMER}
      title="Farmer Dashboard"
      subtitle={`${store.name} · ${store.province}`}
      notificationPath="/farmer/notifications"
      accent="bg-primary-dark"
    >
      {/* Store header */}
      <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={store.owner} size="xl" online />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-bold text-ink">{store.name}</h2>
              {store.verified && (
                <BadgeCheck className="h-5 w-5 text-primary" aria-label="Verified store" />
              )}
              <Badge variant="success">Verified</Badge>
            </div>
            <p className="mt-0.5 text-sm text-subtle">
              {store.owner} · {store.province}, {store.district}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Rating value={store.rating} />
              <span className="text-sm font-bold text-ink">{store.rating}</span>
              <span className="text-sm text-faint">({store.reviews} reviews)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button as={Link} to="/farmer/listings/add" icon={Plus}>
            New listing
          </Button>
          <Button as={Link} to="/marketplace" variant="secondary">
            Visit public store
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Products" value={storeProducts.length} icon={Wheat} iconClassName="bg-primary-50 text-primary" />
        <StatCard label="Orders" value={orders.length} icon={ShoppingBag} iconClassName="bg-gold-50 text-gold-dark" />
        <StatCard label="Revenue" value="$18,400" delta={9} icon={DollarSign} iconClassName="bg-success-50 text-success" />
        <StatCard label="Messages" value="8" delta={3} icon={MessageSquare} iconClassName="bg-info-50 text-info" />
        <StatCard label="Views" value="2,481" delta={18} icon={Eye} iconClassName="bg-primary-50 text-primary" />
        <StatCard label="Visitors" value="1,204" delta={7} icon={Users} iconClassName="bg-gold-50 text-gold-dark" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-ink">Sales Analytics</h3>
              <p className="text-sm text-subtle">Revenue in USD per month (thousands)</p>
            </div>
            <Badge variant="success" dot>+12% this month</Badge>
          </div>
          <AreaChart data={REVENUE_SERIES} labels={MONTHS} height={260} className="mt-6" />
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink">Orders</h3>
            <IconButton label="More info" className="h-8 w-8" />
          </div>
          <BarChart data={ORDERS_SERIES.map((v) => v / 10)} labels={MONTHS.slice(0, 6)} height={220} color="#43a047" className="mt-4" />
          <div className="mt-6 flex items-end justify-between border-t border-line pt-4">
            <div>
              <p className="text-xs text-faint">Total this year</p>
              <p className="text-2xl font-bold text-ink">3,935</p>
            </div>
            <Badge variant="success" dot>+18%</Badge>
          </div>
        </div>

        <div className="card p-6 xl:col-span-2">
          <h3 className="font-display text-base font-bold text-ink">Top Products</h3>
          <p className="text-sm text-subtle">Revenue leaders this quarter</p>
          <HBarList items={TOP_PRODUCTS.map((p) => ({ label: p.name, value: p.revenue, color: "#2e7d32" }))} className="mt-5" />
        </div>

        <div className="card flex flex-col items-center justify-center p-6 text-center">
          <h3 className="self-start font-display text-base font-bold text-ink">Profile completion</h3>
          <div className="mt-4">
            <ProgressRing value={store.completedProfile} size={120} label={`${store.completedProfile}%`} />
          </div>
          <p className="mt-4 text-sm text-subtle">Complete your store profile to rank higher in search.</p>
          <Button as={Link} to="/farmer/profile" variant="secondary" size="sm" className="mt-4">
            Complete profile
          </Button>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card mt-6">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h3 className="font-display text-base font-bold text-ink">Recent Orders</h3>
          <Button as={Link} to="/farmer/orders" variant="ghost" size="sm">
            View all
          </Button>
        </div>
        <Table>
          <THead>
            <TH>Order</TH>
            <TH>Items</TH>
            <TH>Total</TH>
            <TH>Date</TH>
            <TH>Status</TH>
            <TH></TH>
          </THead>
          <tbody>
            {orders.slice(0, 4).map((order) => (
              <TR key={order.id}>
                <TD className="font-semibold text-ink">{order.id}</TD>
                <TD>{(order.items || []).map((i) => i.name).join(", ") || "—"}</TD>
                <TD className="font-bold text-ink">{formatPrice(order.total)}</TD>
                <TD className="text-subtle">{formatDate(order.date)}</TD>
                <TD><StatusChip status={order.status} /></TD>
                <TD>
                  <RowActions>
                    <RowAction icon={ShoppingBag} onClick={() => {}}>View order</RowAction>
                    <RowAction icon={Eye} onClick={() => {}}>Update status</RowAction>
                  </RowActions>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
        {orders.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-subtle">
            No orders yet — they'll appear here once buyers place them.
          </p>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="card group flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <span className={`grid h-12 w-12 place-items-center rounded-xl transition-transform group-hover:scale-110 ${action.accent}`}>
              <action.icon className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-ink">{action.label}</p>
              <p className="text-xs text-subtle">Go →</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stock health */}
      <div className="card mt-6 p-6">
        <h3 className="font-display text-base font-bold text-ink">Stock health</h3>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {storeProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="rounded-card bg-bg p-4">
              <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
              <p className="mt-0.5 text-xs text-subtle">
                {(product.quantity || 0).toLocaleString()} kg · {formatPrice(product.price)}/kg
              </p>
              <ProgressBar value={product.stock} className="mt-3" label="Stock" />
            </div>
          ))}
          {storeProducts.length === 0 && (
            <p className="rounded-card border border-dashed border-line bg-bg px-4 py-6 text-center text-sm text-subtle sm:col-span-2 lg:col-span-4">
              Add a listing to start tracking your stock here.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
