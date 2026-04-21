"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Image as ImageIcon, MessageSquare, LogOut, Images, SlidersHorizontal, CalendarCheck2, Settings, Globe, Newspaper, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'About Section', href: '/dashboard/about', icon: ImageIcon },
  { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarCheck2 },
  { name: 'Visits', href: '/dashboard/visits', icon: Globe },
  { name: 'Hero Slider', href: '/dashboard/hero', icon: SlidersHorizontal },
  { name: 'Items', href: '/dashboard/items', icon: ImageIcon },
  { name: 'Before & After', href: '/dashboard/before-after', icon: Images },
  { name: 'Comments', href: '/dashboard/comments', icon: MessageSquare },
  { name: 'Blog', href: '/dashboard/blog', icon: Newspaper },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-secondary text-white flex flex-col shadow-2xl transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif tracking-widest text-primary drop-shadow-sm">
              BADAWI
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">
              Admin Portal
            </p>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "hover:bg-white/10 text-white/70 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-white/40 group-hover:text-white")} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl transition-all duration-300 text-white/50 hover:text-white hover:bg-red-500/20 group"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
