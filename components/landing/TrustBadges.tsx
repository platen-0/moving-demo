'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  {
    step: '1',
    title: 'Build your inventory',
    description: 'Add rooms and items room-by-room. Takes about 4 minutes.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    color: 'primary',
  },
  {
    step: '2',
    title: 'Get your move plan',
    description: 'Box estimates, costs, timeline — yours to keep forever.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'secondary',
  },
  {
    step: '3',
    title: 'Movers compete for you',
    description: 'Top-rated movers bid on YOUR move with accurate quotes.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    color: 'accent',
  },
];

const COLOR_CLASSES = {
  primary: {
    iconBg: 'bg-primary/10',
    iconText: 'text-primary',
    stepBg: 'bg-primary',
    stepText: 'text-white',
  },
  secondary: {
    iconBg: 'bg-secondary/10',
    iconText: 'text-secondary',
    stepBg: 'bg-secondary',
    stepText: 'text-white',
  },
  accent: {
    iconBg: 'bg-accent/10',
    iconText: 'text-accent',
    stepBg: 'bg-accent',
    stepText: 'text-white',
  },
};

export function TrustBadges() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative py-16 lg:py-24 bg-muted/30">
      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className={`text-center mb-14 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary mb-4">
            Simple Process
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-foreground mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Plan your move and get competing quotes in 3 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((item, index) => {
            const colors = COLOR_CLASSES[item.color as keyof typeof COLOR_CLASSES];

            return (
              <div
                key={item.step}
                className={`group relative ${mounted ? `fade-in-up stagger-${index + 1}` : 'opacity-0'}`}
              >
                {/* Card */}
                <div className="relative h-full p-6 lg:p-8 rounded-xl bg-white border border-border shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Step number */}
                  <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full ${colors.stepBg} flex items-center justify-center shadow-md`}>
                    <span className={`text-sm font-bold ${colors.stepText}`}>{item.step}</span>
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center mb-5`}>
                    {item.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Connector line (hidden on last item and mobile) */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-5 w-6 lg:w-8">
                    <div className="w-full h-px bg-border" />
                    <svg className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 text-border" fill="currentColor" viewBox="0 0 8 8">
                      <path d="M0 4l4-4v8L0 4z" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
