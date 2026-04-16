"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import api from "@/lib/api";
import { compressImage } from "@/lib/compressImage";
import { GlassCard } from "@/components/ui/GlassCard";

interface BeforeAfterCase {
  _id: string;
  title: string;
  titleAr?: string;
  beforeImageUrl: string;
  afterImageUrl: string;
}

export default function BeforeAfterPage() {
  const [cases, setCases] = useState<BeforeAfterCase[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);

  const fetchCases = async () => {
    try {
      const { data } = await api.get("/before-after");
      setCases(data);
    } catch {
      toast.error("Failed to load before/after cases");
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const resetForm = () => {
    setTitle("");
    setTitleAr("");
    setBeforeFile(null);
    setAfterFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeFile || !afterFile) {
      toast.error("Please upload both before and after images");
      return;
    }

    setIsLoading(true);
    let compressedBefore: File;
    let compressedAfter: File;
    try {
      [compressedBefore, compressedAfter] = await Promise.all([
        compressImage(beforeFile),
        compressImage(afterFile),
      ]);
    } catch {
      toast.error("Image compression failed");
      setIsLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("titleAr", titleAr);
    formData.append("beforeImage", compressedBefore);
    formData.append("afterImage", compressedAfter);

    try {
      await api.post("/before-after", formData);
      toast.success("Case added successfully");
      setIsModalOpen(false);
      resetForm();
      fetchCases();
    } catch {
      toast.error("Failed to add case");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCase = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case?")) return;
    try {
      await api.delete(`/before-after/${id}`);
      toast.success("Case removed");
      fetchCases();
    } catch {
      toast.error("Failed to delete case");
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-secondary">Before / After</h1>
          <p className="text-secondary/50 font-medium">
            Manage before and after photos shown on the landing page.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Case</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence>
          {cases.map((entry, index) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="relative aspect-4/3">
                    <Image src={entry.beforeImageUrl} alt={`${entry.title} before`} fill className="object-cover" />
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-black/60 text-white px-2 py-1 rounded">
                      Before
                    </span>
                  </div>
                  <div className="relative aspect-4/3">
                    <Image src={entry.afterImageUrl} alt={`${entry.title} after`} fill className="object-cover" />
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-black/60 text-white px-2 py-1 rounded">
                      After
                    </span>
                  </div>
                </div>
                <div className="p-5 flex justify-between items-center">
                  <h3 className="text-lg font-serif text-secondary">{entry.title}</h3>
                  <button
                    onClick={() => deleteCase(entry._id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Delete before and after case"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6 py-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative z-10 w-full max-w-xl max-h-[min(90vh,calc(100vh-5rem))] overflow-y-auto rounded-2xl"
            >
              <GlassCard className="p-8 bg-bone border-none shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif text-secondary">New Before / After Case</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-secondary/40 hover:text-secondary"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Rhinoplasty Case #1"
                      className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Title (Arabic)</label>
                    <input
                      type="text"
                      value={titleAr}
                      onChange={(e) => setTitleAr(e.target.value)}
                      placeholder="مثال: حالة تجميل أنف"
                      className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <UploadField label="Before Image" file={beforeFile} onSelect={setBeforeFile} />
                  <UploadField label="After Image" file={afterFile} onSelect={setAfterFile} />

                  <button
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Uploading..." : "Publish Case"}
                  </button>
                </form>
              </GlassCard>
            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadField({
  label,
  file,
  onSelect,
}: {
  label: string;
  file: File | null;
  onSelect: (file: File | null) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">{label}</label>
      <div className="relative group">
        <input
          type="file"
          required
          onChange={(e) => onSelect(e.target.files?.[0] || null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="bg-white/50 border border-dashed border-secondary/20 rounded-xl p-6 flex flex-col items-center justify-center text-secondary/40 group-hover:bg-white/80 transition-all">
          <ImageIcon className="w-7 h-7 mb-2" />
          <span className="text-sm font-medium">{file ? file.name : "Select Image File"}</span>
        </div>
      </div>
    </div>
  );
}
