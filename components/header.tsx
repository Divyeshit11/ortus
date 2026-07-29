'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 py-5">
        <Link
          href="/"
          className="font-serif text-2xl md:text-3xl tracking-tight text-brand-text hover:opacity-80 transition-opacity"
        >
          ORTUS
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm tracking-wide">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors hover:text-brand-text ${
                pathname === href ? 'text-brand-text font-medium' : 'text-brand-muted'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/catalog"
            className="hidden md:block bg-brand-accent text-brand-bg px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-brand-text transition-colors"
          >
            SHOP NOW
          </Link>
          
          <Link
            href="/cart"
            aria-label="Cart"
            className="p-2 text-brand-text hover:text-brand-accent transition-colors relative"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            className="md:hidden p-2 text-brand-text"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-brand-border bg-white px-5 py-6 flex flex-col gap-4 text-sm">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`py-2 text-lg ${pathname === href ? 'text-brand-text font-medium' : 'text-brand-muted'}`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/catalog"
            onClick={() => setOpen(false)}
            className="bg-brand-accent text-brand-bg px-6 py-3 text-sm font-medium tracking-wide text-center"
          >
            SHOP NOW
          </Link>
        </nav>
      )}
    </header>
  );
}
