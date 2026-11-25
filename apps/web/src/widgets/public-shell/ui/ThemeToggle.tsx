"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@alkok/core";
import { Button } from "@alkok/ui";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const ThemeToggle = ({
  showLabel = false,
  className,
}: {
  showLabel?: boolean;
  className?: string;
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const isDark = (resolvedTheme ?? theme) === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const actionLabel = isDark ? "라이트 모드로 전환" : "다크 모드로 전환";

  return (
    <Button
      variant="ghost"
      size={showLabel ? "sm" : "icon-sm"}
      aria-label="테마 전환"
      title={mounted ? actionLabel : "테마 전환"}
      onClick={() => setTheme(nextTheme)}
      className={cn(showLabel && "justify-start gap-2", className)}
    >
      <Moon
        className="h-4 w-4 dark:hidden"
        strokeWidth={1.75}
        absoluteStrokeWidth
        aria-hidden="true"
      />
      <Sun
        className="hidden h-4 w-4 dark:block"
        strokeWidth={1.75}
        absoluteStrokeWidth
        aria-hidden="true"
      />
      {showLabel ? (
        <span className="text-xs font-medium">
          {mounted && isDark ? "라이트 모드" : "다크 모드"}
        </span>
      ) : null}
    </Button>
  );
};
