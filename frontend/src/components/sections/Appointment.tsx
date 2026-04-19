"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

const DEFAULT_LOC_EN = 'Tanta, El Bahr Street, near El-Galaa Mall';
const DEFAULT_LOC_AR = 'طنطا، شارع البحر، بجوار مول الجلاء';

function digitsOnly(num: string) {
  return num.replace(/\D/g, '');
}

export const Appointment = () => {
  const { isArabic } = useLanguage();
  const [officePhone, setOfficePhone] = useState('');
  const [locationLine, setLocationLine] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<{
          phone?: string;
          whatsappPhone?: string;
          location?: string;
          locationAr?: string;
        }>('/site-settings');
        const p = (data.phone || data.whatsappPhone || '').trim();
        setOfficePhone(p);
        const loc = isArabic
          ? (data.locationAr || data.location || '').trim()
          : (data.location || data.locationAr || '').trim();
        setLocationLine(loc);
      } catch {
        setOfficePhone('');
        setLocationLine('');
      }
    };
    load();
  }, [isArabic]);

  const phoneDisplay = officePhone || '+20 100 123 4567';
  const phoneTel = digitsOnly(officePhone) || digitsOnly(phoneDisplay);
  const locationDisplay =
    locationLine || (isArabic ? DEFAULT_LOC_AR : DEFAULT_LOC_EN);

  const [services, setServices] = useState<{ id: string; title: string; titleAr: string }[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    procedure: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/items');
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };
    fetchServices();
  }, []);

  const onChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/appointments', formData);
      toast.success(isArabic ? 'تم إرسال طلب الموعد بنجاح' : 'Appointment request sent successfully');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        procedure: '',
        message: '',
      });
    } catch {
      toast.error(isArabic ? 'فشل إرسال الطلب' : 'Failed to send appointment request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacts" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Decorative & Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="relative aspect-square w-full max-w-sm mx-auto lg:mx-0 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-bone">
             <Image 
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop" 
                alt="Clinic Interior" 
                fill 
                className="object-cover"
             />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-serif text-secondary">
              {isArabic ? 'احجزي موعداً' : 'Make an Appointment'}
            </h2>
            <p className="text-secondary/60 max-w-md">
              {isArabic
                ? 'جاهزة لبدء رحلتك؟ احجزي استشارة خاصة مع د. بدوي لمناقشة خطة علاجك المناسبة.'
                : 'Ready to begin your transformation? Schedule a private consultation with Dr. Badawy to discuss your personalized treatment plan.'}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ContactInfo
                icon={Phone}
                label={isArabic ? 'اتصلي بنا' : 'Call Us'}
                value={phoneDisplay}
                href={phoneTel ? `tel:${phoneTel}` : undefined}
              />
              <ContactInfo icon={Mail} label={isArabic ? 'راسلينا' : 'Email Us'} value="info@drbadawy.com" href="mailto:info@drbadawy.com" />
              <ContactInfo icon={Calendar} label={isArabic ? 'المواعيد' : 'Hours'} value={isArabic ? 'الإثنين-السبت: 09:00 - 18:00' : 'Mon-Sat: 09:00 - 18:00'} />
              <ContactInfo
                icon={MapPin}
                label={isArabic ? 'الموقع' : 'Location'}
                value={locationDisplay}
              />
            </div>
          </div>
        </motion.div>

        {/* Right Side: Simple Appointment Form Inspired by Screenshots */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <GlassCard className="p-10 border-none bg-bone/50 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <FormInput
                  label={isArabic ? 'الاسم الكامل' : 'Full Name'}
                  value={formData.fullName}
                  onChange={(value) => onChange('fullName', value)}
                  placeholder={isArabic ? 'اسمك' : 'Your name'}
                />
                <FormInput
                  label={isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                  type="email"
                  value={formData.email}
                  onChange={(value) => onChange('email', value)}
                  placeholder="email@example.com"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <FormInput
                  label={isArabic ? 'رقم الهاتف' : 'Phone Number'}
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => onChange('phone', value)}
                  placeholder="+20..."
                />
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-secondary/40 ml-1">
                    {isArabic ? 'الإجراء المطلوب' : 'Preferred Procedure'}
                  </label>
                  <select
                    required
                    value={formData.procedure}
                    onChange={(e) => onChange('procedure', e.target.value)}
                    className="w-full bg-white border-b border-secondary/10 py-4 focus:outline-none focus:border-primary transition-colors text-secondary appearance-none cursor-pointer"
                  >
                    <option value="">{isArabic ? 'اختاري الإجراء' : 'Select Procedure'}</option>
                    <option value="Consultation">
                      {isArabic ? 'استشارة عامة' : 'General Consultation'}
                    </option>
                    {services.map((service) => (
                      <option key={service.id} value={service.title}>
                        {isArabic ? service.titleAr || service.title : service.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-secondary/40 ml-1">
                  {isArabic ? 'رسالة (اختياري)' : 'Message (Optional)'}
                </label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => onChange('message', e.target.value)}
                  placeholder={isArabic ? 'أخبرينا عن أهدافك...' : 'Tell us about your goals...'}
                  className="w-full bg-white border-b border-secondary/10 py-4 focus:outline-none focus:border-primary transition-colors resize-none text-secondary"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-sm hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 disabled:opacity-50"
              >
                {isSubmitting ? (isArabic ? 'جارٍ الإرسال...' : 'Sending...') : (isArabic ? 'إرسال الطلب' : 'Send Request')}
              </button>
            </form>
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
  <div className="flex items-start gap-4">
    <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase font-bold tracking-widest text-secondary/40">{label}</p>
      {href ? (
        <a href={href} className="text-secondary font-serif hover:text-primary transition-colors whitespace-pre-line">
          {value}
        </a>
      ) : (
        <p className="text-secondary font-serif whitespace-pre-line">{value}</p>
      )}
    </div>
  </div>
);

const FormInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase font-bold tracking-widest text-secondary/40 ml-1">{label}</label>
    <input 
      required
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border-b border-secondary/10 py-4 focus:outline-none focus:border-primary transition-colors text-secondary placeholder:text-secondary/20"
    />
  </div>
);
