export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import PolicySection from "../../components/legal/PolicySection";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | AETHEX STORE",
  description: "Information on islandwide courier delivery, Cash on Delivery, shipping charges, and estimated delivery times across Sri Lanka.",
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
          We deliver to all 25 administrative districts of Sri Lanka via established domestic courier services (including Colombo, Gampaha, Kalutara, Kandy, Galle, Matara, Kurunegala, Jaffna, Anuradhapura, Ratnapura, and surrounding areas).
        </p>
      </PolicySection>

      <PolicySection index="02 //" title="Estimated Delivery Times">
        <p>
          Orders confirmed before 2:00 PM on business days are packaged and handed over to couriers the same day. Estimated arrival windows:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li><strong>Western Province (Colombo, Gampaha, Kalutara):</strong> 24 to 48 hours.</li>
          <li><strong>Major Cities & Central/Southern Corridors (Kandy, Galle, Kurunegala, Matara):</strong> 2 to 3 business days.</li>
          <li><strong>Northern, Eastern & Outstation Districts:</strong> 3 to 4 business days.</li>
        </ul>
        <p className="text-[11px] text-[#6B6B6B]">
          Note: Deliveries may experience minor delays during extreme weather, public holidays, or unforeseen road closures.
        </p>
      </PolicySection>

      <PolicySection index="03 //" title="Delivery Charges">
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li><strong>Single Unit Order:</strong> Standard flat rate of <strong>Rs. 350 LKR</strong> anywhere in Sri Lanka.</li>
          <li><strong>Bundle Orders (2+ Units):</strong> <strong>FREE ISLANDWIDE DELIVERY</strong> when ordering the Duo Pack (2 units) or Family Pack (3 units).</li>
        </ul>
        <p>
          There are no hidden handling fees or surprise fuel surcharges at doorstep delivery.
        </p>
      </PolicySection>

      <PolicySection index="04 //" title="Cash on Delivery (COD) Protocol">
        <p>
          Cash on Delivery is available across all serviceable delivery zones. Please ensure you have the exact payment amount ready in Sri Lankan Rupees for the courier. The courier agent will hand over the sealed package and provide an official delivery slip upon payment.
        </p>
      </PolicySection>

      <PolicySection index="05 //" title="Delivery Tracking & Communication">
        <p>
          Once your package is handed to the courier partner, our dispatch team will update you via WhatsApp with your tracking number or dispatch reference. Couriers will typically place a brief phone call prior to visiting your address to confirm you are available.
        </p>
      </PolicySection>

      <PolicySection index="06 //" title="Failed Delivery & Rescheduling">
        <p>
          If you are unable to receive the parcel on the first attempt, the courier will re-attempt delivery on the following business day. Up to three delivery attempts will be made before the package is returned to our Colombo central hub. If you need to change the delivery date or recipient, please notify us immediately on WhatsApp (+94 78 234 9954).
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
