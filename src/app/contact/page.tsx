"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import Link from "next/link";
import { MessageSquare, Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import Turnstile from "../../components/Turnstile";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
  turnstileToken: z.string().min(1, "Bot verification is required"),
});

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = contactFormSchema.safeParse({
      name,
      email,
      message,
      turnstileToken,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
    setTurnstileToken("");
  };

  const handleWhatsAppContact = () => {
    const number = "94771234567";
    const text = encodeURIComponent("Hello AETHEX Store 👋, I need customer support regarding a premium product.");
    window.open(`https://wa.me/${number}?text=${text}`, "_blank");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] text-silver/40 uppercase tracking-widest font-semibold mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Contact</span>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display mb-4">
              GET IN <span className="silver-gradient-text">TOUCH</span>
            </h1>
            <p className="text-silver/60 text-sm md:text-base max-w-lg font-light leading-relaxed">
              Have questions about setups, customization options, or your dropshipping order status? We are here to support you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Contact Form Card */}
            <div className="md:col-span-7 luxury-glass rounded-3xl p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold font-display">Message Received</h3>
                  <p className="text-silver/50 text-xs font-light max-w-xs mx-auto">
                    Thank you. We have logged your request. Our support team will reach out via email shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="apple-btn text-xs py-2 px-4 mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {Object.keys(formErrors).length > 0 && (
                    <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Form contains validation errors. Please review the inputs below.</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors"
                    />
                    {formErrors.name && (
                      <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.name}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors"
                    />
                    {formErrors.email && (
                      <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.email}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your inquiry..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                    />
                    {formErrors.message && (
                      <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.message}</span>
                    )}
                  </div>

                  <Turnstile onVerify={(token) => setTurnstileToken(token)} />
                  {formErrors.turnstileToken && (
                    <span className="text-[10px] text-red-400 text-center block font-mono">{formErrors.turnstileToken}</span>
                  )}

                  <button
                    type="submit"
                    disabled={!turnstileToken}
                    className={`apple-btn w-full justify-center text-xs py-3.5 mt-2 ${!turnstileToken ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Send className="h-4 w-4 text-black" /> Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Quick Contact Info */}
            <div className="md:col-span-5 space-y-6">
              <div className="luxury-glass rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold font-display tracking-tight mb-1">
                    Direct Channels
                  </h3>
                  <p className="text-silver/50 text-[10px] uppercase tracking-wider">
                    Instant reply avenues
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppContact}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#25d366]/10 hover:bg-[#25d366]/20 border border-[#25d366]/20 text-[#25d366] rounded-xl text-xs font-bold transition-all duration-300"
                  >
                    <MessageSquare className="h-4 w-4" /> Message on WhatsApp
                  </button>

                  <a
                    href="mailto:support@aethex.store"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 text-white rounded-xl text-xs font-bold transition-all duration-300"
                  >
                    <Mail className="h-4 w-4 text-silver" /> Support Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CartDrawer />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white text-lg font-bold tracking-widest font-display">
            AETHEX<span className="text-white/40">STORE</span>
          </div>
          <p className="text-silver/40 text-xs font-light">
            &copy; {new Date().getFullYear()} AETHEX Store. All rights reserved. Handcrafted dropshipping platform.
          </p>
          <div className="flex gap-6 text-xs text-silver/40">
            <Link href="/policies" className="hover:text-white transition-colors">Policies</Link>
            <Link href="/about-us" className="hover:text-white transition-colors">About Us</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
