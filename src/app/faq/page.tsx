export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import FAQAccordion from "../../components/legal/FAQAccordion";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | AETHEX STORE",
  description: "Answers to common inquiries regarding our hardware catalog, vehicle console fitment, Cash on Delivery, Bank Transfer with Slip OCR, and express delivery across Sri Lanka.",
};

const FAQ_DATA = [
  {
    tag: "PAYMENT PROTOCOLS",
    question: "What payment methods are supported for orders?",
    answer: (
      <div className="space-y-2">
        <p>
          We support two reliable, transparent payment methods for customers across Sri Lanka:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-white/80">
          <li>
            <strong>Cash on Delivery (COD):</strong> Pay in cash directly to the courier officer upon receiving your sealed package at your doorstep. No card numbers or advance payments required.
          </li>
          <li>
            <strong>Direct Bank Transfer & Instant QR:</strong> Transfer the exact order total directly to our official corporate account (Commercial Bank of Ceylon / Bank of Ceylon). Upload your deposit slip or digital transaction screenshot on your dedicated order page for rapid automated AI OCR verification.
          </li>
        </ul>
        <p className="text-white/50 text-[11px]">
          Note: We do not process direct credit card numbers on-site, ensuring zero card credential exposure.
        </p>
      </div>
    ),
  },
  {
    tag: "TELEMETRY TRACKING",
    question: "How can I track my order status?",
    answer: (
      <div className="space-y-2">
        <p>
          You can track your order at any time using our live <Link href="/track-order" className="text-white underline font-medium">Order Telemetry Portal</Link>. You can look up your order using either:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-white/80">
          <li><strong>Your Sri Lankan Phone Number</strong> (e.g. 0771234567 or +94771234567) used during checkout.</li>
          <li><strong>Your Unique Order UUID Hash</strong> generated upon checkout submission.</li>
        </ul>
        <p>
          Additionally, our Colombo dispatch desk will send your domestic courier tracking consignment reference directly via WhatsApp or SMS once the package is handed over to the courier.
        </p>
      </div>
    ),
  },
  {
    tag: "VEHICLE FITMENT",
    question: "Does the ASPOR A711 or MagDrive mount fit my vehicle's cup holder?",
    answer: (
      <div className="space-y-2">
        <p>
          The ASPOR A711 features a precision mechanical expansion base that expands continuously from <strong>65mm to 95mm in diameter</strong> via an internal knurled dial. This fits virtually all circular console cup wells across Japanese, European, and American vehicle makes in Sri Lanka, including:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-white/80">
          <li><strong>Honda:</strong> Vezel, HR-V, Fit GP5, Civic, Grace</li>
          <li><strong>Toyota:</strong> Premio, Allion, Aqua, Prius, Axio, Hilux, Land Cruiser Prado</li>
          <li><strong>Suzuki:</strong> Swift (RS/Sport), Wagon R, Spacia, Alto</li>
          <li><strong>Nissan:</strong> Leaf, X-Trail, Note e-Power</li>
          <li><strong>European:</strong> BMW 3/5 Series, Mercedes-Benz C/E Class, Audi A4/A6</li>
        </ul>
        <p>
          If your cup holder has an irregular rectangular profile or unusual depth, use our <Link href="/#products-grid" className="text-white underline">Console Caliper tool</Link> or send a quick photo of your center console to our WhatsApp concierge (+94 78 234 9954) for instant engineering fitment confirmation.
        </p>
      </div>
    ),
  },
  {
    tag: "DELIVERY & LOGISTICS",
    question: "How long will it take for my order to arrive in Sri Lanka?",
    answer: (
      <div className="space-y-2">
        <p>
          We dispatch daily from our Colombo fulfillment hub via registered domestic courier networks:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-white/80">
          <li><strong>Western Province (Colombo, Gampaha, Kalutara):</strong> 24 to 48 hours.</li>
          <li><strong>Central, Southern & North Western (Kandy, Galle, Kurunegala, Matara):</strong> 2 to 3 business days.</li>
          <li><strong>Northern, Eastern & Deep Outstations (Jaffna, Batticaloa, Anuradhapura):</strong> 3 to 4 business days.</li>
        </ul>
        <p>
          Delivery is a flat Rs. 350 LKR islandwide, or <strong>100% Free</strong> on hardware bundles containing 2 or more units.
        </p>
      </div>
    ),
  },
  {
    tag: "WARRANTY & REPLACEMENT",
    question: "What warranties and replacement guarantees apply to my purchase?",
    answer: (
      <div className="space-y-2">
        <p>
          Every item dispatched from AETHEX STORE undergoes a pre-packaging physical inspection and is backed by clear warranty terms:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-white/80">
          <li><strong>7-Day Inspection Replacement Guarantee:</strong> Applies to all products. If an item arrives with transit damage or out-of-the-box functional faults, we arrange an immediate doorstep 1-to-1 replacement via courier.</li>
          <li><strong>AETHEX Flagship Line (MagDrive, HUD Gauge, EP10, Studio Soundbar):</strong> 1-Year Official Hardware Warranty.</li>
          <li><strong>LDNIO Power Stations & Fast Cables:</strong> 1-Year / 6-Month Official Replacement Warranty.</li>
          <li><strong>AETHEX Titanium EDC Screwdriver:</strong> Lifetime Craftsmanship Guarantee on the Grade-5 titanium handle.</li>
        </ul>
        <p>
          Read the full terms on our <Link href="/warranty" className="text-white underline">Warranty Policy</Link> page.
        </p>
      </div>
    ),
  },
  {
    tag: "DEVICE COMPATIBILITY",
    question: "Which smartphones and tablets work with AETHEX mounts?",
    answer: (
      <p>
        The mechanical clamping arms support all mobile devices from <strong>4.0 inches up to 7.0 inches</strong> in screen width, including the iPhone 11 through iPhone 16 Pro Max, Samsung Galaxy S20 through S25 Ultra, Google Pixel, Xiaomi, and OnePlus models, even when fitted with rugged protective cases (e.g. UAG, Spigen, Otterbox). For MagSafe and magnetic mounts, we provide an ultra-thin adhesive alignment ring for non-magnetic phones.
      </p>
    ),
  },
  {
    tag: "ORDER MODIFICATIONS",
    question: "Can I cancel or change my delivery address after placing an order?",
    answer: (
      <p>
        Yes. As long as your parcel has not yet been handed over to our courier partner (orders placed before 2:00 PM are packaged the same day), you can modify your delivery address, change your recipient phone number, or cancel your order without penalty by messaging our WhatsApp concierge desk (+94 78 234 9954) with your Order ID.
      </p>
    ),
  },
  {
    tag: "GENUINE HARDWARE",
    question: "Are products original and factory-sealed?",
    answer: (
      <p>
        Yes. Every device is sourced directly from certified hardware manufacturers or engineered under the proprietary AETHEX specifications. Units arrive in authentic manufacturer packaging with protective seals intact, accompanied by all factory accessories, cables, and hardware mounts.
      </p>
    ),
  }
];

export default function FAQPage() {
  return (
    <LegalPageLayout
      title="Frequently Asked Questions"
      subtitle="Clear answers on vehicle console fitment, Cash on Delivery, Bank Transfer slip verification, express courier transit times, and warranty coverage across Sri Lanka."
      category="HELP & SUPPORT"
      lastUpdated="September 2026"
    >
      <div className="space-y-6">
        <FAQAccordion items={FAQ_DATA} />
      </div>
    </LegalPageLayout>
  );
}
