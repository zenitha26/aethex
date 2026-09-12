export const runtime = 'edge';

import { createClient } from "../../lib/supabase/server";

export default async function AccountDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  // Fetch Orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const totalOrders = orders?.length || 0;
  const totalSpent = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

  const formattedSpent = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0
  }).format(totalSpent);

  return (
    <div className="space-y-10 font-sans">
      <div className="space-y-1 pb-6 border-b border-white/5">
        <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-tight text-white font-mono">
          Welcome, {profile?.full_name || user?.email?.split("@")[0] || "Client"}
        </h1>
        <p className="text-white/60 text-sm leading-relaxed">
          Access your fleet telemetry, hardware configurations, and past dispatches.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-2">
          <p className="text-white/40 text-xs uppercase tracking-widest font-mono font-semibold">Total Orders</p>
          <p className="text-4xl font-mono font-bold text-white">{totalOrders}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-2">
          <p className="text-white/40 text-xs uppercase tracking-widest font-mono font-semibold">Total Invested</p>
          <p className="text-4xl font-mono font-bold text-white">{formattedSpent}</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-[0.2em] font-semibold text-white">
          Recent Dispatches
        </h2>
        {totalOrders === 0 ? (
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl text-center">
            <p className="text-white/50 text-sm font-mono">No hardware dispatches logged yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders?.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all rounded-2xl p-5 backdrop-blur-xl"
              >
                <div className="space-y-1">
                  <p className="font-mono font-semibold text-sm tracking-wide text-white">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs font-mono text-white/50">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <p className="font-mono font-bold text-white text-sm">
                    LKR {order.total.toLocaleString()}
                  </p>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono font-bold border ${
                    order.order_status === "delivered"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : order.order_status === "processing"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-white/5 text-white/60 border-white/10"
                  }`}>
                    {order.order_status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
