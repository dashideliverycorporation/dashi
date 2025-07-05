"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "./Container";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Footer component for the application
 * Displays company information, social links, and contact details
 */
export function Footer() {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <footer className="bg-slate-900 text-white py-10">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row justify-between items-start space-x-8 md:space-x-16 lg:space-x-24">
          {/* Left column - Brand info */}
          <div>
            <h2 className="text-xl font-bold mb-4">{isClient ? t("app.name", "Dashi") : "Dashi"}</h2>
            <p className="text-gray-300 mb-6 max-w-md">
              {isClient 
                ? t("footer.slogan", "Delicious food delivered to your door, anytime and anywhere.")
                : "Delicious food delivered to your door, anytime and anywhere."
              }
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
                aria-label="Visit our Instagram page"
              >
                <Instagram size={20} />{" "}
              </Link>
            </div>
          </div>
          {/* Right column - Contact info */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              {isClient ? t("footer.contact", "Contact") : "Contact"}
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  {isClient ? t("footer.address", "123 Delivery St, Food City, FC 12345") : "123 Delivery St, Food City, FC 12345"}
                </span>
              </div>
              <div className="flex items-start">
                <Phone className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  {isClient ? t("footer.phone", "+1 (555) 123-4567") : "+1 (555) 123-4567"}
                </span>
              </div>
              <div className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  {isClient ? t("footer.email", "support@dashi.com") : "support@dashi.com"}
                </span>
              </div>
            </div>{" "}
          </div>
        </div>
        <hr className="border-gray-700 my-8" />
        <div
          className="text-center text-gray-400 text-sm"
          suppressHydrationWarning
        >
          {isClient ? t("footer.copyright", "© 2025 Dashi. All rights reserved.") : "© 2025 Dashi. All rights reserved."}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
