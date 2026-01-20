import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AuthProvider } from "@/hooks/useAuth"; // ✅ ADD
import Navbar from "@/components/Navbar";
import "../globals.css";
import { ToastContainer } from "react-toastify";
export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50">{children}</main>
            <ToastContainer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
