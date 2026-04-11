"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import api from "@/lib/api";

export const WhatsAppButton = () => {
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/site-settings");
        setPhone(data.whatsappPhone || "");
      } catch {
        setPhone("");
      }
    };
    fetchSettings();
  }, []);

  const whatsappHref = useMemo(() => {
    const clean = phone.replace(/[^\d]/g, "");
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
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};
