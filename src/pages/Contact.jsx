import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Share2,
} from "lucide-react";
import { Navbar, Footer } from "../components/layout/Navbar";
import { Button, Reveal } from "../components/ui/core";
import { Input, Select, Textarea } from "../components/ui/forms";
import { Accordion } from "../components/ui/display";
import { useToast } from "../components/ui/overlays";
import { FAQS } from "../lib/data";

const SUBJECTS = [
  "General inquiry",
  "Bulk order",
  "Become a farmer",
  "Partnership",
  "Report an issue",
  "Other",
];

const INFO = [
  {
    icon: Building2,
    title: "Office",
    lines: ["#128, Street 63, Boeung Keng Kang 1", "Phnom Penh, Cambodia"],
  },
  {
    icon: Phone,
    title: "Call us",
    lines: ["+855 23 987 654", "Mon–Sat, 8:00–18:00"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["hello@khmerricehub.com", "We reply within one business day"],
  },
];

const SOCIALS = [
  { icon: MessageCircle, label: "Telegram" },
  { icon: Send, label: "WhatsApp" },
  { icon: Globe, label: "Website" },
  { icon: Share2, label: "Social" },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Missing details", "Please add your name, email, and a message.");
      return;
    }
    toast.success("Message sent!", "Our team will get back to you within one business day.");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  const faqItems = FAQS.slice(0, 3).map((faq) => ({
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
            <Mail className="h-4 w-4 text-gold" aria-hidden />
            We'd love to hear from you
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">Contact us</h1>
          <p className="mt-4 text-lg leading-8 text-green-50/85">
            Questions about an order, bulk buying, or selling your harvest? Our team is here
            to help, in Khmer and English.
          </p>
        </Reveal>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-8">
          <Reveal className="card p-7 sm:p-9">
            <h2 className="font-display text-2xl font-bold text-ink">Send us a message</h2>
            <p className="mt-2 text-subtle">
              Fill in the form and we'll respond as quickly as we can.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
              <Input
                label="Your name"
                placeholder="Dara K."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Phone number"
                type="tel"
                placeholder="+855 12 345 678"
                icon={Phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Select
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {SUBJECTS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <Textarea
                label="Message"
                placeholder="Tell us how we can help…"
                rows={5}
                className="sm:col-span-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" icon={Send}>
                  Send message
                </Button>
              </div>
            </form>
          </Reveal>

          <Reveal className="card overflow-hidden">
            <div className="relative grid h-64 place-items-center bg-gradient-to-br from-primary-100 via-primary-50 to-gold-50 sm:h-72">
              <span className="absolute inset-0 opacity-20" aria-hidden>
                <svg viewBox="0 0 400 200" className="h-full w-full" fill="none">
                  <path d="M0 150 Q100 100 200 140 T400 120" stroke="#2e7d32" strokeWidth="2" strokeDasharray="6 6" />
                  <path d="M0 110 Q120 60 220 100 T400 80" stroke="#43a047" strokeWidth="1.5" strokeDasharray="4 8" />
                </svg>
              </span>
              <div className="relative text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-surface text-primary shadow-card-hover">
                  <MapPin className="h-8 w-8" aria-hidden />
                </span>
                <p className="mt-4 font-display text-lg font-bold text-ink">
                  KhmerRiceHub HQ · Phnom Penh
                </p>
                <p className="mt-1 text-sm text-subtle">#128, Street 63, BKK1</p>
                <Button
                  as={Link}
                  to="/about"
                  variant="secondary"
                  size="sm"
                  icon={ArrowRight}
                  className="mt-5"
                >
                  Learn about us
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        <aside className="space-y-6">
          <Reveal className="card p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Clock className="h-5 w-5 text-primary" aria-hidden />
              Get in touch
            </h3>
            <div className="mt-5 space-y-5">
              {INFO.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{item.title}</p>
                    {item.lines.map((line) => (
                      <p key={line} className="mt-0.5 text-sm text-subtle">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="card p-6">
            <h3 className="font-display text-lg font-bold text-ink">Follow the harvest</h3>
            <p className="mt-1 text-sm text-subtle">
              Farm stories, new listings, and market news.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {SOCIALS.map((social) => (
                <button
                  key={social.label}
                  type="button"
                  aria-label={social.label}
                  className="flex items-center gap-2.5 rounded-card border border-line bg-bg px-4 py-3 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                  <social.icon className="h-4.5 w-4.5" aria-hidden />
                  {social.label}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal className="card p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <MessageCircle className="h-5 w-5 text-primary" aria-hidden />
              Quick answers
            </h3>
            <Accordion items={faqItems} className="mt-4" />
            <Button
              as={Link}
              to="/faq"
              variant="ghost"
              icon={ArrowRight}
              className="mt-4 w-full"
            >
              View all questions
            </Button>
          </Reveal>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
