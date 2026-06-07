"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export default function MotionWrapper({ children, ...props }: MotionWrapperProps) {
  return <motion.div {...props}>{children}</motion.div>;
}
