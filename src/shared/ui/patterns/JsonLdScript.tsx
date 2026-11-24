import { serializeJsonLd } from "@/shared/lib";

export const JsonLdScript = ({ data }: { data: unknown }) => (
  <script type="application/ld+json">{serializeJsonLd(data)}</script>
);
