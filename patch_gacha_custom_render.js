const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

// Insert customId set near top (after COMPANIONS array definition)
if (!js.includes('const CUSTOM_COOKIE_IDS')) {
  const insertAfter = /const COMPANIONS = \[/;
  const customSet = `
// IDs of companions that keep their original image (friend‑specific cookies)
const CUSTOM_COOKIE_IDS = new Set([
  'le_crane_d_ayoub',
  'adam_sur_fifa',
  'le_panipuri_de_vikash',
  'les_lunettes_d_abdel',
  'la_casquette_d_hedy',
  'la_blessure_d_adam',
  'ayoub_au_tableau',
  'chris_sous_jolagreen'
]);
`;
  js = js.replace(insertAfter, match => `${match}${customSet}`);
}

// Update rendering of collection items in renderGachaPane
// Replace the block that builds html for unlocked companions
js = js.replace(/if \(unl\) \{\n\s+html \+= `\\<div class=\\"coll-item rarity-\${c\.rarity}\\" onclick=\\"equipCompanion\('\${c\.id}'\\)\\" title=\\"\$\{c\.name\}\\n\$\{c\.desc\.replace\('\{val\}', Math\.round\(companionVal\(c\.id\)\*100\)\)\}\\"\\>\n\s+<img src=\\"\$\{c\.img\}\\" alt=\\"\$\{c\.name\}\\"\\>\n\s+<div class=\\"lvl-badge\\">Lvl \$\{lvl\}<\\/div\\>\n\s+\$\{eq \? '\\<div class=\\"equipped-badge\\\>\\ÉQUIPÉ\\<\\/div\\\>' : ''\}\\n\s+<\\\/div\\>`;/, match => {
  return `if (unl) {
    const isCustom = CUSTOM_COOKIE_IDS.has(c.id);
    const baseHtml = `<div class="coll-item rarity-${c.rarity} ${isCustom ? '' : 'cookie-css'}" onclick="equipCompanion('${c.id}')" title="${c.name}\n${c.desc.replace('{val}', Math.round(companionVal(c.id)*100))}">`;
    const contentHtml = isCustom ?
      `\n      <img src="${c.img}" alt="${c.name}">` :
      '';
    const lvlHtml = `\n      <div class="lvl-badge">Lvl ${lvl}</div>`;
    const equipHtml = eq ? '\n      <div class="equipped-badge">ÉQUIPÉ</div>' : '';
    return baseHtml + contentHtml + lvlHtml + equipHtml + '\n    </div>`;
  }`;
});

fs.writeFileSync('app.js', js);
console.log('Patched renderGachaPane to use CSS cookies for non‑friend companions and added CUSTOM_COOKIE_IDS set.');
