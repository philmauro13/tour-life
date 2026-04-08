import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { SupabaseAuthProvider } from "@/components/auth/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tour Crew Network",
    template: "%s | Tour Crew Network",
  },
  description:
    "The operating system for touring labor — premium marketplace for live production crews, urgent fills, and touring opportunities.",
  metadataBase: new URL("https://tourcrewnetwork.com"),
  openGraph: {
    title: "Tour Crew Network",
    description:
      "Connect touring acts, production teams, and local crew with urgency, trust, and modern tools.",
    siteName: "Tour Crew Network",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full text-white">
        <SupabaseAuthProvider>
          <div className="relative min-h-screen overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0 grid-glow opacity-40" />
            <Navbar />
            <main className="relative z-10">{children}</main>
          </div>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
