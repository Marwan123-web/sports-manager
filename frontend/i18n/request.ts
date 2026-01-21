import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const defaultLocale = await requestLocale;

  const validLocales = ["en", "ar", "it"];

  const locale = validLocales.includes(defaultLocale) ? defaultLocale : "en";

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
