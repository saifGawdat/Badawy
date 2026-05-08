"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import api, { getErrorMessage } from '@/lib/api';
import { compressImage } from '@/lib/compressImage';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Comment {
  id: string;
  username: string;
  description: string;
  descriptionAr?: string;
  profilePhoto: string;
  createdAt: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);

  const fetchComments = async () => {
    try {
      const { data } = await api.get('/comments');
      setComments(data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load testimonials'));
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const resetForm = () => {
    setUsername('');
    setDescription('');
    setDescriptionAr('');
    setProfilePhotoFile(null);
    setEditingComment(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (comment: Comment) => {
    setEditingComment(comment);
    setUsername(comment.username);
    setDescription(comment.description);
    setDescriptionAr(comment.descriptionAr || '');
    setProfilePhotoFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment && !profilePhotoFile) {
      toast.error('Please upload a profile photo');
      return;
    }
    
    setIsLoading(true);
    let photoFile: File | null = null;
    if (profilePhotoFile) {
      try {
        photoFile = await compressImage(profilePhotoFile);
      } catch {
        toast.error('Image compression failed');
        setIsLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('description', description);
    formData.append('descriptionAr', descriptionAr);
    if (photoFile) formData.append('image', photoFile);

    try {
      if (editingComment) {
        await api.patch(`/comments/${editingComment.id}`, formData);
        toast.success('Testimonial updated');
      } else {
        await api.post('/comments', formData);
        toast.success('Testimonial added');
      }
      setIsModalOpen(false);
      resetForm();
      fetchComments();
    } catch (error) {
      toast.error(getErrorMessage(error, editingComment ? 'Failed to update testimonial' : 'Failed to add testimonial'));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(`/comments/${id}`);
      toast.success('Comment removed');
      fetchComments();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete comment'));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-secondary">Testimonials</h1>
          <p className="text-secondary/50 font-medium">Manage the &quot;fake&quot; reviews for your UI sections.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Testimonial</span>
        </button>
      </header>

      <div className="flex flex-col space-y-4">
        <AnimatePresence>
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-6 flex items-start space-x-6">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-bone border border-secondary/10">
                  <Image
                    src={comment.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                    alt={comment.username}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-serif text-secondary">{comment.username}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(comment)}
                        className="text-secondary/20 hover:text-primary transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteComment(comment.id)}
                        className="text-secondary/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-secondary/60 mt-1 italic">&ldquo;{comment.description}&rdquo;</p>
                  <p className="text-[10px] text-secondary/30 mt-3 uppercase tracking-widest">
                    Added on {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6 py-10">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg max-h-[min(90vh,calc(100vh-5rem))] overflow-y-auto rounded-2xl"
            >
              <GlassCard className="p-8 bg-bone border-none shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif text-secondary">
                    {editingComment ? "Edit Testimonial" : "Add Testimonial"}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-secondary/40 hover:text-secondary">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Username</label>
                    <input 
                      type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. Sarah J."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Testimonial Content</label>
                    <textarea 
                      required value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                      className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="What did they say?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Testimonial Content (Arabic)</label>
                    <textarea
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      rows={4}
                      className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="ماذا قالوا؟"
                    />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">
                      Profile Photo {editingComment && '(Optional)'}
                    </label>
                    <div className="relative group">
                      <input
                        type="file"
                        required={!editingComment}
                        onChange={(e) => setProfilePhotoFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="bg-white/50 border border-dashed border-secondary/20 rounded-xl p-6 flex flex-col items-center justify-center text-secondary/40 group-hover:bg-white/80 transition-all">
                        <Plus className="w-6 h-6 mb-2" />
                         <span className="text-sm font-medium">
                          {profilePhotoFile ? profilePhotoFile.name : editingComment ? "Keep current photo" : "Select Profile Image"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                     {isLoading ? "Saving..." : editingComment ? "Update Testimonial" : "Add to Live Site"}
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
