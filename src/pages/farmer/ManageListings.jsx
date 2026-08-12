import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, LayoutGrid, List, Pencil, Copy, Trash2 } from "../../lib/fa";
import { DashboardLayout } from "../../components/layout/DashboardLayout.jsx";
import { Button, IconButton } from "../../components/ui/core.jsx";
import { SearchBar } from "../../components/ui/forms.jsx";
import {
  Chip,
  StatusChip,
  ProgressBar,
  Pagination,
  EmptyState,
  Table,
  THead,
  TH,
  TR,
  TD,
  RowActions,
  RowAction,
} from "../../components/ui/display.jsx";
import { Dialog, useToast } from "../../components/ui/overlays.jsx";
import { RiceCard } from "../../components/cards.jsx";
import { NAV_FARMER } from "../../lib/data.js";
import { addListing, deleteListing, getListings } from "../../lib/services.js";
import { useAsyncData } from "../../lib/useAsyncData.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatPrice } from "../../lib/utils.js";

export default function ManageListings() {
  const { user } = useAuth();
  const loadMine = async () => {
    if (!user) return [];
    const all = await getListings();
    return all.filter((l) => l.farmerId === user.uid);
  };
  const [listings, setListings] = useAsyncData(loadMine, [], [user?.uid]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("table");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const displayListings = useMemo(
    () => listings.map((listing) => ({ ...listing, status: listing.status || "Published" })),
    [listings],
  );

  const filtered = useMemo(() => {
    return displayListings.filter((l) => {
      const matchFilter = filter === "All" || l.status === filter;
      const matchQuery = `${l.name} ${l.type} ${l.province} ${l.farmer}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchFilter && matchQuery;
    });
  }, [displayListings, query, filter]);

  const perPage = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const duplicate = async (item) => {
    const copy = {
      ...item,
      name: `${item.name} (Copy)`,
      status: "Draft",
      stock: 0,
      createdAt: new Date().toISOString(),
    };
    const result = await addListing(copy);
    if (!result.ok) {
      toast.error("Could not duplicate listing", "Check your connection and try again.");
      return;
    }
    setListings((list) => [{ ...copy, id: result.id }, ...list]);
    toast.success("Listing duplicated", "A draft copy was created.");
  };

  const confirmDelete = async () => {
    const ok = await deleteListing(deleteTarget.id);
    setDeleteTarget(null);
    if (!ok) {
      toast.error("Could not delete listing", "Check your connection and try again.");
      return;
    }
    setListings((list) => list.filter((l) => l.id !== deleteTarget.id));
    toast.success("Listing deleted", `${deleteTarget.name} was removed.`);
  };

  const statusCount = (status) =>
    status === "All"
      ? displayListings.length
      : displayListings.filter((l) => l.status === status).length;

  return (
    <DashboardLayout
      nav={NAV_FARMER}
      title="Manage Listings"
      subtitle={`${displayListings.length} rice products`}
      notificationPath="/farmer/notifications"
      accent="bg-primary-dark"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, type, or province…"
          className="max-w-md"
        />
        <Button as={Link} to="/farmer/listings/add" icon={Plus}>
          Add listing
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Published", "Draft", "Sold Out"].map((status) => (
            <Chip key={status} active={filter === status} onClick={() => { setFilter(status); setPage(1); }}>
              {status} ({statusCount(status)})
            </Chip>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-card bg-surface p-1 ring-1 ring-line">
          <IconButton label="Table view" onClick={() => setView("table")} variant={view === "table" ? "primary" : "ghost"} size="sm">
            <LayoutGrid className="h-4 w-4" />
          </IconButton>
          <IconButton label="Grid view" onClick={() => setView("grid")} variant={view === "grid" ? "primary" : "ghost"} size="sm">
            <List className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      {pageItems.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={LayoutGrid}
          title="No listings found"
          description="Try adjusting your search or add a new rice listing."
          action={
            <Button as={Link} to="/farmer/listings/add" icon={Plus}>
              Add listing
            </Button>
          }
        />
      ) : view === "table" ? (
        <div className="card mt-6 overflow-hidden">
          <Table>
            <THead>
              <TH>Product</TH>
              <TH>Price</TH>
              <TH>Quantity</TH>
              <TH>Status</TH>
              <TH>Stock</TH>
              <TH>Actions</TH>
            </THead>
            <tbody>
              {pageItems.map((item) => (
                <TR key={item.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-ink">{item.name}</p>
                        <p className="text-xs text-subtle">
                          {item.type} · {item.province}
                        </p>
                      </div>
                    </div>
                  </TD>
                  <TD className="font-bold text-ink">{formatPrice(item.price)}<span className="text-xs font-normal text-subtle"> /kg</span></TD>
                  <TD className="text-subtle">{item.quantity.toLocaleString()} kg</TD>
                  <TD><StatusChip status={item.status} /></TD>
                  <TD className="w-40"><ProgressBar value={item.stock} /></TD>
                  <TD>
                    <RowActions>
                      <RowAction icon={Pencil} onClick={() => navigate(`/farmer/listings/${item.id}/edit`)}>
                        Edit
                      </RowAction>
                      <RowAction icon={Copy} onClick={() => duplicate(item)}>Duplicate</RowAction>
                      <RowAction icon={Trash2} danger onClick={() => setDeleteTarget(item)}>
                        Delete
                      </RowAction>
                    </RowActions>
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((item) => (
            <div key={item.id} className="relative">
              <RiceCard item={item} />
              <div className="absolute right-3 top-3 z-10">
                <IconButton label="More options" variant="surface" size="sm" onClick={() => setDeleteTarget(item)}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={page} total={totalPages} onChange={setPage} className="mt-8" />
      )}

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete listing?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently removed from your store. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete listing"
      />
    </DashboardLayout>
  );
}
