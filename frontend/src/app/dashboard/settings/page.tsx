"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api";

export default function SettingsPage() {
  const [phone, setPhone] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [location, setLocation] = useState("");
  const [locationAr, setLocationAr] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/site-settings");
      setPhone(data.phone || "");
      setWhatsappPhone(data.whatsappPhone || "");
      setLocation(data.location || "");
      setLocationAr(data.locationAr || "");
      setFacebookUrl(data.facebookUrl || "");
      setInstagramUrl(data.instagramUrl || "");
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
      await api.patch("/site-settings", { phone, whatsappPhone, location, locationAr, facebookUrl, instagramUrl });
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
              Phone number (navbar &amp; call link)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +20 2 583 018 3628"
              className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-[11px] text-secondary/40">
              Shown in the header and used for tel: links. Include country code.
            </p>
          </div>

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

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
              Location (English)
            </label>
            <textarea
              rows={2}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Tanta, El Bahr Street, near El-Galaa Mall"
              className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
              Location (Arabic)
            </label>
            <textarea
              rows={2}
              value={locationAr}
              onChange={(e) => setLocationAr(e.target.value)}
              placeholder="مثال: طنطا، شارع البحر..."
              className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-[11px] text-secondary/40">
              Shown in the footer and appointment section when Arabic is selected.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
              Facebook URL
            </label>
            <input
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="e.g. https://facebook.com/yourpage"
              className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
              Instagram URL
            </label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="e.g. https://instagram.com/yourpage"
              className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
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
