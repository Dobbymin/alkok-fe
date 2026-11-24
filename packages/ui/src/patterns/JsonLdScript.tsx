import { serializeJsonLd } from "@alkok/core";

export const JsonLdScript = ({ data }: { data: unknown }) => (
  <script type="application/ld+json">{serializeJsonLd(data)}</script>
);
