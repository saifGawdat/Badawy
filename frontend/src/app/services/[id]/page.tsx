"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";
import api from "@/lib/api";

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function ServiceDetailsPage() {
  const params = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!params?.id) {
          setIsLoading(false);
          return;
        }
        const { data } = await api.get(`/items/${params.id}`);
        setService(data);
      } catch {
        setService(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="max-w-6xl mx-auto px-6 text-secondary/70">Loading service details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 text-sm text-secondary/70 hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>
            <h1 className="text-3xl font-serif text-secondary">Service not found.</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-sm text-secondary/70 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="relative w-full aspect-4/5 rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="pt-2">
              <p className="font-script text-primary text-3xl italic mb-3">service details</p>
              <h1 className="text-4xl md:text-5xl font-serif text-secondary leading-tight mb-6">
                {service.title}
              </h1>
              <div className="w-16 h-[2px] bg-primary mb-6" />
              <p className="text-secondary/80 text-lg leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
