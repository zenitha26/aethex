export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import PolicySection from "@/components/legal/PolicySection";

export const metadata: Metadata = {
  title: "Shipping Policy | AETHEX STORE",
  description: "Learn about our nationwide courier logistics, dispatch windows, express delivery tiers, and parcel tracking across Sri Lanka.",
};

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout
      title="Shipping Policy"
      subtitle="Comprehensive guidelines on logistics, islandwide fulfillment, dispatch timelines, and delivery protocols across Sri Lanka."
      lastUpdated="September 2026"
    >
      <PolicySection index="01 //" title="Islandwide Logistics Network">
        <p>
          AETHEX STORE dispatches hardware to all 25 administrative districts of Sri Lanka utilizing verified premium domestic courier networks. Each package is secured in multi-layered protective packaging designed to withstand transportation conditions.
        </p>
      </PolicySection>

      <PolicySection index="02 //" title="Dispatch & Transit Windows">
        <p>
          Orders confirmed before 2:00 PM (Sri Lanka Time) on business days enter packaging and courier handover the same day.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li><strong>Western Province (Colombo, Gampaha, Kalutara):</strong> 24 to 48 hours delivery.</li>
          <li><strong>Central & Southern Hubs (Kandy, Galle, Kurunegala, Matara):</strong> 2 to 3 business days.</li>
          <li><strong>Northern, Eastern & Outstation Districts:</strong> 3 to 4 business days.</li>
        </ul>
      </PolicySection>

      <PolicySection index="03 //" title="Fulfillment Charges">
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li><strong>Standard Single Item Delivery:</strong> Flat rate of Rs. 350 across all islandwide destinations.</li>
          <li><strong>Complimentary Express Shipping:</strong> Available on all hardware bundles (2+ units) and priority orders.</li>
        </ul>
      </PolicySection>

      <PolicySection index="04 //" title="Tracking & Delivery Updates">
        <p>
          Upon dispatch, you will receive an official tracking reference and status notification via SMS/WhatsApp. Couriers routinely make contact via phone call prior to final doorstep delivery.
        </p>
      </PolicySection>

      <PolicySection index="05 //" title="Damaged in Transit Protocol">
        <p>
          In the rare event that a package shows signs of exterior courier tampering or physical structural impact upon arrival, photograph the parcel immediately and notify our concierge desk via WhatsApp (+94 78 234 9954) within 24 hours for prompt replacement.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
