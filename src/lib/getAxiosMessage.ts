import axios from "axios";

export const getAxiosMessage = (e: unknown, fallback: string): string => {
  if (axios.isAxiosError(e)) {
    const message = (e.response?.data as { message?: unknown } | undefined)
      ?.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
};
