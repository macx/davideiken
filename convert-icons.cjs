const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'assets', 'icons');
const files = {
  'routine': 'theme-auto',
  'light_mode': 'theme-light',
  'dark_mode': 'theme-dark'
};

Object.entries(files).forEach(([oldName, newName]) => {
  const content = fs.readFileSync(path.join(dir, `${oldName}.astro`), 'utf-8');
  const match = content.match(/<svg[\s\S]*<\/svg>/);
  if (match) {
    let svg = match[0];
    svg = svg.replace('class={className}', '');
    fs.writeFileSync(path.join(dir, `${newName}.svg`), svg);
  }
  fs.unlinkSync(path.join(dir, `${oldName}.astro`));
});
