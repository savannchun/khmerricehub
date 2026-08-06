import { useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  MapPin,
  XCircle,
} from "lucide-react";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/core";
import { Avatar, StatCard, StatusChip } from "../../components/ui/display";
import { Dialog, useToast } from "../../components/ui/overlays";
import { formatDate } from "../../lib/utils";
import { NAV_ADMIN, PENDING_FARMERS } from "../../lib/data";

export default function FarmerApproval() {
  const toast = useToast();
  const [farmers, setFarmers] = useState(PENDING_FARMERS);
  const [approvedThisMonth, setApprovedThisMonth] = useState(18);
  const [rejectTarget, setRejectTarget] = useState(null);

  const pendingCount = farmers.filter((farmer) => farmer.status === "Pending").length;
  const moreInfoCount = farmers.filter((farmer) => farmer.status === "More Info").length;

  const handleApprove = (farmer) => {
    setFarmers((prev) => prev.filter((item) => item.id !== farmer.id));
    setApprovedThisMonth((prev) => prev + 1);
    toast.success("Farmer approved", `${farmer.name} can now list products on the marketplace.`);
  };

  const handleMoreInfo = (farmer) => {
    setFarmers((prev) =>
      prev.map((item) => (item.id === farmer.id ? { ...item, status: "More Info" } : item)),
    );
    toast.info("More info requested", `Asked ${farmer.name} to resubmit their documents.`);
  };

  const confirmReject = () => {
    setFarmers((prev) => prev.filter((item) => item.id !== rejectTarget.id));
    toast.error("Application rejected", `${rejectTarget.name} was not approved.`);
    setRejectTarget(null);
  };

  return (
    <DashboardLayout
      nav={NAV_ADMIN}
      title="Farmer Approval"
      subtitle="Verify new farmer accounts"
    >
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Pending applications"
            value={pendingCount}
            icon={Clock}
            iconClassName="bg-warning-50 text-warning"
          />
          <StatCard
            label="Requesting more info"
            value={moreInfoCount}
            icon={FileText}
            iconClassName="bg-info-50 text-info"
          />
          <StatCard
            label="Approved this month"
            value={approvedThisMonth}
            icon={BadgeCheck}
            iconClassName="bg-success-50 text-success"
          />
        </section>

        {farmers.length === 0 ? (
          <section className="card flex flex-col items-center gap-4 p-10 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-success-50 text-success">
              <BadgeCheck className="h-8 w-8" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">All caught up</h2>
              <p className="mt-1 text-sm text-subtle">
                There are no farmer applications waiting for review.
              </p>
            </div>
          </section>
        ) : (
          <div className="space-y-4">
            {farmers.map((farmer) => (
              <article key={farmer.id} className="card p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr_auto]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <Avatar name={farmer.owner} size="xl" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-lg font-bold text-ink">{farmer.name}</h2>
                        <StatusChip status={farmer.status} />
                      </div>
                      <p className="mt-1 text-sm font-semibold text-ink">{farmer.owner}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-subtle">
                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {farmer.province}
                      </p>
                      <p className="mt-1 text-sm text-subtle">
                        Joined {formatDate(farmer.joined)} · {farmer.products} products planned
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-subtle">
                      Identity verification
                    </p>
                    <ul className="mt-2 space-y-2">
                      {farmer.documents.map((doc) => (
                        <li key={doc} className="flex items-center gap-2 text-sm text-ink">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden />
                          {doc}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 rounded-xl bg-bg p-3 text-sm leading-6 text-ink-soft">
                      {farmer.notes}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 lg:w-44">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={BadgeCheck}
                      onClick={() => handleApprove(farmer)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Info}
                      onClick={() => handleMoreInfo(farmer)}
                    >
                      Request more info
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={XCircle}
                      className="text-danger hover:bg-danger-50 hover:text-danger"
                      onClick={() => setRejectTarget(farmer)}
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
        title="Reject this application?"
        description={`${rejectTarget?.name} will be notified that their farmer application was rejected. This cannot be undone.`}
        confirmLabel="Reject application"
      />
    </DashboardLayout>
  );
}
