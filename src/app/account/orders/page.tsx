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
        <h1 className="text-3xl font-display font-bold text-[#111111] mb-2">Order History</h1>
        <p className="text-gray-600">View all your previous purchases.</p>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <p className="text-gray-500 italic">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                <div>
                  <p className="font-semibold text-lg tracking-wide text-[#111111]">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-2xl font-bold font-display text-[#111111]">LKR {order.total.toLocaleString()}</p>
                  <div className="mt-1">
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-bold ${
                      order.order_status === "delivered" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      order.order_status === "processing" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}>
                      {order.order_status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1 uppercase tracking-widest text-xs font-bold">Shipping Address</p>
                  <p className="text-gray-800">{order.customer_address}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 uppercase tracking-widest text-xs font-bold">Contact</p>
                  <p className="text-gray-800">{order.customer_phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
