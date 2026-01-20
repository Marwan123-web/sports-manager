import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export default getRequestConfig(async (params) => {
  // ✅ Next.js 14+ = params object
  let locale = params.locale || "en"; // Fallback

  const validLocales = ["en", "ar", "it"];

  if (!validLocales.includes(locale)) {
    locale = "en";
  }

  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    return {
      messages,
      locale, // Return locale
    };
  } catch (error) {
    console.error("💥 Messages failed:", error);
    return {
      messages: { error: "Messages failed" },
      locale: "en",
    };
  }
});
