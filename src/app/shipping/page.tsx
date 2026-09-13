export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import PolicySection from "../../components/legal/PolicySection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | AETHEX STORE",
  description: "Information on islandwide courier delivery, Cash on Delivery, Bank Transfer dispatch, shipping charges, and delivery timelines across Sri Lanka.",
};

export default function ShippingPage() {
  return (
    <LegalPageLayout
      title="Shipping & Delivery"
      subtitle="How AETHEX STORE packages, dispatches, and delivers hardware to your doorstep across all 25 districts of Sri Lanka."
      lastUpdated="September 2026"
    >
      <PolicySection index="01 //" title="Islandwide Delivery Coverage">
        <p>
          We deliver physical hardware to all 25 administrative districts of Sri Lanka via established domestic courier services (including Colombo, Gampaha, Kalutara, Kandy, Galle, Matara, Kurunegala, Jaffna, Anuradhapura, Ratnapura, and surrounding regional hubs). Every parcel is secured in multi-layered, tamper-evident shockproof packaging.
        </p>
      </PolicySection>

      <PolicySection index="02 //" title="Estimated Delivery Times">
        <p>
          Orders confirmed (either via Cash on Delivery or verified Direct Bank Transfer slip) before 2:00 PM on business days are packaged and handed over to courier dispatch the same day:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li><strong>Western Province (Colombo, Gampaha, Kalutara):</strong> 24 to 48 hours.</li>
          <li><strong>Major Urban Hubs & Central/Southern Corridors (Kandy, Galle, Kurunegala, Matara):</strong> 2 to 3 business days.</li>
          <li><strong>Northern, Eastern & Outstation Districts:</strong> 3 to 4 business days.</li>
        </ul>
        <p className="text-[11px] text-white/50">
          Note: Deliveries may experience minor transit delays during extreme weather, public holidays, or unforeseen expressway closures.
        </p>
      </PolicySection>

      <PolicySection index="03 //" title="Delivery Charges">
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li><strong>Single Unit Orders:</strong> Standard flat rate of <strong>Rs. 350 LKR</strong> to any delivery address in Sri Lanka.</li>
          <li><strong>Multi-Unit Bundles (2+ Items):</strong> <strong>FREE ISLANDWIDE DELIVERY</strong> when purchasing 2 or more products (such as our Duo Pack or Family Pack).</li>
        </ul>
        <p>
          There are zero hidden handling fees or surprise fuel surcharges at doorstep delivery.
        </p>
      </PolicySection>

      <PolicySection index="04 //" title="Cash on Delivery (COD) Protocol">
        <p>
          Cash on Delivery is available across all serviceable delivery zones. Please ensure you have the exact payment amount ready in Sri Lankan Rupees for the courier agent. The delivery officer will hand over the sealed package and provide an official delivery slip upon payment.
        </p>
      </PolicySection>

      <PolicySection index="05 //" title="Direct Bank Transfer Dispatch">
        <p>
          Customers opting for Direct Bank Transfer or instant QR transfer can upload their payment receipt on their order confirmation page. Once verified by our AI OCR pipeline or administrative review, your order enters express priority packaging immediately.
        </p>
      </PolicySection>

      <PolicySection index="06 //" title="Delivery Tracking & Communication">
        <p>
          Once your package is handed to the courier partner, you can check real-time pipeline status on our <Link href="/track-order" className="text-white underline font-medium">Order Telemetry Page</Link> using your phone number or Order UUID. Couriers routinely place a brief phone call prior to visiting your doorstep to confirm your availability.
        </p>
      </PolicySection>

      <PolicySection index="07 //" title="Failed Delivery & Rescheduling">
        <p>
          If you are unavailable to receive the package on the first attempt, the courier will re-attempt delivery on the following business day. Up to three delivery attempts will be made before the package is returned to our Colombo central hub. If you need to change the delivery date or recipient, please notify us immediately on WhatsApp (+94 78 234 9954).
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
