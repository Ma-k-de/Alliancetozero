const stats = [
  {
    value: '2030',
    label: 'Net zero target year',
    sub: 'Paris Agreement aligned',
  },
  {
    value: '8',
    label: 'Founding members',
    sub: 'Across the pharma supply chain',
  },
  {
    value: '2026',
    label: 'Joint offering milestone',
    sub: 'Net zero solutions available',
  },
  {
    value: '<1.5°C',
    label: 'Climate commitment',
    sub: 'Paris Agreement pathway',
  },
]

export function Stats() {
  return (
    <section className="border-y border-zinc-800/60">
      {/* Gap-trick: bg-zinc-800 parent + bg-filled children = clean 1px grid dividers */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800/40">
          {stats.map(({ value, label, sub }) => (
            <div
              key={label}
              className="bg-zinc-950 px-6 py-12 lg:py-14 text-center"
            >
              <div className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-1.5">
                {value}
              </div>
              <div className="text-sm font-semibold text-zinc-300 mb-0.5">{label}</div>
              <div className="text-xs text-zinc-500">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
