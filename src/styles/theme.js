/**
 * Dark High-Tech Design System
 * Forensic Lab / Neural Network Aesthetic
 */

export const colors = {
  // Primary Background
  background: {
    primary: '#0A0F16',      // Deep charcoal base
    secondary: '#111823',     // Slightly lighter panels
    tertiary: '#1A2332',      // Card surfaces
    overlay: 'rgba(10, 15, 22, 0.85)', // Transparent overlays
  },

  // Neon Accent Colors
  neon: {
    cyan: '#00FFFF',          // Primary data points
    magenta: '#FF00CC',       // Negative sentiment
    amber: '#FFB100',         // Neutral/warning
    electricBlue: '#4FC3F7',  // Positive sentiment
    lime: '#00FF88',          // Success states
    violet: '#BB86FC',        // Secondary highlights
  },

  // Sentiment-Specific Colors
  sentiment: {
    positive: '#4FC3F7',      // Electric blue
    negative: '#FF00CC',      // Magenta
    neutral: '#FFB100',       // Amber
    mixed: '#BB86FC',         // Violet
  },

  // Text Colors (High Contrast for Accessibility)
  text: {
    primary: '#FFFFFF',       // Pure white (7:1 contrast)
    secondary: '#B8C5D6',     // Muted blue-gray (4.5:1 contrast)
    tertiary: '#7A8FA6',      // Dimmed text
    accent: '#00FFFF',        // Cyan highlights
    disabled: '#4A5568',      // Disabled states
  },

  // Functional Colors
  functional: {
    success: '#00FF88',
    warning: '#FFB100',
    error: '#FF00CC',
    info: '#4FC3F7',
  },

  // Holographic Effects
  holographic: {
    glow: 'rgba(0, 255, 255, 0.3)',     // Cyan glow
    shadow: 'rgba(0, 0, 0, 0.6)',       // Deep shadow
    highlight: 'rgba(255, 255, 255, 0.05)', // Surface shine
    border: 'rgba(0, 255, 255, 0.2)',   // Subtle borders
  },
};

export const typography = {
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "'Orbitron', 'Inter', monospace",
    mono: "'Fira Code', 'Courier New', monospace",
  },

  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

export const shadows = {
  // Layered holographic shadows
  sm: `0 2px 8px ${colors.holographic.shadow}`,
  md: `0 4px 16px ${colors.holographic.shadow}, 0 0 24px ${colors.holographic.glow}`,
  lg: `0 8px 32px ${colors.holographic.shadow}, 0 0 48px ${colors.holographic.glow}`,
  xl: `0 16px 64px ${colors.holographic.shadow}, 0 0 64px ${colors.holographic.glow}`,

  // Neon glow effects
  neonCyan: `0 0 20px ${colors.neon.cyan}, 0 0 40px rgba(0, 255, 255, 0.4)`,
  neonMagenta: `0 0 20px ${colors.neon.magenta}, 0 0 40px rgba(255, 0, 204, 0.4)`,
  neonAmber: `0 0 20px ${colors.neon.amber}, 0 0 40px rgba(255, 177, 0, 0.4)`,
  neonBlue: `0 0 20px ${colors.neon.electricBlue}, 0 0 40px rgba(79, 195, 247, 0.4)`,
};

export const borders = {
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  width: {
    thin: '1px',
    medium: '2px',
    thick: '3px',
  },

  // Holographic borders with gradient
  holographic: `1px solid ${colors.holographic.border}`,
  neon: `2px solid ${colors.neon.cyan}`,
};

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '800ms',
  },

  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

export const gradients = {
  background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%)`,
  card: `linear-gradient(135deg, ${colors.background.tertiary} 0%, ${colors.background.secondary} 100%)`,
  holographic: `linear-gradient(135deg,
    rgba(0, 255, 255, 0.05) 0%,
    rgba(79, 195, 247, 0.05) 50%,
    rgba(187, 134, 252, 0.05) 100%)`,
  neon: `linear-gradient(90deg,
    ${colors.neon.cyan} 0%,
    ${colors.neon.electricBlue} 50%,
    ${colors.neon.violet} 100%)`,
};

export const zIndex = {
  base: 1,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  overlay: 400,
  tooltip: 500,
};

// Export complete theme object
export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borders,
  animations,
  gradients,
  zIndex,
};

export default theme;
