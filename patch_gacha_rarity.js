const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');
let css = fs.readFileSync('styles.css', 'utf8');

// Update renderEquippedCompanions to add rarity class for border styling
js = js.replace(/function renderEquippedCompanions\(\) {\n  const container = \$\('#companions-container'\);[\s\S]*?}\n/, (match) => {
  const newFunc = `function renderEquippedCompanions() {
  const container = $('#companions-container');
  if (!container) return;
  container.innerHTML = '';
  if (!S.compData || !S.compData.equipped) return;
  S.compData.equipped.forEach(id => {
    const comp = COMPANIONS.find(c => c.id === id);
    if (!comp) return;
    const div = document.createElement('div');
    // Apply rarity class for colored border
    const rarityClass = 'rarity-' + comp.rarity;
    div.className = `active-comp ${rarityClass}`;
    const img = document.createElement('img');
    img.src = comp.img;
    img.alt = comp.name;
    div.appendChild(img);
    container.appendChild(div);
  });
}`;
  return newFunc + '\n';
});

// Ensure renderEquippedCompanions is called after loading state and after equip actions
if (!js.includes('renderEquippedCompanions();')) {
  // After freshState init, call it in load() after state is built
  js = js.replace(/function load\(\) {/, match => `${match}\n  // After load, render equipped companions if any\n  renderEquippedCompanions();`);
  // Also after successful load of saved game in freshState (line where S is set)
  js = js.replace(/S = Object.assign\(freshState\(\), d\);/, 'S = Object.assign(freshState(), d); renderEquippedCompanions();');
}

// Add CSS for active-comp rarity borders and glowing effect for mythic/gold
if (!css.includes('.active-comp.rarity-')) {
  const rarityCss = `
/* Active companion (under cookie) rarity borders */
.active-comp.rarity-0 { border: 3px solid #bdc3c7; }
.active-comp.rarity-1 { border: 3px solid #2ecc71; }
.active-comp.rarity-2 { border: 3px solid #3498db; }
.active-comp.rarity-3 { border: 3px solid #9b59b6; }
.active-comp.rarity-4 { border: 3px solid #f1c40f; box-shadow: 0 0 10px #f1c40f; }
.active-comp.rarity-5 { border: 3px solid #e74c3c; box-shadow: 0 0 15px #e74c3c; animation: pulseRed 2s infinite; }
`;
  css += '\n' + rarityCss;
}

fs.writeFileSync('app.js', js);
fs.writeFileSync('styles.css', css);
console.log('Updated renderEquippedCompanions with rarity borders and ensured it is called; added CSS for active-comp rarity styling.');
