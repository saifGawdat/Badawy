"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api";

export default function SettingsPage() {
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/site-settings");
      setWhatsappPhone(data.whatsappPhone || "");
    } catch {
      toast.error("Failed to load settings");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.patch("/site-settings", { whatsappPhone });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-serif text-secondary">Site Settings</h1>
        <p className="text-secondary/50 font-medium">
          Configure global contact settings used on the landing page.
        </p>
      </header>

      <GlassCard className="p-8 max-w-2xl">
        <form onSubmit={saveSettings} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
              WhatsApp Phone Number
            </label>
            <input
              type="text"
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              placeholder="e.g. +201234567890"
              className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-[11px] text-secondary/40">
              Include country code. Spaces and symbols are allowed.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
