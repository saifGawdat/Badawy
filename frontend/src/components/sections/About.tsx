"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const About = () => {
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
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop" 
            alt="Dr. Mostafa Badawy" 
            fill 
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
              «Beauty begins when confidence meets the precision of skilled hands. Our goal is not just an aesthetic change, but a natural transformation that celebrates you.»
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
              <h3 className="text-xl font-serif tracking-tight">Dr. Mostafa Badawy</h3>
              <p className="text-primary text-xs uppercase tracking-widest mt-1">Founding Plastic Surgeon</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <h4 className="text-6xl font-serif text-secondary tracking-tighter">95%</h4>
              <p className="text-secondary/50 text-sm leading-tight uppercase font-medium tracking-wider">Smooth recovery and natural results</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-6xl font-serif text-secondary tracking-tighter">15k+</h4>
              <p className="text-secondary/50 text-sm leading-tight uppercase font-medium tracking-wider">Satisfied patients worldwide</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
