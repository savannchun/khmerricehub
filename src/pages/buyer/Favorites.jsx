import { Link } from "react-router-dom";
import { Heart, Store } from "lucide-react";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/core";
import { Badge, EmptyState } from "../../components/ui/display";
import { RiceCard } from "../../components/cards";
import { useToast } from "../../components/ui/overlays";
import { NAV_BUYER, RICE_LISTINGS as DEMO_LISTINGS } from "../../lib/data";
import { getListings } from "../../lib/services";
import { useAsyncData } from "../../lib/useAsyncData";
import { useFavorites } from "./useFavorites";

export default function Favorites() {
  const toast = useToast();
  const { count, favorites, isFavorite, toggle } = useFavorites();
  const [listings] = useAsyncData(getListings, DEMO_LISTINGS);

  const items = listings.filter((rice) => favorites.includes(rice.id));

  const handleToggle = (item) => {
    const removing = isFavorite(item.id);
    toggle(item.id);
    if (removing) toast.info("Removed from favorites", item.name);
    else toast.success("Added to favorites", item.name);
  };

  return (
    <DashboardLayout
      nav={NAV_BUYER}
      title="Favorites"
      subtitle="Rice you have saved for later"
      notificationPath="/buyer/notifications"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">Your favorites</h2>
            <p className="mt-1 text-sm text-subtle">
              {count} saved listing{count === 1 ? "" : "s"}
            </p>
          </div>
          <Badge variant="primary" className="w-fit">
            {count} items
          </Badge>
        </div>

        {items.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <RiceCard key={item.id} item={item} favorite onToggleFavorite={handleToggle} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Tap the heart on any rice listing to save it here for quick access."
            action={
              <Button as={Link} to="/marketplace" icon={Store}>
                Browse marketplace
              </Button>
            }
          />
        )}
      </div>
    </DashboardLayout>
  );
}
