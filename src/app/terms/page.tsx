export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import PolicySection from "../../components/legal/PolicySection";

export const metadata: Metadata = {
  title: "Terms & Conditions | AETHEX STORE",
  description: "Terms and conditions governing purchases, pricing, Cash on Delivery payments, and driver safety responsibilities at AETHEX STORE.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      subtitle="Operational rules, pricing guidelines, Cash on Delivery terms, and user agreements for AETHEX STORE."
      lastUpdated="September 2026"
    >
      <PolicySection index="01 //" title="Orders & Agreement">
        <p>
          By placing an order through www.aethexstore.com or confirming a purchase via our official WhatsApp channel (+94 78 234 9954), you agree to these Terms & Conditions. All orders are subject to product availability and confirmation by our dispatch team.
        </p>
      </PolicySection>

      <PolicySection index="02 //" title="Pricing & Currency">
        <p>
          All product prices are quoted in Sri Lankan Rupees (LKR). Delivery charges (standard rate of Rs. 350, or free delivery on qualifying multi-unit bundles) will be clearly indicated prior to final order confirmation. While we make every effort to ensure price accuracy, in the rare event of an obvious typographical error, we reserve the right to contact you before dispatching.
        </p>
      </PolicySection>

      <PolicySection index="03 //" title="Payments & Cash on Delivery (COD)">
        <p>
          We operate primarily on Cash on Delivery (COD) for addresses across Sri Lanka. Payment in exact cash must be handed to the authorized courier representative upon doorstep handover. Online bank transfers prior to dispatch are also supported upon request through our WhatsApp desk.
        </p>
      </PolicySection>

      <PolicySection index="04 //" title="Product Information & Brand Distinction">
        <p>
          AETHEX STORE curates, validates, and distributes automotive hardware. The <strong>ASPOR A711</strong> is manufactured by ASPOR. AETHEX STORE is an independent retailer and does not claim to be an authorized exclusive distributor unless formally documented. Product specifications (such as cup-holder expansion bore and phone size compatibility) are based on physical testing and manufacturer documentation.
        </p>
      </PolicySection>

      <PolicySection index="05 //" title="Driver Responsibility & Safety Disclaimer">
        <p className="border border-white/10 bg-[#0B0B0B] p-4 text-white/80 rounded-xl">
          <strong className="text-white">Important Safety Notice:</strong> The vehicle operator remains solely responsible for driving safely and complying with all local Sri Lankan traffic regulations. Always adjust your phone mount, input GPS destinations, or set media playlists before putting the vehicle in motion or while safely parked. Do not operate your smartphone in any manner that obstructs your view of the road or compromises safe steering.
        </p>
      </PolicySection>

      <PolicySection index="06 //" title="Limitation of Liability">
        <p>
          AETHEX STORE is not liable for indirect, incidental, or consequential damages resulting from the misuse of products, improper installation into damaged cup holders, smartphone drops resulting from improper clamping, or accidents arising from distracted driving.
        </p>
      </PolicySection>

      <PolicySection index="07 //" title="Intellectual Property">
        <p>
          All original graphics, interface elements, text content, and branding associated with AETHEX STORE on this website are the intellectual property of AETHEX. Third-party brand names (such as Honda, Toyota, Suzuki, Apple, or ASPOR) are used solely for descriptive fitment and compatibility identification.
        </p>
      </PolicySection>

      <PolicySection index="08 //" title="Governing Law">
        <p>
          These terms and all commercial transactions conducted through AETHEX STORE shall be governed by and construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
