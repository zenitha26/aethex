import { Variants } from "framer-motion";

/* -------------------------------- */
/* Fade Animations */
/* -------------------------------- */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* -------------------------------- */
/* Stagger Containers */
/* -------------------------------- */

export const staggerContainer = (
  staggerChildren = 0.1,
  delayChildren = 0
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/* -------------------------------- */
/* Hero Floating */
/* -------------------------------- */

export const floatingHero: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/* -------------------------------- */
/* Premium Button Hover */
/* -------------------------------- */

export const hoverScale: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.97,
  },
};

/* -------------------------------- */
/* Product Card Lift */
/* -------------------------------- */

export const hoverLift: Variants = {
  initial: {
    y: 0,
    scale: 1,
    boxShadow: "0 0 0 rgba(0,0,0,0)",
  },
  hover: {
    y: -10,
    scale: 1.02,
    boxShadow:
      "0 20px 40px -15px rgba(255,255,255,0.06), 0 0 60px -15px rgba(255,255,255,0.03)",
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* -------------------------------- */
/* Product Grid Reveal */
/* -------------------------------- */

export const gridReveal: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* -------------------------------- */
/* Page Transition */
/* -------------------------------- */

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.25,
    },
  },
};

/* -------------------------------- */
/* Dropdown Menu */
/* -------------------------------- */

export const dropdownMenu: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* -------------------------------- */
/* Cart Drawer */
/* -------------------------------- */

export const drawerAnimation: Variants = {
  hidden: {
    x: "100%",
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.3,
    },
  },
};

/* -------------------------------- */
/* Modal */
/* -------------------------------- */

export const modalAnimation: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
  },
};

/* -------------------------------- */
/* Premium Glow Pulse */
/* -------------------------------- */

export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      "0 0 0 rgba(255,255,255,0)",
      "0 0 30px rgba(255,255,255,0.08)",
      "0 0 0 rgba(255,255,255,0)",
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
    },
  },
};

/* -------------------------------- */
/* Skeleton Shimmer */
/* -------------------------------- */

export const shimmerEffect: Variants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    },
  },
};