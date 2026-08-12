import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppleWhole,
  ArrowRight,
  Award,
  BadgeCheck,
  BowlRice,
  CheckCircle2,
  HandCoins,
  Leaf,
  Mail,
  MapPin,
  MessageSquare,
  Mound,
  Quote,
  Search,
  Seedling,
  Sparkles,
  Star,
  Tractor,
  Truck,
  Wheat,
} from "../lib/fa";
import { Navbar, Footer } from "../components/layout/Navbar";
import { Button, Reveal } from "../components/ui/core";
import { Chip, Rating } from "../components/ui/display";
import { RiceCard, FarmerCard } from "../components/cards";
import farmerSunset from "../assets/farmers/farmer-sunset.jpg";
import { useToast } from "../components/ui/overlays";
import {
  CATEGORIES,
  FARMERS as DEMO_FARMERS,
  HERO_IMAGE,
  PARTNERS,
  PLATFORM_STATS,
  TESTIMONIALS,
} from "../lib/data";
import { getFarmers, getListings } from "../lib/services";
import { useAsyncData } from "../lib/useAsyncData";

const FEATURES = [
  {
    icon: Leaf,
    title: "Organic & traceable",
    text: "Every sack is traceable to a single farm with harvest and quality details.",
  },
  {
    icon: BadgeCheck,
    title: "Verified farmers only",
    text: "Identity, land, and quality checks before any farmer can list a harvest.",
  },
  {
    icon: HandCoins,
    title: "Fair, transparent pricing",
    text: "Farmers set their own prices and you see exactly what you pay — no hidden fees.",
  },
  {
    icon: Truck,
    title: "Nationwide delivery",
    text: "Tracked delivery from the farm gate to your door across all 24 provinces.",
  },
];

const STEPS = [
  {
    icon: Search,
    title: "Browse & compare",
    text: "Search jasmine, fragrant, red, and glutinous rice by province, type, and price.",
  },
  {
    icon: MessageSquare,
    title: "Connect with farmers",
    text: "Chat directly, request samples, and negotiate bulk pricing before you order.",
  },
  {
    icon: Truck,
    title: "Order & receive",
    text: "Pay securely and follow live tracking from the field to your table.",
  },
];

const HERO_STATS = [
  { icon: Tractor, value: "2,500+", label: "Farmers" },
  { icon: Wheat, value: "500+", label: "Rice Listings" },
  { icon: MapPin, value: "18", label: "Provinces" },
  { icon: Star, value: "4.9", label: "Customer Rating" },
];

const CATEGORY_ICONS = {
  fragrant: Wheat,
  jasmine: Seedling,
  organic: Leaf,
  white: BowlRice,
  glutinous: Mound,
  red: AppleWhole,
  specialty: Award,
};

const published = (listings) => listings.filter((l) => l.status === "Published");

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All Rice");
  const [favorites, setFavorites] = useState(() => new Set());
  const [email, setEmail] = useState("");
  const toast = useToast();
  const [listings] = useAsyncData(getListings, []);
  const [farmers] = useAsyncData(getFarmers, DEMO_FARMERS);

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

  const featured =
    activeCategory === "All Rice"
      ? published(listings)
      : published(listings).filter((item) => item.type === activeCategory);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email", "Please enter a valid email address.");
      return;
    }
    toast.success("You're subscribed!", "Fresh harvest alerts are on their way.");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-primary-dark">
        <img
          src={farmerSunset}
          alt="A Cambodian rice farmer standing in a lush green field at golden hour"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/60 to-ink/35" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-14 py-20 sm:py-24 lg:min-h-[calc(100vh-72px)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-0">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur">
                <Wheat className="h-4 w-4 text-gold" aria-hidden />
                Empowering Cambodian Farmers
              </span>
              <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl xl:text-6xl">
                Buy Premium{" "}
                <span className="inline-block rounded-xl bg-primary-100 px-3 py-0.5 text-primary shadow-float">
                  Cambodian Rice
                </span>{" "}
                Directly From Trusted Farmers
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-green-50/90">
                Discover fresh, high-quality Cambodian rice sourced directly from verified local
                farmers. Support sustainable agriculture while enjoying premium products from
                Cambodia's fertile rice-growing regions.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  as={Link}
                  to="/marketplace"
                  variant="gold"
                  size="lg"
                  icon={ArrowRight}
                  className="hover:-translate-y-0.5 hover:shadow-pop"
                >
                  Explore Marketplace
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="white"
                  size="lg"
                  className="bg-white/10 text-white ring-1 ring-white/25 backdrop-blur hover:-translate-y-0.5 hover:bg-white hover:text-primary"
                >
                  Become a Seller
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {HERO_STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className="animate-float rounded-2xl border border-white/20 bg-white/10 p-5 shadow-pop backdrop-blur-md sm:p-6"
                  style={{ animationDelay: `${index * 0.9}s` }}
                >
                  <span
                    className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-gold"
                    aria-hidden
                  >
                    <stat.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-green-50/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-5 sm:-mt-12 lg:px-8">
        <Reveal className="card grid grid-cols-2 gap-y-8 px-6 py-8 sm:grid-cols-4 lg:px-10">
          {PLATFORM_STATS.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="font-display text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-subtle">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Fresh harvests</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Featured rice</h2>
            <p className="mt-3 max-w-xl text-subtle">
              Hand-picked listings from the season's best crop, ready for immediate order.
            </p>
          </div>
          <Button as={Link} to="/marketplace" variant="secondary" icon={ArrowRight}>
            View all listings
          </Button>
        </Reveal>
        <Reveal className="mt-8 flex flex-wrap gap-2.5" delay={100}>
          <Chip active={activeCategory === "All Rice"} onClick={() => setActiveCategory("All Rice")}>
            All Rice
          </Chip>
          {CATEGORIES.map((category) => (
            <Chip
              key={category.id}
              active={activeCategory === category.name}
              onClick={() => setActiveCategory(category.name)}
            >
              {category.name}
            </Chip>
          ))}
        </Reveal>
        {featured.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <RiceCard
                key={item.id}
                item={item}
                favorite={favorites.has(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="card mt-8 flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary">
              <Wheat className="h-7 w-7" aria-hidden />
            </span>
            <h3 className="font-display text-lg font-bold text-ink">No rice in this category yet</h3>
            <p className="max-w-sm text-sm text-subtle">
              Try another category or check back after the next harvest.
            </p>
            <Button variant="secondary" className="mt-2" onClick={() => setActiveCategory("All Rice")}>
              Show all rice
            </Button>
          </div>
        )}
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Shop by category</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Popular categories</h2>
            <p className="mt-3 text-subtle">
              From everyday white rice to award-winning Phka Rumduol — find the variety you need.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => (
              <Reveal key={category.id} delay={index * 60}>
                <Link
                  to="/marketplace"
                  className="card group flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${category.color}1f`, color: category.color }}
                  >
                    {(() => {
                      const CategoryIcon = CATEGORY_ICONS[category.id] ?? Wheat;
                      return <CategoryIcon className="h-6 w-6" aria-hidden />;
                    })()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-base font-bold text-ink">
                      {category.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-subtle">{category.count} listings</span>
                  </span>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-faint transition-all group-hover:translate-x-1 group-hover:text-primary"
                    aria-hidden
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Simple by design</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">How KhmerRiceHub works</h2>
          <p className="mt-3 text-subtle">
            Three steps between a farmer's harvest and your kitchen.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 120}>
              <div className="card group relative h-full overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <span className="absolute -right-3 -top-6 font-display text-[88px] font-bold leading-none text-primary-50 transition-colors group-hover:text-primary-100">
                  {index + 1}
                </span>
                <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary">
                  <step.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="relative mt-5 font-display text-lg font-bold text-ink">{step.title}</h3>
                <p className="relative mt-2 text-sm leading-6 text-subtle">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-4 w-4" aria-hidden />
              Why KhmerRiceHub
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
              Rice with a story you can trust
            </h2>
            <p className="mt-4 leading-7 text-subtle">
              We built the marketplace around the people who grow the rice. Every order
              supports a verified farm, and every listing tells you exactly what you're buying.
            </p>
            <ul className="mt-8 space-y-5">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary">
                    <feature.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink">{feature.title}</h3>
                    <p className="mt-0.5 text-sm leading-6 text-subtle">{feature.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150} className="relative">
            <div className="overflow-hidden rounded-xl shadow-card-hover">
              <img
                src={HERO_IMAGE}
                alt="Rice paddies stretching to the horizon"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 left-6 animate-float rounded-card border border-line bg-surface p-5 shadow-pop">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <CheckCircle2 className="h-5 w-5 text-success" aria-hidden />
                Harvest verified
              </p>
              <p className="mt-1 text-xs text-subtle">Rainy season 2026 · Battambang</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Meet the growers</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Top farmers</h2>
            <p className="mt-3 max-w-xl text-subtle">
              The highest-rated farms on KhmerRiceHub, ready to take your order.
            </p>
          </div>
          <Button as={Link} to="/marketplace" variant="secondary" icon={ArrowRight}>
            Meet everyone
          </Button>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {farmers.slice(0, 3).map((farmer, index) => (
            <Reveal key={farmer.id} delay={index * 100}>
              <FarmerCard farmer={farmer} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-primary-dark py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-gold">Testimonials</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Loved by buyers and farmers alike
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((testimonial, index) => (
              <Reveal key={testimonial.id} delay={index * 90}>
                <figure className="flex h-full flex-col rounded-card bg-white/10 p-6 ring-1 ring-white/10 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/15">
                  <Quote className="h-7 w-7 text-gold" aria-hidden />
                  <blockquote className="mt-4 flex-1 text-sm leading-7 text-green-50/90">
                    “{testimonial.text}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-sm font-bold text-ink">
                      {testimonial.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-white">{testimonial.name}</span>
                      <span className="block truncate text-xs text-green-50/70">{testimonial.role}</span>
                    </span>
                    <Rating value={testimonial.rating} className="ml-auto" />
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <Reveal>
          <p className="text-center text-sm font-bold uppercase tracking-widest text-primary">
            Working alongside
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {PARTNERS.map((partner) => (
              <span
                key={partner}
                className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-bold text-ink-soft shadow-card transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                {partner}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-dark px-6 py-14 text-center shadow-pop sm:px-12">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" aria-hidden />
          <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-gold/15" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20">
              <Mail className="h-4 w-4 text-gold" aria-hidden />
              Harvest alerts
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl">
              Get the freshest harvests in your inbox
            </h2>
            <p className="mt-3 text-green-50/85">
              New listings, price trends, and farm stories — once a week, no spam.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 rounded-card bg-surface p-2 sm:flex-row"
            >
              <label className="flex flex-1 items-center gap-3 px-4 py-3">
                <Mail className="h-5 w-5 shrink-0 text-faint" aria-hidden />
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-ink outline-none placeholder:text-faint"
                />
              </label>
              <Button type="submit" variant="gold" size="lg" className="shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
