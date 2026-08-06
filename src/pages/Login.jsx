import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, ShieldCheck, Star } from "lucide-react";
import { Logo } from "../components/layout/Navbar";
import { Button } from "../components/ui/core";
import { Checkbox, Input, PasswordInput } from "../components/ui/forms";
import { useToast } from "../components/ui/overlays";
import { useAuth } from "../context/AuthContext";
import { HERO_IMAGE } from "../lib/services";

function GoogleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function readableAuthError(code) {
  const map = {
    "auth/user-not-found": "No account found for that email.",
    "auth/wrong-password": "That password is incorrect.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/invalid-email": "That email address is not valid.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/user-disabled": "This account has been disabled.",
  };
  return map[code] || null;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, googleSignIn, demoLogin } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Missing details", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const loggedIn = await login(email, password);
      const role = loggedIn?.role || "buyer";
      const name = loggedIn?.name || email.split("@")[0];
      toast.success("Welcome back!", `You're now logged in as a ${role}.`);
      navigate(role === "farmer" ? "/farmer/dashboard" : "/buyer/dashboard", { state: { name } });
    } catch (err) {
      toast.error("Login failed", readableAuthError(err.code) || "Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const loggedIn = await googleSignIn();
      toast.success("Signed in with Google", `Welcome back, ${loggedIn?.name || "buyer"}.`);
      navigate("/buyer/dashboard");
    } catch {
      toast.error("Google sign-in failed", "Please use email + password or the demo account.");
    }
  };

  const handleDemo = () => {
    demoLogin("buyer", "Dara K.");
    toast.success("Welcome back, Dara!", "You're now logged in as a buyer (demo).");
    navigate("/buyer/dashboard");
  };

  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-primary-dark lg:flex lg:flex-col">
        <img
          src={HERO_IMAGE}
          alt="Rice terraces in Cambodia"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/95 via-primary-dark/90 to-ink/90" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Logo variant="light" />
          <div className="max-w-lg">
            <h1 className="font-display text-4xl font-bold leading-tight text-white xl:text-5xl">
              Buy direct from the farmers of Cambodia.
            </h1>
            <p className="mt-5 text-lg leading-8 text-green-50/85">
              Traceable premium rice, fair prices, and delivery across all 24 provinces —
              from field to table.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20">
                <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
                Secure payments
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20">
                <Star className="h-4 w-4 text-gold" aria-hidden />
                Verified farmers
              </span>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-16 right-12 animate-float rounded-card border border-white/10 bg-surface p-5 shadow-pop">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-50 text-gold-dark">
                <Star className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-display text-xl font-bold text-ink">98%</p>
                <p className="text-xs font-medium text-subtle">buyer satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo variant="dark" />
          </div>
          <div className="card p-8 sm:p-10">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Welcome back</h2>
            <p className="mt-2 text-subtle">
              Log in to continue ordering rice directly from Cambodian farms.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                show={showPassword}
                onToggleShow={() => setShowPassword((value) => !value)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <div className="flex items-center justify-between gap-3">
                <Checkbox
                  label="Remember me"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <button
                  type="button"
                  className="text-sm font-semibold text-primary transition hover:text-primary-dark"
                >
                  Forgot password?
                </button>
              </div>
              <Button type="submit" size="lg" loading={loading} className="w-full" icon={ArrowRight}>
                Log in
              </Button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-line" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wide text-faint">
                or continue with
              </span>
              <span className="h-px flex-1 bg-line" aria-hidden />
            </div>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              icon={GoogleIcon}
              onClick={handleGoogle}
              className="w-full"
            >
              Continue with Google
            </Button>

            <Button type="button" variant="ghost" size="lg" onClick={handleDemo} className="w-full">
              Skip — continue as demo buyer
            </Button>

            <p className="mt-8 text-center text-sm text-subtle">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-primary transition hover:text-primary-dark">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
