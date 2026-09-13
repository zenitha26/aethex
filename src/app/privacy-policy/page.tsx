export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import PolicySection from "../../components/legal/PolicySection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | AETHEX STORE",
  description: "Learn how AETHEX STORE collects, protects, and processes customer data, authentication, AI bank slip OCR, and courier logistics in Sri Lanka.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Comprehensive disclosure on how AETHEX STORE processes customer credentials, order telemetry, bank slip verification, and courier logistics."
      lastUpdated="September 2026"
    >
      <PolicySection index="01 //" title="Data Controller & Scope">
        <p>
          AETHEX STORE ("we", "us", or "our"), operating in Colombo, Sri Lanka, is committed to safeguarding the privacy and integrity of customer data. This Privacy Policy outlines how your personal information is gathered, processed, and safeguarded when visiting www.aethexstore.com, interacting with our customer portals, or ordering hardware.
        </p>
      </PolicySection>

      <PolicySection index="02 //" title="Information We Collect">
        <p>
          We strictly collect the minimal data necessary to provide seamless e-commerce transactions, user authentication, and physical courier fulfillment:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li>
            <strong>Account Credentials:</strong> If you register or authenticate via email or Google OAuth, your email address, full name, and encrypted authentication tokens are securely managed via Supabase Auth.
          </li>
          <li>
            <strong>Checkout & Fulfillment Details:</strong> When placing an order (as a guest or member), we collect your full legal name, delivery street address, city, postal code, phone/WhatsApp number, and optional vehicle chassis notes for fitment confirmation.
          </li>
          <li>
            <strong>Payment Verification Data:</strong> For Direct Bank Transfer orders, customers upload physical deposit receipts or electronic wire transfer screenshots containing transaction amounts, reference numbers, and timestamps.
          </li>
          <li>
            <strong>Technical Telemetry:</strong> Anonymized edge request headers, IP addresses, and session timestamps used solely for rate limiting, security defense, and server fault diagnostics.
          </li>
        </ul>
      </PolicySection>

      <PolicySection index="03 //" title="AI Vision Receipt Verification">
        <p>
          To eliminate delays in manual order fulfillment, AETHEX STORE utilizes automated OCR image processing via the Anthropic Claude 3 Vision API to inspect uploaded bank deposit slips:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li>
            <strong>Stateless Analysis:</strong> Uploaded slip images are processed transiently to extract only the transaction amount, transfer date, and bank reference code to match against your order total.
          </li>
          <li>
            <strong>Zero Credential Retention:</strong> We never request, extract, or store your personal banking login passwords, PINs, account balances, or debit card numbers.
          </li>
        </ul>
      </PolicySection>

      <PolicySection index="04 //" title="Local Browser Storage Keys">
        <p>
          Our web application utilizes client-side browser storage (localStorage) strictly for functional performance and preference persistence:
        </p>
        <div className="border border-white/10 bg-[#0B0B0B] p-4 text-xs font-mono space-y-2 my-2">
          <div><span className="text-white font-bold">aethex-cart:</span> Active hardware items, variants, and quantities in your bag.</div>
          <div><span className="text-white font-bold">aethex_local_orders:</span> Local offline order recovery cache.</div>
          <div><span className="text-white font-bold">aethex_audio_muted:</span> Audio engine mute state preference.</div>
          <div><span className="text-white font-bold">aethex_wishlist:</span> Saved bookmark list of favorite hardware units.</div>
          <div><span className="text-white font-bold">aethex_compare:</span> Active hardware comparison matrix queue.</div>
        </div>
        <p className="text-[11px] text-white/50">
          We do not deploy cross-site tracking cookies, third-party advertising pixels, or behavioral data broker scripts.
        </p>
      </PolicySection>

      <PolicySection index="05 //" title="Third-Party Disclosures & Courier Partners">
        <p>
          We do not sell, rent, or trade your personal data to external marketing companies. Information is shared strictly with essential operational partners:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li>
            <strong>Domestic Courier Networks:</strong> Your recipient name, delivery street address, and contact telephone number are transmitted to registered domestic couriers in Sri Lanka for physical parcel delivery and Cash on Delivery (COD) collection.
          </li>
          <li>
            <strong>Transactional Email Services:</strong> We utilize Resend to dispatch order confirmations, slip approvals, and account notifications.
          </li>
          <li>
            <strong>Database & Cloud Hosting:</strong> Our relational order tables and encrypted storage buckets are hosted on Supabase (PostgreSQL) with Row-Level Security (RLS).
          </li>
        </ul>
      </PolicySection>

      <PolicySection index="06 //" title="Data Security & Server Protection">
        <p>
          All data in transit is encrypted using modern TLS (HTTPS). Server-side secrets and cryptographic keys are guarded using Next.js runtime taint protection to prevent leakage to client bundles. Customer profile and order records in Supabase are governed by strict Row-Level Security (RLS) policies preventing cross-user account access.
        </p>
      </PolicySection>

      <PolicySection index="07 //" title="Customer Rights & Record Deletion">
        <p>
          You retain full control over your personal information. You can review and update your profile details anytime via the <Link href="/account/settings" className="text-white underline">Account Settings</Link> portal.
        </p>
        <p>
          To request a copy of your stored records, or to request the complete deletion of your customer profile following the expiration of your warranty period, email our data privacy officer at <span className="text-white font-medium">support@aethexstore.com</span> or message us on WhatsApp at <span className="text-white font-medium">+94 78 234 9954</span>.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
