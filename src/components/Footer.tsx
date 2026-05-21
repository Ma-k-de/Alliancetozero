import Link from 'next/link'
import { Logo } from './Logo'

const footerLinks = [
  { href: '/about-us', label: 'About Us' },
  { href: '/our-ambition', label: 'Our Ambition' },
  { href: '/resources', label: 'Resources' },
  { href: '/news', label: 'News' },
  { href: '/about-us#join', label: 'Join' },
]

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main footer row */}
        <div className="py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <Link href="/">
            <Logo />
          </Link>

          <nav className="flex flex-wrap items-center gap-6">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800/40 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} Alliance to Zero. All rights reserved.</p>
          <p>Non-profit membership association · Paris Agreement aligned</p>
        </div>
      </div>
    </footer>
  )
}
