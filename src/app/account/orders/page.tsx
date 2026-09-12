export const runtime = 'edge';

import { createClient } from "../../../lib/supabase/server";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-10 font-sans">
      <div className="space-y-1 pb-6 border-b border-white/5">
        <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-tight text-white font-mono">
          Order History
        </h1>
        <p className="text-white/60 text-sm leading-relaxed">
          Comprehensive telemetry of all your hardware acquisitions and shipment status.
        </p>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
          <p className="text-white/50 text-sm font-mono">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <p className="font-mono font-semibold text-base tracking-wide text-white">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs font-mono text-white/50">
                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-mono font-bold text-white">
                    LKR {order.total.toLocaleString()}
                  </p>
                  <div className="mt-1">
                    <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono font-bold border ${
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
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono flex-1">
                  <div className="space-y-1">
                    <p className="text-white/40 uppercase tracking-widest text-[10px] font-semibold">Shipping Address</p>
                    <p className="text-white/80 leading-relaxed">{order.customer_address || "Standard Courier Delivery"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white/40 uppercase tracking-widest text-[10px] font-semibold">Contact Details</p>
                    <p className="text-white/80">{order.customer_phone || "—"}</p>
                  </div>
                </div>
                <a
                  href={`/account/orders/${order.id}`}
                  className="px-4 py-2 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider transition"
                >
                  {order.order_status === "pending_payment" ? "Upload Slip →" : "View Details →"}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
