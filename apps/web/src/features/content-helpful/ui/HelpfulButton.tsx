"use client";

import { useMutation } from "@tanstack/react-query";
import { ThumbsUp } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@alkok/core";
import { Button } from "@alkok/ui";
import { helpfulApi } from "../api/helpful.api";

export interface HelpfulButtonProps {
  contentId: string;
  initialCount?: number;
  initialHelpful?: boolean;
}

export const HelpfulButton = ({
  contentId,
  initialCount = 0,
  initialHelpful = false,
}: HelpfulButtonProps) => {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { isAuthenticated } = useAuth();

  const [isHelpful, setIsHelpful] = useState(initialHelpful);
  const [count, setCount] = useState(initialCount);

  const mutation = useMutation({
    mutationFn: (nextHelpful: boolean) =>
      nextHelpful
        ? helpfulApi.markHelpful(contentId)
        : helpfulApi.unmarkHelpful(contentId),
    onSuccess: (res) => {
      setIsHelpful(res.data.isHelpful);
      setCount(res.data.helpfulCount);
    },
    onError: (err, nextHelpful) => {
      setIsHelpful(!nextHelpful);
      setCount((c) => (nextHelpful ? Math.max(0, c - 1) : c + 1));
      toast.error(
        err instanceof Error ? err.message : "요청 처리에 실패했습니다.",
      );
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.info("로그인 후 도움이 되었어요를 남길 수 있습니다.", {
        action: {
          label: "로그인",
          onClick: () =>
            router.push(`/login?next=${encodeURIComponent(pathname)}`),
        },
      });
      return;
    }

    const next = !isHelpful;
    setIsHelpful(next);
    setCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
    mutation.mutate(next);
  };

  return (
    <Button
      type="button"
      variant={isHelpful ? "secondary" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={mutation.isPending}
      aria-pressed={isHelpful}
    >
      <ThumbsUp
        className="h-3.5 w-3.5"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <span>도움이 되었어요</span>
      <span className="tabular-nums text-xs text-muted-foreground">
        {count}
      </span>
    </Button>
  );
};
