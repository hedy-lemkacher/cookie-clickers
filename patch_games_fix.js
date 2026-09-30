const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Fix the `g` argument not being passed
const playMiniGameStr = `state.cleanup = g.start(state.api);`;
const playMiniGameReplacement = `state.cleanup = g.start(state.api, g);`;
code = code.replace(playMiniGameStr, playMiniGameReplacement);

// 2. Add cleanup functions to celestial games
// Bowling
const bowlingEnd = `runBowling();
    } else {
      playing = false;`;
const bowlingEndReplacement = `runBowling();
    } else {
      playing = false;
      cancelAnimationFrame(raf);`;
code = code.replace(bowlingEnd, bowlingEndReplacement);

const bowlingReturn = `btn.addEventListener('click', () => {`;
const bowlingReturnReplacement = `return () => cancelAnimationFrame(raf);\n  btn.addEventListener('click', () => {`;
code = code.replace(bowlingReturn, bowlingReturnReplacement);

// Basketball
const baskReturn = `btn.addEventListener('click', () => {`;
const baskReturnReplacement = `return () => { cancelAnimationFrame(raf); cancelAnimationFrame(shootRaf); };\n  btn.addEventListener('click', () => {`;
code = code.replace(baskReturn, baskReturnReplacement);

// Football
const footReturn = `btn.addEventListener('click', () => {`;
// There are multiple games, so I'll replace the football specifically.
code = code.replace(/btn\.addEventListener\('click', \(\) => \{\n    if \(\!playing \|\| shooting \|\| tries <= 0\) return;\n    shooting = true;\n    cookieY = 0;/g, 
  `return () => { cancelAnimationFrame(raf); cancelAnimationFrame(shootRaf); };\n  btn.addEventListener('click', () => {\n    if (!playing || shooting || tries <= 0) return;\n    shooting = true;\n    cookieY = 0;`);

// Also fix Laser (if I broke it). Wait, Laser's cleanup:
// function gameLaser(api) { ... return () => { playing = false; cancelAnimationFrame(raf); } }
// The laser was already returning a cleanup! But maybe I added !document.body.contains(api.body) and broke it?
// The user said "esquive laser ne marche plus".
// Why wouldn't Laser work? I replaced `if (!playing) return;` with `if (!playing || !document.body.contains(api.body)) return;`.
// Let's just revert that specifically because it's buggy if `document.body` works weirdly or I messed up the logic.
code = code.replace(/if \(!playing \|\| \!document\.body\.contains\(api\.body\)\) return;/g, `if (!playing) return;`);

// 3. Reset cooldowns for celestial games for players
const loadTarget = `if (S.chips > 100) S.chips = 50;`;
const loadReplacement = `if (S.chips > 100) S.chips = 50;
      ['celestial_bowling', 'celestial_basketball', 'celestial_football'].forEach(g => {
         if (S.games[g] && S.games[g] > Date.now()) S.games[g] = 0;
      });`;
code = code.replace(loadTarget, loadReplacement);

fs.writeFileSync('app.js', code);
console.log('Fixed games crashes, cleanups, and reset cooldowns.');
