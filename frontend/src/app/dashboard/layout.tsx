"use client";

import React, { useEffect } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bone">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bone overflow-hidden flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <header className="lg:hidden bg-secondary text-white p-4 flex items-center justify-between shadow-md z-30">
        <h1 className="text-xl font-serif tracking-widest text-primary">BADAWI</h1>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-white/70 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 relative">
        <div className="max-w-7xl mx-auto pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
