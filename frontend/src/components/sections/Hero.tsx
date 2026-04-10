"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import api from '@/lib/api';

interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
}

export const Hero = () => {
  const [slides, setSlides] = React.useState<HeroSlide[]>([]);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await api.get('/hero-slides');
        setSlides(data);
      } catch {
        setSlides([]);
      }
    };
    fetchSlides();
  }, []);

  React.useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  React.useEffect(() => {
    if (!slides.length) {
      setIndex(0);
      return;
    }
    if (index >= slides.length) {
      setIndex(0);
    }
  }, [index, slides.length]);

  const currentSlide = slides[index];
  const fallbackSlide: HeroSlide = {
    _id: "fallback",
    title: "Surgery Refined by Professionals",
    subtitle: "Enhance your confidence restore your youth and elevate your everyday.",
    ctaText: "Read More",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
  };
  const activeSlide = currentSlide || fallbackSlide;

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-bone">
      <div className="absolute inset-0">
        <Image
          src={activeSlide.imageUrl}
          alt={activeSlide.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-secondary/80 via-secondary/45 to-secondary/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="flex items-center space-x-2 text-primary mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-sm font-semibold tracking-tighter text-white/90">4.95 Google rating</span>
          </div>

          <h1 className="text-6xl lg:text-7xl font-serif text-white leading-[1.08] mb-8 max-w-xl">
            {activeSlide.title}
          </h1>

          <p className="text-lg text-white/85 max-w-md leading-relaxed mb-10">
            {activeSlide.subtitle}
          </p>

          <div className="flex items-center space-x-6">
            <button className="bg-transparent border border-white/50 text-white px-10 py-4 rounded-none font-medium hover:bg-white/10 transition-all flex items-center space-x-3 group">
              <span>{activeSlide.ctaText || "Read More"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        <div />
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-5 text-white/90 z-20">
        <button
          type="button"
          onClick={() => setIndex((prev) => (prev === 0 ? (slides.length || 1) - 1 : prev - 1))}
          className="hover:text-white transition-colors"
          aria-label="Previous hero slide"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs tracking-[0.2em]">
          {String(index + 1).padStart(2, "0")} / {String((slides.length || 1)).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => setIndex((prev) => (prev === (slides.length || 1) - 1 ? 0 : prev + 1))}
          className="hover:text-white transition-colors"
          aria-label="Next hero slide"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
