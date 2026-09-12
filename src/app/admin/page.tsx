"use client";

import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "../../lib/supabase/client";

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch Orders
        const { data: ordersData, error: ordersErr } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (ordersErr) throw ordersErr;

        // Fetch Customers
        const { count: customersCount, error: custErr } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        if (custErr) throw custErr;

        const orders = ordersData || [];
        const totalRevenue = orders
          .filter((o) => o.payment_status === "confirmed" || o.order_status === "delivered")
          .reduce((acc, curr) => acc + Number(curr.total), 0);

        const activeOrders = orders.filter((o) => o.order_status === "processing").length;
        const completedOrders = orders.filter((o) => o.order_status === "delivered").length;

        setStats({
          totalRevenue,
          activeOrders,
          completedOrders,
          totalCustomers: customersCount || 0
        });

        setRecentOrders(orders.slice(0, 5));

      } catch (err: any) {
        setError(err.message || "Failed to load overview data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [supabase]);

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-silver/60 gap-4">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <p className="text-xs uppercase tracking-widest">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-2xl text-xs text-red-400 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="luxury-glass p-6 rounded-2xl">
          <span className="text-[10px] uppercase tracking-wider text-silver/40 font-bold block mb-1">Total Verified Revenue</span>
          <span className="text-2xl font-bold font-display text-white">{formatLKR(stats.totalRevenue)}</span>
        </div>
        <div className="luxury-glass p-6 rounded-2xl">
          <span className="text-[10px] uppercase tracking-wider text-silver/40 font-bold block mb-1">Active Orders</span>
          <span className="text-2xl font-bold font-display text-white">{stats.activeOrders}</span>
        </div>
        <div className="luxury-glass p-6 rounded-2xl">
          <span className="text-[10px] uppercase tracking-wider text-silver/40 font-bold block mb-1">Completed Shipments</span>
          <span className="text-2xl font-bold font-display text-white">{stats.completedOrders}</span>
        </div>
        <div className="luxury-glass p-6 rounded-2xl">
          <span className="text-[10px] uppercase tracking-wider text-silver/40 font-bold block mb-1">Registered Profiles</span>
          <span className="text-2xl font-bold font-display text-white">{stats.totalCustomers}</span>
        </div>
      </div>

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
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 text-silver/80">
                  <td className="py-3 pr-4 font-mono select-all text-white font-bold">{o.id.slice(0, 8)}...</td>
                  <td className="py-3 px-4 font-medium">{o.customer_name}</td>
                  <td className="py-3 px-4 text-right font-semibold text-white">{formatLKR(o.total)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                      o.order_status === "delivered" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {o.order_status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-silver/40">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
