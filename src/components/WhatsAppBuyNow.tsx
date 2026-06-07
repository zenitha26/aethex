"use client";

import { MessageCircle } from "lucide-react";
import { Product } from "../../lib/products";

export default function WhatsAppBuyNow({ product }: { product: Product }) {
  const handleWhatsAppClick = () => {
    // Generate a pre-filled message with product details
    const message = `Hello Aethex Store! I would like to order the following item:\n\nProduct: ${product.title}\nPrice: LKR ${product.price.toLocaleString()}\n\nIs this currently available?`;
    
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
