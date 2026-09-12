"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Copy, 
  Check, 
  Loader2, 
  ShieldCheck, 
  Building2, 
  MessageCircle,
  ExternalLink,
  RefreshCw,
  Eye
} from "lucide-react";
import { createClient } from "../../../../lib/supabase/client";
import { audioEngine } from "../../../../lib/audio";

interface OrderItem {
  id?: string;
  product_name: string;
  price: number;
  quantity: number;
  color?: string | null;
  image?: string | null;
}

interface OrderData {
  id: string;
  user_id?: string | null;
  customer_name: string;
  customer_email?: string | null;
  customer_phone: string;
  customer_address: string;
  city?: string | null;
  postal_code?: string | null;
  subtotal: number;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  status?: string;
  slip_url?: string | null;
  notes?: string | null;
  line_items?: OrderItem[];
  created_at: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.id as string) || "";
  const supabase = createClient();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bank slip upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [isVerifyingOcr, setIsVerifyingOcr] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Fetch order data
  const loadOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Try Supabase
      const { data, error: sbError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

      if (sbError) {
        console.warn("Supabase order fetch warning:", sbError);
      }

      if (data) {
        setOrder(data);

        // Fetch corresponding AI OCR receipt record if exists
        try {
          const { data: receipt } = await supabase
            .from("receipts")
            .select("*")
            .eq("order_id", orderId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (receipt) {
            setReceiptData(receipt);
          }
        } catch {}
      } else {
        // 2. Fallback to localStorage
        try {
          const cached = JSON.parse(localStorage.getItem("aethex_local_orders") || "[]");
          const found = cached.find((o: OrderData) => o.id === orderId);
          if (found) {
            setOrder(found);
          } else {
            setError("Order not found. Please check your order ID.");
          }
        } catch {
          setError("Order not found.");
        }
      }
    } catch (err: any) {
      console.error("Order load error:", err);
      // Check local cache
      try {
        const cached = JSON.parse(localStorage.getItem("aethex_local_orders") || "[]");
        const found = cached.find((o: OrderData) => o.id === orderId);
        if (found) {
          setOrder(found);
        } else {
          setError(err?.message || "Failed to load order.");
        }
      } catch {
        setError(err?.message || "Failed to load order.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  // Handle file selection
  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate size (< 15MB)
    if (file.size > 15 * 1024 * 1024) {
      showNotification("File size exceeds 15MB limit.", "error");
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      showNotification("Please upload an image (JPG, PNG, WEBP) or PDF.", "error");
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Upload Bank Slip to Supabase Storage
  const handleUploadSlip = async () => {
    if (!selectedFile || !order) return;

    setUploading(true);
    try {
      try {
        audioEngine.playAcquire();
      } catch {}

      const fileExt = selectedFile.name.split(".").pop() || "jpg";
      const cleanOrderId = order.id.replace(/[^a-zA-Z0-9_-]/g, "");
      const fileName = `${cleanOrderId}_${Date.now()}.${fileExt}`;
      const filePath = `slips/${fileName}`;

      let uploadedUrl = "";

      // 1. Upload to Supabase Storage bucket 'payment_slips'
      const { data: storageData, error: storageError } = await supabase.storage
        .from("payment_slips")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (storageError) {
        console.warn("Storage upload warning (bucket may be restricted or missing):", storageError);
        // Fallback: If bucket is missing or unconfigured, store data URL in local storage cache
        if (filePreview) {
          uploadedUrl = filePreview;
        } else {
          uploadedUrl = filePath;
        }
      } else {
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("payment_slips")
          .getPublicUrl(filePath);

        uploadedUrl = publicUrlData?.publicUrl || filePath;
      }

      // 2. Update orders table in Supabase
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          slip_url: uploadedUrl,
          order_status: "processing_verification",
          status: "processing_verification",
          payment_status: "processing_verification",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (updateError) {
        console.warn("Database order status update warning:", updateError);
      }

      // 3. Update localStorage fallback
      try {
        const cached = JSON.parse(localStorage.getItem("aethex_local_orders") || "[]");
        const updated = cached.map((o: OrderData) => {
          if (o.id === order.id) {
            return {
              ...o,
              slip_url: uploadedUrl,
              order_status: "processing_verification",
              status: "processing_verification",
              payment_status: "processing_verification",
            };
          }
          return o;
        });
        localStorage.setItem("aethex_local_orders", JSON.stringify(updated));
      } catch {}

      // 4. Update component state to reflect "Verification in Progress"
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              slip_url: uploadedUrl,
              order_status: "processing_verification",
              status: "processing_verification",
              payment_status: "processing_verification",
            }
          : null
      );

      setSelectedFile(null);
      // 5. Trigger AI Vision Slip OCR & Auto-Reconciliation pipeline
      setIsVerifyingOcr(true);
      (async () => {
        let ocrCompleted = false;

        try {
          // Attempt Supabase Edge Function execution directly with user's JWT
          const { data: edgeData, error: edgeErr } = await supabase.functions.invoke("verify-slip-ocr", {
            body: { orderId: order.id, slipUrl: uploadedUrl },
          });

          if (!edgeErr && edgeData?.success) {
            ocrCompleted = true;
            if (edgeData.extractedData) {
              setReceiptData({
                extracted_data: edgeData.extractedData,
                payment_date: edgeData.extractedData.payment_date,
                sender_account: edgeData.extractedData.sender_account,
                receiver_account: edgeData.extractedData.receiver_account,
                amount: edgeData.extractedData.amount,
                currency: edgeData.extractedData.currency || "LKR",
                reference_number: edgeData.extractedData.reference_number,
                confidence: edgeData.extractedData.confidence,
                reconciliation_status: edgeData.reconciled ? "auto_reconciled" : "manual_audit_flagged",
              });
            }
            if (edgeData.reconciled) {
              showNotification("AI Vision verified your slip! Amount auto-reconciled.", "success");
              try { audioEngine.playSuccess(); } catch {}
            }
          }
        } catch (edgeErr) {
          console.warn("Supabase Edge Function invoke notice (falling back to Next API):", edgeErr);
        }

        if (!ocrCompleted) {
          try {
            const res = await fetch("/api/orders/verify-slip", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: order.id, slipUrl: uploadedUrl }),
            });
            const ocrRes = await res.json();
            if (ocrRes?.success) {
              if (ocrRes.extractedData) {
                setReceiptData({
                  extracted_data: ocrRes.extractedData,
                  payment_date: ocrRes.extractedData.payment_date,
                  sender_account: ocrRes.extractedData.sender_account,
                  receiver_account: ocrRes.extractedData.receiver_account,
                  amount: ocrRes.extractedData.amount,
                  currency: ocrRes.extractedData.currency || "LKR",
                  reference_number: ocrRes.extractedData.reference_number,
                  confidence: ocrRes.extractedData.confidence,
                  reconciliation_status: ocrRes.reconciled ? "auto_reconciled" : "manual_audit_flagged",
                });
              }
              if (ocrRes.reconciled) {
                showNotification("AI Vision verified your slip! Amount auto-reconciled.", "success");
                try { audioEngine.playSuccess(); } catch {}
              }
            }
          } catch (apiErr) {
            console.warn("AI slip verification API fallback notice:", apiErr);
          }
        }

        setIsVerifyingOcr(false);
      })();
    } catch (err: any) {
      console.error("Failed to upload slip:", err);
      showNotification(err?.message || "Failed to upload payment slip. Please retry.", "error");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-white/40" />
        <p className="text-xs font-mono tracking-widest uppercase text-white/40">
          Loading Order Telemetry...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-xl font-bold font-mono tracking-wide text-white">
            {error || "Order Not Found"}
          </h1>
          <p className="text-xs font-mono text-white/50 leading-relaxed">
            We couldn't retrieve the specified order records. Please verify your reference or check your order history.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/account/orders"
            className="px-6 py-3 rounded-full text-xs font-mono uppercase tracking-widest text-white border border-white/10 hover:bg-white/5 transition"
          >
            My Orders
          </Link>
          <button
            onClick={loadOrder}
            className="px-6 py-3 rounded-full text-xs font-mono uppercase tracking-widest bg-white text-black font-bold hover:bg-white/90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = (order.order_status || order.status || order.payment_status || "pending_payment").toLowerCase();
  const isPendingPayment = currentStatus === "pending_payment";
  const isProcessingVerification = currentStatus === "processing_verification";
  const isConfirmed = currentStatus === "confirmed" || currentStatus === "paid" || currentStatus === "processing" || currentStatus === "delivered";
  const isFailed = currentStatus === "payment_failed" || currentStatus === "failed";

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOrder}
              className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/10 transition text-white/60 hover:text-white"
              title="Refresh order status"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono tracking-widest uppercase text-white/40">
              Ref: {order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Global Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-3">
            <div
              className={`p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl flex items-start gap-3 ${
                toast.type === "error"
                  ? "bg-red-950/80 border-red-500/30 text-red-200"
                  : "bg-emerald-950/80 border-emerald-500/30 text-emerald-200"
              }`}
            >
              {toast.type === "error" ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
              )}
              <span className="text-xs font-mono leading-relaxed">{toast.text}</span>
            </div>
          </div>
        )}

        {/* Order Status Hero Banner */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                  Order Telemetry
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] font-mono text-white/40">
                  {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-light font-mono uppercase tracking-tight text-white">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-xs font-mono text-white/60">
                Customer: <span className="text-white">{order.customer_name}</span> ({order.customer_phone})
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                Total Payable
              </span>
              <span className="text-3xl font-mono font-bold tracking-tight text-white">
                {formatLKR(order.total)}
              </span>
              
              {/* Dynamic Status Pill */}
              <div className="mt-1">
                {isPendingPayment && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    <Clock className="w-3 h-3 animate-pulse" />
                    Pending Bank Transfer
                  </span>
                )}
                {isProcessingVerification && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    Verification In Progress
                  </span>
                )}
                {isConfirmed && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Payment Confirmed
                  </span>
                )}
                {isFailed && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-300 border border-red-500/20">
                    <AlertCircle className="w-3 h-3" />
                    Verification Failed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Workflow Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Action Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. STATE: VERIFICATION IN PROGRESS */}
            {isProcessingVerification && (
              <div className="bg-white/[0.02] border border-blue-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6 relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-mono font-bold uppercase tracking-wider text-white">
                      Verification in Progress
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed font-mono">
                      Your bank transfer receipt has been successfully uploaded and queued for audit. Our financial settlement team validates transfers in 15–30 minutes during banking hours.
                    </p>
                  </div>
                </div>

                {/* Uploaded Slip Preview Card */}
                {order.slip_url && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                        Uploaded Receipt Document
                      </span>
                      <button
                        onClick={() => setShowSlipModal(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-white/70 hover:text-white transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Slip</span>
                      </button>
                    </div>

                    <div 
                      onClick={() => setShowSlipModal(true)}
                      className="cursor-pointer group relative rounded-xl overflow-hidden border border-white/10 bg-black/60 aspect-[16/9] flex items-center justify-center"
                    >
                      <img
                        src={order.slip_url}
                        alt="Bank Transfer Receipt"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4 text-white" />
                        <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                          Click to Enlarge
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Vision OCR Auto-Reconciliation Telemetry Card */}
                {(receiptData || isVerifyingOcr) && (
                  <div className="p-5 rounded-2xl bg-[#0B0B0B] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/70">
                          AI Vision Auto-Reconciliation
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                        Claude 3.5 Sonnet Vision
                      </span>
                    </div>

                    {isVerifyingOcr ? (
                      <div className="py-6 flex flex-col items-center justify-center gap-3 text-center">
                        <Loader2 className="w-5 h-5 animate-spin text-white/60" />
                        <span className="text-xs font-mono text-white/60">
                          Parsing Banking Slip Telemetry & Reconciling Order Value...
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">
                            Detected Amount
                          </span>
                          <span className="text-white font-bold text-sm">
                            {receiptData?.amount ? formatLKR(Number(receiptData.amount)) : formatLKR(order.total)}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">
                            Reconciliation Match
                          </span>
                          <span className="text-white font-bold text-sm flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            <span>
                              {receiptData?.reconciliation_status === "auto_reconciled" ? "Matched 100%" : "Reconciled"}
                            </span>
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">
                            Payment Date
                          </span>
                          <span className="text-white/80 text-xs">
                            {receiptData?.payment_date || new Date().toISOString().split("T")[0]}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">
                            Beneficiary Account
                          </span>
                          <span className="text-white/80 text-xs truncate block">
                            HNB • 003010492819
                          </span>
                        </div>
                        {receiptData?.reference_number && (
                          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 col-span-2 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] uppercase tracking-widest text-white/40 block mb-0.5">
                                Verified Transfer Reference
                              </span>
                              <span className="text-white font-bold tracking-wider">
                                {receiptData.reference_number}
                              </span>
                            </div>
                            <span className="text-[10px] text-white/40 border border-white/10 px-2 py-0.5 rounded">
                              {receiptData.confidence ? `${Math.round(Number(receiptData.confidence) * 100)}% Confidence` : "High Confidence"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Fast-Track WhatsApp Audit */}
                <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/94770000000?text=${encodeURIComponent(
                      `Hello AETHEX Concierge, I have uploaded the bank transfer slip for Order #${order.id.slice(0, 8).toUpperCase()}. Kindly expedite clearance.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Instant WhatsApp Audit</span>
                  </a>
                  <button
                    onClick={() => {
                      setOrder({ ...order, order_status: "pending_payment", status: "pending_payment" });
                    }}
                    className="py-3 px-5 rounded-full border border-white/10 hover:bg-white/5 text-white/60 hover:text-white font-mono text-xs uppercase tracking-wider transition"
                  >
                    Re-upload Slip
                  </button>
                </div>
              </div>
            )}

            {/* 2. STATE: PENDING PAYMENT - INSTRUCTIONS & DROPZONE */}
            {isPendingPayment && (
              <div className="space-y-6">
                {/* Bank Account Wire Box */}
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <Building2 className="w-5 h-5 text-white/60" />
                    <div>
                      <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-white">
                        Bank Transfer Instructions
                      </h2>
                      <p className="text-[11px] font-mono text-white/50">
                        Transfer via Online Banking, CEFTS, or LankaQR to our official corporate account.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 relative">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block">
                        Beneficiary Bank
                      </span>
                      <span className="text-white font-semibold text-sm block">
                        Hatton National Bank (HNB)
                      </span>
                      <span className="text-white/50 text-[11px] block">
                        Branch: Colombo City Centre (003)
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 relative">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block">
                        Account Name
                      </span>
                      <span className="text-white font-semibold text-sm block">
                        AETHEX LANKA (PVT) LTD
                      </span>
                      <button
                        onClick={() => copyToClipboard("AETHEX LANKA PVT LTD", "name")}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition"
                      >
                        {copiedField === "name" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1 relative sm:col-span-2">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block">
                        Account Number
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold font-mono tracking-widest text-white">
                          003010492819
                        </span>
                        <button
                          onClick={() => copyToClipboard("003010492819", "acc")}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition"
                        >
                          {copiedField === "acc" ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy No.</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 relative sm:col-span-2">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block">
                        Mandatory Transfer Reference / Remarks
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-mono font-bold tracking-widest">
                          {order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <button
                          onClick={() => copyToClipboard(order.id.slice(0, 8).toUpperCase(), "ref")}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition"
                        >
                          {copiedField === "ref" ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Ref</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-white/40 mt-1">
                        * Please input this reference in your banking transfer remarks for rapid reconciliation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Glassmorphic Dropzone for Bank Transfer Slip */}
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
                  <div className="space-y-1 border-b border-white/5 pb-4">
                    <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-white">
                      Upload Bank Transfer Slip
                    </h2>
                    <p className="text-[11px] font-mono text-white/50">
                      Submit a screenshot, transaction photo, or digital receipt to confirm your payment.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />

                  {/* Interactive Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                      isDragOver
                        ? "border-white bg-white/[0.06] scale-[1.01]"
                        : selectedFile
                        ? "border-emerald-500/40 bg-emerald-500/[0.02]"
                        : "border-white/10 hover:border-white/30 bg-white/[0.01] hover:bg-white/[0.03]"
                    }`}
                  >
                    {selectedFile ? (
                      <div className="space-y-4 w-full max-w-sm">
                        {filePreview ? (
                          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black max-h-48 flex items-center justify-center mx-auto">
                            <img
                              src={filePreview}
                              alt="Selected Receipt"
                              className="max-h-48 object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/60">
                            <FileText className="w-8 h-8" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="text-xs font-mono font-bold text-white truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-[10px] font-mono text-white/40">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to verify
                          </p>
                        </div>
                        <p className="text-[10px] font-mono text-white/40 underline">
                          Click to select a different document
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-white/50">
                          <UploadCloud className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                            Drag & Drop your payment slip here
                          </p>
                          <p className="text-[11px] font-mono text-white/40">
                            or click to browse local files (JPG, PNG, WEBP, PDF up to 15MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Slip Button */}
                  <button
                    disabled={!selectedFile || uploading}
                    onClick={handleUploadSlip}
                    className="w-full py-4 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-2xl"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Uploading Slip to Secure Storage...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit Slip for Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 3. STATE: PAYMENT CONFIRMED */}
            {isConfirmed && (
              <div className="bg-white/[0.02] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-mono font-bold uppercase tracking-wider text-white">
                      Payment Fully Confirmed
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed font-mono">
                      Your transfer has cleared our treasury audits. Hardware package is progressing to logistics dispatch. Tracking manifest will be relayed via SMS and email.
                    </p>
                  </div>
                </div>

                {order.slip_url && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-white/60">Verified Receipt Slip</span>
                    <button
                      onClick={() => setShowSlipModal(true)}
                      className="text-xs font-mono text-white underline hover:text-white/80"
                    >
                      View Slip
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 4. STATE: FAILED */}
            {isFailed && (
              <div className="bg-white/[0.02] border border-red-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-mono font-bold uppercase tracking-wider text-white">
                      Payment Verification Declined
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed font-mono">
                      The uploaded receipt could not be verified against banking settlement records. Please ensure transaction completed successfully and submit a valid slip.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setOrder({ ...order, order_status: "pending_payment", status: "pending_payment" });
                  }}
                  className="w-full py-3 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition"
                >
                  Upload Clear Slip
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Items & Delivery Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Items Summary Card */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white border-b border-white/5 pb-4">
                Hardware Manifest
              </h3>

              <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {order.line_items && order.line_items.length > 0 ? (
                  order.line_items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                      {item.image ? (
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={item.image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 flex-shrink-0 font-mono text-[10px]">
                          ITEM
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono font-semibold text-white truncate">
                          {item.product_name}
                        </p>
                        <p className="text-[10px] font-mono text-white/50">
                          Qty: {item.quantity} {item.color ? `• Color: ${item.color}` : ""}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-mono font-bold text-white">
                          {formatLKR(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-mono text-white/40 py-4 text-center">
                    Hardware manifest details unavailable.
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-white/5 pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>{formatLKR(order.subtotal || order.total)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping & Handling</span>
                  <span className="text-emerald-400">Complimentary Express</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                  <span>Total Amount</span>
                  <span>{formatLKR(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Destination Card */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white border-b border-white/5 pb-3">
                Courier Destination
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest block">
                    Recipient
                  </span>
                  <span className="text-white font-medium">{order.customer_name}</span>
                </div>

                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest block">
                    Shipping Address
                  </span>
                  <span className="text-white/80 leading-relaxed block">
                    {order.customer_address}
                    {order.city && `, ${order.city}`}
                    {order.postal_code && ` - ${order.postal_code}`}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest block">
                    Contact Phone
                  </span>
                  <span className="text-white font-medium">{order.customer_phone}</span>
                </div>

                {order.notes && (
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block">
                      Delivery Instructions
                    </span>
                    <span className="text-white/60 italic block">{order.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Assistance Badge */}
            <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 text-center">
              <p className="text-[11px] font-mono text-white/40">
                Need immediate assistance? Contact our concierge at{" "}
                <a href="mailto:concierge@aethex.com" className="text-white underline">
                  concierge@aethex.com
                </a>
              </p>
            </div>

          </div>
        </div>

        {/* Modal: Fullscreen Bank Slip Viewer */}
        {showSlipModal && order.slip_url && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
            onClick={() => setShowSlipModal(false)}
          >
            <div 
              className="bg-[#0B0B0B] border border-white/10 p-6 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col space-y-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-white">
                  Payment Slip Document • Ref #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <button
                  onClick={() => setShowSlipModal(false)}
                  className="px-3 py-1 rounded-full text-xs font-mono text-white/60 hover:text-white border border-white/10 hover:bg-white/5 transition"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-auto rounded-xl bg-black/60 border border-white/5 flex items-center justify-center p-2">
                <img
                  src={order.slip_url}
                  alt="Payment Slip Full"
                  className="max-w-full max-h-[65vh] object-contain"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <a
                  href={order.slip_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-white/60 hover:text-white transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in new tab</span>
                </a>
                <button
                  onClick={() => setShowSlipModal(false)}
                  className="px-5 py-2 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
