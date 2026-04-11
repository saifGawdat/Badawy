"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/ui/StatCard';
import { Image as ImageIcon, MessageSquare, Plus, Activity, Globe } from 'lucide-react';
import api from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';

export default function DashboardHome() {
  const [stats, setStats] = useState({ items: 0, comments: 0, visits: 0, uniqueVisitors: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [items, comments, visitStats] = await Promise.all([
          api.get('/items'),
          api.get('/comments'),
          api.get('/visits/stats'),
        ]);
        setStats({
          items: items.data.length,
          comments: comments.data.length,
          visits: visitStats.data.total,
          uniqueVisitors: visitStats.data.uniqueVisitors,
        });
      } catch (error) {
        console.error('Failed to fetch stats');
        console.log(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif text-secondary mb-2">Welcome Home</h1>
          <p className="text-secondary/50 font-medium tracking-tight">Here&apos;s what&apos;s happening at Dr. Badawy&apos;s clinic today.</p>
        </div>
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 bg-secondary text-white px-5 py-2.5 rounded-xl hover:bg-secondary/90 transition-all font-medium text-sm">
            <Activity className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard label="Total Service Items" value={stats.items} icon={ImageIcon} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard label="Live Testimonials" value={stats.comments} icon={MessageSquare} color="primary" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard label="Site visits" value={stats.visits} icon={Globe} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <StatCard label="Unique visitor IPs" value={stats.uniqueVisitors} icon={Globe} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-4 md:col-span-2">
          <GlassCard className="p-6 bg-primary text-white border-none flex flex-col justify-between h-full group cursor-pointer">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/70 mb-1">Quick Action</p>
              <h3 className="text-2xl font-serif">Add New Service</h3>
            </div>
            <div className="mt-4 flex justify-end">
              <div className="bg-white text-primary p-2 rounded-xl group-hover:rotate-90 transition-transform duration-500">
                <Plus className="w-6 h-6" />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-serif text-secondary mb-6">Recent Activity</h2>
        <GlassCard className="p-8 flex flex-col items-center justify-center text-secondary/40 h-64 border-dashed border-2 bg-transparent">
          <Activity className="w-12 h-12 mb-4 opacity-20" />
          <p className="font-medium">No recent activity detected.</p>
        </GlassCard>
      </section>
    </div>
  );
}
