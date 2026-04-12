"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

interface ServiceItem {
  _id: string;
  title: string;
}

const DEFAULT_LOC_EN = "Tanta, El Bahr Street, near El-Galaa Mall";
const DEFAULT_LOC_AR = "طنطا، شارع البحر، بجوار مول الجلاء";

export const Footer = () => {
  const [services, setServices] = React.useState<ServiceItem[]>([]);
  const { isArabic } = useLanguage();

  const [phone, setPhone] = React.useState("");
  const [whatsappPhone, setWhatsappPhone] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [locationAr, setLocationAr] = React.useState("");
  const [facebookUrl, setFacebookUrl] = React.useState("");
  const [instagramUrl, setInstagramUrl] = React.useState("");

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get("/items");
        setServices(data);
      } catch {
        setServices([]);
      }
    };

    fetchServices();
  }, []);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/site-settings");

        setPhone(data.phone || "");
        setWhatsappPhone(data.whatsappPhone || "");
        setLocation(data.location || "");
        setLocationAr(data.locationAr || "");
        setFacebookUrl(data.facebookUrl || "");
        setInstagramUrl(data.instagramUrl || "");
      } catch {
        console.error("Failed to load settings");
      }
    };

    fetchSettings();
  }, []);

  const formatPhone = (num: string) => num.replace(/\D/g, "");

  const displayPhone = phone || whatsappPhone || "+20 100 123 4567";
  const displayWhatsapp = whatsappPhone || phone || "+20 100 123 4567";
  const displayLocation = isArabic
    ? locationAr || location || DEFAULT_LOC_AR
    : location || locationAr || DEFAULT_LOC_EN;

  return (
    <footer className="bg-bone pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Contact Section */}
        <div className="bg-secondary rounded-[3rem] p-12 lg:p-20 relative overflow-hidden mb-24 lg:flex items-center justify-between">
          {/* Background text */}
          <div className="absolute inset-0 grayscale opacity-10 pointer-events-none">
            <div className="text-[200px] font-script text-white whitespace-nowrap -translate-y-12">
              {isArabic ? "تواصل" : "contact"}
            </div>
          </div>

          {/* Left Content */}
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-serif text-white mb-6 leading-tight">
              {isArabic ? "تواصل معنا الآن" : "Get In Touch"} <br />
              <span className="text-primary italic">
                {isArabic ? "واحجز استشارتك" : "Book Your Consultation"}
              </span>
            </h2>

            <p className="text-white/60 text-lg">
              {isArabic
                ? "تواصل معنا مباشرة عبر الهاتف أو واتساب للحصول على استشارة سريعة ومتابعة فورية."
                : "Reach out directly via phone or WhatsApp for quick consultation and immediate support."}
            </p>
          </div>

          {/* Contact Cards */}
          <div className="mt-10 lg:mt-0 relative z-10 w-full lg:w-[420px] space-y-4">
            {/* Phone */}
            <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-2xl px-6 py-4 backdrop-blur-md">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest">
                  {isArabic ? "اتصل بنا" : "Call Us"}
                </p>
                <p className="text-white font-semibold text-lg">
                  {displayPhone}
                </p>
              </div>

              <a
                href={`tel:${formatPhone(phone) || formatPhone(whatsappPhone) || formatPhone(displayPhone)}`}
                className="bg-primary text-secondary px-4 py-2 rounded-full text-sm hover:bg-gold-light transition"
              >
                {isArabic ? "اتصال" : "Call"}
              </a>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-2xl px-6 py-4 backdrop-blur-md">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest">
                  WhatsApp
                </p>
                <p className="text-white font-semibold text-lg">
                  {displayWhatsapp}
                </p>
              </div>

              <a
                href={`https://wa.me/${formatPhone(whatsappPhone) || formatPhone(phone) || formatPhone(displayWhatsapp)}`}
                target="_blank"
                className="bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-400 transition"
              >
                {isArabic ? "رسالة" : "Message"}
              </a>
            </div>

            {/* Location */}
            <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 backdrop-blur-md">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
                {isArabic ? "العنوان" : "Location"}
              </p>
              <p className="text-white text-sm leading-relaxed whitespace-pre-line">
                {displayLocation}
              </p>
            </div>

            {/* Working Hours */}
            <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 backdrop-blur-md">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
                {isArabic ? "مواعيد العمل" : "Working Hours"}
              </p>
              <p className="text-white text-sm">
                {isArabic
                  ? "السبت - الخميس: 10 ص - 8 م"
                  : "Sat - Thu: 10 AM - 8 PM"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-20 border-b border-secondary/5">
          <div className="space-y-6">
            <div className="relative w-20 h-20">
              <Image
                src="/logo9.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>

            <p className="text-secondary/60 text-sm leading-relaxed max-w-xs">
              {isArabic
                ? "نقدم إجراءات دقيقة وفعّالة تحافظ على جمالك الطبيعي."
                : "Providing subtle, effective procedures designed to preserve your natural beauty."}
            </p>

            <div className="flex space-x-4">
              <SocialIcon icon={FacebookIcon} href={facebookUrl || undefined} />
              <SocialIcon icon={InstagramIcon} href={instagramUrl || undefined} />
            </div>
          </div>

          <FooterColumn title={isArabic ? "التنقل" : "Navigation"}>
            <FooterLink href="#home">
              {isArabic ? "الرئيسية" : "Home"}
            </FooterLink>
            <FooterLink href="#services">
              {isArabic ? "الخدمات" : "Services"}
            </FooterLink>
            <FooterLink href="#about">{isArabic ? "عن" : "About"}</FooterLink>
            <FooterLink href="/blog">
              {isArabic ? "الأخبار" : "Blog"}
            </FooterLink>
          </FooterColumn>

          <FooterColumn title={isArabic ? "الخدمات" : "Services"}>
            {services.slice(0, 6).map((service) => (
              <FooterLink key={service._id} href={`/services/${service._id}`}>
                {service.title}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={isArabic ? "التواصل" : "Contacts"}>
            <p className="text-secondary/60 text-sm whitespace-pre-line">
              {displayLocation}
            </p>
            <p className="text-primary font-bold pt-2 hover:underline">
              {displayPhone}
            </p>
          </FooterColumn>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.3em] text-secondary/40 font-bold">
          <p>
            {isArabic
              ? "© 2026 جميع الحقوق محفوظة."
              : "© 2026 All rights reserved."}
          </p>

          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary">
              {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <Link href="#" className="hover:text-primary">
              {isArabic ? "الشروط" : "Terms"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon, href }: { icon: React.ElementType; href?: string }) => {
  const content = (
    <div className="w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition cursor-pointer">
      <Icon className="w-4 h-4" />
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );
};

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16.11 7.66 16.12 7.62" />
    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  </svg>
);

const FooterColumn = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-6">
    <h5 className="font-serif text-lg text-secondary">{title}</h5>
    <div className="flex flex-col space-y-4">{children}</div>
  </div>
);

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="text-secondary/60 text-sm hover:text-primary transition"
  >
    {children}
  </Link>
);
