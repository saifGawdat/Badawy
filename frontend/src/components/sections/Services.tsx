"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface Item {
  _id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  imageUrl: string;
}

export const Services = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const { isArabic } = useLanguage();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await api.get('/items');
        setItems(data);
      } catch {
        console.error('Failed to fetch services');
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1280) {
        setCardsPerView(3);
        return;
      }

      if (window.innerWidth >= 768) {
        setCardsPerView(2);
        return;
      }

      setCardsPerView(1);
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);

    return () => {
      window.removeEventListener('resize', updateCardsPerView);
    };
  }, []);

  useEffect(() => {
    const maxIndex = Math.max(items.length - cardsPerView, 0);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [cardsPerView, currentIndex, items.length]);

  const maxIndex = Math.max(items.length - cardsPerView, 0);
  const canSlidePrev = currentIndex > 0;
  const canSlideNext = currentIndex < maxIndex;

  const goPrev = () => {
    if (!canSlidePrev) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const goNext = () => {
    if (!canSlideNext) return;
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <section id="services" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <p className="font-script text-primary text-4xl mb-4 italic">{isArabic ? 'جمالك' : 'your beauty'}</p>
          <h2 className="text-5xl font-serif text-secondary tracking-tight">
            {isArabic ? (
              <>
                صُممت للأشخاص أصحاب الأهداف الحقيقية، <br />
                وعلاجاتنا تساعدك أن تشعري بأنك أنتِ.
              </>
            ) : (
              <>
                Designed for people with real goals, <br />
                Our treatments help you feel like yourself.
              </>
            )}
          </h2>
        </div>

        <div className="relative" dir="ltr">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canSlidePrev}
            className="absolute -left-6 top-1/2 z-20 -translate-y-1/2 h-11 w-11 rounded-full border border-black/30 bg-white flex items-center justify-center text-black disabled:opacity-40 disabled:cursor-not-allowed hover:border-black transition-colors"
            aria-label="Previous services"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canSlideNext}
            className="absolute -right-6 top-1/2 z-20 -translate-y-1/2 h-11 w-11 rounded-full border border-black/30 bg-white flex items-center justify-center text-black disabled:opacity-40 disabled:cursor-not-allowed hover:border-black transition-colors"
            aria-label="Next services"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${(100 / cardsPerView) * currentIndex}%)` }}
            >
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="shrink-0 px-3"
                  style={{ width: `${100 / cardsPerView}%` }}
                >
                  <div className="group cursor-pointer">
                    <div className="relative aspect-3/4 rounded-3xl overflow-hidden mb-6 shadow-xl group-hover:shadow-primary/10 transition-shadow">
                      <Image
                        src={item.imageUrl}
                        alt={isArabic && item.titleAr ? item.titleAr : item.title}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden" />
                      <div className="absolute bottom-6 left-6 right-6 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                        <Link
                          href={`/services/${item._id}`}
                          className="w-full bg-white/20 backdrop-blur-md text-white py-3 rounded-xl border border-white/20 hover:bg-white/40 transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>{isArabic ? 'عرض التفاصيل' : 'View Details'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                    <h3 className="text-xl font-serif text-secondary mb-2 group-hover:text-primary transition-colors">
                      {isArabic && item.titleAr ? item.titleAr : item.title}
                    </h3>
                    <div className="w-8 h-[2px] bg-primary group-hover:w-full transition-all duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
