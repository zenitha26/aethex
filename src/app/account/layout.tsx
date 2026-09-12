import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "./LogoutButton";
import AccountNav from "./AccountNav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Client";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 bg-white/[0.02] backdrop-blur-md border border-white/5 md:border-r md:border-t-0 md:border-b-0 md:border-l-0 rounded-2xl md:rounded-none p-6 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            {/* User Identity Pill */}
            <div className="pb-6 border-b border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white text-black font-mono font-bold flex items-center justify-center text-sm shadow-sm">
                    {userInitial}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-white tracking-wide truncate">
                    {displayName}
                  </h2>
                  <p className="text-white/40 text-xs truncate">
                    {user.email || user.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <AccountNav />
          </div>

          {/* Sign Out Section */}
          <div className="pt-6 border-t border-white/5">
            <LogoutButton />
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

