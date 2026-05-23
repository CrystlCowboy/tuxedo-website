import Image from 'next/image';

const posts = [
  { src: '/instagram/post1.png', alt: 'Recent tuxedo project 1' },
  { src: '/instagram/post2.png', alt: 'Recent tuxedo project 2' },
  { src: '/instagram/post3.png', alt: 'Recent tuxedo project 3' },
  { src: '/instagram/post4.png', alt: 'Recent tuxedo project 4' },
  { src: '/instagram/post5.png', alt: 'Recent tuxedo project 5' },
  { src: '/instagram/post6.png', alt: 'Recent tuxedo project 6' },
];

const instagramUrl = 'https://www.instagram.com/justintechsolutionsindiana/';

export default function InstagramGrid() {
  return (
    <section className="brand-section bg-[var(--stitch-cream)] px-5 py-16 text-[var(--stitch-navy)] sm:px-8 sm:py-20 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="brand-kicker text-[var(--stitch-blue)]">Follow @justintechsolutionsindiana</p>
            <h2 className="brand-heading mt-4 text-3xl leading-[1.05] sm:text-5xl sm:leading-none lg:text-6xl">
              Recent Work
            </h2>
          </div>
          <a
            className="brand-button brand-button-secondary w-full border-[rgba(0,61,112,0.28)] text-[var(--stitch-navy)] hover:text-[var(--stitch-blue)] sm:w-auto"
            href={instagramUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Follow on Instagram
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <a
              className={`group relative aspect-square overflow-hidden bg-[var(--stitch-navy)] ${
                index > 3 ? 'hidden md:block' : ''
              }`}
              href={instagramUrl}
              key={post.src}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                className="h-full w-full object-cover"
                src={post.src}
                alt={post.alt}
                width={900}
                height={900}
                sizes="(min-width: 1024px) 33vw, 50vw"
              />
              <span className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-[rgba(6,17,38,0.4)] opacity-0 transition duration-200 group-hover:opacity-100 md:flex">
                <span className="flex flex-col items-center gap-3 text-white">
                  <svg aria-hidden="true" className="h-9 w-9" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.2 10.6 20C5.6 15.5 2.3 12.6 2.3 8.9 2.3 5.9 4.6 3.6 7.6 3.6c1.7 0 3.3.8 4.4 2 1-1.2 2.7-2 4.4-2 3 0 5.3 2.3 5.3 5.3 0 3.7-3.3 6.6-8.3 11.1L12 21.2Z" />
                  </svg>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em]">Post {index + 1}</span>
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
