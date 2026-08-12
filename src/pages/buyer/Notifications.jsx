import { useState } from "react";
import { Bell, CheckCheck } from "../../lib/fa";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/core";
import { Badge, EmptyState, Tabs } from "../../components/ui/display";
import { NotificationCard } from "../../components/cards";
import { useToast } from "../../components/ui/overlays";
import { NAV_BUYER, NAV_FARMER, NOTIFICATIONS as DEMO_NOTIFICATIONS } from "../../lib/data";
import { getNotifications, markNotificationRead } from "../../lib/services";
import { useAsyncData } from "../../lib/useAsyncData";

export default function Notifications({ role = "buyer" }) {
  const nav = role === "farmer" ? NAV_FARMER : NAV_BUYER;
  const notificationPath = role === "farmer" ? "/farmer/notifications" : "/buyer/notifications";
  const toast = useToast();

  const [items, setItems] = useAsyncData(getNotifications, DEMO_NOTIFICATIONS);
  const [tab, setTab] = useState("All");

  const unread = items.filter((n) => !n.read).length;

  const tabs = [
    { value: "All", label: "All", count: items.length },
    { value: "Order", label: "Orders", count: items.filter((n) => n.type === "Order").length },
    { value: "Message", label: "Messages", count: items.filter((n) => n.type === "Message").length },
    { value: "System", label: "System", count: items.filter((n) => n.type === "System").length },
  ];

  const filtered = items.filter((n) => tab === "All" || n.type === tab);

  const markRead = (item) => {
    if (item.read) return;
    setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
    markNotificationRead(item.id);
    toast.info("Marked as read", item.title);
  };

  const markAllRead = () => {
    if (unread === 0) return;
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    items.filter((n) => !n.read).forEach((n) => markNotificationRead(n.id));
    toast.success("All caught up", `${unread} notification${unread > 1 ? "s" : ""} marked as read.`);
  };

  return (
    <DashboardLayout
      nav={nav}
      title="Notifications"
      subtitle="Stay up to date with your activity"
      notificationPath={notificationPath}
    >
      <div className="space-y-6">
        <section className="card p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary">
                <Bell className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Inbox</h2>
                <p className="mt-0.5 text-sm text-subtle">
                  {unread > 0 ? (
                    <Badge variant="danger">{unread} unread</Badge>
                  ) : (
                    "You're all caught up"
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={CheckCheck}
              onClick={markAllRead}
              disabled={unread === 0}
            >
              Mark all read
            </Button>
          </div>
          <Tabs items={tabs} active={tab} onChange={setTab} className="mt-5" />
        </section>

        {filtered.length ? (
          <div className="space-y-3">
            {filtered.map((n) => (
              <NotificationCard key={n.id} item={n} onMarkRead={() => markRead(n)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title="Nothing here"
            description="Notifications for this category will show up here."
          />
        )}
      </div>
    </DashboardLayout>
  );
}
