const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body>' + html + '<script>' + js + '</script></body></html>', { runScripts: 'dangerously', pretendToBeVisual: true });
dom.window.onerror = (msg, src, ln, col, err) => console.error('CRASH:', msg, err);
dom.window.console.error = (...args) => console.error('CONSOLE ERROR:', ...args);
setTimeout(() => console.log('Done'), 1000);
