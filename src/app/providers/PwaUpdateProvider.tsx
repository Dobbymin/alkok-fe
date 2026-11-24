"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Workbox } from "workbox-window";

export const PwaUpdateProvider = () => {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV === "test"
    ) {
      return;
    }

    const wb = new Workbox("/sw.js");

    wb.addEventListener("waiting", () => {
      toast("새 버전이 있습니다", {
        description: "최신 화면을 적용하려면 새로고침하세요.",
        duration: Infinity,
        action: {
          label: "새로고침",
          onClick: () => {
            wb.addEventListener("controlling", () => {
              window.location.reload();
            });
            wb.messageSkipWaiting();
          },
        },
      });
    });

    wb.register()
      .then((registration) => {
        registration?.update();
      })
      .catch(() => {
        // Ignore registration failures in unsupported contexts
      });
  }, []);

  return null;
};
