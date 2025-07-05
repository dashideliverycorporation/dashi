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
import { headers } from "next/headers";
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

/**
 * Detects the preferred language from cookies, then browser headers
 * @returns The detected language code or the system default language
 */
async function detectLanguage(): Promise<string> {
  try {
    // Access headers - ensure proper typing for Next.js 15
    const headersList = await headers();
    
    // First check if we have a language cookie (highest priority)
    const cookies = headersList.get('cookie') || '';
    const languageCookieMatch = cookies.match(/i18next=([^;]+)/);
    if (languageCookieMatch) {
      const cookieLang = languageCookieMatch[1];
      if (['en', 'fr'].includes(cookieLang)) {
        return cookieLang;
      }
    }
    
    // If no valid cookie found, check Accept-Language header
    const acceptLanguage = headersList.get?.('accept-language') || '';
  
    // Parse the Accept-Language header
    // Example: "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"
    interface LanguagePreference {
      code: string;
      weight: number;
    }
    
    const languages: LanguagePreference[] = acceptLanguage.split(',')
      .map((lang: string) => {
        const [code, weight] = lang.split(';q=');
        return {
          code: code.trim().split('-')[0], // Get primary language code
          weight: weight ? parseFloat(weight) : 1.0
        };
      })
      .sort((a: LanguagePreference, b: LanguagePreference) => b.weight - a.weight);
    
    // Get the highest weighted language code (or default if none found)
    const preferredLanguage = languages.length > 0 ? languages[0].code : getDefaultLanguage();
    
    // Ensure the detected language is supported by our application
    const supportedLanguages = ['en', 'fr']; // Add your supported languages here
    return supportedLanguages.includes(preferredLanguage) 
      ? preferredLanguage 
      : getDefaultLanguage();
  } catch (error) {
    console.error('Error detecting language:', error);
    return getDefaultLanguage();
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const detectedLanguage = await detectLanguage();
  
  return (
    <html lang={detectedLanguage} suppressHydrationWarning>
      <body className="bg-muted" suppressHydrationWarning>
        <SessionProvider session={session}>
          <TRPCProvider>
            <I18nProvider initialLang={detectedLanguage}>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
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
