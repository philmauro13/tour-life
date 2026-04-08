import Link from "next/link";
import { ArrowRight, ShieldCheck, Siren, Users, Sparkles, Radio } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Urgent fills, without the chaos",
    description:
      "Publish immediate crew needs with real urgency signals, clear rates, and location context built for touring reality.",
    icon: <Siren className="h-5 w-5" />,
  },
  {
    title: "Trusted crew profiles",
    description:
      "Profiles are built around real touring roles — FOH, TM, LD, merch, backline, drivers, PMs, and local support.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Modern touring workflow",
    description:
      "A premium interface for production teams who need speed, clarity, and confidence under show-day pressure.",
    icon: <Sparkles className="h-5 w-5" />,
  },
];

export default function HomePage() {
  return (
    <div className="pb-24">
      <section className="container-shell pt-16 md:pt-24">
        <div className="glass-strong rounded-[36px] px-6 py-10 md:px-12 md:py-16">
          <div className="badge mb-6 bg-white/5 text-violet-200">
            <Radio className="h-3.5 w-3.5" /> Premium marketplace for live production labor
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.02]">
                The <span className="text-gradient">operating system</span> for touring labor.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
                Tour Crew Network helps touring acts, production managers, and local crew connect fast for urgent fills and planned runs — without the noise of generic job boards.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/live">
                  <Button className="w-full sm:w-auto">
                    Browse live jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/post">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    Post a crew need
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/50">Live system pulse</div>
                  <div className="mt-2 text-3xl font-semibold">27 active posts</div>
                </div>
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                  Crew online now
                </div>
              </div>
              <div className="space-y-4">
                {[
                  "FOH engineer needed • Chicago • tonight",
                  "Tour merch seller • LA • weekend fly dates",
                  "Lighting director • Nashville • 3-week run",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/72">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell mt-20">
        <SectionHeading
          eyebrow="Why this exists"
          title="Built for dark venues, fast decisions, and real touring pressure."
          description="Not a freelancer marketplace. Not a generic staffing board. Tour Crew Network is purpose-built for the rhythm of live production."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="glass rounded-[28px] p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell mt-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-[32px] p-8">
            <ShieldCheck className="h-8 w-8 text-violet-300" />
            <h3 className="mt-5 text-2xl font-semibold">Poster-side control</h3>
            <p className="mt-3 text-white/65 leading-7">
              Manage jobs, review applicants, and keep urgent staffing needs in one modern dashboard instead of scattered group chats and PDFs.
            </p>
          </div>
          <div className="glass rounded-[32px] p-8">
            <Users className="h-8 w-8 text-cyan-300" />
            <h3 className="mt-5 text-2xl font-semibold">Crew-side credibility</h3>
            <p className="mt-3 text-white/65 leading-7">
              Profiles showcase role, city, specialty, and touring background so talent can be evaluated in seconds.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
