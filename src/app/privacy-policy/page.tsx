export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import PolicySection from "../../components/legal/PolicySection";

export const metadata: Metadata = {
  title: "Privacy Policy | AETHEX STORE",
  description: "Learn how AETHEX STORE collects, uses, and protects customer information for orders, WhatsApp communications, and courier fulfillment in Sri Lanka.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How AETHEX STORE handles customer data, WhatsApp order information, and delivery fulfillment across Sri Lanka."
      lastUpdated="September 2026"
    >
      <PolicySection index="01 //" title="Information We Collect">
        <p>
          AETHEX operates a direct customer-to-support model. We only collect the minimal information necessary to fulfill your hardware orders and provide customer support:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-white/80">
          <li><strong>Customer Name:</strong> To address the parcel correctly.</li>
          <li><strong>Contact Number / WhatsApp Number:</strong> For courier contact and order status verification.</li>
          <li><strong>Delivery Address & District:</strong> To dispatch your package via our local courier partners.</li>
          <li><strong>Vehicle Make & Model:</strong> Optionally provided to confirm cup-holder fitment before dispatch.</li>
        </ul>
      </PolicySection>

      <PolicySection index="02 //" title="WhatsApp & Order Communications">
        <p>
          When you initiate an order or inquiry through our website, you are directed to WhatsApp. Information shared within WhatsApp conversations (such as your delivery address or photos of your cup holder for fitment advice) is used solely to process your purchase, arrange delivery, and answer technical support questions.
        </p>
        <p>
          We do not use your phone number for unsolicited marketing broadcasts or robocalls.
        </p>
      </PolicySection>

      <PolicySection index="03 //" title="Third-Party Courier Services">
        <p>
          To deliver physical hardware to your doorstep anywhere in Sri Lanka, we share your name, delivery address, and contact number with registered domestic courier services. These partners are legally bound to use this information strictly to complete physical delivery and collect Cash on Delivery (COD) payments.
        </p>
      </PolicySection>

      <PolicySection index="04 //" title="Cookies & Website Analytics">
        <p>
          Our website uses minimal, essential functional cookies and browser storage (such as remembering your vehicle selection or audio mute preference). We do not deploy aggressive cross-site advertising trackers or sell your browsing history to third-party data brokers.
        </p>
      </PolicySection>

      <PolicySection index="05 //" title="Data Retention & Security">
        <p>
          Order records are retained only as long as necessary for tax, accounting, and warranty verification purposes (such as honoring your 7-day replacement guarantee). Customer details are kept securely and are not accessible to unauthorized third parties.
        </p>
      </PolicySection>

      <PolicySection index="06 //" title="Your Data Rights & Contact">
        <p>
          You have the right to request a copy of the details we hold regarding your order or ask us to delete your contact record after your delivery is successfully completed and the warranty window has passed.
        </p>
        <p>
          For privacy inquiries, contact our data administrator at <span className="text-white">support@aethexstore.com</span> or message us on WhatsApp at <span className="text-white">+94 78 234 9954</span>.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
