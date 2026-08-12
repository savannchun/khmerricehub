import { useMemo, useState } from "react";
import {
  Download,
  SearchX,
  UserCheck,
  UserX,
  Trash2,
} from "../../lib/fa";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/core";
import {
  Avatar,
  Badge,
  EmptyState,
  Pagination,
  RowAction,
  RowActions,
  StatusChip,
  TD,
  TH,
  THead,
  TR,
  Table,
  Tabs,
} from "../../components/ui/display";
import { Dialog, useToast } from "../../components/ui/overlays";
import { SearchBar } from "../../components/ui/forms";
import { formatDate } from "../../lib/utils";
import { ADMIN_USERS, NAV_ADMIN } from "../../lib/data";

const ROLE_BADGE = {
  Buyer: { variant: "primary", label: "Buyer" },
  Farmer: { variant: "success", label: "Farmer" },
  Admin: { variant: "gold", label: "Admin" },
};

const PAGE_SIZE = 5;

export default function UserManagement() {
  const toast = useToast();
  const [users, setUsers] = useState(ADMIN_USERS);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const counts = useMemo(() => {
    const result = { All: users.length, Buyer: 0, Farmer: 0, Admin: 0 };
    users.forEach((user) => {
      result[user.role] = (result[user.role] || 0) + 1;
    });
    return result;
  }, [users]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = role === "All" || user.role === role;
      const matchesQuery =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.province.toLowerCase().includes(term);
      return matchesRole && matchesQuery;
    });
  }, [users, query, role]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = (id, status) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status } : user)));
  };

  const handleVerify = (user) => {
    updateStatus(user.id, "Verified");
    toast.success("User verified", `${user.name} is now a verified member.`);
  };

  const handleSuspend = (user) => {
    updateStatus(user.id, "Suspended");
    toast.warning("User suspended", `${user.name} can no longer access the platform.`);
  };

  const handleDelete = (user) => setDeleteTarget(user);

  const confirmDelete = () => {
    setUsers((prev) => prev.filter((user) => user.id !== deleteTarget.id));
    toast.success("User deleted", `${deleteTarget.name} was removed from the platform.`);
    setDeleteTarget(null);
  };

  const handleExport = () => {
    toast.success("Export started", "User list is being downloaded as a CSV file.");
  };

  const clearFilters = () => {
    setQuery("");
    setRole("All");
    setPage(1);
  };

  const filterTabs = [
    { value: "All", label: "All", count: counts.All },
    { value: "Buyer", label: "Buyer", count: counts.Buyer },
    { value: "Farmer", label: "Farmer", count: counts.Farmer },
    { value: "Admin", label: "Admin", count: counts.Admin },
  ];

  return (
    <DashboardLayout nav={NAV_ADMIN} title="User Management" subtitle="Manage platform accounts">
      <div className="space-y-6">
        <section className="card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchBar
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, or province…"
              className="lg:max-w-md"
            />
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-subtle">Export list</span>
              <Button variant="secondary" size="sm" icon={Download} onClick={handleExport}>
                Export
              </Button>
            </div>
          </div>
          <Tabs items={filterTabs} active={role} onChange={setRole} className="mt-5" />
        </section>

        <section className="card overflow-hidden">
          {pageItems.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={SearchX}
                title="No users found"
                description="Try adjusting your search or filter to find the accounts you're looking for."
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
                <TH>User</TH>
                <TH>Role</TH>
                <TH>Status</TH>
                <TH>Province</TH>
                <TH>Joined</TH>
                <TH>Orders</TH>
                <TH className="text-right">Actions</TH>
              </THead>
              <tbody>
                {pageItems.map((user) => {
                  const roleBadge = ROLE_BADGE[user.role] || ROLE_BADGE.Buyer;
                  return (
                    <TR key={user.id}>
                      <TD>
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} size="md" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-ink">{user.name}</p>
                            <p className="truncate text-xs text-subtle">{user.email}</p>
                          </div>
                        </div>
                      </TD>
                      <TD>
                        <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
                      </TD>
                      <TD>
                        <StatusChip status={user.status} />
                      </TD>
                      <TD className="whitespace-nowrap text-subtle">{user.province}</TD>
                      <TD className="whitespace-nowrap text-subtle">{formatDate(user.joined)}</TD>
                      <TD className="font-semibold text-ink">{user.orders}</TD>
                      <TD>
                        <div className="flex justify-end">
                          <RowActions>
                            {user.status === "Pending" && (
                              <RowAction icon={UserCheck} onClick={() => handleVerify(user)}>
                                Verify
                              </RowAction>
                            )}
                            {user.status !== "Suspended" && (
                              <RowAction icon={UserX} onClick={() => handleSuspend(user)}>
                                Suspend
                              </RowAction>
                            )}
                            <RowAction icon={Trash2} danger onClick={() => handleDelete(user)}>
                              Delete
                            </RowAction>
                          </RowActions>
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
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete this user?"
        description={`${deleteTarget?.name} will lose access to their account permanently. This action cannot be undone.`}
        confirmLabel="Delete user"
      />
    </DashboardLayout>
  );
}
