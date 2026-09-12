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

export interface OrderConfirmedItem {
  id?: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddressInfo {
  name?: string;
  address?: string;
  city?: string;
  district?: string;
  phone?: string;
}

export interface OrderConfirmedEmailProps {
  customerName?: string;
  orderId?: string;
  items?: OrderConfirmedItem[];
  subtotal?: number;
  shippingFee?: number;
  totalAmount?: number;
  paymentMethod?: string;
  shippingAddress?: ShippingAddressInfo;
  orderUrl?: string;
}

export default function OrderConfirmedEmail({
  customerName = "Distinguished Patron",
  orderId = "AET-ORD-98214",
  items = [
    {
      name: "ASPOR A711 360° Console Car Phone Mount",
      sku: "AET-A711-BLK",
      price: 2990,
      quantity: 1,
      image: "https://www.aethexstore.com/images/a711/cockpit_matte.jpg",
    },
  ],
  subtotal = 2990,
  shippingFee = 350,
  totalAmount = 3340,
  paymentMethod = "Direct Bank Transfer (CEFTS / LankaQR Verified)",
  shippingAddress = {
    name: "A. Perera",
    address: "No. 42 Alfred House Gardens",
    city: "Colombo 03",
    district: "Western Province",
    phone: "+94 77 123 4567",
  },
  orderUrl = "https://www.aethexstore.com/account/orders",
}: OrderConfirmedEmailProps) {
  const formatLKR = (val: number) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(val);

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
      <Preview>Order {orderId} confirmed. Hardware allocation and courier packaging initiated.</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Header Monogram */}
          <Section style={headerSection}>
            <Text style={brandMonogram}>A E T H E X</Text>
            <Text style={categoryLabel}>A U T O M O T I V E   H A R D W A R E   A T E L I E R</Text>
          </Section>

          <Hr style={hairlineDivider} />

          {/* Verification Notice */}
          <Section style={contentSection}>
            <Text style={heroTag}>ACQUISITION CONFIRMED // DISPATCH STAGE 01</Text>
            <Text style={mainHeading}>Order Confirmed & Prepared for Dispatch</Text>
            <Text style={paragraph}>
              Greetings {customerName},
            </Text>
            <Text style={paragraph}>
              Thank you for ordering with AETHEX STORE. Your order reference <strong style={{ color: "#FFFFFF" }}>{orderId}</strong> has been logged and authenticated. Our Colombo operations team is preparing your hardware for secure courier handover.
            </Text>
          </Section>

          {/* Items Breakdown */}
          <Section style={cardSection}>
            <div style={badgeContainer}>
              <Text style={cardSectionTitle}>ACQUIRED SPECIFICATIONS</Text>
              <Text style={orderRefText}>{orderId}</Text>
            </div>

            {items.map((item, index) => (
              <div key={index} style={itemRow}>
                {item.image && (
                  <Img
                    src={item.image}
                    alt={item.name}
                    width="64"
                    height="64"
                    style={productThumb}
                  />
                )}
                <div style={itemDetails}>
                  <Text style={productName}>{item.name}</Text>
                  {item.sku && <Text style={productSku}>SKU: {item.sku}</Text>}
                  <Text style={productQtyPrice}>
                    Qty: {item.quantity} • {formatLKR(item.price)} each
                  </Text>
                </div>
              </div>
            ))}

            <Hr style={innerDivider} />

            {/* Financial Breakdown */}
            <div style={summaryRow}>
              <Text style={summaryLabel}>Subtotal</Text>
              <Text style={summarySmallValue}>{formatLKR(subtotal)}</Text>
            </div>
            <div style={summaryRow}>
              <Text style={summaryLabel}>Courier Dispatch Fee</Text>
              <Text style={summarySmallValue}>
                {shippingFee === 0 ? "Complimentary" : formatLKR(shippingFee)}
              </Text>
            </div>
            <div style={{ ...summaryRow, marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <Text style={summaryTotalLabel}>Total Settled</Text>
              <Text style={summaryValue}>{formatLKR(totalAmount)}</Text>
            </div>
          </Section>

          {/* Delivery & Payment Information */}
          <Section style={cardSection}>
            <Text style={cardSectionTitle}>DESTINATION & SETTLEMENT</Text>
            
            <div style={{ marginBottom: "14px" }}>
              <Text style={infoLabel}>PAYMENT METHOD</Text>
              <Text style={infoValue}>{paymentMethod}</Text>
            </div>

            <div>
              <Text style={infoLabel}>DISPATCH DESTINATION</Text>
              <Text style={infoValue}>
                {shippingAddress.name}
                <br />
                {shippingAddress.address}
                <br />
                {shippingAddress.city}, {shippingAddress.district}
                <br />
                Contact: {shippingAddress.phone}
              </Text>
            </div>
          </Section>

          {/* Action CTA */}
          <Section style={ctaSection}>
            <Button href={orderUrl} style={primaryButton}>
              VIEW YOUR ORDER
            </Button>
            <Text style={ctaSubtext}>
              Real-time dispatch tracking will activate once handed to our islandwide courier.
            </Text>
          </Section>

          {/* Concierge Guarantee */}
          <Section style={trustSection}>
            <div style={trustItem}>
              <Text style={trustTitle}>7-DAY HARDWARE INTEGRITY WARRANTY</Text>
              <Text style={trustDesc}>Free immediate 1-to-1 replacement for manufacturing or transit defects.</Text>
            </div>
            <div style={trustItem}>
              <Text style={trustTitle}>WHATSAPP CONCIERGE DIRECT</Text>
              <Text style={trustDesc}>Live support 9:00 AM - 8:00 PM via +94 78 234 9954.</Text>
            </div>
          </Section>

          <Hr style={hairlineDivider} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              AETHEX STORE • COLOMBO, SRI LANKA
            </Text>
            <Text style={footerSubtext}>
              This is an automated confirmation of purchase. To modify your order or shipping address prior to dispatch, contact our WhatsApp desk immediately.
            </Text>
            <Link href="https://www.aethexstore.com" style={footerLink}>
              www.aethexstore.com
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
  margin: "14px 0",
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

const badgeContainer: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const cardSectionTitle: React.CSSProperties = {
  fontSize: "10px",
  fontFamily: "monospace",
  letterSpacing: "0.18em",
  color: "#6B6B6B",
  margin: 0,
};

const orderRefText: React.CSSProperties = {
  fontSize: "10px",
  fontFamily: "monospace",
  letterSpacing: "0.1em",
  color: "#FFFFFF",
  margin: 0,
};

const itemRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginBottom: "14px",
};

const productThumb: React.CSSProperties = {
  borderRadius: "8px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  objectFit: "cover" as const,
  backgroundColor: "#000000",
};

const itemDetails: React.CSSProperties = {
  flex: 1,
  paddingLeft: "10px",
};

const productName: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#FFFFFF",
  margin: "0 0 4px 0",
};

const productSku: React.CSSProperties = {
  fontSize: "10px",
  fontFamily: "monospace",
  color: "#6B6B6B",
  margin: "0 0 4px 0",
};

const productQtyPrice: React.CSSProperties = {
  fontSize: "11px",
  fontFamily: "monospace",
  color: "#9A9A9A",
  margin: 0,
};

const summaryRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "6px",
};

const summaryLabel: React.CSSProperties = {
  fontSize: "12px",
  color: "#6B6B6B",
  margin: 0,
};

const summarySmallValue: React.CSSProperties = {
  fontSize: "12px",
  fontFamily: "monospace",
  color: "#9A9A9A",
  margin: 0,
};

const summaryTotalLabel: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#FFFFFF",
  margin: 0,
};

const summaryValue: React.CSSProperties = {
  fontSize: "18px",
  fontFamily: "monospace",
  fontWeight: 700,
  color: "#FFFFFF",
  margin: 0,
};

const infoLabel: React.CSSProperties = {
  fontSize: "9px",
  fontFamily: "monospace",
  letterSpacing: "0.15em",
  color: "#6B6B6B",
  margin: "0 0 4px 0",
};

const infoValue: React.CSSProperties = {
  fontSize: "12px",
  lineHeight: "1.5",
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
