'use client';

import { useState, useEffect } from 'react';

const TESTIMONIALS = [
  {
    quote: "I was quoted $3,200 by a mover I called directly. Posted my move here and got 4 quotes — ended up paying $2,450. Same move!",
    name: 'Amanda K.',
    location: 'Chicago to Nashville',
    highlight: 'Saved $750',
    avatar: 'AK',
    colorClass: 'bg-primary/10 text-primary',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
  },
  {
    quote: "The move plan alone was worth it. I used the box estimates and packing timeline even though I ended up using a friend's truck.",
    name: 'Marcus T.',
    location: 'Austin, TX',
    highlight: 'Free move plan',
    avatar: 'MT',
    colorClass: 'bg-secondary/10 text-secondary',
    badgeClass: 'bg-secondary/10 text-secondary border-secondary/20',
  },
  {
    quote: "Calling movers individually was a nightmare. Here, I filled out my inventory once and had 4 companies competing. So much easier.",
    name: 'Jennifer L.',
    location: 'Denver to Seattle',
    highlight: 'Saved 6+ hours',
    avatar: 'JL',
    colorClass: 'bg-accent/10 text-accent',
    badgeClass: 'bg-accent/10 text-[#92740a] border-accent/20',
  },
];

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-16 lg:py-24 bg-white">
      <div className="relative max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className={`text-center mb-12 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-sm font-medium text-secondary mb-4">
            Success Stories
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-foreground">
            Real results from real movers
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className={`relative min-h-[320px] lg:min-h-[340px] ${mounted ? 'fade-in-up stagger-2' : 'opacity-0'}`}>
          {TESTIMONIALS.map((testimonial, index) => {
            return (
              <div
                key={index}
                className={`max-w-3xl mx-auto transition-all duration-500 ${
                  index === activeIndex
                    ? 'opacity-100 translate-y-0 relative'
                    : 'opacity-0 absolute inset-0 translate-y-4 pointer-events-none'
                }`}
              >
                <div className="relative p-8 lg:p-10 rounded-2xl bg-muted/30 border border-border">
                  {/* Quote icon */}
                  <div className="absolute -top-5 left-8">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-5 pt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl lg:text-2xl text-foreground mb-6 leading-relaxed font-serif">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-full ${testimonial.colorClass} flex items-center justify-center`}>
                        <span className="text-sm font-bold">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>

                    {/* Highlight badge */}
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${testimonial.badgeClass}`}>
                      {testimonial.highlight}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation dots */}
        <div className={`flex justify-center gap-2 mt-8 ${mounted ? 'fade-in-up stagger-3' : 'opacity-0'}`}>
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-primary w-6'
                  : 'bg-border hover:bg-muted-foreground w-2'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
