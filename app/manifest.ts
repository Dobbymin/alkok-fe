import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "알콕(Alkok)",
    short_name: "알콕",
    description: "AI 정보, 알맹이만 콕. 실무 AI 가이드·도구 비교·지식 보관함.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#F8FAFC",
    lang: "ko",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
