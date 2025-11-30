import { useEffect } from "react";

export default function Seo() {
  useEffect(() => {
    const envUrl = (import.meta as any).env?.VITE_PUBLIC_APP_URL as string | undefined;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const base = envUrl && envUrl.length ? envUrl.replace(/\/+$/, "") : origin;
    const path = typeof window !== "undefined" ? window.location.pathname + window.location.search : "";
    const canonicalHref = `${base}${path}`;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.href = canonicalHref;

    let og = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    if (!og) {
      og = document.createElement("meta");
      og.setAttribute("property", "og:url");
      document.head.appendChild(og);
    }
    og.setAttribute("content", canonicalHref);
  }, []);

  return null;
}
