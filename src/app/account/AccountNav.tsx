"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Heart, Settings, Award } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { audioEngine } from "@/lib/audio";

export default function AccountNav() {
  const pathname = usePathname();
  const { wishlist, setWishlistOpen } = useWishlistStore();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      audioEngine.playSelect();
    } catch {}
    setWishlistOpen(true);
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/account",
      icon: LayoutDashboard,
      active: pathname === "/account",
    },
    {
      name: "My Orders",
      href: "/account/orders",
      icon: ShoppingBag,
      active: pathname === "/account/orders",
    },
    {
      name: "Loyalty & Rewards",
      href: "/account/rewards",
      icon: Award,
      active: pathname === "/account/rewards",
    },
    {
      name: "Wishlist",
      href: "#wishlist",
      icon: Heart,
      active: false,
      onClick: handleWishlistClick,
      badge: wishlist.length > 0 ? wishlist.length : undefined,
    },
    {
      name: "Account Settings",
      href: "/account/settings",
      icon: Settings,
      active: pathname === "/account/settings",
    },
  ];

  return (
    <nav className="space-y-1.5 font-sans">
      {navItems.map((item) => {
        const Icon = item.icon;
        const className = `w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
          item.active
            ? "bg-white/[0.08] text-white shadow-xs"
            : "text-white/60 hover:text-white hover:bg-white/[0.06]"
        }`;

        if (item.onClick) {
          return (
            <button
              key={item.name}
              type="button"
              onClick={item.onClick}
              className={className}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-white/70" />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className="text-[10px] font-mono font-bold bg-white text-black px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        }

        return (
          <Link key={item.name} href={item.href} className={className}>
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-white/70" />
              <span>{item.name}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
