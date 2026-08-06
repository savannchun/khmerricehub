import { useMemo, useState } from "react";
import {
  Clock,
  Download,
  Eye,
  HandCoins,
  PackageCheck,
  SearchX,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button, IconButton } from "../../components/ui/core";
import {
  EmptyState,
  Pagination,
  StatCard,
  StatusChip,
  TD,
  TH,
  THead,
  TR,
  Table,
  Timeline,
} from "../../components/ui/display";
import { Dialog, Modal, useToast } from "../../components/ui/overlays";
import { SearchBar, Select } from "../../components/ui/forms";
import { formatDate, formatPrice } from "../../lib/utils";
import { NAV_ADMIN, ORDERS as DEMO_ORDERS } from "../../lib/data";
import { getOrders } from "../../lib/services";
import { useAsyncData } from "../../lib/useAsyncData";

const BUYERS = {
  "KRH-1042": "Dara K.",
  "KRH-1029": "Nita V.",
  "KRH-1015": "Sopheak L.",
  "KRH-1009": "Chenda R.",
};

const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Completed", "Refunded", "Canceled"];

const PAGE_SIZE = 3;

export default function OrderManagement() {
  const toast = useToast();
  const [orders, setOrders] = useAsyncData(getOrders, DEMO_ORDERS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [refundTarget, setRefundTarget] = useState(null);
  const [viewing, setViewing] = useState(null);

  const counts = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === "Processing" || o.status === "Pending").length,
      shipped: orders.filter((o) => o.status === "Shipped").length,
      delivered: orders.filter((o) => o.status === "Delivered" || o.status === "Completed").length,
      refunds: orders.filter((o) => o.status === "Refunded").length,
    }),
    [orders],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return orders.filter((order) => {
      const buyer = BUYERS[order.id] || "Buyer";
      const matchesStatus = status === "All" || order.status === status;
      const matchesQuery =
        !term ||
        order.id.toLowerCase().includes(term) ||
        buyer.toLowerCase().includes(term) ||
        order.items.some((item) => item.name.toLowerCase().includes(term));
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = (id, next) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: next } : order)));
  };

  const confirmRefund = () => {
    updateStatus(refundTarget.id, "Refunded");
    toast.success("Refund issued", `${refundTarget.id} was refunded to ${BUYERS[refundTarget.id] || "the buyer"}.`);
    setRefundTarget(null);
  };

  const handleExport = () => {
    toast.success("Export started", "Orders are being downloaded as a CSV file.");
  };

  const clearFilters = () => {
    setQuery("");
    setStatus("All");
    setPage(1);
  };

  return (
    <DashboardLayout
      nav={NAV_ADMIN}
      title="Order Management"
      subtitle="Monitor and fulfil marketplace orders"
    >
      <div className="space-y-6">
        <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatCard label="Total orders" value={counts.total} icon={ShoppingBag} />
          <StatCard
            label="Pending"
            value={counts.pending}
            icon={Clock}
            iconClassName="bg-warning-50 text-warning"
          />
          <StatCard
            label="Shipped"
            value={counts.shipped}
            icon={Truck}
            iconClassName="bg-info-50 text-info"
          />
          <StatCard
            label="Delivered"
            value={counts.delivered}
            icon={PackageCheck}
            iconClassName="bg-success-50 text-success"
          />
          <StatCard
            label="Refunds"
            value={counts.refunds}
            icon={HandCoins}
            iconClassName="bg-danger-50 text-danger"
          />
        </section>

        <section className="card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SearchBar
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search order ID, buyer, or item…"
              className="lg:max-w-md"
            />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Select
                label="Filter by status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="sm:w-52"
              >
                <option value="All">All statuses</option>
                {ORDER_STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <Button variant="secondary" size="md" icon={Download} onClick={handleExport}>
                Export CSV
              </Button>
            </div>
          </div>
        </section>

        <section className="card overflow-hidden">
          {pageItems.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={SearchX}
                title="No orders found"
                description="Try a different search term or status filter to find the orders you need."
                action={
                  <Button variant="secondary" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            </div>
          ) : (
            <Table>
              <THead>
                <TH>Order</TH>
                <TH>Buyer</TH>
                <TH>Date</TH>
                <TH>Items</TH>
                <TH>Total</TH>
                <TH>Payment</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </THead>
              <tbody>
                {pageItems.map((order) => {
                  const buyer = BUYERS[order.id] || "Buyer";
                  return (
                    <TR key={order.id}>
                      <TD className="whitespace-nowrap font-display text-sm font-bold text-ink">
                        {order.id}
                      </TD>
                      <TD className="whitespace-nowrap font-semibold text-ink">{buyer}</TD>
                      <TD className="whitespace-nowrap text-subtle">{formatDate(order.date)}</TD>
                      <TD className="max-w-[220px]">
                        <p className="truncate text-subtle">
                          {order.items.map((item) => item.name).join(", ")}
                        </p>
                      </TD>
                      <TD className="whitespace-nowrap font-bold text-ink">
                        {formatPrice(order.total)}
                      </TD>
                      <TD className="whitespace-nowrap text-subtle">{order.payment}</TD>
                      <TD>
                        <div className="flex items-center gap-2">
                          <StatusChip status={order.status} />
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            aria-label={`Change status for ${order.id}`}
                            className="rounded-lg border border-line bg-surface px-2 py-1 text-xs font-semibold text-subtle outline-none transition focus:border-primary"
                          >
                            {ORDER_STATUSES.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </TD>
                      <TD>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={HandCoins}
                            className="text-gold-dark hover:bg-gold-50 hover:text-gold-dark"
                            onClick={() => setRefundTarget(order)}
                          >
                            Refund
                          </Button>
                          <IconButton label={`View ${order.id}`} variant="surface" onClick={() => setViewing(order)}>
                            <Eye className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </TD>
                    </TR>
                  );
                })}
              </tbody>
            </Table>
          )}
          {pageItems.length > 0 && (
            <div className="border-t border-line px-5 py-4">
              <Pagination page={page} total={pageCount} onChange={setPage} />
            </div>
          )}
        </section>
      </div>

      <Dialog
        open={!!refundTarget}
        onClose={() => setRefundTarget(null)}
        onConfirm={confirmRefund}
        title="Issue a refund?"
        description={`A refund of ${formatPrice(refundTarget?.total || 0)} will be sent to ${BUYERS[refundTarget?.id] || "the buyer"} for ${refundTarget?.id}.`}
        confirmLabel="Confirm refund"
        variant="info"
      />

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.id}
        description={`Placed on ${viewing ? formatDate(viewing.date) : ""} by ${BUYERS[viewing?.id] || "Buyer"}`}
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setViewing(null)}>
            Close
          </Button>
        }
      >
        {viewing && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wide text-subtle">Items</h3>
                <StatusChip status={viewing.status} />
              </div>
              <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
                {viewing.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 p-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                      <p className="text-xs text-subtle">
                        {item.qty.toLocaleString()} kg × {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-ink">
                      {formatPrice(item.qty * item.unitPrice)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-bg p-3.5">
                <span className="text-sm font-semibold text-subtle">Total</span>
                <span className="text-base font-bold text-primary">{formatPrice(viewing.total)}</span>
              </div>
              <p className="mt-3 text-sm text-subtle">
                Payment: <span className="font-semibold text-ink">{viewing.payment}</span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-subtle">Tracking</h3>
              <div className="mt-3 rounded-xl border border-line p-4">
                <Timeline items={viewing.tracking} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
