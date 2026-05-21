import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Mission() {
  return (
    <section className="py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Text side */}
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-green-500 mb-5">
              Why the Alliance
            </p>
            <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-8">
              No single
              <br />
              company can
              <br />
              do this alone.
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed mb-5">
              The pharmaceutical supply chain generates significant greenhouse
              gas emissions — from raw material sourcing to device assembly,
              packaging, and end-of-life disposal.
            </p>
            <p className="text-lg text-zinc-400 leading-relaxed mb-10">
              Alliance to Zero brings together suppliers, manufacturers, and
              service providers to build a shared roadmap, harmonize emissions
              accounting, and accelerate decarbonization faster than any single
              actor could alone.
            </p>
            <Link
              href="/our-ambition"
              className="inline-flex items-center gap-2 text-green-400 font-semibold hover:text-green-300 transition-colors text-sm"
            >
              Read our full ambition
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Visual side: concentric target rings */}
          <div className="flex items-center justify-center">
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">
              {/* Rings */}
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-zinc-800"
                  style={{
                    inset: `${i * 14}%`,
                    borderColor: i === 3 ? 'rgba(34,197,94,0.25)' : undefined,
                    backgroundColor: i === 3 ? 'rgba(34,197,94,0.04)' : undefined,
                  }}
                />
              ))}

              {/* Center: zero */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[5.5rem] lg:text-[7rem] font-black text-white leading-none">
                  0
                </span>
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-green-500 mt-1">
                  emissions
                </span>
              </div>

              {/* Orbiting dot */}
              <div
                className="absolute w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50"
                style={{ top: '6%', left: '50%', transform: 'translateX(-50%)' }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
