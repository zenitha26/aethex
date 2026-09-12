import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Hr,
  Button,
} from "@react-email/components";

export interface AbandonedCartItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

export interface AbandonedCartEmailProps {
  customerName?: string;
  orderId?: string;
  cartItems?: AbandonedCartItem[];
  totalAmount?: number;
  recoveryUrl?: string;
}

export default function AbandonedCartEmail({
  customerName = "Valued Collector",
  orderId = "AET-84920",
  cartItems = [
    {
      name: "AETHEX ZERO-1 ARCHITECTURAL KEYBOARD",
      price: 145000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
      variant: "Forged Carbon / Linear Silent / Brass Plate",
    },
  ],
  totalAmount = 145000,
  recoveryUrl = "https://aethex.store/checkout",
}: AbandonedCartEmailProps) {
  const formattedTotal = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(totalAmount);

  return (
    <Html lang="en">
      <Head>
        <style>{`
          body {
            background-color: #050505;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #FFFFFF;
          }
        `}</style>
      </Head>
      <Preview>Your bespoke hardware selection is held in privileged reservation.</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Header Monogram */}
          <Section style={headerSection}>
            <Text style={brandMonogram}>A E T H E X</Text>
            <Text style={categoryLabel}>B E S P O K E   H A R D W A R E   A T E L I E R</Text>
          </Section>

          <Hr style={hairlineDivider} />

          {/* Hero Headline */}
          <Section style={contentSection}>
            <Text style={heroTag}>RESERVATION NOTICE // TELEMETRY HOLD</Text>
            <Text style={mainHeading}>Your Curation Awaits Final Dispatch</Text>
            <Text style={paragraph}>
              Greetings {customerName},
            </Text>
            <Text style={paragraph}>
              We noticed you initiated a bespoke reservation ({orderId.slice(0, 8).toUpperCase()}) but did not conclude settlement. Your allocated hardware unit is currently held in our priority fulfillment queue.
            </Text>
          </Section>

          {/* Reserved Items Section */}
          <Section style={cardSection}>
            <Text style={cardSectionTitle}>ALLOCATED SPECIFICATIONS</Text>
            {cartItems.map((item, index) => (
              <div key={index} style={itemRow}>
                {item.image && (
                  <Img
                    src={item.image}
                    alt={item.name}
                    width="72"
                    height="72"
                    style={productThumb}
                  />
                )}
                <div style={itemDetails}>
                  <Text style={productName}>{item.name}</Text>
                  {item.variant && <Text style={productVariant}>{item.variant}</Text>}
                  <Text style={productQtyPrice}>
                    Qty: {item.quantity} • {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 0 }).format(item.price)}
                  </Text>
                </div>
              </div>
            ))}

            <Hr style={innerDivider} />

            <div style={summaryRow}>
              <Text style={summaryLabel}>Total Payable</Text>
              <Text style={summaryValue}>{formattedTotal}</Text>
            </div>
          </Section>

          {/* Primary Action Button */}
          <Section style={ctaSection}>
            <Button href={recoveryUrl} style={primaryButton}>
              COMPLETE YOUR ORDER
            </Button>
            <Text style={ctaSubtext}>
              Click to restore your session with shipping details preserved.
            </Text>
          </Section>

          {/* Trust Guarantees */}
          <Section style={trustSection}>
            <div style={trustItem}>
              <Text style={trustTitle}>DIRECT BANK SETTLEMENT</Text>
              <Text style={trustDesc}>Hatton National Bank instant CEFTS / LankaQR verification.</Text>
            </div>
            <div style={trustItem}>
              <Text style={trustTitle}>INSURED ISLAND-WIDE TRANSIT</Text>
              <Text style={trustDesc}>Protected dispatch via armored courier logistics.</Text>
            </div>
          </Section>

          <Hr style={hairlineDivider} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              AETHEX ATELIER • COLOMBO, SRI LANKA
            </Text>
            <Text style={footerSubtext}>
              If you have already settled this order via manual wire, please disregard this notice or reply directly to reach our concierge.
            </Text>
            <Link href="https://aethex.store" style={footerLink}>
              aethex.store
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Minimalist Quiet Luxury Monochrome Styles
const mainStyle: React.CSSProperties = {
  backgroundColor: "#050505",
  color: "#FFFFFF",
  padding: "40px 0",
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "#0B0B0B",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  maxWidth: "580px",
  margin: "0 auto",
  padding: "40px 32px",
};

const headerSection: React.CSSProperties = {
  textAlign: "center" as const,
  paddingBottom: "24px",
};

const brandMonogram: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  letterSpacing: "0.4em",
  color: "#FFFFFF",
  margin: "0 0 6px 0",
};

const categoryLabel: React.CSSProperties = {
  fontSize: "9px",
  letterSpacing: "0.25em",
  color: "#6B6B6B",
  margin: 0,
};

const hairlineDivider: React.CSSProperties = {
  borderColor: "rgba(255, 255, 255, 0.08)",
  margin: "24px 0",
};

const innerDivider: React.CSSProperties = {
  borderColor: "rgba(255, 255, 255, 0.05)",
  margin: "16px 0",
};

const contentSection: React.CSSProperties = {
  paddingBottom: "20px",
};

const heroTag: React.CSSProperties = {
  fontSize: "10px",
  fontFamily: "monospace",
  letterSpacing: "0.15em",
  color: "#9A9A9A",
  margin: "0 0 12px 0",
};

const mainHeading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 400,
  letterSpacing: "-0.02em",
  lineHeight: "1.3",
  color: "#FFFFFF",
  margin: "0 0 16px 0",
};

const paragraph: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#9A9A9A",
  margin: "0 0 14px 0",
};

const cardSection: React.CSSProperties = {
  backgroundColor: "#111111",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  padding: "20px",
  margin: "20px 0",
};

const cardSectionTitle: React.CSSProperties = {
  fontSize: "10px",
  fontFamily: "monospace",
  letterSpacing: "0.18em",
  color: "#6B6B6B",
  margin: "0 0 16px 0",
};

const itemRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "14px",
};

const productThumb: React.CSSProperties = {
  borderRadius: "8px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  objectFit: "cover" as const,
};

const itemDetails: React.CSSProperties = {
  flex: 1,
  paddingLeft: "12px",
};

const productName: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.02em",
  color: "#FFFFFF",
  margin: "0 0 4px 0",
};

const productVariant: React.CSSProperties = {
  fontSize: "11px",
  color: "#9A9A9A",
  margin: "0 0 4px 0",
};

const productQtyPrice: React.CSSProperties = {
  fontSize: "11px",
  fontFamily: "monospace",
  color: "#6B6B6B",
  margin: 0,
};

const summaryRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const summaryLabel: React.CSSProperties = {
  fontSize: "12px",
  letterSpacing: "0.08em",
  color: "#9A9A9A",
  margin: 0,
};

const summaryValue: React.CSSProperties = {
  fontSize: "18px",
  fontFamily: "monospace",
  fontWeight: 700,
  color: "#FFFFFF",
  margin: 0,
};

const ctaSection: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const primaryButton: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  color: "#000000",
  fontSize: "12px",
  fontFamily: "monospace",
  fontWeight: 700,
  letterSpacing: "0.15em",
  textDecoration: "none",
  borderRadius: "9999px",
  padding: "16px 36px",
  display: "inline-block",
};

const ctaSubtext: React.CSSProperties = {
  fontSize: "11px",
  color: "#6B6B6B",
  marginTop: "12px",
};

const trustSection: React.CSSProperties = {
  padding: "12px 0",
};

const trustItem: React.CSSProperties = {
  marginBottom: "12px",
};

const trustTitle: React.CSSProperties = {
  fontSize: "10px",
  fontFamily: "monospace",
  letterSpacing: "0.12em",
  color: "#FFFFFF",
  margin: "0 0 2px 0",
};

const trustDesc: React.CSSProperties = {
  fontSize: "11px",
  color: "#6B6B6B",
  margin: 0,
};

const footerSection: React.CSSProperties = {
  textAlign: "center" as const,
  paddingTop: "12px",
};

const footerText: React.CSSProperties = {
  fontSize: "10px",
  letterSpacing: "0.2em",
  color: "#4A4A4A",
  margin: "0 0 8px 0",
};

const footerSubtext: React.CSSProperties = {
  fontSize: "10px",
  lineHeight: "1.5",
  color: "#4A4A4A",
  margin: "0 0 12px 0",
};

const footerLink: React.CSSProperties = {
  fontSize: "11px",
  color: "#9A9A9A",
  textDecoration: "none",
};
