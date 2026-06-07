import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Package, Settings } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-2">
          <div className="mb-8 px-4">
            <h2 className="text-xl font-display font-bold">My Account</h2>
            <p className="text-white/50 text-sm truncate">{user.email || user.phone}</p>
          </div>
          
          <nav className="space-y-1">
            <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
              <User className="w-5 h-5 text-white/60" />
              <span>Dashboard</span>
            </Link>
            <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
              <Package className="w-5 h-5 text-white/60" />
              <span>Orders</span>
            </Link>
            <Link href="/account/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
              <Settings className="w-5 h-5 text-white/60" />
              <span>Profile Settings</span>
            </Link>
            <div className="pt-8 border-t border-white/5 mt-8">
              <LogoutButton />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-10 min-h-[500px]">
          {children}
        </main>
      </div>
    </div>
  );
}
