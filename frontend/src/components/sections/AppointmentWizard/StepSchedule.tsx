"use client";

import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import api from "@/lib/api";
import type { WizardState, WizardAction, LocationOption } from "./types";

interface StepScheduleProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export const StepSchedule = ({ state, dispatch }: StepScheduleProps) => {
  const { isArabic } = useLanguage();
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await api.get("/locations");
        setLocations(data);
      } catch {
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const setField = (field: keyof Pick<WizardState, "locationId" | "locationName">, value: string) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const handleLocationSelect = (loc: LocationOption) => {
    setField("locationId", loc.id);
    setField("locationName", loc.name);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-serif text-secondary mb-2">
          {isArabic ? "اختيار الفرع" : "Choose Branch"}
        </h3>
        <p className="text-secondary/50 text-sm">
          {isArabic
            ? "اختاري الفرع الأقرب إليك وسيتم تحديد الموعد من قبل الطبيب"
            : "Select your nearest branch — the appointment time will be set by the doctor"}
        </p>
      </div>

      {/* Branch Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/60">
            {isArabic ? "الفرع" : "Branch"}
          </h4>
        </div>

        {locations.length === 0 && (
          <p className="text-secondary/40 text-sm text-center py-4">
            {isArabic ? "لا توجد فروع متاحة" : "No branches available"}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {locations.map((loc) => {
            const isSelected = state.locationId === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleLocationSelect(loc)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-start",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-secondary/5 bg-white hover:border-primary/30"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "border-primary" : "border-secondary/20"
                  )}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <div>
                  <p className="font-medium text-secondary text-sm">
                    {isArabic && loc.nameAr ? loc.nameAr : loc.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info message */}
      <div className="bg-primary/5 rounded-xl p-4 text-center">
        <p className="text-xs text-primary/70 font-medium">
          {isArabic
            ? "📅 سيتم تحديد موعد زيارتك من قبل فريق الطبيب بعد مراجعة الطلب"
            : "📅 Your appointment time will be scheduled by the doctor's team after reviewing your request"}
        </p>
      </div>
    </div>
  );
};
