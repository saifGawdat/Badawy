"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api";
import { compressImage } from "@/lib/compressImage";

export default function AboutManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    quoteEn: "",
    quoteAr: "",
    drNameEn: "",
    drNameAr: "",
    drTitleEn: "",
    drTitleAr: "",
    stat1Value: "",
    stat1LabelEn: "",
    stat1LabelAr: "",
    stat2Value: "",
    stat2LabelEn: "",
    stat2LabelAr: "",
  });
  
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data } = await api.get("/about");
      if (data) {
        setFormData({
          quoteEn: data.quoteEn || "",
          quoteAr: data.quoteAr || "",
          drNameEn: data.drNameEn || "",
          drNameAr: data.drNameAr || "",
          drTitleEn: data.drTitleEn || "",
          drTitleAr: data.drTitleAr || "",
          stat1Value: data.stat1Value || "",
          stat1LabelEn: data.stat1LabelEn || "",
          stat1LabelAr: data.stat1LabelAr || "",
          stat2Value: data.stat2Value || "",
          stat2LabelEn: data.stat2LabelEn || "",
          stat2LabelAr: data.stat2LabelAr || "",
        });
        setCurrentImageUrl(data.imageUrl || "");
      }
    } catch {
      toast.error("Failed to load about data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
      
      if (file) {
        const compressed = await compressImage(file);
        payload.append("image", compressed);
      }
      
      const { data } = await api.patch("/about", payload);
      toast.success("About section updated successfully");
      setCurrentImageUrl(data.imageUrl || currentImageUrl);
      setFile(null);
      setPreviewUrl("");
    } catch {
      toast.error("Failed to update about section");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-serif text-secondary">About Section Management</h1>
        <p className="text-secondary/50 font-medium">
          Modify the "About Dr. Badawi" section on the landing page.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Content Card */}
          <GlassCard className="p-8 space-y-6">
            <h2 className="text-xl font-serif text-secondary border-b border-secondary/10 pb-4">Profile Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary/60">Doctor Name (EN)</label>
                <input
                  type="text"
                  name="drNameEn"
                  value={formData.drNameEn}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary/60 text-right block">الإسم (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  name="drNameAr"
                  value={formData.drNameAr}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary/60">Title (EN)</label>
                <input
                  type="text"
                  name="drTitleEn"
                  value={formData.drTitleEn}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary/60 text-right block">المسمى الوظيفي (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  name="drTitleAr"
                  value={formData.drTitleAr}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-secondary/60">Quote (EN)</label>
              <textarea
                name="quoteEn"
                rows={4}
                value={formData.quoteEn}
                onChange={handleInputChange}
                className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-secondary/60 text-right block">الإقتباس (AR)</label>
              <textarea
                name="quoteAr"
                dir="rtl"
                rows={4}
                value={formData.quoteAr}
                onChange={handleInputChange}
                className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </GlassCard>

          {/* Statistics Card */}
          <GlassCard className="p-8 space-y-6">
            <h2 className="text-xl font-serif text-secondary border-b border-secondary/10 pb-4">Statistics</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary/60">Stat 1 Value</label>
                <input
                  type="text"
                  name="stat1Value"
                  value={formData.stat1Value}
                  onChange={handleInputChange}
                  placeholder="e.g. 95%"
                  className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary/60">Stat 1 Label (EN)</label>
                <input
                  type="text"
                  name="stat1LabelEn"
                  value={formData.stat1LabelEn}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary/60 text-right block">Stat 1 Label (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  name="stat1LabelAr"
                  value={formData.stat1LabelAr}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary/60">Stat 2 Value</label>
                <input
                  type="text"
                  name="stat2Value"
                  value={formData.stat2Value}
                  onChange={handleInputChange}
                  placeholder="e.g. 15k+"
                  className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary/60">Stat 2 Label (EN)</label>
                <input
                  type="text"
                  name="stat2LabelEn"
                  value={formData.stat2LabelEn}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary/60 text-right block">Stat 2 Label (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  name="stat2LabelAr"
                  value={formData.stat2LabelAr}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-8">
          {/* Image Upload Card */}
          <GlassCard className="p-8 space-y-6">
            <h2 className="text-xl font-serif text-secondary border-b border-secondary/10 pb-4">Profile Image</h2>
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-secondary/5 border border-secondary/10 group">
              {(previewUrl || currentImageUrl) ? (
                <Image 
                  src={previewUrl || currentImageUrl} 
                  alt="Preview" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary/30">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span className="text-xs uppercase tracking-widest font-medium">No Image Selected</span>
                </div>
              )}
              
              <label className="absolute inset-0 z-10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/60 flex items-center justify-center text-white text-sm font-medium backdrop-blur-sm">
                Change Image
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <p className="text-[11px] text-secondary/40 leading-relaxed">
              Recommended: Portraits with enough background for cropping. Reuses Cloudinary for hosting.
            </p>
          </GlassCard>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-primary text-white p-4 rounded-xl font-medium shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? "Saving Changes..." : "Save About Section"}
          </button>
        </div>
      </form>
    </div>
  );
}
