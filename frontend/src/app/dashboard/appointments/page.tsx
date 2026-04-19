"use client";

import { useEffect, useState } from "react";
import { Trash2, Phone, Mail, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api";

interface Appointment {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  procedure: string;
  message: string;
  status: "new" | "contacted";
  createdAt: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/appointments");
      setAppointments(data);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/appointments");
        setAppointments(data);
      } catch {
        toast.error("Failed to load appointments");
      }
    };
    load();
  }, []);

  const deleteAppointment = async (id: string) => {
    if (!confirm("Delete this appointment request?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Appointment removed");
      fetchAppointments();
    } catch {
      toast.error("Failed to remove appointment");
    }
  };

  const toggleStatus = async (appointment: Appointment) => {
    const nextStatus = appointment.status === "new" ? "contacted" : "new";
    try {
      await api.patch(`/appointments/${appointment.id}/status`, { status: nextStatus });
      toast.success(nextStatus === "contacted" ? "Marked as contacted" : "Marked as new");
      fetchAppointments();
    } catch {
      toast.error("Failed to update appointment status");
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-serif text-secondary">Appointments</h1>
        <p className="text-secondary/50 font-medium">
          New requests from the website appointment form.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {appointments.map((appointment) => (
          <GlassCard key={appointment.id} className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-serif text-secondary">{appointment.fullName}</h3>
                <p className="text-xs uppercase tracking-widest text-primary mt-1">
                  {appointment.procedure}
                </p>
                <span
                  className={`inline-flex mt-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest ${
                    appointment.status === "contacted"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(appointment)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    appointment.status === "contacted"
                      ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                      : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {appointment.status === "contacted" ? "Mark New" : "Mark Contacted"}
                </button>
                <button
                  onClick={() => deleteAppointment(appointment.id)}
                  className="text-secondary/30 hover:text-red-600 transition-colors"
                  aria-label="Delete appointment"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm text-secondary/70">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                {appointment.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                {appointment.phone}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                {new Date(appointment.createdAt).toLocaleString()}
              </p>
            </div>

            {appointment.message ? (
              <div className="mt-5 border-t border-secondary/10 pt-4">
                <p className="text-sm text-secondary/60 italic">{appointment.message}</p>
              </div>
            ) : null}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
