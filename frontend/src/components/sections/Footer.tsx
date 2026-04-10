"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Camera, Share2, Play, Send } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-bone pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Newsletter Section */}
        <div className="bg-secondary rounded-[3rem] p-12 lg:p-20 relative overflow-hidden mb-24 lg:flex items-center justify-between">
          <div className="absolute inset-0 grayscale opacity-10 pointer-events-none">
             <div className="text-[200px] font-script text-white whitespace-nowrap -translate-y-12">subscribe</div>
          </div>
          
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-serif text-white mb-6 leading-tight">
              Stay Informed With <br />
              <span className="text-primary italic">Aesthetic Excellence</span>
            </h2>
            <p className="text-white/60 text-lg">Receive exclusive updates, skincare tips, and priority access to new clinical treatments.</p>
          </div>

          <div className="mt-10 lg:mt-0 relative z-10 w-full lg:w-[400px]">
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Your email address..."
                className="w-full bg-white/10 border border-white/20 rounded-full px-8 py-5 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-white/30"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-primary text-secondary px-6 rounded-full hover:bg-gold-light transition-colors flex items-center space-x-2 group">
                <span className="font-bold text-sm uppercase tracking-widest">Join</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-20 border-b border-secondary/5">
          <div className="space-y-6">
            <div className="relative w-20 h-20">
              <Image src="/logo9.png" alt="Dr. Badawy Logo" fill className="object-contain" />
            </div>
            <p className="text-secondary/60 text-sm leading-relaxed max-w-xs">
              Providing subtle, effective procedures designed to preserve and celebrate your natural beauty with over 15 years of surgical excellence.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={MessageCircle} />
              <SocialIcon icon={Camera} />
              <SocialIcon icon={Share2} />
              <SocialIcon icon={Play} />
            </div>
          </div>

          <FooterColumn title="Navigation">
            <FooterLink href="#home">Home</FooterLink>
            <FooterLink href="#services">Services</FooterLink>
            <FooterLink href="#about">About Dr. Badawy</FooterLink>
            <FooterLink href="#blog">Latest News</FooterLink>
          </FooterColumn>

          <FooterColumn title="Services">
            <FooterLink href="#">Plastic Surgery</FooterLink>
            <FooterLink href="#">Skin Rejuvenation</FooterLink>
            <FooterLink href="#">Body Contouring</FooterLink>
            <FooterLink href="#">Aesthetic Medicine</FooterLink>
          </FooterColumn>

          <FooterColumn title="Contacts">
            <p className="text-secondary/60 text-sm">Badawy Aesthetic Center, <br /> 45 Prestige Avenue, Luxury City</p>
            <p className="text-primary font-bold pt-2 cursor-pointer hover:underline">+2-583-018-36-28</p>
            <p className="text-secondary/60 text-sm italic py-4">Open: Mon-Sat: 09:00 - 18:00</p>
          </FooterColumn>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.3em] text-secondary/40 font-bold">
          <p>© 2026 Dr. Mostafa Badawy. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <div className="w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center text-secondary hover:bg-primary hover:border-primary hover:text-white transition-all cursor-pointer group">
    <Icon className="w-4 h-4" />
  </div>
);

const FooterColumn = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-6">
    <h5 className="font-serif text-lg tracking-tight text-secondary">{title}</h5>
    <div className="flex flex-col space-y-4">{children}</div>
  </div>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-secondary/60 text-sm hover:text-primary transition-colors">
    {children}
  </Link>
);
