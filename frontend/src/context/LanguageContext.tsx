"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";

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
      home: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©",
      about: "Ù…Ù† Ù†Ø­Ù†",
      services: "Ø§Ù„Ø®Ø¯Ù…Ø§Øª",
      blog: "Ø§Ù„Ù…Ø¯ÙˆÙ†Ø©",
      contacts: "Ø§Ù„ØªÙˆØ§ØµÙ„",
      bookNow: "Ø§Ø­Ø¬Ø² Ø§Ù„Ø¢Ù†",
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

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getSnapshot = () => {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("language");
  return saved === "ar" || saved === "en" ? (saved as Language) : "en";
};

const getServerSnapshot = () => "en" as const;

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setInternalLanguage] = useState<Language>("en");

  // We still need a way to set the language manually
  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    setInternalLanguage(lang); // Trigger re-render
    // Dispatch a storage event so useSyncExternalStore updates in this window
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
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
      toggleLanguage: () => setLanguage(language === "en" ? "ar" : "en"),
      t,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback for build-time rendering or error states
    return {
      language: "en" as const,
      isArabic: false,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string) => key,
    };
  }
  return context;
};
