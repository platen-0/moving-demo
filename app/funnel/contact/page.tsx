'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMove } from '@/context/MoveContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ContactInfo, ContactPreferences } from '@/types';

const DEMO_DATA: ContactInfo = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com',
  phone: '(555) 123-4567',
};

export default function ContactPage() {
  const router = useRouter();
  const { state, setContactInfo, setContactPreferences, completeStep } = useMove();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState<ContactInfo>({
    firstName: state.contactInfo?.firstName || '',
    lastName: state.contactInfo?.lastName || '',
    email: state.capturedEmail || state.contactInfo?.email || '',
    phone: state.contactInfo?.phone || '',
  });

  const [preferences, setPreferences] = useState<ContactPreferences>({
    method: state.contactPreferences.method,
    bestTime: state.contactPreferences.bestTime,
    consentToContact: state.contactPreferences.consentToContact,
  });

  const [errors, setErrors] = useState<Partial<ContactInfo>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate mover count based on distance
  const moverCount = useMemo(() => {
    let count = 6;
    const distance = state.basics.routeInfo?.distance || 0;
    if (distance > 100) count -= 1;
    if (distance > 500) count -= 1;
    return Math.max(3, count);
  }, [state.basics.routeInfo]);

  const fillDemoData = () => {
    setFormData(DEMO_DATA);
    setPreferences({ ...preferences, consentToContact: true });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactInfo> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setContactInfo(formData);
    setContactPreferences(preferences);
    completeStep('contact');
    router.push('/funnel/quotes');
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-8 py-8 lg:py-12">
        {/* Header */}
        <div className={`text-center mb-10 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">
            Almost there!
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground">
            Enter your info so movers can send you their best quotes
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          {/* Left: Form */}
          <div>
            {/* Movers Ready Card - More Engaging */}
            <div className={`p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 mb-8 ${mounted ? 'fade-in-up stagger-1' : 'opacity-0'}`}>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-3xl">🚚</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center animate-pulse">
                    {moverCount}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xl text-foreground">{moverCount} top-rated movers ready to compete!</p>
                  <p className="text-base text-muted-foreground mt-1">
                    Estimated range: <span className="font-semibold text-primary">${state.estimate?.costRange.min.toLocaleString()} - ${state.estimate?.costRange.max.toLocaleString()}</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Available for your date
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-yellow-500">⭐</span>
                  4.5+ average rating
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">✓</span>
                  Licensed & insured
                </span>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`space-y-6 ${mounted ? 'fade-in-up stagger-2' : 'opacity-0'}`}>
              {/* Section Header with Demo Button */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Your Contact Info</h2>
                <button
                  onClick={fillDemoData}
                  className="px-3 py-1.5 text-sm font-medium bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors"
                >
                  🧪 Demo
                </button>
              </div>

              {/* Name Row */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-base font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`h-14 text-lg ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-base font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`h-14 text-lg ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Smith"
                  />
                  {errors.lastName && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`h-14 text-lg ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-base font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  className={`h-14 text-lg ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Contact Preferences */}
              <div className="space-y-5 pt-6 border-t border-border">
                <h2 className="text-xl font-semibold text-foreground">Contact Preferences</h2>

                <div>
                  <label className="block text-base text-muted-foreground mb-3">
                    Preferred contact method
                  </label>
                  <div className="flex gap-4">
                    {(['call', 'text', 'email'] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPreferences({ ...preferences, method })}
                        className={`flex-1 py-3 px-5 rounded-xl border-2 text-base font-medium transition-all ${
                          preferences.method === method
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {method === 'call' ? '📞 Call' : method === 'text' ? '💬 Text' : '✉️ Email'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-base text-muted-foreground mb-3">
                    Best time to contact
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {(['morning', 'afternoon', 'evening', 'anytime'] as const).map((time) => (
                      <button
                        key={time}
                        onClick={() => setPreferences({ ...preferences, bestTime: time })}
                        className={`py-3 px-5 rounded-xl border-2 text-base font-medium transition-all ${
                          preferences.bestTime === time
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {time.charAt(0).toUpperCase() + time.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explainer about moving spec */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📋</span>
                    <div>
                      <p className="font-medium text-foreground">Your complete moving spec will be sent by email</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Including your inventory list, route details, and personalized quotes from each mover.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent */}
              <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl border border-border hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.consentToContact}
                  onChange={(e) => setPreferences({ ...preferences, consentToContact: e.target.checked })}
                  className="w-6 h-6 rounded border-border text-primary focus:ring-primary mt-0.5"
                />
                <span className="text-base text-muted-foreground">
                  I agree to be contacted by up to {moverCount} moving companies about my move.
                  I understand I can opt out anytime.
                </span>
              </label>
            </div>
          </div>

          {/* Right: Trust Indicators Sidebar */}
          <div className={`space-y-6 ${mounted ? 'fade-in-up stagger-3' : 'opacity-0'}`}>
            <div className="p-6 rounded-2xl bg-white border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">Why trust us?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Secure & Private</p>
                    <p className="text-sm text-muted-foreground">Your data is encrypted and never sold to third parties</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Verified Movers Only</p>
                    <p className="text-sm text-muted-foreground">All movers are licensed, insured, and background-checked</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">No Spam Guarantee</p>
                    <p className="text-sm text-muted-foreground">Only movers you choose can contact you</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">100% Free</p>
                    <p className="text-sm text-muted-foreground">No fees, no obligations - just great quotes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="p-6 rounded-2xl bg-muted/50 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</span>
                <span className="font-semibold text-foreground">4.8/5</span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Found the perfect mover at half the price I expected. The comparison made it so easy!"
              </p>
              <p className="text-sm font-medium text-foreground mt-2">— Sarah M., Austin TX</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-border px-8 py-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push('/funnel/summary')}
            className="text-muted-foreground hover:text-foreground transition-colors text-lg"
          >
            Back
          </button>
          <Button
            onClick={handleSubmit}
            disabled={!preferences.consentToContact}
            className="btn-primary px-10 py-3 text-lg"
          >
            Get My Quotes
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
