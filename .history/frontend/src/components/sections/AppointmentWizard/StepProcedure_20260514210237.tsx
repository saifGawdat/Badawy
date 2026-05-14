"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import api from "@/lib/api";
import type { WizardState, WizardAction, ServiceItem } from "./types";

interface StepProcedureProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export const StepProcedure = ({ state, dispatch }: StepProcedureProps) => {
  const { isArabic } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const consultationCard: ServiceItem = {
    id: "general-consultation",
    title: "General Consultation",
    titleAr: "استشارة عامة",
    description: "",
    descriptionAr: "",
    imageUrl: "",
  };

  const displayServices = [consultationCard, ...services];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get("/items");
        setServices(data);
      } catch {
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleSelect = (service: ServiceItem) => {
    const procedureTitle = isArabic && service.titleAr ? service.titleAr : service.title;
    dispatch({ type: "SET_FIELD", field: "procedureId", value: service.id });
    dispatch({
      type: "SET_FIELD",
      field: "procedureTitle",
      value: procedureTitle,
    });
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
      <div className="text-center mb-6">
        <h3 className="text-2xl font-serif text-secondary mb-2">
          {isArabic ? "اختاري الإجراء" : "Select Procedure"}
        </h3>
        <p className="text-secondary/50 text-sm">
          {isArabic ? "اختاري نوع العملية التي ترغبين فيها" : "Choose the procedure you're interested in"}
        </p>
      </div>

      {displayServices.length === 0 && (
        <div className="text-center py-10 text-secondary/40">
          <p>{isArabic ? "لا توجد خدمات متاحة حالياً" : "No services available at the moment"}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayServices.map((service) => {
          const isSelected = state.procedureId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => handleSelect(service)}
              className={cn(
                "relative group rounded-2xl overflow-hidden aspect-[3/4] border-2 transition-all duration-300 text-start",
                isSelected
                  ? "border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20"
                  : "border-secondary/5 hover:border-primary/30 hover:shadow-md"
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-cover bg-center transition-all duration-500",
                  !service.imageUrl && "bg-gradient-to-br from-secondary/20 via-secondary/10 to-white"
                )}
                style={service.imageUrl ? { backgroundImage: `url(${service.imageUrl})` } : undefined}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {isSelected && (
                <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1.5 shadow-lg">
                  <Check className="w-4 h-4" />
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-serif text-sm md:text-base leading-tight">
                  {isArabic && service.titleAr ? service.titleAr : service.title}
                </h4>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
