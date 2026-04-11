"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "ar";

const dictionary = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      blog: "Blog",
      contacts: "Contacts",
      bookNow: "Book now",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "الخدمات",
      blog: "المدونة",
      contacts: "التواصل",
      bookNow: "احجز الآن",
    },
  },
} as const;

interface LanguageContextValue {
  language: Language;
  isArabic: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null;
    if (saved === "ar" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const t = (key: string) => {
      const parts = key.split(".");
      let current: unknown = dictionary[language];
      for (const part of parts) {
        if (!current || typeof current !== "object") return key;
        current = (current as Record<string, unknown>)[part];
      }
      return typeof current === "string" ? current : key;
    };

    return {
      language,
      isArabic: language === "ar",
      setLanguage,
      toggleLanguage: () => setLanguage((prev) => (prev === "en" ? "ar" : "en")),
      t,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
