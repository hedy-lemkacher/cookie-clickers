const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('app.js', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;

// Mock canvas to avoid errors
window.HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: () => {},
  fillRect: () => {},
  drawImage: () => {},
  fillText: () => {},
  measureText: () => ({width: 0})
});

// Mock localStorage
let store = {};
window.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => store[k] = v,
  removeItem: (k) => delete store[k]
};

try {
  window.eval(script);
  window.eval("S.ascensions = 1; renderGachaPane();");
  const pane = window.document.getElementById('gachaPane');
  console.log("HTML in gachaPane length:", pane.innerHTML.length);
  if (pane.innerHTML.length < 100) {
    console.log("Pane HTML:", pane.innerHTML);
  } else {
    console.log("Pane starts with:", pane.innerHTML.substring(0, 100));
  }
} catch (e) {
  console.error("Error during execution:", e);
}
