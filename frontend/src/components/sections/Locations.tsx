"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface Location {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  googleMapsUrl: string;
  phone: string;
  workingHours: string;
  workingHoursAr: string;
}

export const Locations = () => {
  const { isArabic } = useLanguage();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await api.get('/locations');
        setLocations(data);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };
    fetchLocations();
  }, []);

  if (locations.length === 0) return null;

  return (
    <section id="locations" className="py-24 bg-bone/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-secondary mb-4"
          >
            {isArabic ? 'عياداتنا' : 'Our Locations'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-secondary/60 max-w-2xl mx-auto font-medium"
          >
            {isArabic 
              ? 'تفضلي بزيارة عياداتنا المجهزة بأحدث التقنيات لضمان أفضل تجربة ورعاية طبية.' 
              : 'Visit our state-of-the-art clinics designed to provide the highest standard of medical care and comfort.'}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {locations.map((loc, index) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <GlassCard className="h-full overflow-hidden border-none shadow-xl bg-white group">
                <div className="flex flex-col md:flex-row h-full">
                  {/* Map Side */}
                  <div className="w-full md:w-1/2 aspect-video md:aspect-auto relative bg-bone min-h-[300px]">
                    <iframe
                      src={convertToEmbedUrl(loc.googleMapsUrl)}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={isArabic ? loc.nameAr : loc.name}
                      className="absolute inset-0 grayscale contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/20 to-transparent" />
                  </div>

                  {/* Info Side */}
                  <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                      <div className="mb-6">
                        <h3 className="text-2xl font-serif text-secondary mb-2">
                          {isArabic ? loc.nameAr : loc.name}
                        </h3>
                        <div className="w-12 h-1 bg-primary/30 rounded-full" />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-4 text-secondary/70">
                          <div className="p-2 bg-primary/5 rounded-lg text-primary shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <p className="text-sm font-medium leading-relaxed">
                            {isArabic ? loc.addressAr : loc.address}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-secondary/70">
                          <div className="p-2 bg-primary/5 rounded-lg text-primary shrink-0">
                            <Phone className="w-4 h-4" />
                          </div>
                          <p className="text-sm font-medium leading-relaxed" dir="ltr">
                            {loc.phone}
                          </p>
                        </div>

                        <div className="flex items-start gap-4 text-secondary/70">
                          <div className="p-2 bg-primary/5 rounded-lg text-primary shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <p className="text-sm font-medium leading-relaxed whitespace-pre-line">
                            {isArabic ? loc.workingHoursAr : loc.workingHours}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <a 
                        href={loc.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all"
                      >
                        <span>{isArabic ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper to attempt to convert a standard Google Maps URL to an embed URL
// Note: In a real app, users should probably paste the embed URL, 
// but we'll try to handle basic link formats.
function convertToEmbedUrl(url: string) {
  if (url.includes('google.com/maps/embed')) return url;
  
  // Basic fallback: if it's just a link, we might need a more robust conversion 
  // or ask the user for the embed snippet. For now, let's assume it might be an ID 
  // or we just return it.
  // Best practice: Admin should paste the "Embed a map" iframe src.
  return url;
}
