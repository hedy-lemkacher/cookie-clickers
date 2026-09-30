const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Bowling
const bowlingWrong = `return () => cancelAnimationFrame(raf);
  btn.addEventListener('click', () => {`;
code = code.replace(bowlingWrong, `btn.addEventListener('click', () => {`);

// End of Bowling: 
code = code.replace(/api\.close\(\), 2000\);\n      \}\n    \}\n  \}\);\n\n\}/, 
  `api.close(), 2000);\n      }\n    }\n  });\n  return () => cancelAnimationFrame(raf);\n}`);

// 2. Basketball
const baskWrong = `return () => { cancelAnimationFrame(raf); cancelAnimationFrame(shootRaf); };
  btn.addEventListener('click', () => {`;
code = code.replace(baskWrong, `btn.addEventListener('click', () => {`);

// End of Basketball:
code = code.replace(/api\.close\(\), 1500\);\n          \}\n        \}\n      \}\n      shootRaf = requestAnimationFrame\(animateShoot\);\n    \}\n    animateShoot\(\);\n  \}\);\n\}/, 
  `api.close(), 1500);\n          }\n        }\n      }\n      shootRaf = requestAnimationFrame(animateShoot);\n    }\n    animateShoot();\n  });\n  return () => { cancelAnimationFrame(raf); cancelAnimationFrame(shootRaf); };\n}`);

// 3. Football
const footWrong = `return () => { cancelAnimationFrame(raf); cancelAnimationFrame(shootRaf); };
  btn.addEventListener('click', () => {
    if (!playing || shooting || tries <= 0) return;
    shooting = true;
    cookieY = 0;`;
code = code.replace(footWrong, `btn.addEventListener('click', () => {
    if (!playing || shooting || tries <= 0) return;
    shooting = true;
    cookieY = 0;`);

// End of Football:
code = code.replace(/api\.close\(\), 1500\);\n      \}\n      shootRaf = requestAnimationFrame\(animateShoot\);\n    \}\n    animateShoot\(\);\n  \}\);\n\}/, 
  `api.close(), 1500);\n      }\n      shootRaf = requestAnimationFrame(animateShoot);\n    }\n    animateShoot();\n  });\n  return () => { cancelAnimationFrame(raf); cancelAnimationFrame(shootRaf); };\n}`);

fs.writeFileSync('app.js', code);
console.log('Fixed celestial games event listeners.');
