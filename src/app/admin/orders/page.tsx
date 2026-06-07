"use client";

import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { createClient } from "../../../lib/supabase/client";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusForm, setStatusForm] = useState({
    order_status: "",
    payment_status: ""
  });
  
  const supabase = createClient();

  const fetchOrders = async () => {
    try {
      const { data, error: err } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Real-time subscription for new orders
    const ordersSubscription = supabase
      .channel("orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, [supabase]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    try {
      const { error: updateErr } = await supabase
        .from("orders")
        .update({
          order_status: statusForm.order_status,
          payment_status: statusForm.payment_status,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedOrder.id);

      if (updateErr) throw updateErr;

      setSelectedOrder(null);
      fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to update order");
    }
  };

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-silver/60 gap-4">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <p className="text-xs uppercase tracking-widest">Loading Orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-2xl text-xs text-red-400 flex items-start gap-2 mb-6">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display">Orders Manager</h2>
          <p className="text-xs text-silver/60 font-light">
            Real-time feed of all synced Shopify and local orders.
          </p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchOrders(); }}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="luxury-glass rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 text-silver/40 uppercase font-bold">
                <th className="py-3 pr-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 text-silver/80">
                  <td className="py-3 pr-4 font-mono select-all text-white font-bold">{o.id.toString().slice(0, 8)}...</td>
                  <td className="py-3 px-4 font-mono text-silver/60">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">{o.customer_name}</td>
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
                      o.order_status === "delivered" ? "bg-green-500/10 text-green-400" : 
                      o.order_status === "shipped" ? "bg-blue-500/10 text-blue-400" :
                      "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {o.order_status || "pending"}
                    </span>
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(o);
                        setStatusForm({
                          order_status: o.order_status || "pending",
                          payment_status: o.payment_status || "pending"
                        });
                      }}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-silver/40">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="luxury-glass p-6 md:p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold font-display mb-1">Update Order</h3>
            <p className="text-xs text-silver/50 mb-6 font-mono">Ref: {selectedOrder.id}</p>
            
            <form onSubmit={handleUpdateStatus} className="space-y-5">
              <div>
                <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">
                  Payment Status
                </label>
                <select
                  value={statusForm.payment_status}
                  onChange={(e) => setStatusForm({ ...statusForm, payment_status: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed / Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">
                  Order Status
                </label>
                <select
                  value={statusForm.order_status}
                  onChange={(e) => setStatusForm({ ...statusForm, order_status: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white border border-white/10 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-white/90 transition"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
