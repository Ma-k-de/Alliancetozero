import { TrendingDown, RefreshCw, Network, Users } from 'lucide-react'

const pillars = [
  {
    icon: TrendingDown,
    title: 'GHG Emissions Reduction',
    description:
      'Reducing direct and indirect greenhouse gas emissions across manufacturing, logistics, and the full product life cycle — with clear, measurable targets.',
  },
  {
    icon: RefreshCw,
    title: 'Circular Economy',
    description:
      'Building business models grounded in reuse, reduction, and recycling principles — designing out waste from the very beginning of product development.',
  },
  {
    icon: Network,
    title: 'Supply Chain Solutions',
    description:
      'Developing scalable, shareable decarbonization solutions for injection devices that can be deployed across a wide range of existing and future products.',
  },
  {
    icon: Users,
    title: 'Working Groups',
    description:
      'Collaborative industry groups developing shared guidelines on machinery, processes, and sustainability standards applicable across all member companies.',
  },
]

export function Pillars() {
  return (
    <section className="py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-green-500 mb-5">
            How We Work
          </p>
          <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Four pillars
            <br />
            of action.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-green-500/25 hover:bg-zinc-900 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-zinc-800 group-hover:bg-green-500/10 flex items-center justify-center text-zinc-500 group-hover:text-green-400 transition-all duration-200 mb-6">
                <Icon size={20} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
