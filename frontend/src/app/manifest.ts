import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "د. مصطفى بدوي | جراح التجميل",
    short_name: "د. بدوي",
    description:
      "أفضل جراح تجميل في مصر — د. مصطفى بدوي: تجميل الأنف، شد الوجه، شفط الدهون وعمليات التجميل في القاهرة وطنطا.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#c5a028",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/logo9.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo9.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
