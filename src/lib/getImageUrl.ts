export const getImageUrl = (url?: string | null): string | null => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  if (!BASE_URL) return url;
  return new URL(url, BASE_URL).toString();
};
