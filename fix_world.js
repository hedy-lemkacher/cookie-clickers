const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const targetFuncRegex = /function renderWorldMenu\(\) \{[\s\S]*?  \}\);\n\}/;

const newFunc = `function renderWorldMenu() {
  const grid = $('#worldsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  
  if (worlds.length === 0) {
    grid.innerHTML = '<div style="color:var(--muted);text-align:center;padding:30px;width:100%;grid-column:1/-1;">Aucun monde créé. Commencez une nouvelle partie !</div>';
  }
  
  for (let i = 0; i < worlds.length; i++) {
    const w = worlds[i];
    const isCurrent = (w.id === activeWorldId);
    const card = document.createElement('div');
    card.className = 'world-card' + (isCurrent ? ' active' : '');
    
    const modeName = w.mode === 'speedrun' ? 'Speedrun ⚡' : (w.mode === 'zen' ? 'Zen 🧘' : 'Classique 🍪');
    
    card.innerHTML = \`
      <div class="world-card-header">
        <h4 class="world-card-title">\${w.name}</h4>
        <span class="world-card-mode \${w.mode}">\${modeName}</span>
      </div>
      <div class="world-card-stats">
        <div><span>Cookies</span><strong>\${fmt(w.data ? (w.data.baked || 0) : 0)}</strong></div>
      </div>
      <div class="world-card-actions">
        \${!isCurrent ? \`<button class="btn-play" data-id="\${w.id}">Jouer</button>\` : \`<span class="active-badge">Actuel</span>\`}
        \${w.name !== 'defaut' && !isCurrent ? \`<button class="btn-delete" data-id="\${w.id}" title="Supprimer">🗑️</button>\` : ''}
      </div>
    \`;
    grid.appendChild(card);
  }
  
  const countEl = $('#worldMenuCount');
  if (countEl) countEl.textContent = worlds.length + ' / 5';
  
  const newBtn = $('#worldMenuNew');
  if (newBtn) newBtn.disabled = worlds.length >= 5;
  
  // Attach events
  grid.querySelectorAll('.btn-play').forEach(btn => {
    btn.addEventListener('click', (e) => {
      switchWorld(e.currentTarget.dataset.id);
    });
  });
  grid.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idToDel = e.currentTarget.dataset.id;
      if (confirm('Voulez-vous vraiment supprimer ce monde ?')) {
        worlds = worlds.filter(item => item.id !== idToDel);
        save();
        renderWorldMenu();
      }
    });
  });
}`;

if (targetFuncRegex.test(code)) {
  code = code.replace(targetFuncRegex, newFunc);
  fs.writeFileSync('app.js', code);
  console.log('Fixed renderWorldMenu in app.js');
} else {
  console.log('Could not find renderWorldMenu with regex');
}
