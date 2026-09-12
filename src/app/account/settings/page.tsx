"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check, AlertCircle, Loader2, User, Mail, Phone, Bell } from "lucide-react";
import { audioEngine } from "../../../lib/audio";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Preferences
  const [newsletter, setNewsletter] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || "");
          
          const fullName = user.user_metadata?.full_name || "";
          const nameParts = fullName.trim().split(" ");
          setFirstName(nameParts[0] || "");
          setLastName(nameParts.slice(1).join(" ") || "");

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (profile) {
            if (profile.full_name) {
              const parts = profile.full_name.trim().split(" ");
              setFirstName(parts[0] || "");
              setLastName(parts.slice(1).join(" ") || "");
            }
            if (profile.phone) setPhone(profile.phone);
          }
        }
      } catch (err) {
        console.error("Error loading account profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      audioEngine.playSelect();
    } catch {}

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User session expired. Please sign in again.");

      const combinedFullName = `${firstName} ${lastName}`.trim();

      // Update Supabase profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: combinedFullName,
          phone,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Also update auth user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: combinedFullName,
          first_name: firstName,
          last_name: lastName,
          newsletter_opt_in: newsletter,
          sms_opt_in: smsNotifications,
        },
      });

      try {
        audioEngine.playAcquire();
      } catch {}

      setMessage({ text: "Account settings saved successfully.", type: "success" });
      router.refresh();
    } catch (err: any) {
      console.error("Profile update error:", err);
      setMessage({ text: err?.message || "Failed to update account settings.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-white/5 rounded-xl" />
        <div className="h-64 bg-white/[0.02] border border-white/5 rounded-3xl" />
        <div className="h-48 bg-white/[0.02] border border-white/5 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-3xl font-sans">
      {/* Page Header */}
      <div className="space-y-1 pb-6 border-b border-white/5">
        <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-tight text-white font-mono">
          Account Settings
        </h1>
        <p className="text-white/60 text-sm leading-relaxed">
          Manage your personal information, contact credentials, and communication preferences.
        </p>
      </div>

      {/* Status Feedback Toast / Banner */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-mono border flex items-center gap-3 transition-all ${
            message.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-300"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
          }`}
        >
          {message.type === "error" ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          ) : (
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          )}
          <span className="flex-1 leading-relaxed">{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-white/40 hover:text-white p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1: Personal Information */}
        <section className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
            <User className="w-4 h-4 text-white/70" />
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] font-semibold text-white">
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Alexander"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-white/20 transition-all text-sm outline-none"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Silva"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-white/20 transition-all text-sm outline-none"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-white/60 block flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-white/40 lowercase">verified</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white/60 text-sm cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                Phone Number (Dispatch & COD)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +94 77 123 4567"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-white/20 transition-all text-sm outline-none font-mono"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: Preferences */}
        <section className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
            <Bell className="w-4 h-4 text-white/70" />
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] font-semibold text-white">
              Communication Preferences
            </h2>
          </div>

          <div className="space-y-5">
            {/* Newsletter Toggle */}
            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
              <div className="space-y-1 pr-4">
                <div className="text-sm font-medium text-white">Priority Droplist & Hardware Releases</div>
                <div className="text-xs text-white/60 leading-relaxed">
                  Receive private access keys, restock alerts, and industrial engineering updates.
                </div>
              </div>
              <div className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40" />
              </div>
            </label>

            {/* SMS Notifications Toggle */}
            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
              <div className="space-y-1 pr-4">
                <div className="text-sm font-medium text-white">SMS Courier Dispatch Alerts</div>
                <div className="text-xs text-white/60 leading-relaxed">
                  Receive real-time courier tracking numbers and waypoint notifications via SMS.
                </div>
              </div>
              <div className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40" />
              </div>
            </label>
          </div>
        </section>

        {/* Submit Actions with maximum negative space */}
        <div className="pt-4 flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-white text-black hover:bg-gray-200 rounded-full px-6 py-3 font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
