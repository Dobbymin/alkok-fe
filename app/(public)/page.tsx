import { HomePage } from "@/views/home";
import type { HomeDataPayload } from "@/entities/content";
import { serverApiGet } from "@/shared/api/server-api-client.server";
import type { ApiEnvelope } from "@/shared/types";

export default async function Page() {
  const res = await serverApiGet<ApiEnvelope<HomeDataPayload>>("/api/v1/home", {
    revalidate: 60,
  });
  return <HomePage initialData={res?.data ?? null} />;
}
