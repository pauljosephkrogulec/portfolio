import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  title: 'Paul-Joseph Krogulec - Développeur Back-End',
  description: 'Portfolio de Paul-Joseph Krogulec, développeur back-end spécialisé en Symfony, API Platform et les bonnes pratiques de développement',
  metadataBase: new URL('https://localhost:3000'),
  openGraph: {
    title: 'Paul-Joseph Krogulec - Développeur Back-End',
    description: 'Portfolio de Paul-Joseph Krogulec, développeur back-end spécialisé en Symfony, API Platform et les bonnes pratiques de développement',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paul-Joseph Krogulec - Développeur Back-End',
    description: 'Portfolio de Paul-Joseph Krogulec, développeur back-end spécialisé en Symfony, API Platform et les bonnes pratiques de développement',
    creator: '@Paul_josephK',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
