// src/lib/animations/config.ts — Global Animation Constants & Variants
import { type Variants } from 'framer-motion'

export const animations = {
  // Easing curves
  easing: {
    smooth: [0.25, 0.1, 0.25, 1],
    spring: [0.34, 1.56, 0.64, 1],
    bounce: [0.68, -0.6, 0.32, 1.6],
  },
  
  // Durations (seconds)
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    epic: 0.8,
  },
  
  // Stagger children
  stagger: {
    fast: 0.05,
    normal: 0.08,
    slow: 0.12,
  },
}

export const fadeIn: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: -16, 
    transition: { duration: 0.25 } 
  },
}

export const slideIn: Variants = {
  initial: { x: -30, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } 
  },
  exit: { 
    x: 30, 
    opacity: 0, 
    transition: { duration: 0.25 } 
  },
}

export const scaleUp: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1, 
    transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] } 
  },
  exit: { 
    scale: 0.95, 
    opacity: 0, 
    transition: { duration: 0.2 } 
  },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}
