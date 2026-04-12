"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Phone, ArrowRight, Menu, X, Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';

function formatPhoneHref(num: string) {
  const digits = num.replace(/\D/g, '');
  return digits || '';
}

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const { language, toggleLanguage, t } = useLanguage();

  const onLanding = pathname === '/';
  const lightNav = onLanding && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadPhone = async () => {
      try {
        const { data } = await api.get<{ phone?: string; whatsappPhone?: string }>('/site-settings');
        const raw = (data.phone || data.whatsappPhone || '').trim();
        setPhoneDisplay(raw);
      } catch {
        setPhoneDisplay('');
      }
    };
    loadPhone();
  }, []);

  const FALLBACK_DISPLAY = '+20 100 123 4567';
  const phoneLabel = phoneDisplay || FALLBACK_DISPLAY;
  const phoneForTel =
    formatPhoneHref(phoneDisplay) || formatPhoneHref(FALLBACK_DISPLAY);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/90 backdrop-blur-md py-3 shadow-md border-b border-primary/10"
          : "bg-transparent py-5",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-12 h-12 transition-transform duration-500 group-hover:scale-110">
            <Image
              src="/logo9.png"
              alt="Dr. Mostafa Badawy Logo"
              fill
              className={cn(
                'object-contain transition-all duration-500',
                lightNav && 'brightness-0 invert',
              )}
            />
          </div>
          <div className="flex flex-col">
            <h1
              className={cn(
                'text-lg font-serif tracking-widest transition-colors',
                lightNav ? 'text-white' : 'text-secondary',
              )}
            >
              DR.MOSTAFA BADAWY
            </h1>
            <p
              className={cn(
                'text-[8px] uppercase tracking-[0.4em] font-medium transition-colors',
                lightNav ? 'text-white/80' : 'text-primary',
              )}
            >
              Plastic Surgeon
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-10">
          <NavLink href="/" light={lightNav}>{t('nav.home')}</NavLink>
          <NavLink href="#about" light={lightNav}>{t('nav.about')}</NavLink>
          <NavLink href="#services" light={lightNav}>{t('nav.services')}</NavLink>
          <NavLink href="/blog" light={lightNav}>{t('nav.blog')}</NavLink>
          <NavLink href="#contacts" light={lightNav}>{t('nav.contacts')}</NavLink>
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center space-x-8">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            title={language === 'en' ? 'العربية' : 'English'}
            className={cn(
              'inline-flex items-center justify-center rounded-full p-2.5 transition-colors',
              lightNav
                ? 'border border-white/40 text-white hover:border-white hover:bg-white/10'
                : 'border border-secondary/20 text-secondary/80 hover:border-primary hover:text-primary',
            )}
          >
            <Languages className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <a
            href={`tel:${phoneForTel}`}
            className={cn(
              'flex items-center space-x-2 transition-colors group',
              lightNav
                ? 'text-white/90 hover:text-white'
                : 'text-secondary/70 hover:text-primary',
            )}
          >
            <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform shrink-0" />
            <span className="text-sm font-medium tracking-wide">
              {phoneLabel}
            </span>
          </a>
          <a
            href="#contacts"
            className="bg-primary hover:bg-gold-dark text-white px-8 py-3 rounded-full text-sm font-medium transition-all transform hover:scale-105 shadow-lg shadow-primary/20 inline-flex items-center gap-2 group"
          >
            <span>{t('nav.bookNow')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            'lg:hidden p-2 transition-colors',
            lightNav ? 'text-white' : 'text-secondary',
          )}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-500 lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-8 right-8 text-secondary p-2"
        >
          <X className="w-8 h-8" />
        </button>
        <Link
          onClick={() => setIsMobileMenuOpen(false)}
          href="#home"
          className="text-3xl font-serif text-secondary"
        >
          {t('nav.home')}
        </Link>
        <Link
          onClick={() => setIsMobileMenuOpen(false)}
          href="#about"
          className="text-3xl font-serif text-secondary"
        >
          {t('nav.about')}
        </Link>
        <Link
          onClick={() => setIsMobileMenuOpen(false)}
          href="#services"
          className="text-3xl font-serif text-secondary"
        >
          {t('nav.services')}
        </Link>
        <Link
          onClick={() => setIsMobileMenuOpen(false)}
          href="/blog"
          className="text-3xl font-serif text-secondary"
        >
          {t('nav.blog')}
        </Link>
        <Link
          onClick={() => setIsMobileMenuOpen(false)}
          href="#contacts"
          className="text-3xl font-serif text-secondary"
        >
          {t('nav.contacts')}
        </Link>
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          className="inline-flex items-center justify-center rounded-full p-3 border border-secondary/20 text-secondary"
        >
          <Languages className="w-6 h-6" strokeWidth={1.75} />
        </button>
        <a
          href={`tel:${phoneForTel}`}
          className="flex items-center space-x-4 text-secondary/60 pt-8 border-t border-secondary/5 w-64 justify-center"
        >
          <Phone className="w-5 h-5" />
          <span className="text-lg">{phoneLabel}</span>
        </a>
      </div>
    </nav>
  );
};

const NavLink = ({
  href,
  children,
  light,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      'text-[13px] font-medium uppercase tracking-widest transition-colors relative group py-2',
      light
        ? 'text-white/90 hover:text-white'
        : 'text-secondary/70 hover:text-primary',
    )}
  >
    {children}
    <span
      className={cn(
        'absolute bottom-0 left-0 w-full h-px scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300',
        light ? 'bg-white' : 'bg-primary',
      )}
    />
  </Link>
);
