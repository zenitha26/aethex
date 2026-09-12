"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LineChart,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { audioEngine } from "@/lib/audio";

interface AdminSidebarProps {
  adminEmail: string;
  adminRole?: string;
}

export default function AdminSidebar({ adminEmail, adminRole = "Master Admin" }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      audioEngine.playSelect();
    } catch {}
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Orders & Verification", href: "/admin/orders", icon: ShoppingBag },
    { name: "Product Registry", href: "/admin/products", icon: Package },
    { name: "Collector Profiles", href: "/admin/customers", icon: Users },
    { name: "Financial Analytics", href: "/admin/analytics", icon: LineChart },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#050505] z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white text-sm font-mono font-bold tracking-widest">
            AETHEX<span className="text-white/40">CORE</span>
          </span>
        </div>
        <button 
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            try { audioEngine.playSelect(); } catch {}
          }} 
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-[#0B0B0B] border-r border-white/10 p-6 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out backdrop-blur-xl h-screen shrink-0
      `}>
        <div className="space-y-6">
          <div className="hidden md:block text-left py-2 border-b border-white/5">
            <span className="text-[9px] text-white/40 uppercase tracking-[0.25em] font-mono font-bold block mb-1">
              TREASURY COMMAND DESK
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="text-white text-sm font-mono font-bold tracking-widest">
                AETHEX<span className="text-white/40">CORE</span>
              </span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    try { audioEngine.playSelect(); } catch {}
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-white text-black font-bold shadow-lg"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/5 mt-auto">
          {/* Admin Identity Card */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
              {adminEmail ? adminEmail.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-mono font-semibold truncate text-white">{adminEmail}</span>
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{adminRole}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex w-full items-center justify-between px-4 py-2 rounded-xl text-[11px] font-mono uppercase tracking-wider text-white/50 hover:text-white hover:bg-white/5 transition"
            >
              <span>Public Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2 rounded-xl text-[11px] font-mono uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition border border-transparent hover:border-red-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
