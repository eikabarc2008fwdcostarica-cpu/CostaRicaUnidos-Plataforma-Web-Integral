const fs = require('fs');
const path = require('path');

// 1. Parse registered colors in index.html tailwind.config
const htmlContent = fs.readFileSync('index.html', 'utf8');
const colorsStartIndex = htmlContent.indexOf('colors: {');
const colorsEndIndex = htmlContent.indexOf('fontFamily: {');

if (colorsStartIndex === -1 || colorsEndIndex === -1) {
  console.error('Could not find colors block in index.html');
  process.exit(1);
}

const colorsBlock = htmlContent.substring(colorsStartIndex, colorsEndIndex);
const registeredColorKeys = new Set();

// Extract top-level keys inside colors: { ... }
const lines = colorsBlock.split('\n');
for (const line of lines) {
  const trimmed = line.trim();
  // Check for lines like 'cru-text': 'var(--cru-text)', or 'cru-text': or key:
  const match = trimmed.match(/^['"]?([a-zA-Z0-9_-]+)['"]?:\s*/);
  if (match) {
    const key = match[1];
    if (key !== 'colors' && key !== 'DEFAULT' && key !== 'dark' && key !== 'light' && key !== 'forest') {
      registeredColorKeys.add(key);
    }
  }
}

console.log('=== Claves registradas en theme.extend.colors de index.html (' + registeredColorKeys.size + ') ===');
console.log([...registeredColorKeys].sort().join(', '));

// 2. Scan all .jsx and .tsx files in src/
function getAllFiles(dir, exts, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllFiles(filePath, exts, fileList);
    } else if (exts.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const srcFiles = getAllFiles('src', ['.jsx', '.tsx']);
console.log('\nEscaneando ' + srcFiles.length + ' archivos en src/ ...');

// Pattern: (bg|text|border|ring|from|to|via|divide|placeholder)-(cru|theme)-[a-z0-9-]+
// Note: also handle responsive/pseudo variants like hover:, focus:, active:, dark:, sm:, md:, lg:, xl:, etc.
const classPattern = /(?:[a-zA-Z0-9/:-]+:)?(bg|text|border|ring|from|to|via|divide|placeholder)-((?:cru|theme)-[a-z0-9-]+)/g;

const foundClasses = new Map(); // tokenName -> { prefixes: Set, files: Set, occurrences: number }

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = classPattern.exec(content)) !== null) {
    const prefix = match[1];
    const tokenName = match[2];
    if (!foundClasses.has(tokenName)) {
      foundClasses.set(tokenName, { prefixes: new Set(), files: new Set(), occurrences: 0 });
    }
    const info = foundClasses.get(tokenName);
    info.prefixes.add(prefix);
    info.files.add(file.replace(/\\/g, '/'));
    info.occurrences++;
  }
}

console.log('\n=== Tokens en uso detectados en src/ (' + foundClasses.size + ' tokens únicos) ===');

const unregistered = [];
const registered = [];

for (const [tokenName, info] of foundClasses.entries()) {
  const isRegistered = registeredColorKeys.has(tokenName);
  const data = {
    tokenName,
    isRegistered,
    prefixes: [...info.prefixes].join(', '),
    files: [...info.files],
    occurrences: info.occurrences
  };
  if (isRegistered) {
    registered.push(data);
  } else {
    unregistered.push(data);
  }
}

console.log('\n--- REGISTRADOS (' + registered.length + ') ---');
registered.sort((a, b) => a.tokenName.localeCompare(b.tokenName)).forEach(r => {
  console.log('✓ ' + r.tokenName + ' (prefijos: ' + r.prefixes + ', ' + r.occurrences + ' usos)');
});

console.log('\n--- NO REGISTRADOS (' + unregistered.length + ') ---');
if (unregistered.length === 0) {
  console.log('¡Ninguno! Todas las clases usadas están registradas.');
} else {
  unregistered.sort((a, b) => a.tokenName.localeCompare(b.tokenName)).forEach(u => {
    console.log('✗ ' + u.tokenName + ' (prefijos: ' + u.prefixes + ', ' + u.occurrences + ' usos)');
    u.files.forEach(f => console.log('   -> ' + f));
  });
}
