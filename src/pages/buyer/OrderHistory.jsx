import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  DollarSign,
  PackageSearch,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/core";
import { EmptyState, StatCard, Tabs } from "../../components/ui/display";
import { OrderCard } from "../../components/cards";
import { NAV_BUYER, ORDERS as DEMO_ORDERS } from "../../lib/data";
import { getOrders } from "../../lib/services";
import { useAsyncData } from "../../lib/useAsyncData";

export default function OrderHistory() {
  const { id } = useParams();
  const [tab, setTab] = useState("All");
  const [allOrders] = useAsyncData(getOrders, DEMO_ORDERS);

  const statuses = ["All", "Processing", "Shipped", "Delivered", "Completed"];
  const tabs = statuses.map((status) => ({
    value: status,
    label: status,
    count:
      status === "All"
        ? allOrders.length
        : allOrders.filter((o) => o.status === status).length,
  }));

  const orders = [...allOrders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((order) => tab === "All" || order.status === tab);

  return (
    <DashboardLayout
      nav={NAV_BUYER}
      title="Order History"
      subtitle="Track and manage your rice orders"
      notificationPath="/buyer/notifications"
    >
      <div className="space-y-8">
        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard label="Total orders" value="12" delta={8} icon={ShoppingBag} />
          <StatCard
            label="Total spent"
            value="$1,240"
            icon={DollarSign}
            iconClassName="bg-gold-50 text-gold-dark"
          />
          <StatCard
            label="In transit"
            value="1"
            icon={Truck}
            iconClassName="bg-info-50 text-info"
          />
          <StatCard
            label="Delivered"
            value="10"
            delta={12}
            icon={CheckCircle2}
            iconClassName="bg-success-50 text-success"
          />
        </section>

        <section className="card p-4 sm:p-5">
          <Tabs items={tabs} active={tab} onChange={setTab} className="w-full" />
        </section>

        {orders.length ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                className={id && order.id === id ? "ring-2 ring-primary ring-offset-2" : undefined}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={PackageSearch}
            title="No orders here"
            description={`You have no ${tab === "All" ? "orders" : `${tab.toLowerCase()} orders`} yet. Browse the marketplace to get started.`}
            action={
              <Button as={Link} to="/marketplace" icon={Store}>
                Browse marketplace
              </Button>
            }
          />
        )}
      </div>
    </DashboardLayout>
  );
}
