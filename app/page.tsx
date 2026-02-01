'use client';

import { useRouter } from 'next/navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { SocialProofBar } from '@/components/landing/SocialProofBar';
import { TestimonialCarousel } from '@/components/landing/TestimonialCarousel';
import { TrustBadges } from '@/components/landing/TrustBadges';
import { getSeasonalBanner } from '@/lib/constants';

export default function LandingPage() {
  const router = useRouter();
  const seasonalBanner = getSeasonalBanner();

  const handleCtaClick = () => {
    router.push('/funnel/basics');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Seasonal Banner */}
      {seasonalBanner && (
        <div className="bg-primary text-white text-center py-2 px-4 text-sm font-medium">
          <span className="mr-2">{seasonalBanner.icon}</span>
          {seasonalBanner.message}
        </div>
      )}

      {/* Header - not fixed, scrolls with page */}
      <header className="bg-white border-b border-border overflow-visible relative z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/MovIQ Logo.png"
              alt="MovIQ"
              className="h-28 sm:h-36 w-auto object-contain -my-6"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium">4.8 Rating</span>
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <span className="text-xs text-muted-foreground hidden md:inline">
              500,000+ moves planned
            </span>
          </div>
        </div>
      </header>

      <HeroSection onCtaClick={handleCtaClick} />
      <SocialProofBar />
      <TrustBadges />
      <TestimonialCarousel />

      {/* Final CTA Section */}
      <section className="relative py-20 lg:py-28 bg-navy overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(22, 101, 52, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, rgba(180, 148, 62, 0.2) 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-5 leading-tight">
            Ready to plan your move{' '}
            <span className="text-[#22c55e]">the smart way?</span>
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            Join over 500,000 people who&apos;ve saved time and money with our move planner
          </p>

          <button
            onClick={handleCtaClick}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-secondary font-semibold text-lg rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start My Move Plan
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free move plan you keep forever
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Top movers compete for you
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No obligation
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f8f6f3] border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/MovIQ Logo.png"
                alt="MovIQ"
                className="h-7 w-auto object-contain opacity-70"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-right max-w-md">
              This is a demo lead generation funnel. No actual moving services are provided.
            </p>
          </div>
          <div className="divider my-6" />
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} MovIQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
