"use client";

import React from "react";
import { User, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { WizardState, WizardAction } from "./types";

interface StepPersonalInfoProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export const StepPersonalInfo = ({ state, dispatch }: StepPersonalInfoProps) => {
  const { isArabic } = useLanguage();

  const setField = (field: keyof Pick<WizardState, "fullName" | "email" | "phone">, value: string) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const isValid = state.fullName.trim().length > 0 && state.phone.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-serif text-secondary mb-2">
          {isArabic ? "معلوماتك الشخصية" : "Your Information"}
        </h3>
        <p className="text-secondary/50 text-sm">
          {isArabic ? "أدخلي بياناتك لبدء حجز الموعد" : "Enter your details to start booking"}
        </p>
      </div>

      <div className="space-y-5">
        {/* Full Name */}
        <div className="relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none">
            <User className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={state.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            placeholder={isArabic ? "الاسم الكامل" : "Full Name"}
            required
            className="w-full bg-transparent border-b-2 border-secondary/10 py-4 pr-10 focus:outline-none focus:border-primary transition-colors text-secondary placeholder:text-secondary/30 text-lg"
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none">
            <Phone className="w-5 h-5" />
          </div>
          <input
            type="tel"
            value={state.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder={isArabic ? "رقم الهاتف" : "Phone Number"}
            required
            className="w-full bg-transparent border-b-2 border-secondary/10 py-4 pr-10 focus:outline-none focus:border-primary transition-colors text-secondary placeholder:text-secondary/30 text-lg"
            dir="ltr"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="email"
            value={state.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder={isArabic ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}
            className="w-full bg-transparent border-b-2 border-secondary/10 py-4 pr-10 focus:outline-none focus:border-primary transition-colors text-secondary placeholder:text-secondary/30 text-lg"
          />
        </div>
      </div>

      {!isValid && (
        <p className="text-xs text-red-400 text-center">
          {isArabic ? "الاسم ورقم الهاتف مطلوبان" : "Name and phone are required"}
        </p>
      )}
    </div>
  );
};
