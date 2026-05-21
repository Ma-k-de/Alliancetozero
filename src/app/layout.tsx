import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Alliance to Zero — Net Zero for Pharma',
  description:
    'A non-profit membership association accelerating the pharmaceutical supply chain\'s transition to net zero emissions by 2030, in alignment with the Paris Climate Agreement.',
  keywords: ['net zero', 'pharmaceutical', 'supply chain', 'sustainability', 'decarbonization', 'Paris Agreement'],
  openGraph: {
    title: 'Alliance to Zero — Net Zero for Pharma',
    description: 'Decarbonizing the pharmaceutical supply chain. Together. By 2030.',
    type: 'website',
    url: 'https://www.alliancetozero.com',
    siteName: 'Alliance to Zero',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alliance to Zero — Net Zero for Pharma',
    description: 'Decarbonizing the pharmaceutical supply chain. Together. By 2030.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
