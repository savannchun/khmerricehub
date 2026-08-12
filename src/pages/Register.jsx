import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, UserRound, Wheat } from "../lib/fa";
import { Logo } from "../components/layout/Navbar";
import { Button } from "../components/ui/core";
import { Checkbox, Input, PasswordInput, RadioGroup } from "../components/ui/forms";
import { useToast } from "../components/ui/overlays";
import { useAuth } from "../context/AuthContext";
import { RICE_IMAGES } from "../lib/services";

const ACCOUNT_TYPES = [
  { value: "buyer", label: "Buyer", sub: "Shop for rice" },
  { value: "farmer", label: "Farmer", sub: "Sell your harvest" },
];

function readableAuthError(code) {
  const map = {
    "auth/email-already-in-use": "An account already exists for that email.",
    "auth/invalid-email": "That email address is not valid.",
    "auth/weak-password": "Use at least 8 characters for your password.",
    "auth/operation-not-allowed": "Email/password sign-up is not enabled in Firebase.",
  };
  return map[code] || null;
}

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

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState("buyer");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, googleSignIn, demoLogin } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      toast.error("Missing details", "Please fill in every field to continue.");
      return;
    }
    if (password.length < 8) {
      toast.error("Weak password", "Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match", "Please re-enter your password to confirm.");
      return;
    }
    if (!agree) {
      toast.error("Terms required", "Please accept the Terms of Service to continue.");
      return;
    }
    setLoading(true);
    try {
      await register({ name: fullName, email, phone, password, role });
      toast.success(
        "Account created!",
        role === "farmer" ? "Welcome to the KhmerRiceHub family." : "Welcome to KhmerRiceHub.",
      );
      navigate(role === "farmer" ? "/farmer/dashboard" : "/buyer/dashboard");
    } catch (err) {
      toast.error("Sign-up failed", readableAuthError(err.code) || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleSignIn();
      toast.success("Signed up with Google", "Welcome to KhmerRiceHub.");
      navigate("/buyer/dashboard");
    } catch {
      toast.error("Google sign-up failed", "Please use the form or continue as a demo account.");
    }
  };

  const handleDemo = () => {
    demoLogin(role, role === "farmer" ? "Sokha Chea" : "Dara K.");
    toast.success("Welcome to KhmerRiceHub!", "You're exploring as a demo account.");
    navigate(role === "farmer" ? "/farmer/dashboard" : "/buyer/dashboard");
  };

  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-primary-dark lg:flex lg:flex-col">
        <img
          src={RICE_IMAGES[0]}
          alt="Freshly harvested rice"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/95 via-primary-dark/90 to-ink/90" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Logo variant="light" />
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20">
              <Wheat className="h-4 w-4 text-gold" aria-hidden />
              Join 8,500+ happy buyers
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white xl:text-5xl">
              Create your account in under a minute.
            </h1>
            <p className="mt-5 text-lg leading-8 text-green-50/85">
              Whether you're stocking your kitchen or selling your harvest, KhmerRiceHub
              makes it simple, transparent, and fair.
            </p>
            <ul className="mt-8 space-y-3 text-sm font-medium text-white">
              <li className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-sm font-bold text-ink">
                  1
                </span>
                Set up your free account
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-sm font-bold text-ink">
                  2
                </span>
                Browse or list your harvest
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-sm font-bold text-ink">
                  3
                </span>
                Order and get tracked delivery
              </li>
            </ul>
          </div>
        </div>
      </section>

      <main className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo variant="dark" />
          </div>
          <div className="card p-8 sm:p-10">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Create an account</h2>
            <p className="mt-2 text-subtle">Join the marketplace connecting Cambodia's rice.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Input
                label="Full name"
                placeholder="Dara K."
                icon={UserRound}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Input
                label="Phone number"
                type="tel"
                placeholder="+855 12 345 678"
                icon={Phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
              <PasswordInput
                label="Password"
                placeholder="At least 8 characters"
                show={showPassword}
                onToggleShow={() => setShowPassword((value) => !value)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <PasswordInput
                label="Confirm password"
                placeholder="Repeat your password"
                show={showConfirm}
                onToggleShow={() => setShowConfirm((value) => !value)}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />

              <RadioGroup
                label="I want to join as a"
                value={role}
                onChange={setRole}
                options={ACCOUNT_TYPES}
                columns={2}
              />

              <Checkbox
                label="I agree to the Terms of Service & Privacy Policy"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />

              <Button type="submit" size="lg" loading={loading} className="w-full">
                Create account
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
              Skip — continue as demo {role}
            </Button>

            <p className="mt-8 text-center text-sm text-subtle">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary transition hover:text-primary-dark">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
