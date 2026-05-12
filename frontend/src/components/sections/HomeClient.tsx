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
import { Locations } from '@/components/sections/Locations';
import { SignatureMarquee } from '@/components/sections/SignatureMarquee';
import { LocalSeoIntro } from '@/components/sections/LocalSeoIntro';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

export function HomeClient() {
  return (
    <div className="bg-white">
      <Navbar />
      <LocalSeoIntro />
      <main id="main-content">
        <Hero />
        <About />
        <SignatureMarquee />
        <Services />
        <Testimonials />
        <Locations />
        <Appointment />
        <BeforeAfter />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
