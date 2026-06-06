"use client";

import React from "react";
import { useCartStore, CartItem } from "../store/useCartStore";
import { MessageSquare, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

interface WhatsAppCheckoutButtonProps {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerEmail?: string;
  customerNotes?: string;
  disabled?: boolean;
}

export default function WhatsAppCheckoutButton({
  customerName,
  customerPhone,
  customerAddress,
  customerEmail = "",
  customerNotes = "",
  disabled = false,
}: WhatsAppCheckoutButtonProps) {
  const { cart, clearCart } = useCartStore();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleWhatsAppCheckout = async () => {
    if (cart.length === 0) return;
    setIsRedirecting(true);
    setError(null);

    try {
      // 🔐 Create the order securely in the database first
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          cart: cart.map((i: CartItem) => ({
            productId: i.product.id,
            quantity: i.quantity,
            customization: i.customization, // Pass keyboard switches/caps/case options
          })),
          customer: {
            name: customerName,
            phone: customerPhone,
            address: customerAddress,
            email: customerEmail,
          },
          notes: customerNotes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to log order on the server.");
      }

      const orderId = data.orderId;

      // 📞 Dynamic WhatsApp phone number fetch from settings
      let phoneNumber = "94771234567"; // Default fallback
      try {
        if (supabase) {
          const { data: settingData } = await supabase
            .from("settings")
            .select("value")
            .eq("key", "whatsapp_number")
            .maybeSingle();
          if (settingData?.value) {
            phoneNumber = settingData.value.replace(/[^0-9]/g, "");
          }
        }
      } catch (err) {
        console.warn("Could not query dynamic WhatsApp number, using static fallback:", err);
      }

      // Format products list for the WhatsApp message
      const productsList = cart
        .map((item: CartItem) => {
          let customizationText = "";
          if (item.customization) {
            customizationText = ` (${item.customization.switches}, ${item.customization.keycaps}, ${item.customization.caseStyle})`;
          }
          return `- ${item.product.title}${customizationText} x${item.quantity}`;
        })
        .join("\n");

      // Format total in LKR (using server verified total price)
      const totalFormatted = `LKR ${data.total.toLocaleString("en-LK")}`;

      // Construct the WhatsApp message body in strict required format
      const message = `Hello AETHEX,

I would like to place an order.

Order Number:
${orderId}

Products:
${productsList}

Total:
${totalFormatted}

Customer:
${customerName}

Address:
${customerAddress}

Phone:
${customerPhone}

Notes:
${customerNotes || "None"}`;

      // Encode message and open WhatsApp deep link
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // Open in new tab
      window.open(whatsappUrl, "_blank");

      // Clear local shopping bag
      clearCart();

      // Redirect client to success receipt page
      router.push(`/success?order_id=${orderId}&method=whatsapp`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred processing your checkout.");
      setIsRedirecting(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      {error && (
        <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-xs text-red-400">
          {error}
        </div>
      )}
      <button
        onClick={handleWhatsAppCheckout}
        disabled={disabled || cart.length === 0 || isRedirecting}
        className={`relative w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-full font-semibold text-sm transition-all duration-500 overflow-hidden group ${
          disabled || cart.length === 0 || isRedirecting
            ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
            : "bg-white text-black hover:bg-white/90 hover:scale-[1.01] active:scale-[0.99] shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
        }`}
        id="whatsapp-checkout-btn"
      >
        <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        
        {isRedirecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-black" />
            <span>Connecting to WhatsApp...</span>
          </>
        ) : (
          <>
            <MessageSquare className="h-4 w-4 fill-current text-black group-hover:scale-110 transition-transform duration-300" />
            <span className="tracking-wide">Order via WhatsApp</span>
          </>
        )}
      </button>
    </div>
  );
}
