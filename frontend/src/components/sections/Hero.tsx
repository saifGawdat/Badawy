"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import api from "@/lib/api";

interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
}

const fallbackSlide: HeroSlide = {
  _id: "fallback",
  title: "Surgery Refined by Professionals",
  subtitle:
    "Enhance your confidence restore your youth and elevate your everyday.",
  ctaText: "Read More",
  imageUrl:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
};

export const Hero = () => {
  const [slides, setSlides] = React.useState<HeroSlide[]>([]);
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // FETCH DATA
  React.useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await api.get("/hero-slides");
        setSlides(data || []);
      } catch {
        setSlides([]);
      }
    };

    fetchSlides();
  }, []);

  const hasSlides = slides.length > 0;
  const activeSlide = hasSlides ? slides[index] : fallbackSlide;

  // AUTOPLAY (SYNC SAFE)
  React.useEffect(() => {
    if (!hasSlides || paused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [hasSlides, paused, slides.length]);

  const goNext = () => {
    if (!hasSlides) return;
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    if (!hasSlides) return;
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden flex items-center bg-white/90"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* SLIDE WRAPPER (SYNC POINT) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide._id}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* IMAGE LAYER */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
          >
            <Image
              src={activeSlide.imageUrl}
              alt={activeSlide.title}
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/55" />
          </motion.div>

          {/* TEXT LAYER (SYNCED WITH SAME KEY) */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -70 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 70 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              {/* STARS */}
              <div className="flex items-center gap-2 mb-6 text-white">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-[#d1f007]" />
                ))}
                <span className="text-sm ml-2">4.95 Google rating</span>
              </div>

              {/* TITLE */}
              <h1 className="text-6xl lg:text-7xl font-serif text-white leading-tight max-w-2xl mb-6">
                {activeSlide.title}
              </h1>

              {/* SUBTITLE */}
              <p className="text-white/80 max-w-md mb-10">
                {activeSlide.subtitle}
              </p>

              {/* CTA */}
              <button className="border border-white text-white px-8 py-3 hover:bg-white hover:text-black transition">
                {activeSlide.ctaText}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* CONTROLS */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 text-white z-20">
        <button onClick={goPrev}>
          <ArrowLeft />
        </button>

        <span className="text-sm tracking-widest">
          {index + 1} / {slides.length || 1}
        </span>

        <button onClick={goNext}>
          <ArrowRight />
        </button>
      </div>
    </section>
  );
};
