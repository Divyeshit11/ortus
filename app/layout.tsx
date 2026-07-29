import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import AnnouncementBar from '@/components/announcement-bar';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { Providers } from '@/components/providers';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ORTUS — Premium Children\'s Fashion',
  description:
    'Timeless style for little ones. Premium children\'s fashion designed for the modern family. Shop our curated collection of essentials.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <Providers>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
