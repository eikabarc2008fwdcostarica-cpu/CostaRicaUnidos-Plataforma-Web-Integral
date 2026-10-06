/**
 * COSTA RICA UNIDOS — TOKENS OFICIALES DE DISEÑO CÍVICO & NATURAL
 * Inspirado en la arquitectura institucional municipal limpia (escazu.go.cr)
 * fusionada con la identidad viva y natural costarricense.
 */

export const DESIGN_TOKENS = {
  colors: {
    // Identidad Nacional e Institucional
    red: '#C22727',
    redDark: '#990001',
    ink: '#131313',
    white: '#FDFDFF',
    navy: '#062A77',
    blue: '#0053AF',
    night: '#01004E',
    periwinkle: '#7D7DFF',

    // Naturaleza y Tradición Costarricense
    cream: '#F3E8CC',
    sun: '#FFCA26',
    green: '#19532B',
    kiwi: '#9ABC04',
    carrot: '#FB6015',
    guaria: '#9B59D0',
    guariaDark: '#6A2C91',
    wood: '#6B3E1F',
  },

  typography: {
    fontMain: "'Poppins', sans-serif",
    fontHeadline: "'Poppins', sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    }
  },

  radii: {
    sm: '8px',
    md: '16px',
    card: '24px',
    pill: '999px',
  },

  shadows: {
    soft: '0 10px 30px rgba(6, 42, 119, 0.08)',
    card: '0 14px 34px rgba(6, 42, 119, 0.09)',
    hover: '0 20px 48px rgba(6, 42, 119, 0.16)',
    glow: '0 0 24px rgba(255, 202, 38, 0.4)',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    hero: '5rem',
  },

  animation: {
    duration: {
      reveal: '0.9s',
      revealStagger: '0.1s',
      toucan: '3s',
      bloom: '4s',
      vine: '5s',
      leaf: '9s',
      rotator: '10s',
      oxcart: '18s',
      oxcartWheel: '3.2s',
      macaw: '24s',
      decorativeWheel: '30s',
      logoSpin: '24s',
    },
    easing: {
      rotator: 'cubic-bezier(0.7, 0, 0.2, 1)',
      smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
    }
  }
};

export default DESIGN_TOKENS;
