"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

interface BeforeAfterItem {
  _id: string;
  title: string;
  titleAr?: string;
  beforeImageUrl: string;
  afterImageUrl: string;
}

export const BeforeAfter = () => {
  const { isArabic } = useLanguage();
  const [slides, setSlides] = useState<BeforeAfterItem[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const totalSlides = slides.length;
  const currentSlide = useMemo(
    () => slides[activeSlide],
    [activeSlide, slides],
  );

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
          <p className="text-[#E3C46A]/80">
            {isArabic
              ? "جارٍ تحميل حالات قبل وبعد..."
              : "Loading before and after cases..."}
          </p>
        </div>
      </section>
    );
  }

  if (!slides.length || !currentSlide) {
    return (
      <section className="bg-[#0B0B0B] py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[#E3C46A]/80">
            {isArabic
              ? "لا توجد حالات قبل وبعد حتى الآن."
              : "No before and after cases yet."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#0B0B0B] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(197,160,40,0.18),transparent_60%)]" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-10 relative z-10">
          <p className="text-[#C5A028] uppercase tracking-[0.25em] text-xs mb-3">
            {isArabic ? "قبل / بعد" : "Before / After"}
          </p>
          <h3 className="text-white font-serif text-3xl md:text-4xl">
            {isArabic && currentSlide.titleAr
              ? currentSlide.titleAr
              : currentSlide.title}
          </h3>
        </div>

        {/* Slider Layout */}
        <div className="relative z-10 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8">
          {/* Before label */}
          <p className="hidden md:block font-script text-5xl text-[#E3C46A]/90">
            {isArabic ? "قبل" : "before"}
          </p>

          {/* Slider */}
          <div
            className="relative w-full aspect-[16/10] bg-black rounded-2xl overflow-hidden 
            border border-[#C5A028]/50 
            shadow-[0_0_0_1px_rgba(197,160,40,0.2),0_20px_80px_rgba(0,0,0,0.6)] 
            select-none touch-none"
            onPointerDown={(e) => {
              setIsDragging(true);
              e.currentTarget.setPointerCapture(e.pointerId);
              updateSplit(e.clientX, e.currentTarget.getBoundingClientRect());
            }}
            onPointerMove={(e) => {
              if (!isDragging) return;
              updateSplit(e.clientX, e.currentTarget.getBoundingClientRect());
            }}
            onPointerUp={() => setIsDragging(false)}
            onPointerLeave={() => setIsDragging(false)}
          >
            {/* AFTER (base) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={currentSlide.afterImageUrl}
                  alt="after"
                  fill
                  sizes="(min-width: 1024px) 960px, 95vw"
                  className="object-contain pointer-events-none"
                  draggable={false}
                />
              </div>
            </div>

            {/* BEFORE (overlay with clip-path) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - splitPercent}% 0 0)`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={currentSlide.beforeImageUrl}
                    alt="before"
                    fill
                    sizes="(min-width: 1024px) 960px, 95vw"
                    className="object-contain pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              className="absolute inset-y-0"
              style={{
                left: `${splitPercent}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="relative h-full w-0.5 bg-[#E3C46A]/95" />

              <button
                type="button"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                h-11 w-11 rounded-full border border-[#E3C46A] bg-black text-[#E3C46A] shadow-lg"
              >
                <span className="text-sm">&#8596;</span>
              </button>
            </div>
          </div>

          {/* After label */}
          <p className="hidden md:block font-script text-5xl text-[#E3C46A]/90">
            {isArabic ? "بعد" : "after"}
          </p>
        </div>

        {/* Mobile labels */}
        <div className="mt-4 flex md:hidden items-center justify-between text-[#E3C46A]/90 px-1">
          <p className="font-script text-4xl">{isArabic ? "قبل" : "before"}</p>
          <p className="font-script text-4xl">{isArabic ? "بعد" : "after"}</p>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-6 text-white relative z-10">
          <button
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
