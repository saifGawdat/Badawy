"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(
    /\/$/,
    ""
  );

/**
 * Records one visit per browser session on the public site.
 * IP is determined on the server from the incoming request.
 */
export function VisitTracker() {
  const pathname = usePathname();
  const sentRef = useRef(false);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/dashboard") || pathname === "/login") return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("badawy_visit_tracked") === "1") return;
    if (sentRef.current) return;

    sentRef.current = true;

    const record = async () => {
      try {
        const res = await fetch(`${API_BASE}/visits/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname || "/",
            userAgent: navigator.userAgent,
          }),
        });
        if (res.ok) sessionStorage.setItem("badawy_visit_tracked", "1");
        else sentRef.current = false;
      } catch {
        sentRef.current = false;
      }
    };

    record();
  }, [pathname]);

  return null;
}
