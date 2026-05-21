const members = [
  { name: 'SCHOTT', type: 'Glass & packaging' },
  { name: 'Datwyler', type: 'Primary packaging' },
  { name: 'Ypsomed', type: 'Drug delivery' },
  { name: 'Harro Höfliger', type: 'Filling & assembly' },
  { name: 'Schreiner MediPharm', type: 'Functional labeling' },
  { name: 'Körber Pharma', type: 'Process & packaging' },
  { name: 'Sharp Services', type: 'Contract packaging' },
  { name: 'Health Beacon', type: 'Device management' },
]

export function Members() {
  return (
    <section className="py-32 bg-zinc-900/20 border-y border-zinc-800/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-green-500 mb-5">
              Founding Members
            </p>
            <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Eight industry
              <br />
              leaders.
            </h2>
          </div>
          <p className="text-zinc-400 max-w-sm lg:text-right leading-relaxed text-sm">
            Companies representing the full length of the pharmaceutical supply
            chain — committed to net zero from day one.
          </p>
        </div>

        {/* Member grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {members.map(({ name, type }) => (
            <div
              key={name}
              className="group p-6 rounded-xl border border-zinc-800/60 bg-zinc-900/40 hover:border-green-500/20 hover:bg-zinc-900/70 transition-all duration-200 flex flex-col gap-2"
            >
              <span className="text-white font-bold text-sm leading-tight">{name}</span>
              <span className="text-zinc-500 text-xs">{type}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
