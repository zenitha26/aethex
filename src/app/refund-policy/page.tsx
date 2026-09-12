export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import PolicySection from "@/components/legal/PolicySection";

export const metadata: Metadata = {
  title: "Refund & Return Policy | AETHEX STORE",
  description: "Read about our 7-day hardware guarantee, replacement process, and return policies at AETHEX STORE.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund & Return Policy"
      subtitle="Clear, honest terms regarding hardware replacements, manufacturing guarantees, and direct reimbursement procedures."
      lastUpdated="September 2026"
    >
      <PolicySection index="01 //" title="7-Day Hardware Replacement Guarantee">
        <p>
          Every hardware device dispatched from AETHEX STORE is backed by our 7-day replacement guarantee. If your unit exhibits functional failure, manufacturing defect, or transit damage upon arrival, we provide an immediate 1-to-1 replacement.
        </p>
      </PolicySection>

      <PolicySection index="02 //" title="Eligibility & Return Conditions">
        <p>To qualify for a valid exchange or refund:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li>The notification must be submitted within 7 calendar days of courier delivery.</li>
          <li>All original modular attachments, packaging boxes, knurled knobs, and mounts must be returned intact.</li>
          <li>The product must not exhibit intentional misuse, physical cracking from improper torque, or water immersion damage.</li>
        </ul>
      </PolicySection>

      <PolicySection index="03 //" title="Initiating a Return">
        <ol className="list-decimal pl-5 space-y-2 text-white/80">
          <li>
            <strong>Contact Concierge:</strong> Message our WhatsApp desk at <span className="text-white">+94 78 234 9954</span> or email <span className="text-white">support@aethexstore.com</span> with your Order ID.
          </li>
          <li>
            <strong>Submit Verification:</strong> Provide a brief video or photo demonstrating the defect.
          </li>
          <li>
            <strong>Handover & Exchange:</strong> Our courier service will exchange the unit at your doorstep, collecting the returned item simultaneously.
          </li>
        </ol>
      </PolicySection>

      <PolicySection index="04 //" title="Direct Bank Reimbursement">
        <p>
          If an identical replacement unit is unavailable or out of stock, a 100% refund of the purchase price will be credited directly to your designated Sri Lankan commercial bank account via wire transfer within 3 to 5 business days.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
