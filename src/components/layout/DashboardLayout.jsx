import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MessageSquare,
  Bell,
  User,
  Wheat,
  PlusCircle,
  Users,
  BadgeCheck,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Search,
  ChevronDown,
} from "lucide-react";
import { cx } from "../../lib/utils";
import { Logo } from "./Navbar";
import { Avatar, Badge } from "../ui/display";
import { Drawer, useDropdown } from "../ui/overlays";
import { useAuth } from "../../context/AuthContext";

const ICONS = {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MessageSquare,
  Bell,
  User,
  Wheat,
  PlusCircle,
  Users,
  BadgeCheck,
  ShieldCheck,
  BarChart3,
  Settings,
};

const ROLE_BADGE = {
  buyer: { label: "Buyer", variant: "info" },
  farmer: { label: "Farmer", variant: "success" },
  admin: { label: "Admin", variant: "gold" },
};

function SidebarContent({ nav, accent }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-6 pt-7">
        <Logo variant="dark" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-4" aria-label="Dashboard navigation">
        <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-widest text-faint">
          Menu
        </p>
        {nav.map((item) => {
          const Icon = ICONS[item.icon] || LayoutDashboard;
          const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cx(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                isActive
                  ? cx("text-white shadow-float", accent || "bg-primary")
                  : "text-subtle hover:bg-primary-50 hover:text-primary",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span
                  className={cx(
                    "rounded-full px-2 py-0.5 text-[11px] font-bold",
                    isActive ? "bg-white/20 text-white" : "bg-primary text-white",
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-line p-4">
        <div className="flex items-center gap-3 rounded-xl bg-bg p-3">
          <Avatar name={user?.name || "Demo User"} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">
              {user?.name || "Demo User"}
            </p>
            <Badge
              variant={(ROLE_BADGE[user?.role] || ROLE_BADGE.buyer).variant}
              className="mt-1"
            >
              {(ROLE_BADGE[user?.role] || ROLE_BADGE.buyer).label}
            </Badge>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            aria-label="Log out"
            className="grid h-9 w-9 place-items-center rounded-lg text-subtle transition-colors hover:bg-danger-50 hover:text-danger"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout({ nav, title, subtitle, children, notificationPath, accent }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const profile = useDropdown();
  const role = user?.role || "buyer";

  return (
    <div className="min-h-screen bg-bg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] border-r border-line bg-surface lg:block">
        <SidebarContent nav={nav} accent={accent} />
      </aside>

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
          <div className="flex h-[72px] items-center justify-between gap-4 px-5 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-xl text-ink transition hover:bg-bg lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-display text-lg font-bold text-ink lg:text-xl">
                  {title}
                </h1>
                {subtitle && <p className="hidden text-sm text-subtle sm:block">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <form
                className="hidden h-11 w-64 items-center gap-2 rounded-xl border border-line bg-bg px-3.5 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 md:flex"
                role="search"
                onSubmit={(e) => e.preventDefault()}
              >
                <Search className="h-4 w-4 text-faint" aria-hidden />
                <input
                  aria-label="Search"
                  placeholder="Search…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
                />
              </form>
              <Link
                to={notificationPath || "/buyer/notifications"}
                aria-label="Notifications"
                className="relative grid h-11 w-11 place-items-center rounded-xl text-subtle transition hover:bg-bg hover:text-primary"
              >
                <Bell className="h-5 w-5" />
                {nav.some((n) => n.badge) && (
                  <span className="absolute right-2 top-2 grid h-4.5 min-w-[18px] place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                    {nav.filter((n) => n.badge).reduce((sum, n) => sum + n.badge, 0)}
                  </span>
                )}
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => profile.setOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-bg"
                  aria-haspopup="menu"
                  aria-expanded={profile.open}
                >
                  <Avatar name={user?.name || "Demo User"} size="sm" />
                  <ChevronDown className="hidden h-4 w-4 text-subtle sm:block" />
                </button>
                {profile.open && (
                  <div className="absolute right-0 z-50 mt-2 w-52 animate-scale-in rounded-card border border-line bg-surface p-1.5 shadow-pop">
                    <div className="border-b border-line px-3 py-2">
                      <p className="truncate text-sm font-bold text-ink">
                        {user?.name || "Demo User"}
                      </p>
                      <p className="text-xs text-subtle">
                        {(ROLE_BADGE[role] || ROLE_BADGE.buyer).label} account
                      </p>
                    </div>
                    <Link
                      to={`/${role}/profile`}
                      onClick={() => profile.setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-primary-50 hover:text-primary"
                    >
                      <User className="h-4 w-4" aria-hidden />
                      My Profile
                    </Link>
                    <Link
                      to="/marketplace"
                      onClick={() => profile.setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-primary-50 hover:text-primary"
                    >
                      <Wheat className="h-4 w-4" aria-hidden />
                      Browse marketplace
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">{children}</main>
      </div>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Navigation"
        side="left"
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="sr-only"
        >
          Close
        </button>
        <SidebarContent nav={nav} accent={accent} />
      </Drawer>
    </div>
  );
}
