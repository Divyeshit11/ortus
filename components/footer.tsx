import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-text text-brand-bg mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <p className="font-serif text-2xl mb-4 tracking-tight">ORTUS</p>
            <p className="text-brand-bg/70 text-sm leading-relaxed max-w-xs">
              Premium fashion designed for the modern family. Timeless style meets exceptional quality.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-brand-bg/50 mb-6 font-medium">Shop</p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/catalog" className="text-brand-bg/80 hover:text-brand-bg transition-colors">
                All Products
              </Link>
              <Link href="/catalog" className="text-brand-bg/80 hover:text-brand-bg transition-colors">
                New Arrivals
              </Link>
              <Link href="/catalog" className="text-brand-bg/80 hover:text-brand-bg transition-colors">
                Best Sellers
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-brand-bg/50 mb-6 font-medium">Company</p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/about" className="text-brand-bg/80 hover:text-brand-bg transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-brand-bg/80 hover:text-brand-bg transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-bg/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-bg/50">
          <p>© {new Date().getFullYear()} Ortus. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand-bg transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-bg transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
