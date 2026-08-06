import { Link, NavLink } from "react-router-dom";
import {
  Wheat,
  Search,
  Menu,
  ChevronDown,
  LayoutDashboard,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { cx } from "../../lib/utils";
import { Button } from "../ui/core";
import { Drawer, useDropdown } from "../ui/overlays";
import { NAV_ITEMS } from "../../lib/data";

export function Logo({ variant = "light", className }) {
  return (
    <Link to="/" className={cx("flex items-center gap-2.5", className)} aria-label="KhmerRiceHub home">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white shadow-float">
        <Wheat className="h-5 w-5" aria-hidden />
      </span>
      <span
        className={cx(
          "font-display text-lg font-bold tracking-tight",
          variant === "light" ? "text-white" : "text-ink",
        )}
      >
        KhmerRice<span className="text-gold">Hub</span>
      </span>
    </Link>
  );
}

const ROLE_LINKS = [
  { label: "Buyer Dashboard", to: "/buyer/dashboard", icon: ShoppingCart },
  { label: "Farmer Dashboard", to: "/farmer/dashboard", icon: Wheat },
  { label: "Admin Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdown = useDropdown();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo variant="dark" />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cx(
                    "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary"
                      : "text-subtle hover:bg-bg hover:text-ink",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <form
            className="hidden w-56 items-center gap-2 rounded-xl border border-line bg-bg px-3.5 py-2.5 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 xl:flex"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/marketplace?q=${encodeURIComponent(query)}`;
            }}
          >
            <Search className="h-4 w-4 text-faint" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rice…"
              aria-label="Search rice"
              className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
            />
          </form>

          <div className="relative">
            <button
              type="button"
              onClick={() => dropdown.setOpen((v) => !v)}
              className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-subtle transition-colors hover:bg-bg hover:text-primary"
              aria-haspopup="menu"
              aria-expanded={dropdown.open}
            >
              Demo
              <ChevronDown className="h-4 w-4" aria-hidden />
            </button>
            {dropdown.open && (
              <div className="absolute right-0 z-50 mt-2 w-56 animate-scale-in rounded-card border border-line bg-surface p-1.5 shadow-pop">
                <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-faint">
                  Explore the platform
                </p>
                {ROLE_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => dropdown.setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-primary-50 hover:text-primary"
                  >
                    <link.icon className="h-4 w-4" aria-hidden />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Button as={Link} to="/login" variant="ghost">
            Log in
          </Button>
          <Button as={Link} to="/register">
            Register
          </Button>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-xl text-ink transition hover:bg-bg md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Menu"
        side="right"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button as={Link} to="/login" variant="secondary" onClick={() => setMobileOpen(false)}>
              Log in
            </Button>
            <Button as={Link} to="/register" onClick={() => setMobileOpen(false)}>
              Register
            </Button>
          </div>
        }
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-primary-50 hover:text-primary"
            >
              {item.label}
            </NavLink>
          ))}
          <p className="mt-4 px-4 text-[11px] font-bold uppercase tracking-wide text-faint">
            Explore the platform
          </p>
          {ROLE_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-subtle transition-colors hover:bg-primary-50 hover:text-primary"
            >
              <link.icon className="h-4 w-4" aria-hidden />
              {link.label}
            </Link>
          ))}
        </nav>
      </Drawer>
    </header>
  );
}

/* ---------------- Footer ---------------- */
const FOOTER_COLUMNS = [
  {
    title: "Marketplace",
    links: [
      { label: "Browse rice", to: "/marketplace" },
      { label: "Popular categories", to: "/marketplace" },
      { label: "Top farmers", to: "/marketplace" },
      { label: "Favorites", to: "/buyer/favorites" },
    ],
  },
  {
    title: "Farmers",
    links: [
      { label: "Start selling", to: "/register" },
      { label: "Farmer dashboard", to: "/farmer/dashboard" },
      { label: "Add a listing", to: "/farmer/listings/add" },
      { label: "Seller resources", to: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Help center", to: "/faq" },
      { label: "Admin", to: "/admin/dashboard" },
    ],
  },
];

function makeSocialIcon(paths) {
  return function SocialIcon(props) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    );
  };
}

const SOCIALS = [
  {
    label: "Facebook",
    Icon: makeSocialIcon(["M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"]),
  },
  {
    label: "Instagram",
    Icon: makeSocialIcon([
      "M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5z",
      "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
      "M21.5 6.5h.01",
    ]),
  },
  {
    label: "X",
    Icon: makeSocialIcon([
      "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
    ]),
  },
  {
    label: "LinkedIn",
    Icon: makeSocialIcon([
      "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v2.5S16.5 8 16 8z",
      "M2 9h4v12H2z",
      "M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    ]),
  },
];

export function Footer() {
  return (
    <footer className="bg-[#142e1b] px-5 pb-8 pt-16 text-green-50 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-7 text-green-100/70">
              Connecting Cambodian rice farmers with people who value quality,
              trust, and tradition — from field to table.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-green-50 transition-all hover:-translate-y-0.5 hover:bg-gold hover:text-ink"
                >
                  <Icon className="h-4.5 w-4.5" aria-hidden />
                </a>
              ))}
            </div>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-green-100/70">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="transition-colors hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-7 text-sm text-green-100/60 md:flex-row md:items-center md:justify-between">
          <span>© 2026 KhmerRiceHub. Made in Cambodia 🇰🇭</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {["Privacy Policy", "Terms of Service", "Accessibility"].map((label) => (
              <a key={label} href="#" className="transition-colors hover:text-gold">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Hero search form ---------------- */
export function HeroSearch({ className }) {
  const [q, setQ] = useState("");
  const [province, setProvince] = useState("All provinces");
  return (
    <form
      className={cx("rounded-2xl border border-white/10 bg-surface p-2 shadow-pop", className)}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = `/marketplace?q=${encodeURIComponent(q)}&province=${encodeURIComponent(province)}`;
      }}
    >
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex flex-1 items-center gap-3 px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-faint" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search rice, province, or farmer"
            aria-label="Search rice"
            className="w-full bg-transparent text-ink outline-none placeholder:text-faint"
          />
        </div>
        <label className="flex items-center gap-2 border-line px-4 py-3 text-sm font-medium text-subtle md:border-l">
          <span className="sr-only">Province</span>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="bg-transparent text-ink outline-none"
            aria-label="Province"
          >
            <option>All provinces</option>
            <option>Battambang</option>
            <option>Takeo</option>
            <option>Siem Reap</option>
            <option>Kampong Thom</option>
          </select>
        </label>
        <Button type="submit" size="lg" icon={Search}>
          Search rice
        </Button>
      </div>
    </form>
  );
}
