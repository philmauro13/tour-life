"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/forms/input";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
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

    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError("Please complete every field to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const message = data.error || "We couldn't create your account. Please try again.";
        setError(message);
        return;
      }

      // Account created successfully
      setSuccess(`Account created for ${email.trim()}. Please check your email to confirm your account, then sign in.`);
      
      // Clear form
      setFullName("");
      setUsername("");
      setEmail("");
      setPassword("");
      
      // Redirect to login after a short delay to let user read the message
      setTimeout(() => {
        router.replace("/login");
      }, 3000);
    } catch {
      setError("Unable to connect to the server. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-shell flex min-h-[calc(100vh-88px)] items-center py-16">
      <div className="glass-strong mx-auto w-full max-w-lg rounded-[32px] p-8">
        <div className="badge bg-white/5 text-violet-200">Signup</div>
        <h1 className="mt-4 text-3xl font-semibold">Create your touring crew account.</h1>
        <p className="mt-3 text-sm text-white/65">
          Join Tour Crew Network to post jobs, apply to gigs, and keep your crew profile visible on the road.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70">Full name</label>
            <Input
              name="fullName"
              placeholder="Full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70">Username</label>
            <Input
              name="username"
              placeholder="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
            <p className="mt-2 text-xs text-white/50">
              Choose a short handle crew members can remember.
            </p>
          </div>
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
              placeholder="Create a password"
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
              ✓ {success}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-white/55">
          Already have an account? <Link href="/login" className="text-cyan-200">Sign in</Link> instead.
        </p>
      </div>
    </div>
  );
}
