import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Eye,
  Handshake,
  Heart,
  Leaf,
  Rocket,
  Sparkles,
  Target,
  Users,
  Wheat,
} from "../lib/fa";
import { Navbar, Footer } from "../components/layout/Navbar";
import { Button, Reveal } from "../components/ui/core";
import { Avatar, Timeline } from "../components/ui/display";
import {
  HERO_IMAGE,
  PARTNERS,
  PLATFORM_STATS,
  RICE_IMAGES,
  TEAM,
  TIMELINE,
} from "../lib/data";

const VALUES = [
  { icon: Target, title: "Our mission", text: "Give every Cambodian farmer a fair path to market and every buyer rice they can truly trust — transparent, traceable, and fairly priced." },
  { icon: Eye, title: "Our vision", text: "A Cambodia where the world's best rice is recognized for its origin, quality, and the farmers who grow it — traded fairly from field to table, everywhere." },
];

const STATS_ICONS = [Wheat, Users, Leaf, Heart];

export default function About() {
  const timelineItems = TIMELINE.map((entry) => ({
    label: entry.title,
    date: entry.year,
    description: entry.text,
    done: true,
  }));

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-primary-dark">
        <img
          src={HERO_IMAGE}
          alt="Cambodian rice fields at sunset"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/95 via-primary-dark/90 to-ink/90" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 text-center lg:px-8 lg:py-32">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20">
            <Wheat className="h-4 w-4 text-gold" aria-hidden />
            Our story
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Rice is Cambodia's heart. We're making sure it reaches the world.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-green-50/85">
            KhmerRiceHub began with a simple question: why should the people who grow the
            world's best rice struggle to find a fair market?
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button as={Link} to="/marketplace" variant="gold" size="lg" icon={ArrowRight}>
              Browse the harvest
            </Button>
            <Button as={Link} to="/register" variant="white" size="lg">
              Join as a farmer
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 md:grid-cols-2 lg:px-8">
        {VALUES.map((value, index) => (
          <Reveal key={value.title} delay={index * 120}>
            <div className="card h-full p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary">
                <value.icon className="h-7 w-7" aria-hidden />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold text-ink">{value.title}</h2>
              <p className="mt-3 leading-7 text-subtle">{value.text}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
              <Rocket className="h-4 w-4" aria-hidden />
              Our story
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
              Built with farmers, for everyone
            </h2>
            <p className="mt-4 leading-7 text-subtle">
              In 2018, our founders traveled Cambodia's rice belt and met farmers who grew
              award-winning jasmine but depended on intermediaries who captured most of the
              value. The idea was simple: build a marketplace where farmers set their own
              prices and buyers see exactly where their rice comes from.
            </p>
            <p className="mt-4 leading-7 text-subtle">
              Today, more than 1,200 verified farmers and 8,500 buyers trade on KhmerRiceHub
              across all 24 provinces — with traceability, secure payments, and fair prices
              baked into every transaction.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-4 py-2 text-sm font-semibold text-ink-soft">
                <Award className="h-4 w-4 text-gold-dark" aria-hidden />
                Award-winning varieties
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-4 py-2 text-sm font-semibold text-ink-soft">
                <Handshake className="h-4 w-4 text-primary" aria-hidden />
                Farmer-first pricing
              </span>
            </div>
          </Reveal>
          <Reveal delay={150} className="relative">
            <div className="overflow-hidden rounded-xl shadow-card-hover">
              <img
                src={RICE_IMAGES[1]}
                alt="Rice sacks at a Cambodian farm"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 right-6 animate-float rounded-card border border-line bg-surface p-5 shadow-pop">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <Sparkles className="h-5 w-5 text-gold" aria-hidden />
                Since 2018
              </p>
              <p className="mt-1 text-xs text-subtle">24 provinces connected</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">The journey</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            From one province to all 24
          </h2>
        </Reveal>
        <Reveal className="card mt-10 p-8 sm:p-10" delay={100}>
          <Timeline items={timelineItems} />
        </Reveal>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">The people</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Meet the team</h2>
            <p className="mx-auto mt-3 max-w-xl text-subtle">
              A small team of farmers, technologists, and rice lovers based across Cambodia.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member, index) => (
              <Reveal key={member.name} delay={index * 80}>
                <div className="card flex flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <Avatar name={member.name} size="xl" />
                  <h3 className="mt-4 font-display text-base font-bold text-ink">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-primary">{member.role}</p>
                  <p className="mt-0.5 text-xs text-subtle">{member.province}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark px-5 py-16 lg:px-8">
        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-gold/15" aria-hidden />
        <Reveal className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            {PLATFORM_STATS.map((stat, index) => {
              const Icon = STATS_ICONS[index] || Wheat;
              return (
                <div key={stat.label}>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-gold ring-1 ring-white/20">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <p className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-green-50/80">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <Reveal>
          <p className="text-center text-sm font-bold uppercase tracking-widest text-primary">
            Proud partners
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

      <Footer />
    </div>
  );
}
