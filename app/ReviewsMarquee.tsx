'use client';

import reviews from './data/reviews.json';

const marqueeReviews = [...reviews, ...reviews];

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}

export default function ReviewsMarquee() {
  return (
    <div className="reviews-marquee relative mt-12 overflow-hidden sm:mt-16">
      <div className="reviews-marquee-track flex w-max gap-5 pr-5">
        {marqueeReviews.map((review, index) => (
          <article
            className="w-[280px] shrink-0 bg-[var(--stitch-cream)] p-6 text-[var(--stitch-navy)] shadow-xl shadow-[rgba(3,8,23,0.08)] sm:w-[320px]"
            key={`${review.id}-${index}`}
          >
            <div className="flex gap-1 text-sm text-[var(--stitch-gold)]" aria-label={`${review.rating} out of 5 stars`}>
              {Array.from({ length: review.rating }).map((_, starIndex) => (
                <span aria-hidden="true" key={starIndex}>
                  ★
                </span>
              ))}
            </div>
            <p className="mt-5 text-base leading-7 text-[var(--stitch-muted)]">{review.text}</p>
            <div className="brand-heading mt-6 flex items-center justify-between gap-4 text-sm text-[var(--stitch-navy)]">
              <span>{review.name}</span>
              <time className="text-[var(--stitch-blue)]" dateTime={review.date}>
                {formatDate(review.date)}
              </time>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
