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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Order History</h1>
        <p className="text-white/50">View all your previous purchases.</p>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-white/40 italic">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                <div>
                  <p className="font-semibold text-lg tracking-wide">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-white/50">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-2xl font-bold font-display">LKR {order.total.toLocaleString()}</p>
                  <div className="mt-1">
                    <span className={`inline-block text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold ${
                      order.order_status === "delivered" ? "bg-green-500/10 text-green-400" :
                      order.order_status === "processing" ? "bg-blue-500/10 text-blue-400" :
                      "bg-white/10 text-white/60"
                    }`}>
                      {order.order_status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/40 mb-1 uppercase tracking-widest text-xs font-bold">Shipping Address</p>
                  <p className="text-white/80">{order.customer_address}</p>
                </div>
                <div>
                  <p className="text-white/40 mb-1 uppercase tracking-widest text-xs font-bold">Contact</p>
                  <p className="text-white/80">{order.customer_phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
