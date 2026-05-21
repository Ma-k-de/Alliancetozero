import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-zinc-950">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, transparent 55%, #09090b 100%),
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 72px 72px, 72px 72px',
        }}
      />

      {/* Green atmospheric glow */}
      <div className="absolute top-[-10%] left-1/4 w-[700px] h-[700px] bg-green-500/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-0 w-[400px] h-[400px] bg-green-500/4 rounded-full blur-[80px] pointer-events-none" />

      {/* Large faint background zero */}
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 text-[32rem] font-black text-white/[0.02] leading-none select-none pointer-events-none hidden lg:block">
        0
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="max-w-4xl">

          {/* Status badge */}
          <div className="inline-flex items-center gap-2.5 mb-10 px-4 py-1.5 rounded-full border border-zinc-700/60 bg-zinc-900/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400">
              Non-profit membership association
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.95] tracking-tight text-white mb-8">
            Net Zero
            <br />
            <span className="text-green-400">for Pharma.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg lg:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-12">
            Alliance to Zero is accelerating the pharmaceutical supply
            chain&apos;s transition to net zero emissions — collaborating across
            suppliers, manufacturers, and service providers in alignment with
            the Paris Climate Agreement.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/our-ambition"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-colors duration-150 text-sm"
            >
              Our Mission
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/about-us"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold rounded-xl transition-colors duration-150 text-sm"
            >
              Meet the Members
            </Link>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-zinc-400" />
      </div>
    </section>
  )
}
