export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import PolicySection from "@/components/legal/PolicySection";

export const metadata: Metadata = {
  title: "Terms & Conditions | AETHEX STORE",
  description: "Terms and conditions governing purchases, pricing, orders, and hardware usage at AETHEX STORE.",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      subtitle="Operational rules, hardware specifications, and user agreements for AETHEX STORE."
      lastUpdated="September 2026"
    >
      <PolicySection index="01 //" title="Orders & Formal Agreement">
        <p>
          By placing an order through www.aethexstore.com or completing checkout via our manual bank transfer / WhatsApp concierge service (+94 78 234 9954), you confirm your acceptance of these Terms & Conditions. All orders are subject to inventory availability and verification by our dispatch team.
        </p>
      </PolicySection>

      <PolicySection index="02 //" title="Pricing, Currency & Invoicing">
        <p>
          All product prices are quoted in Sri Lankan Rupees (LKR). Delivery charges are explicitly stated before final payment confirmation. While we strive to maintain absolute catalog accuracy, in the event of an obvious typographical error, we reserve the right to contact you for confirmation before packaging.
        </p>
      </PolicySection>

      <PolicySection index="03 //" title="Payment Methods & Bank Verification">
        <p>
          AETHEX STORE accepts Direct Bank Transfer, Instant QR Transfers, and Cash on Delivery across Sri Lanka. For manual bank transfers, payment verification is conducted using our automated AI OCR pipeline combined with administrative review. Orders will process to fulfillment once funds or valid slip credentials are authenticated.
        </p>
      </PolicySection>

      <PolicySection index="04 //" title="Hardware Specifications & Integrity">
        <p>
          AETHEX STORE curates, engineers, and tests automotive accessories and precision hardware. Product specifications (such as cup-holder expansion dimensions, phone clamp tolerances, and magnetic holding capacities) are derived from standardized factory tests and rigorous vehicle road audits.
        </p>
      </PolicySection>

      <PolicySection index="05 //" title="Vehicle Operator Safety Notice">
        <div className="border border-white/10 bg-[#0B0B0B] p-4 rounded-xl text-white/80 space-y-2">
          <strong className="text-white block font-mono text-xs uppercase tracking-wider">
            Important Driver Safety Notice:
          </strong>
          <p className="text-xs text-white/60">
            The vehicle operator remains solely responsible for operating their vehicle safely and adhering to Sri Lankan traffic laws. Adjust all phone mounts, input navigation destinations, and configure audio media prior to vehicle transit or when safely parked.
          </p>
        </div>
      </PolicySection>

      <PolicySection index="06 //" title="Limitation of Liability">
        <p>
          AETHEX STORE is not liable for indirect, incidental, or consequential damages resulting from product misuse, improper vehicle installation into damaged console components, or distracted driving.
        </p>
      </PolicySection>

      <PolicySection index="07 //" title="Intellectual Property">
        <p>
          All typography, imagery, 3D renderings, and interface assets on this website are proprietary to AETHEX STORE. Third-party brand references (such as vehicle makes or mobile device models) are used solely for fitment and compatibility identification.
        </p>
      </PolicySection>

      <PolicySection index="08 //" title="Governing Law">
        <p>
          These terms and all transactions conducted through AETHEX STORE shall be governed by and interpreted under the commercial statutes of the Democratic Socialist Republic of Sri Lanka.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
