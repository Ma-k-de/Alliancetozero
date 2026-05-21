export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`} aria-label="Alliance to Zero">
      {/* Symbol: arc toward zero — a near-complete circle with a center target dot */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer arc ~300° */}
        <circle
          cx="18"
          cy="18"
          r="14"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="73 14"
          strokeDashoffset="6"
          fill="none"
        />
        {/* Inner ring */}
        <circle
          cx="18"
          cy="18"
          r="7"
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="32 12"
          strokeDashoffset="4"
          fill="none"
          opacity="0.4"
        />
        {/* Center dot */}
        <circle cx="18" cy="18" r="2.5" fill="#22c55e" />
      </svg>

      {/* Wordmark */}
      <div className="leading-none select-none">
        <div className="text-[8px] font-semibold tracking-[0.32em] uppercase text-zinc-400">
          Alliance to
        </div>
        <div className="text-[15px] font-black tracking-[0.1em] uppercase text-white">
          Zero
        </div>
      </div>
    </div>
  )
}
