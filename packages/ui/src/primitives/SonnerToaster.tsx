"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  XCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, type CSSProperties } from "react";
import { Toaster, toast } from "sonner";

export { toast };

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

const useIsMobileToast = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia(MOBILE_MEDIA_QUERY);
    setIsMobile(mql.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
};

const TOASTER_STYLE = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "var(--radius-xl)",
} as CSSProperties;

export const SonnerToaster = () => {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobileToast();

  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position={isMobile ? "top-center" : "bottom-right"}
      offset="20px"
      mobileOffset={{ top: "64px", left: "16px", right: "16px" }}
      closeButton
      duration={3500}
      gap={10}
      style={TOASTER_STYLE}
      icons={{
        success: (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-status-valid-border bg-status-valid-bg text-status-valid-fg">
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </span>
        ),
        error: (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-status-expired-border bg-status-expired-bg text-status-expired-fg">
            <XCircle className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </span>
        ),
        warning: (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-status-review-border bg-status-review-bg text-status-review-fg">
            <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </span>
        ),
        info: (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-badge-official-bg text-badge-official-fg">
            <Info className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </span>
        ),
        loading: (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-surface-sunken text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} aria-hidden="true" />
          </span>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "alkok-toast group font-sans text-sm border border-border bg-popover text-popover-foreground shadow-elevated rounded-xl",
          title: "font-medium text-popover-foreground leading-snug",
          description: "text-xs text-muted-foreground leading-relaxed",
          icon: "!m-0 !mr-1 !h-6 !w-6 shrink-0",
          actionButton:
            "!bg-primary !text-primary-foreground !rounded-md !text-xs !font-medium !px-3 !py-1",
          cancelButton:
            "!bg-secondary !text-secondary-foreground !rounded-md !text-xs !font-medium !px-3 !py-1",
          closeButton:
            "!border-border !bg-popover !text-muted-foreground hover:!bg-secondary hover:!text-foreground",
        },
      }}
    />
  );
};
