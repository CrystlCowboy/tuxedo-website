'use client';

import { useState } from 'react';
import Link from 'next/link';

const services = [
  { name: 'Bridal Fitting', duration: '60 min', location: 'Batesville' },
  { name: 'Formalwear Fitting', duration: '45 min', location: 'Batesville or Versailles' },
  { name: 'Embroidery Consultation', duration: '30 min', location: 'Batesville or Versailles' },
  { name: 'Custom Sewing Request', duration: '45 min', location: 'Batesville or Versailles' },
];

const calendarCells = [
  '', '', '', '1', '2', '3', '4',
  '5', '6', '7', '8', '9', '10', '11',
  '12', '13', '14', '15', '16', '17', '18',
  '19', '20', '21', '22', '23', '24', '25',
  '26', '27', '28', '29', '30', '', '',
];

const unavailableDates = new Set(['1', '2', '7', '14', '21', '28']);
const featuredDates = new Set(['6', '10', '16', '23', '27']);
const timeSlots = ['9:30 AM', '10:15 AM', '11:00 AM', '1:00 PM', '2:30 PM'];

export default function BookPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[var(--stitch-navy)] px-5 py-8 text-[var(--stitch-cream)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link className="text-sm uppercase tracking-[0.22em] text-[var(--stitch-gold)] transition hover:text-[var(--stitch-gold-soft)]" href="/">
          &larr; Back to home
        </Link>

        <section className="py-14 sm:py-20">
          <p className="brand-kicker text-[var(--stitch-gold)]">Appointments</p>
          <h1 className="brand-heading mt-4 text-4xl leading-none sm:text-6xl lg:text-7xl">Book an Appointment</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Select a service to schedule your fitting or consultation
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => {
              const isSelected = selectedService === service.name;

              return (
                <button
                  className={`border p-6 text-left transition duration-200 ${
                    isSelected
                      ? 'scale-[1.02] border-[var(--stitch-gold)] bg-white/[0.08]'
                      : 'border-white/12 bg-white/[0.04] hover:border-[rgba(215,166,32,0.55)]'
                  }`}
                  key={service.name}
                  type="button"
                  onClick={() => setSelectedService(service.name)}
                >
                  <span className="brand-heading text-2xl text-white">{service.name}</span>
                  <span className="mt-5 block text-sm uppercase tracking-[0.2em] text-[var(--stitch-gold)]">{service.duration}</span>
                  <span className="mt-3 block text-base text-white/62">{service.location}</span>
                </button>
              );
            })}
          </div>

          {selectedService && (
            <section className="mt-10 border border-white/12 bg-white/[0.04] p-5 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="brand-kicker text-[var(--stitch-gold)]">Demo Calendar</p>
                  <h2 className="brand-heading mt-2 text-3xl text-white">May Availability</h2>
                </div>
                <p className="text-sm text-white/58">{selectedService}</p>
              </div>

              <div className="mt-8 grid grid-cols-7 gap-2 text-center text-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div className="pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42" key={day}>
                    {day}
                  </div>
                ))}
                {calendarCells.map((date, index) => {
                  const isUnavailable = unavailableDates.has(date);
                  const isFeatured = featuredDates.has(date);

                  return (
                    <button
                      className={`min-h-11 border text-sm transition ${
                        !date
                          ? 'border-transparent'
                          : isUnavailable
                            ? 'border-white/8 bg-white/[0.02] text-white/26'
                            : isFeatured
                              ? 'border-[var(--stitch-gold)] bg-[rgba(215,166,32,0.18)] text-[var(--stitch-gold-soft)]'
                              : 'border-white/10 bg-white/[0.04] text-white/70'
                      }`}
                      disabled={!date || isUnavailable}
                      key={`${date || 'blank'}-${index}`}
                      type="button"
                    >
                      {date}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {timeSlots.map((slot) => (
                  <button
                    className="min-h-11 border border-[rgba(215,166,32,0.55)] px-5 text-sm font-semibold text-[var(--stitch-gold-soft)] transition hover:border-[var(--stitch-gold)] hover:bg-[rgba(215,166,32,0.12)]"
                    key={slot}
                    type="button"
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <button
                className="brand-button mt-8 w-full cursor-not-allowed border-white/12 bg-white/[0.04] text-white/32 sm:w-auto"
                disabled
                type="button"
              >
                Continue to Confirmation
              </button>
              <p className="mt-3 text-sm text-white/50">Demo preview — booking will be live at launch</p>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
