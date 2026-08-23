// src/lib/animations.ts — Unified Animation Presets & Variants
import { type Variants } from 'framer-motion'

// Page Transition
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } }
}

// Stagger Container & Items
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  }
}

// Spring Hover Scale
export const hoverScale = {
  whileHover: { scale: 1.02, y: -2 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 400, damping: 17 }
}

// Viewport Scroll Reveal
export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
}

// Polymer Chain Node Pulsing
export const chainNode = {
  initial: { r: 3, opacity: 0.7 },
  animate: { 
    r: 5, 
    opacity: 1,
    transition: { 
      duration: 2.5, 
      repeat: Infinity, 
      ease: 'easeInOut' 
    }
  }
}
