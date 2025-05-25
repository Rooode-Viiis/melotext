import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Melo2Text',
  description: 'Transcription.Translate.Instantly.',
  generator: 'Kirenath & Elias',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
