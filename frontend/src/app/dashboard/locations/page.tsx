"use client";

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, MapPin, X, Phone, Clock } from 'lucide-react';
import api, { getErrorMessage } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Location {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  googleMapsUrl: string;
  phone: string;
  workingHours: string;
  workingHoursAr: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [address, setAddress] = useState('');
  const [addressAr, setAddressAr] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [workingHoursAr, setWorkingHoursAr] = useState('');

  const fetchLocations = async () => {
    try {
      const { data } = await api.get('/locations');
      setLocations(data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load locations'));
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const openAddModal = () => {
    setEditingLocation(null);
    setName('');
    setNameAr('');
    setAddress('');
    setAddressAr('');
    setGoogleMapsUrl('');
    setPhone('');
    setWorkingHours('');
    setWorkingHoursAr('');
    setIsModalOpen(true);
  };

  const openEditModal = (loc: Location) => {
    setEditingLocation(loc);
    setName(loc.name);
    setNameAr(loc.nameAr || '');
    setAddress(loc.address);
    setAddressAr(loc.addressAr || '');
    setGoogleMapsUrl(loc.googleMapsUrl);
    setPhone(loc.phone);
    setWorkingHours(loc.workingHours);
    setWorkingHoursAr(loc.workingHoursAr || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name,
      nameAr,
      address,
      addressAr,
      googleMapsUrl,
      phone,
      workingHours,
      workingHoursAr,
    };

    try {
      if (editingLocation) {
        await api.patch(`/locations/${editingLocation.id}`, payload);
        toast.success('Location updated successfully');
      } else {
        await api.post('/locations', payload);
        toast.success('Location added successfully');
      }
      setIsModalOpen(false);
      fetchLocations();
    } catch (error) {
      toast.error(getErrorMessage(error, editingLocation ? 'Failed to update location' : 'Failed to add location'));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLocation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      await api.delete(`/locations/${id}`);
      toast.success('Location removed');
      fetchLocations();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete location'));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-secondary">Clinic Locations</h1>
          <p className="text-secondary/50 font-medium">Manage your practice branches and contact details.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add New Branch</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {locations.map((loc, index) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="group relative h-full p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openEditModal(loc)}
                      className="p-2 text-secondary/40 hover:text-secondary hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => deleteLocation(loc.id)}
                      className="p-2 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-serif text-secondary mb-1">{loc.name}</h3>
                <p className="text-xs text-primary font-medium tracking-widest uppercase mb-4">{loc.nameAr}</p>
                
                <div className="space-y-3 flex-1">
                  <div className="flex items-start space-x-3 text-sm text-secondary/70">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{loc.address}</p>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-secondary/70">
                    <Phone className="w-4 h-4 shrink-0" />
                    <p>{loc.phone}</p>
                  </div>
                  <div className="flex items-start space-x-3 text-sm text-secondary/70">
                    <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="whitespace-pre-line">{loc.workingHours}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-secondary/5">
                  <a 
                    href={loc.googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-primary hover:underline flex items-center space-x-1"
                  >
                    <span>View on Google Maps</span>
                    <Plus className="w-3 h-3 rotate-45" />
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
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
              className="relative z-10 w-full max-w-2xl rounded-2xl"
            >
              <GlassCard className="p-8 bg-bone border-none shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif text-secondary">{editingLocation ? 'Edit Branch' : 'New Branch'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-secondary/40 hover:text-secondary">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Branch Name</label>
                      <input 
                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Branch Name (Arabic)</label>
                      <input
                        type="text" required value={nameAr} onChange={(e) => setNameAr(e.target.value)}
                        className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Address</label>
                      <input 
                        type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Address (Arabic)</label>
                      <input
                        type="text" required value={addressAr} onChange={(e) => setAddressAr(e.target.value)}
                        className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Phone Number</label>
                      <input 
                        type="text" required value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Google Maps URL</label>
                      <input 
                        type="url" required value={googleMapsUrl} onChange={(e) => setGoogleMapsUrl(e.target.value)}
                        placeholder="https://goo.gl/maps/..."
                        className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Working Hours</label>
                      <textarea 
                        required value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} rows={4}
                        className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-secondary/60 ml-1">Working Hours (Arabic)</label>
                      <textarea
                        required value={workingHoursAr} onChange={(e) => setWorkingHoursAr(e.target.value)} rows={4}
                        className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-4 rounded-xl font-medium shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : editingLocation ? "Update Branch" : "Add Branch"}
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
