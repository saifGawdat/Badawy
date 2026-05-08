"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import api from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

interface ServiceItem {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  imageUrl: string;
}

interface Props {
  id: string;
  initialService: ServiceItem | null;
}

export function ServiceDetailsClient({ id, initialService }: Props) {
  const { isArabic } = useLanguage();
  const [service, setService] = useState<ServiceItem | null>(initialService);
  const [isLoading, setIsLoading] = useState(!initialService);

  useEffect(() => {
    if (initialService) return;
    const fetchService = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setService(data);
      } catch {
        setService(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [id, initialService]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <main className="pt-28 pb-20" aria-label="Service details loading">
          <div className="max-w-6xl mx-auto px-6 text-secondary/70">
            {isArabic ? "جار التحميل..." : "Loading service details..."}
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
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
              aria-label={isArabic ? "العودة للخدمات" : "Back to Services"}
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              {isArabic ? "العودة للخدمات" : "Back to Services"}
            </Link>
            <h1 className="text-3xl font-serif text-secondary">
              {isArabic ? "الخدمة غير موجودة." : "Service not found."}
            </h1>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  const displayTitle = isArabic && service.titleAr ? service.titleAr : service.title;
  const displayDesc = isArabic && service.descriptionAr ? service.descriptionAr : service.description;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20" aria-labelledby="service-title">
        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumb nav */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-secondary/60" role="list">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  {isArabic ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#services" className="hover:text-primary transition-colors">
                  {isArabic ? "الخدمات" : "Services"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-secondary font-medium" aria-current="page">
                {displayTitle}
              </li>
            </ol>
          </nav>

          <article className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Service image */}
            <figure className="relative w-full aspect-4/5 rounded-3xl overflow-hidden shadow-xl m-0">
              <Image
                src={service.imageUrl}
                alt={displayTitle}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </figure>

            {/* Service content */}
            <div className="pt-2">
              <p className="font-script text-primary text-3xl italic mb-3" aria-hidden="true">
                {isArabic ? "تفاصيل الخدمة" : "service details"}
              </p>
              <h1
                id="service-title"
                className="text-4xl md:text-5xl font-serif text-secondary leading-tight mb-6"
              >
                {displayTitle}
              </h1>
              <div className="w-16 h-[2px] bg-primary mb-6" role="separator" />
              <p className="text-secondary/80 text-lg leading-relaxed">{displayDesc}</p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
