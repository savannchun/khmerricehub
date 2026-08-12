import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Ban,
  LayoutGrid,
  List,
  MapPin,
  Package,
  SlidersHorizontal,
} from "../lib/fa";
import { Navbar, Footer } from "../components/layout/Navbar";
import { Button, IconButton } from "../components/ui/core";
import { Checkbox, SearchBar, Select, Switch } from "../components/ui/forms";
import { EmptyState, Pagination } from "../components/ui/display";
import { RiceCard } from "../components/cards";
import { useToast } from "../components/ui/overlays";
import { PROVINCES, RICE_TYPES } from "../lib/data";
import { getListings } from "../lib/services";
import { useAsyncData } from "../lib/useAsyncData";
import { cx, formatPrice } from "../lib/utils";

const PAGE_SIZE = 9;
const MAX_PRICE = 100;
const QUANTITY_OPTIONS = [
  { value: "all", label: "Any quantity" },
  { value: "100", label: "At least 100 kg" },
  { value: "500", label: "At least 500 kg" },
  { value: "1000", label: "At least 1,000 kg" },
  { value: "2000", label: "At least 2,000 kg" },
];

const SORT_OPTIONS = [
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "quantity", label: "Most available" },
];

export default function Marketplace() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [provinces, setProvinces] = useState(() => {
    const initial = params.get("province");
    return initial ? new Set([initial]) : new Set();
  });
  const [types, setTypes] = useState(() => new Set());
  const [price, setPrice] = useState([0, MAX_PRICE]);
  const [minQty, setMinQty] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sort, setSort] = useState("rating");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState(() => new Set());
  const toast = useToast();
  const [listings] = useAsyncData(getListings, []);
  const storeEmpty = listings.length === 0;

  const filtered = useMemo(() => {
    let list = listings.filter((item) => item.status === "Published");

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((item) =>
        [
          item.name,
          item.type,
          item.province,
          item.district,
          item.farmer,
          item.description,
        ].some((field) => (field || "").toLowerCase().includes(q)),
      );
    }
    if (provinces.size)
      list = list.filter((item) => provinces.has(item.province));
    if (types.size) list = list.filter((item) => types.has(item.type));
    list = list.filter(
      (item) => item.price >= price[0] && item.price <= price[1],
    );
    if (minQty !== "all")
      list = list.filter((item) => item.quantity >= Number(minQty));
    if (inStockOnly) list = list.filter((item) => item.stock > 0);
    if (organicOnly) list = list.filter((item) => item.organic);

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "quantity")
      sorted.sort((a, b) => b.quantity - a.quantity);
    else sorted.sort((a, b) => b.rating - a.rating);

    return sorted;
  }, [
    listings,
    query,
    provinces,
    types,
    price,
    minQty,
    inStockOnly,
    organicOnly,
    sort,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const currentItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const toggleInSet = (setter) => (value) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
    setPage(1);
  };

  const toggleProvince = toggleInSet(setProvinces);
  const toggleType = toggleInSet(setTypes);

  const updateMinPrice = (value) => {
    setPrice(([, max]) => [Math.min(Number(value), max), max]);
    setPage(1);
  };

  const updateMaxPrice = (value) => {
    setPrice(([min]) => [min, Math.max(Number(value), min)]);
    setPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setProvinces(new Set());
    setTypes(new Set());
    setPrice([0, MAX_PRICE]);
    setMinQty("all");
    setInStockOnly(false);
    setOrganicOnly(false);
    setSort("rating");
    toast.info("Filters cleared", "Showing all published listings.");
  };

  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
        toast.info("Removed from favorites", `${item.name} was removed.`);
      } else {
        next.add(item.id);
        toast.success("Saved to favorites", `${item.name} was added.`);
      }
      return next;
    });
  };

  const filterGroups = [
    { title: "Province", items: PROVINCES },
    { title: "Rice type", items: RICE_TYPES },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Rice marketplace
          </h1>
          <p className="mt-2 max-w-2xl text-subtle">
            Compare fresh harvests from verified farms across Cambodia. Order by
            the kilogram.
          </p>
          <SearchBar
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            onSubmit={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Search by rice, farmer, or province…"
            size="lg"
            className="mt-6"
          />
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="card h-fit p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink">
              <SlidersHorizontal
                className="h-4.5 w-4.5 text-primary"
                aria-hidden
              />
              Filters
            </h2>
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-primary transition hover:text-primary-dark"
            >
              Clear all
            </button>
          </div>

          {filterGroups.map((group) => (
            <div key={group.title} className="mt-7 border-t border-line pt-6">
              <h3 className="text-sm font-bold text-ink">{group.title}</h3>
              <div className="mt-4 space-y-3">
                {group.items.map((item) => {
                  const checked =
                    group.title === "Province"
                      ? provinces.has(item)
                      : types.has(item);
                  const toggle =
                    group.title === "Province" ? toggleProvince : toggleType;
                  return (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={checked}
                      onChange={() => toggle(item)}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-7 border-t border-line pt-6">
            <h3 className="text-sm font-bold text-ink">Price per kg</h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="flex items-center justify-between text-xs font-semibold text-subtle">
                  <span>Min</span>
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 font-bold text-primary">
                    {formatPrice(price[0])}
                  </span>
                </span>
                <input
                  type="range"
                  min="0"
                  max={MAX_PRICE}
                  step="0.05"
                  value={price[0]}
                  onChange={(e) => updateMinPrice(e.target.value)}
                  className="mt-2 w-full"
                  aria-label="Minimum price"
                />
              </label>
              <label className="block">
                <span className="flex items-center justify-between text-xs font-semibold text-subtle">
                  <span>Max</span>
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 font-bold text-primary">
                    {formatPrice(price[1])}
                  </span>
                </span>
                <input
                  type="range"
                  min="0"
                  max={MAX_PRICE}
                  step="0.05"
                  value={price[1]}
                  onChange={(e) => updateMaxPrice(e.target.value)}
                  className="mt-2 w-full"
                  aria-label="Maximum price"
                />
              </label>
            </div>
          </div>

          <div className="mt-7 border-t border-line pt-6">
            <h3 className="text-sm font-bold text-ink">Quantity</h3>
            <Select
              value={minQty}
              onChange={(e) => {
                setMinQty(e.target.value);
                setPage(1);
              }}
              className="mt-4"
            >
              {QUANTITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-7 space-y-5 border-t border-line pt-6">
            <Switch
              label="In stock only"
              description="Hide low-availability lots"
              checked={inStockOnly}
              onChange={(e) => {
                setInStockOnly(e.target.checked);
                setPage(1);
              }}
            />
            <Switch
              label="Organic only"
              description="Certified organic harvests"
              checked={organicOnly}
              onChange={(e) => {
                setOrganicOnly(e.target.checked);
                setPage(1);
              }}
            />
          </div>
        </aside>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium text-subtle">
              <span className="font-bold text-ink">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "listing" : "listings"} found
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-subtle">
                Sort by
                <Select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="text-sm"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </label>
              <div className="flex gap-1.5">
                <IconButton
                  label="Grid view"
                  variant={view === "grid" ? "primary" : "surface"}
                  onClick={() => setView("grid")}
                >
                  <LayoutGrid className="h-[18px] w-[18px]" />
                </IconButton>
                <IconButton
                  label="List view"
                  variant={view === "list" ? "primary" : "surface"}
                  onClick={() => setView("list")}
                >
                  <List className="h-[18px] w-[18px]" />
                </IconButton>
              </div>
            </div>
          </div>

          {currentItems.length > 0 ? (
            <div
              className={cx(
                "mt-6 gap-6",
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col",
              )}
            >
              {currentItems.map((item) => (
                <RiceCard
                  key={item.id}
                  item={item}
                  view={view}
                  favorite={favorites.has(item.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6">
              {storeEmpty ? (
                <EmptyState
                  icon={Package}
                  title="No rice products available yet"
                  description="Farmers haven't published any rice listings yet. Check back soon!"
                />
              ) : (
                <EmptyState
                  icon={Package}
                  title="No rice matches your filters"
                  description="Try adjusting the search or clearing filters to see more harvests."
                  action={
                    <Button
                      variant="secondary"
                      icon={Ban}
                      onClick={clearFilters}
                    >
                      Reset all filters
                    </Button>
                  }
                />
              )}
            </div>
          )}

          {filtered.length > PAGE_SIZE && (
            <Pagination
              page={currentPage}
              total={totalPages}
              onChange={setPage}
              className="mt-10"
            />
          )}

          {filtered.length > 0 && (
            <p className="mt-10 flex items-center justify-center gap-2 text-xs font-medium text-faint">
              <MapPin className="h-4 w-4" aria-hidden />
              Showing rice across{" "}
              {new Set(filtered.map((item) => item.province)).size} Cambodian
              provinces
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
