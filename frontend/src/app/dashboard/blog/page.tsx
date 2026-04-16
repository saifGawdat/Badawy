"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Edit3,
  X,
  ImageIcon,
  ExternalLink,
  Copy,
} from "lucide-react";
import api, { getErrorMessage } from "@/lib/api";
import { compressImage } from "@/lib/compressImage";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface BlogPostMeta {
  _id: string;
  title: string;
  titleAr?: string;
  slug: string;
  excerpt: string;
  excerptAr?: string;
  featuredImage: string;
  published: boolean;
  publishedAt?: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  readingTimeMinutes?: number;
}

interface BlogPostFull extends BlogPostMeta {
  content: string;
  contentAr?: string;
}

const emptyForm = {
  title: "",
  titleAr: "",
  slug: "",
  excerpt: "",
  excerptAr: "",
  content: "",
  contentAr: "",
  metaTitle: "",
  metaDescription: "",
  published: false,
};

export default function DashboardBlogPage() {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [inlineUploading, setInlineUploading] = useState(false);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get<BlogPostMeta[]>("/blog/manage");
      setPosts(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load blog posts"));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFeaturedFile(null);
    setIsModalOpen(true);
  };

  const openEdit = async (id: string) => {
    try {
      const { data } = await api.get<BlogPostFull>(`/blog/manage/${id}`);
      setEditingId(id);
      setForm({
        title: data.title,
        titleAr: data.titleAr || "",
        slug: data.slug,
        excerpt: data.excerpt,
        excerptAr: data.excerptAr || "",
        content: data.content,
        contentAr: data.contentAr || "",
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        published: data.published,
      });
      setFeaturedFile(null);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load article"));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFeaturedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !featuredFile) {
      toast.error("Featured image is required for new articles");
      return;
    }

    setIsLoading(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("titleAr", form.titleAr);
    fd.append("slug", form.slug);
    fd.append("excerpt", form.excerpt);
    fd.append("excerptAr", form.excerptAr);
    fd.append("content", form.content);
    fd.append("contentAr", form.contentAr);
    fd.append("metaTitle", form.metaTitle);
    fd.append("metaDescription", form.metaDescription);
    fd.append("published", form.published ? "true" : "false");
    if (featuredFile) {
      try {
        fd.append("featuredImage", await compressImage(featuredFile));
      } catch {
        toast.error("Image compression failed");
        setIsLoading(false);
        return;
      }
    }

    try {
      if (editingId) {
        await api.put(`/blog/${editingId}`, fd);
        toast.success("Article updated");
      } else {
        await api.post("/blog", fd);
        toast.success("Article published to site");
      }
      closeModal();
      fetchPosts();
    } catch (error) {
      toast.error(getErrorMessage(error, editingId ? "Failed to update article" : "Failed to create article"));
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this article permanently?")) return;
    try {
      await api.delete(`/blog/${id}`);
      toast.success("Article removed");
      fetchPosts();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete article"));
    }
  };

  const uploadInlineImage = async (file: File | null) => {
    if (!file) return;
    setInlineUploading(true);
    const fd = new FormData();
    try {
      fd.append("image", await compressImage(file));
    } catch {
      toast.error("Image compression failed");
      setInlineUploading(false);
      return;
    }
    try {
      const { data } = await api.post<{ url: string }>("/blog/upload-image", fd);
      const md = `![${file.name.replace(/\.[^.]+$/, "")}](${data.url})`;
      await navigator.clipboard.writeText(md);
      toast.success("Markdown image copied — paste into content");
    } catch (error) {
      toast.error(getErrorMessage(error, "Image upload failed"));
    } finally {
      setInlineUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-serif text-secondary">Blog</h1>
          <p className="text-secondary/50 font-medium">
            Write articles in Markdown, add a cover image, and tune SEO fields.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="bg-primary text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New article</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <GlassCard key={post._id} className="p-6 flex flex-col sm:flex-row gap-6">
            <div className="relative w-full sm:w-40 h-28 rounded-xl overflow-hidden shrink-0 border border-secondary/10">
              <Image
                src={post.featuredImage}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-lg font-serif text-secondary truncate">
                  {post.title}
                </h3>
                <span
                  className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    post.published
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {post.published ? "Live" : "Draft"}
                </span>
              </div>
              <p className="text-xs text-secondary/45 font-mono mb-2">/{post.slug}</p>
              <p className="text-sm text-secondary/55 line-clamp-2">{post.excerpt}</p>
            </div>
            <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
              {post.published ? (
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg text-secondary/60 hover:bg-secondary/5 hover:text-primary transition-colors"
                  aria-label="View on site"
                >
                  <ExternalLink className="w-5 h-5" />
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => openEdit(post._id)}
                className="p-2 rounded-lg text-secondary/60 hover:bg-secondary/5 transition-colors"
                aria-label="Edit"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => deletePost(post._id)}
                className="p-2 rounded-lg text-red-600/70 hover:bg-red-50 transition-colors"
                aria-label="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {posts.length === 0 && (
        <GlassCard className="p-12 text-center text-secondary/40 border-dashed border-2 bg-transparent">
          No articles yet. Create one to appear on the public blog.
        </GlassCard>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6 py-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 bg-secondary/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-2xl max-h-[min(90vh,calc(100vh-5rem))] overflow-y-auto rounded-2xl"
              >
                <GlassCard className="p-8 bg-bone border-none shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif text-secondary">
                      {editingId ? "Edit article" : "New article"}
                    </h2>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-secondary/40 hover:text-secondary"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Title"
                        value={form.title}
                        onChange={(v) => setForm((f) => ({ ...f, title: v }))}
                        required
                      />
                      <Field
                        label="Title (Arabic)"
                        value={form.titleAr}
                        onChange={(v) => setForm((f) => ({ ...f, titleAr: v }))}
                      />
                    </div>
                    <Field
                      label="URL slug (optional)"
                      value={form.slug}
                      onChange={(v) => setForm((f) => ({ ...f, slug: v }))}
                      placeholder="auto-from-title"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
                          Excerpt
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={form.excerpt}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, excerpt: e.target.value }))
                          }
                          className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
                          Excerpt (Arabic)
                        </label>
                        <textarea
                          rows={2}
                          value={form.excerptAr}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, excerptAr: e.target.value }))
                          }
                          className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
                          Content (Markdown)
                        </label>
                        <label className="text-xs text-primary cursor-pointer hover:underline flex items-center gap-1">
                          <Copy className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={inlineUploading}
                            onChange={(e) => {
                              uploadInlineImage(e.target.files?.[0] || null);
                              e.target.value = "";
                            }}
                          />
                          {inlineUploading ? "Uploading…" : "Upload inline image"}
                        </label>
                      </div>
                      <textarea
                        required
                        rows={12}
                        value={form.content}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, content: e.target.value }))
                        }
                        placeholder="## Heading&#10;&#10;Paragraph with **bold** and [links](https://...)."
                        className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-sm font-mono text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
                        Content (Arabic, Markdown)
                      </label>
                      <textarea
                        rows={8}
                        value={form.contentAr}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, contentAr: e.target.value }))
                        }
                        className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-sm font-mono text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="SEO meta title"
                        value={form.metaTitle}
                        onChange={(v) => setForm((f) => ({ ...f, metaTitle: v }))}
                        placeholder="Optional — overrides browser title"
                      />
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
                          SEO meta description
                        </label>
                        <textarea
                          rows={2}
                          value={form.metaDescription}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              metaDescription: e.target.value,
                            }))
                          }
                          placeholder="Search result snippet (recommended 150–160 characters)"
                          className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
                        Featured image {editingId ? "(optional — leave empty to keep current)" : ""}
                      </label>
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          required={!editingId}
                          onChange={(e) =>
                            setFeaturedFile(e.target.files?.[0] || null)
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="bg-white/50 border border-dashed border-secondary/20 rounded-xl p-6 flex flex-col items-center justify-center text-secondary/40 group-hover:bg-white/80 transition-all">
                          <ImageIcon className="w-8 h-8 mb-2" />
                          <span className="text-sm font-medium">
                            {featuredFile
                              ? featuredFile.name
                              : editingId
                                ? "Replace cover image"
                                : "Select cover image"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.published}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, published: e.target.checked }))
                        }
                        className="rounded border-secondary/20 text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-secondary/80">
                        Published (visible on /blog)
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isLoading
                        ? "Saving…"
                        : editingId
                          ? "Save changes"
                          : "Create article"}
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

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
        {label}
      </label>
      <input
        type="text"
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
