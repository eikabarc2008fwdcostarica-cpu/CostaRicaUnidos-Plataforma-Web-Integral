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

files.forEach(f => {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  const fileMatches = [];
  lines.forEach((line, idx) => {
    if (line.includes('<path') || line.includes('d="M') || line.includes('viewBox')) return;
    patterns.forEach(p => {
      const found = line.match(p.regex);
      if (found) found.forEach(val => fileMatches.push({ line: idx + 1, val }));
    });
  });
  const uniqueVals = [...new Set(fileMatches.map(m => m.val))];
  console.log(`${f}: ${fileMatches.length} matches. Unique: ${uniqueVals.join(', ')}`);
});
