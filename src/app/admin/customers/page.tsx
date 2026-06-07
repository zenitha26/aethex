"use client";

import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, Search } from "lucide-react";
import { createClient } from "../../../lib/supabase/client";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const { data, error: err } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (err) throw err;
        setCustomers(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load customers.");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, [supabase]);

  const filteredCustomers = customers.filter(c => 
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-silver/60 gap-4">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <p className="text-xs uppercase tracking-widest">Loading Customers...</p>
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display">Customers Directory</h2>
          <p className="text-xs text-silver/60 font-light">
            Manage registered store profiles and their associated roles.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search email, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/40 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      <div className="luxury-glass rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 text-silver/40 uppercase font-bold">
                <th className="py-3 pr-4">Profile ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 pl-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="border-b border-white/5 text-silver/80">
                  <td className="py-3 pr-4 font-mono select-all text-white/40">{c.id.slice(0, 8)}...</td>
                  <td className="py-3 px-4 font-medium text-white">{c.full_name || "Guest"}</td>
                  <td className="py-3 px-4">{c.email || "N/A"}</td>
                  <td className="py-3 px-4 font-mono">{c.phone || "N/A"}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                      c.role === "admin" ? "bg-purple-500/10 text-purple-400" : "bg-white/5 text-silver/60"
                    }`}>
                      {c.role || "customer"}
                    </span>
                  </td>
                  <td className="py-3 pl-4 text-silver/60 font-mono">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-silver/40">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
