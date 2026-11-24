"use client";

import { WifiOff } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

export default function OfflinePage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center gap-2">
          <WifiOff className="h-8 w-8 text-muted-foreground" strokeWidth={1.75} />
          <CardTitle>오프라인 상태입니다</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            인터넷 연결이 끊겨 페이지를 불러올 수 없습니다. 연결을 확인한 뒤 다시 시도해 주세요.
          </p>
          <div>
            <Button onClick={() => window.location.reload()}>다시 시도</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
