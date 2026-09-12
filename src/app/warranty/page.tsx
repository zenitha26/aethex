export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import PolicySection from "../../components/legal/PolicySection";

export const metadata: Metadata = {
  title: "Warranty Policy | AETHEX STORE",
  description: "Details on warranty coverage, manufacturing defect guarantees, and claims procedures for automotive hardware at AETHEX STORE.",
};

export default function WarrantyPage() {
  return (
    <LegalPageLayout
      title="Warranty Policy"
      subtitle="Honest, realistic warranty guidelines for the ASPOR A711 and automotive accessories distributed by AETHEX STORE."
      lastUpdated="September 2026"
    >
      <PolicySection index="01 //" title="7-Day Manufacturing Defect Guarantee">
        <p>
          AETHEX STORE provides a <strong>7-day replacement warranty</strong> from the confirmed date of delivery. This guarantee covers all verifiable functional defects in manufacturing, structural materials, or assembly that prevent the mount from operating as intended.
        </p>
      </PolicySection>

      <PolicySection index="02 //" title="What is Covered">
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li><strong>Mechanical Tension Dial:</strong> Failure of the rotational dial mechanism to expand or retract the base lugs properly.</li>
          <li><strong>Joint Tension Faults:</strong> Arm pivot joints that arrive too loose to hold a standard smartphone at eye level.</li>
          <li><strong>Clamp Mechanics:</strong> Internal spring or quick-release button failures on the smartphone cradle.</li>
          <li><strong>Silicone Friction Pads:</strong> Base grip pads that arrive detached or damaged out of the box.</li>
        </ul>
      </PolicySection>

      <PolicySection index="03 //" title="What is Not Covered">
        <ul className="list-disc pl-5 space-y-1.5 text-white/80">
          <li>Damage resulting from accidental phone drops, vehicle collisions, or excessive manual force applied beyond rated limits.</li>
          <li>Damage caused by inserting the mount into undersized or non-standard vehicle compartments.</li>
          <li>Unauthorized modification, disassembly, or repair attempts.</li>
          <li>Normal cosmetic wear, surface scratches, or dust accumulation resulting from regular daily driving.</li>
        </ul>
      </PolicySection>

      <PolicySection index="04 //" title="How to Make a Warranty Claim">
        <p>
          To make a claim under this policy, contact our Colombo support team on WhatsApp at <strong>+94 78 234 9954</strong> within the 7-day window. Please provide:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-white/80">
          <li>Your delivery name and phone number (or delivery slip reference).</li>
          <li>A clear photo or video demonstrating the mechanical issue.</li>
        </ol>
        <p>
          Upon verification, we will arrange a replacement unit to be delivered to your doorstep.
        </p>
      </PolicySection>

      <PolicySection index="05 //" title="Manufacturer Brand Distinction">
        <p>
          The ASPOR A711 is manufactured by ASPOR. This 7-day warranty is provided directly by AETHEX STORE as an independent retailer to guarantee that every customer receives a fully operational, high-quality unit.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
