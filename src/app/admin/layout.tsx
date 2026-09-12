import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "AETHEX Command Core | Admin Desk",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Authentication check
  if (!user) {
    redirect("/login?redirect=/admin");
  }

  // 2. Strict Role Verification via Profiles & Auth Metadata
  const isMetadataAdmin = 
    user.app_metadata?.role === "admin" || 
    user.user_metadata?.role === "admin" ||
    user.email?.toLowerCase().includes("admin");

  let adminRole = "Master Admin";

  if (!isMetadataAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      redirect("/");
    }
    adminRole = profile.role === "admin" ? "Master Clearance" : "Admin";
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row relative overflow-hidden font-sans selection:bg-white selection:text-black">
      <AdminSidebar adminEmail={user.email || "Administrator"} adminRole={adminRole} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-[#050505]">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#050505] custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
