import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function JoinCTA() {
  return (
    <section className="relative py-36 bg-zinc-950 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-green-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-green-500 mb-6">
            Get Involved
          </p>
          <h2 className="text-5xl lg:text-7xl font-black text-white leading-[1.0] tracking-tight mb-8">
            Ready to join
            <br />
            the Alliance?
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed mb-12 max-w-xl mx-auto">
            Whether you&apos;re a supplier, manufacturer, or service provider in
            the pharmaceutical supply chain — there&apos;s a place for you here.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/about-us#join"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors duration-150 text-base"
            >
              Get in Touch
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/about-us"
              className="inline-flex items-center gap-2.5 px-8 py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold rounded-xl transition-colors duration-150 text-base"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
