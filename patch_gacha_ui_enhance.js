const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');
let css = fs.readFileSync('styles.css', 'utf8');

// 1. Ensure companion items are smaller (60x60) and use CSS placeholder when not custom
css = css.replace(/\.gacha-item \{[\s\S]*?\}/, `.gacha-item {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  background: #eee;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #ccc;
}
.gacha-item img { max-width: 80%; max-height: 80%; object-fit: contain; }
`);

// Add CSS for placeholder cookies (non‑custom companions)
if (!css.includes('.gacha-item.cookie-css')) {
  css += `
/* Placeholder cookie style – colored by rarity */
.gacha-item.cookie-css.rarity-0 { background: #ecf0f1; border-color: #bdc3c7; }
.gacha-item.cookie-css.rarity-1 { background: #a8e6cf; border-color: #2ecc71; }
.gacha-item.cookie-css.rarity-2 { background: #aed6f1; border-color: #3498db; }
.gacha-item.cookie-css.rarity-3 { background: #d2b4de; border-color: #9b59b6; }
.gacha-item.cookie-css.rarity-4 { background: #f9e79f; border-color: #f1c40f; }
.gacha-item.cookie-css.rarity-5 { background: #f5b7b1; border-color: #e74c3c; animation: pulseRed 2s infinite; }
`;
}

// Add animation for reel spin
if (!css.includes('@keyframes reelSpin')) {
  css += `
@keyframes reelSpin {
  0% { transform: translateX(0); }
  100% { transform: translateX(var(--spin-distance)); }
}
`;
}

// 2. Insert left/right navigation buttons in renderGachaPane HTML
js = js.replace(/html \+= `\\<div class=\"gacha-machine\"\\>/, `html += `<div class="gacha-machine">
    <button id="gachaLeft" class="big-btn" style="margin-right:10px;">←</button>
    <button id="gachaRight" class="big-btn" style="margin-left:10px;">→</button>`);

// 3. After pane innerHTML, populate reel with companion items
js = js.replace(/html \+= `\\<div class=\"gacha-reel-container\"\\>/, `html += `<div class="gacha-reel-container">
      <div class="gacha-reel" id="gachaReel">`);
js = js.replace(/html \+= `\\<\/div\\>\\n      <\\/div\\>\`;/, `html += `
        </div>
      </div>`);

// 4. Append code to fill reel after renderGachaPane sets innerHTML
js = js.replace(/function renderGachaPane\(\) \{/, `function renderGachaPane() {
  const pane = document.getElementById('gachaPane');
  if (!pane) return;
`);
js = js.replace(/pane.innerHTML = html;/, `pane.innerHTML = html;
  // fill reel with companion items
  const reel = document.getElementById('gachaReel');
  if (reel) {
    reel.innerHTML = '';
    COMPANIONS.forEach(c => {
      const div = document.createElement('div');
      const isCustom = CUSTOM_COOKIE_IDS.has(c.id);
      const cssClass = isCustom ? '' : 'cookie-css';
      div.className = `gacha-item ${cssClass} rarity-${c.rarity}`;
      if (isCustom) {
        const img = document.createElement('img');
        img.src = c.img;
        img.alt = c.name;
        div.appendChild(img);
      }
      reel.appendChild(div);
    });
  }
  // navigation handlers
  const leftBtn = document.getElementById('gachaLeft');
  const rightBtn = document.getElementById('gachaRight');
  if (leftBtn && rightBtn && reel) {
    leftBtn.addEventListener('click', () => reel.scrollBy({ left: -120, behavior: 'smooth' }));
    rightBtn.addEventListener('click', () => reel.scrollBy({ left: 120, behavior: 'smooth' }));
  }
  // attach spin button handler (already attached later)
`);

// 5. Improve spin animation: use CSS variable for distance and add class
js = js.replace(/isGachaSpinning = true;\n  renderGachaPane\(\);/, `isGachaSpinning = true;
  renderGachaPane();
  // start spin animation
  const reel = document.getElementById('gachaReel');
  if (reel) {
    // calculate random offset based on result index (simulate 5 visible items)
    const itemWidth = 70; // approx width + margin
    const spinCount = Math.floor(Math.random()*5) + 5; // many turns
    const distance = -(spinCount * itemWidth) + (Math.floor(Math.random()*10)*itemWidth);
    reel.style.setProperty('--spin-distance', distance + 'px');
    reel.style.animation = 'reelSpin 3s cubic-bezier(0.2,0.8,0.2,1) forwards';
    setTimeout(() => {
      reel.style.animation = '';
      // highlight selected item (centered)
      const items = reel.children;
      const selectedIdx = Math.abs(Math.round(distance / itemWidth)) % items.length;
      const selected = items[selectedIdx];
      if (selected) selected.classList.add('selected');
    }, 3000);
  }
`);

// 6. Ensure selected class style (border bright)
if (!css.includes('.gacha-item.selected')) {
  css += `
.gacha-item.selected { box-shadow: 0 0 15px 5px gold; border-color: gold; }
`;
}

fs.writeFileSync('app.js', js);
fs.writeFileSync('styles.css', css);
console.log('Enhanced gacha UI: smaller items, navigation buttons, spin animation, placeholder cookies, selection highlight.');
