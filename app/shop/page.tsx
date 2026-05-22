import Link from 'next/link';

const products = [
  { name: 'Custom Monogrammed Handkerchief', price: '$24' },
  { name: 'Embroidered Throw Pillow', price: '$48' },
  { name: 'Personalized Apron', price: '$38' },
  { name: 'Custom Tote Bag', price: '$32' },
  { name: 'Embroidered Baby Blanket', price: '$58' },
  { name: 'Monogrammed Linen Napkin Set', price: '$42' },
];

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[var(--stitch-navy)] px-5 py-8 text-[var(--stitch-cream)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link className="text-sm uppercase tracking-[0.22em] text-[var(--stitch-gold)] transition hover:text-[var(--stitch-gold-soft)]" href="/">
          &larr; Back to home
        </Link>

        <div className="mt-10 border border-[rgba(215,166,32,0.42)] bg-[rgba(3,8,23,0.42)] px-5 py-4 text-sm text-[var(--stitch-gold-soft)]">
          Demo preview — full shop coming at launch
        </div>

        <section className="py-12 sm:py-16">
          <p className="brand-kicker text-[var(--stitch-gold)]">Tuxedo Shop</p>
          <h1 className="brand-heading mt-4 text-4xl leading-none sm:text-6xl lg:text-7xl">Shop</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Handcrafted goods and custom embroidery, available soon
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <article className="border border-white/12 bg-white/[0.04] p-5" key={product.name}>
                <div className="grid aspect-square place-items-center border border-[rgba(215,166,32,0.5)] bg-[linear-gradient(135deg,var(--stitch-ink),var(--stitch-blue))]">
                  <span className="brand-heading text-5xl text-[var(--stitch-gold)]">{index + 1}</span>
                </div>
                <h2 className="brand-heading mt-5 text-2xl leading-tight text-white">{product.name}</h2>
                <p className="mt-3 text-xl font-semibold text-[var(--stitch-gold)]">{product.price}</p>
                <button
                  className="brand-button mt-5 w-full cursor-not-allowed border-white/12 bg-white/[0.04] text-white/35"
                  disabled
                  type="button"
                >
                  Notify Me
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
