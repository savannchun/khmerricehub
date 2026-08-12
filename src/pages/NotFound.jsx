import { Link } from "react-router-dom";
import { ArrowRight, Home, Search } from "../lib/fa";
import { Navbar, Footer } from "../components/layout/Navbar";
import { Button } from "../components/ui/core";

function NotFoundArt() {
  return (
    <svg
      viewBox="0 0 240 220"
      className="mx-auto w-64 animate-fade-up sm:w-72"
      role="img"
      aria-label="Illustration of a cracked basket with spilled rice"
    >
      <path d="M50 110 C50 160 95 185 120 185 C145 185 190 160 190 110 Z" fill="#eef7ee" />
      <path
        d="M50 110 C50 160 95 185 120 185 C145 185 190 160 190 110 Z"
        fill="none"
        stroke="#2e7d32"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx="120" cy="110" rx="70" ry="16" fill="#ffffff" />
      <ellipse cx="120" cy="110" rx="70" ry="16" fill="none" stroke="#2e7d32" strokeWidth="3" />
      <path
        d="M148 106 L160 118 L152 129"
        fill="none"
        stroke="#dc2626"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="#f9a825">
        <ellipse cx="168" cy="126" rx="7" ry="4.5" transform="rotate(24 168 126)" />
        <ellipse cx="184" cy="134" rx="7" ry="4.5" transform="rotate(40 184 134)" />
        <ellipse cx="150" cy="140" rx="7" ry="4.5" transform="rotate(-12 150 140)" />
        <ellipse cx="176" cy="148" rx="7" ry="4.5" transform="rotate(18 176 148)" />
        <ellipse cx="130" cy="138" rx="7" ry="4.5" transform="rotate(-30 130 138)" />
        <ellipse cx="98" cy="118" rx="6" ry="4" transform="rotate(-8 98 118)" />
        <ellipse cx="110" cy="128" rx="6" ry="4" transform="rotate(14 110 128)" />
        <ellipse cx="86" cy="126" rx="6" ry="4" transform="rotate(-22 86 126)" />
        <ellipse cx="138" cy="126" rx="6" ry="4" transform="rotate(10 138 126)" />
        <ellipse cx="120" cy="142" rx="6" ry="4" transform="rotate(4 120 142)" />
      </g>
      <path d="M120 110 L120 58" fill="none" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M120 58 C118 52 112 50 106 46"
        fill="none"
        stroke="#43a047"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M120 58 C122 50 128 46 134 40"
        fill="none"
        stroke="#43a047"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text x="120" y="212" textAnchor="middle" fontSize="26" fontWeight="700" fill="#263238">
        404
      </text>
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="flex flex-col items-center justify-center px-5 py-24 text-center">
        <NotFoundArt />
        <h1 className="mt-8 font-display text-3xl font-bold text-ink sm:text-4xl">Page not found</h1>
        <p className="mt-3 max-w-md leading-7 text-subtle">
          The page you're looking for may have been moved, renamed, or never existed. Let's
          get you back to the good rice.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button as={Link} to="/" variant="primary" size="lg" icon={Home}>
            Back to home
          </Button>
          <Button as={Link} to="/marketplace" variant="secondary" size="lg" icon={Search}>
            Browse marketplace
          </Button>
        </div>
        <p className="mt-10 flex items-center gap-1.5 text-sm text-faint">
          Looking for something specific?
          <Link to="/faq" className="inline-flex items-center gap-1 font-semibold text-primary transition hover:text-primary-dark">
            Visit the help center <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
