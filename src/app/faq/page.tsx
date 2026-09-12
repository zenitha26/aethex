export const runtime = 'edge';

import { Metadata } from "next";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import FAQAccordion from "../../components/legal/FAQAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | AETHEX STORE",
  description: "Find answers to common questions about the ASPOR A711 car cup-holder phone mount, vehicle fitment, Cash on Delivery, and delivery timeframes in Sri Lanka.",
};

const FAQ_DATA = [
  {
    tag: "VEHICLE FITMENT",
    question: "Does the ASPOR A711 fit my vehicle's cup holder?",
    answer: "The ASPOR A711 features a knurled expansion base that adjusts continuously from approximately 65mm to 95mm in diameter. This fits the vast majority of circular console cup holders found in Sri Lankan vehicles, including the Honda Vezel / HR-V, Toyota Premio / Allion, Toyota Aqua / Prius, Suzuki Swift / RS, Suzuki Wagon R, Toyota Hilux / D-Max, and Nissan Leaf. If you are uncertain about an irregular or square cup-holder, you can message us a photo of your center console on WhatsApp (+94 78 234 9954) for instant fitment verification.",
  },
  {
    tag: "SMARTPHONE COMPATIBILITY",
    question: "Which phone models and sizes are supported?",
    answer: "The cradle clamp opens to accommodate smartphones from 4.0 inches up to 7.0 inches in diagonal screen size. This includes all standard and Max/Plus models such as iPhone 11 through 16 Pro Max, Samsung Galaxy S21 through S25 Ultra, Google Pixel, Xiaomi, and OnePlus devices, even when used with standard protective phone cases.",
  },
  {
    tag: "PAYMENT & COD",
    question: "How does Cash on Delivery (COD) work?",
    answer: "You do not need to enter credit card numbers or make an advance payment online. When you place an order, our Colombo team confirms your details and dispatches the parcel. When the domestic courier arrives at your doorstep, you simply hand the exact cash amount in Sri Lankan Rupees to the delivery officer.",
  },
  {
    tag: "DELIVERY TIMEFRAMES",
    question: "How long will it take for my order to arrive?",
    answer: "Deliveries within the Western Province (Colombo, Gampaha, Kalutara) typically arrive in 24 to 48 hours. Deliveries to Central, Southern, North Western, and other outstation districts arrive in 2 to 3 business days. Northern and Eastern provinces generally take 3 to 4 business days.",
  },
  {
    tag: "ORDER PROCESS",
    question: "How do I place an order?",
    answer: "You can click the 'Order A711' button on our website to fill in your name, delivery district, and vehicle model, which will pre-format a clean WhatsApp order message. Alternatively, you can message our official WhatsApp support directly at +94 78 234 9954 with your name, address, and desired quantity.",
  },
  {
    tag: "RETURNS & EXCHANGES",
    question: "Can I return or exchange the product if it arrives damaged?",
    answer: "Yes. Every AETHEX purchase comes with a 7-day replacement guarantee. If your mount arrives damaged during courier transit or exhibits any manufacturing defect, simply send a photo or video to our WhatsApp within 7 days and we will arrange a brand-new replacement unit.",
  },
  {
    tag: "TEMPERATURE & ROAD STABILITY",
    question: "Will the mount shake loose or melt under direct sunlight?",
    answer: "No. Unlike suction cups that rely on sticky gel pads that soften and unstick under 40°C+ solar heat, the A711 locks mechanically using expanding high-friction silicone pads anchored into your structural center console. It produces zero windshield blindspots and holds your phone firmly over expressway expansion joints and uneven roads.",
  },
  {
    tag: "AC VENT COMPARISON",
    question: "Why choose a console cup mount over an AC vent clip?",
    answer: "Modern smartphones often weigh between 200g to 240g. Clamping that weight onto 1mm plastic air-conditioning vent louvers frequently snaps the internal directional fins and obstructs cold air circulation. The console cup well provides an unshakeable, non-invasive mounting point that leaves all dashboard vents completely unhindered.",
  }
];

export default function FAQPage() {
  return (
    <LegalPageLayout
      title="Frequently Asked Questions"
      subtitle="Helpful answers about vehicle compatibility, smartphone sizes, Cash on Delivery, and courier dispatch."
      category="HELP & SUPPORT"
      lastUpdated="September 2026"
    >
      <div className="space-y-6">
        <FAQAccordion items={FAQ_DATA} />
      </div>
    </LegalPageLayout>
  );
}
