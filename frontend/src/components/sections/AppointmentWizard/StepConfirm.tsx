"use client";

import React from "react";
import { User, Phone, Mail, Scissors, MapPin, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { WizardState, WizardAction } from "./types";

interface StepConfirmProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export const StepConfirm = ({ state, dispatch }: StepConfirmProps) => {
  const { isArabic } = useLanguage();

  const setField = (field: "notes", value: string) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const summaryItems = [
    {
      icon: User,
      label: isArabic ? "الاسم" : "Name",
      value: state.fullName,
    },
    {
      icon: Phone,
      label: isArabic ? "الهاتف" : "Phone",
      value: state.phone,
    },
    ...(state.email
      ? [
          {
            icon: Mail,
            label: isArabic ? "البريد" : "Email",
            value: state.email,
          },
        ]
      : []),
    {
      icon: Scissors,
      label: isArabic ? "الإجراء" : "Procedure",
      value: state.procedureTitle,
    },
    {
      icon: MapPin,
      label: isArabic ? "الفرع" : "Branch",
      value: state.locationName,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-serif text-secondary mb-2">
          {isArabic ? "مراجعة الطلب" : "Review Your Request"}
        </h3>
        <p className="text-secondary/50 text-sm">
          {isArabic ? "تأكدي من صحة المعلومات قبل الإرسال" : "Please review your information before submitting"}
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-secondary/5 rounded-2xl p-6 space-y-4 divide-y divide-secondary/5">
        {summaryItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 pt-4 first:pt-0">
            <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
              <item.icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-bold tracking-widest text-secondary/40">
                {item.label}
              </p>
              <p className="text-secondary font-medium truncate">
                {item.value}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const stepMap: Record<string, number> = {
                  Name: 1, Phone: 1, Email: 1,
                  Procedure: 2,
                  Branch: 3,
                };
                const goTo = stepMap[item.label.replace(/^.{0}/, (c) => c)] || 1;
                dispatch({ type: "SET_STEP", payload: goTo as 1 | 2 | 3 });
              }}
              className="text-[10px] uppercase font-bold tracking-widest text-primary hover:text-primary/70 transition-colors shrink-0"
              title={isArabic ? "تعديل" : "Edit"}
            >
              {isArabic ? "تعديل" : "Edit"}
            </button>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/60">
            {isArabic ? "ملاحظات إضافية (اختياري)" : "Additional Notes (Optional)"}
          </h4>
        </div>
        <textarea
          rows={3}
          value={state.notes}
          onChange={(e) => setField("notes", e.target.value)}
          placeholder={
            isArabic
              ? "أخبرينا عن أهدافك أو استفساراتك..."
              : "Tell us about your goals or questions..."
          }
          className="w-full bg-white border-2 border-secondary/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary transition-colors resize-none text-secondary placeholder:text-secondary/20"
        />
      </div>
    </div>
  );
};
