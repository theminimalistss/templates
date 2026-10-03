import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Maison Vielle — A Timeless Setting for Beautiful Beginnings',
  description: 'A private estate in Provence. Discover Maison Vielle, an intimate setting for weddings, weekend celebrations and the moments that matter.',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  openGraph: { title: 'Maison Vielle', description: 'A timeless setting for beautiful beginnings. A private wedding estate in Provence.', type: 'website' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preload" href="/fonts/cormorant-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head><body>{children}</body></html>;
}
