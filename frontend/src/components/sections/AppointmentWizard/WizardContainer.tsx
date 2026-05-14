"use client";

import React, { useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { ProgressBar } from "./ProgressBar";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepProcedure } from "./StepProcedure";
import { StepSchedule } from "./StepSchedule";
import { StepConfirm } from "./StepConfirm";
import {
  wizardReducer,
  INITIAL_WIZARD_STATE,
  type WizardStep,
} from "./types";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};

export const WizardContainer = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const { isArabic } = useLanguage();
  const [state, dispatch] = useReducer(wizardReducer, INITIAL_WIZARD_STATE);
  const [[currentStep, direction], setDirection] = React.useState<[number, number]>([0, 0]);

  const totalSteps = 4;

  const goNext = () => {
    setDirection(([step]) => [step + 1, 1]);
    dispatch({ type: "GO_NEXT" });
  };

  const goBack = () => {
    setDirection(([step]) => [step - 1, -1]);
    dispatch({ type: "GO_BACK" });
  };

  const canGoNext = (): boolean => {
    switch (state.step) {
      case 1:
        return state.fullName.trim().length > 0 && state.phone.trim().length > 0;
      case 2:
        return state.procedureId !== null;
      case 3:
        return state.locationId !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    try {
      await api.post("/appointments", {
        fullName: state.fullName,
        email: state.email || "",
        phone: state.phone,
        procedure: state.procedureTitle,
        locationId: state.locationId,
        message: state.notes || "",
      });
      toast.success(
        isArabic
          ? "تم إرسال طلب الموعد بنجاح! سنتواصل معك قريباً."
          : "Appointment request sent successfully! We'll contact you soon."
      );
      dispatch({ type: "RESET" });
      setDirection([0, 0]);
      onSuccess?.();
    } catch {
      toast.error(
        isArabic
          ? "فشل إرسال الطلب. حاولي مرة أخرى."
          : "Failed to send request. Please try again."
      );
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  const renderStep = () => {
    const stepIndex = state.step - 1;
    return (
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={state.step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {state.step === 1 && (
            <StepPersonalInfo state={state} dispatch={dispatch} />
          )}
          {state.step === 2 && (
            <StepProcedure state={state} dispatch={dispatch} />
          )}
          {state.step === 3 && (
            <StepSchedule state={state} dispatch={dispatch} />
          )}
          {state.step === 4 && (
            <StepConfirm state={state} dispatch={dispatch} />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-10">
        <ProgressBar currentStep={state.step as WizardStep} totalSteps={totalSteps} />
      </div>

      {/* Step Content */}
      <div className="min-h-[320px]">{renderStep()}</div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-secondary/5">
        {/* Back */}
        <div>
          {state.step > 1 && (
            <button
              type="button"
              onClick={goBack}
              disabled={state.isSubmitting}
              className="inline-flex items-center gap-2 text-secondary/50 hover:text-secondary transition-colors text-sm font-medium"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-0 rotate-180" />
              {isArabic ? "السابق" : "Back"}
            </button>
          )}
        </div>

        {/* Next / Submit */}
        {state.step < totalSteps ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext()}
            className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-full font-medium transition-all hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-secondary/10"
          >
            {isArabic ? "التالي" : "Continue"}
            <ArrowLeft className="w-4 h-4 rtl:rotate-0 rotate-180" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={state.isSubmitting}
            className="inline-flex items-center gap-2 bg-primary text-white px-10 py-3.5 rounded-full font-bold uppercase tracking-wider text-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {state.isSubmitting
              ? isArabic
                ? "جارٍ الإرسال..."
                : "Sending..."
              : isArabic
              ? "تأكيد الحجز"
              : "Confirm Booking"}
          </button>
        )}
      </div>
    </div>
  );
};
