"use client";

import { useLanguage } from "@/context/LanguageContext";

/** Visible, crawlable copy for local SEO (Cairo / Tanta / Egypt) — bilingual */
export function LocalSeoIntro() {
  const { isArabic } = useLanguage();

  return (
    <div className="border-b border-secondary/10 bg-bone/40">
      <p className="mx-auto max-w-3xl px-6 py-3 text-center text-sm leading-relaxed text-secondary/75">
        {isArabic ? (
          <>
            لو بتدور على{" "}
            <strong className="font-semibold text-secondary/90">أشطر دكتور تجميل في طنطا</strong>
            {" "}أو القاهرة — د. مصطفى بدوي جراح تجميل يستقبل مرضاه في{" "}
            <strong className="font-semibold text-secondary/90">طنطا</strong> و
            <strong className="font-semibold text-secondary/90"> القاهرة</strong> وفي أنحاء{" "}
            <strong className="font-semibold text-secondary/90">مصر</strong>، بتركيز على نتائج
            طبيعية وخطة علاج واضحة لكل مريض.
          </>
        ) : (
          <>
            Dr. Mostafa Badawi is a plastic and aesthetic surgeon consulting patients in{" "}
            <strong className="font-semibold text-secondary/90">Cairo</strong>,{" "}
            <strong className="font-semibold text-secondary/90">Tanta</strong>, and across{" "}
            <strong className="font-semibold text-secondary/90">Egypt</strong>, focused on
            natural-looking results and personalized care.
          </>
        )}
      </p>
    </div>
  );
}
