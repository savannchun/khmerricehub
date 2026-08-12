import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Calendar, Camera, Mail, MapPin, Phone, Save, User } from "../../lib/fa";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button, IconButton } from "../../components/ui/core";
import { Input, PasswordInput, Select, Textarea } from "../../components/ui/forms";
import { Avatar, Badge, EmptyState } from "../../components/ui/display";
import { RiceCard } from "../../components/cards";
import { useToast } from "../../components/ui/overlays";
import { useAuth } from "../../context/AuthContext";
import { NAV_BUYER, NAV_FARMER, PROVINCES, RICE_LISTINGS } from "../../lib/data";
import { useFavorites } from "./useFavorites";

export default function Profile({ role = "buyer" }) {
  const { user } = useAuth();
  const toast = useToast();
  const { count, favorites, isFavorite, toggle } = useFavorites();

  const nav = role === "farmer" ? NAV_FARMER : NAV_BUYER;
  const notificationPath = role === "farmer" ? "/farmer/notifications" : "/buyer/notifications";
  const roleLabel = role === "farmer" ? "Farmer" : "Buyer";

  const [fullName, setFullName] = useState(
    user?.name || (role === "farmer" ? "Sokha Chea" : "Dara S."),
  );
  const [email, setEmail] = useState(
    user?.email || (role === "farmer" ? "sokha@sokhafarm.com" : "dara@buyer.com"),
  );
  const [phone, setPhone] = useState(role === "farmer" ? "+855 12 345 678" : "+855 16 482 390");
  const [province, setProvince] = useState(PROVINCES[0]);
  const [address, setAddress] = useState(
    role === "farmer" ? "Banan district, Battambang" : "Toul Kork, Phnom Penh",
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const saved = RICE_LISTINGS.filter((rice) => favorites.includes(rice.id)).slice(0, 6);

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error("Missing information", "Please fill in your name and email.");
      return;
    }
    toast.success("Profile updated", "Your personal information has been saved.");
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Missing fields", "Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Weak password", "New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", "Please re-enter your new password.");
      return;
    }
    toast.success("Password updated", "Your password was changed successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleFavorite = (item) => {
    const removing = isFavorite(item.id);
    toggle(item.id);
    if (removing) toast.info("Removed from favorites", item.name);
    else toast.success("Added to favorites", item.name);
  };

  return (
    <DashboardLayout
      nav={nav}
      title="My Profile"
      subtitle="Manage your account details"
      notificationPath={notificationPath}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8">
          <section className="card p-6 text-center">
            <div className="relative mx-auto w-fit">
              <Avatar name={fullName} size="xl" online ring />
              <IconButton
                label="Edit avatar"
                variant="soft"
                size="sm"
                onClick={() => toast.info("Photo upload", "Avatar editing is coming soon.")}
                className="absolute -bottom-1 -right-1"
              >
                <Camera className="h-4 w-4" />
              </IconButton>
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-ink">{fullName}</h2>
            <p className="mt-0.5 text-sm text-subtle">{email}</p>
            <div className="mt-3 flex justify-center">
              <Badge variant={role === "farmer" ? "success" : "info"}>{roleLabel}</Badge>
            </div>
            <dl className="mt-5 space-y-3 border-t border-line pt-5 text-left">
              <div className="flex items-center gap-3 text-sm text-subtle">
                <MapPin className="h-4 w-4 shrink-0 text-faint" aria-hidden />
                <span>{province}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-subtle">
                <Calendar className="h-4 w-4 shrink-0 text-faint" aria-hidden />
                <span>Member since March 2025</span>
              </div>
            </dl>
            <Button as={Link} to="/marketplace" variant="secondary" className="mt-6 w-full">
              Browse marketplace
            </Button>
          </section>

          <section className="card p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-50 text-gold-dark">
                <Bookmark className="h-5 w-5" aria-hidden />
              </span>
              <div className="flex-1">
                <p className="text-xl font-bold text-ink">{count}</p>
                <p className="text-sm text-subtle">Saved listings</p>
              </div>
              <Link
                to="/buyer/favorites"
                className="text-sm font-semibold text-primary transition hover:text-primary-dark"
              >
                View
              </Link>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 lg:col-span-2">
          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-ink">Personal information</h2>
            <form onSubmit={handleProfileSave} className="mt-5 space-y-4">
              <Input
                label="Full name"
                required
                icon={User}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
              <Input
                label="Email"
                type="email"
                required
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Input
                label="Phone"
                icon={Phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+855 …"
              />
              <Select
                label="Province"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              >
                <option value="">Select your province</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
              <Textarea
                label="Delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Street, village, district, city"
              />
              <Button type="submit" icon={Save}>
                Save changes
              </Button>
            </form>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-ink">Change password</h2>
            <form onSubmit={handlePasswordSave} className="mt-5 space-y-4">
              <PasswordInput
                label="Current password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                show={showCurrent}
                onToggleShow={() => setShowCurrent((v) => !v)}
              />
              <PasswordInput
                label="New password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                show={showNew}
                onToggleShow={() => setShowNew((v) => !v)}
                hint="At least 8 characters."
              />
              <PasswordInput
                label="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                show={showConfirm}
                onToggleShow={() => setShowConfirm((v) => !v)}
              />
              <Button type="submit" icon={Save}>
                Update password
              </Button>
            </form>
          </section>

          <section className="card p-6 xl:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Saved listings</h2>
                <p className="mt-0.5 text-sm text-subtle">Rice you have saved for later</p>
              </div>
              <Link
                to="/buyer/favorites"
                className="text-sm font-semibold text-primary transition hover:text-primary-dark"
              >
                View all
              </Link>
            </div>
            {saved.length ? (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {saved.map((item) => (
                  <RiceCard key={item.id} item={item} favorite onToggleFavorite={handleFavorite} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Bookmark}
                title="No saved listings yet"
                description="Browse the marketplace and tap the heart to save rice here."
                className="mt-5"
                action={
                  <Button as={Link} to="/marketplace" variant="secondary" size="sm">
                    Browse marketplace
                  </Button>
                }
              />
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
