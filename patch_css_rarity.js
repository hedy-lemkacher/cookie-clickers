const fs = require('fs');
let css = fs.readFileSync('styles.css','utf8');
if (!css.includes('.active-comp.rarity-')) {
  const rarityCss = `
/* Active companion rarity borders (under big cookie) */
.active-comp.rarity-0 { border: 3px solid #bdc3c7; }
.active-comp.rarity-1 { border: 3px solid #2ecc71; }
.active-comp.rarity-2 { border: 3px solid #3498db; }
.active-comp.rarity-3 { border: 3px solid #9b59b6; }
.active-comp.rarity-4 { border: 3px solid #f1c40f; box-shadow: 0 0 10px #f1c40f; }
.active-comp.rarity-5 { border: 3px solid #e74c3c; box-shadow: 0 0 15px #e74c3c; animation: pulseRed 2s infinite; }
`;
  css += '\n' + rarityCss;
  fs.writeFileSync('styles.css', css);
  console.log('Added active-comp rarity CSS.');
} else {
  console.log('Rarity CSS already present.');
}
