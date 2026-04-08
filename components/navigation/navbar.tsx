"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Radio, BriefcaseBusiness, LogOut, User } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/actions/auth";

const publicLinks = [
  { href: "/live", label: "Live Jobs" },
  { href: "/login", label: "Login" },
];

const authenticatedLinks = [
  { href: "/live", label: "Live Jobs" },
  { href: "/post", label: "Post a Job" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const { user, loading } = useAuth();
  const [profileUsername, setProfileUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const supabase = createClient();

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data?.username) {
        setProfileUsername(data.username);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="container-shell flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <BriefcaseBusiness className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-white/60">
                Tour Crew Network
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Radio className="h-3.5 w-3.5 text-violet-300" />
                The operating system for touring labor
              </div>
            </div>
          </Link>
        </div>
      </header>
    );
  }

  const links = user ? authenticatedLinks : publicLinks;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <BriefcaseBusiness className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-white/60">
              Tour Crew Network
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Radio className="h-3.5 w-3.5 text-violet-300" />
              The operating system for touring labor
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/72 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {user && profileUsername && (
            <Link
              href={`/profile/${profileUsername}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/72 transition hover:text-white"
            >
              <User className="h-4 w-4" />
              My Profile
            </Link>
          )}
          {user && (
            <Link
              href="/settings/profile"
              className="text-sm font-medium text-white/72 transition hover:text-white"
            >
              Edit Profile
            </Link>
          )}
          {user && (
            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/72 transition hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
