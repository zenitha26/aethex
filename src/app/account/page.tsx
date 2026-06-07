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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Welcome, {profile?.full_name || user?.email?.split("@")[0] || "User"}!</h1>
        <p className="text-white/50">Manage your orders and personal details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-white/50 text-sm mb-1 uppercase tracking-widest font-bold">Total Orders</p>
          <p className="text-4xl font-display font-bold">{totalOrders}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-white/50 text-sm mb-1 uppercase tracking-widest font-bold">Total Spent</p>
          <p className="text-4xl font-display font-bold">{formattedSpent}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-display font-bold mb-4">Recent Orders</h2>
        {totalOrders === 0 ? (
          <p className="text-white/40 italic">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders?.slice(0, 3).map((order) => (
              <div key={order.id} className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl p-4">
                <div>
                  <p className="font-semibold tracking-wide">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-white/50">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">LKR {order.total.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold ${
                    order.order_status === "delivered" ? "bg-green-500/10 text-green-400" :
                    order.order_status === "processing" ? "bg-blue-500/10 text-blue-400" :
                    "bg-white/10 text-white/60"
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
