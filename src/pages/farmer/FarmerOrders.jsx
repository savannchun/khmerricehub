import { useMemo, useState } from "react";
import { Download, Eye, CheckCircle2, Truck } from "../../lib/fa";
import { DashboardLayout } from "../../components/layout/DashboardLayout.jsx";
import { Button, IconButton } from "../../components/ui/core.jsx";
import { SearchBar } from "../../components/ui/forms.jsx";
import {
  Tabs,
  StatusChip,
  Avatar,
  EmptyState,
  Pagination,
  Timeline,
  Table,
  THead,
  TH,
  TR,
  TD,
} from "../../components/ui/display.jsx";
import { Modal, useToast } from "../../components/ui/overlays.jsx";
import { NAV_FARMER } from "../../lib/data.js";
import { getOrders, updateOrderStatus } from "../../lib/services.js";
import { useAsyncData } from "../../lib/useAsyncData.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatDate, formatPrice } from "../../lib/utils.js";

const TABS = [
  { value: "All", label: "All" },
  { value: "New", label: "New" },
  { value: "Processing", label: "Processing" },
  { value: "Shipped", label: "Shipped" },
  { value: "Completed", label: "Completed" },
];

const NEXT_STATUS = {
  New: "Processing",
  Processing: "Shipped",
  Shipped: "Delivered",
};

export default function FarmerOrders() {
  const { user } = useAuth();
  const loadMine = async () => {
    if (!user) return [];
    const all = await getOrders();
    return all.filter((o) => o.farmerId === user.uid);
  };
  const [orders, setOrders] = useAsyncData(loadMine, [], [user?.uid]);
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const toast = useToast();

  const displayOrders = useMemo(
    () => orders.map((order) => ({ ...order, buyer: order.buyerName || order.buyer || "Buyer" })),
    [orders],
  );

  const filtered = useMemo(
    () =>
      displayOrders.filter((o) => {
        const matchTab =
          tab === "All" ||
          (tab === "New" ? o.status === "New" : o.status === tab);
        const matchQuery = `${o.id} ${o.buyer}`.toLowerCase().includes(query.toLowerCase());
        return matchTab && matchQuery;
      }),
    [displayOrders, tab, query],
  );

  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const countBy = (status) => displayOrders.filter((o) => o.status === status).length;

  const advance = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) {
      toast.info("No further action", `${order.id} is already ${order.status.toLowerCase()}.`);
      return;
    }
    const ok = await updateOrderStatus(order.id, next);
    if (!ok) {
      toast.error("Could not update order", "Check your connection and try again.");
      return;
    }
    setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
    toast.success("Status updated", `${order.id} moved to ${next}.`);
  };

  return (
    <DashboardLayout
      nav={NAV_FARMER}
      title="Orders"
      subtitle="Incoming orders from buyers"
      notificationPath="/farmer/notifications"
      accent="bg-primary-dark"
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "New orders", value: countBy("New"), cls: "text-info" },
          { label: "Processing", value: countBy("Processing"), cls: "text-warning" },
          { label: "Shipped", value: countBy("Shipped"), cls: "text-primary" },
          {
            label: "Delivered",
            value: displayOrders.filter((o) => o.status === "Delivered" || o.status === "Completed").length,
            cls: "text-success",
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className={`font-display text-3xl font-bold ${stat.cls}`}>{stat.value}</p>
            <p className="mt-1 text-sm font-medium text-subtle">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs items={TABS} active={tab} onChange={(v) => { setTab(v); setPage(1); }} variant="pill" />
        <div className="flex items-center gap-3">
          <SearchBar
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search order or buyer…"
            className="max-w-xs"
          />
          <Button variant="secondary" icon={Download} onClick={() => toast.success("Export started", "Orders exported as CSV.")}>
            Export
          </Button>
        </div>
      </div>

      {pageItems.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={Truck}
          title="No orders here"
          description="Orders matching this filter will appear here."
        />
      ) : (
        <div className="card mt-6 overflow-hidden">
          <Table>
            <THead>
              <TH>Order</TH>
              <TH>Buyer</TH>
              <TH>Items</TH>
              <TH>Total</TH>
              <TH>Date</TH>
              <TH>Status</TH>
              <TH>Actions</TH>
            </THead>
            <tbody>
              {pageItems.map((order) => (
                <TR key={order.id}>
                  <TD className="font-semibold text-ink">{order.id}</TD>
                  <TD>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={order.buyer} size="sm" />
                      <span className="text-ink">{order.buyer}</span>
                    </div>
                  </TD>
                  <TD className="max-w-xs truncate text-subtle">
                    {(order.items || []).map((i) => i.name).join(", ") || "—"}
                  </TD>
                  <TD className="font-bold text-ink">{formatPrice(order.total)}</TD>
                  <TD className="text-subtle">{formatDate(order.date)}</TD>
                  <TD><StatusChip status={order.status} /></TD>
                  <TD>
                    <div className="flex items-center gap-1">
                      <IconButton label="View order" size="sm" onClick={() => setViewing(order)}>
                        <Eye className="h-4 w-4" />
                      </IconButton>
                      {NEXT_STATUS[order.status] && (
                        <Button size="sm" variant="secondary" className="whitespace-nowrap" onClick={() => advance(order)}>
                          {NEXT_STATUS[order.status] === "Shipped" ? <Truck className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          Mark {NEXT_STATUS[order.status]}
                        </Button>
                      )}
                    </div>
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={page} total={totalPages} onChange={setPage} className="mt-8" />
      )}

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.id}
        description={`Placed on ${viewing ? formatDate(viewing.date) : ""} by ${viewing?.buyer || ""}`}
        size="lg"
      >
        {viewing && (
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide text-subtle">Items</h4>
              <div className="mt-3 divide-y divide-line rounded-card border border-line">
                {(viewing.items || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 text-sm">
                    <span className="font-medium text-ink">{item.name}</span>
                    <span className="text-subtle">
                      {item.qty} kg × {formatPrice(item.unitPrice)} ={" "}
                      <span className="font-bold text-ink">{formatPrice(item.qty * item.unitPrice)}</span>
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 text-sm font-bold text-ink">
                  <span>Total</span>
                  <span>{formatPrice(viewing.total)}</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-subtle">
                Payment: <span className="font-semibold text-ink">{viewing.payment}</span>
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide text-subtle">Tracking</h4>
              <Timeline
                className="mt-3"
                items={(viewing.tracking || []).map((step) => ({
                  label: step.label,
                  date: step.date || "Pending",
                  done: step.done,
                }))}
              />
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
