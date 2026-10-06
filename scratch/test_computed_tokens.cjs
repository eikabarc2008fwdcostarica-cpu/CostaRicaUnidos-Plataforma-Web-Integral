const fs = require('fs');

const css = fs.readFileSync('src/index.css', 'utf8');

function extractTokensForSelector(cssContent, selectorPattern) {
  const tokens = {};
  const regex = new RegExp(selectorPattern + '\\s*\\{([\\s\\S]*?)\\}', 'g');
  let match;
  while ((match = regex.exec(cssContent)) !== null) {
    const block = match[1];
    const lines = block.split('\n');
    for (const line of lines) {
      const propMatch = line.match(/^\s*(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/);
      if (propMatch) {
        tokens[propMatch[1].trim()] = propMatch[2].trim();
      }
    }
  }
  return tokens;
}

const rootTokens = extractTokensForSelector(css, ':root');
const darkTokens = { ...rootTokens, ...extractTokensForSelector(css, 'html\\.dark,\\s*:root\\.dark,\\s*\\.dark') };
const lightTokens = { ...rootTokens, ...extractTokensForSelector(css, 'html\\.light') };

const checkProps = [
  '--cru-surface',
  '--cru-border',
  '--cru-text',
  '--cru-panel',
  '--cru-select-bg',
  '--cru-page-bg',
  '--cru-section-warm',
  '--cru-cartroad-bg',
  '--cru-card-bg'
];

console.log('=== VALORES EN MODO OSCURO (html.dark) ===');
checkProps.forEach(p => {
  console.log(`${p}: ${darkTokens[p] || 'NO DEFINIDO'}`);
});

console.log('\n=== VALORES EN MODO CLARO (html.light) ===');
checkProps.forEach(p => {
  console.log(`${p}: ${lightTokens[p] || 'NO DEFINIDO'}`);
});
