export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function getWebUrl(): string {
  return (process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export const env = {
  get apiBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
  },
  get siteUrl(): string {
    return getSiteUrl();
  },
  get webUrl(): string {
    return getWebUrl();
  },
};
