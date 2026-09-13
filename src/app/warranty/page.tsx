export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import PolicySection from "../../components/legal/PolicySection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Warranty Policy & Hardware Coverage | AETHEX STORE",
  description: "Official warranty terms, category durations, and claims procedures for AETHEX cockpit hardware, power stations, EDC tools, and lossless audio in Sri Lanka.",
};

export default function WarrantyPage() {
  return (
    <LegalPageLayout
      title="Warranty Policy"
      subtitle="Honest, realistic warranty guidelines and coverage tiers across all hardware products distributed by AETHEX STORE."
      lastUpdated="September 2026"
    >
      <PolicySection index="01 //" title="Hardware Warranty Tiers">
        <p>
          AETHEX STORE backs every product with a clear, manufacturer-supported or store-backed warranty. The specific warranty period is tied directly to the engineering class of the hardware:
        </p>
        <div className="border border-white/10 bg-[#0B0B0B] p-5 space-y-4 my-3 text-xs font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2.5">
            <span className="text-white font-medium">AETHEX MagDrive, Cockpit HUD, EP10 Buds, Soundbar</span>
            <span className="text-white bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold">1-YEAR OFFICIAL WARRANTY</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2.5">
            <span className="text-white font-medium">LDNIO 2500W Power Station & ASPOR 20K Power Bank</span>
            <span className="text-white bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold">1-YEAR OFFICIAL WARRANTY</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2.5">
            <span className="text-white font-medium">AETHEX Titanium EDC Precision Screwdriver Kit</span>
            <span className="text-white bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold">LIFETIME HANDLE GUARANTEE</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2.5">
            <span className="text-white font-medium">LDNIO 65W GaN Braided Cable & R8 Mouse</span>
            <span className="text-white bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold">6-MONTH REPLACEMENT</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <span className="text-white font-medium">ASPOR A711 Mechanical Console Mount</span>
            <span className="text-white bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold">7-DAY INSPECTION REPLACEMENT</span>
          </div>
        </div>
        <p className="text-[11px] text-white/50">
          All items are additionally covered by our universal 7-day doorstep inspection guarantee for defects out of the box.
        </p>
      </PolicySection>

      <PolicySection index="02 //" title="What is Covered Under Warranty">
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li><strong>Mechanical & Articulating Joints:</strong> Dial tension gears, ball-pivot stability, and clamp springs failing under normal rated device loads.</li>
          <li><strong>Qi2 & MagSafe Inductive Charging:</strong> Internal induction coil failure, active cooling malfunctions, or sudden charging interruption.</li>
          <li><strong>Digital Telemetry & OLED Displays:</strong> Barometric pressure sensor calibration faults or dead display pixels on Cockpit HUD devices.</li>
          <li><strong>Audio Acoustics & Wireless Drivers:</strong> 11mm acoustic driver failure, Bluetooth 5.3 connection drops, or active noise cancellation microphone faults on EP10 earbuds.</li>
          <li><strong>Power IC & Circuitry:</strong> Port power output failure, USB-C Power Delivery negotiation faults, or internal fuse trips on LDNIO power strips.</li>
        </ul>
      </PolicySection>

      <PolicySection index="03 //" title="What is Not Covered">
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li>Physical structural breakage caused by vehicle collisions, accidental phone drops, or excessive manual force.</li>
          <li>Liquid ingress, water immersion, or exposure to corrosive industrial solvents (unless rated under IPX certified specifications).</li>
          <li>Unauthorized hardware disassembly, tampering, modifications, or third-party repair attempts.</li>
          <li>Natural cosmetic wear, surface abrasions, bit wear from stripped screw heads, or dirt accumulation from daily vehicle use.</li>
          <li>Use of uncertified high-voltage power supplies or improper electrical sources exceeding rated parameters.</li>
        </ul>
      </PolicySection>

      <PolicySection index="04 //" title="Warranty Claim Procedure">
        <p>
          To make an official warranty claim under this policy:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-white/80">
          <li>
            <strong>Contact Support:</strong> Message our Colombo technical support desk on WhatsApp at <span className="text-white font-medium">+94 78 234 9954</span> or email <span className="text-white font-medium">support@aethexstore.com</span>.
          </li>
          <li>
            <strong>Provide Proof of Purchase:</strong> State your Order ID, customer phone number, or delivery receipt.
          </li>
          <li>
            <strong>Demonstrate the Fault:</strong> Provide a brief video clip clearly illustrating the functional or electrical defect.
          </li>
          <li>
            <strong>Resolution:</strong> Valid warranty claims will be serviced via an immediate replacement unit dispatched to your address or factory servicing.
          </li>
        </ol>
      </PolicySection>

      <PolicySection index="05 //" title="Brand & Manufacturer Distinction">
        <p>
          AETHEX STORE operates as an independent hardware curator, designer, and direct distributor. Proprietary items (MagDrive, Cockpit HUD, Titanium EDC) are warrantied directly by AETHEX Labs. Brand-partner products (ASPOR, LDNIO, R8) are backed in partnership with authorized regional suppliers to guarantee authentic, reliable coverage in Sri Lanka.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
