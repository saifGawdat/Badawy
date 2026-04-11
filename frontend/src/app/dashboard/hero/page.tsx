"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import api from "@/lib/api";
import { GlassCard } from "@/components/ui/GlassCard";

interface HeroSlide {
  _id: string;
  title: string;
  titleAr?: string;
  subtitle: string;
  subtitleAr?: string;
  ctaText: string;
  ctaTextAr?: string;
  imageUrl: string;
}

export default function HeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subtitleAr, setSubtitleAr] = useState("");
  const [ctaText, setCtaText] = useState("Read More");
  const [ctaTextAr, setCtaTextAr] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchSlides = async () => {
    try {
      const { data } = await api.get("/hero-slides");
      setSlides(data);
    } catch {
      toast.error("Failed to load hero slides");
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const resetForm = () => {
    setTitle("");
    setTitleAr("");
    setSubtitle("");
    setSubtitleAr("");
    setCtaText("Read More");
    setCtaTextAr("");
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload an image");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("titleAr", titleAr);
    formData.append("subtitle", subtitle);
    formData.append("subtitleAr", subtitleAr);
    formData.append("ctaText", ctaText);
    formData.append("ctaTextAr", ctaTextAr);
    formData.append("image", file);

    try {
      await api.post("/hero-slides", formData);
      toast.success("Hero slide added");
      setIsModalOpen(false);
      resetForm();
      fetchSlides();
    } catch {
      toast.error("Failed to add hero slide");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSlide = async (id: string) => {
    if (!confirm("Delete this hero slide?")) return;
    try {
      await api.delete(`/hero-slides/${id}`);
      toast.success("Slide removed");
      fetchSlides();
    } catch {
      toast.error("Failed to remove slide");
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-secondary">Hero Slider</h1>
          <p className="text-secondary/50 font-medium">Manage homepage hero slides and text.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Slide</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {slides.map((slide) => (
          <GlassCard key={slide._id} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-serif text-secondary">{slide.title}</h3>
              <p className="text-sm text-secondary/60 mt-2">{slide.subtitle}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-primary">{slide.ctaText}</span>
                <button
                  onClick={() => deleteSlide(slide._id)}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Delete hero slide"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl z-10"
            >
              <GlassCard className="p-8 bg-bone border-none shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif text-secondary">New Hero Slide</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-secondary/40 hover:text-secondary">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Title (Arabic)</label>
                    <input
                      type="text"
                      value={titleAr}
                      onChange={(e) => setTitleAr(e.target.value)}
                      className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Subtitle</label>
                    <textarea
                      required
                      rows={3}
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Subtitle (Arabic)</label>
                    <textarea
                      rows={3}
                      value={subtitleAr}
                      onChange={(e) => setSubtitleAr(e.target.value)}
                      className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Button Text</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Button Text (Arabic)</label>
                    <input
                      type="text"
                      value={ctaTextAr}
                      onChange={(e) => setCtaTextAr(e.target.value)}
                      className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Image</label>
                    <div className="relative group">
                      <input
                        type="file"
                        required
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="bg-white/50 border border-dashed border-secondary/20 rounded-xl p-6 flex flex-col items-center justify-center text-secondary/40 group-hover:bg-white/80 transition-all">
                        <ImageIcon className="w-7 h-7 mb-2" />
                        <span className="text-sm font-medium">{file ? file.name : "Select Image File"}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Uploading..." : "Publish Slide"}
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
