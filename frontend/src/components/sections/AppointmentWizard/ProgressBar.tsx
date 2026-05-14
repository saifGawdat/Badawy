"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import type { WizardStep } from "./types";

interface ProgressBarProps {
  currentStep: WizardStep;
  totalSteps: number;
}

const stepLabels = {
  ar: ["المعلومات", "الإجراء", "الفرع", "التأكيد"],
  en: ["Info", "Procedure", "Branch", "Confirm"],
};

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const { isArabic } = useLanguage();
  const labels = isArabic ? stepLabels.ar : stepLabels.en;

  return (
    <div className="w-full" dir="ltr">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNumber = (idx + 1) as WizardStep;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={idx}>
              {/* Step dot */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                    isCompleted &&
                      "bg-primary text-white shadow-md shadow-primary/30",
                    isActive &&
                      "bg-secondary text-white shadow-md shadow-secondary/30 ring-2 ring-primary/30",
                    !isActive && !isCompleted &&
                      "bg-secondary/5 text-secondary/40 border border-secondary/10"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1.5 font-medium uppercase tracking-wider transition-colors",
                    isActive || isCompleted
                      ? "text-secondary"
                      : "text-secondary/30"
                  )}
                >
                  {labels[idx]}
                </span>
              </div>

              {/* Connector line */}
              {idx < totalSteps - 1 && (
                <div className="flex-1 mx-2 md:mx-4">
                  <div className="h-0.5 rounded-full bg-secondary/10 overflow-hidden">
                    <div
                      className={cn(
                        "h-full bg-primary transition-all duration-500",
                        stepNumber <= currentStep ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
