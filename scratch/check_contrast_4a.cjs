// WCAG 2.1 Relative Luminance and Contrast Ratio calculation
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function contrastRatio(hex1, hex2) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const pairs = [
  { name: 'Botón "Pagos en línea" (Blanco sobre Rojo)', text: '#FFFFFF', bg: '#C22727' },
  { name: 'Botón "Consulta o queja" (Ink sobre Amarillo)', text: '#131313', bg: '#FFCA26' },
  { name: 'Botón Hero "Ingresar al servicio" (Ink sobre Amarillo)', text: '#131313', bg: '#FFCA26' },
  { name: 'Botón Hero "Ver trámites" (Blanco sobre Rojo)', text: '#FFFFFF', bg: '#C22727' },
  { name: 'Botón "Iniciar sesión" (Blanco sobre Azul Soberano hover)', text: '#FFFFFF', bg: '#002B7F' },
  { name: 'Cintillo Superior (Blanco sobre Azul Noche #01004E)', text: '#FFFFFF', bg: '#01004E' },
  { name: 'Cintillo Superior item activo (Amarillo sobre Azul Noche)', text: '#FACC15', bg: '#01004E' },
  { name: 'Banda Transparencia (Blanco sobre Rojo #C22727)', text: '#FFFFFF', bg: '#C22727' },
  { name: 'ServiceCard Ventanilla (Blanco sobre Navy #062A77)', text: '#FFFFFF', bg: '#062A77' },
  { name: 'ServiceCard Concejo (Blanco sobre Rojo #C22727)', text: '#FFFFFF', bg: '#C22727' },
  { name: 'ServiceCard Averías (Blanco sobre Azul #0053AF)', text: '#FFFFFF', bg: '#0053AF' },
  { name: 'ServiceCard CCDR (Blanco sobre Verde #19532B)', text: '#FFFFFF', bg: '#19532B' },
  { name: 'ServiceCard GIS (Blanco sobre Noche #01004E)', text: '#FFFFFF', bg: '#01004E' },
  { name: 'ServiceCard CNE (Blanco sobre Rojo Oscuro #990001)', text: '#FFFFFF', bg: '#990001' },
  { name: 'ServiceCard Comercio (Ink sobre Amarillo #FFCA26)', text: '#131313', bg: '#FFCA26' },
  { name: 'ServiceCard Acceso funcionario (Ink sobre Kiwi #9ABC04)', text: '#131313', bg: '#9ABC04' },
  { name: 'StatsBar Claro (Rojo sobre Crema #F3E8CC)', text: '#C22727', bg: '#F3E8CC' },
  { name: 'StatsBar Oscuro (Rojo suave sobre Azul Noche #061536)', text: '#FF6B6B', bg: '#061536' },
  { name: 'Texto general Claro (Slate 900 #0F172A sobre #F8FAFC)', text: '#0F172A', bg: '#F8FAFC' },
  { name: 'Texto general Oscuro (#FFFFFF sobre #00040D)', text: '#FFFFFF', bg: '#00040D' },
  { name: 'Select nativo Oscuro (#FFFFFF sobre #0D1527)', text: '#FFFFFF', bg: '#0D1527' },
  { name: 'Select nativo Claro (#0F172A sobre #FFFFFF)', text: '#0F172A', bg: '#FFFFFF' }
];

console.log('=== VERIFICACIÓN DE CONTRASTE WCAG 2.1 AA (≥ 4.5:1) ===\n');
let allPass = true;
pairs.forEach(p => {
  const ratio = contrastRatio(p.text, p.bg);
  const pass = ratio >= 4.5;
  if (!pass) allPass = false;
  console.log(`${pass ? '✓' : '✗'} ${p.name}: ${ratio.toFixed(2)}:1 (Text: ${p.text}, Bg: ${p.bg})`);
});

console.log(`\nResultado global: ${allPass ? 'TODOS CUMPLEN WCAG 2.1 AA (≥ 4.5:1)' : 'HAY PARES QUE NO CUMPLEN'}`);
