"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { WhatsAppBrandIcon } from "@/components/icons/WhatsAppBrandIcon";

export const WhatsAppButton = () => {
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get<{
          phone?: string;
          whatsappPhone?: string;
        }>("/site-settings");
        setPhone(
          (data.whatsappPhone || data.phone || "").trim()
        );
      } catch {
        setPhone("");
      }
    };
    fetchSettings();
  }, []);

  const whatsappHref = useMemo(() => {
    const clean = phone.replace(/\D/g, "");
    if (!clean) return "";
    return `https://wa.me/${clean}`;
  }, [phone]);

  if (!whatsappHref) return null;

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 end-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
    >
      <WhatsAppBrandIcon className="w-8 h-8" />
    </a>
  );
};
