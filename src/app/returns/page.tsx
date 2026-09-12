export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import PolicySection from "../../components/legal/PolicySection";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy | AETHEX STORE",
  description: "Guidelines on our 7-day replacement guarantee, exchange procedures, and return conditions at AETHEX STORE.",
};

export default function ReturnsPage() {
  return (
    <LegalPageLayout
      title="Returns & Refunds"
      subtitle="Clear, honest terms regarding product replacements, transit damages, and refund conditions at AETHEX STORE."
      lastUpdated="September 2026"
    >
      <PolicySection index="01 //" title="7-Day Replacement Guarantee">
        <p>
          We stand behind the physical condition of every product we dispatch. If your ASPOR A711 arrives damaged in transit, with manufacturing flaws, or does not match the product described, you are entitled to a <strong>free replacement within 7 calendar days</strong> of receiving the package.
        </p>
      </PolicySection>

      <PolicySection index="02 //" title="Eligibility Criteria">
        <p>To be eligible for an exchange or replacement:</p>
        <ul className="list-disc pl-5 space-y-1 text-white/80">
          <li>You must report the issue to our WhatsApp support within 7 days of doorstep delivery.</li>
          <li>The item must be in its original packaging including all original parts (mount base, articulating arm, ball socket clamp, knurled dial).</li>
          <li>The product must not exhibit signs of user-inflicted physical damage, forced breakage, or unauthorized alterations.</li>
        </ul>
      </PolicySection>

      <PolicySection index="03 //" title="How to Initiate an Exchange">
        <ol className="list-decimal pl-5 space-y-2 text-white/80">
          <li>
            <strong>Contact WhatsApp:</strong> Send a message to <span className="text-white">+94 78 234 9954</span> stating your name, phone number, and brief description of the issue.
          </li>
          <li>
            <strong>Share Photos / Video:</strong> Attach a quick photo or short video showing the defect or transit damage so our technical team can verify the issue immediately.
          </li>
          <li>
            <strong>Replacement Dispatch:</strong> Upon verification, we will dispatch a brand-new replacement unit to your address via courier and coordinate the return handover of the defective piece.
          </li>
        </ol>
      </PolicySection>

      <PolicySection index="04 //" title="Refund Conditions">
        <p>
          As an automotive hardware retailer operating primarily on Cash on Delivery, our primary resolution for valid claims is a prompt replacement or exchange with an equivalent, brand-new unit.
        </p>
        <p>
          If a replacement unit is temporarily out of stock or we are unable to resolve the hardware defect, a full refund of the product purchase price will be issued to your designated Sri Lankan bank account via direct bank transfer within 3 to 5 business days.
        </p>
      </PolicySection>

      <PolicySection index="05 //" title="Return Shipping Costs">
        <p>
          If the exchange is due to a verifiable manufacturing defect, transit damage, or an error on our part (e.g. incorrect model shipped), AETHEX STORE covers all return courier and replacement dispatch costs.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
