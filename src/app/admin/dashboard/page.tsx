"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Truck,
  ArrowRight,
  Loader2,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "customers" | "policies" | "settings" | "reviews">("overview");

  // Core Data States
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState("94771234567");

  // Loading & Action States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal / Form States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    original_price: "",
    image_url: "p1",
    source: "shopify",
    stock: "10"
  });

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trackingForm, setTrackingForm] = useState({
    tracking_number: "",
    courier: "AliExpress",
    order_status: "processing",
    payment_status: "pending"
  });

  const [policyForm, setPolicyForm] = useState({
    type: "shipping",
    title: "",
    content: ""
  });

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Products
      const prodRes = await fetch("/api/admin/products");
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.products || []);
      } else {
        throw new Error(prodData.error || "Failed to load products");
      }

      // 2. Fetch Orders
      const orderRes = await fetch("/api/admin/orders");
      const orderData = await orderRes.json();
      if (orderData.success) {
        setOrders(orderData.orders || []);
      } else {
        throw new Error(orderData.error || "Failed to load orders");
      }

      // 3. Fetch Policies from Supabase Client
      if (supabase) {
        const { data: pols } = await supabase.from("policies").select("*");
        setPolicies(pols || []);

        const { data: custs } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
        setCustomers(custs || []);

        const { data: settingData } = await supabase.from("settings").select("value").eq("key", "whatsapp_number").maybeSingle();
        if (settingData) {
          setWhatsappNumber(settingData.value);
        }

        // Fetch all reviews for moderation
        const { data: revs } = await supabase
          .from("reviews")
          .select(`
            *,
            products (
              title
            )
          `)
          .order("created_at", { ascending: false });
        setReviews(revs || []);
      }
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to authenticate session or read backend logs.");
      // Redirect if unauthorized
      if (err.message?.includes("Unauthorized")) {
        router.push("/admin");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      router.push("/admin");
    }
  };

  // Add or Edit Product Handler
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);

    const payload = {
      id: editingProduct?.id,
      title: productForm.title,
      description: productForm.description,
      price: parseFloat(productForm.price),
      original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
      image_url: productForm.image_url,
      source: productForm.source,
      stock: parseInt(productForm.stock, 10)
    };

    try {
      const endpoint = "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Action failed.");
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
      setProductForm({ title: "", description: "", price: "", original_price: "", image_url: "p1", source: "shopify", stock: "10" });
      await fetchDashboardData();
    } catch (err: any) {
      setError(err.message || "Failed to update product details.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this product?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/products`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete.");
      await fetchDashboardData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Order Details / Tracking Update Handler
  const handleOrderTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setActionLoading(true);

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          payment_status: trackingForm.payment_status,
          order_status: trackingForm.order_status,
          tracking_number: trackingForm.tracking_number,
          courier: trackingForm.courier,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update failed.");

      setSelectedOrder(null);
      await fetchDashboardData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Settings / WhatsApp number update
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (!supabase) throw new Error("Supabase is not initialized.");
      
      const { error: upsertErr } = await supabase
        .from("settings")
        .upsert({ key: "whatsapp_number", value: whatsappNumber }, { onConflict: "key" });

      if (upsertErr) throw upsertErr;
      alert("Settings updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Policy Publish Handler
  const handlePolicySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: policyForm.type,
          brand: "AETHEX"
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to publish policy.");
      alert("Policy published successfully using updated templates!");
      await fetchDashboardData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Review Moderation Handlers
  const handleApproveReview = async (id: string) => {
    setActionLoading(true);
    try {
      if (!supabase) throw new Error("Supabase client is not loaded.");
      const { error: revErr } = await supabase
        .from("reviews")
        .update({ is_approved: true })
        .eq("id", id);
      if (revErr) throw revErr;
      await fetchDashboardData();
    } catch (err: any) {
      setError(err.message || "Failed to approve review.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setActionLoading(true);
    try {
      if (!supabase) throw new Error("Supabase client is not loaded.");
      const { error: revErr } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);
      if (revErr) throw revErr;
      await fetchDashboardData();
    } catch (err: any) {
      setError(err.message || "Failed to delete review.");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper formats
  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 0 }).format(amount);
  };

  // Overview calculations
  const totalRevenue = orders
    .filter((o) => o.payment_status === "confirmed" || o.order_status === "delivered")
    .reduce((acc, curr) => acc + Number(curr.total), 0);

  const pendingOrdersCount = orders.filter((o) => o.order_status === "processing").length;
  const completedOrdersCount = orders.filter((o) => o.order_status === "delivered").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-silver/60 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <p className="text-xs uppercase tracking-widest">Loading Administrator Console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row relative overflow-hidden">
      {/* Background blobs */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0a0a]/80 backdrop-blur-md border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col justify-between relative z-10">
        <div className="space-y-8">
          <div className="text-left py-2 border-b border-white/5">
            <span className="text-[10px] text-silver/40 uppercase tracking-widest font-extrabold block">
              Control Center
            </span>
            <span className="text-white text-lg font-bold tracking-widest font-display">
              AETHEX<span className="text-white/40">CORE</span>
            </span>
          </div>

          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex-shrink-0 ${
                activeTab === "overview" ? "bg-white text-black font-bold" : "text-silver/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Overview
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex-shrink-0 ${
                activeTab === "products" ? "bg-white text-black font-bold" : "text-silver/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Package className="h-4 w-4" /> Products
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex-shrink-0 ${
                activeTab === "orders" ? "bg-white text-black font-bold" : "text-silver/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <ShoppingBag className="h-4 w-4" /> Orders ({pendingOrdersCount})
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex-shrink-0 ${
                activeTab === "customers" ? "bg-white text-black font-bold" : "text-silver/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" /> Customers
            </button>
            <button
              onClick={() => setActiveTab("policies")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex-shrink-0 ${
                activeTab === "policies" ? "bg-white text-black font-bold" : "text-silver/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <FileText className="h-4 w-4" /> Policies
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex-shrink-0 ${
                activeTab === "settings" ? "bg-white text-black font-bold" : "text-silver/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings className="h-4 w-4" /> Settings
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex-shrink-0 ${
                activeTab === "reviews" ? "bg-white text-black font-bold" : "text-silver/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <MessageSquare className="h-4 w-4" /> Reviews
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-all duration-300 mt-6"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative z-10 space-y-8 max-w-7xl mx-auto w-full">
        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-2xl text-xs text-red-400 flex items-start gap-2 max-w-3xl">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error Action:</span> {error}
            </div>
          </div>
        )}

        {/* Tab 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display">System Overview</h2>
              <p className="text-xs text-silver/60 font-light">Real-time statistics and commercial summaries.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="luxury-glass p-6 rounded-2xl">
                <span className="text-[10px] uppercase tracking-wider text-silver/40 font-bold block mb-1">Total Verified Revenue</span>
                <span className="text-2xl font-bold font-display text-white">{formatLKR(totalRevenue)}</span>
              </div>
              <div className="luxury-glass p-6 rounded-2xl">
                <span className="text-[10px] uppercase tracking-wider text-silver/40 font-bold block mb-1">Active Orders</span>
                <span className="text-2xl font-bold font-display text-white">{pendingOrdersCount}</span>
              </div>
              <div className="luxury-glass p-6 rounded-2xl">
                <span className="text-[10px] uppercase tracking-wider text-silver/40 font-bold block mb-1">Completed Shipments</span>
                <span className="text-2xl font-bold font-display text-white">{completedOrdersCount}</span>
              </div>
              <div className="luxury-glass p-6 rounded-2xl">
                <span className="text-[10px] uppercase tracking-wider text-silver/40 font-bold block mb-1">Registered Profiles</span>
                <span className="text-2xl font-bold font-display text-white">{customers.length}</span>
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="luxury-glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/5 pb-3 text-white/90">
                Recent Orders Queue
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-silver/40 uppercase font-bold">
                      <th className="py-3 pr-4">Order Ref ID</th>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="border-b border-white/5 text-silver/80">
                        <td className="py-3 pr-4 font-mono select-all text-white font-bold">{o.id.slice(0, 8)}...</td>
                        <td className="py-3 px-4 font-medium">{o.customer_name}</td>
                        <td className="py-3 px-4 font-mono">{o.customer_phone}</td>
                        <td className="py-3 px-4 text-right font-semibold text-white">{formatLKR(o.total)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                            o.order_status === "delivered" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                          }`}>
                            {o.order_status}
                          </span>
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setTrackingForm({
                                tracking_number: o.tracking_updates?.[0]?.tracking_number || "",
                                courier: o.tracking_updates?.[0]?.courier || "AliExpress",
                                order_status: o.order_status,
                                payment_status: o.payment_status
                              });
                            }}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PRODUCTS CRUD */}
        {activeTab === "products" && (
          <div className="space-y-8">
            <div className="flex justify-between items-baseline">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold font-display">Products Catalog</h2>
                <p className="text-xs text-silver/60 font-light">Add, edit, or configure mechanical accessories catalog.</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ title: "", description: "", price: "", original_price: "", image_url: "p1", source: "shopify", stock: "10" });
                  setIsProductModalOpen(true);
                }}
                className="apple-btn py-2.5 px-4 text-xs font-semibold uppercase tracking-wider"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="luxury-glass p-5 rounded-2xl flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="h-28 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 text-[9px] uppercase tracking-widest text-silver/30 font-extrabold relative overflow-hidden">
                      {p.image_url} Preview
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-white/30 border border-white/10 px-1.5 py-0.5 rounded font-semibold uppercase">{p.source}</span>
                      <h4 className="text-white text-sm font-semibold truncate mt-1">{p.title}</h4>
                      <p className="text-silver/50 text-xs font-light line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-silver/40 block">Price / Stock</span>
                      <span className="text-white text-sm font-bold">{formatLKR(p.price)}</span>
                      <span className="text-white/30 text-[10px] block">Qty: {p.stock}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setProductForm({
                            title: p.title,
                            description: p.description || "",
                            price: p.price.toString(),
                            original_price: p.original_price ? p.original_price.toString() : "",
                            image_url: p.image_url || "p1",
                            source: p.source || "shopify",
                            stock: p.stock.toString()
                          });
                          setIsProductModalOpen(true);
                        }}
                        className="p-2 bg-white/5 border border-white/5 hover:border-white/20 rounded-xl text-white transition"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 bg-red-950/20 border border-red-500/10 hover:border-red-500/30 rounded-xl text-red-400 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: ORDERS PROCESSOR */}
        {activeTab === "orders" && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display">Orders Manager</h2>
              <p className="text-xs text-silver/60 font-light">Process WhatsApp logs, ship goods, and update tracking hashes.</p>
            </div>

            <div className="luxury-glass rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-silver/40 uppercase font-bold">
                      <th className="py-3 pr-4">Order ID</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Order Status</th>
                      <th className="py-3 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-white/5 text-silver/80">
                        <td className="py-3 pr-4 font-mono select-all text-white font-bold">{o.id.slice(0, 8)}...</td>
                        <td className="py-3 px-4">{o.customer_name}</td>
                        <td className="py-3 px-4 font-mono">{o.customer_phone}</td>
                        <td className="py-3 px-4 font-semibold text-white">{formatLKR(o.total)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                            o.payment_status === "confirmed" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                          }`}>
                            {o.payment_status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                            o.order_status === "delivered" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                          }`}>
                            {o.order_status}
                          </span>
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setTrackingForm({
                                tracking_number: o.tracking_updates?.[0]?.tracking_number || "",
                                courier: o.tracking_updates?.[0]?.courier || "AliExpress",
                                order_status: o.order_status,
                                payment_status: o.payment_status
                              });
                            }}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: CUSTOMERS */}
        {activeTab === "customers" && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display">Customers Database</h2>
              <p className="text-xs text-silver/60 font-light">Client address logs and profile indexes.</p>
            </div>

            <div className="luxury-glass rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-silver/40 uppercase font-bold">
                      <th className="py-3 pr-4">Customer ID</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 pl-4">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-b border-white/5 text-silver/80">
                        <td className="py-3 pr-4 font-mono text-white/30">{c.id.slice(0, 8)}...</td>
                        <td className="py-3 px-4 font-medium text-white">{c.name}</td>
                        <td className="py-3 px-4 font-mono">{c.phone}</td>
                        <td className="py-3 px-4 font-mono">{c.email || "N/A"}</td>
                        <td className="py-3 pl-4 max-w-xs truncate">{c.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: POLICIES */}
        {activeTab === "policies" && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display">Policies Publishing Engine</h2>
              <p className="text-xs text-silver/60 font-light">Publish and rewrite brand conditions under AETHEX templates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Policies List */}
              <div className="luxury-glass rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/5 pb-3">Active Agreements</h3>
                <div className="space-y-3">
                  {policies.map((pol) => (
                    <div key={pol.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">{pol.title}</h4>
                        <span className="text-[9px] text-silver/40 font-mono">Type: {pol.type}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[9px] font-bold uppercase">Active</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publish Template Form */}
              <div className="luxury-glass rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/5 pb-3 mb-4">Publish/Re-Seed Policy</h3>
                <form onSubmit={handlePolicySubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">Policy Category</label>
                    <select
                      value={policyForm.type}
                      onChange={(e) => setPolicyForm({ ...policyForm, type: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="shipping">Shipping & Fulfillment Policy</option>
                      <option value="refund">Refund & Replacement Guarantee</option>
                      <option value="terms">Terms of Service</option>
                      <option value="privacy">Privacy Policy</option>
                      <option value="cookies">Cookie Policy</option>
                    </select>
                  </div>

                  <p className="text-[10px] text-silver/40 leading-relaxed bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                    Publishing a category will fetch the brand-aligned luxury copy template, populate variables, and save it active in the database.
                  </p>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="apple-btn text-xs py-3 w-full justify-center"
                  >
                    {actionLoading ? "Publishing template..." : "Publish Agreement Template"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display">System Settings</h2>
              <p className="text-xs text-silver/60 font-light">Manage client-facing parameters and API config constants.</p>
            </div>

            <div className="luxury-glass rounded-2xl p-6 max-w-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/5 pb-3 mb-6">WhatsApp Parameters</h3>
              <form onSubmit={handleSettingsSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">WhatsApp Recipient Number</label>
                  <input
                    type="text"
                    required
                    placeholder="94771234567"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono"
                  />
                  <p className="text-[9px] text-silver/40 mt-1.5 leading-normal">
                    Format: Country code + phone code without space or special symbols (e.g. 94771234567). This controls the default deep link checkout target.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="apple-btn text-xs py-3 w-full justify-center"
                >
                  {actionLoading ? "Updating settings..." : "Save Configuration"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 7: REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display">Reviews Moderation</h2>
              <p className="text-xs text-silver/60 font-light">Moderate customer ratings and approve/reject review listings.</p>
            </div>

            <div className="luxury-glass rounded-2xl p-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-silver/40 text-xs">No customer reviews logged yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-silver/40 uppercase font-bold">
                        <th className="py-3 pr-4">Product Name</th>
                        <th className="py-3 px-4">Author</th>
                        <th className="py-3 px-4">Rating</th>
                        <th className="py-3 px-4">Comment</th>
                        <th className="py-3 px-4">Moderation</th>
                        <th className="py-3 pl-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((r) => (
                        <tr key={r.id} className="border-b border-white/5 text-silver/80">
                          <td className="py-3 pr-4 font-semibold text-white truncate max-w-[150px]">{r.products?.title || "Unknown Item"}</td>
                          <td className="py-3 px-4 font-medium">{r.customer_name}</td>
                          <td className="py-3 px-4 text-yellow-400 font-bold">{r.rating} ★</td>
                          <td className="py-3 px-4 max-w-xs truncate">{r.comment || "No comment"}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                              r.is_approved ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                            }`}>
                              {r.is_approved ? "Approved" : "Pending"}
                            </span>
                          </td>
                          <td className="py-3 pl-4 text-right flex justify-end gap-2 items-center">
                            {!r.is_approved && (
                              <button
                                onClick={() => handleApproveReview(r.id)}
                                className="px-2.5 py-1 bg-white text-black hover:bg-gray-200 transition text-[9px] font-bold uppercase rounded-lg"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="p-2 bg-red-950/20 border border-red-500/10 hover:border-red-500/30 rounded-xl text-red-400 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: Product Add/Edit */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="luxury-glass w-full max-w-xl rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative border border-white/10">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold font-display border-b border-white/5 pb-3">
              {editingProduct ? "Edit Accessory" : "Add Accessory Item"}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">Feed Source</label>
                  <select
                    value={productForm.source}
                    onChange={(e) => setProductForm({ ...productForm, source: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="shopify">Shopify Catalog</option>
                    <option value="aliexpress">AliExpress</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">Price (LKR)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">Strike Price (Optional)</label>
                  <input
                    type="number"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">Image Code</label>
                  <select
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="p1">Preview Code 01 (p1)</option>
                    <option value="p2">Preview Code 02 (p2)</option>
                    <option value="p3">Preview Code 03 (p3)</option>
                    <option value="p4">Preview Code 04 (p4)</option>
                    <option value="p5">Preview Code 05 (p5)</option>
                    <option value="p6">Preview Code 06 (p6)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="apple-btn text-xs py-3.5 w-full justify-center mt-4"
              >
                {actionLoading ? "Saving details..." : "Save Product Configuration"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Order Status Update */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="luxury-glass w-full max-w-xl rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative border border-white/10">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[10px] text-silver/40 uppercase tracking-wider block font-bold">Fulfillment Details</span>
              <h3 className="text-lg font-bold font-display text-white mt-1">
                Order Ref: {selectedOrder.id.slice(0, 8)}...
              </h3>
            </div>

            {/* Customer info snapshot */}
            <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-xs space-y-2.5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-silver/40 block text-[9px] uppercase font-bold">Client Name</span>
                  <span className="text-white font-medium">{selectedOrder.customer_name}</span>
                </div>
                <div>
                  <span className="text-silver/40 block text-[9px] uppercase font-bold">WhatsApp Connection</span>
                  <a href={`https://wa.me/${selectedOrder.customer_phone.replace(/[^0-9]/g, "")}`} target="_blank" className="text-green-400 font-mono underline block">
                    {selectedOrder.customer_phone}
                  </a>
                </div>
              </div>
              <div>
                <span className="text-silver/40 block text-[9px] uppercase font-bold">Delivery Address</span>
                <span className="text-white font-light">{selectedOrder.customer_address}</span>
              </div>
              {selectedOrder.notes && (
                <div>
                  <span className="text-silver/40 block text-[9px] uppercase font-bold">Client Notes</span>
                  <span className="text-white font-light">{selectedOrder.notes}</span>
                </div>
              )}
            </div>

            {/* Tracking / status updates form */}
            <form onSubmit={handleOrderTrackingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">Payment Status</label>
                  <select
                    value={trackingForm.payment_status}
                    onChange={(e) => setTrackingForm({ ...trackingForm, payment_status: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="pending">Pending Payment Verification</option>
                    <option value="confirmed">Confirmed / Received</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">Order Status</label>
                  <select
                    value={trackingForm.order_status}
                    onChange={(e) => setTrackingForm({ ...trackingForm, order_status: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped / In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">Tracking Number</label>
                  <input
                    type="text"
                    placeholder="Enter tracked package hash"
                    value={trackingForm.tracking_number}
                    onChange={(e) => setTrackingForm({ ...trackingForm, tracking_number: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">Courier Carrier</label>
                  <input
                    type="text"
                    placeholder="AliExpress, DSers, etc."
                    value={trackingForm.courier}
                    onChange={(e) => setTrackingForm({ ...trackingForm, courier: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="apple-btn text-xs py-3.5 w-full justify-center mt-4"
              >
                {actionLoading ? "Processing changes..." : "Save Order Fulfillment Setup"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
