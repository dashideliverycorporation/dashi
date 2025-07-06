"use client";

import { MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * WhatsApp Support Button component that opens a WhatsApp chat with customer support
 * @param {Object} props - Component props
 * @param {string} props.orderNumber - The order number to include in the message
 * @param {string} props.restaurantName - The restaurant name to include in the message
 * @param {string} props.customerName - The customer name to include in the message
 * @param {Date} props.orderTime - The time when the order was placed
 * @param {string} props.customMessage - Additional custom message to include
 * @returns WhatsApp chat button component
 */
export function WhatsAppSupportButton({ 
  orderNumber,
  restaurantName,
  customerName,
  orderTime,
  customMessage
}: { 
  orderNumber?: string;
  restaurantName?: string;
  customerName?: string;
  orderTime?: Date;
  customMessage?: string;
}) {
  const { t } = useTranslation();
  const phoneNumber = "+243980121983"; // Support WhatsApp number
  
  const createWhatsAppLink = () => {
    // Format time if available
    const formattedTime = orderTime ? format(orderTime, "h:mm a, MMM d, yyyy") : "";
    
    // Build the message parts conditionally
    const messageParts = [];
    
    // Start with basic help message
    messageParts.push(t("support.help", "Hello, I need help"));
    
    // Add order information if available
    if (orderNumber) {
      messageParts.push(`${t("support.withOrder", "with my order")} ${orderNumber}`);
      
      if (restaurantName) {
        messageParts.push(`${t("support.from", "from")} ${restaurantName}`);
      }
    }
    
    // Complete the opening statement
    messageParts.push(".");
    
    // Add customer name if available
    if (customerName) {
      messageParts.push(`${t("support.myNameIs", "My name is")} ${customerName}.`);
    }
    
    // Add order time if available
    if (formattedTime) {
      messageParts.push(`${t("support.orderTime", "Order was placed at")} ${formattedTime}.`);
    }
    
    // Add custom message if provided
    if (customMessage) {
      messageParts.push(`${customMessage}`);
    }
    
    // Add standard closing
    messageParts.push(t("support.assistance", "Please assist."));
    
    // Join all message parts with spaces
    const message = messageParts.join(" ");
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Return WhatsApp API URL with phone and message
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };
  
  return (
    <a 
      href={createWhatsAppLink()} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center z-50 transition-transform hover:scale-105"
      aria-label={t("support.chatWithUs", "Chat with us")}
    >
      <MessageCircle className="w-6 h-6" />
      <span className="ml-2 font-medium">{t("support.chatWithUs", "Chat with us")}</span>
    </a>
  );
}
