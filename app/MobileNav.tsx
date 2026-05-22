'use client';

import { useEffect, useState } from 'react';

const mobileLinks = [
  { label: 'Book appointment', href: '/book', featured: true },
  { label: 'Home', href: '#top' },
  { label: 'Appointments', href: '#appointments' },
  { label: 'Services', href: '#services' },
  { label: 'Locations', href: '#locations' },
  { label: 'Events', href: '#classes' },
  { label: 'Contact', href: '#contact' },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        className="relative z-[70] inline-flex h-11 w-11 items-center justify-center border border-[var(--stitch-gold)] text-[var(--stitch-gold)] transition hover:bg-[rgba(215,166,32,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--stitch-gold)]"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
        <span className="relative h-5 w-5" aria-hidden="true">
          <span
            className={`absolute left-0 top-1/2 h-0.5 w-5 bg-current transition duration-200 ${
              isOpen ? 'translate-y-0 rotate-45' : '-translate-y-2 rotate-0'
            }`}
          />
          <span
            className={`absolute left-0 top-1/2 h-0.5 w-5 bg-current transition duration-200 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 top-1/2 h-0.5 w-5 bg-current transition duration-200 ${
              isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-2 rotate-0'
            }`}
          />
        </span>
      </button>

      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-[60] flex min-h-dvh flex-col justify-center bg-[rgba(6,17,38,0.95)] px-8 transition duration-200 ${
          isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col gap-6">
          {mobileLinks.map((link) => (
            <a
              className={
                link.featured
                  ? 'brand-heading flex min-h-14 items-center justify-between border border-[var(--stitch-gold)] bg-[var(--stitch-gold)] px-4 py-3 text-xl text-[var(--stitch-ink)] shadow-2xl shadow-black/25 transition hover:bg-[var(--stitch-gold-soft)] active:bg-[var(--stitch-gold-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--stitch-gold)]'
                  : 'brand-heading text-2xl text-white transition hover:text-[var(--stitch-gold)] active:text-[var(--stitch-gold)] focus-visible:text-[var(--stitch-gold)] focus-visible:outline-none'
              }
              href={link.href}
              key={link.href}
              onClick={() => setIsOpen(false)}
              tabIndex={isOpen ? 0 : -1}
            >
              {link.label}
              {link.featured && <span className="text-sm" aria-hidden="true">-&gt;</span>}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
