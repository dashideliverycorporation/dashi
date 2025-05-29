import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import SessionProvider from "@/components/custom/session-provider";
import TRPCProvider from "@/lib/trpc/trpc-provider";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getDefaultLanguage } from "@/lib/i18n/settings";
import I18nProvider from "@/components/custom/i18n-provider";
import CartProvider from "@/components/cart/cart-provider";
import { Metadata } from "next";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

/**
 * Metadata for the Dashi application
 */
export const metadata: Metadata = {
  title: "Dashi | Food Delivery",
  description: "Order delicious food from local restaurants in Goma",
  keywords: [
    "food delivery",
    "restaurants",
    "Goma",
    "online ordering",
    "takeout",
  ],
  authors: [{ name: "Dashi Team" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const defaultLanguage = getDefaultLanguage();
  return (
    <html lang={defaultLanguage} suppressHydrationWarning>
      <body className="bg-muted" suppressHydrationWarning>
        {" "}
        <SessionProvider session={session}>
          <TRPCProvider>
            {" "}
            <I18nProvider initialLang={defaultLanguage}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <CartProvider>
                  {children}
                  <Toaster />
                </CartProvider>
              </ThemeProvider>
            </I18nProvider>
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
