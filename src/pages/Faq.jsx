import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle, Mail, MessageCircle, Phone, Wheat } from "lucide-react";
import { Navbar, Footer } from "../components/layout/Navbar";
import { Button, Reveal } from "../components/ui/core";
import { SearchBar } from "../components/ui/forms";
import { Accordion, Chip, EmptyState } from "../components/ui/display";
import { FAQS } from "../lib/data";

export default function Faq() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(FAQS.map((faq) => faq.category)))],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((faq) => {
      const matchesCategory = category === "All" || faq.category === category;
      const matchesQuery =
        !q ||
        [faq.question, faq.answer, faq.category].some((field) =>
          field.toLowerCase().includes(q),
        );
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const reset = () => {
    setQuery("");
    setCategory("All");
  };

  const accordionItems = filtered.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <section className="bg-gradient-to-br from-primary to-primary-dark px-5 py-16 lg:px-8 lg:py-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20">
            <HelpCircle className="h-4 w-4 text-gold" aria-hidden />
            Help center
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">
            How can we help?
          </h1>
          <p className="mt-4 text-lg leading-8 text-green-50/85">
            Answers to the most common questions about buying, selling, and delivery.
          </p>
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            size="lg"
            className="mx-auto mt-8 max-w-xl bg-surface/95"
          />
        </Reveal>
      </section>

      <main className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
        <Reveal className="flex flex-wrap justify-center gap-2.5">
          {categories.map((cat) => (
            <Chip key={cat} active={category === cat} onClick={() => setCategory(cat)}>
              {cat}
            </Chip>
          ))}
        </Reveal>

        {accordionItems.length > 0 ? (
          <Reveal className="mt-10">
            <Accordion items={accordionItems} />
          </Reveal>
        ) : (
          <Reveal className="mt-10">
            <EmptyState
              icon={HelpCircle}
              title="No answers found"
              description={`Nothing matched "${query}" in ${category}. Try a different keyword or category.`}
              action={
                <Button variant="secondary" onClick={reset}>
                  Reset search
                </Button>
              }
            />
          </Reveal>
        )}

        <Reveal className="card mt-16 overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
            <div className="p-8 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary">
                <Wheat className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-4 font-display text-2xl font-bold text-ink">
                Still have questions?
              </h2>
              <p className="mt-2 text-subtle">
                Our team is happy to help with anything not covered above — in Khmer or English.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button as={Link} to="/contact" variant="primary" icon={MessageCircle}>
                  Contact support
                </Button>
                <Button as={Link} to="/contact" variant="ghost" icon={Mail}>
                  Email us
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4 border-t border-line bg-primary-50/60 p-8 lg:border-l lg:border-t-0 sm:p-10">
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface text-primary shadow-card">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">+855 23 987 654</p>
                  <p className="text-xs text-subtle">Mon–Sat, 8:00–18:00</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface text-primary shadow-card">
                  <Mail className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">hello@khmerricehub.com</p>
                  <p className="text-xs text-subtle">Replies within one business day</p>
                </div>
              </div>
              <Button
                as={Link}
                to="/marketplace"
                variant="secondary"
                icon={ArrowRight}
                className="mt-2"
              >
                Browse the marketplace
              </Button>
            </div>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
