export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import PolicySection from "../../components/legal/PolicySection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy | AETHEX STORE",
  description: "Guidelines on our 7-day replacement guarantee, doorstep courier exchanges, and bank transfer refund terms at AETHEX STORE.",
};

export default function ReturnsPage() {
  return (
    <LegalPageLayout
      title="Returns & Refunds"
      subtitle="Clear, honest terms regarding product replacements, transit damages, and refund conditions at AETHEX STORE in Sri Lanka."
      lastUpdated="September 2026"
    >
      <PolicySection index="01 //" title="7-Day Replacement Guarantee">
        <p>
          We stand firmly behind the build quality and functionality of every hardware unit we dispatch. If your purchase arrives damaged during courier transit, exhibits an out-of-the-box manufacturing flaw, or fails to operate as described, you are entitled to a <strong>1-to-1 replacement within 7 calendar days</strong> of receiving your doorstep delivery.
        </p>
      </PolicySection>

      <PolicySection index="02 //" title="Eligibility Criteria">
        <p>To qualify for a complimentary exchange or replacement:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li>You must notify our Colombo concierge team within 7 calendar days of confirmed courier delivery.</li>
          <li>The hardware must be in its original product packaging with all standard accessories (base mounts, articulating arms, ball pivots, USB-C cables, documentation).</li>
          <li>The product must not exhibit user-inflicted physical damage, forced overtightening cracks, or unauthorized disassembly.</li>
        </ul>
      </PolicySection>

      <PolicySection index="03 //" title="Step-by-Step Exchange Procedure">
        <ol className="list-decimal pl-5 space-y-2 text-white/80">
          <li>
            <strong>Contact WhatsApp Concierge:</strong> Message <span className="text-white font-medium">+94 78 234 9954</span> or email <span className="text-white font-medium">support@aethexstore.com</span> with your Order ID or phone number.
          </li>
          <li>
            <strong>Photo / Video Verification:</strong> Share a quick photo or short video demonstrating the defect, transit damage, or mechanical issue so our technical staff can verify the claim immediately.
          </li>
          <li>
            <strong>Doorstep Courier Handover:</strong> Upon claim approval, our dispatch desk will arrange a replacement parcel via courier. The courier agent will hand over your brand-new unit and collect the defective unit at your doorstep.
          </li>
        </ol>
      </PolicySection>

      <PolicySection index="04 //" title="Direct Bank Reimbursement">
        <p>
          As an independent electronics retailer, our standard resolution for valid claims is a swift, brand-new replacement unit.
        </p>
        <p>
          In the event that an identical replacement model is temporarily out of stock or cannot be fulfilled, a <strong>100% full refund</strong> of the purchase price will be remitted directly to your designated Sri Lankan commercial bank account (Commercial Bank, BOC, Sampath Bank, HNB, Seylan, etc.) via wire transfer within 3 to 5 business days.
        </p>
      </PolicySection>

      <PolicySection index="05 //" title="Return Courier Costs">
        <p>
          If the exchange is due to a verifiable manufacturing defect, transit damage, or an incorrect item dispatched by our fulfillment team, <strong>AETHEX STORE covers all return courier and replacement dispatch expenses</strong>. There are no restocking fees or return shipping charges assessed to the customer.
        </p>
      </PolicySection>

      <PolicySection index="06 //" title="Assistance & Claims Contact">
        <p>
          For questions regarding an ongoing exchange or warranty assessment, contact our support team directly via WhatsApp at <span className="text-white">+94 78 234 9954</span> (9:00 AM – 8:00 PM Daily) or visit our <Link href="/contact" className="text-white underline">Contact Desk</Link>.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
