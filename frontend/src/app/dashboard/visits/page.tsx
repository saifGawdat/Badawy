"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api";

interface Visit {
  _id: string;
  ip: string;
  path: string;
  userAgent: string;
  createdAt: string;
}

interface VisitStats {
  total: number;
  uniqueVisitors: number;
}

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [stats, setStats] = useState<VisitStats | null>(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitsRes, statsRes] = await Promise.all([
          api.get<Visit[]>("/visits"),
          api.get<VisitStats>("/visits/stats"),
        ]);
        setVisits(visitsRes.data);
        setStats(statsRes.data);
      } catch {
        toast.error("Failed to load visits");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-serif text-secondary">Site visits</h1>
        <p className="text-secondary/50 font-medium">
          Logged when someone opens the public site (once per browser session). IP is captured from the server request.
        </p>
      </header>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          <GlassCard className="p-6">
            <p className="text-[10px] uppercase tracking-widest text-secondary/50 mb-1">
              Total visits
            </p>
            <p className="text-3xl font-serif text-secondary">{stats.total}</p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-[10px] uppercase tracking-widest text-secondary/50 mb-1">
              Unique IPs
            </p>
            <p className="text-3xl font-serif text-secondary">
              {stats.uniqueVisitors}
            </p>
          </GlassCard>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-serif text-secondary">Recent visits</h2>
        {visits.length === 0 ? (
          <GlassCard className="p-12 flex flex-col items-center justify-center text-secondary/40 border-dashed border-2 bg-transparent">
            <Globe className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-medium">No visits recorded yet.</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {visits.map((v) => (
              <GlassCard key={v._id} className="p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-sm text-secondary">
                    {v.ip}
                  </span>
                  <time
                    className="text-xs text-secondary/50"
                    dateTime={v.createdAt}
                  >
                    {new Date(v.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className="text-xs text-primary mt-2 font-medium truncate">
                  {v.path || "/"}
                </p>
                {v.userAgent ? (
                  <p className="text-xs text-secondary/45 mt-2 line-clamp-2">
                    {v.userAgent}
                  </p>
                ) : null}
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
