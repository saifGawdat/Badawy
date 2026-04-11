"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Phone, ArrowRight, Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h1
              className={cn(
                "text-lg font-serif tracking-widest transition-colors",
                isScrolled ? "text-secondary" : "text-secondary",
              )}
            >
              DR.MOSTAFA BADAWY
            </h1>
            <p className="text-[8px] uppercase tracking-[0.4em] text-primary font-medium">
              Plastic Surgeon
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-10">
          <NavLink href="#home">{t('nav.home')}</NavLink>
          <NavLink href="#about">{t('nav.about')}</NavLink>
          <NavLink href="#services">{t('nav.services')}</NavLink>
          <NavLink href="/blog">{t('nav.blog')}</NavLink>
          <NavLink href="#contacts">{t('nav.contacts')}</NavLink>
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center space-x-8">
          <button
            type="button"
            onClick={toggleLanguage}
            className="text-xs font-semibold tracking-widest border border-secondary/20 rounded-full px-3 py-1.5 hover:border-primary hover:text-primary transition-colors"
          >
            {language === 'en' ? 'AR' : 'EN'}
          </button>
          <div className="flex items-center space-x-2 text-secondary/70 hover:text-primary transition-colors cursor-pointer group">
            <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium tracking-wide">
              2-583-018-36-28
            </span>
          </div>
          <button className="bg-primary hover:bg-gold-dark text-white px-8 py-3 rounded-full text-sm font-medium transition-all transform hover:scale-105 shadow-lg shadow-primary/20 flex items-center space-x-2 group">
            <a href="#contacts">
              <span>{t('nav.bookNow')}</span>
            </a>

            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-secondary p-2"
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
          className="text-lg font-semibold tracking-wider border border-secondary/20 rounded-full px-6 py-2"
        >
          {language === 'en' ? 'AR' : 'EN'}
        </button>
        <div className="flex items-center space-x-4 text-secondary/60 pt-8 border-t border-secondary/5 w-64 justify-center">
          <Phone className="w-5 h-5" />
          <span className="text-lg">2-583-018-36-28</span>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="text-[13px] font-medium uppercase tracking-widest text-secondary/70 hover:text-primary transition-colors relative group py-2"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300" />
  </Link>
);
