const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

// Add function to render equipped companions under the cookie
if (!js.includes('function renderEquippedCompanions')) {
  const renderFunc = `
function renderEquippedCompanions() {
  const container = $('#companions-container');
  if (!container) return;
  container.innerHTML = '';
  if (!S.compData || !S.compData.equipped) return;
  S.compData.equipped.forEach(id => {
    const comp = COMPANIONS.find(c => c.id === id);
    if (!comp) return;
    const div = document.createElement('div');
    div.className = 'active-comp';
    const img = document.createElement('img');
    img.src = comp.img;
    img.alt = comp.name;
    div.appendChild(img);
    container.appendChild(div);
  });
}
`;
  // Insert after refreshAll definition (around line 2850)
  const insertAfter = /function refreshAll\(\) \{[\s\S]*?\}/;
  js = js.replace(insertAfter, match => `${match}\n${renderFunc}`);
}

// Hook into equipCompanion to toggle equip and refresh display
if (js.includes('function equipCompanion')) {
  // Ensure equipCompanion exists (it should). We'll augment its body.
  js = js.replace(/function equipCompanion\(id\) \{[\s\S]*?\}/, match => {
    // Extract existing logic (may be simple toggle)
    const body = match.replace(/^function equipCompanion\(id\) \{/, '').replace(/\}$/, '').trim();
    const newBody = `
  if (S.compData.equipped.includes(id)) {
    // desequip
    S.compData.equipped = S.compData.equipped.filter(x => x !== id);
  } else {
    // limit to 2 equipped
    if (S.compData.equipped.length >= 2) {
      // remove first equipped
      S.compData.equipped.shift();
    }
    S.compData.equipped.push(id);
  }
  renderEquippedCompanions();
  renderGachaPane(); // re-render collection to update equip state
`;
    return `function equipCompanion(id) {${newBody}\n}`;
  });
}

fs.writeFileSync('app.js', js);
console.log('Added renderEquippedCompanions and updated equipCompanion.');
