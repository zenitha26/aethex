"use client";

import { MessageCircle } from "lucide-react";
import { Product } from "../types/product";

export default function WhatsAppBuyNow({ 
  product, 
  quantity = 1,
  color
}: { 
  product: Product;
  quantity?: number;
  color?: string;
}) {
  const handleWhatsAppClick = () => {
    let colorText = color ? `\n\nColor:\n${color}` : '';
    // Generate a pre-filled message with product details
    const message = `Hello AETHEX,\n\nI would like to order:\n\nProduct:\n${product.title}${colorText}\n\nQuantity:\n${quantity}\n\nPrice:\nLKR ${(product.price * quantity).toLocaleString()}\n\nPlease confirm availability.`;
    
    // URL Encode the message
    const encodedMessage = encodeURIComponent(message);
    
    // Replace YOUR_WHATSAPP_NUMBER with actual number
    const whatsappUrl = `https://wa.me/94770000000?text=${encodedMessage}`;
    
    // Open in a new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="w-full mt-3 bg-[#25D366] text-white hover:bg-[#1ebe57] font-semibold py-4 px-8 rounded-full transition-all shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-3"
    >
      <MessageCircle className="w-5 h-5" />
      <span>Order via WhatsApp</span>
    </button>
  );
}
