"use client";

import { Button } from "@alkok/ui";

export const OfflineRetryButton = () => (
  <Button onClick={() => window.location.reload()}>다시 시도</Button>
);
