"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, Calendar, MapPin } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import api from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { WizardContainer } from "./AppointmentWizard";

const DEFAULT_LOC_EN = "Tanta, El Bahr Street, near El-Galaa Mall";
const DEFAULT_LOC_AR = "طنطا، شارع البحر، بجوار مول الجلاء";

function digitsOnly(num: string) {
  return num.replace(/\D/g, "");
}

export const Appointment = () => {
  const { isArabic } = useLanguage();
  const [officePhone, setOfficePhone] = useState("");
  const [locationLine, setLocationLine] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<{
          phone?: string;
          whatsappPhone?: string;
          location?: string;
          locationAr?: string;
        }>("/site-settings");
        const p = (data.phone || data.whatsappPhone || "").trim();
        setOfficePhone(p);
        const loc = isArabic
          ? (data.locationAr || data.location || "").trim()
          : (data.location || data.locationAr || "").trim();
        setLocationLine(loc);
      } catch {
        setOfficePhone("");
        setLocationLine("");
      }
    };
    load();
  }, [isArabic]);

  const phoneDisplay = officePhone || "+20 100 123 4567";
  const phoneTel = digitsOnly(officePhone) || digitsOnly(phoneDisplay);
  const locationDisplay =
    locationLine || (isArabic ? DEFAULT_LOC_AR : DEFAULT_LOC_EN);

  return (
    <section id="contacts" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Decorative & Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12 text-center lg:text-start"
        >
          <div className="relative aspect-square w-full max-w-sm mx-auto lg:mx-0 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-bone">
             <Image
                src="/Gemini_Generated_Image_jvtzrbjvtzrbjvtz.png"
                alt="Clinic Interior"
                fill
                className="object-cover"
             />
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-serif text-secondary">
              {isArabic ? "احجزي موعداً" : "Make an Appointment"}
            </h2>
            <p className="text-secondary/60 max-w-md">
              {isArabic
                ? "جاهزة لبدء رحلتك؟ احجزي استشارة خاصة مع د. بدوي لمناقشة خطة علاجك المناسبة."
                : "Ready to begin your transformation? Schedule a private consultation with Dr. Badawi to discuss your personalized treatment plan."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center lg:justify-items-start">
              <ContactInfo
                icon={Phone}
                label={isArabic ? "اتصلي بنا" : "Call Us"}
                value={phoneDisplay}
                href={phoneTel ? `tel:${phoneTel}` : undefined}
              />
              <ContactInfo icon={Mail} label={isArabic ? "راسلينا" : "Email Us"} value="info@drbadawi.com" href="mailto:info@drbadawi.com" />
              <ContactInfo icon={Calendar} label={isArabic ? "المواعيد" : "Hours"} value={isArabic ? "الإثنين-السبت: 09:00 - 18:00" : "Mon-Sat: 09:00 - 18:00"} />
              <ContactInfo
                icon={MapPin}
                label={isArabic ? "الموقع" : "Location"}
                value={locationDisplay}
              />
            </div>
          </div>
        </motion.div>

        {/* Right Side: Multi-Step Booking Wizard */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <GlassCard className="p-6 md:p-10 border-none bg-bone/50 shadow-2xl">
            <WizardContainer />
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

const ContactInfo = ({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) => (
  <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-start gap-4">
    <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase font-bold tracking-widest text-secondary/40">{label}</p>
      {href ? (
        <a href={href} className="text-secondary font-serif hover:text-primary transition-colors whitespace-pre-line" dir="ltr">
          {value}
        </a>
      ) : (
        <p className="text-secondary font-serif whitespace-pre-line" dir="ltr">{value}</p>
      )}
    </div>
  </div>
);
