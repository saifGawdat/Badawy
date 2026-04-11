"use client";

import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { About } from '@/components/sections/About';
import { Appointment } from '@/components/sections/Appointment';
import { Footer } from '@/components/sections/Footer';
import { Testimonials } from '@/components/sections/Testimonials';
import { BeforeAfter } from '@/components/sections/BeforeAfter';
import { SignatureMarquee } from '@/components/sections/SignatureMarquee';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <SignatureMarquee />
        <Services />
        <Testimonials />
        <Appointment />
        <BeforeAfter />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
