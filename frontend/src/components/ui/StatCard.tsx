import React from 'react';
import { GlassCard } from './GlassCard';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color = "primary" }) => {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-secondary/60 mb-1">{label}</p>
          <h3 className="text-3xl font-serif text-secondary">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl bg-${color}/10 text-${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </GlassCard>
  );
};
