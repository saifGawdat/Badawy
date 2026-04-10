import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl",
        className
      )}
    >
      {children}
    </div>
  );
};
