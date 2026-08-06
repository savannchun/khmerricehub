import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BadgeCheck,
  Heart,
  Leaf,
  MapPin,
  MessageSquare,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import { Navbar, Footer } from "../components/layout/Navbar";
import { Button, IconButton, Reveal } from "../components/ui/core";
import { Avatar, Badge, Breadcrumb, ProgressBar, Rating } from "../components/ui/display";
import { Textarea } from "../components/ui/forms";
import { RiceCard, ReviewCard } from "../components/cards";
import { useToast } from "../components/ui/overlays";
import {
  FARMERS as DEMO_FARMERS,
  REVIEWS as DEMO_REVIEWS,
  RICE_LISTINGS as DEMO_LISTINGS,
} from "../lib/data";
import { getFarmers, getListings, getReviews } from "../lib/services";
import { useAsyncData } from "../lib/useAsyncData";
import { cx, formatPrice, formatNumber } from "../lib/utils";

function RiceViewer({ item, farmers, reviews, related }) {
  const farmer = farmers.find((f) => f.id === item.farmerId) || farmers[0];
  const [activeImage, setActiveImage] = useState(item.image);
  const [qty, setQty] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const toast = useToast();

  const toggleFavorite = () => {
    setFavorite((prev) => {
      if (prev) toast.info("Removed from favorites", `${item.name} was removed.`);
      else toast.success("Saved to favorites", `${item.name} was added.`);
      return !prev;
    });
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      toast.error("Pick a rating", "Select between 1 and 5 stars before submitting.");
      return;
    }
    toast.success("Review submitted", "Thank you for helping other buyers.");
    setReviewRating(0);
    setReviewText("");
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Marketplace", to: "/marketplace" },
            { label: item.name },
          ]}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="card relative overflow-hidden">
              <img
                src={activeImage}
                alt={item.name}
                className="h-[340px] w-full object-cover sm:h-[460px]"
              />
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <Badge variant="primary">{item.type}</Badge>
                {item.organic && (
                  <Badge variant="success" dot>
                    Organic
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              {item.gallery.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  aria-label={`View image for ${item.name}`}
                  aria-pressed={activeImage === image}
                  className={cx(
                    "h-20 w-20 overflow-hidden rounded-card border-2 transition-all",
                    activeImage === image
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-line hover:border-primary",
                  )}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{item.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Rating value={item.rating} showValue />
              <span className="text-sm text-subtle">({item.reviews} reviews)</span>
              <span className="flex items-center gap-1.5 text-sm text-subtle">
                <MapPin className="h-4 w-4 text-primary" aria-hidden />
                {item.province}, {item.district}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-1">
              <p className="font-display text-4xl font-bold text-primary">{formatPrice(item.price)}</p>
              <p className="pb-1 text-sm font-medium text-subtle">per kg</p>
            </div>

            <div className="mt-6">
              <ProgressBar value={item.stock} label="Stock level" />
              <p className="mt-2 text-sm text-subtle">
                <Package className="mr-1 inline h-4 w-4 align-[-3px] text-primary" aria-hidden />
                {formatNumber(item.quantity)} kg available this season
              </p>
            </div>

            <p className="mt-6 leading-7 text-ink-soft">{item.description}</p>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              {Object.entries(item.specs).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-subtle"
                >
                  <Leaf className="h-3.5 w-3.5 text-primary" aria-hidden />
                  {key}: <span className="text-ink">{value}</span>
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 rounded-card border border-line bg-surface p-5">
              <div className="flex items-center gap-2">
                <IconButton
                  label="Decrease quantity"
                  variant="surface"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                >
                  <Minus className="h-4 w-4" />
                </IconButton>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))
                  }
                  aria-label="Quantity in kilograms"
                  className="h-11 w-20 rounded-btn border border-line bg-bg text-center font-bold text-ink outline-none focus:border-primary"
                />
                <IconButton
                  label="Increase quantity"
                  variant="surface"
                  onClick={() => setQty((value) => Math.min(1000, value + 1))}
                >
                  <Plus className="h-4 w-4" />
                </IconButton>
                <span className="ml-1 text-sm font-medium text-subtle">kg</span>
              </div>
              <Button
                as={Link}
                to={`/checkout?item=${item.id}`}
                size="lg"
                icon={ShoppingBag}
                className="flex-1"
              >
                Order now
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                icon={Heart}
                className={cx(favorite && "border-danger/30 bg-danger-50 text-danger hover:bg-danger-50")}
                onClick={toggleFavorite}
              >
                {favorite ? "Saved" : "Save to favorites"}
              </Button>
              <Button as={Link} to="/buyer/messages" variant="ghost" icon={MessageSquare}>
                Contact seller
              </Button>
            </div>
          </div>
        </div>

        <Reveal className="mt-14">
          <div className="card flex flex-col gap-6 p-6 sm:flex-row sm:items-center lg:p-8">
            <Avatar name={farmer.owner} size="xl" online={farmer.verified} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold text-ink">{farmer.name}</h2>
                {farmer.verified && (
                  <BadgeCheck className="h-5 w-5 text-primary" aria-label="Verified farmer" />
                )}
                <Badge variant="neutral">{farmer.province}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Rating value={farmer.rating} />
                <span className="text-sm font-bold text-ink">{farmer.rating}</span>
                <span className="text-sm text-faint">({farmer.reviews} reviews)</span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-subtle">{farmer.bio}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/buyer/messages" variant="secondary" icon={MessageSquare}>
                Message
              </Button>
              <Button as={Link} to="/marketplace" variant="ghost" icon={Store}>
                Visit store
              </Button>
            </div>
          </div>
        </Reveal>

        {related.length > 0 && (
          <section className="mt-20">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-primary">
                    Keep exploring
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                    Related rice
                  </h2>
                </div>
                <Button as={Link} to="/marketplace" variant="secondary">
                  View all
                </Button>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedItem) => (
                <RiceCard key={relatedItem.id} item={relatedItem} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-20">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-primary">
                  From happy buyers
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                  Customer reviews
                </h2>
              </div>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="grid gap-6 sm:grid-cols-2">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            <form onSubmit={submitReview} className="card h-fit p-6 lg:sticky lg:top-24">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <MessageSquare className="h-5 w-5 text-primary" aria-hidden />
                Write a review
              </h3>
              <p className="mt-1 text-sm text-subtle">Share your experience with this rice.</p>
              <div className="mt-5">
                <p className="text-sm font-semibold text-ink">Your rating</p>
                <Rating value={reviewRating} onRate={setReviewRating} className="mt-2" />
              </div>
              <Textarea
                label="Your review"
                placeholder="How was the quality, aroma, and delivery?"
                rows={4}
                className="mt-5"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <Button type="submit" className="mt-5 w-full" icon={Truck}>
                Submit review
              </Button>
            </form>
          </div>
        </section>
      </main>
  );
}

export default function RiceDetails() {
  const { id } = useParams();
  const [listings] = useAsyncData(getListings, DEMO_LISTINGS);
  const [farmers] = useAsyncData(getFarmers, DEMO_FARMERS);
  const [reviews] = useAsyncData(getReviews, DEMO_REVIEWS);
  const item = listings.find((listing) => listing.id === id) || listings[0];
  const related = listings.filter(
    (listing) =>
      listing.category === item.category && listing.id !== item.id && listing.status === "Published",
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <RiceViewer key={item.id} item={item} farmers={farmers} reviews={reviews} related={related} />
      <Footer />
    </div>
  );
}
