"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Menu,
  X,
  LineChart,
  LogOut
} from "lucide-react";
import { createClient } from "../../lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAdminEmail(user.email || "Admin");
      }
    }
    checkUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: LineChart },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col md:flex-row relative overflow-hidden font-sans">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white z-50 relative">
        <span className="text-[#111111] text-lg font-bold tracking-widest font-display">
          AETHEX<span className="text-gray-400">CORE</span>
        </span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6 text-black" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-[#F9F9F9] border-r border-gray-200 p-6 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out
      `}>
        <div className="space-y-8">
          <div className="hidden md:block text-left py-2 border-b border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold block">
              Control Center
            </span>
            <span className="text-[#111111] text-lg font-bold tracking-widest font-display">
              AETHEX<span className="text-gray-400">CORE</span>
            </span>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-black text-white shadow-xs"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
              {adminEmail.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold truncate text-[#111111]">{adminEmail}</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-wider">Administrator</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Topbar */}
        <header className="hidden md:flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h1 className="text-sm font-bold font-display tracking-widest uppercase text-[#111111]">
            {navItems.find(i => i.href === pathname)?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-gray-600 hover:text-black transition uppercase tracking-widest font-semibold flex items-center gap-2">
              View Store
            </Link>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F9F9F9]">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
