export interface LoyaltyTier {
  name: "Initiate" | "Sentinel" | "Apex";
  minPoints: number;
  maxPoints: number | null;
  benefits: string[];
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: "Initiate",
    minPoints: 0,
    maxPoints: 1000,
    benefits: [
      "1 Point per 100 LKR spent on all hardware",
      "Standard White Glove courier transit",
      "Direct bank transfer automated verification",
    ],
  },
  {
    name: "Sentinel",
    minPoints: 1001,
    maxPoints: 5000,
    benefits: [
      "1.25x Points multiplier on custom builds",
      "24-Hour advance reservation on all droplists",
      "Complimentary artisan switch tuning on orders",
      "Direct WhatsApp concierge line",
    ],
  },
  {
    name: "Apex",
    minPoints: 5001,
    maxPoints: null,
    benefits: [
      "1.5x Points multiplier on bespoke atelier curations",
      "Bespoke laser engraving on anodized weights",
      "Invitation to confidential 1-of-1 prototype trials",
      "Dedicated lead hardware engineer liaison",
    ],
  },
];

export interface RewardVoucher {
  id: string;
  code: string;
  pointsCost: number;
  discountLKR: number;
  title: string;
  description: string;
}

export const REWARD_VOUCHERS: RewardVoucher[] = [
  {
    id: "voucher-500",
    code: "LOYALTY-500",
    pointsCost: 500,
    discountLKR: 500,
    title: "Rs. 500 Atelier Credit",
    description: "Instant checkout credit applicable on any mechanical keyboard order.",
  },
  {
    id: "voucher-1500",
    code: "LOYALTY-1500",
    pointsCost: 1500,
    discountLKR: 1500,
    title: "Rs. 1,500 Atelier Credit",
    description: "Substantial credit towards artisan keycaps or custom switch kits.",
  },
  {
    id: "voucher-3500",
    code: "APEX-BESPOKE",
    pointsCost: 3500,
    discountLKR: 3500,
    title: "Rs. 3,500 Titanium Credit",
    description: "Reserved for high-tier hardware acquisitions and custom cerakoting.",
  },
];

/**
 * Calculates earned points: 1 point per 100 LKR
 */
export function calculatePointsForAmount(amountLKR: number): number {
  return Math.floor(Math.max(0, amountLKR) / 100);
}

/**
 * Determines loyalty tier based on point balance
 */
export function getTierFromPoints(points: number): LoyaltyTier {
  if (points >= 5001) return LOYALTY_TIERS[2]; // Apex
  if (points >= 1001) return LOYALTY_TIERS[1]; // Sentinel
  return LOYALTY_TIERS[0]; // Initiate
}

/**
 * Calculates progress percentage towards next tier
 */
export function getTierProgress(points: number): {
  currentTier: LoyaltyTier;
  nextTier: LoyaltyTier | null;
  pointsToNext: number;
  percentage: number;
} {
  const currentTier = getTierFromPoints(points);

  if (currentTier.name === "Apex") {
    return {
      currentTier,
      nextTier: null,
      pointsToNext: 0,
      percentage: 100,
    };
  }

  if (currentTier.name === "Initiate") {
    const target = 1000;
    const progress = Math.min(100, Math.round((points / target) * 100));
    return {
      currentTier,
      nextTier: LOYALTY_TIERS[1],
      pointsToNext: Math.max(0, target - points),
      percentage: progress,
    };
  }

  // Sentinel to Apex (1001 to 5001)
  const range = 5001 - 1001;
  const currentInRange = points - 1001;
  const progress = Math.min(100, Math.round((currentInRange / range) * 100));
  return {
    currentTier,
    nextTier: LOYALTY_TIERS[2],
    pointsToNext: Math.max(0, 5001 - points),
    percentage: progress,
  };
}
