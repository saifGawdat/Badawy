"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import api from "@/lib/api";

interface BeforeAfterItem {
  _id: string;
  title: string;
  beforeImageUrl: string;
  afterImageUrl: string;
}

export const BeforeAfter = () => {
  const [slides, setSlides] = useState<BeforeAfterItem[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const totalSlides = slides.length;

  const currentSlide = useMemo(() => slides[activeSlide], [activeSlide, slides]);

  useEffect(() => {
    const fetchBeforeAfter = async () => {
      try {
        const { data } = await api.get("/before-after");
        setSlides(data);
      } catch {
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeforeAfter();
  }, []);

  useEffect(() => {
    if (!slides.length) {
      setActiveSlide(0);
      return;
    }
    if (activeSlide >= slides.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, slides.length]);

  const goPrev = () => {
    setSplitPercent(50);
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goNext = () => {
    setSplitPercent(50);
    setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const updateSplit = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setSplitPercent(Math.max(0, Math.min(100, percent)));
  };

  if (isLoading) {
    return (
      <section className="bg-[#0B0B0B] py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[#E3C46A]/80">Loading before and after cases...</p>
        </div>
      </section>
    );
  }

  if (!slides.length || !currentSlide) {
    return (
      <section className="bg-[#0B0B0B] py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[#E3C46A]/80">No before and after cases yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#0B0B0B] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(197,160,40,0.18),transparent_60%)]" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10 relative z-10">
          <p className="text-[#C5A028] uppercase tracking-[0.25em] text-xs mb-3">
            Before / After
          </p>
          <h3 className="text-white font-serif text-3xl md:text-4xl">
            {currentSlide.title}
          </h3>
        </div>

        <div className="relative z-10 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8">
          <p className="hidden md:block font-script text-5xl text-[#E3C46A]/90">before</p>
          <div
            className="relative w-full aspect-16/10 md:aspect-video rounded-2xl overflow-hidden border border-[#C5A028]/50 shadow-[0_0_0_1px_rgba(197,160,40,0.2),0_20px_80px_rgba(0,0,0,0.6)] select-none touch-none"
            onPointerDown={(event) => {
              setIsDragging(true);
              event.currentTarget.setPointerCapture(event.pointerId);
              updateSplit(event.clientX, event.currentTarget.getBoundingClientRect());
            }}
            onMouseMove={(event) => {
              if (isDragging || event.buttons === 1) {
                updateSplit(event.clientX, event.currentTarget.getBoundingClientRect());
              }
            }}
            onPointerMove={(event) => {
              if (!isDragging) return;
              updateSplit(event.clientX, event.currentTarget.getBoundingClientRect());
            }}
            onPointerUp={() => {
              setIsDragging(false);
            }}
            onPointerCancel={() => {
              setIsDragging(false);
            }}
            onPointerLeave={() => {
              setIsDragging(false);
            }}
          >
            <Image
              src={currentSlide.afterImageUrl}
              alt={`${currentSlide.title} after`}
              fill
              sizes="(min-width: 1024px) 960px, 95vw"
              className="object-cover"
            />

            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${splitPercent}%` }}
            >
              <div className="relative w-full h-full min-w-px">
                <Image
                  src={currentSlide.beforeImageUrl}
                  alt={`${currentSlide.title} before`}
                  fill
                  sizes="(min-width: 1024px) 960px, 95vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div
              className="absolute inset-y-0"
              style={{ left: `${splitPercent}%`, transform: "translateX(-50%)" }}
            >
              <div className="relative h-full w-0.5 bg-[#E3C46A]/95" />
              <button
                type="button"
                aria-label="Drag to compare before and after"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-11 w-11 rounded-full border border-[#E3C46A] bg-black text-[#E3C46A] shadow-lg"
              >
                <span className="text-sm">&#8596;</span>
              </button>
            </div>
          </div>
          <p className="hidden md:block font-script text-5xl text-[#E3C46A]/90">after</p>
        </div>

        <div className="mt-4 flex md:hidden items-center justify-between text-[#E3C46A]/90 px-1">
          <p className="font-script text-4xl">before</p>
          <p className="font-script text-4xl">after</p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-white relative z-10">
          <button
            type="button"
            aria-label="Previous before and after slide"
            onClick={goPrev}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-[#C5A028]/50 text-[#E3C46A] hover:bg-[#C5A028]/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm tracking-[0.25em] text-[#E3C46A]/90">
            {String(activeSlide + 1).padStart(2, "0")} /{" "}
            {String(totalSlides).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label="Next before and after slide"
            onClick={goNext}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-[#C5A028]/50 text-[#E3C46A] hover:bg-[#C5A028]/10 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
