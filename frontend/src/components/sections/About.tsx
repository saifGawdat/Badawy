"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';

interface AboutData {
  id: string;
  imageUrl?: string;
  quoteEn?: string;
  quoteAr?: string;
  drNameEn?: string;
  drNameAr?: string;
  drTitleEn?: string;
  drTitleAr?: string;
  stat1Value?: string;
  stat1LabelEn?: string;
  stat1LabelAr?: string;
  stat2Value?: string;
  stat2LabelEn?: string;
  stat2LabelAr?: string;
}

export const About = () => {
  const { isArabic } = useLanguage();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data } = await api.get('/about');
        if (data && data.id) {
          setAboutData(data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };
    fetchAbout();
  }, []);

  const content = {
    image: aboutData?.imageUrl || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop",
    quote: isArabic 
      ? (aboutData?.quoteAr || '«الجمال يبدأ عندما تلتقي الثقة بدقة الأيدي الماهرة. هدفنا ليس مجرد تغيير شكلي، بل تحول طبيعي يبرز جمالك الحقيقي.»')
      : (aboutData?.quoteEn || '«Beauty begins when confidence meets the precision of skilled hands. Our goal is not just an aesthetic change, but a natural transformation that celebrates you.»'),
    drName: isArabic ? (aboutData?.drNameAr || 'د. مصطفى بدوي') : (aboutData?.drNameEn || 'Dr. Mostafa Badawi'),
    drTitle: isArabic ? (aboutData?.drTitleAr || 'جراح تجميل مؤسس') : (aboutData?.drTitleEn || 'Founding Plastic Surgeon'),
    stat1Value: aboutData?.stat1Value || "95%",
    stat1Label: isArabic ? (aboutData?.stat1LabelAr || 'تعافٍ سلس ونتائج طبيعية') : (aboutData?.stat1LabelEn || 'Smooth recovery and natural results'),
    stat2Value: aboutData?.stat2Value || "15k+",
    stat2Label: isArabic ? (aboutData?.stat2LabelAr || 'مرضى راضون حول العالم') : (aboutData?.stat2LabelEn || 'Satisfied patients worldwide'),
  };

  return (
    <section id="about" className="py-24 bg-bone">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative aspect-3/4 overflow-hidden rounded-[3rem] shadow-2xl"
        >
          <Image 
            src={content.image} 
            alt={content.drName}
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
         initial={{ opacity: 0, x: 30 }}
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.8 }}
         className="space-y-8"
        >
          <div className="bg-secondary p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl transition-all group-hover:bg-primary/40" />
            
            <p className="text-2xl font-serif italic leading-relaxed mb-8 relative z-10">
              {content.quote}
            </p>
            
            <div className="relative z-10">
              <div className="relative h-16 w-48 invert mb-2">
                <Image 
                  src="/signature2.png" 
                  alt="Dr. Signature" 
                  fill 
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-serif tracking-tight">{content.drName}</h3>
              <p className="text-primary text-xs uppercase tracking-widest mt-1">
                {content.drTitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <h4 className="text-6xl font-serif text-secondary tracking-tighter">{content.stat1Value}</h4>
              <p className="text-secondary/50 text-sm leading-tight uppercase font-medium tracking-wider">
                {content.stat1Label}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-6xl font-serif text-secondary tracking-tighter">{content.stat2Value}</h4>
              <p className="text-secondary/50 text-sm leading-tight uppercase font-medium tracking-wider">
                {content.stat2Label}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
