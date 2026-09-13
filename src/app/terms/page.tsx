export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import PolicySection from "../../components/legal/PolicySection";

export const metadata: Metadata = {
  title: "Terms & Conditions | AETHEX STORE",
  description: "Operating rules, pricing guidelines, Cash on Delivery terms, Bank Transfer slip verification, and driver safety responsibilities at AETHEX STORE.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      subtitle="Operational rules, pricing guidelines, Cash on Delivery terms, and user agreements for AETHEX STORE in Sri Lanka."
      lastUpdated="September 2026"
    >
      <PolicySection index="01 //" title="Orders & Commercial Agreement">
        <p>
          By placing an order through www.aethexstore.com or confirming a hardware reservation via our official WhatsApp channel (+94 78 234 9954), you agree to these Terms & Conditions. All orders are subject to inventory availability, address verification, and payment confirmation by our Colombo fulfillment team.
        </p>
      </PolicySection>

      <PolicySection index="02 //" title="Pricing & Currency">
        <p>
          All product prices are quoted in Sri Lankan Rupees (LKR). Delivery charges (standard flat rate of Rs. 350 LKR, or complimentary free delivery on multi-unit bundles containing 2+ units) are clearly itemized before final checkout submission. While we endeavor to maintain absolute pricing accuracy, in the rare event of an obvious typographical error, we reserve the right to contact you for confirmation before dispatching.
        </p>
      </PolicySection>

      <PolicySection index="03 //" title="Payment Methods & Slip Verification">
        <p>
          AETHEX STORE operates on two verified payment methods across Sri Lanka:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li>
            <strong>Cash on Delivery (COD):</strong> Exact payment in cash (LKR) must be handed to the authorized domestic courier representative upon parcel handover at your doorstep.
          </li>
          <li>
            <strong>Direct Bank Transfer:</strong> Electronic wires or physical cash deposits made directly to our corporate bank account (Commercial Bank of Ceylon / Bank of Ceylon). Uploaded receipts are verified via our automated AI OCR pipeline and administrative triage prior to courier packaging.
          </li>
        </ul>
      </PolicySection>

      <PolicySection index="04 //" title="Product Specifications & Brand Distinction">
        <p>
          AETHEX STORE curates, engineers, and distributes automotive accessories and high-performance electronics. Proprietary hardware lines (MagDrive, Cockpit HUD, Titanium EDC Screwdriver) are engineered under AETHEX design specifications. Partner products (such as ASPOR, LDNIO, and R8) are distributed independently. Compatibility metrics (such as 65mm–95mm cup-well expansion and 4.0"–7.0" clamp spans) are derived from physical vehicle benchmarks.
        </p>
      </PolicySection>

      <PolicySection index="05 //" title="Driver Responsibility & Safety Disclaimer">
        <div className="border border-white/10 bg-[#0B0B0B] p-5 rounded-2xl space-y-2 text-white/80">
          <strong className="text-white block font-mono text-xs uppercase tracking-wider">
            Critical Driver Safety Notice:
          </strong>
          <p className="text-xs text-white/60 leading-relaxed font-light">
            The motor vehicle operator remains solely responsible for driving safely and adhering to all road safety statutes under the Motor Traffic Act of Sri Lanka. Always configure phone mounts, input GPS route destinations, and select media playlists prior to vehicle transit or while safely parked. Never operate devices in a manner that obstructs your forward windshield sightline or compromises safe two-handed vehicle control.
          </p>
        </div>
      </PolicySection>

      <PolicySection index="06 //" title="Limitation of Liability">
        <p>
          AETHEX STORE is not liable for indirect, incidental, or consequential damages resulting from product misuse, improper vehicle installation into cracked or non-standard console wells, smartphone detachment resulting from improper clamping, or vehicular accidents arising from distracted driving.
        </p>
      </PolicySection>

      <PolicySection index="07 //" title="Descriptive Trademarks & Intellectual Property">
        <p>
          All original typography, interface design, photography, and custom audio assets on this website are proprietary to AETHEX. Third-party brand names, vehicle chassis designations (such as Honda, Toyota, Suzuki, Nissan, Apple, or Samsung), and logos are used strictly for factual compatibility and fitment identification purposes.
        </p>
      </PolicySection>

      <PolicySection index="08 //" title="Governing Law & Jurisdiction">
        <p>
          These terms and all commercial transactions conducted through AETHEX STORE shall be governed by, construed, and enforced in accordance with the substantive laws of the Democratic Socialist Republic of Sri Lanka. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in Colombo, Sri Lanka.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
