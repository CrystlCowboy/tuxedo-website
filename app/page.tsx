import InstagramGrid from './InstagramGrid';
import MobileNav from './MobileNav';
import ReviewsMarquee from './ReviewsMarquee';
import ScrollVideoPlayer from './ScrollVideoPlayer';

const services = [
  {
    title: 'Alterations & Tailoring',
    description: 'Hems, repairs, reshaping, bridal adjustments, and everyday garment fixes with precise finishing.',
  },
  {
    title: 'Embroidery',
    description: 'Commercial embroidery for teams, businesses, gifts, and custom keepsakes that need a polished touch.',
  },
  {
    title: 'Custom Sewing',
    description: 'Thoughtful sewing projects, special requests, keepsake work, and made-for-you fabric solutions.',
  },
  {
    title: 'Formalwear Fittings',
    description: 'Wedding, prom, and event fittings with Timeline Tux rental support by appointment.',
  },
];

const locations = [
  {
    city: 'Batesville',
    address: '117 South Main St. Suite A',
    phone: '812 363 6878',
    mapTitle: 'Map to The Stitchery Batesville',
    mapSrc: 'https://www.google.com/maps?q=117%20South%20Main%20St%20Suite%20A%2C%20Batesville%2C%20IN%2047006&output=embed',
  },
  {
    city: 'Brookville',
    address: '700 Main Street Unit A',
    phone: '812 312 0334',
    mapTitle: 'Map to The Stitchery Brookville',
    mapSrc: 'https://www.google.com/maps?q=700%20Main%20Street%20Unit%20A%2C%20Brookville%2C%20IN%2047012&output=embed',
  },
];

export default function Home() {
  return (
    <main>
      <header
        className="site-header fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[rgba(3,8,23,0.78)] backdrop-blur-md"
        style={{ height: 'var(--site-nav-height)' }}
      >
        <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 text-white sm:px-8">
          <a className="flex items-center gap-3" href="#top" aria-label="The Stitchery home">
            <span className="grid h-9 w-9 place-items-center border border-[var(--stitch-gold)] text-sm font-semibold text-[var(--stitch-gold)]">
              TS
            </span>
            <span className="brand-heading text-2xl text-white">The Stitchery</span>
          </a>
          <div className="hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/66 md:flex">
            <a className="transition hover:text-[var(--stitch-gold)]" href="#services">Services</a>
            <a className="transition hover:text-[var(--stitch-gold)]" href="#appointments">Appointments</a>
            <a className="transition hover:text-[var(--stitch-gold)]" href="#locations">Locations</a>
            <a className="transition hover:text-[var(--stitch-gold)]" href="#classes">Classes</a>
          </div>
          <MobileNav />
        </nav>
      </header>

      <div id="top" />
      <ScrollVideoPlayer />

      <section id="services" className="brand-section stitch-pattern bg-[var(--stitch-cream)] px-5 py-16 text-[var(--stitch-navy)] sm:px-8 sm:py-20 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1fr] lg:items-end">
            <div>
              <p className="brand-kicker text-[var(--stitch-blue)]">Services</p>
              <h2 className="brand-heading mt-4 max-w-xl text-3xl leading-[1.05] sm:text-5xl sm:leading-none lg:text-6xl">
                Sewn for real life and the moments that matter.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[var(--stitch-muted)] sm:text-lg">
              From bridal hems to business embroidery, the studio keeps every project personal, practical, and finished with care.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-[rgba(0,61,112,0.16)] bg-[rgba(0,61,112,0.16)] sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {services.map((service) => (
              <article className="bg-[rgba(255,251,241,0.92)] p-6 sm:p-8" key={service.title}>
                <div className="mb-6 h-px w-14 bg-[var(--stitch-gold)] sm:mb-8" />
                <h3 className="text-xl font-semibold text-[var(--stitch-navy)]">{service.title}</h3>
                <p className="mt-4 text-base leading-7 text-[var(--stitch-muted)]">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="brand-section bg-[var(--stitch-cream)] px-5 py-16 text-[var(--stitch-navy)] sm:px-8 sm:py-20 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="brand-kicker text-[var(--stitch-blue)]">Reviews</p>
          <h2 className="brand-heading mt-4 text-3xl leading-[1.05] sm:text-5xl sm:leading-none lg:text-6xl">
            What Our Customers Say
          </h2>
        </div>
        <ReviewsMarquee />
      </section>

      <section id="appointments" className="brand-section bg-[var(--stitch-navy)] px-5 py-16 text-white sm:px-8 sm:py-20 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.82fr] lg:items-center">
          <div>
            <p className="brand-kicker text-[var(--stitch-gold)]">Appointments</p>
            <h2 className="brand-heading mt-4 max-w-3xl text-3xl leading-[1.05] sm:text-5xl sm:leading-none lg:text-6xl">
              Bridal, formalwear, and custom fittings by appointment.
            </h2>
            <p className="mt-6 max-w-2xl text-base font-light leading-8 text-white/66 sm:mt-8 sm:text-lg">
              Choose the fitting or consultation that fits your project, then connect with the studio that is closest to you.
            </p>
          </div>
          <div className="border border-white/12 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {['Bridal fitting', 'Formalwear fitting', 'Embroidery consult', 'Custom sewing request'].map((item) => (
                <a
                  className="group flex min-h-11 items-center justify-between border border-white/10 bg-white/[0.04] px-4 py-4 text-sm uppercase tracking-[0.14em] text-white/75 transition hover:border-[var(--stitch-gold)] hover:text-white sm:px-5 sm:tracking-[0.18em]"
                  href="/book"
                  key={item}
                >
                  {item}
                  <span className="text-[var(--stitch-gold)] transition group-hover:translate-x-1">-&gt;</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="locations" className="brand-section bg-white px-5 py-16 text-[var(--stitch-navy)] sm:px-8 sm:py-20 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1fr]">
          <div>
            <p className="brand-kicker text-[var(--stitch-blue)]">Locations</p>
            <h2 className="brand-heading mt-4 text-3xl leading-[1.05] sm:text-5xl sm:leading-none lg:text-6xl">Two local studios. One careful standard.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {locations.map((location, index) => (
              <article className="border border-[rgba(0,61,112,0.16)] p-6 sm:p-8" key={location.city}>
                {index > 0 && <div className="mb-6 h-px bg-[var(--stitch-gold)] opacity-30 md:hidden" />}
                <h3 className="brand-heading text-4xl text-[var(--stitch-blue)]">{location.city}</h3>
                <p className="mt-5 leading-7 text-[var(--stitch-muted)]">{location.address}</p>
                <a
                  className="mt-4 inline-flex min-h-11 items-center font-semibold text-[var(--stitch-navy)] transition hover:text-[var(--stitch-blue)]"
                  href={`tel:+1${location.phone.replace(/\D/g, '')}`}
                >
                  {location.phone}
                </a>
                <div className="mt-6 h-[250px] overflow-hidden rounded-xl border border-[rgba(215,166,32,0.4)] md:h-[300px]">
                  <iframe
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={location.mapSrc}
                    title={location.mapTitle}
                  />
                </div>
              </article>
            ))}
            <article className="border border-[rgba(0,61,112,0.16)] bg-[var(--stitch-cream)] p-6 sm:p-8 md:col-span-2">
              <h3 className="text-xl font-semibold">Hours</h3>
              <p className="mt-4 leading-7 text-[var(--stitch-muted)]">
                Tuesday-Friday, 10:30am-5pm. Saturday, 10:30am-1pm. Closed Sunday and Monday.
              </p>
            </article>
          </div>
        </div>
      </section>

      <InstagramGrid />

      <section id="classes" className="brand-section bg-[var(--stitch-blue)] px-5 py-16 text-white sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="brand-kicker text-[var(--stitch-gold)]">Events & Classes</p>
            <h2 className="brand-heading mt-4 max-w-3xl text-3xl leading-[1.05] sm:text-5xl sm:leading-none lg:text-6xl">
              Learn a skill, repair a favorite, or plan the next fitting.
            </h2>
          </div>
          <a className="brand-button brand-button-light min-h-11 w-full self-stretch sm:w-auto sm:self-start lg:self-auto" href="#locations">
            Contact the studio
          </a>
        </div>
      </section>

      <footer id="contact" className="bg-[var(--stitch-ink)] px-5 py-10 text-white/58 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-base sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p className="brand-heading text-2xl text-white">The Stitchery</p>
          <p>Alterations, embroidery, custom sewing, and formalwear fittings.</p>
        </div>
      </footer>
    </main>
  );
}
