import { useState } from "react";
import {
  BadgeCheck,
  Clock,
  Flag,
  MapPin,
  Pencil,
  ShieldCheck,
  XCircle,
} from "../../lib/fa";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/core";
import { Badge, StatCard } from "../../components/ui/display";
import { Dialog, Modal, useToast } from "../../components/ui/overlays";
import { Input } from "../../components/ui/forms";
import { formatDate, formatPrice } from "../../lib/utils";
import { NAV_ADMIN, PENDING_PRODUCTS } from "../../lib/data";

export default function ProductModeration() {
  const toast = useToast();
  const [products, setProducts] = useState(PENDING_PRODUCTS);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", farmer: "", province: "", price: "" });

  const pendingCount = products.filter((product) => product.status === "Pending").length;
  const flaggedCount = products.filter((product) => product.status === "Flagged").length;

  const handleApprove = (product) => {
    setProducts((prev) => prev.filter((item) => item.id !== product.id));
    toast.success("Listing approved", `${product.name} is now live on the marketplace.`);
  };

  const confirmReject = () => {
    setProducts((prev) => prev.filter((item) => item.id !== rejectTarget.id));
    toast.error("Listing rejected", `${rejectTarget.name} was removed from the queue.`);
    setRejectTarget(null);
  };

  const openEdit = (product) => {
    setEditing(product);
    setEditForm({
      name: product.name,
      farmer: product.farmer,
      province: product.province,
      price: String(product.price),
    });
  };

  const saveEdit = () => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === editing.id
          ? {
              ...item,
              name: editForm.name,
              farmer: editForm.farmer,
              province: editForm.province,
              price: parseFloat(editForm.price) || item.price,
            }
          : item,
      ),
    );
    toast.success("Listing updated", `${editForm.name} was saved.`);
    setEditing(null);
  };

  const handleReport = (product) => {
    toast.info("Reported", `${product.name} was flagged for review.`);
  };

  return (
    <DashboardLayout
      nav={NAV_ADMIN}
      title="Product Moderation"
      subtitle="Review and approve marketplace listings"
    >
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Pending listings"
            value={pendingCount}
            icon={Clock}
            iconClassName="bg-warning-50 text-warning"
          />
          <StatCard
            label="Flagged listings"
            value={flaggedCount}
            icon={ShieldCheck}
            iconClassName="bg-danger-50 text-danger"
          />
          <StatCard
            label="Reviewed today"
            value={14}
            icon={BadgeCheck}
            iconClassName="bg-success-50 text-success"
          />
        </section>

        {products.length === 0 ? (
          <section className="card flex flex-col items-center gap-4 p-10 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-success-50 text-success">
              <BadgeCheck className="h-8 w-8" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Queue is clear</h2>
              <p className="mt-1 text-sm text-subtle">
                No listings are waiting for moderation right now.
              </p>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="relative h-40 overflow-hidden bg-primary-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-3 top-3">
                    <Badge
                      variant={product.status === "Flagged" ? "danger" : "warning"}
                      dot
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-base font-bold text-ink">{product.name}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-subtle">
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {product.farmer} · {product.province}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                      <span className="text-xs font-medium text-subtle"> / kg</span>
                    </span>
                    <span className="text-xs text-faint">Submitted {formatDate(product.submitted)}</span>
                  </div>
                  {product.flags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {product.flags.map((flag) => (
                        <Badge key={flag} variant="danger">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
                    <Button
                      size="sm"
                      icon={BadgeCheck}
                      onClick={() => handleApprove(product)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={Pencil}
                      onClick={() => openEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={Flag}
                      className="text-gold-dark hover:bg-gold-50 hover:text-gold-dark"
                      onClick={() => handleReport(product)}
                    >
                      Report
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={XCircle}
                      className="ml-auto text-danger hover:bg-danger-50 hover:text-danger"
                      onClick={() => setRejectTarget(product)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={confirmReject}
        title="Reject this listing?"
        description={`${rejectTarget?.name} will be returned to ${rejectTarget?.farmer} with a rejection notice.`}
        confirmLabel="Reject listing"
      />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit listing"
        description={`Review and update "${editing?.name}" before it goes live.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Listing name"
            value={editForm.name}
            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Farmer"
              value={editForm.farmer}
              onChange={(e) => setEditForm((prev) => ({ ...prev, farmer: e.target.value }))}
            />
            <Input
              label="Province"
              value={editForm.province}
              onChange={(e) => setEditForm((prev) => ({ ...prev, province: e.target.value }))}
            />
          </div>
          <Input
            label="Price per kg (USD)"
            type="number"
            min="0"
            step="0.01"
            value={editForm.price}
            onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
}
