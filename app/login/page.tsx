"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/forms/input";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const message = data.error || "We couldn't sign you in. Double-check your credentials and try again.";
        setError(message);
        return;
      }

      setSuccess("Signed in successfully. Redirecting to your dashboard…");
      router.replace("/dashboard");
    } catch {
      setError("Unable to connect to the server. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-shell flex min-h-[calc(100vh-88px)] items-center py-16">
      <div className="glass-strong mx-auto w-full max-w-lg rounded-[32px] p-8">
        <div className="badge bg-white/5 text-cyan-200">Login</div>
        <h1 className="mt-4 text-3xl font-semibold">Return to your crew workflow.</h1>
        <p className="mt-3 text-sm text-white/65">
          Sign in to manage live job posts, review applications, and keep your touring profile active.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70">Password</label>
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200" aria-live="polite">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200" aria-live="polite">
              {success}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-sm text-white/55">
            New to Tour Crew Network? <Link href="/signup" className="text-cyan-200">Create an account</Link> and start posting or applying today.
          </p>
        </form>
      </div>
    </div>
  );
}
