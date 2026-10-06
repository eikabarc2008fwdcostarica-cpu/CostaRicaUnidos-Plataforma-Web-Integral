const fs = require('fs');

const files = [
  'src/pages/Inicio.jsx',
  'src/components/Navbar.jsx',
  'src/components/navigation/MegaMenu.jsx',
  'src/components/home/SearchCard.jsx',
  'src/components/home/NewsSection.jsx',
  'src/components/home/NewsCard.jsx',
  'src/components/home/ServicesSection.jsx',
  'src/components/home/StatsBar.jsx',
  'src/components/home/FaqAccordion.jsx',
  'src/components/decorative/CartRoad.jsx',
  'src/components/home/TransparencyBlock.jsx',
  'src/components/home/HeroMunicipal.jsx'
];

const patterns = [
  { name: 'hex', regex: /#[0-9a-fA-F]{3,8}\b/g },
  { name: 'var-color', regex: /var\(--(?:white|ink|cream|night|obsidian)[^)]*\)/g },
  { name: 'rgba', regex: /rgba?\([^)]+\)/g },
  { name: 'tailwind-color', regex: /\b(?:bg|text|border)-(?:white|black|slate-\d+|gray-\d+)\b/g }
];

console.log('=== INVENTARIO DE COLORES FIJOS EN FASE 4A ===\n');

let totalCount = 0;

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log(f + ': NO EXISTE');
    return;
  }
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  const fileMatches = [];

  lines.forEach((line, idx) => {
    // Exclude purely SVG definitions or geo paths
    if (line.includes('<path') || line.includes('d="M') || line.includes('viewBox')) {
      return;
    }
    patterns.forEach(p => {
      const found = line.match(p.regex);
      if (found) {
        found.forEach(val => {
          fileMatches.push({
            line: idx + 1,
            type: p.name,
            val,
            snippet: line.trim()
          });
        });
      }
    });
  });

  totalCount += fileMatches.length;
  console.log(`📁 ${f} (${fileMatches.length} ocurrencias):`);
  const uniqueVals = [...new Set(fileMatches.map(m => m.val))];
  console.log(`   Valores únicos: ${uniqueVals.join(', ')}`);
  
  // Show detailed lines
  fileMatches.forEach(m => {
    console.log(`   L${m.line} [${m.type}]: ${m.val}  -->  ${m.snippet.substring(0, 90)}`);
  });
  console.log('');
});

console.log(`Total ocurrencias encontradas: ${totalCount}`);
