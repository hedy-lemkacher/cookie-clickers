
'use strict';
const $ = (sel) => document.querySelector(sel);
const rand = (a, b) => a + Math.random() * (b - a);
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/* =====================================================================
   DONNÉES DU JEU
   ===================================================================== */
const BUILDINGS = [
  { id: 'cursor',      name: 'Curseur',          plural: 'Curseurs',          icon: '👆', base: 15,     cps: 0.1,    desc: 'Clique automatiquement sur le cookie toutes les 10 secondes.' },
  { id: 'grandma',     name: 'Grand-mère',       plural: 'Grand-mères',       icon: '👵', base: 100,    cps: 1,      desc: 'Une gentille grand-mère qui cuit des cookies.' },
  { id: 'farm',        name: 'Ferme',            plural: 'Fermes',            icon: '🌾', base: 1100,   cps: 8,      desc: 'Fait pousser des plants de cookies.' },
  { id: 'mine',        name: 'Mine',             plural: 'Mines',             icon: '⛏️', base: 12000,  cps: 47,     desc: 'Extrait de la pâte et des pépites de chocolat.' },
  { id: 'factory',     name: 'Usine',            plural: 'Usines',            icon: '🏭', base: 130000, cps: 260,    desc: 'Production de cookies à la chaîne.' },
  { id: 'bank',        name: 'Banque',           plural: 'Banques',           icon: '🏦', base: 1.4e6,  cps: 1400,   desc: 'Génère des cookies grâce aux intérêts.' },
  { id: 'temple',      name: 'Temple',           plural: 'Temples',           icon: '🛕', base: 2e7,    cps: 7800,   desc: 'Rempli de précieux cookies antiques.' },
  { id: 'wizard',      name: 'Tour de sorcier',  plural: 'Tours de sorcier',  icon: '🧙', base: 3.3e8,  cps: 44000,  desc: 'Invoque des cookies par magie.' },
  { id: 'rocket',      name: 'Fusée',            plural: 'Fusées',            icon: '🚀', base: 5.1e9,  cps: 260000, desc: 'Rapporte des cookies de la planète Cookie.' },
  { id: 'portal',      name: "Maillot d'Adam",          plural: "Maillots d'Adam",          icon: '<img src=\"adam.png\" style=\"width: 1em; height: 1em; object-fit: cover; border-radius: 50%; vertical-align: bottom;\">', base: 7.5e10, cps: 1.6e6,  desc: 'Ouvre une porte vers le Cookievers.' },
  { id: 'timemachine', name: 'Le mechant chris', plural: 'Les mechants chris', icon: '<img src="chris.png" style="width: 1em; height: 1em; object-fit: cover; border-radius: 50%; vertical-align: bottom;">', base: 1e12, cps: 1e7, desc: 'Vole des cookies du passé pour son propre profit.' },
  { id: 'antimatter',  name: 'EBBY POSE',        plural: 'EBBY POSES',        icon: '<img src="ebby.png" style="width: 1em; height: 1em; object-fit: cover; border-radius: 50%; vertical-align: bottom;">', base: 1.4e13, cps: 6.5e7,  desc: 'Condense l\'antimatière de l\'univers en cookies.' },
  { id: 'prism',       name: 'Vikash Le BG',           plural: 'Vikash Le BG',           icon: '<img src=\"vikash.png\" style=\"width: 1em; height: 1em; object-fit: cover; border-radius: 50%; vertical-align: bottom;\">', base: 1.7e14, cps: 4.3e8,  desc: 'Transforme la lumière elle-même en cookies.' },
  { id: 'chancery',    name: 'Chancellerie',     plural: 'Chancelleries',     icon: '🏰', base: 2e15,   cps: 3e9,    desc: 'Dicte les lois de la consommation de cookies.' },
  { id: 'fractal',     name: 'Moteur Fractal',   plural: 'Moteurs Fractals',  icon: '🌌', base: 3e16,   cps: 2e10,   desc: 'Génère des cookies à partir de sous-cookies infinis.' },
  { id: 'javascript',  name: 'TOURELLE MAX',       plural: 'TOURELLES MAX',       icon: '🔫', base: 4e17,   cps: 1.5e11, desc: 'Code des cookies directement dans la matrice.' },
  { id: 'lmk',         name: 'LMK le boss',      plural: 'LMK les boss',        icon: '<img src="lmk.png" style="width: 1em; height: 1em; object-fit: cover; border-radius: 50%; vertical-align: bottom;">', base: 5e18, cps: 1.2e12, desc: 'Dirige les opérations d\'une main de fer.' },
];

/* --- Événements : 3 par bâtiment, débloqués à 5, 25 et 75 exemplaires --- */
const EVENT_NAMES = {
  cursor:      ['Ballet de curseurs', 'Tempête de clics', 'La main invisible'],
  grandma:     ['Goûter des grand-mères', 'Rassemblement des grand-mères', 'Congrès mondial des mamies'],
  farm:        ['Marché fermier', 'Récolte exceptionnelle', 'Moisson légendaire'],
  mine:        ['Pépites en surface', 'Filon de chocolat', 'Cœur de cacao'],
  factory:     ['Heures sup\'', 'Chaîne turbo', 'Révolution industrielle'],
  bank:        ['Dividendes', 'Taux d\'intérêt record', 'Krach à l\'envers'],
  temple:      ['Offrandes', 'Pèlerinage sacré', 'Apparition divine'],
  wizard:      ['Tour de passe-passe', 'Pluie d\'étoiles filantes', 'Grand sortilège'],
  rocket:      ['Livraison orbitale', 'Retour de mission', 'Colonie cookie'],
  portal:      ['Faille dimensionnelle', 'Invasion amicale', 'Convergence des mondes'],
  timemachine: ['Déjà-vu', 'Paradoxe gourmand', 'Boucle temporelle'],
  antimatter:  ['Pose parfaite', 'Regard ténébreux', 'L\'aura du bégé'],
  prism:       ['Arc-en-ciel', 'Aurore boréale', 'Supernova de lumière'],
  chancery:    ['Décret royal', 'Loi martiale sucrée', 'Constitution du Cookie'],
  fractal:     ['Mise en abyme', 'Récursivité infinie', 'Équation parfaite'],
  javascript:  ['Console.log(cookie)', 'Boucle infinie', 'Hack de la matrice'],
  lmk:         ['Réunion de direction', 'Restructuration', 'OPA Hostile'],
};
const EV_NEED = [5, 25, 75];      // exemplaires nécessaires
const EV_COUNT = [8, 12, 16];     // bâtiments qui défilent
const EV_BOOST = [2, 4, 7];       // production du bâtiment pendant l'événement
const EV_B_SEC = [15, 30, 60];    // secondes de production du bâtiment par clic
const EV_ALL_SEC = [1.5, 3, 6];   // ... ou secondes de production totale (le plus grand)
const EVENTS = [];
for (const b of BUILDINGS) {
  EVENT_NAMES[b.id].forEach((name, t) => EVENTS.push({ id: b.id + '_e' + t, b, tier: t, name, need: EV_NEED[t] }));
}

/* --- Améliorations des bâtiments (x2), débloquées à 1, 5, 25, 50, 100, 150, 200 --- */
const TIERS = [
  { need: 1,   costX: 10,   name: 'Qualité supérieure' },
  { need: 5,   costX: 50,   name: 'Technique affûtée' },
  { need: 25,  costX: 500,  name: 'Efficacité redoublée' },
  { need: 50,  costX: 5000, name: 'Maîtrise absolue' },
  { need: 100, costX: 5e5,  name: 'Savoir ancestral' },
  { need: 150, costX: 5e7,  name: 'Perfection divine' },
  { need: 200, costX: 5e9,  name: 'Transcendance' },
];
const UPGRADES = [
  { id: 'celestial_cd1', name: 'Sablier Céleste I', desc: 'Réduit le temps de recharge des jeux célestes de 25%.', cost: 1e12, icon: '⏳', unlocked: () => (S.temple && (S.temple.includes('celestial_bowling') || S.temple.includes('celestial_basketball') || S.temple.includes('celestial_football'))) || window.__adminMode },
  { id: 'celestial_cd2', name: 'Sablier Céleste II', desc: 'Réduit le temps de recharge des jeux célestes de 50%.', cost: 1e15, icon: '⏳', unlocked: () => S.ups.includes('celestial_cd1') },
  { id: 'celestial_cd3', name: 'Sablier Céleste III', desc: 'Réduit le temps de recharge des jeux célestes de 75%.', cost: 1e18, icon: '⏳', unlocked: () => S.ups.includes('celestial_cd2') },];
for (const b of BUILDINGS) {
  TIERS.forEach((t, i) => UPGRADES.push({
    id: b.id + i, icon: b.icon, tier: ROMAN[i], cost: b.base * t.costX,
    name: b.name + ' : ' + t.name,
    desc: b.id === 'cursor'
      ? 'Les curseurs et vos clics sont <b>deux fois</b> plus efficaces.'
      : 'Les ' + b.plural.toLowerCase() + ' sont <b>deux fois</b> plus efficaces.',
    building: b.id,
    unlocked: () => owned(b.id) >= t.need,
  }));
}
/* --- Souris : chaque clic rapporte +1 % de la production par seconde --- */
['Souris en plastique', 'Souris en fer', 'Souris en titane', 'Souris en adamantium',
 'Souris en unobtainium', 'Souris en éléricium', 'Souris en fantastacier', 'Souris incassable']
  .forEach((name, i) => UPGRADES.push({
    id: 'mouse' + i, icon: '🖱️', tier: ROMAN[i], cost: 5e4 * Math.pow(100, i), name,
    desc: 'Chaque clic rapporte en plus <b>1 %</b> de votre production par seconde.',
    unlocked: () => S.handmade >= 1e3 * Math.pow(100, i),
  }));
/* --- Améliorations spéciales : frénésie, cookies dorés, événements, combo, mini-jeux --- */
function special(prefix, icon, name, desc, costs, stat, needs) {
  costs.forEach((cost, i) => UPGRADES.push({
    id: prefix + i, icon, tier: ROMAN[i], cost, name: name + ' ' + ROMAN[i], desc,
    unlocked: () => stat() >= needs[i],
  }));
}
special('fzcd',   '⏱️', 'Levure express',         'La prochaine frénésie arrive <b>15 %</b> plus vite.',              [1e4, 1e7, 1e10],  () => S.frenzies,  [1, 5, 15]);
special('fzdur',  '⌛', 'Four à chaleur tournante', 'Les frénésies durent <b>25 %</b> plus longtemps.',               [3e4, 3e7, 3e10],  () => S.frenzies,  [2, 8, 20]);
special('fzpow',  '⚡', 'Sucre de canne',          'Débloque des frénésies plus puissantes : <b>×10</b>, <b>×15</b>, <b>×20</b>, puis rarement <b>×50</b>.', [1e5, 1e8, 1e11], () => S.frenzies, [3, 10, 25]);
special('gold',   '🍀', 'Trèfle à quatre feuilles', 'Les cookies dorés apparaissent <b>20 %</b> plus souvent.',      [5e5, 5e9],        () => S.golden,    [1, 5]);
special('evfreq', '🎪', 'Office du tourisme',      'Les événements de bâtiments arrivent <b>20 %</b> plus souvent.', [1e6, 1e9, 1e12],  () => S.evTotal,   [1, 5, 15]);
special('evgain', '🎟️', 'Tapis rouge',             'Les événements rapportent <b>50 %</b> de cookies en plus.',      [5e6, 5e10],       () => S.evTotal,   [3, 10]);
special('combo',  '👐', 'Doigts agiles',           'Le combo de clics peut monter <b>un cran plus haut</b>.',       [5e3, 5e6, 5e9],   () => S.bestCombo, [1.95, 2.95, 3.95]);
special('arcade', '🕹️', 'Salle d\'arcade',         'Les mini-jeux se rechargent <b>20 %</b> plus vite.',             [2e4, 2e8],        () => S.gamesPlayed, [1, 5]);
special('ticket', '🎫', 'Ticket d\'or',            'Les mini-jeux rapportent <b>40 %</b> de cookies en plus.',       [1e5, 1e9],        () => S.gamesPlayed, [3, 10]);

/* --- Raretés & Compagnons --- */
const RARITIES = {
  commun: { name: 'Commun', prob: 52.05, color: '#bdc3c7' },
  peu_commun: { name: 'Peu commun', prob: 26, color: '#2ecc71' },
  rare: { name: 'Rare', prob: 14, color: '#3498db' },
  epique: { name: 'Épique', prob: 6.2, color: '#9b59b6' },
  legendaire: { name: 'Légendaire', prob: 1.7, color: '#f1c40f' },
  mythique: { name: 'Mythique', prob: 0.05, color: '#ff4757' }
};

const COMPANIONS = [
  // Communs (Cookies CSS/SVG)
  { id: 'c_classic', name: 'Cookie classique', rarity: 'commun', powerType: 'cps', powerBase: 0.05, powerStep: 0.02, desc: 'Production globale +{val}%', style: { c: ['#f6cd86', '#dc9a4f', '#a5602a'], chip: '#4b2411', edge: '#8a4c1c' } },
  { id: 'c_mini', name: 'Mini-cookie', rarity: 'commun', powerType: 'click', powerBase: 0.05, powerStep: 0.02, desc: 'Puissance des clics +{val}%', style: { c: ['#ffd384', '#e2a85e', '#b87532'], chip: '#5c2c16', edge: '#8a4f1e', isMini: true } },
  { id: 'c_choco', name: 'Cookie tout chocolat', rarity: 'commun', powerType: 'cps', powerBase: 0.06, powerStep: 0.02, desc: 'Production globale +{val}%', style: { c: ['#5a2f17', '#3d1d0c', '#241006'], chip: '#180a03', edge: '#220d04' } },
  { id: 'c_pepite', name: 'Cookie pépite d\'or', rarity: 'commun', powerType: 'click', powerBase: 0.06, powerStep: 0.02, desc: 'Puissance des clics +{val}%', style: { c: ['#fab86b', '#de9141', '#a86221'], chip: '#7a3e1d', edge: '#7a3e1d', extraChips: true } },
  { id: 'c_caramel', name: 'Cookie caramel fondant', rarity: 'commun', powerType: 'building_grandma', powerBase: 0.15, powerStep: 0.05, desc: 'Les grands-mères produisent +{val}%', style: { c: ['#f8c291', '#e58e26', '#b71540'], chip: '#b71540', edge: '#e58e26', isCaramel: true } },
  { id: 'c_beurre', name: 'Cookie pur beurre', rarity: 'commun', powerType: 'building_cursor', powerBase: 0.20, powerStep: 0.06, desc: 'Les curseurs produisent +{val}%', style: { c: ['#fff4cc', '#ffeaa7', '#fdcb6e'], chip: '#d35400', edge: '#e1b12c', isButter: true } },
  { id: 'c_sucre', name: 'Cookie au sucre roux', rarity: 'commun', powerType: 'cps_click_hybrid', powerBase: 0.04, powerStep: 0.01, desc: 'Production et clics +{val}%', style: { c: ['#edd6b8', '#d7a15c', '#9b5e28'], chip: '#613613', edge: '#783e0c', isSugar: true } },
  { id: 'c_cannelle', name: 'Cookie à la cannelle', rarity: 'commun', powerType: 'events', powerBase: 0.12, powerStep: 0.03, desc: 'Gains des événements +{val}%', style: { c: ['#e0a96d', '#bf7a36', '#773d12'], chip: '#401804', edge: '#5a2d0c', isCinnamon: true } },
  
  // Peu communs (Cookies CSS/SVG)
  { id: 'c_ghost', name: 'Cookie fantôme', rarity: 'peu_commun', powerType: 'cps', powerBase: 0.10, powerStep: 0.03, desc: 'Production globale +{val}%', style: { c: ['#ffffff', '#dff9fb', '#c7ecee'], chip: '#00d2d3', edge: '#22a6b3', isGhost: true } },
  { id: 'c_ninja', name: 'Cookie ninja', rarity: 'peu_commun', powerType: 'click', powerBase: 0.10, powerStep: 0.03, desc: 'Puissance des clics +{val}%', style: { c: ['#3d3d3d', '#2f3542', '#1e272e'], chip: '#ff4757', edge: '#ff4757', isNinja: true } },
  { id: 'c_pirate', name: 'Cookie pirate', rarity: 'peu_commun', powerType: 'events', powerBase: 0.18, powerStep: 0.05, desc: 'Gains des événements +{val}%', style: { c: ['#8c531b', '#6d3c0e', '#482404'], chip: '#f1c40f', edge: '#2c3e50', isPirate: true } },
  { id: 'c_robot', name: 'Cookie robot', rarity: 'peu_commun', powerType: 'building_factory', powerBase: 0.25, powerStep: 0.06, desc: 'Les usines produisent +{val}%', style: { c: ['#dcdde1', '#718093', '#2f3640'], chip: '#00d2d3', edge: '#00d2d3', isRobot: true } },
  { id: 'c_choc_blanc', name: 'Cookie chocolat blanc', rarity: 'peu_commun', powerType: 'cps', powerBase: 0.12, powerStep: 0.03, desc: 'Production globale +{val}%', style: { c: ['#fff9e6', '#f5e6cb', '#deb887'], chip: '#ffffff', edge: '#c49a6c', berryChips: true } },
  { id: 'c_fraise', name: 'Cookie à la fraise', rarity: 'peu_commun', powerType: 'building_farm', powerBase: 0.25, powerStep: 0.06, desc: 'Les fermes produisent +{val}%', style: { c: ['#ff9ff3', '#f368e0', '#b83b5e'], chip: '#6ab04c', edge: '#b83b5e', isStrawberry: true } },
  { id: 'c_flocon', name: 'Cookie flocon d\'avoine', rarity: 'peu_commun', powerType: 'building_mine', powerBase: 0.25, powerStep: 0.06, desc: 'Les mines produisent +{val}%', style: { c: ['#fae5b9', '#dfb875', '#a37c3f'], chip: '#5c431d', edge: '#8a652a', isOat: true } },
  { id: 'c_sel', name: 'Cookie caramel salé', rarity: 'peu_commun', powerType: 'combo_power', powerBase: 0.15, powerStep: 0.04, desc: 'Efficacité des combos +{val}%', style: { c: ['#f6c589', '#d48834', '#8a4b08'], chip: '#ffffff', edge: '#6d3600', isSalt: true } },
  { id: 'c_citron', name: 'Cookie citron givré', rarity: 'peu_commun', powerType: 'frenzy_dur', powerBase: 0.15, powerStep: 0.04, desc: 'Durée des frénésies +{val}%', style: { c: ['#ffffc2', '#fff176', '#fbc02d'], chip: '#f57f17', edge: '#f9a825', isLemon: true } },
  { id: 'c_noisette', name: 'Cookie praliné noisette', rarity: 'peu_commun', powerType: 'building_bank', powerBase: 0.25, powerStep: 0.06, desc: 'Les banques produisent +{val}%', style: { c: ['#d7a77e', '#ab6e3a', '#6f3a12'], chip: '#401800', edge: '#592906', isNut: true } },

  // Rares (Cookies CSS/SVG)
  { id: 'c_knight', name: 'Cookie chevalier', rarity: 'rare', powerType: 'click', powerBase: 0.22, powerStep: 0.05, desc: 'Puissance des clics +{val}%', style: { c: ['#dfe4ea', '#a4b0be', '#57606f'], chip: '#2f3542', edge: '#2f3542', isKnight: true } },
  { id: 'c_astro', name: 'Cookie astronaute', rarity: 'rare', powerType: 'building_rocket', powerBase: 0.30, powerStep: 0.08, desc: 'Les fusées produisent +{val}%', style: { c: ['#341f97', '#1e272e', '#010a15'], chip: '#f1c40f', edge: '#54a0ff', isSpace: true } },
  { id: 'c_mage', name: 'Cookie magicien', rarity: 'rare', powerType: 'golden_freq', powerBase: 0.18, powerStep: 0.04, desc: 'Apparition des cookies dorés +{val}%', style: { c: ['#8854d0', '#5f27cd', '#341f97'], chip: '#ffd32a', edge: '#ff5e57', isMagic: true } },
  { id: 'c_dragon', name: 'Cookie dragon', rarity: 'rare', powerType: 'cps', powerBase: 0.25, powerStep: 0.06, desc: 'Production globale +{val}%', style: { c: ['#eb3b5a', '#b71540', '#4b1218'], chip: '#fed330', edge: '#fc5c65', isDragon: true } },
  { id: 'c_mineur', name: 'Cookie nain mineur', rarity: 'rare', powerType: 'building_mine', powerBase: 0.40, powerStep: 0.10, desc: 'Les mines produisent +{val}%', style: { c: ['#95a5a6', '#7f8c8d', '#34495e'], chip: '#f1c40f', edge: '#2c3e50', isMiner: true } },
  { id: 'c_banquier', name: 'Cookie banquier d\'or', rarity: 'rare', powerType: 'building_bank', powerBase: 0.40, powerStep: 0.10, desc: 'Les banques produisent +{val}%', style: { c: ['#ffeaa7', '#fdcb6e', '#d6a014'], chip: '#27ae60', edge: '#b7860b', isBanker: true } },
  { id: 'c_alchimiste', name: 'Cookie alchimiste', rarity: 'rare', powerType: 'building_wizard', powerBase: 0.40, powerStep: 0.10, desc: 'Les tours de sorcier produisent +{val}%', style: { c: ['#9b59b6', '#8e44ad', '#4a154b'], chip: '#2ecc71', edge: '#6c3483', isAlchemist: true } },
  { id: 'c_templier', name: 'Cookie templier sacré', rarity: 'rare', powerType: 'building_temple', powerBase: 0.40, powerStep: 0.10, desc: 'Les temples produisent +{val}%', style: { c: ['#f5f6fa', '#dcdde1', '#718093'], chip: '#e74c3c', edge: '#e74c3c', isTemplar: true } },
  { id: 'c_arcade', name: 'Cookie 8-bit rétro', rarity: 'rare', powerType: 'arcade_speed', powerBase: 0.25, powerStep: 0.06, desc: 'Vitesse de recharge des mini-jeux +{val}%', style: { c: ['#1e3799', '#0c2461', '#041033'], chip: '#e74c3c', edge: '#4a69bd', isArcade: true } },
  { id: 'c_glace', name: 'Cookie givré polaire', rarity: 'rare', powerType: 'frenzy_dur', powerBase: 0.25, powerStep: 0.06, desc: 'Durée des frénésies +{val}%', style: { c: ['#dff9fb', '#c7ecee', '#7ed6df'], chip: '#22a6b3', edge: '#22a6b3', isIce: true } },

  // Épiques (Cookies CSS/SVG)
  { id: 'c_demon', name: 'Cookie démon infernal', rarity: 'epique', powerType: 'cps_click_hybrid', powerBase: 0.30, powerStep: 0.08, desc: 'Production et clics +{val}%', style: { c: ['#ff4d4d', '#7f1d1d', '#300a0e'], chip: '#000000', edge: '#ff3838', isDemon: true } },
  { id: 'c_ange', name: 'Cookie séraphin céleste', rarity: 'epique', powerType: 'frenzy_dur', powerBase: 0.25, powerStep: 0.05, desc: 'Durée des frénésies +{val}%', style: { c: ['#ffffff', '#fdfbf7', '#f6e58d'], chip: '#f9ca24', edge: '#f6e58d', isAngel: true } },
  { id: 'c_roi', name: 'Cookie souverain impérial', rarity: 'epique', powerType: 'all_buildings', powerBase: 0.20, powerStep: 0.05, desc: 'Tous les bâtiments produisent +{val}%', style: { c: ['#f9ca24', '#f0932b', '#eb4d4b'], chip: '#6ab04c', edge: '#f0932b', isKing: true } },
  { id: 'c_gold', name: 'Cookie lingot suprême', rarity: 'epique', powerType: 'golden_reward', powerBase: 0.40, powerStep: 0.10, desc: 'Gain du jackpot Cookie d’Or +{val}%', style: { c: ['#ffeaa7', '#fdcb6e', '#e17055'], chip: '#d63031', edge: '#e17055', isGold: true } },
  { id: 'c_diamant', name: 'Cookie de diamant pur', rarity: 'epique', powerType: 'building_discount', powerBase: 0.15, powerStep: 0.03, desc: 'Réduit le coût des bâtiments de {val}%', style: { c: ['#e0f7fa', '#80deea', '#26c6da'], chip: '#ffffff', edge: '#00acc1', isDiamond: true } },
  { id: 'c_vortex', name: 'Cookie vortex astral', rarity: 'epique', powerType: 'building_prism', powerBase: 0.50, powerStep: 0.12, desc: 'Les prismes produisent +{val}%', style: { c: ['#6c5ce7', '#341f97', '#1b0a40'], chip: '#fd79a8', edge: '#a29bfe', isVortex: true } },
  { id: 'c_cyber', name: 'Cookie cybernétique', rarity: 'epique', powerType: 'building_antimatter', powerBase: 0.50, powerStep: 0.12, desc: 'Les antimatières produisent +{val}%', style: { c: ['#10ac84', '#01a3a4', '#1e272e'], chip: '#00d2d3', edge: '#10ac84', isCyber: true } },
  { id: 'c_nebuleuse', name: 'Cookie nébuleuse stellaire', rarity: 'epique', powerType: 'cps', powerBase: 0.35, powerStep: 0.08, desc: 'Production globale +{val}%', style: { c: ['#301b5c', '#5e2a84', '#a445b2'], chip: '#f78fb3', edge: '#e056fd', isNebula: true } },

  // Légendaires (Amis avec photo OU thématiques)
  { id: 'c_blessure', name: 'La blessure d\'Adam', img: 'la_blessure_d_adam.png', isFriend: true, rarity: 'legendaire', powerType: 'double_edged', powerBase: 0.90, powerStep: 0.25, desc: 'Production +{val}%, mais clics -50%' },
  { id: 'c_lunettes', name: 'Les lunettes d\'Abdel', img: 'les_lunettes_d_abdel.png', isFriend: true, rarity: 'legendaire', powerType: 'golden_vision', powerBase: 0.50, powerStep: 0.10, desc: 'Durée de toutes les frénésies +{val}%' },
  { id: 'c_casquette', name: 'La casquette d\'Hedy', img: 'la_casquette_d_hedy.png', isFriend: true, rarity: 'legendaire', powerType: 'discount', powerBase: 0.15, powerStep: 0.03, desc: 'Réduit le coût des bâtiments et améliorations de {val}%' },
  { id: 'c_phoenix', name: 'Cookie Phénix immortel', rarity: 'legendaire', powerType: 'cps_master', powerBase: 0.60, powerStep: 0.15, desc: 'Production globale +{val}% (Renaissance perpétuelle)', style: { c: ['#ff3838', '#ff793f', '#ffb142'], chip: '#ffffff', edge: '#cd201f', isPhoenix: true } },
  { id: 'c_chrono', name: 'Maître du Chronos', rarity: 'legendaire', powerType: 'chrono_master', powerBase: 0.50, powerStep: 0.12, desc: 'Vitesse mini-jeux et durée frénésies +{val}%', style: { c: ['#f1c40f', '#d35400', '#2c3e50'], chip: '#f39c12', edge: '#e67e22', isChrono: true } },
  { id: 'c_empereur', name: 'Cookie Empereur Stellaire', rarity: 'legendaire', powerType: 'all_buildings', powerBase: 0.45, powerStep: 0.10, desc: 'Tous les bâtiments produisent +{val}%', style: { c: ['#2c3e50', '#8e44ad', '#f1c40f'], chip: '#f39c12', edge: '#f1c40f', isEmperor: true } },
  { id: 'c_titan', name: 'Cookie Titan Colossal', rarity: 'legendaire', powerType: 'click_master', powerBase: 0.80, powerStep: 0.20, desc: 'Puissance des clics +{val}% (Impact écrasant)', style: { c: ['#2d3436', '#636e72', '#b2bec3'], chip: '#d63031', edge: '#e17055', isTitan: true } },

  // Mythiques (Amis avec photo OU Singularité)
  { id: 'c_panipuri', name: 'Le panipuri de Vikash', img: 'le_panipuri_de_vikash.png', isFriend: true, rarity: 'mythique', powerType: 'luck_mult', powerBase: 0.75, powerStep: 0.25, desc: '{val}% de chances de doubler n\'importe quel gain' },
  { id: 'c_crane', name: 'Le crâne d\'Ayoub', img: 'le_crane_d_ayoub.png', isFriend: true, rarity: 'mythique', powerType: 'cps_brain', powerBase: 1.20, powerStep: 0.50, desc: 'Production globale +{val}% (Esprit éclairé)' },
  { id: 'c_fifa', name: 'Adam sur FIFA', img: 'adam_sur_fifa.png', isFriend: true, rarity: 'mythique', powerType: 'speed', powerBase: 2.00, powerStep: 0.50, desc: 'Vitesse de production +{val}%' },
  { id: 'c_jolagreen', name: 'Chris sous Jolagreen', img: 'chris_sous_jolagreen.png', isFriend: true, rarity: 'mythique', powerType: 'minigame_god', powerBase: 1.50, powerStep: 0.50, desc: 'Gains de tous les mini-jeux +{val}%' },
  { id: 'c_blackhole', name: 'Cookie Trou Noir Infini', rarity: 'mythique', powerType: 'cps_master', powerBase: 2.50, powerStep: 0.60, desc: 'Production globale +{val}% (Singularité gravitationnelle)', style: { c: ['#0f0c29', '#302b63', '#24243e'], chip: '#ff007f', edge: '#ff4757', isBlackHole: true } }
];

/* --- Succès (on ajoute toujours les nouveaux À LA FIN : la sauvegarde retient leur position) --- */
const ACHIEVEMENTS = [
  { icon: '🍪', name: 'Réveil gourmand',      desc: 'Cuire 1 cookie.',                         test: () => S.baked >= 1 },
  { icon: '🥣', name: 'Petite fournée',       desc: 'Cuire 1 000 cookies.',                    test: () => S.baked >= 1e3 },
  { icon: '🧁', name: 'Fournée respectable',  desc: 'Cuire 100 000 cookies.',                  test: () => S.baked >= 1e5 },
  { icon: '💰', name: 'Millionnaire',         desc: 'Cuire 1 million de cookies.',             test: () => S.baked >= 1e6 },
  { icon: '👑', name: 'Magnat du cookie',     desc: 'Cuire 1 milliard de cookies.',            test: () => S.baked >= 1e9 },
  { icon: '🌌', name: 'Cookie cosmique',      desc: 'Cuire 1 billion de cookies.',             test: () => S.baked >= 1e12 },
  { icon: '👉', name: 'Clic-clac',            desc: 'Cliquer 100 fois.',                       test: () => S.clicks >= 100 },
  { icon: '💪', name: 'Tendinite',            desc: 'Cliquer 1 000 fois.',                     test: () => S.clicks >= 1000 },
  { icon: '⚡', name: 'Ça chauffe',           desc: 'Produire 10 cookies par seconde.',        test: () => steadyCps() >= 10 },
  { icon: '🔥', name: 'Four industriel',      desc: 'Produire 1 000 cookies par seconde.',     test: () => steadyCps() >= 1000 },
  { icon: '☄️', name: 'Production infernale', desc: 'Produire 100 000 cookies par seconde.',   test: () => steadyCps() >= 1e5 },
  { icon: '🏘️', name: 'Petit quartier',       desc: 'Posséder 10 bâtiments.',                  test: () => totalOwned() >= 10 },
  { icon: '🏙️', name: 'Métropole',            desc: 'Posséder 100 bâtiments.',                 test: () => totalOwned() >= 100 },
  { icon: '✨', name: 'Veinard',              desc: 'Cliquer sur un cookie doré.',             test: () => S.golden >= 1 },
  { icon: '🌟', name: 'Chasseur d\'or',       desc: 'Cliquer sur 7 cookies dorés.',            test: () => S.golden >= 7 },
  { icon: '🎓', name: 'Perfectionniste',      desc: 'Acheter 10 améliorations.',               test: () => S.ups.length >= 10 },
  // --- nouveaux ---
  { icon: '🎉', name: 'Premier événement',    desc: 'Vivre un événement de bâtiment.',         test: () => S.evTotal >= 1 },
  { icon: '🎊', name: 'Fêtard',               desc: 'Vivre 25 événements.',                    test: () => S.evTotal >= 25 },
  { icon: '🗺️', name: 'Explorateur',          desc: 'Vivre 10 événements différents.',         test: () => Object.keys(S.evSeen).length >= 10 },
  { icon: '🌪️', name: 'Frénétique',           desc: 'Vivre 10 frénésies.',                     test: () => S.frenzies >= 10 },
  { icon: '🥊', name: 'Combo !',              desc: 'Atteindre un combo de clics ×2.',         test: () => S.bestCombo >= 2 },
  { icon: '🌋', name: 'Combo volcanique',     desc: 'Atteindre un combo de clics ×4.',         test: () => S.bestCombo >= 4 },
  { icon: '🎮', name: 'Joueur',               desc: 'Jouer à un mini-jeu.',                    test: () => S.gamesPlayed >= 1 },
  { icon: '🏅', name: 'Roi de la fête foraine', desc: 'Jouer à 30 mini-jeux.',                 test: () => S.gamesPlayed >= 30 },
  { icon: '💯', name: 'Sans faute',           desc: 'Obtenir 100 % à un mini-jeu.',            test: () => S.perfect >= 1 },
  { icon: '😇', name: 'Ascension',            desc: 'Faire une ascension.',                    test: () => S.ascensions >= 1 },
  { icon: '🎨', name: 'Styliste',             desc: 'Personnaliser votre boulangerie.',        test: () => S.styled },
  { icon: '🪐', name: 'Galactique',           desc: 'Cuire 1 billiard de cookies.',            test: () => S.baked >= 1e15 },
  { icon: '🕳️', name: 'Singularité',          desc: 'Cuire 1 trillion de cookies.',            test: () => S.baked >= 1e18 },
  { icon: '🌆', name: 'Mégalopole',           desc: 'Posséder 500 bâtiments.',                 test: () => totalOwned() >= 500 },
  { icon: '✋', name: 'Main divine',          desc: 'Gagner 1 million de cookies en un seul clic.', test: () => S.bestClick >= 1e6 },
  { icon: '🌈', name: 'Lumière pure',         desc: 'Posséder un prisme.',                     test: () => owned('prism') >= 1 },
  { icon: '🎁', name: 'Fidèle',               desc: 'Récupérer un cadeau du jour.',            test: () => S.dailyCount >= 1 },
  // --- Succès Compagnons ---
  { icon: '🎰', name: 'Premier Recrutement',  desc: 'Débloquer votre premier compagnon.', test: () => S.compData && S.compData.unlocked && S.compData.unlocked.length >= 1 },
  { icon: '🛡️', name: 'Duo de Choc',          desc: 'Équiper deux compagnons en même temps.',                 test: () => S.compData && S.compData.equipped && S.compData.equipped.filter(Boolean).length >= 2 },
  { icon: '⚔️', name: 'Trio Invincible',      desc: 'Équiper trois compagnons en même temps.',                test: () => S.compData && S.compData.equipped && S.compData.equipped.filter(Boolean).length >= 3 },
  { icon: '💎', name: 'Évolution Gourmande',  desc: 'Améliorer un compagnon au niveau 3 ou plus.',             test: () => S.compData && S.compData.levels && Object.values(S.compData.levels).some(lvl => lvl >= 3) },
  { icon: '🌟', name: 'Collectionneur Averti', desc: 'Débloquer 10 compagnons différents.',                    test: () => S.compData && S.compData.unlocked && S.compData.unlocked.length >= 10 },
  { icon: '👑', name: 'Compagnon Légendaire', desc: 'Débloquer un compagnon de rareté Légendaire ou Mythique.', test: () => S.compData && S.compData.unlocked && S.compData.unlocked.some(id => { const c = COMPANIONS.find(x => x.id === id); return c && (c.rarity === 'legendaire' || c.rarity === 'mythique'); }) },
  { icon: '🌌', name: 'Divinité Mythique',     desc: 'Débloquer un compagnon de rareté Mythique.',             test: () => S.compData && S.compData.unlocked && S.compData.unlocked.some(id => { const c = COMPANIONS.find(x => x.id === id); return c && c.rarity === 'mythique'; }) },
];

/* --- Personnalisation --- */
const BG_THEMES = [
  { id: 'choco',   name: 'Chocolat',  bg: '#1b0f09', hi: '#5a3218' },
  { id: 'caramel', name: 'Caramel',   bg: '#221206', hi: '#8a5418' },
  { id: 'night',   name: 'Nuit',      bg: '#0b0e1c', hi: '#2b3266' },
  { id: 'ocean',   name: 'Océan',     bg: '#06141b', hi: '#145066' },
  { id: 'forest',  name: 'Forêt',     bg: '#0a150d', hi: '#26502f' },
  { id: 'berry',   name: 'Framboise', bg: '#1a0810', hi: '#6a1d40' },
  { id: 'violet',  name: 'Violet',    bg: '#120a1c', hi: '#46287a' },
  { id: 'slate',   name: 'Ardoise',   bg: '#111315', hi: '#3d444c' },
];
const COOKIE_THEMES = [
  { id: 'classic',    name: 'Classique',      c: ['#f6cd86', '#dc9a4f', '#a5602a'], chip: '#4b2411', edge: '#8a4c1c' },
  { id: 'dark',       name: 'Choco noir',     c: ['#9a6a48', '#5e3823', '#341b0e'], chip: '#f3e3c8', edge: '#2a1409' },
  { id: 'white',      name: 'Choco blanc',    c: ['#fffaf0', '#f1dfb8', '#c9a878'], chip: '#6b3a1a', edge: '#a8875a' },
  { id: 'caramel',    name: 'Caramel',        c: ['#ffd78a', '#e6a032', '#a8620c'], chip: '#5a2c0a', edge: '#8a4f08' },
  { id: 'matcha',     name: 'Matcha',         c: ['#d8eaa8', '#98b85e', '#5d7a2e'], chip: '#fbf5e6', edge: '#4a6324' },
  { id: 'velvet',     name: 'Red velvet',     c: ['#ee7b7b', '#b8323d', '#7a1822'], chip: '#fff4ee', edge: '#5e1019' },
  { id: 'blueberry',  name: 'Myrtille',       c: ['#c3b4f0', '#7f66c9', '#4b3790'], chip: '#f6f0ff', edge: '#382a70' },
  { id: 'strawberry', name: 'Fraise',         c: ['#ffc4d6', '#ee7fa3', '#b44a70'], chip: '#fffafc', edge: '#8e3456' },
];

/* =====================================================================
   ÉTAT + SAUVEGARDE (compatible avec l'ancienne version)
   ===================================================================== */
const SAVE_KEY = 'cookie-clicker-worlds-v3';
const LEGACY_SAVE_KEYS = ['cookie-clicker-tm251297', 'cookie-clicker', 'cookie-clicker-worlds-v2'];
const SPEEDRUN_GOAL = 500000;
const DEFAULT_CUSTOM = { name: 'La boulangerie de tm251297', bg: 'choco', bgCustom: '#7a4a18', cookie: 'classic', cookieCustom: '#dc9a4f', rain: true, numfmt: 'words' };

function freshState() {
  const now = Date.now();
  return {
    cookies: 0, baked: 0, bakedAll: 0, handmade: 0, clicks: 0, golden: 0,
    owned: {}, ups: [], ach: [], playTime: 0, last: now,
    frenzies: 0, fz: { start: now, next: now + 150000, until: 0, mult: 1, dur: 1 },
    evTotal: 0, evSeen: {}, evNext: now + rand(60, 120) * 1000, evViewed: 0,
    gamesPlayed: 0, games: {}, gameBest: {}, perfect: 0, daily: 0, dailyCount: 0,
    bestCombo: 1, bestClick: 0, chips: 0, ascensions: 0, milestone: -1, styled: false,
    casino: { windowStart: 0, bets: 0, lastResult: null },
    compData: { unlocked: [], equipped: [], shards: {}, levels: {}, pulls: 0, pityTracker: 0 },
    cheat: false, booMode: false,
    temple: [], // perm upgrades bought in Temple des Légendes
    custom: Object.assign({}, DEFAULT_CUSTOM),
  };
}
let S = freshState();
let resetting = false;
let worlds = [];
let speedrunRecords = [];
let activeWorldId = null;
let creatingFirstWorld = false;

function newWorldId() {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : 'world-' + Date.now() + '-' + Math.random().toString(36).slice(2);
}
function worldRecord(name, mode, goal, state) {
  return { id: newWorldId(), name, mode, goal: mode === 'speedrun' ? goal : null, speedrun: { startedAt: 0, durationMs: 0 }, createdAt: Date.now(), state: state || freshState() };
}
function activeWorld() { return worlds.find((world) => world.id === activeWorldId) || null; }

function load() {
  for (const key of LEGACY_SAVE_KEYS) {
    try { localStorage.removeItem(key); } catch (e) {}
  }
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (Array.isArray(d.worlds)) {
        worlds = d.worlds.slice(0, 5);
        speedrunRecords = d.speedrunRecords || [];
        worlds.forEach((world) => { world.speedrun = Object.assign({ startedAt: 0, durationMs: 0 }, world.speedrun); });
        activeWorldId = d.activeWorldId || (worlds[0] && worlds[0].id);
        const world = activeWorld();
        if (world) S = Object.assign(freshState(), world.state);
      } else if (d.cookies !== undefined) {
        const legacyState = Object.assign(freshState(), d);
        legacyState.custom = Object.assign({}, DEFAULT_CUSTOM, d.custom);
        legacyState.fz = Object.assign(freshState().fz, d.fz);
        const world = worldRecord('Mon premier monde', 'classic', null, legacyState);
        worlds = [world];
        activeWorldId = world.id;
        S = legacyState;
      }
  if (!S.custom.flappyResetV4) { S.games['flappy'] = []; S.custom.flappyResetV4 = true; }
      if (S.temple) {
        const migrations = {
          'celestial_flappy': 'celestial_bowling',
          'celestial_target': 'celestial_basketball',
          'celestial_simon': 'celestial_football'
        };
        S.temple = S.temple.map(id => migrations[id] || id);
      }
      S.custom = Object.assign({}, DEFAULT_CUSTOM, S.custom);
      S.fz = Object.assign(freshState().fz, S.fz);
      
      if (S.ascensions > 0 && S.chips === 0 && S.bakedAll > 1e12) {
          S.chips = 70; // Emergency compensation
      }
      if (!S.cheat) {
        S.chips = Math.min(70, Math.max(0, S.chips));
      }
      S.casino = Object.assign(freshState().casino, S.casino);
      S.compData = Object.assign(freshState().compData, S.compData);
    }
  } catch (e) { /* pas de sauvegarde lisible : on repart de zéro */ }
  if (S.bakedAll < S.baked) S.bakedAll = S.baked;
  window.__adminMode = !!S.cheat;
}
function save() {
  if (resetting) return;
  const world = activeWorld();
  if (!world) return;
  S.last = Date.now();
  world.state = S;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 2, activeWorldId, worlds, speedrunRecords })); } catch (e) {}
}

function worldModeName(world) {
  if (!world) return 'Créez votre premier monde';
  if (world.mode === 'speedrun') return 'SPEEDRUN · objectif ' + fmt(world.goal || 0);
  return 'CLASSIQUE';
}
function renderWorldUI() {
  casinoBuilt = false;
  renderWorldMenu();
  renderPerformance();
}
function renderWorldMenu() {
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
    
    card.innerHTML = `
      <div class="world-card-header">
        <h4 class="world-card-title">${w.name}</h4>
        <span class="world-card-mode ${w.mode}">${modeName}</span>
      </div>
      <div class="world-card-stats">
        <div><span>Cookies</span><strong>${fmt(w.data ? (w.data.baked || 0) : 0)}</strong></div>
      </div>
      <div class="world-card-actions">
        ${!isCurrent ? `<button class="btn-play" data-id="${w.id}">Jouer</button>` : `<span class="active-badge">Actuel</span>`}
        ${w.name !== 'defaut' && !isCurrent ? `<button class="btn-delete" data-id="${w.id}" title="Supprimer">🗑️</button>` : ''}
      </div>
    `;
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
}
function formatDuration(ms) {
  if (!ms) return 'En cours';
  return fmtTime(ms / 1000);
}
const CASINO_WINDOW = 15 * 60 * 1000;
let casinoBuilt = false, casinoSelectedBet = null;
function resetCasinoWindow() {
  const now = Date.now();
  if (!S.casino.windowStart || now - S.casino.windowStart >= CASINO_WINDOW) {
    S.casino.windowStart = now;
    S.casino.bets = 0;
    S.casino.lastResult = null;
  }
}
function casinoColor(number) { return number % 2 === 0 ? 'rouge' : 'noir'; }
function casinoRemaining() { resetCasinoWindow(); return Math.max(0, 5 - S.casino.bets); }
function casinoTimeLeft() { resetCasinoWindow(); return Math.max(0, CASINO_WINDOW - (Date.now() - S.casino.windowStart)); }
function casinoUnlimited() { const world = activeWorld(); return window.__adminMode || (world && world.mode === 'speedrun'); }
function showCasinoOutcome({ won, title, amount = 0, detail = '', resultColor = '' }) {
  const previous = document.getElementById('casinoOutcomePopup');
  if (previous) previous.remove();
  const popup = document.createElement('div');
  popup.id = 'casinoOutcomePopup';
  popup.className = 'casino-outcome-popup ' + (won ? 'won' : 'lost');
  const amountText = amount > 0 ? '+' + fmt(amount) : amount < 0 ? '-' + fmt(Math.abs(amount)) : '';
  popup.innerHTML = '<div class="casino-outcome-kicker">' + (won ? '🎉 GAGNÉ' : '💥 PERDU') + '</div>' +
    (resultColor ? '<div class="casino-outcome-color ' + resultColor + '">' + resultColor.toUpperCase() + '</div>' : '') +
    '<strong>' + title + '</strong>' +
    (amountText ? '<div class="casino-outcome-amount">' + amountText + ' cookies</div>' : '') +
    (detail ? '<small>' + detail + '</small>' : '');
  document.body.appendChild(popup);
  requestAnimationFrame(() => popup.classList.add('on'));
  setTimeout(() => {
    popup.classList.remove('on');
    popup.addEventListener('transitionend', () => popup.remove(), { once: true });
  }, 3600);
}
function updateCasinoLimit() {
  const limit = $('#casinoLimit');
  if (!limit) return;
  if (casinoUnlimited()) {
    limit.innerHTML = '<div class="casino-limit-box speedrun"><div class="cl-icon">🔥</div><div class="cl-info"><div class="cl-title">Mode Speedrun</div><div class="cl-subtitle">Mises illimitées</div></div></div>';
    limit.classList.remove('locked');
    const speedrunSpin = $('#casinoSpin');
    if (speedrunSpin) speedrunSpin.disabled = false;
    return;
  }
  const remaining = casinoRemaining(), left = casinoTimeLeft();
  const spin = $('#casinoSpin');
  if (remaining === 0) {
    const cost = Math.max(1, Math.floor(steadyCps() * 300));
    limit.innerHTML = '<div class="casino-limit-box locked"><div class="cl-icon">⏳</div><div class="cl-info"><div class="cl-title">Accro au jeu</div><div class="cl-subtitle">Prochaine série dans <span class="cl-time">' + fmtTime(left / 1000) + '</span></div></div></div>';
    const bHead = document.querySelector('#casinoPane .casino-bankroll');
    if (bHead && !document.getElementById('buyExtraSpin')) {
      const btn = document.createElement('button');
      btn.id = 'buyExtraSpin';
      btn.className = 'buy-spin-btn';
      btn.style.marginTop = '5px';
      btn.innerHTML = '⚡ Recharger 1 essai (' + fmt(cost) + ' 🍪)';
      bHead.appendChild(btn);
    }
    limit.classList.add('locked');
    if (spin) spin.disabled = true;
    
    const buyBtn = $('#buyExtraSpin');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        const currentCost = Math.max(1, Math.floor(steadyCps() * 300));
        if (S.cookies >= currentCost) {
          S.cookies -= currentCost;
          S.casino.bets--;
          save();
          updateCasinoLimit();
          toast('🎰', 'Tour supplémentaire !', 'Vous avez acheté un tour de roulette.');
        } else {
          toast('❌', 'Fonds insuffisants', 'Vous avez besoin de ' + fmt(currentCost) + ' cookies.');
        }
      });
    }
    return;
  }
  limit.innerHTML = '<div class="casino-limit-box active"><div class="cl-icon">🎰</div><div class="cl-info"><div class="cl-title"><span class="cl-remaining">' + remaining + ' / 5</span> mises restantes</div><div class="cl-subtitle">Nouvelle série dans <span class="cl-time">' + fmtTime(left / 1000) + '</span></div></div></div>';
  limit.classList.remove('locked');
  if (spin) spin.disabled = false;
}
function activateSecretCode() {
  const input = $('#secretCode'), status = $('#secretStatus');
  const codeValue = input.value.trim().toUpperCase();
  const isBoo = codeValue === 'BOO';

  if (codeValue !== 'LMK' && !isBoo) {
    status.textContent = 'Code incorrect.';
    status.classList.remove('on');
    return;
  }
  S.cheat = true;
  S.booMode = isBoo;
  S.cookies = isBoo ? 999e21 : Number.MAX_VALUE;
  S.baked = isBoo ? Math.max(S.baked, 999e21) : Number.MAX_VALUE;
  S.bakedAll = isBoo ? Math.max(S.bakedAll, 999e21) : Number.MAX_VALUE;
  S.chips = 9999;
  if (!S.temple) S.temple = [];
  BUILDINGS.forEach((building) => { S.owned[building.id] = 1000; });
  UPGRADES.forEach((upgrade) => { if (!S.ups.includes(upgrade.id)) S.ups.push(upgrade.id); });
  // Reset all cooldowns & attempt history
  S.games['flappy'] = [];
  Object.keys(S.games).forEach(k => { if (k !== 'flappy') S.games[k] = 0; });
  // Override allowClick to never block admin
  window.__adminMode = true;
  recalc();
  status.textContent = isBoo
    ? '👑 Code BOO activé : 999 trilliards par clic, 9 999 pépites et tous les jeux disponibles.'
    : '👑 Mode ADMIN activé : aucune limite, tout débloqué.';
  status.classList.add('on');
  input.value = '';
  toast('👑', isBoo ? 'Code BOO' : 'Mode ADMIN', isBoo ? 'Pouvoir absolu activé !' : 'Toutes les restrictions sont levées. Amusez-vous !');
  refreshAll();
  save();
}
$('#secretActivate').addEventListener('click', activateSecretCode);
$('#secretCode').addEventListener('keydown', (event) => { if (event.key === 'Enter') activateSecretCode(); });

let casinoWheelRaf = 0;

function renderCasinoPane() {
  const box = $('#casinoPane');
  if (!box) return;
  casinoBuilt = true;
  resetCasinoWindow();
  
  if (!S.casino.tab) S.casino.tab = 'roulette';
  
  if (S.baked < 1e6 && !casinoUnlimited()) {
    const progress = Math.min(100, S.baked / 1e6 * 100);
    box.innerHTML = '<div class="casino-page casino-locked-page"><div class="casino-page-head"><div><span class="casino-kicker">COOKIE ROYALE</span><h3>La grande roulette</h3><p>La table ouvre ses portes après votre premier million de cookies cuits.</p></div><div class="casino-lock-icon">🎰</div></div><div class="casino-unlock-bar"><div><span>Casino à débloquer</span><strong>Encore ' + fmt(Math.max(0, 1e6 - S.baked)) + ' cookies cuits</strong></div><div class="casino-progress"><i style="width:' + progress + '%"></i></div><small>' + fmt(S.baked) + ' / 1 million cookies cuits</small></div><div class="casino-preview"><div class="roulette-wheel-live"><span style="--angle:0deg">0</span><span style="--angle:120deg">4</span><span style="--angle:240deg">8</span><b>🔒</b></div><p>Les mises en millions, la roulette animée et les récompenses seront disponibles ici.</p></div></div>';
    return;
  }
  
  const tabsHtml = '<div class="casino-tabs" style="display:flex;gap:10px;margin-bottom:15px;justify-content:center;">' + 
    '<button class="big-btn casino-tab-btn ' + (S.casino.tab === 'roulette' ? 'active' : '') + '" data-tab="roulette" style="' + (S.casino.tab !== 'roulette' ? 'background:#8a4c1c;filter:brightness(0.7);' : '') + '">🎰 Roulette</button>' +
    '<button class="big-btn casino-tab-btn ' + (S.casino.tab === 'wheel' ? 'active' : '') + '" data-tab="wheel" style="' + (S.casino.tab !== 'wheel' ? 'background:#8a4c1c;filter:brightness(0.7);' : '') + '">🎡 Roue de la Fortune</button>' +
  '</div>';

  if (S.casino.tab === 'roulette') {
    const result = S.casino.lastResult;
    const casinoRule = casinoUnlimited() ? 'Mises illimitées dans ce monde Speedrun.' : 'Cinq mises toutes les 15 minutes.';
    
    let comboHtml = '';
    if (result && result.comboCount > 1) {
      comboHtml = '<div style="margin-top:10px; font-weight:bold; color:#f39c12; text-shadow: 0 0 5px #f39c12; font-size:1.2em;">🔥 Combo x' + result.comboCount + ' ! Multiplicateur bonus: x' + result.comboMult.toFixed(2) + '</div>';
    }
    const resultMarkup = result
      ? '<span class="casino-result-color ' + result.color + '">' + result.color.toUpperCase() + '</span><small>' + (result.won ? 'GAGNÉ +' + fmt(result.payout * (result.comboMult || 1)) + ' cookies' : 'PERDU · mise de ' + fmt(result.stake)) + '</small>' + comboHtml
      : 'Choisissez votre mise et votre pari.';
    const wheelNumbers = Array.from({ length: 10 }, (_, n) => '<span style="--angle:' + (n * (360 / 10)) + 'deg"></span>').join('');
    const minBet = casinoUnlimited() ? 1 : 1000000;
    
    box.innerHTML = tabsHtml + '<div class="casino-page"><div class="casino-page-head"><div><span class="casino-kicker">COOKIE ROYALE</span><h3>La grande roulette</h3><p>Une table indépendante de la fête foraine. ' + casinoRule + '</p></div><div class="casino-bankroll"><span>Solde</span><strong>' + fmt(S.cookies) + ' 🍪</strong></div></div>' +
      '<div class="roulette-layout"><div class="roulette-stage"><div class="roulette-wheel-live" id="rouletteWheel">' + wheelNumbers + '<i class="roulette-ball" id="rouletteBall"></i><b>🍪</b></div><div class="roulette-pointer">▼</div></div><div class="casino-bet-panel"><div class="casino-limit" id="casinoLimit"></div><label class="casino-big-stake">Mise <input id="casinoStake" type="number" min="' + minBet + '" step="' + minBet + '" value="' + minBet + '"> cookies</label><div class="casino-presets"><button data-casino-stake="10">10%</button><button data-casino-stake="25">25%</button><button data-casino-stake="50">50%</button><button data-casino-stake="75">75%</button><button data-casino-stake="100">100%</button></div><div class="casino-section-title">Couleur · ×2</div><div class="casino-bets"><button data-casino-color="rouge">🔴 Rouge</button><button data-casino-color="noir">⚫ Noir</button></div><p class="casino-result" id="casinoResult">' + resultMarkup + '</p><button class="big-btn casino-spin" id="casinoSpin">Lancer la roulette</button></div></div></div>';
    
    updateCasinoLimit();
    box.querySelectorAll('[data-casino-stake]').forEach((button) => button.addEventListener('click', () => { 
      const pct = parseInt(button.dataset.casinoStake, 10) / 100;
      $('#casinoStake').value = Math.max(minBet, Math.floor(S.cookies * pct));
    }));
    box.querySelectorAll('[data-casino-color]').forEach((button) => button.addEventListener('click', () => {
      casinoSelectedBet = { type: 'color', value: button.dataset.casinoColor };
      box.querySelectorAll('[data-casino-color]').forEach((item) => item.classList.toggle('selected', item === button));
    }));
    $('#casinoSpin').addEventListener('click', spinCasino);
    box.querySelectorAll('.casino-tab-btn').forEach(btn => btn.addEventListener('click', (e) => {
      S.casino.tab = e.target.dataset.tab;
      renderCasinoPane();
    }));
  } else {
    // WHEEL TAB
    const max = gameMax();
    const SEG = [
  { death: true, w: 0.3 },
  { cpsNeg: true, w: 1 },
  { halfBank: true, w: 1 },
  { bank15: true, w: 1 },
  { life: true, w: 0.3 },
  { cps1h: true, w: 1 },
  { clickFz: true, w: 1 },
  { cps1h: true, w: 1 }
];
    const COLORS = ['#000000', '#7a3e1d', '#8a4c1c', '#d9954a', '#ff00ff', '#a5602a', '#ffd166', '#a5602a'];
    const now = Date.now();
    if (!S.casino.wheelNext) S.casino.wheelNext = 0;
    const isFrenzyActive = now < S.fz.until || now < clickFrenzyUntil;
    const isReady = (now >= S.casino.wheelNext || casinoUnlimited()) && !isFrenzyActive;
    const n = SEG.length;
    const totalW = SEG.reduce((acc, s) => acc + (s.w || 1), 0);
    const odds = (predicate) => (SEG.reduce((sum, segment) => sum + (predicate(segment) ? segment.w : 0), 0) / totalW * 100).toFixed(1);
    const effectsMarkup = '<aside class="wheel-effects" id="wheelEffectsPanel"><button class="wheel-effects-toggle" id="wheelEffectsToggle" type="button" aria-expanded="true"><span><i>✦</i> Effets possibles</span></button><div class="wheel-effects-list"><div><span>☠️</span><p><strong>La Mort qui Tue</strong><small>' + odds((s) => s.death) + ' % · moitié des 3 derniers bâtiments acquis</small></p></div><div><span>📉</span><p><strong>Banqueroute</strong><small>' + odds((s) => s.halfBank) + ' % · moitié des cookies perdue</small></p></div><div><span>💸</span><p><strong>Perte de production</strong><small>' + odds((s) => s.cpsNeg) + ' % · 30 minutes de production perdues</small></p></div><div><span>💰</span><p><strong>Jackpot</strong><small>' + odds((s) => s.bank15) + ' % · +50 % de votre banque</small></p></div><div><span>🍀</span><p><strong>Heure chanceuse</strong><small>' + odds((s) => s.cps1h) + ' % · 1 heure de production gagnée</small></p></div><div><span>🌈</span><p><strong>La Vie qui Vie</strong><small>' + odds((s) => s.life) + ' % · les 2 derniers bâtiments doublent</small></p></div><div><span>👆</span><p><strong>Clic divin</strong><small>' + odds((s) => s.clickFz) + ' % · clics ×500 pendant 5 secondes</small></p></div></div></aside>';
    
    box.innerHTML = tabsHtml + '<div class="casino-page"><div class="casino-page-head"><div><span class="casino-kicker">COOKIE ROYALE</span><h3>Roue de la fortune</h3><p>Un tour de roue toutes les 30 minutes. Jackpot ou catastrophe garantis.</p></div><div class="casino-bankroll"><span>Prochain tour</span><strong id="cwNext">' + (isReady ? 'PRÊT !' : (Math.ceil((S.casino.wheelNext - now)/60000) + ' min')) + '</strong></div></div>' +
      '<div class="wheel-game-layout"><div class="wheel-wrap" style="margin:20px auto;"><div class="wheel-pointer">▼</div><canvas width="320" height="320" style="background:#5c3516;border-radius:50%;box-shadow:inset 0 10px 20px rgba(0,0,0,0.5);"></canvas></div>' +
      effectsMarkup + '</div>' +
      '<p class="casino-result" id="wheelResult">' + (isReady ? 'La roue est prête à tourner !' : 'Revenez plus tard...') + '</p>' +
      '<div class="center" style="margin-top:15px;"><button class="big-btn w-btn" ' + (isReady ? '' : 'disabled') + '>' + (isFrenzyActive ? 'Frénésie en cours...' : 'Tourner la roue !') + '</button></div></div>';
      
    const cv = box.querySelector('canvas'), g = cv.getContext('2d');
    const btn = box.querySelector('.w-btn');
    const res = box.querySelector('#wheelResult');
    const effectsPanel = box.querySelector('#wheelEffectsPanel');
    box.querySelector('#wheelEffectsToggle').addEventListener('click', () => {
      const collapsed = effectsPanel.classList.toggle('collapsed');
      box.querySelector('#wheelEffectsToggle').setAttribute('aria-expanded', String(!collapsed));
    });
    function draw(rot) {
      g.clearRect(0, 0, 320, 320);
      g.save();
      g.translate(160, 160);
      g.rotate(rot);
      let currentAngle = 0;
      for (let i = 0; i < n; i++) {
        const segArc = (SEG[i].w || 1) / totalW * Math.PI * 2;
        g.beginPath();
        g.moveTo(0, 0);
        g.arc(0, 0, 152, currentAngle, currentAngle + segArc);
        g.closePath();
        if (SEG[i].life) {
          const grad = g.createLinearGradient(0, -152, 0, 152);
          grad.addColorStop(0, 'red'); grad.addColorStop(0.5, 'lime'); grad.addColorStop(1, 'blue');
          g.fillStyle = grad;
        } else {
          g.fillStyle = COLORS[i];
        }
        g.fill();
        g.strokeStyle = '#2a170c';
        g.lineWidth = 3;
        g.stroke();
        g.save();
        g.rotate(currentAngle + segArc / 2);
        g.textAlign = 'right';
        g.textBaseline = 'middle';
        g.fillStyle = '#1b0f09';
        g.font = 'bold 14px Fredoka, sans-serif';
        const s = SEG[i];
        g.fillText(s.death ? '☠️' : s.life ? '🌈 x2' : s.halfBank ? '📉 /2' : s.clickFz ? '👆 x500' : s.bank15 ? '💰 x1.5' : s.cps1h ? '🍀 +1h' : s.cpsNeg ? '💸 -30m' : '', 140, 0);
        g.restore();
        currentAngle += segArc;
      }
      g.beginPath();
      g.arc(0, 0, 28, 0, Math.PI * 2);
      g.fillStyle = '#2a170c';
      g.fill();
      g.restore();
      g.font = '28px serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('🍪', 160, 162);
    }
    
    draw(0);
    
  btn.addEventListener('click', () => {
      const isFrenzyActive = Date.now() < S.fz.until || Date.now() < clickFrenzyUntil;
      if (!isReady || isFrenzyActive) return;
      btn.disabled = true;
      S.casino.wheelNext = Date.now() + 30 * 60 * 1000;
      save();
      
      
      let randVal = Math.random() * totalW;
      let target = 0, accum = 0;
      for (let i = 0; i < n; i++) {
        const w = SEG[i].w || 1;
        if (randVal >= accum && randVal < accum + w) { target = i; break; }
        accum += w;
      }
      const s = SEG[target];
      let targetStartAngle = 0;
      for (let i = 0; i < target; i++) targetStartAngle += (SEG[i].w || 1) / totalW * Math.PI * 2;
      const targetArc = (SEG[target].w || 1) / totalW * Math.PI * 2;
      const targetMidAngle = targetStartAngle + targetArc / 2;
      const final = 6 * Math.PI * 2 - Math.PI / 2 - targetMidAngle + rand(-targetArc * 0.35, targetArc * 0.35);
      const t0 = performance.now(), D = 4500;
      
      function frame(t) {
        const k = Math.min(1, (t - t0) / D);
        draw(final * (1 - Math.pow(1 - k, 4)));
        if (k < 1) { casinoWheelRaf = requestAnimationFrame(frame); return; }
        
        // resolve
        let gainVal = 0, lossVal = 0;
        if (s.death) {
          const lastThree = BUILDINGS.filter(b => S.owned[b.id] > 0).slice(-3);
          for (const b of lastThree) {
            S.owned[b.id] = Math.max(0, Math.floor(S.owned[b.id] / 2));
          }
          recalc();
          refreshStore();
          toast('☠️', 'La Mort qui Tue', 'La moitié de vos 3 derniers bâtiments acquis a disparu !');
        }
        if (s.life) {
          const ownedBlds = BUILDINGS.filter(b => S.owned[b.id] > 0);
          const lastTwo = ownedBlds.slice(-2);
          for (const b of lastTwo) {
            S.owned[b.id] *= 2;
          }
          recalc();
          refreshStore();
          toast('🌈', 'La Vie qui Vie', 'Vos deux derniers bâtiments ont doublé !');
        }
        if (s.halfBank) {
          lossVal = Math.floor(S.cookies / 2);
          S.cookies -= lossVal;
          toast('📉', 'Banqueroute', 'Vous avez perdu ' + fmt(lossVal) + ' cookies.');
        }
        if (s.clickFz) {
          clickFrenzyMult = 500;
          clickFrenzyUntil = Date.now() + 5000;
          toast('👆', 'Clic Divin', 'Clics x500 pendant 5s !');
        }
        if (s.bank15) {
          gainVal = Math.floor(S.cookies * 0.5);
          gain(gainVal);
          toast('💰', 'Jackpot', 'Vous gagnez ' + fmt(gainVal) + ' cookies !');
        }
        if (s.cps1h) {
          gainVal = steadyCps() * 3600;
          gain(gainVal);
          toast('🍀', 'Chance', 'Vous gagnez ' + fmt(gainVal) + ' cookies !');
        }
        if (s.cpsNeg) {
          lossVal = steadyCps() * 1800;
          if (lossVal > S.cookies) lossVal = S.cookies;
          S.cookies = Math.max(0, S.cookies - lossVal);
          toast('💸', 'Perte', 'Vous avez perdu ' + fmt(lossVal) + ' cookies.');
        }
        
        let msg = '';
        if (gainVal > 0) msg = '+' + fmt(gainVal) + ' cookies !';
        else if (lossVal > 0) msg = '-' + fmt(lossVal) + ' cookies...';
        
        res.innerHTML = s.death ? '☠️ LA MORT QUI TUE (-50% des 3 derniers bâtiments)' : s.life ? '🌈 LA VIE QUI VIE (Derniers x2)' : s.halfBank ? '📉 BANQUEROUTE ' + msg : s.clickFz ? '👆 CLIC DIVIN (Clics x500 pendant 5s)' : s.bank15 ? '💰 JACKPOT ' + msg : s.cps1h ? '🍀 CHANCE ' + msg : s.cpsNeg ? '💸 PERTE ' + msg : '';
        const wheelWon = Boolean(s.life || s.clickFz || s.bank15 || s.cps1h);
        showCasinoOutcome({
          won: wheelWon,
          title: s.death ? 'La Mort qui Tue' : s.life ? 'La Vie qui Vie' : s.halfBank ? 'Banqueroute' : s.clickFz ? 'Clic divin' : s.bank15 ? 'Jackpot !' : s.cps1h ? 'Heure chanceuse' : 'Mauvais présage',
          amount: gainVal > 0 ? gainVal : -lossVal,
          detail: gainVal > 0 ? 'La roue vous récompense.' : lossVal > 0 ? 'La roue vous fait perdre des cookies.' : 'Effet spécial activé.'
        });
        
        setTimeout(() => renderCasinoPane(), 3000);
      }
      casinoWheelRaf = requestAnimationFrame(frame);
    });
    
    box.querySelectorAll('.casino-tab-btn').forEach(btn => btn.addEventListener('click', (e) => {
      S.casino.tab = e.target.dataset.tab;
      renderCasinoPane();
    }));
  }
}

function spinCasino() {
  if ((!casinoUnlimited() && S.baked < 1e6) || (!casinoUnlimited() && casinoRemaining() <= 0)) return;
  if (!casinoSelectedBet) { $('#casinoResult').textContent = 'Veuillez sélectionner une couleur !'; return; }
  const stake = Math.floor(Number($('#casinoStake').value) || 0);
  const minBet = casinoUnlimited() ? 1 : 1e6;
  if (stake < minBet || stake > S.cookies) { $('#casinoResult').textContent = stake < minBet ? 'La mise minimum est de ' + fmt(minBet) + ' cookies.' : 'Solde insuffisant pour cette mise.'; return; }
  const button = $('#casinoSpin'), wheel = $('#rouletteWheel');
  button.disabled = true;
  S.cookies -= stake;
  if (!casinoUnlimited()) S.casino.bets++;
  const number = Math.floor(Math.random() * 10);
  const color = casinoColor(number);
  const won = casinoSelectedBet.type === 'color' && casinoSelectedBet.value === color;
  const payout = won ? stake * 2 : 0;
  wheel.style.setProperty('--roulette-turn', (1440 - number * (360 / 10)) + 'deg');
  wheel.classList.remove('roulette-spinning');
  void wheel.offsetWidth;
  wheel.classList.add('roulette-spinning');
  setTimeout(() => {
    if (payout) gain(payout);
    if (won) {
      if (!S.casino.combo) S.casino.combo = 0;
      S.casino.combo++;
    } else {
      S.casino.combo = 0;
    }
    // Combo multiplier: scales with combo count AND bet size
    let comboMult = 1;
    if (won && S.casino.combo > 1) {
      comboMult = 1 + (S.casino.combo - 1) * 0.1 * 2;
      gain(Math.floor(payout * (comboMult - 1)));
    }
    S.casino.lastResult = { number, color, won, payout, stake, comboMult, comboCount: S.casino.combo };
    casinoSelectedBet = null;
    save();
    renderCasinoPane();
    showCasinoOutcome({
      won,
      title: won ? 'La roulette est pour vous !' : 'La roulette vous échappe.',
      amount: won ? payout * comboMult - stake : -stake,
      resultColor: color,
      detail: 'Couleur : ' + color.toUpperCase()
    });
  }, 1400);
}

function renderPerformance() {

  const rows = $('#performanceRows');
  if (!rows) return;
  const ongoing = worlds.filter((w) => w.mode === 'speedrun').map(w => ({
    name: w.name,
    playerName: (w.state && w.state.custom && w.state.custom.name) || 'Joueur local',
    goal: w.goal,
    durationMs: w.speedrun ? (Date.now() - w.speedrun.startedAt) : 0,
    ongoing: true
  }));
  const records = [...ongoing, ...speedrunRecords].sort((a, b) => {
    const left = a.ongoing ? Infinity : a.durationMs;
    const right = b.ongoing ? Infinity : b.durationMs;
    return left - right;
  });
  rows.innerHTML = records.length
    ? records.map((r, index) => '<tr><td>#' + (index + 1) + '</td><td>' + r.name + '</td><td>' + r.playerName + '</td><td>' + fmt(r.goal) + '</td><td>' + (r.ongoing ? 'En cours' : formatDuration(r.durationMs)) + '</td></tr>').join('')
    : '<tr><td colspan="5">Aucun monde Speedrun créé.</td></tr>';
}
function openWorldModal(first) {
  creatingFirstWorld = first;
  $('#worldModalTitle').textContent = first ? 'Créez votre premier monde' : 'Créer un monde';
  $('#cancelWorld').style.display = first ? 'none' : '';
  $('#worldNameInput').value = '';
  $('#worldModeInput').value = 'classic';
  $('#worldGoalInput').value = SPEEDRUN_GOAL;
  updateWorldFields();
  $('#worldModal').classList.add('on');
  $('#worldModal').setAttribute('aria-hidden', 'false');
  setTimeout(() => $('#worldNameInput').focus(), 0);
}
function closeWorldModal() {
  if (creatingFirstWorld) return;
  $('#worldModal').classList.remove('on');
  $('#worldModal').setAttribute('aria-hidden', 'true');
}
function updateWorldFields() {
  const mode = $('#worldModeInput').value;
  $('#worldGoalRow').style.display = mode === 'speedrun' ? '' : 'none';
}
function createWorld() {
  if (worlds.length >= 5) return;
  save();
  const name = $('#worldNameInput').value.trim() || 'Monde ' + (worlds.length + 1);
  const mode = $('#worldModeInput').value;
  const goal = SPEEDRUN_GOAL;
  const world = worldRecord(name, mode, goal);
  worlds.push(world);
  activeWorldId = world.id;
  S = world.state;
  combo = 0;
  lastClick = Date.now();
  activeEvent = null;
  clickFrenzyUntil = 0;
  document.activeElement && document.activeElement.blur();
  $('#worldModal').classList.remove('on');
  $('#worldModal').setAttribute('aria-hidden', 'true');
  recalc();
  renderWorldUI();
  applyStyle();
  refreshAll();
  save();
}
function switchWorld(id) {
  if (!id || id === activeWorldId) return;
  save();
  const world = worlds.find((item) => item.id === id);
  if (!world) return;
  activeWorldId = id;
  S = Object.assign(freshState(), world.state);
  combo = 0;
  lastClick = Date.now();
  activeEvent = null;
  recalc();
  renderWorldUI();
  applyStyle();
  refreshAll();
  showTab(currentTab);
  save();
}
function deleteWorld() {
  const world = activeWorld();
  if (!world) return;
  if (!confirm('Supprimer définitivement le monde « ' + world.name + ' » ? Toute sa progression sera perdue.')) return;
  worlds = worlds.filter((item) => item.id !== world.id);
  activeWorldId = worlds[0] ? worlds[0].id : null;
  S = activeWorld() ? Object.assign(freshState(), activeWorld().state) : freshState();
  combo = 0;
  lastClick = Date.now();
  activeEvent = null;
  clickFrenzyUntil = 0;
  recalc();
  renderWorldUI();
  applyStyle();
  refreshAll();
  if (activeWorld()) save();
  else {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    openWorldModal(true);
  }
}
$('#worldMenuNew').addEventListener('click', () => openWorldModal(false));
$('#cancelWorld').addEventListener('click', closeWorldModal);
$('#createWorld').addEventListener('click', createWorld);
$('#worldModeInput').addEventListener('change', updateWorldFields);

/* =====================================================================
   CALCULS
   ===================================================================== */
const owned = (id) => S.owned[id] || 0;
const hasUp = (id) => S.ups.includes(id);
const totalOwned = () => BUILDINGS.reduce((s, b) => s + owned(b.id), 0);

/* Nombre d'améliorations achetées par famille (cursor, mouse, fzcd...) */
let upCount = {};
function recalc() {
  upCount = {};
  for (const id of S.ups) {
    const p = id.replace(/\d+$/, '');
    upCount[p] = (upCount[p] || 0) + 1;
  }
}
const countUps = (prefix) => upCount[prefix] || 0;
const multiplier = (id) => Math.pow(2, countUps(id));
const prestigeMult = () => 1 + S.chips * 0.02 * (1 + (typeof compHas === 'function' ? compHas('ascension_boost') : 0));

let activeEvent = null;
function eventBoost(id) {
  return activeEvent && activeEvent.ev.b.id === id && Date.now() < activeEvent.boostUntil ? activeEvent.boost : 1;
}
function buildingCps(b, noBoost) {
  const bBoost = (typeof compHas === 'function') ? (compHas('building_' + b.id) + compHas('all_buildings')) : 0;
  return b.cps * multiplier(b.id) * (1 + bBoost) * prestigeMult() * (noBoost ? 1 : eventBoost(b.id));
}
function baseCps() {
  let s = 0;
  for (const b of BUILDINGS) s += owned(b.id) * buildingCps(b);
  const compCps = (typeof compHas === 'function')
    ? (compHas('cps') + compHas('cps_master') + compHas('cps_brain') + compHas('cps_click_hybrid') + compHas('speed') + (compHas('double_edged') > 0 ? compHas('double_edged') : 0))
    : 0;
  return s * (1 + compCps) * (S.temple && S.temple.length ? templeProdBonus() : 1);
}
function steadyCps() { let s = 0; for (const b of BUILDINGS) s += owned(b.id) * buildingCps(b, true); return s; }
function frenzyMult() { return Date.now() < S.fz.until ? S.fz.mult : 1; }
function cps() { return baseCps() * frenzyMult(); }

/* Clics : base + 1 % de la prod par souris, multiplié par le combo */
let combo = 0, lastClick = 0, clickFrenzyUntil = 0, clickFrenzyMult = 20;
let clickTimes = [], clickBlockedUntil = 0;
let enterPowerUntil = 0, enterFrenzyUntil = 0, isEnterPressed = false, enterInterval = 0;

addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    isEnterPressed = true;
    if (Date.now() < enterPowerUntil && !enterInterval) {
      const cookieBtn = document.getElementById('cookie');
      enterInterval = setInterval(() => {
        if (!isEnterPressed || Date.now() >= enterPowerUntil) {
          clearInterval(enterInterval);
          enterInterval = 0;
          return;
        }
        // During first 30s (frenzy phase): activate x200 frenzy before each click
        const inFrenzy = Date.now() < enterFrenzyUntil;
        const prevFrenzyUntil = clickFrenzyUntil;
        const prevFrenzyMult = clickFrenzyMult;
        if (inFrenzy) {
          clickFrenzyUntil = Date.now() + 200;
          clickFrenzyMult = (typeof enterFrenzyCurrentMult !== 'undefined' ? enterFrenzyCurrentMult : 200);
        }
        const oldBlocked = clickBlockedUntil;
        clickBlockedUntil = 0;
        clickTimes = [];
        fastClickWarnings = 0;
        lastRawClick = 0;
        cookieBtn.click();
        clickBlockedUntil = oldBlocked;
        if (inFrenzy) {
          clickFrenzyUntil = prevFrenzyUntil;
          clickFrenzyMult = prevFrenzyMult;
        }
      }, 50);
    }
  }
});
addEventListener('keyup', (e) => {
  if (e.key === 'Enter') isEnterPressed = false;
});
const comboCap = () => (2 + countUps('combo')) * (1 + (typeof compHas === 'function' ? compHas('combo_power') : 0));
const comboMult = () => 1 + Math.min(comboCap() - 1, combo * 0.02 * (1 + (typeof compHas === 'function' ? compHas('combo_power') : 0)));
function clickBase() {
  const compClick = (typeof compHas === 'function')
    ? (compHas('click') + compHas('click_master') + compHas('cps_click_hybrid') - (compHas('double_edged') > 0 ? 0.5 : 0))
    : 0;
  const clickMult = Math.max(0.1, 1 + compClick);
  return (multiplier('cursor') + cps() * 0.01 * countUps('mouse')) * clickMult * (S.temple ? templeClickBonus() : 1);
}
function clickPower() {
  if (S.booMode) return 999e21;
  return clickBase() * comboMult() * (Date.now() < clickFrenzyUntil ? clickFrenzyMult : 1);
}
let lastRawClick = 0, fastClickWarnings = 0;
function allowClick() {
  const now = Date.now();
  // Admin mode: no restrictions at all
  if (window.__adminMode) return true;
  if (now < clickBlockedUntil) return false;
  
  const diff = now - lastRawClick;
  lastRawClick = now;
  
  if (diff < 10) {
    fastClickWarnings++;
    if (fastClickWarnings >= 8) {
      clickBlockedUntil = now + 5000;
      clickTimes = [];
      fastClickWarnings = 0;
      toast('🛡️', 'Autoclicker détecté', 'Vitesse anormale. Blocage de 5 s.');
      return false;
    }
    return false;
  } else if (fastClickWarnings > 0 && diff > 200) {
    fastClickWarnings--;
  }
  
  clickTimes = clickTimes.filter((time) => now - time < 1000);
  if (clickTimes.length >= 35) {
    clickBlockedUntil = now + 20000;
    clickTimes = [];
    toast('🛡️', 'Protection anti-spam', 'Trop de clics ! Blocage de 20 secondes.');
    return false;
  }
  clickTimes.push(now);
  return true;
}

/* Prix : chaque exemplaire coûte 15 % de plus que le précédent */
let buyAmount = 1;
function buyCount(b) {
  if (buyAmount > 0) return buyAmount;
  const r = 1.15, p0 = b.base * Math.pow(r, owned(b.id));
  const n = Math.floor(Math.log(S.cookies * (r - 1) / p0 + 1) / Math.log(r));
  return Math.max(1, n);
}
function price(b, n) {
  const r = 1.15;
  const disc = Math.min(0.75, (typeof compHas === 'function' ? (compHas('discount') + compHas('building_discount')) : 0));
  const baseCost = Math.ceil(b.base * Math.pow(r, owned(b.id)) * (Math.pow(r, n) - 1) / (r - 1));
  return Math.max(1, Math.round(baseCost * (1 - disc)));
}

/* Affichage des nombres */
const WORDS = ['', '', 'million', 'milliard', 'billion', 'billiard', 'trillion', 'trilliard', 'quadrillion', 'quadrilliard', 'quintillion', 'quintilliard', 'sextillion', 'sextilliard'];
const SHORT = ['', 'k', 'M', 'Md', 'Bn', 'Bd', 'Tn', 'Td', 'Qa', 'Qd', 'Qi', 'Qid', 'Sx', 'Sxd'];
function fmt(n, decimals) {
  if (!isFinite(n)) return '∞';
  if (n < 1e6) {
    if (decimals && n < 100) return n.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
    return Math.floor(n).toLocaleString('fr-FR');
  }
  const mode = S.custom.numfmt;
  const i = Math.floor(Math.log10(n) / 3);
  if (mode === 'sci' || i >= WORDS.length) return n.toExponential(2).replace('.', ',').replace('e+', 'e');
  const v = n / Math.pow(10, i * 3);
  if (mode === 'short') return v.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' ' + SHORT[i];
  return v.toLocaleString('fr-FR', { maximumFractionDigits: 3 }) + ' ' + WORDS[i] + (v >= 2 ? 's' : '');
}
function fmtCompact(n) {
  if (n < 1e4) return Math.round(n).toLocaleString('fr-FR');
  const i = Math.min(SHORT.length - 1, Math.floor(Math.log10(n) / 3));
  return (n / Math.pow(10, i * 3)).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' ' + SHORT[i];
}
function fmtTime(sec) {
  sec = Math.max(0, Math.ceil(sec));
  if (sec >= 3600) return Math.floor(sec / 3600) + ' h ' + String(Math.floor(sec % 3600 / 60)).padStart(2, '0');
  if (sec >= 60) return Math.floor(sec / 60) + ' min ' + String(sec % 60).padStart(2, '0');
  return sec + ' s';
}
function gain(n) {
  let mult = 1;
  const luck = (typeof compHas === 'function' ? compHas('luck_mult') : 0);
  if (luck > 0 && Math.random() < luck) mult *= 2;
  const actual = Math.round(n * mult);
  S.cookies += actual; S.baked += actual; S.bakedAll += actual;
}
function checkSpeedrun() {
  const world = activeWorld();
  if (!world || world.mode !== 'speedrun') return;
  if (!world.speedrun) world.speedrun = { startedAt: 0, durationMs: 0 };
  if (!world.speedrun.startedAt && S.baked > 0) world.speedrun.startedAt = Date.now();
  if (!world.speedrun.durationMs && S.cookies >= world.goal) {
    world.speedrun.durationMs = Date.now() - world.speedrun.startedAt;
    
    speedrunRecords.push({
      name: world.name,
      playerName: (S.custom && S.custom.name) || 'Joueur local',
      goal: world.goal,
      durationMs: world.speedrun.durationMs,
      ongoing: false
    });
    
    const modal = $('#modal'), mBody = $('#mBody'), mInfo = $('#mInfo');
    modal.classList.add('on');
    $('#mTitle').textContent = '🏁 PARTIE FINIE !';
    mInfo.textContent = '';
    mBody.innerHTML = '<div style="text-align:center; padding: 20px;"><h2>Objectif atteint en ' + formatDuration(world.speedrun.durationMs) + '</h2><p>Score ajouté à vos performances.</p><button id="mOk" class="big-btn" style="margin-top:20px;">Continuer</button></div>';
    mBody.querySelector('#mOk').addEventListener('click', () => modal.classList.remove('on'));
    
    worlds = worlds.filter(w => w.id !== world.id);
    activeWorldId = worlds[0] ? worlds[0].id : null;
    S = activeWorld() ? Object.assign(freshState(), activeWorld().state) : freshState();
    combo = 0; lastClick = Date.now(); activeEvent = null; clickFrenzyUntil = 0;
    
    recalc();
    renderWorldUI();
    applyStyle();
    refreshAll();
    
    if (activeWorld()) {
      save();
    } else {
      try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
      openWorldModal(true);
    }
  }
}
function renderSpeedrunProgress() {
  const box = $('#speedrunProgress'), world = activeWorld();
  if (!box) return;
  if (!world || world.mode !== 'speedrun') { box.classList.remove('on'); return; }
  box.classList.add('on');
  const goal = world.goal || SPEEDRUN_GOAL;
  const percent = Math.min(100, S.cookies / goal * 100);
  $('#speedrunCurrent').textContent = fmt(S.cookies);
  $('#speedrunPercent').textContent = Math.floor(percent) + ' %';
  $('#speedrunFill').style.width = percent + '%';
  $('#speedrunProgress').classList.toggle('complete', percent >= 100);
  $('#speedrunTime').textContent = world.speedrun && world.speedrun.startedAt
    ? 'Temps : ' + fmtTime((Date.now() - world.speedrun.startedAt) / 1000)
    : 'Chronomètre prêt · premier clic pour démarrer';
}

/* =====================================================================
   PETITS EFFETS VISUELS
   ===================================================================== */
function floatText(x, y, text) {
  const f = document.createElement('div');
  f.className = 'float';
  f.textContent = text;
  f.style.left = x + 'px';
  f.style.top = (y - 20) + 'px';
  document.body.appendChild(f);
  f.addEventListener('animationend', () => f.remove());
}
function crumbs(x, y, n) {
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'crumb';
    c.style.left = x + 'px';
    c.style.top = y + 'px';
    c.style.setProperty('--dx', rand(-60, 60) + 'px');
    c.style.setProperty('--dy', rand(20, 100) + 'px');
    document.body.appendChild(c);
    c.addEventListener('animationend', () => c.remove());
  }
}
function celebrate() {
  const r = cookieBtn.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const E = ['🍪', '✨', '🎉', '⭐', '🍪', '🎊'];
  for (let i = 0; i < 28; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.textContent = E[i % E.length];
    c.style.left = x + 'px';
    c.style.top = y + 'px';
    c.style.setProperty('--dx', rand(-260, 260) + 'px');
    c.style.setProperty('--dy', rand(-220, 260) + 'px');
    c.style.setProperty('--rot', rand(-540, 540) + 'deg');
    document.body.appendChild(c);
    c.addEventListener('animationend', () => c.remove());
  }
}
function toast(icon, small, text) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = '<span class="ti">' + icon + '</span><div><small>' + small + '</small><strong>' + text + '</strong></div>';
  const box = $('#toasts');
  box.appendChild(t);
  while (box.children.length > 4) box.firstChild.remove();
  setTimeout(() => { t.classList.add('out'); t.addEventListener('animationend', () => t.remove()); }, 3800);
}

/* =====================================================================
   CLIC SUR LE COOKIE (+ combo)
   ===================================================================== */
const cookieBtn = $('#cookie');
cookieBtn.addEventListener('focus', () => cookieBtn.blur());
cookieBtn.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || e.repeat) return;
  e.preventDefault();
  cookieBtn.click();
});
cookieBtn.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') e.preventDefault();
});
cookieBtn.addEventListener('click', (e) => {
  if (!allowClick()) return;
  const now = Date.now();
  combo++;
  lastClick = now;
  const p = clickPower();
  gain(p);
  checkSpeedrun();
  S.handmade += p;
  S.clicks++;
  S.bestClick = Math.max(S.bestClick, p);
  S.bestCombo = Math.max(S.bestCombo, comboMult());

  cookieBtn.classList.add('bump');
  setTimeout(() => cookieBtn.classList.remove('bump'), 70);
  const rect = cookieBtn.getBoundingClientRect();
  const x = e.clientX || rect.left + rect.width / 2;
  const y = e.clientY || rect.top + rect.height / 2;
  floatText(x, y, '+' + fmt(p, true));
  crumbs(x, y, 4);
  spawnRain(1);
});
addEventListener('keydown', (e) => {
  if (e.code !== 'Space' || e.repeat || modal.classList.contains('on')) return;
  const tag = document.activeElement && document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;
  e.preventDefault();
  cookieBtn.click();
});

/* =====================================================================
   BOUTIQUE
   ===================================================================== */
$('#amount').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  buyAmount = +btn.dataset.n;
  document.querySelectorAll('#amount button').forEach((b) => b.classList.toggle('on', b === btn));
  refreshStore();
});

const bldEls = {};
for (const b of BUILDINGS) {
  const el = document.createElement('button');
  el.className = 'bld';
  el.innerHTML =
    '<div class="bld-icon">' + b.icon + '</div>' +
    '<div class="bld-info"><div class="bld-name"></div>' +
    '<div class="bld-price"><span class="mini-ck"></span><span class="p"></span><span class="n"></span></div></div>' +
    '<div class="bld-owned"></div>';
  el.addEventListener('click', () => buyBuilding(b));
  tipOn(el, () => buildingTip(b));
  $('#buildings').appendChild(el);
  bldEls[b.id] = el;
}

function buyBuilding(b) {
  const buildingIndex = BUILDINGS.indexOf(b);
  const previous = buildingIndex > 0 ? BUILDINGS[buildingIndex - 1] : null;
  if (isMystery(b) || (previous && owned(previous.id) < 5)) return;
  const n = buyCount(b), cost = price(b, n);
  if (S.cookies < cost) return;
  S.cookies -= cost;
  S.owned[b.id] = owned(b.id) + n;
  refreshAll();
  refreshTip();
}
function buyUpgrade(u) {
  const finalCost = Math.floor(u.cost * Math.max(0.1, 1 - compHas('discount') - compHas('upgrade_discount')));
  if (S.cookies < finalCost || hasUp(u.id)) return;
  S.cookies -= finalCost;
  S.ups.push(u.id);
  recalc();
  hideTip();
  refreshAll();
}

function isUnlocked(b, i) {
  if (i === 0 || owned(b.id) > 0) return true;
  const previous = BUILDINGS[i - 1];
  return owned(previous.id) >= 5 && S.baked >= b.base * 0.6;
}
function isMystery(b) { return !isUnlocked(b, BUILDINGS.indexOf(b)); }

function refreshStore() {
  let shownMystery = false;
  BUILDINGS.forEach((b, i) => {
    const el = bldEls[b.id];
    const unlocked = isUnlocked(b, i);
    const visible = unlocked || !shownMystery;
    if (!unlocked && visible) shownMystery = true;
    el.style.display = visible ? '' : 'none';
    if (!visible) return;
    el.classList.toggle('mystery', !unlocked);
    const n = buyCount(b), cost = price(b, n);
    el.classList.toggle('cant', S.cookies < cost);
    el.querySelector('.bld-name').textContent = unlocked ? b.name : '???';
    el.querySelector('.p').textContent = fmt(cost);
    el.querySelector('.n').textContent = n > 1 ? '(×' + n + ')' : '';
    el.querySelector('.bld-owned').textContent = owned(b.id) || '';
  });

  const box = $('#upgrades');
  const avail = UPGRADES.filter((u) => !hasUp(u.id) && u.unlocked()).sort((a, b) => a.cost - b.cost);
  const key = avail.map((u) => u.id).join();
  if (box.dataset.key !== key) {
    box.dataset.key = key;
    box.innerHTML = avail.length ? '' : '<span class="none">Aucune amélioration disponible pour l\'instant.</span>';
    for (const u of avail) {
      const t = document.createElement('button');
      t.className = 'up';
      t.dataset.id = u.id;
      t.innerHTML = u.icon + '<span class="tier">' + u.tier + '</span>';
      t.addEventListener('click', () => buyUpgrade(u));
      tipOn(t, () => upgradeTip(u));
      box.appendChild(t);
    }
  }
  box.querySelectorAll('.up').forEach((t) => {
    const u = UPGRADES.find((x) => x.id === t.dataset.id);
    t.classList.toggle('cant', S.cookies < u.cost);
  });
}

/* =====================================================================
   VITRINE
   ===================================================================== */
function refreshShowcase() {
  const box = $('#showcase');
  const list = BUILDINGS.filter((b) => owned(b.id) > 0);
  $('#empty').style.display = list.length ? 'none' : '';
  let prev = $('#empty');
  for (const b of BUILDINGS) {
    let row = box.querySelector('[data-row="' + b.id + '"]');
    if (!owned(b.id)) { if (row) row.remove(); continue; }
    if (!row) {
      row = document.createElement('div');
      row.className = 'row';
      row.dataset.row = b.id;
      row.innerHTML = '<div class="tag"></div><div class="icons"></div>';
      tipOn(row, () => buildingTip(b));
    }
    if (prev.nextElementSibling !== row) prev.after(row); // garde l'ordre sans relancer les animations
    prev = row;
    const n = owned(b.id);
    row.querySelector('.tag').innerHTML = '<strong>' + n + '</strong>' + (n > 1 ? b.plural : b.name) +
      '<em>' + fmt(n * buildingCps(b), true) + ' /s</em>';
    const icons = row.querySelector('.icons');
    const want = Math.min(n, 48);
    while (icons.children.length < want) {
      const s = document.createElement('span');
      if (b.icon.startsWith('<')) {
        s.innerHTML = b.icon;
      } else {
        s.textContent = b.icon;
      }
      icons.appendChild(s);
    }
    while (icons.children.length > want) icons.lastChild.remove();
  }
  const n = totalOwned();
  $('#bldTotal').textContent = n + (n > 1 ? ' bâtiments' : ' bâtiment');
}

/* =====================================================================
   SUCCÈS
   ===================================================================== */
const achEls = ACHIEVEMENTS.map((a, i) => {
  const el = document.createElement('div');
  el.className = 'ach';
  el.textContent = a.icon;
  tipOn(el, () => '<h4>' + (S.ach.includes(i) ? a.icon + ' ' + a.name : '???') + '</h4><p>' + a.desc + '</p>' +
    (S.ach.includes(i) ? '<p class="q">Débloqué !</p>' : '<p class="q">Pas encore débloqué.</p>'));
  $('#achGrid').appendChild(el);
  return el;
});
function checkAchievements(silent) {
  ACHIEVEMENTS.forEach((a, i) => {
    if (!S.ach.includes(i) && a.test()) {
      S.ach.push(i);
      if (!silent) toast(a.icon, 'Succès débloqué', a.name);
    }
  });
  achEls.forEach((el, i) => el.classList.toggle('on', S.ach.includes(i)));
  $('#achCount').textContent = S.ach.length + ' / ' + ACHIEVEMENTS.length;
}

/* =====================================================================
   INFOBULLES
   ===================================================================== */
const tip = $('#tip');
let tipTarget = null, tipBuilder = null;
function tipOn(el, builder) {
  el.addEventListener('mouseenter', () => { tipTarget = el; tipBuilder = builder; tip.innerHTML = builder(); tip.style.display = 'block'; placeTip(); });
  el.addEventListener('mouseleave', hideTip);
}
function refreshTip() { if (tipTarget && tipBuilder) { if (!tipTarget.isConnected) return hideTip(); tip.innerHTML = tipBuilder(); placeTip(); } }
function hideTip() { tipTarget = null; tip.style.display = 'none'; }
function placeTip() {
  if (!tipTarget) return;
  const r = tipTarget.getBoundingClientRect();
  const w = tip.offsetWidth, h = tip.offsetHeight;
  let x = r.left - w - 12;
  if (x < 8) x = Math.min(r.right + 12, innerWidth - w - 8);
  const y = Math.max(8, Math.min(r.top, innerHeight - h - 8));
  tip.style.left = x + 'px';
  tip.style.top = y + 'px';
}
const priceTag = (n) => '<span><i class="mini-ck"></i>' + fmt(n) + '</span>';
function buildingTip(b) {
  const n = buyCount(b);
  if (isMystery(b)) return '<h4>???' + priceTag(price(b, n)) + '</h4><p>Continuez à cuire des cookies pour découvrir ce bâtiment.</p>';
  const each = buildingCps(b), own = owned(b.id), total = each * own, all = baseCps();
  let html = '<h4>' + b.icon + ' ' + b.name + (n > 1 ? ' ×' + n : '') + priceTag(price(b, n)) + '</h4><p>' + b.desc + '</p>';
  html += '<p class="q">Chaque exemplaire produit ' + fmt(each, true) + ' cookie' + (each >= 2 ? 's' : '') + ' par seconde.</p>';
  if (own > 0) html += '<p class="q">' + own + ' produisent ' + fmt(total, true) + ' cookies/s (' + (all ? Math.round(total / all * 100) : 0) + ' % du total).</p>';
  const next = EVENTS.find((e) => e.b === b && own < e.need);
  if (next) html += '<p class="q">🎉 Événement débloqué à ' + next.need + ' exemplaires.</p>';
  return html;
}
function upgradeTip(u) {
  return '<h4>' + u.icon + ' ' + u.name + priceTag(u.cost) + '</h4><p>' + u.desc + '</p>';
}

/* =====================================================================
   FRÉNÉSIE : arrive toute seule quand la barre est pleine
   ===================================================================== */
const FRENZY_LEVELS = [10, 15, 20, 50];
const fzCooldown = () => 300 * Math.pow(0.92, countUps('fzcd'));
function rollFrenzyPower() {
  const upgrades = countUps('fzpow');
  const progression = Math.min(3, Math.floor(Math.log10(Math.max(1, S.baked)) / 3));
  const highestLevel = Math.min(3, Math.max(2, progression + upgrades));
  const available = FRENZY_LEVELS.slice(0, highestLevel + 1);
  const weights = available.map((value, index) => 28 + index * (progression * 5 + upgrades * 4));
  const total = weights.reduce((sum, value) => sum + value, 0);
  let pick = Math.random() * total;
  for (let i = 0; i < available.length; i++) {
    pick -= weights[i];
    if (pick <= 0) return available[i];
  }
  return available[0];
}
function startFrenzy() {
  const now = Date.now();
  const mult = rollFrenzyPower();
  const frenzyBonus = (typeof compHas === 'function' ? (compHas('golden_vision') + compHas('frenzy_dur')) : 0);
  const dur = rand(3, 25) * (1 + 0.25 * countUps('fzdur')) * (1 + frenzyBonus);
  S.fz.mult = mult;
  S.fz.dur = dur;
  S.fz.until = now + dur * 1000;
  S.fz.start = S.fz.until;
  S.fz.next = S.fz.until + fzCooldown() * 1000;
  S.frenzies++;
  toast('⚡', 'Frénésie !', 'Production ×' + mult + ' pendant ' + Math.round(dur) + ' s');
}
function updateFrenzy(now) {
  if (now >= S.fz.next && now >= S.fz.until) startFrenzy();
}

/* =====================================================================
   COOKIE DORÉ
   ===================================================================== */
const golden = $('#golden');
const goldenDelay = () => {
  const freqBonus = (typeof compHas === 'function' ? compHas('golden_freq') : 0);
  return rand(300, 900) * Math.pow(0.8, countUps('gold')) * (S.temple && S.temple.includes('gold_luck') ? 0.5 : 1) / (1 + freqBonus) * 1000;
};
let goldenNext = Date.now() + rand(30, 90) * 1000, goldenEnd = 0;
let activeGoldenCookies = [];

function clearGoldenRain() {
  activeGoldenCookies.forEach(c => c.remove());
  activeGoldenCookies = [];
  golden.style.display = 'none'; // Fallback legacy
}

function updateGolden(now) {
  if (now > goldenEnd && activeGoldenCookies.length > 0) {
    clearGoldenRain();
  }
  if (activeGoldenCookies.length === 0 && now > goldenNext) {
    if (current) {
      goldenNext = now + 5000;
      return;
    }
    goldenEnd = now + 1500;
    goldenNext = now + goldenDelay();
    spawnGoldenRain();
  }
}

function spawnGoldenRain() {
  const spawn = (type) => {
    const el = document.createElement('button');
    el.className = 'golden-cookie-rain';
    el.style.position = 'fixed';
    el.style.zIndex = '999999';
    let left, top;
    const cRect = document.getElementById('cookie').getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    for (let attempts = 0; attempts < 50; attempts++) {
      left = rand(5, 85);
      top = rand(10, 75);
      const pxLeft = (left * vw) / 100;
      const pxTop = (top * vh) / 100;
      // If outside the cookie's rect (with 30px margin), we're good.
      if (pxLeft + 40 < cRect.left - 30 || pxLeft > cRect.right + 30 || pxTop + 40 < cRect.top - 30 || pxTop > cRect.bottom + 30) {
        break;
      }
    }
    el.style.left = left + 'vw';
    el.style.top = top + 'vh';
    el.style.background = 'none';
    el.style.border = 'none';
    el.style.cursor = 'pointer';
    el.style.fontSize = '40px';
    el.style.animation = 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    
    if (type === 'gold') {
      el.innerHTML = '<div class="golden-rays"></div><div class="golden-cookie-img" style="font-size:20px;">🍪</div>';
      el.style.filter = 'drop-shadow(0 0 10px gold)';
      // RGB animation
      el.style.animation = 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), rgbHues 2s linear infinite';
      if(!document.getElementById('rgbHuesDef')) {
         const style = document.createElement('style');
         style.id = 'rgbHuesDef';
         style.innerHTML = '@keyframes rgbHues { 0% { filter: drop-shadow(0 0 15px red) hue-rotate(0deg); } 33% { filter: drop-shadow(0 0 15px lime) hue-rotate(120deg); } 66% { filter: drop-shadow(0 0 15px blue) hue-rotate(240deg); } 100% { filter: drop-shadow(0 0 15px red) hue-rotate(360deg); } }';
         document.head.appendChild(style);
      }
    } else if (type === 'silver') {
      el.innerHTML = '🍪';
      el.style.filter = 'grayscale(100%) brightness(1.5) drop-shadow(0 0 10px silver)';
    } else if (type === 'bronze') {
      el.innerHTML = '🍪';
      el.style.filter = 'sepia(100%) hue-rotate(330deg) saturate(300%) drop-shadow(0 0 10px #cd7f32)';
    } else if (type === 'black') {
      el.innerHTML = '☠️';
      el.style.filter = 'drop-shadow(0 0 15px black)';
    }
    
    el.addEventListener('click', (e) => {
      clearGoldenRain();
      S.golden++;
      checkAchievements();
      
      if (type === 'gold') {
        const goldRewardBonus = (typeof compHas === 'function' ? compHas('golden_reward') : 0);
        const bonus = Math.floor(S.cookies * 0.25 * (1 + goldRewardBonus));
        gain(bonus);
        floatText(e.clientX, e.clientY, '+' + fmt(bonus));
        toast('🌟', 'Cookie d\'Or', 'Jackpot ! +' + Math.round(25 * (1 + goldRewardBonus)) + '% de vos cookies en banque !');
      } else if (type === 'silver') {
        S.cookies = Math.floor(S.cookies / 2);
        toast('🥈', 'Cookie d\'argent', 'Aïe ! Vous perdez la moitié de vos cookies.');
      } else if (type === 'bronze') {
        S.cookies = 0;
        toast('🥉', 'Cookie de bronze', 'CATASTROPHE ! Vous avez perdu tous vos cookies.');
      } else if (type === 'black') {
        const ownedBlds = BUILDINGS.filter(b => S.owned[b.id] > 0);
        if(ownedBlds.length > 0) {
           const best = ownedBlds[ownedBlds.length - 1];
           S.owned[best.id] = 0;
           recalc();
           toast('☠️', 'Cookie Noir', 'DÉVASTATION ! Vous avez perdu tous vos ' + best.name + ' !');
        } else {
           toast('☠️', 'Cookie Noir', 'Rien à détruire...');
        }
      }
    });
    
    document.body.appendChild(el);
    activeGoldenCookies.push(el);
  };
  
  spawn('gold');
  spawn('black');
  for(let i=0; i<8; i++) spawn('silver');
  for(let i=0; i<15; i++) spawn('bronze');
}

/* =====================================================================
   ÉVÉNEMENTS DE BÂTIMENTS
   ===================================================================== */
const banner = $('#evBanner');
const evInterval = () => rand(150, 330) * Math.pow(0.8, countUps('evfreq')) * 1000;
const unlockedEvents = () => EVENTS.filter((e) => owned(e.b.id) >= e.need);
function evPerIcon(ev) {
  const bTotal = owned(ev.b.id) * buildingCps(ev.b, true);
  const evCompBonus = (typeof compHas === 'function' ? compHas('events') : 0);
  return Math.max(bTotal * EV_B_SEC[ev.tier], steadyCps() * EV_ALL_SEC[ev.tier], 10) * Math.pow(1.5, countUps('evgain')) * (1 + evCompBonus);
}
function updateEvents(now) {
  if (activeEvent) {
    if (now > activeEvent.until) endEvent(); else updateBanner(now);
    return;
  }
  if (now < S.evNext) return;
  S.evNext = now + evInterval();
  const pool = unlockedEvents();
  if (!pool.length) return;
  // les événements les plus grands sont un peu plus probables
  let r = Math.random() * pool.reduce((s, e) => s + e.tier + 1, 0), ev = pool[0];
  for (const e of pool) { r -= e.tier + 1; if (r <= 0) { ev = e; break; } }
  startEvent(ev);
}
function startEvent(ev) {
  const now = Date.now(), count = EV_COUNT[ev.tier], spread = 1300;
  activeEvent = {
    ev, count, caught: 0, total: 0, boost: EV_BOOST[ev.tier],
    boostUntil: now + count * spread + 2000,
    until: now + count * spread + 12500,
    timers: [], items: [],
  };
  for (let i = 0; i < count; i++) activeEvent.timers.push(setTimeout(() => spawnWalker(ev), i * spread + rand(0, 500)));
  toast(ev.b.icon, 'Événement !', ev.name);
  banner.classList.add('on');
  updateBanner(now);
}
function spawnWalker(ev) {
  if (!activeEvent || activeEvent.ev !== ev) return;
  const el = document.createElement('button');
  el.className = 'walker';
  el.innerHTML = '<span>' + ev.b.icon + '</span>';
  el.style.top = rand(12, 80) + 'vh';
  el.style.animation = (Math.random() < 0.5 ? 'walkR ' : 'walkL ') + rand(8, 11).toFixed(1) + 's linear forwards';
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (!activeEvent || activeEvent.ev !== ev) return;
    const v = evPerIcon(ev);
    gain(v);
    activeEvent.caught++;
    activeEvent.total += v;
    floatText(e.clientX, e.clientY, '+' + fmt(v));
    crumbs(e.clientX, e.clientY, 6);
    el.remove();
  });
  el.addEventListener('animationend', () => el.remove());
  document.body.appendChild(el);
  activeEvent.items.push(el);
}
function updateBanner(now) {
  const a = activeEvent, left = Math.max(0, (a.until - now) / 1000);
  banner.innerHTML = a.ev.b.icon + ' <b>' + a.ev.name + '</b> · cliquez sur les ' + a.ev.b.plural.toLowerCase() + ' ! ' +
    '<small>' + a.caught + ' / ' + a.count + ' attrapés · +' + fmt(a.total) + ' cookies · production des ' + a.ev.b.plural.toLowerCase() +
    ' ×' + a.boost + ' · ' + fmtTime(left) + '</small>';
}
function endEvent() {
  const a = activeEvent;
  activeEvent = null;
  a.timers.forEach(clearTimeout);
  a.items.forEach((el) => el.remove());
  const rec = S.evSeen[a.ev.id] || { n: 0, best: 0 };
  rec.n++;
  rec.best = Math.max(rec.best, a.total);
  S.evSeen[a.ev.id] = rec;
  S.evTotal++;
  banner.classList.remove('on');
  toast(a.ev.b.icon, 'Événement terminé', a.caught + '/' + a.count + ' attrapés · +' + fmt(a.total) + ' cookies');
  checkAchievements();
}
function renderEventsPane() {
  const unlocked = unlockedEvents().length;
  let html = '<div class="pane-intro"><h3>Événements de bâtiments</h3>' +
    '<p>De temps en temps, un de vos bâtiments organise un événement : ils traversent l\'écran pendant quelques secondes. ' +
    'Cliquez dessus pour gagner plein de cookies ! Pendant l\'événement, ce bâtiment produit aussi beaucoup plus. ' +
    'Plus vous possédez d\'exemplaires d\'un bâtiment, plus ses événements sont grandioses.</p>' +
    '<div class="pills"><span>🎉 ' + S.evTotal + ' événement' + (S.evTotal > 1 ? 's' : '') + ' vécu' + (S.evTotal > 1 ? 's' : '') + '</span>' +
    '<span>🔓 ' + unlocked + ' / ' + EVENTS.length + ' débloqués</span>' +
    (activeEvent ? '<span>🔴 En cours : ' + activeEvent.ev.name + '</span>' : '') + '</div></div><div class="ev-grid">';
  for (const b of BUILDINGS) {
    const own = owned(b.id), known = own > 0;
    html += '<div class="ev-card' + (known ? '' : ' locked') + '"><div class="ev-head"><span class="ev-icon">' + (known ? b.icon : '❔') + '</span>' +
      '<div><strong>' + (known ? b.name : '???') + '</strong><small>' + own + ' possédé' + (own > 1 ? 's' : '') + '</small></div></div>';
    for (const e of EVENTS) {
      if (e.b !== b) continue;
      const ok = own >= e.need, seen = S.evSeen[e.id];
      const info = ok
        ? (seen ? 'Vécu ' + seen.n + ' fois · record +' + fmt(seen.best) : 'Débloqué · pas encore vécu')
        : '🔒 À ' + e.need + ' ' + (known ? b.plural.toLowerCase() : 'exemplaires');
      html += '<div class="ev-line' + (ok ? ' on' : '') + '"><span class="lvl">' + '★'.repeat(e.tier + 1) + '</span>' +
        '<div><b>' + (known ? e.name : '???') + '</b><small>' + info + '</small></div></div>';
    }
    html += '</div>';
  }
  html += '</div>';
  const box = $('#events');
  if (box.dataset.html !== html) { box.dataset.html = html; box.innerHTML = html; }
}

/* =====================================================================
   MINI-JEUX
   ===================================================================== */
const GAMES = [
  { id: 'reaction', req: 0,          icon: '🧭', name: 'Évasion du labyrinthe', cd: 12, start: gameReaction, desc: 'Trouvez la sortie avant la fin du temps. Le parcours change à chaque partie.', weight: 1 },
  { id: 'simon',    req: 500,        icon: '🔲', name: 'Simon Cookie',      cd: 10, start: gameSimon,    desc: 'Répétez la séquence de cookies dans le bon ordre.', weight: 1.2 },
  { id: 'find',     req: 50000,      icon: '🕵️', name: 'Le Cookie Doré',    cd: 15, start: gameFind,     desc: 'Trouvez le cookie doré caché parmi les autres.', weight: 1.5 },
  { id: 'rush',     req: 250000,     icon: '⚡', name: 'Rush de clics',     cd: 12, start: gameRush,     desc: 'Cliquez le plus vite possible pendant huit secondes.', weight: 1 },
  { id: 'oven',     req: 5000000,    icon: '🔥', name: 'Sortie du four',    cd: 12, start: gameOven,     desc: 'Sortez 5 fournées pile au bon moment. Ni cru, ni brûlé !', weight: 1 },
  { id: 'shop',     req: 25000000,   icon: '🛒', name: 'Vente de cookies',  cd: 15, start: gameShop,     desc: 'Servez un maximum de clients en 30 secondes.', weight: 1.5 },
  { id: 'catch',    req: 100000000,  icon: '🧺', name: 'Attrape-cookies',   cd: 12, start: gameCatch,    desc: 'Attrapez les cookies qui tombent, évitez les brocolis.', weight: 1.5 },
  { id: 'memory',   req: 500000000,  icon: '🃏', name: 'Memory gourmand',   cd: 15, start: gameMemory,   desc: 'Retrouvez les 8 paires de pâtisseries en 60 secondes.', weight: 2 },
  { id: 'sort',     req: 750000000,  icon: '🛍️', name: 'Le Tri Gourmand',   cd: 14, start: gameSort,     desc: 'Triez rapidement les ingrédients dans le bon sac.', weight: 1.5 },
  { id: 'cook',     req: 950000000,  icon: '👨‍🍳',name: 'Le Chef',           cd: 18, start: gameCook,     desc: 'Pétrissez, cuisez et décorez votre cookie à la perfection.', weight: 2 },
  
];
const CELESTIAL_GAMES = [
  { id: 'celestial_bowling', icon: '🎳', name: 'Bowling Céleste', cd: 240, start: gameCelestialBowling, desc: 'Faites tomber les quilles avec un lancer parfaitement droit.', weight: 20 },
  { id: 'celestial_basketball', icon: '🏀', name: 'Panier Céleste', cd: 240, start: gameCelestialBasketball, desc: 'Marquez un panier en mouvement. 3 essais.', weight: 20 },
  { id: 'celestial_football',  icon: '⚽', name: 'Tir au But', cd: 240, start: gameCelestialFootball, desc: 'Trompez le gardien et marquez le penalty. 3 essais.', weight: 20 }
];
const celestialCooldown = (g) => { 
  let mult = 1; 
  if (S.ups.includes('celestial_cd1')) mult -= 0.25; 
  if (S.ups.includes('celestial_cd2')) mult -= 0.25; 
  if (S.ups.includes('celestial_cd3')) mult -= 0.25; 
  if (S.temple && S.temple.includes('chrono')) mult *= 0.5;
  const arcadeSpeedBonus = (typeof compHas === 'function' ? compHas('arcade_speed') : 0);
  return Math.max(60000, g.cd * 60 * mult / (1 + arcadeSpeedBonus) * 1000); 
};
const gameCooldown = (g) => {
  const arcadeSpeedBonus = (typeof compHas === 'function' ? compHas('arcade_speed') : 0);
  return g.cd * 60 * Math.pow(0.8, countUps('arcade')) / (1 + arcadeSpeedBonus) * 1000;
};
const gameReady = (g) => window.__adminMode || Date.now() >= (S.games[g.id] || 0);
/* Gain maximum = 5 minutes de production (avec un minimum en début de partie) */
const gameMax = () => Math.max(steadyCps() * 300, multiplier('cursor') * 200 + 100) * Math.pow(1.4, countUps('ticket'));
const dailyReward = () => Math.max(steadyCps() * 600, 500);

const modal = $('#modal'), mBody = $('#mBody'), mInfo = $('#mInfo');
let current = null;

function buildPlayPane() {
  const grid = $('#playGrid');
  const gift = document.createElement('div');
  gift.className = 'game-card gift';
  gift.innerHTML = '<div class="gi">🎁</div><h4>Cadeau du jour</h4><p>Un cadeau gratuit à récupérer une fois par jour : 10 minutes de production !</p>' +
    '<div class="meta" data-meta="daily"></div><button class="play-btn" data-play="daily">Ouvrir</button>';
  grid.appendChild(gift);
  const ALL_GAMES = [...GAMES, ...CELESTIAL_GAMES];
  for (const g of ALL_GAMES) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = '<div class="gi">' + g.icon + '</div><h4>' + g.name + '</h4><p>' + g.desc + '</p>' +
      '<div class="meta" data-meta="' + g.id + '"></div><button class="play-btn" data-play="' + g.id + '">Jouer</button>';
    grid.appendChild(card);
  }
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-play]');
    if (!b || b.disabled) return;
    if (b.dataset.play === 'daily') claimDaily();
    else openGame([...GAMES, ...CELESTIAL_GAMES].find((g) => g.id === b.dataset.play));
  });
}
function updatePlayPane() {
  const now = Date.now();
  const dBtn = document.querySelector('[data-play="daily"]');
  dBtn.disabled = !window.__adminMode && now < S.daily;
  dBtn.textContent = window.__adminMode || now >= S.daily ? 'Ouvrir le cadeau' : 'Revenez dans ' + fmtTime((S.daily - now) / 1000);
  document.querySelector('[data-meta="daily"]').innerHTML = 'Contient : <b>' + fmt(dailyReward()) + '</b> cookies';
  const ALL_GAMES = [...GAMES, ...CELESTIAL_GAMES];
  for (const g of ALL_GAMES) {
    const btn = document.querySelector('[data-play="' + g.id + '"]');
    const isCelestial = g.id.startsWith('celestial');
    const hasBought = isCelestial ? (S.temple && S.temple.includes(g.id)) || window.__adminMode : true;
    const card = btn ? btn.closest('.game-card') : null;
    if (isCelestial && card) {
      card.style.display = hasBought ? 'block' : 'none';
      if (!hasBought) continue;
    }
    const unlocked = !g.req || S.baked >= g.req;
    if (!unlocked) {
      btn.disabled = true;
      btn.textContent = 'Verrouillé';
      document.querySelector('[data-meta="' + g.id + '"]').innerHTML = 'Débloqué à <b>' + fmt(g.req) + '</b> cookies cuits.';
      continue;
    }
    const ready = gameReady(g);
    btn.disabled = !ready;
    btn.textContent = ready ? 'Jouer' : 'Recharge · ' + fmtTime((S.games[g.id] - now) / 1000);
    const best = S.gameBest[g.id];
    document.querySelector('[data-meta="' + g.id + '"]').innerHTML = 'Gain max : <b>' + fmt(gameMax() * (g.weight || 1) * (g.over ? 1.5 : 1)) + '</b>' +
      (best !== undefined ? ' · record ' + Math.round(best * 100) + ' %' : '');
  }
  const grid = document.getElementById('playGrid');
  if (grid) {
    const cards = Array.from(grid.children);
    cards.sort((a, b) => {
      const playBtnA = a.querySelector('.play-btn');
      const playBtnB = b.querySelector('.play-btn');
      if (!playBtnA || !playBtnB) return 0;
      
      const getCd = (btn) => {
        const id = btn.dataset.play;
        if (id === 'daily') return Math.max(0, S.daily - now);
        const g = GAMES.find(x => x.id === id);
        if (g && (!g.req || S.baked >= g.req)) return Math.max(0, (S.games[id] || 0) - now);
        return Infinity;
      };
      
      // Secondary sort: keep original order if cooldown is the same (e.g. 0)
      const cdA = getCd(playBtnA);
      const cdB = getCd(playBtnB);
      if (cdA === cdB) {
        // Special case: daily gift always first if ready
        if (playBtnA.dataset.play === 'daily') return -1;
        if (playBtnB.dataset.play === 'daily') return 1;
        return 0;
      }
      return cdA - cdB;
    });
    cards.forEach(c => grid.appendChild(c));
  }
}
function claimDaily() {
  if (!window.__adminMode && Date.now() < S.daily) return;
  const r = dailyReward();
  gain(r);
  S.daily = Date.now() + 20 * 3600 * 1000;
  S.dailyCount++;
  toast('🎁', 'Cadeau du jour', '+' + fmt(r) + ' cookies');
  celebrate();
  updatePlayPane();
  checkAchievements();
}

function openGame(g) {
  if (!g || (g.unlock && !g.unlock()) || !gameReady(g) || current) return;
  S.games[g.id] = Date.now() + (g.id.startsWith('celestial') ? celestialCooldown(g) : gameCooldown(g));
  save();
  hideTip();
  modal.classList.add('on');
  $('#mTitle').textContent = g.icon + ' ' + g.name;
  mInfo.textContent = '';
  mBody.innerHTML = '';
  const state = { g, ended: false, cleanup: null };
  state.api = {
    body: mBody,
    frac: 0,
    info: (t) => { mInfo.textContent = t; },
    end: (frac, detail) => finishGame(state, frac, detail),
  };
  current = state;
  state.cleanup = g.start(state.api, g);
}
function finishGame(state, frac, detail) {
  if (state.ended) return;
  state.ended = true;
  if (state.cleanup) state.cleanup();
  const g = state.g;
  frac = Math.max(0, Math.min(g.over ? 1.5 : 1, frac || 0));
  const reward = Math.round(gameMax() * frac * (g.weight || 1) * (1 + compHas('minigame_god')));
  gain(reward);
  S.gamesPlayed++;
  S.gameBest[g.id] = Math.max(S.gameBest[g.id] || 0, frac);
  if (frac >= 1) S.perfect++;
  const t = frac >= 1 ? ['🏆', 'Parfait !'] : frac >= 0.6 ? ['🎉', 'Bien joué !'] : frac >= 0.25 ? ['👍', 'Pas mal !'] : ['🍪', 'Ce sera mieux la prochaine fois'];
  mInfo.textContent = '';
  mBody.innerHTML = '<div class="result"><div class="result-emoji">' + t[0] + '</div><h3>' + t[1] + '</h3><p>' + (detail || '') + '</p>' +
    '<div class="reward">+' + fmt(reward) + ' cookies</div><p class="small">Score : ' + Math.round(frac * 100) + ' % du gain maximum</p>' +
    '<button class="big-btn" id="mOk">Super !</button></div>';
  mBody.querySelector('#mOk').addEventListener('click', closeModal);
  if (frac >= 1) celebrate();
  recalc();
  checkAchievements();
  updatePlayPane();
  save();
}
function closeModal() {
  if (current && !current.ended) { finishGame(current, current.api.frac, 'Partie interrompue.'); return; }
  modal.classList.remove('on');
  mBody.innerHTML = '';
  current = null;
}
$('#mClose').addEventListener('click', closeModal);
addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (modal.classList.contains('on')) closeModal();
  if (sideMenu.classList.contains('on')) setMenu(false);
});

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* --- 1. Évasion du labyrinthe --- */
function gameReaction(api) {
  const width = 15, height = 9;
  const maze = Array.from({ length: height }, () => Array(width).fill('#'));
  const dirs = [[2, 0], [-2, 0], [0, 2], [0, -2]];
  const stack = [[1, 1]];
  maze[1][1] = ' ';
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const options = dirs.filter(([dx, dy]) => {
      const nx = x + dx, ny = y + dy;
      return nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && maze[ny][nx] === '#';
    });
    if (!options.length) { stack.pop(); continue; }
    const [dx, dy] = options[Math.floor(Math.random() * options.length)];
    maze[y + dy / 2][x + dx / 2] = ' ';
    maze[y + dy][x + dx] = ' ';
    stack.push([x + dx, y + dy]);
  }
  maze[1][1] = 'S';
  maze[height - 2][width - 2] = 'E';
  const shifters = [];
  for(let y=1; y<height-1; y++) {
    for(let x=1; x<width-1; x++) {
      if (maze[y][x] === ' ' && !(x===1 && y===1) && !(x===width-2 && y===height-2) && Math.random() < 0.15) {
        shifters.push({x, y, solid: false});
      }
    }
  }
  
  
  api.body.innerHTML = '<p class="game-hint">Échappez-vous en moins de 18 secondes. Utilisez les flèches, ZQSD ou les boutons tactiles.</p>' +
    '<div class="maze-arena"><div class="maze-grid"></div><div class="maze-controls"><button data-dir="up">▲</button><div><button data-dir="left">◀</button><button data-dir="down">▼</button><button data-dir="right">▶</button></div></div></div>';
  const grid = api.body.querySelector('.maze-grid');
  const duration = 18, player = { x: 1, y: 1 };
  let timeLeft = duration, timer = 0, alive = true;
  const render = () => {
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = 'repeat(' + width + ', 1fr)';
    maze.forEach((row, y) => row.forEach((cell, x) => {
      const tile = document.createElement('span');
      tile.className = 'maze-cell ' + (cell === '#' ? 'wall' : cell === 'E' ? 'exit' : 'path');
      if (player.x === x && player.y === y) tile.className += ' player';
      tile.textContent = player.x === x && player.y === y ? '🍪' : cell === 'E' ? '🚪' : '';
      grid.appendChild(tile);
    }));
  };
  const move = (direction) => {
    if (!alive) return;
    const deltas = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    const [dx, dy] = deltas[direction];
    const nx = player.x + dx, ny = player.y + dy;
    if (nx < 0 || nx >= width || ny < 0 || ny >= height || !maze[ny] || maze[ny][nx] === '#') return;
    
    player.x = nx; player.y = ny;
    render();
    api.frac = Math.max(0, timeLeft / duration);
    if (maze[ny][nx] === 'E') api.end(Math.max(.15, timeLeft / duration), 'Sortie trouvée avec ' + timeLeft.toFixed(1) + ' s restantes');
  };
  const key = (e) => {
    const keys = { ArrowUp: 'up', z: 'up', q: 'left', ArrowLeft: 'left', s: 'down', ArrowDown: 'down', d: 'right', ArrowRight: 'right' };
    const direction = keys[e.key];
    if (direction) { e.preventDefault(); move(direction); }
  };
  addEventListener('keydown', key);
  api.body.querySelectorAll('[data-dir]').forEach((button) => button.addEventListener('pointerdown', () => move(button.dataset.dir)));
  render();
  api.info('18,0 s');
  let shiftTimer = 0;
  timer = setInterval(() => {
    timeLeft = Math.max(0, timeLeft - .1);
    shiftTimer += 0.1;
    if (shiftTimer >= 2) {
      shiftTimer = 0;
      shifters.forEach(s => {
        s.solid = !s.solid;
        maze[s.y][s.x] = s.solid ? '#' : ' ';
        if (s.solid && player.x === s.x && player.y === s.y) {
          timeLeft = Math.max(0, timeLeft - 3);
          player.x = 1; player.y = 1;
          api.info('Écrasé par un mur ! -3s');
        }
      });
      render();
    }
    api.info(timeLeft.toFixed(1).replace('.', ',') + ' s');
    if (timeLeft <= 0) api.end(0, 'Le temps est écoulé.');
  }, 100);
  return () => { alive = false; clearInterval(timer); removeEventListener('keydown', key); };
}

function gameSimon(api) {
  let seq = [], step = 0, state = 'watch', alive = true;
  api.body.innerHTML = '<p class="game-hint">Répétez la séquence lumineuse.</p><div class="simon-board" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;width:150px;margin:0 auto;">' +
    ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'].map((c, i) => '<button data-simon="'+i+'" style="width:70px;height:70px;background:'+c+';border:none;border-radius:10px;opacity:0.5;transition:0.2s;"></button>').join('') + '</div>';
  const btns = api.body.querySelectorAll('[data-simon]');
  const playSeq = () => {
    state = 'watch'; step = 0; api.info('Observez...');
    seq.push(Math.floor(Math.random() * 4));
    let i = 0;
    const interval = setInterval(() => {
      if (!alive) return clearInterval(interval);
      if (i >= seq.length) { clearInterval(interval); state = 'play'; api.info('À vous de jouer ! (' + seq.length + ' étapes)'); return; }
      const b = btns[seq[i]];
      b.style.opacity = '1'; b.style.transform = 'scale(1.1)';
      setTimeout(() => { if(alive) { b.style.opacity = '0.5'; b.style.transform = 'none'; } }, 200);
      i++;
    }, 450);
  };
  btns.forEach((b, i) => b.addEventListener('mousedown', () => {
    if (state !== 'play' || !alive) return;
    b.style.opacity = '1'; setTimeout(() => b.style.opacity = '0.5', 200);
    if (seq[step] === i) {
      step++;
      api.frac = Math.min(1, seq.length / 5);
      if (step === seq.length) {
        if (seq.length >= 5) return api.end(1, 'Séquence parfaite (5 étapes)');
        setTimeout(playSeq, 600);
      }
    } else {
      api.end(Math.min(1, (seq.length-1)/8), 'Erreur après ' + (seq.length-1) + ' étapes');
    }
  }));
  setTimeout(playSeq, 500);
  return () => { alive = false; };
}



function gameFind(api) {
  let time = 7, timer = 0, alive = true;
  const count = 40;
  let html = '<p class="game-hint">Trouvez l\'unique cookie doré avant la fin du temps.</p><div style="position:relative;width:100%;height:200px;background:#2c1b18;border-radius:10px;overflow:hidden;">';
  const goldenIdx = Math.floor(Math.random() * count);
  for (let i=0; i<count; i++) {
    const isG = i === goldenIdx;
    const x = Math.random() * 90, y = Math.random() * 85;
    html += '<button data-find="'+(isG?1:0)+'" style="position:absolute;left:'+x+'%;top:'+y+'%;font-size:24px;background:none;border:none;cursor:pointer;filter:'+(isG?'hue-rotate(40deg) brightness(1.5)':'none')+'">🍪</button>';
  }
  html += '</div>';
  api.body.innerHTML = html;
  api.body.querySelectorAll('[data-find]').forEach(b => b.addEventListener('click', () => {
    if (!alive) return;
    if (b.dataset.find === "1") {
      b.style.transform = 'scale(2)';
      api.frac = 1;
      api.end(1, 'Cookie doré trouvé en ' + (10 - time) + 's !');
    } else {
      b.style.opacity = '0.2';
    }
  }));
  timer = setInterval(() => { time--; api.info('Cherchez... ' + time + ' s'); if (time <= 0) api.end(0, 'Temps écoulé, introuvable'); }, 1000);
  api.info('Cherchez... 10 s');
  return () => { alive = false; clearInterval(timer); };
}

function gameRush(api) {
  const goal = 80;
  let score = 0, time = 8, timer = 0, alive = true;
  api.body.innerHTML = '<p class="game-hint">Touchez le cookie aussi vite que possible. Objectif : ' + goal + ' clics en huit secondes.</p><div class="rush"><button class="rush-cookie">🍪</button><strong class="rush-score">0</strong></div>';
  const button = api.body.querySelector('.rush-cookie'), counter = api.body.querySelector('.rush-score');
  button.addEventListener('pointerdown', (e) => { e.preventDefault(); if (!alive) return; score++; counter.textContent = score; api.frac = Math.min(1, score / goal); if(score >= goal) api.end(1, score + ' clics réalisés'); if(score >= goal) api.end(1, score + ' clics réalisés'); });
  timer = setInterval(() => { time--; api.info(score + ' clics · ' + time + ' s'); if (time <= 0) api.end(Math.min(1, score / goal), score + ' clics réalisés'); }, 1000);
  api.info('0 clic · 8 s');
  return () => { alive = false; clearInterval(timer); };
}

function gameRecipe(api) {
  const pool = ['🌾', '🥚', '🧈', '🍬', '🍫', '🍓', '🥜', '🍋', '🥛', '🫐', '🍒', '🍯', '🧂', '☕', '🍌'];
  const shuffledPool = shuffle(pool.slice());
  const recipe = shuffledPool.slice(0, 5);
  const options = shuffle(shuffledPool.slice(0, 8));
  let position = 0, time = 15, timer = 0, alive = true;
  api.body.innerHTML = '<p class="game-hint">Mémorisez la recette, puis retrouvez les ingrédients dans le même ordre.</p><div class="recipe"><div class="recipe-preview">' + recipe.join(' ') + '</div><div class="recipe-options"></div></div>';
  const box = api.body.querySelector('.recipe-options');
  const showOptions = () => {
    api.body.querySelector('.recipe-preview').textContent = 'Recette cachée !';
    box.innerHTML = options.map((item) => '<button data-ingredient="' + item + '">' + item + '</button>').join('');
  };
  setTimeout(showOptions, 3200);
  box.addEventListener('click', (e) => {
    const button = e.target.closest('[data-ingredient]');
    if (!button || !alive || position >= recipe.length) return;
    if (button.dataset.ingredient !== recipe[position]) { api.end(position / recipe.length, position + ' ingrédient(s) correct(s)'); return; }
    button.disabled = true; position++; api.frac = position / recipe.length;
    if (position >= recipe.length) api.end(1, 'Recette réalisée sans erreur');
  });
  api.info('Mémorisez la recette');
  timer = setInterval(() => { time--; api.info('Recette · ' + time + ' s'); if (time <= 0) api.end(position / recipe.length, position + ' ingrédient(s) correct(s)'); }, 1000);
  return () => { alive = false; clearInterval(timer); };
}

function gameCasino(api) {
  const colors = { green: 'vert', red: 'rouge', black: 'noir' };
  let stake = 1, betType = null, betValue = null, spinning = false;
  const minBet = casinoUnlimited() ? 1 : 1000000;
  const minText = casinoUnlimited() ? 'Mises illimitées' : 'Minimum 1 M';
  const p1 = '10%', p1L = '10%';
  const p2 = '25%', p2L = '25%';
  const p3 = '50%', p3L = '50%';
  const p4 = '75%', p4L = '75%';
  api.body.innerHTML = '<div class="casino"><div class="casino-hero"><div><span class="casino-kicker">COOKIE ROYALE</span><h3>La roulette de la boulangerie</h3><p>Couleur : ×2 · Chiffre exact : ×10</p></div><div class="casino-wheel"><span>0</span><i>2</i><b>4</b><i>6</i><b>8</b><i>10</i></div></div>' +
    '<div class="casino-panel"><div class="casino-bankroll"><span>Votre solde</span><strong>' + fmt(S.cookies) + ' 🍪</strong></div><div class="casino-stake-row"><label>Mise <strong><input class="casino-stake" type="number" min="' + minBet + '" step="' + minBet + '" value="' + minBet + '"></strong> cookies</label><small>' + minText + '</small></div><div class="casino-presets"><button data-stake="' + p1 + '">' + p1L + '</button><button data-stake="' + p2 + '">' + p2L + '</button><button data-stake="' + p3 + '">' + p3L + '</button><button data-stake="' + p4 + '">' + p4L + '</button><button data-stake="100%">100%</button></div>' +
    '<div class="casino-section-title">Choisissez votre pari</div><div class="casino-bets"><button data-bet="green">🟢 <span>Vert</span><small>0 · ×2</small></button><button data-bet="red">🔴 <span>Rouge</span><small>Pairs · ×2</small></button><button data-bet="black">⚫ <span>Noir</span><small>Impairs · ×2</small></button></div>' +
    '<div class="casino-section-title">Ou choisissez un chiffre · ×10</div><div class="casino-numbers">' + Array.from({ length: 11 }, (_, n) => '<button data-number="' + n + '">' + n + '</button>').join('') + '</div>' +
    '<div class="casino-result">Choisissez une couleur ou un chiffre.</div><button class="big-btn casino-spin">Lancer la roulette</button></div></div>';
  const stakeInput = api.body.querySelector('.casino-stake');
  const result = api.body.querySelector('.casino-result');
  const allBetButtons = api.body.querySelectorAll('[data-bet], [data-number]');
  const spin = api.body.querySelector('.casino-spin');
  api.body.querySelectorAll('[data-stake]').forEach((button) => button.addEventListener('click', () => {
    let val;
    if (button.dataset.stake === 'max' || button.dataset.stake === '100%') {
      val = Math.floor(S.cookies);
    } else if (button.dataset.stake.endsWith('%')) {
      const pct = parseInt(button.dataset.stake) / 100;
      val = Math.floor(S.cookies * pct);
    } else {
      val = parseInt(button.dataset.stake);
    }
    const min = casinoUnlimited() ? 1 : 1000000;
    if (val < min && S.cookies >= min) val = min;
    if (val < min) val = Math.floor(S.cookies); // If even 100% is less than min, just put max balance (it will fail later with "fonds insuffisants" anyway or we allow it)
    stakeInput.value = val;
  }));
  allBetButtons.forEach((button) => button.addEventListener('click', () => {
    allBetButtons.forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    betType = button.dataset.bet ? 'color' : 'number';
    betValue = button.dataset.bet || Number(button.dataset.number);
    result.textContent = 'Mise sur ' + (betType === 'color' ? colors[betValue] : 'le ' + betValue) + '.';
  }));
  spin.addEventListener('click', () => {
    if (spinning) return;
    stake = Math.floor(Number(stakeInput.value) || 0);
    const minBet = casinoUnlimited() ? 1 : 1000000;
    if (stake < minBet) { result.textContent = 'La mise minimum est de ' + fmt(minBet) + ' cookies.'; return; }
    if (!betType) { result.textContent = 'Choisissez d’abord une couleur ou un chiffre.'; return; }
    if (stake > S.cookies) { result.textContent = 'Vous ne possédez pas assez de cookies.'; return; }
    spinning = true;
    spin.disabled = true;
    S.cookies -= stake;
    const number = Math.floor(Math.random() * 11);
    const color = number === 0 ? 'green' : number % 2 === 0 ? 'red' : 'black';
    const won = betType === 'number' ? Number(betValue) === number : betValue === color;
    const payout = won ? stake * (betType === 'number' ? 10 : 2) : 0;
    setTimeout(() => {
      if (payout) gain(payout);
      result.textContent = 'La roulette tombe sur ' + number + ' (' + colors[color] + ') · ' + (won ? 'gagné +' + payout : 'perdu');
      api.frac = won ? 1 : 0;
      api.end(0, won ? 'Gain casino : +' + payout + ' cookies' : 'La roulette a gagné cette fois.');
    }, 650);
  });
  api.info('Choisissez une mise en millions de cookies');
  return () => { spinning = true; };
}

function gameTarget(api) {
  api.body.innerHTML = '<p class="game-hint">Touchez les cibles 🎯 avant qu\'elles ne disparaissent. Les étoiles ⭐ valent 3 points. Objectif : 30 points.</p><div class="arena"></div>';
  const A = api.body.querySelector('.arena');
  const goal = 30;
  let score = 0, t = 20;
  const upd = () => { api.frac = score / goal; api.info(score + ' pts · ' + t + ' s'); };
  const spawn = setInterval(() => {
    const gold = Math.random() < 0.12;
    const el = document.createElement('button');
    el.className = 'target' + (gold ? ' gold' : '');
    el.textContent = gold ? '⭐' : '🎯';
    el.style.left = rand(8, 92) + '%';
    el.style.top = rand(12, 82) + '%';
    el.style.animationDuration = Math.max(700, 1500 - (20 - t) * 35) + 'ms';
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      score += gold ? 3 : 1;
      throwAt(A, el);
      el.remove();
      upd();
    });
    el.addEventListener('animationend', () => el.remove());
    A.appendChild(el);
  }, 600);
  const timer = setInterval(() => { t--; upd(); if (t <= 0) api.end(score / goal, score + ' points marqués'); }, 1000);
  upd();
  return () => { clearInterval(spawn); clearInterval(timer); };
}
function throwAt(A, el) {
  const a = A.getBoundingClientRect(), r = el.getBoundingClientRect();
  const x0 = a.width / 2, y0 = a.height - 20;
  const x1 = r.left - a.left + r.width / 2, y1 = r.top - a.top + r.height / 2;
  const c = document.createElement('span');
  c.className = 'thrown';
  c.textContent = '🍪';
  A.appendChild(c);
  c.animate([
    { transform: 'translate(' + x0 + 'px,' + y0 + 'px) rotate(0deg)' },
    { transform: 'translate(' + x1 + 'px,' + y1 + 'px) rotate(360deg) scale(.7)' },
  ], { duration: 170, easing: 'ease-out' }).onfinish = () => {
    c.remove();
    const b = document.createElement('span');
    b.className = 'boom';
    b.textContent = '💥';
    b.style.left = x1 + 'px';
    b.style.top = y1 + 'px';
    A.appendChild(b);
    b.addEventListener('animationend', () => b.remove());
  };
}

/* --- 2. Sortie du four --- */
function gameOven(api) {
  api.body.innerHTML = '<p class="game-hint">Sortez le cookie quand l\'aiguille est dans la zone dorée. 5 fournées, de plus en plus rapides !</p>' +
    '<div class="oven"><div class="oven-window"><span class="ov-ck">🍪</span></div>' +
    '<div class="gauge"><div class="zone"></div><div class="needle"></div></div>' +
    '<div class="gauge-labels"><span>Cru</span><span>Brûlé</span></div>' +
    '<div class="oven-res"></div>' +
    '<button class="big-btn ov-btn">Sortir du four ! <small>(Espace)</small></button></div>';
  const q = (s) => api.body.querySelector(s);
  const zoneEl = q('.zone'), needle = q('.needle'), res = q('.oven-res'), ck = q('.ov-ck');
  let round = 0, total = 0, pos = 0, dir = 1, zs = 0, zw = 0, speed = 0, waiting = false, raf = 0, last = performance.now(), alive = true;
  function newRound() {
    if (!alive) return;
    zw = 22 - round * 3.5;
    zs = rand(30, 88 - zw);
    speed = 55 + round * 22;
    pos = 0; dir = 1; waiting = false;
    zoneEl.style.left = zs + '%';
    zoneEl.style.width = zw + '%';
    api.info('Fournée ' + (round + 1) + ' / 5 · ' + Math.round(total) + ' pts');
  }
  function frame(t) {
    const dt = Math.max(0, Math.min(0.05, (t - last) / 1000));
    last = t;
    if (!waiting) {
      pos += dir * speed * dt;
      if (pos >= 100) { pos = 100; dir = -1; }
      if (pos <= 0) { pos = 0; dir = 1; }
      needle.style.left = pos + '%';
      ck.style.filter = 'brightness(' + (1.3 - pos / 100 * 0.95) + ') saturate(' + (0.5 + pos / 100) + ')';
    }
    raf = requestAnimationFrame(frame);
  }
  function take() {
    if (waiting || round >= 5) return;
    waiting = true;
    const center = zs + zw / 2, d = Math.abs(pos - center);
    let pts, label;
    if (d <= zw / 2) { pts = 100 - d / (zw / 2) * 25; label = '🍪 Parfait'; }
    else { pts = Math.max(0, 70 - (d - zw / 2) * 3); label = pos < zs ? '🥠 Pas assez cuit' : '🔥 Brûlé'; }
    total += pts;
    round++;
    res.insertAdjacentHTML('beforeend', '<span>' + label + ' <b>' + Math.round(pts) + '</b></span>');
    api.frac = total / 450;
    api.info('Fournée ' + round + ' / 5 · ' + Math.round(total) + ' pts');
    if (round >= 5) setTimeout(() => api.end(total / 450, Math.round(total) + ' points sur 500'), 800);
    else setTimeout(newRound, 800);
  }
  const key = (e) => { if (e.code === 'Space' && !e.repeat) { e.preventDefault(); take(); } };
  q('.ov-btn').addEventListener('click', take);
  addEventListener('keydown', key);
  newRound();
  raf = requestAnimationFrame(frame);
  return () => { alive = false; cancelAnimationFrame(raf); removeEventListener('keydown', key); };
}

/* --- 3. Vente de cookies --- */
function gameShop(api) {
  const P = ['🍪', '🧁', '🍩', '🥐', '🥧'];
  const FACES = ['👵', '🧒', '👨', '👩', '🧔', '👴', '👧', '🤠', '🧙', '👮', '🧑‍🚀', '🦸'];
  api.body.innerHTML = '<p class="game-hint">Servez les clients : cliquez sur les pâtisseries de leur commande. Une erreur vide le plateau ! Objectif : 9 clients.</p>' +
    '<div class="shop"><div class="customer"><div class="face"></div><div class="bubble"></div></div>' +
    '<div class="patience"><i></i></div><div class="tray"></div>' +
    '<div class="products">' + P.map((p) => '<button data-p="' + p + '">' + p + '</button>').join('') + '</div></div>';
  const q = (s) => api.body.querySelector(s);
  const goal = 9;
  let served = 0, t = 30, order = {}, tray = {}, patience = 0, patMax = 9, raf = 0, last = performance.now();
  function say(text) {
    const p = document.createElement('div');
    p.className = 'pop';
    p.textContent = text;
    q('.customer').appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
  function newCustomer() {
    const kinds = 1 + Math.floor(Math.random() * Math.min(3, 1 + served / 3));
    order = {};
    shuffle(P.slice()).slice(0, kinds).forEach((p) => { order[p] = 1 + Math.floor(Math.random() * (served >= 4 ? 3 : 2)); });
    tray = {};
    patMax = patience = Math.max(6, 10 - served * 0.3);
    q('.face').textContent = FACES[Math.floor(Math.random() * FACES.length)];
    q('.bubble').innerHTML = 'Je voudrais ' + Object.entries(order).map(([p, n]) => '<b>' + n + ' ' + p + '</b>').join(' et ') + ', s\'il vous plaît !';
    renderTray();
  }
  function renderTray() {
    const items = [];
    for (const [p, n] of Object.entries(tray)) for (let i = 0; i < n; i++) items.push(p);
    q('.tray').innerHTML = items.length ? items.join(' ') : '<span>Plateau vide</span>';
  }
  q('.products').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const p = b.dataset.p;
    tray[p] = (tray[p] || 0) + 1;
    if (tray[p] > (order[p] || 0)) {
      tray = {};
      renderTray();
      const bub = q('.bubble');
      bub.classList.remove('shake');
      void bub.offsetWidth;
      bub.classList.add('shake');
      say('Ce n\'est pas ça !');
      return;
    }
    renderTray();
    if (Object.keys(order).every((k) => tray[k] === order[k])) {
      served++;
      api.frac = served / goal;
      say('Merci ! 😊');
      newCustomer();
    }
  });
  function frame(now) {
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
    last = now;
    t -= dt;
    patience -= dt;
    q('.patience i').style.width = Math.max(0, patience / patMax * 100) + '%';
    if (patience <= 0) { say('Trop long… 😤'); newCustomer(); }
    api.info(served + ' client' + (served > 1 ? 's' : '') + ' · ' + Math.ceil(Math.max(0, t)) + ' s');
    if (t <= 0) { api.end(served / goal, served + ' client' + (served > 1 ? 's' : '') + ' servi' + (served > 1 ? 's' : '')); return; }
    raf = requestAnimationFrame(frame);
  }
  newCustomer();
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/* --- 4. Attrape-cookies --- */
function gameCatch(api) {
  api.body.innerHTML = '<p class="game-hint">Déplacez le panier avec la souris (ou le doigt) pour attraper les cookies 🍪 (+1) et les étoiles 🌟 (+5). Évitez les brocolis 🥦 (−3) ! Objectif : 45 points.</p>' +
    '<div class="arena"><canvas></canvas></div>';
  const A = api.body.querySelector('.arena'), cv = A.querySelector('canvas'), g = cv.getContext('2d');
  const W = cv.width = A.clientWidth || 560, H = cv.height = A.clientHeight || 340;
  const goal = 45, by = H - 32;
  let bx = W / 2, items = [], pops = [], score = 0, t = 25, spawnAcc = 0, raf = 0, last = performance.now();
  const move = (e) => {
    const r = cv.getBoundingClientRect();
    bx = Math.max(26, Math.min(W - 26, (e.clientX - r.left) * W / r.width));
  };
  cv.addEventListener('pointermove', move);
  cv.addEventListener('pointerdown', move);
  function frame(now) {
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
    last = now;
    t -= dt;
    spawnAcc += dt;
    const every = Math.max(0.22, 0.5 - (25 - t) * 0.012);
    while (spawnAcc > every) {
      spawnAcc -= every;
      const r = Math.random();
      items.push({ x: rand(20, W - 20), y: -20, v: rand(140, 220) + (25 - t) * 6, k: r < 0.08 ? 'star' : r < 0.3 ? 'bad' : 'ck' });
    }
    g.clearRect(0, 0, W, H);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = '30px serif';
    items = items.filter((it) => {
      it.y += it.v * dt;
      if (it.y > by - 24 && it.y < by + 12 && Math.abs(it.x - bx) < 40) {
        const d = it.k === 'star' ? 5 : it.k === 'bad' ? -3 : 1;
        score = Math.max(0, score + d);
        pops.push({ x: it.x, y: by - 34, txt: (d > 0 ? '+' : '') + d, a: 1 });
        return false;
      }
      if (it.y > H + 20) return false;
      g.fillText(it.k === 'star' ? '🌟' : it.k === 'bad' ? '🥦' : '🍪', it.x, it.y);
      return true;
    });
    g.font = '46px serif';
    g.fillText('🧺', bx, by);
    g.font = 'bold 18px Fredoka, sans-serif';
    pops = pops.filter((p) => {
      p.y -= 40 * dt;
      p.a -= dt * 1.5;
      g.globalAlpha = Math.max(0, p.a);
      g.fillStyle = p.txt.charAt(0) === '-' ? '#ff8a7a' : '#ffd166';
      g.fillText(p.txt, p.x, p.y);
      g.globalAlpha = 1;
      return p.a > 0;
    });
    api.frac = score / goal;
    api.info(score + ' pts · ' + Math.ceil(Math.max(0, t)) + ' s');
    if (t <= 0) { api.end(score / goal, score + ' points attrapés'); return; }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/* --- 5. Memory gourmand --- */
function gameMemory(api) {
  const E = ['🍪', '🧁', '🍩', '🥐', '🥧', '🍰', '🍫', '🥨'];
  const deck = shuffle(E.concat(E));
  api.body.innerHTML = '<p class="game-hint">Retrouvez les 8 paires de pâtisseries en moins de 60 secondes. Plus vous êtes rapide, plus vous gagnez !</p>' +
    '<div class="memory">' + deck.map((e, i) => '<button class="mcard" data-i="' + i + '"><span class="back">?</span><span class="front">' + e + '</span></button>').join('') + '</div>';
  let open = [], found = 0, lock = false, t = 60, moves = 0;
  const upd = () => api.info(found + ' / 8 paires · ' + t + ' s');
  api.body.querySelector('.memory').addEventListener('click', (e) => {
    const c = e.target.closest('.mcard');
    if (!c || lock || c.classList.contains('flip')) return;
    c.classList.add('flip');
    open.push(c);
    if (open.length < 2) return;
    moves++;
    const [a, b] = open;
    if (deck[a.dataset.i] === deck[b.dataset.i]) {
      a.classList.add('found');
      b.classList.add('found');
      open = [];
      found++;
      api.frac = found / 8 * 0.8;
      upd();
      if (found === 8) api.end(0.8 + 0.2 * Math.min(1, t / 20), '8 paires en ' + moves + ' coups, ' + t + ' s restantes');
    } else {
      lock = true;
      setTimeout(() => { a.classList.remove('flip'); b.classList.remove('flip'); open = []; lock = false; }, 650);
    }
  });
  const timer = setInterval(() => {
    t--;
    upd();
    if (t <= 0) api.end(found / 8 * 0.8, found + ' paire' + (found > 1 ? 's' : '') + ' trouvée' + (found > 1 ? 's' : ''));
  }, 1000);
  upd();
  return () => clearInterval(timer);
}

/* --- 6. Roue de la fortune --- */
function gameWheel(api) {
  const max = gameMax();
  const SEG = [{ f: 0.2 }, { f: 0.6 }, { death: true }, { f: 0.3 }, { f: 0.15, fz: true }, { f: 1 }, { life: true }, { f: 0.4 }, { f: 1.5, jackpot: true }, { f: 0.5 }];
  const COLORS = ['#c2702e', '#8a4c1c', '#000000', '#d9954a', '#ffb347', '#a5602a', '#ff00ff', '#e0a458', '#ffd166', '#7a3e1d'];
  api.body.innerHTML = '<p class="game-hint">Tentez votre chance ! Un seul tour de roue, un lot garanti.</p>' +
    '<div class="wheel-wrap"><div class="wheel-pointer">▼</div><canvas width="320" height="320"></canvas></div>' +
    '<div class="center"><button class="big-btn w-btn">Tourner la roue !</button></div>';
  const cv = api.body.querySelector('canvas'), g = cv.getContext('2d');
  const btn = api.body.querySelector('.w-btn');
  const n = SEG.length, arc = Math.PI * 2 / n;
  let raf = 0;
  function draw(rot) {
    g.clearRect(0, 0, 320, 320);
    g.save();
    g.translate(160, 160);
    g.rotate(rot);
    for (let i = 0; i < n; i++) {
      g.beginPath();
      g.moveTo(0, 0);
      g.arc(0, 0, 152, i * arc, (i + 1) * arc);
      g.closePath();
      if (SEG[i].life) {
        const grad = g.createLinearGradient(0, -152, 0, 152);
        grad.addColorStop(0, 'red'); grad.addColorStop(0.5, 'lime'); grad.addColorStop(1, 'blue');
        g.fillStyle = grad;
      } else {
        g.fillStyle = COLORS[i];
      }
      g.fill();
      g.strokeStyle = '#2a170c';
      g.lineWidth = 3;
      g.stroke();
      g.save();
      g.rotate(i * arc + arc / 2);
      g.textAlign = 'right';
      g.textBaseline = 'middle';
      g.fillStyle = '#1b0f09';
      g.font = 'bold 14px Fredoka, sans-serif';
      const s = SEG[i];
      g.fillText(s.death ? '☠️' : s.life ? '🌈 x2' : s.fz ? '⚡ Frénésie' : (s.jackpot ? '💰 ' : '') + fmtCompact(max * s.f), 140, 0);
      g.restore();
    }
    g.beginPath();
    g.arc(0, 0, 28, 0, Math.PI * 2);
    g.fillStyle = '#2a170c';
    g.fill();
    g.restore();
    g.font = '28px serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('🍪', 160, 162);
  }
  draw(0);
  api.info('');
  btn.addEventListener('click', () => {
    btn.disabled = true;
    const target = Math.floor(Math.random() * n), s = SEG[target];
    api.frac = s.f;
    // la flèche est en haut (angle -90°) : on vise le milieu du segment choisi
    const final = 6 * Math.PI * 2 - Math.PI / 2 - (target * arc + arc / 2) + rand(-arc * 0.35, arc * 0.35);
    const t0 = performance.now(), D = 4500;
    function frame(t) {
      const k = Math.min(1, (t - t0) / D);
      draw(final * (1 - Math.pow(1 - k, 4)));
      if (k < 1) { raf = requestAnimationFrame(frame); return; }
      if (s.fz && Date.now() >= S.fz.until) startFrenzy();
      if (s.death) {
        const lastThree = BUILDINGS.filter(b => S.owned[b.id] > 0).slice(-3);
        for (const b of lastThree) {
          S.owned[b.id] = Math.max(0, Math.floor(S.owned[b.id] / 2));
        }
        recalc();
      }
      if (s.life) {
        const ownedBlds = BUILDINGS.filter(b => S.owned[b.id] > 0);
        const lastTwo = ownedBlds.slice(-2);
        for (const b of lastTwo) {
          S.owned[b.id] *= 2;
        }
        recalc();
      }
      setTimeout(() => api.end(s.f || 0, s.death ? '☠️ LA MORT QUI TUE (-50% des 3 derniers bâtiments)' : s.life ? '🌈 LA VIE QUI VIE (Derniers x2)' : s.fz ? 'Frénésie déclenchée, et un petit bonus !' : s.jackpot ? '💰 JACKPOT !' : 'La roue a parlé.'), 600);
    }
    raf = requestAnimationFrame(frame);
  });
  return () => cancelAnimationFrame(raf);
}

function gameSort(api) {
  const types = [{e:'🍫', n:'Chocolat'}, {e:'🌾', n:'Farine'}, {e:'🥛', n:'Lait'}];
  let queue = Array.from({length: 15}, () => types[Math.floor(Math.random() * types.length)]);
  let score = 0, time = 15, alive = true, timer;
  
  const render = () => {
    if (!alive) return;
    if (queue.length === 0) {
      api.end(1, 'Tous les ingrédients sont triés !');
      return;
    }
    api.body.innerHTML = '<p class="game-hint">Triez les ingrédients dans le bon sac ! (Pénalité de 2s par erreur)</p>' +
      '<div style="font-size:70px; text-align:center; height:90px; margin:20px 0; animation: pop 0.2s;">' + queue[0].e + '</div>' +
      '<div style="display:flex; justify-content:center; gap:10px;">' +
      types.map((t, i) => '<button data-bag="'+i+'" class="big-btn" style="flex:1; padding:10px; font-size:14px; background:linear-gradient(180deg, #6b4521, #452a12); box-shadow:0 4px 0 #2a1400; border:1px solid #8c5e2c;">🛍️<br>'+t.n+'</button>').join('') +
      '</div>';
      
    api.body.querySelectorAll('[data-bag]').forEach(b => b.addEventListener('click', () => {
      if (!alive) return;
      let target = parseInt(b.dataset.bag);
      if (types[target].e === queue[0].e) {
        score++;
        queue.shift();
        api.frac = score / 15;
        render();
      } else {
        time = Math.max(0, time - 2);
        b.style.transform = 'translateY(2px)';
        b.style.background = '#8a3333';
        setTimeout(() => { if (alive) render(); }, 200);
      }
    }));
  };
  
  render();
  api.info('15 objets · 15 s');
  timer = setInterval(() => { 
    time--; 
    api.info(queue.length + ' restants · ' + time + ' s'); 
    if (time <= 0) api.end(score / 15, score + ' ingrédient(s) trié(s)'); 
  }, 1000);
  return () => { alive = false; clearInterval(timer); };
}

/* gameDraw removed */

function gameCook(api) {
  let step = 1, time = 20, timer, alive = true;
  let kneadCount = 0, bakeTime = 0;
  let bakeInterval;
  
  const render = () => {
    if (!alive) return;
    if (step === 1) {
      api.body.innerHTML = '<p class="game-hint">Étape 1/3 : Pétrissez la pâte ! (15 clics rapides)</p>' +
        '<div style="text-align:center; padding: 20px;"><button id="kneadBtn" style="font-size:80px; transition:0.1s; background:transparent; border:none;">🥣</button></div>';
      const b = api.body.querySelector('#kneadBtn');
      b.addEventListener('mousedown', () => {
        if (!alive) return;
        b.style.transform = 'scale(0.85)';
        setTimeout(() => b.style.transform = 'none', 100);
        kneadCount++;
        api.frac = kneadCount / 15 * 0.33;
        if (kneadCount >= 15) { step = 2; render(); }
      });
    } else if (step === 2) {
      api.body.innerHTML = '<p class="game-hint">Étape 2/3 : Cuisson. Sortez-le quand il est bien doré !</p>' +
        '<div style="text-align:center; padding: 20px;"><div id="ovenCookie" style="margin:0 auto 15px; width:100px; height:100px; border-radius:50%; background:#fbeee0; transition: background 0.1s linear;"></div><button id="takeOut" class="big-btn">Sortir du four</button></div>';
      const c = api.body.querySelector('#ovenCookie');
      const b = api.body.querySelector('#takeOut');
      let localTime = 0;
      bakeInterval = setInterval(() => {
        if (!alive || step !== 2) return clearInterval(bakeInterval);
        localTime += 0.1;
        if (localTime < 1.5) c.style.background = '#fbeee0'; 
        else if (localTime < 3) c.style.background = '#e7b56a'; 
        else if (localTime < 4.5) c.style.background = '#c2702e'; 
        else c.style.background = '#301d0e'; 
      }, 100);
      b.addEventListener('click', () => {
        clearInterval(bakeInterval);
        let score = 0;
        if (localTime >= 3 && localTime < 4.5) score = 0.33;
        else if (localTime >= 1.5 && localTime < 5) score = 0.15;
        api.frac = 0.33 + score;
        step = 3; render();
      });
    } else if (step === 3) {
      api.body.innerHTML = '<p class="game-hint">Étape 3/3 : Décorez ! Placez 3 pépites de chocolat.</p>' +
        '<div id="decZone" style="position:relative; margin:0 auto; width:150px; height:150px; border-radius:50%; background:#c2702e; cursor:crosshair; touch-action:none;"></div>';
      const z = api.body.querySelector('#decZone');
      let chips = 0;
      z.addEventListener('mousedown', (e) => {
        if (!alive || chips >= 3) return;
        const rect = z.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const chip = document.createElement('div');
        chip.style.cssText = 'position:absolute; width:18px; height:18px; background:#381a09; border-radius:50%; left:'+(x-9)+'px; top:'+(y-9)+'px; box-shadow:inset -2px -2px 0 rgba(0,0,0,0.5);';
        z.appendChild(chip);
        chips++;
        api.frac += 0.11;
        if (chips >= 3) {
          setTimeout(() => api.end(api.frac, 'Cookie terminé !'), 500);
        }
      });
    }
  };
  
  render();
  api.info('En cuisine · 20 s');
  timer = setInterval(() => {
    time--;
    api.info('En cuisine · ' + time + ' s');
    if (time <= 0) {
      clearInterval(bakeInterval);
      api.end(api.frac, 'Temps écoulé !');
    }
  }, 1000);
  return () => { alive = false; clearInterval(timer); clearInterval(bakeInterval); };
}

/* =====================================================================
   SUCCÈS, STATISTIQUES, ASCENSION
   ===================================================================== */
const chipsPotential = () => Math.min(70, Math.floor(Math.cbrt(S.baked / (1.5e12 * Math.pow(2, S.ascensions))) * 0.5));
function renderAchPane() {
  const rows = [
    ['Cookies en banque', fmt(S.cookies)],
    ['Cuits (cette partie)', fmt(S.baked)],
    ['Cuits (depuis le début)', fmt(S.bakedAll)],
    ['Production', fmt(steadyCps(), true) + ' /s'],
    ['Faits à la main', fmt(S.handmade)],
    ['Clics', fmt(S.clicks)],
    ['Meilleur clic', fmt(S.bestClick, true)],
    ['Meilleur combo', '×' + S.bestCombo.toLocaleString('fr-FR', { maximumFractionDigits: 2 })],
    ['Frénésies', S.frenzies],
    ['Cookies dorés', S.golden],
    ['Événements vécus', S.evTotal],
    ['Mini-jeux joués', S.gamesPlayed],
    ['Améliorations', S.ups.length + ' / ' + UPGRADES.length],
    ['Ascensions', S.ascensions],
    ['Temps de jeu', fmtTime(S.playTime)],
  ];
  $('#statsGrid').innerHTML = rows.map(([k, v]) => '<div><span>' + k + '</span><b>' + v + '</b></div>').join('');
  const pot = chipsPotential(), g = Math.max(0, pot - S.chips);
  const nextTarget = Math.pow((pot + 1) * 2, 3) * 1.5e12 * Math.pow(2, S.ascensions);
  $('#ascInfo').innerHTML =
    '<p>Pépites célestes : <b>' + S.chips + '</b> (+' + S.chips * 2 + ' % de production)</p>' +
    (g > 0
      ? '<p>Une ascension maintenant vous rapporterait <b>' + g + '</b> pépite' + (g > 1 ? 's' : '') + ' (+' + g * 2 + ' %).</p>'
      : '<p>Prochaine pépite quand vous aurez cuit <b>' + fmt(nextTarget) + '</b> cookies.</p>');
  $('#ascBtn').disabled = g < 1;
  if(document.getElementById('templeChipsCurrent')) document.getElementById('templeChipsCurrent').textContent = '✨ Pépites célestes actuelles : ' + S.chips;
}

function performAscension(g, keptCompId = null) {
  if (activeEvent) endEvent();
  const keep = {};
  
  if (keptCompId && S.compData && S.compData.unlocked && S.compData.unlocked.includes(keptCompId)) {
    const lvl = (S.compData.levels && S.compData.levels[keptCompId]) || 1;
    const sh = (S.compData.shards && S.compData.shards[keptCompId]) || 0;
    keep.compData = {
      unlocked: [keptCompId],
      equipped: [keptCompId],
      shards: { [keptCompId]: sh },
      levels: { [keptCompId]: lvl },
      pulls: 0,
      pityTracker: 0
    };
  } else {
    keep.compData = { unlocked: [], equipped: [], shards: {}, levels: {}, pulls: 0, pityTracker: 0 };
  }

  ['bakedAll', 'ach', 'custom', 'evSeen', 'evTotal', 'evViewed', 'gamesPlayed', 'games', 'gameBest', 'perfect', 'daily', 'dailyCount',
   'golden', 'frenzies', 'bestCombo', 'bestClick', 'clicks', 'handmade', 'playTime', 'styled', 'temple', 'chips'].forEach((k) => { keep[k] = S[k]; });
  keep.ascensions = S.ascensions + 1;
  keep.chips = (keep.chips || 0) + g;
  S = Object.assign(freshState(), keep);
  S.milestone = 0;
  recalc();
  refreshAll();
  renderAchPane();
  if (typeof renderCompanions === 'function') renderCompanions();
  if (typeof renderGachaPane === 'function') renderGachaPane();
  save();
  const keptName = keptCompId ? (COMPANIONS.find(x => x.id === keptCompId)?.name || 'Votre compagnon') : null;
  toast('😇', 'Ascension Réussie !', `Vous avez maintenant ${S.chips} pépites célestes !` + (keptName ? ` 🤝 ${keptName} vous a accompagné !` : ''));
  celebrate();
}

$('#ascBtn').addEventListener('click', () => {
  const g = chipsPotential();
  if (g < 1) return;

  const canKeepFriend = S.temple && S.temple.includes('keep_friend') && S.compData && S.compData.unlocked && S.compData.unlocked.length > 0;

  if (canKeepFriend) {
    current = { ended: true, api: { frac: 0 } };
    mInfo.textContent = '';
    
    let compCardsHtml = '';
    for (let id of S.compData.unlocked) {
      const c = COMPANIONS.find(x => x.id === id);
      if (!c) continue;
      const lvl = (S.compData.levels && S.compData.levels[id]) || 1;
      const friendClass = (c.isFriend && c.img) ? 'is-friend-photo' : '';
      compCardsHtml += `
        <div class="selector-comp-card rarity-${c.rarity}" data-asc-keep="${c.id}" style="cursor:pointer;">
          <div style="width:48px; height:48px; margin-bottom:6px; pointer-events:none;" class="${friendClass}">
            ${renderCompanionVisual(c, 48)}
          </div>
          <b style="font-size:12px; color:#fff; pointer-events:none;">${c.name}</b>
          <span style="font-size:10px; color:${RARITIES[c.rarity].color}; font-weight:bold; pointer-events:none;">${RARITIES[c.rarity].name} · Lvl ${lvl}</span>
          <button class="big-btn" data-asc-keep="${c.id}" style="margin-top:6px; font-size:11px; padding:4px 8px; width:100%; background:#2ecc71;">
            🤝 Conserver
          </button>
        </div>
      `;
    }

    mBody.innerHTML = `
      <div style="padding:15px; text-align:center;">
        <div style="font-size:44px; margin-bottom:6px;">😇</div>
        <h2 style="color:#f1c40f; margin-bottom:6px;">Ascension Céleste</h2>
        <p style="font-size:13px; color:#ced6e0; margin-bottom:12px;">
          Vous allez gagner <b style="color:#ffeb3b;">+${g} pépite(s) céleste(s)</b> (+${g * 2}% prod).<br>
          Grâce à <b>« Conserver mes amis »</b>, choisissez <b>1 compagnon</b> à emmener avec vous :
        </p>
        <div class="selector-comp-grid" style="max-height:300px; overflow-y:auto;">
          ${compCardsHtml}
        </div>
        <div style="display:flex; justify-content:center; gap:12px; margin-top:16px;">
          <button class="big-btn" onclick="closeModal();" style="background:#57606f; font-size:12px; padding:8px 14px;">Annuler</button>
          <button class="big-btn" data-asc-keep="none" style="background:#e74c3c; font-size:12px; padding:8px 14px;">Ne garder aucun compagnon</button>
        </div>
      </div>
    `;
    modal.classList.add('on');
    return;
  }

  if (!confirm('Faire une ascension ?\n\nVos cookies, bâtiments et améliorations repartent de zéro, mais vous gagnez ' + g +
    ' pépite(s) céleste(s) : +' + g * 2 + ' % de production pour toujours.')) return;
  performAscension(g, null);
});
$('#reset').addEventListener('click', () => {
  if (!confirm('Effacer complètement votre partie ? Tout sera perdu, même les succès.')) return;
  resetting = true;
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  location.reload();
});

/* =====================================================================
   PERSONNALISATION
   ===================================================================== */
const root = document.documentElement;
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (t - v) * p));
  return '#' + ((1 << 24) | (c[0] << 16) | (c[1] << 8) | c[2]).toString(16).slice(1);
}
function lum(hex) {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
}
function currentBg() {
  const c = S.custom;
  if (c.bgType === 'gradient') return { bg: c.bgGrad2, hi: c.bgGrad1, angle: c.bgAngle };
  if (c.bgType === 'solid' || c.bg === 'custom') return { bg: shade(c.bgCustom, -0.82), hi: c.bgCustom, angle: 135 };
  const t = BG_THEMES.find((t) => t.id === c.bg) || BG_THEMES[0];
  return { bg: t.bg, hi: t.hi, angle: 135 };
}
function currentCookie() {
  const c = S.custom;
  let baseChip = '#4b2411';
  let cColors, edge;
  
  if (c.ckType === 'gradient') {
    cColors = [c.ckGrad1, shade(c.ckGrad1, -0.2), c.ckGrad2];
    edge = shade(c.ckGrad2, -0.3);
    baseChip = lum(c.ckGrad1) > 0.55 ? '#4b2411' : '#fff1dc';
  } else if (c.ckType === 'solid' || c.cookie === 'custom') {
    const x = c.cookieCustom;
    cColors = [shade(x, 0.4), x, shade(x, -0.35)];
    edge = shade(x, -0.5);
    baseChip = lum(x) > 0.55 ? '#4b2411' : '#fff1dc';
  } else {
    const t = COOKIE_THEMES.find((t) => t.id === c.cookie) || COOKIE_THEMES[0];
    cColors = t.c;
    edge = t.edge;
    baseChip = t.chip;
  }
  
  const chipColor = c.chipType === 'custom' ? c.chipCustom : baseChip;
  return { c: cColors, chip: chipColor, edge: edge };
}
function miniCookieSvg(t) {
  return '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="' + t.c[1] + '" stroke="' + t.edge + '" stroke-width="2"/>' +
    '<circle cx="15" cy="14" r="7" fill="' + t.c[0] + '" opacity=".6"/>' +
    '<g fill="' + t.chip + '"><circle cx="13" cy="15" r="2.6"/><circle cx="24" cy="12" r="2.2"/><circle cx="27" cy="24" r="2.6"/><circle cx="16" cy="27" r="2.4"/><circle cx="21" cy="20" r="1.8"/></g></svg>';
}
function buildStylePane() {
  const c = S.custom;
  // Ensure new fields exist for backward compatibility
  c.bgType = c.bgType || (c.bg === 'custom' ? 'solid' : 'theme');
  c.ckType = c.ckType || (c.cookie === 'custom' ? 'solid' : 'theme');
  c.bgGrad1 = c.bgGrad1 || '#2a1a10';
  c.bgGrad2 = c.bgGrad2 || '#100a06';
  c.bgAngle = c.bgAngle || 135;
  c.ckGrad1 = c.ckGrad1 || '#f6cd86';
  c.ckGrad2 = c.ckGrad2 || '#a5602a';
  c.chipType = c.chipType || 'auto';
  c.chipCustom = c.chipCustom || '#4b2411';

  const bgBox = $('#bgSwatches');
  bgBox.innerHTML = '';
  for (const t of BG_THEMES) {
    const s = document.createElement('button');
    s.className = 'swatch';
    s.dataset.bg = t.id;
    s.innerHTML = '<span class="sw" style="background:linear-gradient(135deg,' + t.hi + ',' + t.bg + ')"></span>' + t.name;
    bgBox.appendChild(s);
  }
  bgBox.addEventListener('click', (e) => {
    const s = e.target.closest('[data-bg]');
    if (!s) return;
    S.custom.bg = s.dataset.bg;
    styled();
  });
  
  const ckBox = $('#ckSwatches');
  ckBox.innerHTML = '';
  for (const t of COOKIE_THEMES) {
    const s = document.createElement('button');
    s.className = 'swatch';
    s.dataset.ck = t.id;
    s.innerHTML = '<span class="sw">' + miniCookieSvg(t) + '</span>' + t.name;
    ckBox.appendChild(s);
  }
  ckBox.addEventListener('click', (e) => {
    const s = e.target.closest('[data-ck]');
    if (!s) return;
    S.custom.cookie = s.dataset.ck;
    styled();
  });

  // Init values
  $('#bgTypeSelect').value = c.bgType;
  $('#bgSolidPicker').value = c.bgCustom;
  $('#bgGrad1').value = c.bgGrad1;
  $('#bgGrad2').value = c.bgGrad2;
  $('#bgAngle').value = c.bgAngle;
  $('#bgAngleVal').textContent = c.bgAngle + '°';

  $('#ckTypeSelect').value = c.ckType;
  $('#ckSolidPicker').value = c.cookieCustom;
  $('#ckGrad1').value = c.ckGrad1;
  $('#ckGrad2').value = c.ckGrad2;

  $('#chipTypeSelect').value = c.chipType;
  $('#chipPicker').value = c.chipCustom;

  $('#nameInput').value = c.name;
  $('#optRain').checked = c.rain;
  $('#optFmt').value = c.numfmt;

  // Listeners
  $('#bgTypeSelect').addEventListener('change', e => { c.bgType = e.target.value; styled(); });
  $('#bgSolidPicker').addEventListener('input', e => { c.bgCustom = e.target.value; styled(); });
  $('#bgGrad1').addEventListener('input', e => { c.bgGrad1 = e.target.value; styled(); });
  $('#bgGrad2').addEventListener('input', e => { c.bgGrad2 = e.target.value; styled(); });
  $('#bgAngle').addEventListener('input', e => { c.bgAngle = e.target.value; $('#bgAngleVal').textContent = e.target.value + '°'; styled(); });

  $('#ckTypeSelect').addEventListener('change', e => { c.ckType = e.target.value; styled(); });
  $('#ckSolidPicker').addEventListener('input', e => { c.cookieCustom = e.target.value; styled(); });
  $('#ckGrad1').addEventListener('input', e => { c.ckGrad1 = e.target.value; styled(); });
  $('#ckGrad2').addEventListener('input', e => { c.ckGrad2 = e.target.value; styled(); });

  $('#chipTypeSelect').addEventListener('change', e => { c.chipType = e.target.value; styled(); });
  $('#chipPicker').addEventListener('input', e => { c.chipCustom = e.target.value; styled(); });

  $('#nameInput').addEventListener('input', (e) => { c.name = e.target.value.trim(); styled(); });
  $('#optRain').addEventListener('change', (e) => { c.rain = e.target.checked; styled(); });
  $('#optFmt').addEventListener('change', (e) => { c.numfmt = e.target.value; styled(); refreshAll(); });
}
function styled() {
  S.styled = true;
  applyStyle();
  checkAchievements();
  save();
}
function applyStyle() {
  const bg = currentBg();
  root.style.setProperty('--bg', bg.bg);
  root.style.setProperty('--bg-hi', bg.hi);
  root.style.setProperty('--bg-hi2', shade(bg.hi, -0.3));
  // Override background with proper angle for gradients
  document.body.style.background = `linear-gradient(${bg.angle}deg, ${bg.hi}, ${bg.bg})`;

  const ck = currentCookie();
  $('#d0').setAttribute('stop-color', ck.c[0]);
  $('#d1').setAttribute('stop-color', ck.c[1]);
  $('#d2').setAttribute('stop-color', ck.c[2]);
  $('#ckEdge').setAttribute('stroke', ck.edge);
  $('#chips').setAttribute('fill', ck.chip);
  const chipsHi = $('#chipsHi');
  if (chipsHi) chipsHi.setAttribute('fill', shade(ck.chip, lum(ck.chip) > 0.5 ? -0.25 : 0.3));
  drawSprite(ck);
  
  $('#bakery').textContent = S.custom.name || DEFAULT_CUSTOM.name;
  
  // Toggle UI visibility in the style pane
  const c = S.custom;
  $('#bgThemeGroup').style.display = c.bgType === 'theme' ? 'block' : 'none';
  $('#bgSolidGroup').style.display = c.bgType === 'solid' ? 'block' : 'none';
  $('#bgGradGroup').style.display = c.bgType === 'gradient' ? 'flex' : 'none';
  
  $('#ckThemeGroup').style.display = c.ckType === 'theme' ? 'block' : 'none';
  $('#ckSolidGroup').style.display = c.ckType === 'solid' ? 'block' : 'none';
  $('#ckGradGroup').style.display = c.ckType === 'gradient' ? 'flex' : 'none';

  $('#chipCustomGroup').style.display = c.chipType === 'custom' ? 'block' : 'none';

  document.querySelectorAll('[data-bg]').forEach((s) => s.classList.toggle('on', s.dataset.bg === c.bg));
  document.querySelectorAll('[data-ck]').forEach((s) => s.classList.toggle('on', s.dataset.ck === c.cookie));
}

/* =====================================================================
   PLUIE DE COOKIES (canvas)
   ===================================================================== */
const canvas = $('#rain'), ctx = canvas.getContext('2d');
const sprite = document.createElement('canvas');
sprite.width = sprite.height = 40;
function drawSprite(t) {
  const g = sprite.getContext('2d');
  g.clearRect(0, 0, 40, 40);
  const grad = g.createRadialGradient(15, 13, 2, 20, 20, 20);
  grad.addColorStop(0, t.c[0]);
  grad.addColorStop(1, t.c[2]);
  g.fillStyle = grad;
  g.beginPath(); g.arc(20, 20, 18, 0, Math.PI * 2); g.fill();
  g.fillStyle = t.chip;
  [[13, 12], [25, 10], [28, 24], [16, 26], [21, 18]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 2.6, 0, Math.PI * 2); g.fill(); });
}
let drops = [];
function resizeCanvas() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
addEventListener('resize', () => { resizeCanvas(); placeTip(); });
function spawnRain(n) {
  if (!S.custom.rain) return;
  for (let i = 0; i < n && drops.length < 80; i++) {
    drops.push({ x: Math.random() * canvas.width, y: -40, v: rand(60, 140), r: Math.random() * 6, s: rand(0.5, 1), a: Math.random() * 6 });
  }
}
let rainAcc = 0;
function drawRain(dt) {
  if (!S.custom.rain) { if (drops.length) { drops = []; ctx.clearRect(0, 0, canvas.width, canvas.height); } return; }
  rainAcc += dt * Math.min(8, Math.log10(cps() + 1) * 1.6);
  if (rainAcc >= 1) { spawnRain(Math.floor(rainAcc)); rainAcc %= 1; }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drops = drops.filter((d) => d.y < canvas.height + 40);
  for (const d of drops) {
    d.y += d.v * dt;
    d.a += d.r * dt * 0.3;
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.a);
    ctx.scale(d.s, d.s);
    ctx.drawImage(sprite, -20, -20);
    ctx.restore();
  }
}

/* =====================================================================
   ACTUALITÉS
   ===================================================================== */
function news() {
  const g = owned('grandma'), n = totalOwned(), msgs = [];
  if (S.baked < 50) msgs.push('Vous rêvez de cookies. Et si vous en faisiez ?', 'Votre cuisine sent bon le beurre.');
  if (S.baked >= 50) msgs.push('Vos cookies sont appréciés dans tout le quartier.', 'Un voisin demande votre recette. Vous refusez poliment.');
  if (g > 0) msgs.push('Les grand-mères échangent des astuces de cuisson.', 'Une grand-mère vous appelle « mon petit ».');
  if (g >= 10) msgs.push('Les grand-mères s\'organisent. Elles murmurent.', 'Pénurie de tabliers dans la région.');
  if (owned('farm') > 0) msgs.push('Des champs de cookies à perte de vue.');
  if (owned('mine') > 0) msgs.push('Les mineurs découvrent un filon de chocolat noir.');
  if (owned('factory') > 0) msgs.push('Les usines tournent jour et nuit. Les riverains adorent l\'odeur.');
  if (owned('bank') > 0) msgs.push('Le cookie devient la nouvelle monnaie de référence.');
  if (owned('temple') > 0) msgs.push('Un culte du cookie se répand dans le monde.');
  if (owned('wizard') > 0) msgs.push('Un sorcier transforme une citrouille en cookie géant.');
  if (owned('rocket') > 0) msgs.push('La première fusée revient de la planète Cookie, pleine à craquer.');
  if (owned('portal') > 0) msgs.push('Des créatures d\'une autre dimension réclament la recette.');
  if (owned('timemachine') > 0) msgs.push('Un historien affirme que les dinosaures adoraient vos cookies.');
  if (owned('antimatter') > 0) msgs.push('Les physiciens découvrent la particule du cookie : le chocolon.');
  if (owned('prism') > 0) msgs.push('Le soleil lui-même semble sentir la vanille.');
  if (n >= 50) msgs.push('Les économistes s\'inquiètent de votre monopole du cookie.');
  if (S.evTotal > 0) msgs.push('Les journaux parlent encore du dernier rassemblement de vos bâtiments.');
  if (S.frenzies > 0) msgs.push('Les frénésies de cookies deviennent une attraction touristique.');
  if (S.chips > 0) msgs.push('Des pépites célestes brillent au-dessus de votre boulangerie.');
  msgs.push('Astuce : cliquez vite et sans arrêt pour faire monter le combo !',
    'Astuce : un cookie doré apparaît parfois. Cliquez vite !',
    'Astuce : l\'onglet Jouer contient des mini-jeux qui rapportent gros.');
  const el = $('#newsText');
  el.classList.add('out');
  setTimeout(() => { 
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    el.textContent = msg; 
    el.classList.remove('out'); 
  }, 400);
}

/* =====================================================================
   ONGLETS
   ===================================================================== */
let currentTab = 'showcase';
const menuToggle = $('#menuToggle'), menuClose = $('#menuClose'), sideMenu = $('#sideMenu'), menuBackdrop = $('#menuBackdrop');
function setMenu(open) {
  sideMenu.classList.toggle('on', open);
  menuBackdrop.classList.toggle('on', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = '☰';
  menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  sideMenu.setAttribute('aria-hidden', String(!open));
}
menuToggle.addEventListener('click', () => setMenu(true));
menuClose.addEventListener('click', () => setMenu(false));
menuBackdrop.addEventListener('click', () => setMenu(false));
const appShell = document.querySelector('.app'), storeToggle = $('#storeToggle');
storeToggle.addEventListener('click', () => {
  const collapsed = appShell.classList.toggle('store-collapsed');
  storeToggle.setAttribute('aria-expanded', String(!collapsed));
  storeToggle.setAttribute('aria-label', collapsed ? 'Afficher la boutique' : 'Masquer la boutique');
});
sideMenu.addEventListener('click', (e) => {
  const button = e.target.closest('[data-menu-tab]');
  if (!button) return;
  showTab(button.dataset.menuTab);
  setMenu(false);
});
$('#tabs').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (b) showTab(b.dataset.tab);
});
function showTab(id) {
  currentTab = id;
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === id));
  document.querySelectorAll('.pane').forEach((p) => p.classList.toggle('on', p.id === id));
  document.querySelectorAll('[data-menu-tab]').forEach((b) => b.classList.toggle('on', b.dataset.menuTab === id));
  refreshPane();
}
function refreshPane() {
  if (currentTab === 'events') { S.evViewed = unlockedEvents().length; renderEventsPane(); }
  if (currentTab === 'play') updatePlayPane();
  if (currentTab === 'casino') { if (!casinoBuilt) renderCasinoPane(); else updateCasinoLimit(); }
  if (currentTab === 'ach') renderAchPane();
  if (currentTab === 'gacha') renderGachaPane();
  if (currentTab === 'showcase') refreshShowcase();
}
function updateDots() {
  const eventsDot = $('#dotEvents');
  const playDot = $('#dotPlay');
  if (eventsDot) eventsDot.classList.toggle('on', unlockedEvents().length > S.evViewed);
  const flappyReady = Array.isArray(S.games['flappy']) ? S.games['flappy'].length < (3 + templeExtraAttempts()) : true;
  if (playDot) playDot.classList.toggle('on', Date.now() >= S.daily || GAMES.some(gameReady) || flappyReady);
}

/* =====================================================================
   AFFICHAGE PRINCIPAL
   ===================================================================== */
function refreshAll() {
  renderCompanions();
  refreshStore();
  refreshShowcase();
  checkAchievements();
}

const msLevel = () => S.baked >= 1000 ? Math.floor(Math.log10(S.baked) / 3) : 0;
function renderNumbers(now) {
  $('#count').textContent = S.cheat ? '∞' : fmt(S.cookies);
  renderSpeedrunProgress();
  $('#cps').textContent = 'par seconde : ' + fmt(cps(), true);
  const base = steadyCps();
  $('#clickPower').textContent = '+' + fmt(clickPower(), true) + ' par clic' +
    (base > 0 && countUps('mouse') ? ' (' + Math.round(clickPower() / base * 100) + ' % de la prod)' : '');

  // Barre de frénésie
  const fz = S.fz, box = $('#fz');
  if (now < fz.until) {
    box.classList.add('active');
    $('#fzLabel').textContent = '⚡ Frénésie ×' + fz.mult;
    $('#fzTime').textContent = fmtTime((fz.until - now) / 1000);
    $('#fzFill').style.width = Math.max(0, (fz.until - now) / (fz.dur * 1000) * 100) + '%';
  } else {
    box.classList.remove('active');
    $('#fzLabel').textContent = 'Prochaine frénésie';
    $('#fzTime').textContent = fmtTime((fz.next - now) / 1000);
    $('#fzFill').style.width = Math.min(100, Math.max(0, (now - fz.start) / (fz.next - fz.start) * 100)) + '%';
  }

  // Clic frénétique
  const buff = $('#buff');
  if (now < clickFrenzyUntil) { buff.style.display = 'inline-block'; buff.textContent = '👆 Clic frénétique ×' + clickFrenzyMult + ' · ' + Math.ceil((clickFrenzyUntil - now) / 1000) + ' s'; }
  else buff.style.display = 'none';

  // Combo
  const cm = comboMult();
  $('#combo').classList.toggle('on', cm > 1.02);
  $('#comboText').textContent = 'Combo ×' + cm.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  $('#comboFill').style.width = ((cm - 1) / (comboCap() - 1) * 100) + '%';

  // Prochain palier
  const lvl = msLevel();
  $('#msNext').textContent = fmt(Math.pow(10, 3 * (lvl + 1)));
  const frac = S.baked < 1 ? 0 : lvl === 0 ? S.baked / 1000 : (Math.log10(S.baked) - 3 * lvl) / 3;
  $('#msFill').style.width = Math.min(100, frac * 100) + '%';
}
function everySecond() {
  document.title = fmt(S.cookies) + ' cookies · Cookie Clicker';
  const lvl = msLevel();
  if (lvl > S.milestone) {
    if (S.milestone >= 0) { toast('🎊', 'Palier atteint', fmt(Math.pow(10, 3 * lvl)) + ' cookies cuits !'); celebrate(); }
    S.milestone = lvl;
  }
  checkAchievements();
  refreshPane();
  updateDots();
}

/* =====================================================================
   BOUCLE DE JEU
   ===================================================================== */
let lastFrame = Date.now(), slowTimer = 0, secTimer = 0;
function loop() {
  const now = Date.now();
  const dt = Math.min((now - lastFrame) / 1000, 3600); // si l'onglet était caché, on rattrape
  lastFrame = now;
  gain(cps() * dt);
  checkSpeedrun();
  S.playTime += dt;
  if (now - lastClick > 700) combo = Math.max(0, combo - dt * 40);
  updateFrenzy(now);
  updateGolden(now);
  updateEvents(now);
  document.body.classList.toggle('frenzy', now < S.fz.until);
  document.body.classList.toggle('clickfrenzy', now < clickFrenzyUntil);
  drawRain(Math.min(dt, 0.1));
  renderNumbers(now);
  
  const banScreen = document.getElementById('banScreen');
  const banTimer = document.getElementById('banTimer');
  if (now < clickBlockedUntil) {
    if (!banScreen.classList.contains('on')) banScreen.classList.add('on');
    banTimer.textContent = Math.ceil((clickBlockedUntil - now) / 1000);
  } else if (banScreen.classList.contains('on')) {
    banScreen.classList.remove('on');
  }

  const ep = document.getElementById('enterPower');
  if (now < enterPowerUntil) {
    ep.style.display = 'block';
    const left = enterPowerUntil - now;
    const cookieEl = document.getElementById('cookie');
    
    if (now < enterFrenzyUntil) {
      const frenzyLeft = enterFrenzyUntil - now;
      document.getElementById('enterPowerTime').innerHTML = Math.ceil(left / 1000) + 's <span style="color:#ffb347; font-weight:bold; font-size:1.4em; text-shadow: 0 0 10px #ffb347;">(' + Math.ceil(frenzyLeft / 1000) + 's x' + (typeof enterFrenzyCurrentMult !== 'undefined' ? enterFrenzyCurrentMult : 200) + ')</span>';
      if (cookieEl) cookieEl.style.filter = 'hue-rotate(' + ((now / 10) % 360) + 'deg) drop-shadow(0 0 30px rgba(255, 255, 255, 0.8))';
    } else {
      document.getElementById('enterPowerTime').textContent = Math.ceil(left / 1000) + 's';
      if (cookieEl) cookieEl.style.filter = '';
    }
    
    document.getElementById('enterPowerFill').style.width = (left / 60000 * 100) + '%';
  } else {
    ep.style.display = 'none';
    const cookieEl = document.getElementById('cookie');
    if (cookieEl) cookieEl.style.filter = '';
  }
  
  slowTimer += dt;
  secTimer += dt;
  if (slowTimer > 0.2) { slowTimer = 0; refreshStore(); refreshTip(); }
  if (secTimer > 1) { secTimer = 0; everySecond(); }
  requestAnimationFrame(loop);
}

/* =====================================================================
   DÉMARRAGE
   ===================================================================== */
load();
recalc();
renderWorldUI();
if (S.milestone < 0) S.milestone = msLevel(); // pas de fête pour les paliers déjà atteints
const away = Math.min((Date.now() - S.last) / 1000, 8 * 3600);
if (S.baked > 0 && away > 60 && steadyCps() > 0) {
  const earned = steadyCps() * away * 0.5;
  gain(earned);
  setTimeout(() => toast('🌙', 'Pendant votre absence', '+' + fmt(earned) + ' cookies'), 600);
}
buildPlayPane();
buildStylePane();
applyStyle();
if (!worlds.length) openWorldModal(true);
resizeCanvas();
checkAchievements(true);
refreshAll();
showTab('showcase');
updateDots();
setInterval(save, 5000);
setInterval(news, 9000);
addEventListener('beforeunload', save);
addEventListener('visibilitychange', () => { if (document.hidden) save(); });
requestAnimationFrame(loop);

let enterFrenzyCurrentMult = 200; // Global variable for dynamic multiplier

function initFlappy() {
  const cv = document.getElementById('flappyCanvas');
  const ctx = cv.getContext('2d');
  const overlay = document.getElementById('flappyOverlay');
  const status = document.getElementById('flappyStatus');
  const btnE = document.getElementById('flappyStartE');
  const btnM = document.getElementById('flappyStartM');
  const btnH = document.getElementById('flappyStartH');
  const disabledMsg = document.getElementById('flappyDisabledMsg');
  const flappyMenu = document.getElementById('flappyMenu');
  
  let raf;
  let playing = false, startTime = 0;
  let mouseX = 200, mouseY = 200;
  let lasers = []; 
  let currentTargetTime = 10;
  let currentTargetMult = 50;
  
  if (!Array.isArray(S.games['flappy'])) S.games['flappy'] = [];
  let buyBtn = document.getElementById('flappyBuyBtn');
  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      const cost = Math.max(1, cps() * 3 * 300);
      if (S.cookies >= cost && S.games['flappy'].length > 0) {
        S.cookies -= cost;
        S.games['flappy'].shift();
        save();
        toast('⚡', 'Essai acheté !', '-' + fmt(cost) + ' cookies');
        updateBtn();
      }
    });
  }
  const updateBtn = () => {
    const now = Date.now();
    S.games['flappy'] = S.games['flappy'].filter(t => now - t < 3600000);
    const maxAttempts = 3 + templeExtraAttempts();
    const attempts = S.games['flappy'].length;
    const cost = Math.max(1, cps() * 3 * 300);
    if (attempts >= maxAttempts && !window.__adminMode) {
      if (btnE) btnE.disabled = true;
      if (btnM) btnM.disabled = true;
      if (btnH) btnH.disabled = true;
      const oldest = S.games['flappy'][0];
      if (disabledMsg) {
        disabledMsg.style.display = 'block';
        disabledMsg.textContent = 'Recharge : ' + Math.ceil((oldest + 3600000 - now) / 60000) + ' min';
      }
      if (buyBtn) {
        buyBtn.style.display = 'inline-block';
        buyBtn.textContent = '⚡ Recharger 1 essai (' + fmt(cost) + ' cookies)';
        buyBtn.disabled = S.cookies < cost;
        buyBtn.style.opacity = S.cookies < cost ? '0.5' : '1';
      }
    } else {
      if (btnE) btnE.disabled = false;
      if (btnM) btnM.disabled = false;
      if (btnH) btnH.disabled = false;
      if (disabledMsg) {
        disabledMsg.style.display = 'block';
        disabledMsg.textContent = `Essai(s) restant(s) : ${maxAttempts - attempts}`;
      }
      if (buyBtn) buyBtn.style.display = 'none';
    }
  };
  setInterval(updateBtn, 10000);
  updateBtn();
  
  const move = (e) => {
    const rect = cv.getBoundingClientRect();
    if(e.touches) {
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
    } else {
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
  };
  cv.addEventListener('mousemove', move);
  cv.addEventListener('touchmove', (e) => { e.preventDefault(); move(e); }, {passive:false});
  
  const startGame = (time, mult) => {
    currentTargetTime = time;
    currentTargetMult = mult;
    playing = true;
    lasers = [];
    mouseX = 200; mouseY = 200;
    startTime = Date.now();
    
    S.games['flappy'].push(Date.now());
    save();
    
    updateBtn();
    overlay.style.display = 'none'; 
    if (buyBtn) buyBtn.style.display = 'none';
    status.textContent = `Survivez ${time} secondes !`;
    status.style.color = '#fff';
    runGame();
  };

  if (btnE) btnE.addEventListener('click', () => startGame(10, 50));
  if (btnM) btnM.addEventListener('click', () => startGame(30, 150));
  if (btnH) btnH.addEventListener('click', () => startGame(60, 300));
  
  let trail = [];
  let stars = Array.from({length: 60}, () => ({ x: Math.random()*400, y: Math.random()*400, r: Math.random()*1.5+0.5, t: Math.random()*Math.PI*2 }));

  function runGame() {
    if (!playing) return;
    const elapsed = (Date.now() - startTime) / 1000;
    const difficulty = Math.min(1, elapsed / currentTargetTime); 
    
    const spawnChance = 0.015 + difficulty * 0.030;
    const laserWidth = Math.max(16, 45 - difficulty * 25);
    const warnTime = Math.max(40, 80 - difficulty * 25);
    if (Math.random() < spawnChance) {
      lasers.push({ axis: Math.random() > 0.5 ? 'x' : 'y', pos: Math.random() * 380 + 10, state: 'warn', timer: warnTime, width: laserWidth });
    }
    
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, 400, 400);
    stars.forEach(s => {
      s.t += 0.04;
      const alpha = 0.4 + 0.4 * Math.sin(s.t);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });
    
    trail.push({x: mouseX, y: mouseY});
    if (trail.length > 12) trail.shift();
    trail.forEach((p, i) => {
      const a = i / trail.length * 0.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8 * (i / trail.length), 0, Math.PI*2);
      ctx.fillStyle = `rgba(194,112,46,${a})`;
      ctx.fill();
    });
    
    for (let i = lasers.length - 1; i >= 0; i--) {
      let l = lasers[i];
      l.timer--;
      ctx.save();
      if (l.state === 'warn') {
        ctx.fillStyle = 'rgba(255,80,80,0.18)';
        ctx.shadowColor = 'rgba(255,0,0,0.3)';
        ctx.shadowBlur = 8;
        if (l.timer <= 0) { l.state = 'fire'; l.timer = Math.max(20, 35 - difficulty * 15); }
      } else {
        ctx.fillStyle = 'rgba(255,40,40,0.92)';
        ctx.shadowColor = '#ff0044';
        ctx.shadowBlur = 22;
        if (l.timer <= 0) { lasers.splice(i, 1); ctx.restore(); continue; }
        const cookieR = 15;
        if (l.axis === 'x') { if (Math.abs(mouseX - l.pos) < cookieR + l.width/2) { ctx.restore(); die('💥 Un laser vous a touché !'); return; } }
        else { if (Math.abs(mouseY - l.pos) < cookieR + l.width/2) { ctx.restore(); die('💥 Un laser vous a touché !'); return; } }
      }
      if (l.axis === 'x') ctx.fillRect(l.pos - l.width/2, 0, l.width, 400);
      else ctx.fillRect(0, l.pos - l.width/2, 400, l.width);
      ctx.restore();
    }
    
    ctx.save();
    ctx.shadowColor = '#ffb347';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 15, 0, Math.PI*2);
    ctx.fillStyle = '#c2702e';
    ctx.fill();
    ctx.strokeStyle = '#8a4c1c';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
    
    const progress = Math.min(1, elapsed / currentTargetTime);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 385, 380, 10);
    const barColor = `hsl(${120 - progress*120},90%,55%)`;
    ctx.fillStyle = barColor;
    ctx.fillRect(10, 385, 380 * progress, 10);
    
    status.textContent = 'Temps survécu : ' + elapsed.toFixed(1) + ' s / ' + currentTargetTime + ' s';
    
    if (elapsed >= currentTargetTime) {
      winGame(currentTargetMult);
    } else {
      raf = requestAnimationFrame(runGame);
    }
  }
  
  function die(msg) {
    playing = false;
    overlay.style.display = 'flex';
    updateBtn();
    status.textContent = msg;
    status.style.color = '#ff4d4d';
  }
  
  function winGame(mult) {
    playing = false;
    overlay.style.display = 'flex';
    status.textContent = 'VICTOIRE ! POUVOIR DE LA TOUCHE ENTRÉE DÉBLOQUÉ !';
    status.style.color = '#ffeb3b';
    const now = Date.now();
    const maxAttempts = 3 + templeExtraAttempts();
    while (S.games['flappy'].length < maxAttempts) S.games['flappy'].push(now);
    save();
    updateBtn();
    
    enterFrenzyCurrentMult = mult;
    enterPowerUntil = now + templeEnterDuration();
    enterFrenzyUntil = now + templeFrenzyDuration();
    celebrate();
    toast('⌨️', 'POUVOIR ACTIVÉ', `Maintenez ENTRÉE ! Frénésie ×${mult} pendant 30s !`);
  }
}
initFlappy();

/* =====================================================================
   TEMPLE DES LÉGENDES
   ===================================================================== */
const TEMPLE_UPGRADES = [
  { id: 'celestial_bowling', name: '🎳 Bowling Céleste', cost: 5, desc: 'Débloque le mini-jeu céleste de Bowling', apply: () => {} },
  { id: 'celestial_basketball', name: '🏀 Panier Céleste', cost: 5, desc: 'Débloque le mini-jeu céleste de Basketball', apply: () => {} },
  { id: 'celestial_football', name: '⚽ Tir au But', cost: 5, desc: 'Débloque le mini-jeu céleste de Football', apply: () => {} },
  { id: 'comp_trio',  name: '🛡️ Trio Légendaire',      cost: 15,  desc: 'Débloque un 3ème emplacement de compagnon actif (3 compagnons équipés)', apply: () => { if (typeof renderCompanions === 'function') renderCompanions(); if (typeof renderGachaPane === 'function') renderGachaPane(); recalc(); } },
  { id: 'keep_friend', name: '🤝 Conserver mes amis',   cost: 20,  desc: 'Permet de conserver au choix 1 compagnon lors de chaque Ascension', apply: () => {} },
  { id: 'esquive+',   name: '⚡ Esquive Augmentée',   cost: 5,   desc: '+1 essai/heure sur Esquive Laser (4 au lieu de 3)',   apply: () => {} },
  { id: 'power+',     name: '⏱️ Pouvoir Prolongé',     cost: 10,  desc: 'Le buff Touche Entrée dure 90s au lieu de 60s',       apply: () => {} },
  { id: 'frenzy+',    name: '🔥 Grande Frénésie',      cost: 20,  desc: 'Le bonus de la touche Entrée dure 45s au lieu de 30s',            apply: () => {} },
  { id: 'click+',     name: '👆 Prestige des Clics',   cost: 30,  desc: '+5% de puissance de clic permanente',                 apply: () => { recalc(); } },
  { id: 'prod+',      name: '🏭 Arsenal Cosmique',     cost: 50,  desc: '+10% de production globale permanente',               apply: () => { recalc(); } },
  { id: 'legend',     name: '👑 Légende Absolue',      cost: 100, desc: 'Toutes les améliorations ci-dessus sont doublées',    apply: () => { recalc(); } },
  { id: 'universal',  name: '🌌 Savoir Universel',     cost: 150, desc: '+15% de production globale permanente',               apply: () => { recalc(); } },
  { id: 'divine_clk', name: '✨ Clic Divin II',        cost: 150, desc: '+10% de puissance de clic permanente',                apply: () => { recalc(); } },
  { id: 'chrono',     name: '⏳ Chronomaître',         cost: 200, desc: 'Temps de recharge des jeux célestes divisé par 2',   apply: () => {} },
  { id: 'gold_luck',  name: '🍀 Chance Dorée',         cost: 250, desc: 'La pluie de cookies arrive beaucoup plus vite',              apply: () => {} },
];

// Temple bonuses applied in production calc
function templeClickBonus() {
  let mult = 1;
  if (S.temple && S.temple.includes('click+')) mult *= 1.05;
  if (S.temple && S.temple.includes('legend')) mult *= 1.05;
  if (S.temple && S.temple.includes('divine_clk')) mult *= 1.10;
  return mult;
}
function templeProdBonus() {
  let mult = 1;
  if (S.temple && S.temple.includes('prod+')) mult *= 1.10;
  if (S.temple && S.temple.includes('legend')) mult *= 1.10;
  if (S.temple && S.temple.includes('universal')) mult *= 1.15;
  return mult;
}
function templeEnterDuration() {
  let dur = 60000;
  if (S.temple && S.temple.includes('power+')) dur = 90000;
  if (S.temple && S.temple.includes('legend')) dur += 30000;
  return dur;
}
function templeFrenzyDuration() {
  let dur = 30000;
  if (S.temple && S.temple.includes('frenzy+')) dur = 45000;
  if (S.temple && S.temple.includes('legend')) dur += 15000;
  return dur;
}
function templeExtraAttempts() {
  let extra = 0;
  if (S.temple && S.temple.includes('esquive+')) extra += 1;
  if (S.temple && S.temple.includes('legend')) extra += 1;
  return extra;
}

function initTemple() {
  const chipsEl = document.getElementById('templeChips');
  const grid = document.getElementById('templeGrid');
  if (!S.temple) S.temple = [];

  function renderTemple() {
    const unlocked = window.__adminMode || S.bakedAll >= 25e9;
    if (!chipsEl || !grid) return;

    if (!unlocked) {
      const needed = 25e9 - S.bakedAll;
      const progress = Math.min(100, S.bakedAll / 25e9 * 100);
      chipsEl.textContent = '';
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:30px 10px;">
          <div style="font-size:60px; margin-bottom:10px; filter:grayscale(1) opacity(0.5);">🏆</div>
          <h4 style="color:#ffeb3b; margin-bottom:8px;">Temple verrouillé</h4>
          <p style="color:#ccc; margin-bottom:14px;">Cuisez <b style="color:#ffb347;">${fmt(needed)}</b> cookies de plus pour ouvrir le Temple des Légendes.</p>
          <div style="background:#0005; border-radius:8px; height:14px; overflow:hidden; margin:0 auto; max-width:300px;">
            <div style="height:100%; width:${progress.toFixed(1)}%; background:linear-gradient(90deg,#9b59b6,#ffeb3b); transition:width 0.5s;"></div>
          </div>
          <p style="color:#888; margin-top:8px; font-size:12px;">${progress.toFixed(1)}% accompli</p>
        </div>`;
      return;
    }

    chipsEl.textContent = '✨ Pépites célestes disponibles : ' + S.chips;
    grid.innerHTML = '';
    TEMPLE_UPGRADES.forEach(u => {
      const owned = S.temple.includes(u.id);
      const canAfford = S.chips >= u.cost;
      const card = document.createElement('div');
      card.style.cssText = `padding:14px; border-radius:12px; background:${owned ? 'linear-gradient(135deg,#2e1f5e,#4a2e0a)' : 'rgba(255,255,255,0.05)'}; border:1px solid ${owned ? '#9b59b6' : '#555'}; opacity:${owned || canAfford ? '1' : '0.5'};`;
      card.innerHTML = `<div style="font-size:20px; font-weight:900; color:${owned ? '#ffeb3b' : '#fff'}; margin-bottom:6px;">${u.name}</div>
        <div style="font-size:12px; color:#ccc; margin-bottom:10px;">${u.desc}</div>
        <div style="font-size:13px; color:#ffb347; margin-bottom:8px;">Coût : ${u.cost} pépite(s)</div>
        <button class="big-btn" data-temple="${u.id}" ${owned ? 'disabled' : ''} style="width:100%; font-size:13px; padding:8px;">${owned ? '✅ Acheté' : 'Acheter'}</button>`;
      grid.appendChild(card);
    });
    grid.querySelectorAll('[data-temple]').forEach(b => b.addEventListener('click', () => {
      const u = TEMPLE_UPGRADES.find(x => x.id === b.dataset.temple);
      if (!u || S.temple.includes(u.id) || S.chips < u.cost) return;
      S.chips -= u.cost;
      S.temple.push(u.id);
      u.apply();
      save();
      renderTemple();
      toast('🏆', 'Temple des Légendes', u.name + ' acheté !');
    }));
    if (typeof updateTempleAscensionInfo === 'function') updateTempleAscensionInfo();
  }

  renderTemple();
  document.getElementById('tabs').addEventListener('click', (e) => {
    if (e.target.closest('[data-tab]')?.dataset.tab === 'temple') renderTemple();
  });
  setInterval(() => {
    if (document.querySelector('[data-tab="temple"].on')) renderTemple();
  }, 5000);
}
initTemple();

// Temple Tabs logic
const tabTempleUps = document.getElementById('tabTempleUps');
const tabTempleAsc = document.getElementById('tabTempleAsc');
const templeTabUps = document.getElementById('templeTabUps');
const templeTabAsc = document.getElementById('templeTabAsc');

function updateTempleAscensionInfo() {
  const pot = chipsPotential(), g = Math.max(0, pot - S.chips);
  const nextTarget = Math.pow((pot + 1) * 2, 3) * 1.5e12 * Math.pow(2, S.ascensions);
  const ascInfo = document.getElementById('ascInfo');
  if (ascInfo) {
    ascInfo.innerHTML = (g > 0
      ? '<p style="color:#2ecc71;">Une ascension maintenant vous rapporterait <b>+' + g + '</b> pépite' + (g > 1 ? 's' : '') + ' (+' + g * 2 + ' % de prod).</p>'
      : '<p style="color:#a4b0be;">Prochaine pépite quand vous aurez cuit <b>' + fmt(nextTarget) + '</b> cookies.</p>');
  }
  const ascBtn = document.getElementById('ascBtn');
  if (ascBtn) ascBtn.disabled = g < 1;
}

if (tabTempleUps && tabTempleAsc) {
  tabTempleUps.addEventListener('click', () => {
    templeTabUps.style.display = 'block';
    templeTabAsc.style.display = 'none';
    tabTempleUps.style.filter = 'brightness(1.2)';
    tabTempleAsc.style.filter = 'brightness(0.8)';
  });
  tabTempleAsc.addEventListener('click', () => {
    templeTabUps.style.display = 'none';
    templeTabAsc.style.display = 'block';
    tabTempleUps.style.filter = 'brightness(0.8)';
    tabTempleAsc.style.filter = 'brightness(1.2)';
    document.getElementById('templeChipsCurrent').textContent = '✨ Pépites célestes actuelles : ' + S.chips;
    updateTempleAscensionInfo();
  });
}

// CELESTIAL GAMES LOGIC

function gameCelestialBowling(api, g) {
  let playing = false, angle = -90, dir = 1, speed = 2.5;
  let raf, animRaf;
  
  api.body.innerHTML = `<div class="game-bowling" style="background:#1a0f14; border-radius:12px; padding:20px; overflow:hidden;">
    <p class="game-hint" style="color:#ddd; margin-bottom:15px;">Arrêtez la flèche bien au centre pour un <b>Strike</b> !</p>
    
    <div class="celestial-3d-stage celestial-bowling-stage" style="position:relative; width:280px; height:350px; margin:0 auto 20px auto; background:linear-gradient(#2c1e16, #5c3a21); border-left:10px solid #111; border-right:10px solid #111; border-radius:5px; perspective:600px; overflow:hidden;" id="cBowlingAlley">
      <!-- Piste -->
      <div style="position:absolute; inset:0; background:repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 22px);"></div>
      
      <!-- Quilles -->
      <div id="cBowlingPins" style="position:absolute; top:30px; left:0; width:100%; height:60px; display:flex; justify-content:center; gap:8px; transition: 0.5s;">
        <span class="b-pin" style="font-size:32px; filter:drop-shadow(0 5px 2px rgba(0,0,0,0.5));">🥛</span>
        <span class="b-pin" style="font-size:32px; filter:drop-shadow(0 5px 2px rgba(0,0,0,0.5)); margin-top:-15px;">🥛</span>
        <span class="b-pin" style="font-size:32px; filter:drop-shadow(0 5px 2px rgba(0,0,0,0.5));">🥛</span>
      </div>
      
      <!-- Boule (Cookie) -->
      <div id="cBowlingBall" style="position:absolute; bottom:20px; left:50%; width:40px; height:40px; margin-left:-20px; font-size:40px; line-height:40px; text-align:center; transition: all 1s cubic-bezier(0.1, 0.8, 0.3, 1); transform:translateZ(0);">🍪</div>
      
      <!-- Flèche de visée -->
      <div style="position:absolute; bottom:40px; left:50%; width:4px; height:80px; background:rgba(241, 196, 15, 0.8); transform-origin:bottom center; transform:translateX(-50%) rotate(-90deg); z-index:10;" id="cBowlingArrow">
        <div style="position:absolute; top:-5px; left:-8px; width:0; height:0; border-left:10px solid transparent; border-right:10px solid transparent; border-bottom:15px solid #f1c40f;"></div>
      </div>
    </div>
    
    <div style="text-align:center;">
      <button id="cBowlingBtn" class="big-btn" style="background:linear-gradient(135deg, #e74c3c, #c0392b); width:180px; font-size:18px;">LANCER</button>
    </div>
  </div>`;
  
  const arrow = api.body.querySelector('#cBowlingArrow');
  const btn = api.body.querySelector('#cBowlingBtn');
  const ball = api.body.querySelector('#cBowlingBall');
  const pinsArea = api.body.querySelector('#cBowlingPins');
  
  function runBowling() {
    angle += speed * dir;
    if (angle >= 90) { angle = 90; dir = -1; }
    if (angle <= -90) { angle = -90; dir = 1; }
    arrow.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    raf = requestAnimationFrame(runBowling);
  }
  
  btn.addEventListener('click', () => {
    if (!playing) {
      playing = true;
      btn.textContent = 'STOP';
      runBowling();
    } else {
      playing = false;
      cancelAnimationFrame(raf);
      btn.disabled = true;
      btn.textContent = '...';
      arrow.style.display = 'none';
      
      const diff = Math.abs(angle);
      let pins = 0;
      if (diff < 15) pins = 10;
      else if (diff < 30) pins = 7;
      else if (diff < 50) pins = 4;
      else if (diff < 70) pins = 1;
      else pins = 0;
      
      const targetX = (angle / 90) * 120;
      ball.style.transform = `translate3d(${targetX}px, -260px, 130px) scale(0.5)`;
      
      setTimeout(() => {
        if (pins === 10) {
          pinsArea.innerHTML = '<div style="font-size:36px; color:#f1c40f; font-weight:bold; text-shadow:0 0 10px #f1c40f; animation: pulse 0.5s infinite;">STRIKE !</div>';
          setTimeout(() => api.end(1, "Strike Céleste !"), 1500);
        } else if (pins > 0) {
          pinsArea.style.opacity = '0.5';
          pinsArea.style.transform = 'translateY(-20px) rotate(' + (angle) + 'deg)';
          setTimeout(() => api.end(pins/10, `${pins} quilles renversées`), 1500);
        } else {
          pinsArea.innerHTML = '<div style="font-size:24px; color:#aaa; margin-top:10px;">Gouttière...</div>';
          setTimeout(() => api.end(0, "Gouttière, la boule est tombée sur le côté."), 1500);
        }
      }, 1000);
    }
  });
  return () => { cancelAnimationFrame(raf); cancelAnimationFrame(animRaf); };
}

function gameCelestialBasketball(api, g) {
  let playing = false, hoopX = 0, hoopDir = 1, hoopSpeed = 2.5;
  let cookieY = 0;
  let raf, shootRaf;
  let tries = 3;
  let shooting = false;
  
  api.body.innerHTML = `<div class="game-basketball">
    <p class="game-hint">Tirez quand le panier est aligné avec le cookie. <span id="cBaskTries">${tries}</span> essais.</p>
    <div class="celestial-3d-stage celestial-basketball-stage" style="position:relative;width:100%;height:150px;background:#222;border:2px solid #e67e22;border-radius:10px;margin-bottom:10px;overflow:hidden;" id="cBaskArea">
      <div id="cHoop" style="position:absolute;top:10px;left:0;width:50px;height:15px;border:3px solid #e74c3c;border-radius:50%;box-shadow:0 10px 0 rgba(231,76,60,0.3);"></div>
      <div id="cBall" style="position:absolute;bottom:10px;left:50%;margin-left:-15px;width:30px;height:30px;font-size:24px;line-height:30px;text-align:center;">🍪</div>
    </div>
    <div style="text-align:center;">
      <button id="cBaskBtn" class="big-btn" style="background:linear-gradient(135deg, #e67e22, #d35400); width:150px;">Tirer</button>
    </div>
  </div>`;
  
  const hoop = api.body.querySelector('#cHoop');
  const ball = api.body.querySelector('#cBall');
  const btn = api.body.querySelector('#cBaskBtn');
  const triesTxt = api.body.querySelector('#cBaskTries');
  const areaW = api.body.querySelector('#cBaskArea').clientWidth;
  
  function runHoop() {
    hoopX += hoopSpeed * hoopDir;
    if (hoopX >= areaW - 56) { hoopX = areaW - 56; hoopDir = -1; }
    if (hoopX <= 0) { hoopX = 0; hoopDir = 1; }
    hoop.style.left = hoopX + 'px';
    raf = requestAnimationFrame(runHoop);
  }
  
  playing = true;
  runHoop();
  
  btn.addEventListener('click', () => {
    if (!playing || shooting || tries <= 0) return;
    shooting = true;
    cookieY = 0;
    
    function animateShoot() {
      cookieY += 8;
      const shotDepth = Math.min(90, cookieY * 0.65);
      const shotScale = Math.max(0.55, 1 - cookieY / 330);
      ball.style.bottom = (10 + cookieY) + 'px';
      ball.style.transform = `translateZ(${shotDepth}px) scale(${shotScale})`;
      
      if (cookieY > 110) { // reached hoop level
        const ballCenter = (areaW / 2);
        const hoopCenter = hoopX + 28;
        if (Math.abs(ballCenter - hoopCenter) < 40) { // scored!
          playing = false;
          ball.innerHTML = '✨';
          setTimeout(() => api.end(1, 'Bien joué !'), 1500);
          return;
        } else if (cookieY > 150) { // missed
          tries--;
          triesTxt.textContent = tries;
          if (tries <= 0) {
            playing = false;
            btn.textContent = 'Terminé';
            btn.disabled = true;
            setTimeout(() => api.end(0, "Plus d'essais..."), 1500);
          } else {
            shooting = false;
            ball.style.bottom = '10px';
            ball.style.transform = 'translateZ(0) scale(1)';
          }
          return;
        }
      }
      shootRaf = requestAnimationFrame(animateShoot);
    }
    animateShoot();
  });
  return () => { cancelAnimationFrame(raf); cancelAnimationFrame(shootRaf); };
}

function gameCelestialFootball(api, g) {
  let playing = false, gkX = 0, gkDir = 1, gkSpeed = 5.2;
  let cookieY = 0;
  let raf, shootRaf;
  let tries = 3;
  let shooting = false;
  
  api.body.innerHTML = `<div class="game-football">
    <p class="game-hint">Marquez le penalty en évitant le verre de lait. <span id="cFooTries">${tries}</span> essais.</p>
    <div class="celestial-3d-stage celestial-football-stage" style="position:relative;width:100%;height:150px;background:#2ecc71;border:2px solid #27ae60;border-radius:10px;margin-bottom:10px;overflow:hidden;" id="cFooArea">
      <div style="position:absolute;top:0;left:10%;width:80%;height:20px;border-bottom:3px solid #fff;border-left:3px solid #fff;border-right:3px solid #fff;box-sizing:border-box;"></div>
      <div id="cGk" style="position:absolute;top:20px;left:0;width:30px;height:40px;font-size:30px;text-align:center;line-height:40px;">🥛</div>
      <div id="cBallFoo" style="position:absolute;bottom:10px;left:50%;margin-left:-15px;width:30px;height:30px;font-size:24px;line-height:30px;text-align:center;">🍪</div>
    </div>
    <div style="text-align:center;">
      <button id="cFooBtn" class="big-btn" style="background:linear-gradient(135deg, #27ae60, #2ecc71); width:150px;">Tirer</button>
    </div>
  </div>`;
  
  const gk = api.body.querySelector('#cGk');
  const ball = api.body.querySelector('#cBallFoo');
  const btn = api.body.querySelector('#cFooBtn');
  const triesTxt = api.body.querySelector('#cFooTries');
  const areaW = api.body.querySelector('#cFooArea').clientWidth;
  
  function runGk() {
    gkX += gkSpeed * gkDir;
    if (gkX >= areaW - 30) { gkX = areaW - 30; gkDir = -1; }
    if (gkX <= 0) { gkX = 0; gkDir = 1; }
    gk.style.left = gkX + 'px';
    raf = requestAnimationFrame(runGk);
  }
  
  playing = true;
  runGk();
  
  btn.addEventListener('click', () => {
    if (!playing || shooting || tries <= 0) return;
    shooting = true;
    cookieY = 0;
    
    function animateShoot() {
      cookieY += 8;
      const shotDepth = Math.min(110, cookieY * 0.85);
      const shotScale = Math.max(0.45, 1 - cookieY / 300);
      ball.style.bottom = (10 + cookieY) + 'px';
      ball.style.transform = `translateZ(${shotDepth}px) scale(${shotScale})`;
      
      if (cookieY > 80 && cookieY < 120) { // ball reaching GK level
        const ballCenter = areaW / 2;
        const gkCenter = gkX + 15;
        if (Math.abs(ballCenter - gkCenter) < 26) { // the larger keeper has a real save zone
          tries--;
          triesTxt.textContent = tries;
          if (tries <= 0) {
            playing = false;
            btn.textContent = 'Terminé';
            btn.disabled = true;
            setTimeout(() => api.end(0, "Arrêt du gardien !"), 1500);
          } else {
            shooting = false;
            ball.style.bottom = '10px';
            ball.style.transform = 'translateZ(0) scale(1)';
          }
          return;
        }
      } else if (cookieY > 120) { // scored!
          playing = false;
          ball.innerHTML = '✨';
          setTimeout(() => api.end(1, 'Buuut !'), 1500);
          return;
      }
      shootRaf = requestAnimationFrame(animateShoot);
    }
    animateShoot();
  });
  return () => { cancelAnimationFrame(raf); cancelAnimationFrame(shootRaf); };
}


/* =====================================================================
   MACHINE À SOUS & COMPAGNONS (SYSTÈME COMPLET & INTUITIF)
   ===================================================================== */

/* Générateur visuel : Photos d'amis OU Cookie SVG vectoriel stylé */
function renderCompanionVisual(c, size = 50) {
  if (c.isFriend && c.img) {
    return `<img src="${c.img}" class="friend-photo-img" alt="${c.name}" style="width:100%; height:100%;">`;
  }
  
  const s = c.style || { c: ['#f6cd86', '#dc9a4f', '#a5602a'], chip: '#4b2411', edge: '#8a4c1c' };
  const gradId = 'c_grad_' + c.id;
  
  let extraSvg = '';
  if (s.isNinja) {
    extraSvg += `<rect x="15" y="40" width="70" height="18" rx="4" fill="#ff4757"/><circle cx="40" cy="49" r="3.5" fill="#fff"/><circle cx="60" cy="49" r="3.5" fill="#fff"/>`;
  } else if (s.isGhost) {
    extraSvg += `<circle cx="38" cy="42" r="5" fill="#22a6b3"/><circle cx="62" cy="42" r="5" fill="#22a6b3"/><ellipse cx="50" cy="62" rx="6" ry="9" fill="#22a6b3" opacity="0.6"/>`;
  } else if (s.isRobot) {
    extraSvg += `<rect x="28" y="36" width="16" height="12" rx="3" fill="#00d2d3"/><rect x="56" y="36" width="16" height="12" rx="3" fill="#00d2d3"/><rect x="35" y="62" width="30" height="6" rx="2" fill="#2ed573"/><line x1="50" y1="12" x2="50" y2="24" stroke="#718093" stroke-width="4"/><circle cx="50" cy="10" r="5" fill="#ff4757"/>`;
  } else if (s.isAngel) {
    extraSvg += `<ellipse cx="50" cy="18" rx="28" ry="8" fill="none" stroke="#f9ca24" stroke-width="5" filter="drop-shadow(0 0 4px #f9ca24)"/><circle cx="38" cy="45" r="4" fill="#485460"/><circle cx="62" cy="45" r="4" fill="#485460"/>`;
  } else if (s.isDemon) {
    extraSvg += `<polygon points="20,25 32,38 18,45" fill="#ff3838"/><polygon points="80,25 68,38 82,45" fill="#ff3838"/><circle cx="38" cy="48" r="4.5" fill="#fed330"/><circle cx="62" cy="48" r="4.5" fill="#fed330"/>`;
  } else if (s.isKing || s.isEmperor) {
    extraSvg += `<polygon points="24,28 34,10 50,22 66,10 76,28" fill="#f9ca24" stroke="#e1b12c" stroke-width="2"/><circle cx="34" cy="10" r="3" fill="#eb4d4b"/><circle cx="50" cy="22" r="3" fill="#4cd137"/><circle cx="66" cy="10" r="3" fill="#eb4d4b"/>`;
  } else if (s.isSpace) {
    extraSvg += `<ellipse cx="50" cy="50" rx="32" ry="22" fill="#54a0ff" opacity="0.4" stroke="#70a1ff" stroke-width="3"/><polygon points="50,24 53,30 60,31 55,36 56,42 50,39 44,42 45,36 40,31 47,30" fill="#ffd32a"/>`;
  } else if (s.isKnight || s.isTemplar) {
    extraSvg += `<rect x="25" y="42" width="50" height="12" rx="3" fill="#2f3542"/><line x1="50" y1="25" x2="50" y2="75" stroke="#f1f2f6" stroke-width="3" opacity="0.7"/>`;
  } else if (s.isMagic || s.isAlchemist) {
    extraSvg += `<polygon points="50,15 54,26 65,27 57,34 59,45 50,40 41,45 43,34 35,27 46,26" fill="#ffd32a" filter="drop-shadow(0 0 5px #ffd32a)"/>`;
  } else if (s.isDragon) {
    extraSvg += `<polygon points="22,35 12,20 32,25" fill="#fed330"/><polygon points="78,35 88,20 68,25" fill="#fed330"/><circle cx="36" cy="48" r="5" fill="#fed330"/><circle cx="64" cy="48" r="5" fill="#fed330"/><polygon points="36,48 38,48 37,51" fill="#000"/><polygon points="64,48 66,48 65,51" fill="#000"/>`;
  } else if (s.isPirate) {
    extraSvg += `<polygon points="20,32 50,14 80,32 50,26" fill="#2c3e50"/><circle cx="50" cy="22" r="4" fill="#f1c40f"/><line x1="30" y1="36" x2="48" y2="56" stroke="#111" stroke-width="3"/><circle cx="42" cy="48" r="7" fill="#111"/>`;
  } else if (s.isStrawberry) {
    extraSvg += `<polygon points="50,8 44,20 56,20" fill="#4cd137"/><polygon points="40,12 36,22 48,20" fill="#4cd137"/><polygon points="60,12 64,22 52,20" fill="#4cd137"/>`;
  } else if (s.isButter) {
    extraSvg += `<rect x="35" y="35" width="30" height="24" rx="4" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>`;
  } else if (s.isSugar) {
    extraSvg += `<circle cx="45" cy="30" r="3" fill="#fff" opacity="0.8"/><circle cx="65" cy="45" r="2.5" fill="#fff" opacity="0.8"/><circle cx="30" cy="55" r="3" fill="#fff" opacity="0.8"/><circle cx="55" cy="65" r="2" fill="#fff" opacity="0.8"/>`;
  } else if (s.isCinnamon) {
    extraSvg += `<path d="M30 30 Q50 20 70 30 Q50 40 30 30" fill="none" stroke="#d35400" stroke-width="3"/><path d="M25 60 Q50 50 75 60" fill="none" stroke="#d35400" stroke-width="3"/>`;
  } else if (s.isOat) {
    extraSvg += `<ellipse cx="40" cy="35" rx="7" ry="4" fill="#f5cd79" transform="rotate(-30 40 35)"/><ellipse cx="60" cy="55" rx="7" ry="4" fill="#f5cd79" transform="rotate(30 60 55)"/><ellipse cx="35" cy="65" rx="7" ry="4" fill="#f5cd79"/>`;
  } else if (s.isSalt) {
    extraSvg += `<rect x="30" y="32" width="5" height="5" fill="#fff"/><rect x="65" y="36" width="5" height="5" fill="#fff"/><rect x="48" y="60" width="5" height="5" fill="#fff"/>`;
  } else if (s.isLemon) {
    extraSvg += `<path d="M35 30 A 20 20 0 0 1 65 30 Z" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>`;
  } else if (s.isNut) {
    extraSvg += `<circle cx="50" cy="45" r="14" fill="#d35400" stroke="#a04000" stroke-width="2"/><ellipse cx="50" cy="52" rx="10" ry="4" fill="#e67e22"/>`;
  } else if (s.isMiner) {
    extraSvg += `<path d="M30 25 L70 65 M70 25 L30 65" stroke="#7f8c8d" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="30" r="6" fill="#f1c40f"/>`;
  } else if (s.isBanker) {
    extraSvg += `<text x="50" y="58" font-size="28" font-weight="bold" fill="#2ecc71" text-anchor="middle" font-family="Arial">$</text>`;
  } else if (s.isArcade) {
    extraSvg += `<rect x="32" y="42" width="36" height="20" rx="4" fill="#2c3e50"/><circle cx="42" cy="52" r="4" fill="#e74c3c"/><rect x="54" y="48" width="8" height="8" fill="#3498db"/>`;
  } else if (s.isIce) {
    extraSvg += `<line x1="50" y1="20" x2="50" y2="80" stroke="#74b9ff" stroke-width="3"/><line x1="20" y1="50" x2="80" y2="50" stroke="#74b9ff" stroke-width="3"/><line x1="28" y1="28" x2="72" y2="72" stroke="#74b9ff" stroke-width="2"/><line x1="28" y1="72" x2="72" y2="28" stroke="#74b9ff" stroke-width="2"/>`;
  } else if (s.isDiamond) {
    extraSvg += `<polygon points="50,18 72,45 50,75 28,45" fill="#70a1ff" opacity="0.8" stroke="#ffffff" stroke-width="2"/>`;
  } else if (s.isVortex) {
    extraSvg += `<circle cx="50" cy="50" r="28" fill="none" stroke="#a29bfe" stroke-width="4" stroke-dasharray="8 6"/><circle cx="50" cy="50" r="14" fill="none" stroke="#6c5ce7" stroke-width="4" stroke-dasharray="6 4"/>`;
  } else if (s.isCyber) {
    extraSvg += `<rect x="25" y="30" width="50" height="40" rx="6" fill="none" stroke="#00d2d3" stroke-width="3"/><path d="M35 50 L45 50 L50 40 L55 60 L60 50 L65 50" fill="none" stroke="#00ff88" stroke-width="2.5"/>`;
  } else if (s.isNebula) {
    extraSvg += `<ellipse cx="50" cy="50" rx="35" ry="18" fill="none" stroke="#e056fd" stroke-width="3" transform="rotate(-25 50 50)" filter="drop-shadow(0 0 6px #e056fd)"/><circle cx="50" cy="50" r="6" fill="#ffbe76"/>`;
  } else if (s.isPhoenix) {
    extraSvg += `<path d="M20 60 Q50 10 80 60 Q50 45 20 60" fill="#ff3838" opacity="0.8"/><circle cx="50" cy="35" r="6" fill="#ffd32a" filter="drop-shadow(0 0 6px #ff9f43)"/>`;
  } else if (s.isChrono) {
    extraSvg += `<circle cx="50" cy="50" r="24" fill="none" stroke="#f1c40f" stroke-width="3.5"/><line x1="50" y1="50" x2="50" y2="34" stroke="#f1c40f" stroke-width="3" stroke-linecap="round"/><line x1="50" y1="50" x2="62" y2="50" stroke="#f1c40f" stroke-width="3" stroke-linecap="round"/>`;
  } else if (s.isTitan) {
    extraSvg += `<path d="M25 40 L50 20 L75 40 L65 75 L35 75 Z" fill="#2d3436" stroke="#e17055" stroke-width="3"/><circle cx="50" cy="45" r="8" fill="#e17055" filter="drop-shadow(0 0 5px #d63031)"/>`;
  } else if (s.isBlackHole) {
    extraSvg += `<circle cx="50" cy="50" r="28" fill="#050505" stroke="#ff4757" stroke-width="4" filter="drop-shadow(0 0 10px #ff4757)"/><circle cx="50" cy="50" r="16" fill="#000" stroke="#a55eea" stroke-width="2"/>`;
  } else if (s.isDivine) {
    extraSvg += `<circle cx="50" cy="50" r="30" fill="none" stroke="#f1c40f" stroke-width="3" filter="drop-shadow(0 0 8px #f1c40f)"/><polygon points="50,15 54,26 65,27 57,34 59,45 50,40 41,45 43,34 35,27 46,26" fill="#ffffff" filter="drop-shadow(0 0 5px #fff)"/><circle cx="50" cy="50" r="8" fill="#ffd32a"/>`;
  }

  return `<svg viewBox="0 0 100 100" class="cookie-svg-art" style="width:100%; height:100%;">
    <defs>
      <radialGradient id="${gradId}" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stop-color="${s.c[0]}"/>
        <stop offset="55%" stop-color="${s.c[1]}"/>
        <stop offset="100%" stop-color="${s.c[2]}"/>
      </radialGradient>
    </defs>
    <path d="M50 5 C75 3 98 25 96 52 C98 78 76 97 50 95 C24 97 2 78 4 52 C2 25 25 3 50 5 Z" fill="url(#${gradId})" stroke="${s.edge}" stroke-width="3.5"/>
    <g fill="${s.chip}">
      <circle cx="30" cy="32" r="5.5"/>
      <circle cx="68" cy="28" r="4.8"/>
      <circle cx="74" cy="58" r="5.8"/>
      <circle cx="34" cy="70" r="5.2"/>
      <circle cx="52" cy="48" r="4.2"/>
      ${s.extraChips ? '<circle cx="52" cy="74" r="5.2"/><circle cx="22" cy="52" r="4.5"/><circle cx="78" cy="42" r="4.2"/>' : ''}
      ${s.berryChips ? '<circle cx="46" cy="28" r="4" fill="#e84118"/><circle cx="62" cy="70" r="4" fill="#e84118"/>' : ''}
    </g>
    ${extraSvg}
  </svg>`;
}

function companionVal(cId) {
  if (typeof COMPANIONS === 'undefined' || !Array.isArray(COMPANIONS)) return 0;
  const c = COMPANIONS.find(x => x.id === cId);
  if (!c) return 0;
  if (!S.compData || !S.compData.levels) return c.powerBase;
  const lvl = S.compData.levels[cId] || 1;
  return c.powerBase + (lvl - 1) * c.powerStep;
}

function compHas(powerType) {
  if (typeof COMPANIONS === 'undefined' || !Array.isArray(COMPANIONS)) return 0;
  if (!S.compData || !S.compData.equipped) return 0;
  let total = 0;
  for (let id of S.compData.equipped) {
    if (!id) continue;
    const c = COMPANIONS.find(x => x.id === id);
    if (!c) continue;
    const val = companionVal(id);
    if (c.powerType === powerType) {
      total += val;
    } else if (c.powerType === 'divine_omni') {
      if (powerType === 'cps' || powerType === 'click' || powerType === 'all_buildings') {
        total += val;
      }
    } else if (c.powerType === 'chrono_master') {
      if (powerType === 'arcade_speed' || powerType === 'frenzy_dur' || powerType === 'golden_vision') {
        total += val;
      }
    }
  }
  return total;
}

function maxCompanionSlots() {
  return (S.temple && S.temple.includes('comp_trio')) ? 3 : 2;
}
window.maxCompanionSlots = maxCompanionSlots;

/* Affichage des compagnons sous le gros cookie principal (2 ou 3 slots interactifs avec + et tooltip soigné) */
function renderCompanions() {
  const ctn = document.getElementById('companions-container');
  if (!ctn) return;
  if (!S.compData) S.compData = { equipped: [], unlocked: [], shards: {}, levels: {}, pulls: 0, pityTracker: 0 };
  if (!Array.isArray(S.compData.equipped)) S.compData.equipped = [];

  const maxSlots = maxCompanionSlots();
  while (S.compData.equipped.length < maxSlots) S.compData.equipped.push(null);
  if (S.compData.equipped.length > maxSlots) S.compData.equipped = S.compData.equipped.slice(0, maxSlots);

  let html = '';
  
  for (let slotIdx = 0; slotIdx < maxSlots; slotIdx++) {
    const id = S.compData.equipped[slotIdx] || null;
    let slotLabel = '';
    let slotShort = '';
    let slotIcon = '🛡️';

    if (maxSlots === 2) {
      slotLabel = slotIdx === 0 ? 'Slot Gauche (1)' : 'Slot Droite (2)';
      slotShort = slotIdx === 0 ? 'Slot 1' : 'Slot 2';
      slotIcon = slotIdx === 0 ? '🛡️' : '⚔️';
    } else {
      if (slotIdx === 0) { slotLabel = 'Slot Gauche (1)'; slotShort = 'Slot 1'; slotIcon = '🛡️'; }
      else if (slotIdx === 1) { slotLabel = 'Slot Centre (2)'; slotShort = 'Slot 2'; slotIcon = '👑'; }
      else { slotLabel = 'Slot Droite (3)'; slotShort = 'Slot 3'; slotIcon = '⚔️'; }
    }
    
    if (id) {
      const c = COMPANIONS.find(x => x.id === id);
      if (c) {
        const val = Math.round(companionVal(id) * 100);
        const lvl = S.compData.levels[id] || 1;
        const friendClass = (c.isFriend && c.img) ? 'is-friend-photo' : '';
        const rarityInfo = RARITIES[c.rarity] || { name: c.rarity, color: '#bdc3c7' };
        
        html += `
          <div class="active-comp-wrapper" data-open-selector="${slotIdx}">
            <div class="active-comp-slot rarity-${c.rarity} ${friendClass}" data-open-selector="${slotIdx}">
              ${renderCompanionVisual(c, 54)}
              <span class="active-comp-lvl">Lvl ${lvl}</span>
            </div>
            <span class="active-comp-label" data-open-selector="${slotIdx}">${c.name.length > 12 ? c.name.slice(0, 11) + '…' : c.name}</span>
            
            <!-- Tooltip survol élégant et design -->
            <div class="comp-hover-tooltip rarity-${c.rarity}">
              <div class="comp-tooltip-header">
                <div class="comp-tooltip-name">${c.name}</div>
                <div class="comp-tooltip-rarity" style="color:${rarityInfo.color};">${rarityInfo.name} · Niv. ${lvl}</div>
              </div>
              <div class="comp-tooltip-slot">${slotIcon} ${slotLabel}</div>
              <div class="comp-tooltip-power">⚡ ${c.desc.replace('{val}', `<span class="comp-tooltip-val">+${val}%</span>`)}</div>
              <div class="comp-tooltip-hint">👉 Cliquer pour modifier ou retirer</div>
            </div>
          </div>
        `;
      }
    } else {
      // Slot vide avec le "+"
      html += `
        <div class="active-comp-wrapper" data-open-selector="${slotIdx}">
          <div class="active-comp-slot empty" data-open-selector="${slotIdx}">
            <span class="slot-plus-icon" data-open-selector="${slotIdx}">+</span>
          </div>
          <span class="active-comp-label" style="color:#747d8c;" data-open-selector="${slotIdx}">${slotShort}</span>
          
          <div class="comp-hover-tooltip empty-tooltip">
            <div class="comp-tooltip-name">${slotIcon} Emplacement ${slotShort} vide</div>
            <div class="comp-tooltip-hint">👉 Cliquer pour choisir un compagnon</div>
          </div>
        </div>
      `;
    }
  }
  
  ctn.innerHTML = html;
}

/* Modal Sélecteur de compagnon en cliquant sur un slot */
window.openCompanionSelector = function(slotIdx) {
  slotIdx = parseInt(slotIdx, 10);
  if (!S.compData) S.compData = { equipped: [], unlocked: [], shards: {}, levels: {}, pulls: 0, pityTracker: 0 };
  
  const maxSlots = maxCompanionSlots();
  let slotName = '';
  if (maxSlots === 2) {
    slotName = slotIdx === 0 ? 'Emplacement 1 (Gauche)' : 'Emplacement 2 (Droite)';
  } else {
    slotName = slotIdx === 0 ? 'Emplacement 1 (Gauche)' : (slotIdx === 1 ? 'Emplacement 2 (Centre)' : 'Emplacement 3 (Droite)');
  }

  const currentEquippedId = S.compData.equipped[slotIdx] || null;
  const unlocked = S.compData.unlocked || [];
  
  current = { ended: true, api: { frac: 0 } };
  mInfo.textContent = '';
  
  let modalHtml = `
    <div style="padding:15px; text-align:center;">
      <h2 style="color:#f1c40f; margin-bottom:6px;">🛡️ Sélectionner pour ${slotName}</h2>
      <p style="font-size:13px; color:#a4b0be; margin-bottom:15px;">Choisissez le compagnon que vous souhaitez équiper sur cet emplacement.</p>
  `;
  
  if (currentEquippedId) {
    modalHtml += `
      <div style="margin-bottom:15px;">
        <button class="big-btn" data-unequip-slot="${slotIdx}" style="background:#ff4757; font-size:13px; padding:6px 14px;">
          ✕ Retirer le compagnon actuel
        </button>
      </div>
    `;
  }
  
  if (unlocked.length === 0) {
    modalHtml += `
      <div style="padding:30px; color:#747d8c; font-size:14px;">
        <div style="font-size:40px; margin-bottom:10px;">👥</div>
        Vous n'avez pas encore débloqué de compagnons.<br>
        Rendez-vous dans l'onglet <b>Compagnons</b> pour effectuer vos premiers tirages !
      </div>
    `;
  } else {
    modalHtml += `<div class="selector-comp-grid">`;
    for (let id of unlocked) {
      const c = COMPANIONS.find(x => x.id === id);
      if (!c) continue;
      const lvl = S.compData.levels[id] || 1;
      const isHere = S.compData.equipped[slotIdx] === id;
      const otherSlotIndex = S.compData.equipped.findIndex((eqId, idx) => idx !== slotIdx && eqId === id);
      const isOther = otherSlotIndex !== -1;
      const val = Math.round(companionVal(id) * 100);
      const friendClass = (c.isFriend && c.img) ? 'is-friend-photo' : '';
      
      modalHtml += `
        <div class="selector-comp-card rarity-${c.rarity} ${isHere ? 'active-slot' : ''}" data-equip-id="${c.id}" data-equip-slot="${slotIdx}">
          <div style="width:48px; height:48px; margin-bottom:6px; pointer-events:none;" class="${friendClass}">
            ${renderCompanionVisual(c, 48)}
          </div>
          <b style="font-size:12px; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; pointer-events:none;">${c.name}</b>
          <span style="font-size:10px; color:${RARITIES[c.rarity].color}; font-weight:bold; pointer-events:none;">${RARITIES[c.rarity].name} · Lvl ${lvl}</span>
          <span style="font-size:10px; color:#2ed573; margin-top:3px; line-height:1.2; pointer-events:none;">+${val}%</span>
          <span style="font-size:9px; margin-top:5px; font-weight:bold; color:${isHere ? '#2ed573' : (isOther ? '#ffa502' : '#70a1ff')}; pointer-events:none;">
            ${isHere ? '✓ Équipé ici' : (isOther ? `⇄ Slot ${otherSlotIndex + 1}` : '👉 Choisir')}
          </span>
        </div>
      `;
    }
    modalHtml += `</div>`;
  }
  
  modalHtml += `
      <div style="margin-top:15px;">
        <button class="big-btn" onclick="closeModal()" style="width:160px; font-size:13px;">Fermer</button>
      </div>
    </div>
  `;
  
  mBody.innerHTML = modalHtml;
  modal.classList.add('on');
};

/* Grand Pop-up Modal de Victoire après un tirage Gacha */
function showGachaWinModal(result, isNew) {
  current = { ended: true, api: { frac: 0 } };
  mInfo.textContent = '';
  
  const val = Math.round(companionVal(result.id) * 100);
  const lvl = (S.compData && S.compData.levels && S.compData.levels[result.id]) || 1;
  const shards = (S.compData && S.compData.shards && S.compData.shards[result.id]) || 0;
  const friendClass = (result.isFriend && result.img) ? 'is-friend' : '';
  const rarityInfo = RARITIES[result.rarity] || { name: result.rarity, color: '#bdc3c7' };
  const maxSlots = maxCompanionSlots();
  
  let equipButtonsHtml = '';
  if (maxSlots === 2) {
    equipButtonsHtml = `
      <button class="big-btn" data-equip-id="${result.id}" data-equip-slot="0" style="background:#2f3542; border:1px solid #57606f; font-size:12px; padding:10px 6px;">
        🛡️ Équiper Slot G
      </button>
      <button class="big-btn" data-equip-id="${result.id}" data-equip-slot="1" style="background:#2f3542; border:1px solid #57606f; font-size:12px; padding:10px 6px;">
        ⚔️ Équiper Slot D
      </button>
    `;
  } else {
    equipButtonsHtml = `
      <button class="big-btn" data-equip-id="${result.id}" data-equip-slot="0" style="background:#2f3542; border:1px solid #57606f; font-size:11px; padding:8px 4px;">
        🛡️ Slot G
      </button>
      <button class="big-btn" data-equip-id="${result.id}" data-equip-slot="1" style="background:#2f3542; border:1px solid #57606f; font-size:11px; padding:8px 4px;">
        👑 Slot C
      </button>
      <button class="big-btn" data-equip-id="${result.id}" data-equip-slot="2" style="background:#2f3542; border:1px solid #57606f; font-size:11px; padding:8px 4px;">
        ⚔️ Slot D
      </button>
    `;
  }
  
  mBody.innerHTML = `
    <div class="gacha-win-content">
      <h2 style="margin:0 0 10px; font-size:22px; color:${isNew ? '#2ecc71' : '#f1c40f'};">
        ${isNew ? '🎉 NOUVEAU COMPAGNON !' : '✨ DOUBLON (ÉCLAT GAGNÉ) !'}
      </h2>
      
      <div class="gacha-win-visual rarity-${result.rarity} ${friendClass}">
        ${renderCompanionVisual(result, 94)}
      </div>
      
      <div class="gacha-win-title" style="color:#fff;">${result.name}</div>
      <div class="gacha-win-rarity" style="background:${rarityInfo.color}22; color:${rarityInfo.color}; border:1px solid ${rarityInfo.color};">
        ${rarityInfo.name} · Niveau ${lvl}
      </div>
      
      <div class="gacha-win-power">
        <b>⚡ Pouvoir actif :</b><br>
        ${result.desc.replace('{val}', val)}
      </div>
      
      ${!isNew ? `<p style="font-size:12px; color:#70a1ff; margin-bottom:15px;">💎 Vous avez maintenant <b>${shards} éclat(s)</b> pour améliorer ce compagnon.</p>` : ''}
      
      <div class="gacha-win-actions">
        <div class="gacha-win-equip-duo">
          ${equipButtonsHtml}
        </div>
        <button class="big-btn" onclick="closeModal()" style="font-size:14px; padding:10px;">
          ✓ Super !
        </button>
      </div>
    </div>
  `;
  
  modal.classList.add('on');
  celebrate();
}

function gachaCost(count = 1) {
  const pulls = (S.compData && S.compData.pulls) || 0;
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.max(7500, cps() * 55) * Math.pow(1.035, pulls + i);
  }
  if (count >= 10) total *= 0.88;
  return Math.ceil(total);
}

/* Roulette / Tirage de Compagnons ultra-fluide avec Tirage x1 et Tirage x10 */
let isGachaSpinning = false;

function buildInitialReelHtml() {
  let h = '';
  for (let i = 0; i < 20; i++) {
    const c = COMPANIONS[i % COMPANIONS.length];
    h += `<div class="gacha-item rarity-${c.rarity}">${renderCompanionVisual(c, 70)}</div>`;
  }
  return h;
}

function showGachaMultiWinModal(results) {
  current = { ended: true, api: { frac: 0 } };
  mInfo.textContent = '';
  
  const newCount = results.filter(r => r.isNew).length;
  const shardCount = results.length - newCount;
  const hasMythicOrLegendary = results.some(r => r.comp.rarity === 'mythique' || r.comp.rarity === 'legendaire');
  
  let gridHtml = '<div class="gacha-multi-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(120px, 1fr)); gap:10px; max-height:420px; overflow-y:auto; padding:10px 4px; margin:14px 0;">';
  
  for (let r of results) {
    const c = r.comp;
    const val = Math.round(companionVal(c.id) * 100);
    const friendClass = (c.isFriend && c.img) ? 'is-friend' : '';
    const rarityInfo = RARITIES[c.rarity] || { name: c.rarity, color: '#bdc3c7' };
    
    gridHtml += `
      <div class="gacha-multi-card rarity-${c.rarity} ${friendClass}" style="background:rgba(20,20,30,0.85); border:2px solid ${rarityInfo.color}; border-radius:12px; padding:10px 6px; text-align:center; position:relative; box-shadow:0 4px 10px rgba(0,0,0,0.4); display:flex; flex-direction:column; align-items:center; justify-content:space-between; cursor:pointer;" data-comp-detail="${c.id}">
        ${r.isNew ? '<span style="position:absolute; top:-7px; left:50%; transform:translateX(-50%); background:#2ecc71; color:white; font-size:9px; font-weight:bold; padding:2px 6px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.5); z-index:2; white-space:nowrap;">NOUVEAU</span>' : '<span style="position:absolute; top:-7px; left:50%; transform:translateX(-50%); background:#3498db; color:white; font-size:9px; font-weight:bold; padding:2px 6px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.5); z-index:2; white-space:nowrap;">+1 ÉCLAT</span>'}
        <div style="width:52px; height:52px; margin:6px auto 4px; border-radius:50%; overflow:hidden; display:flex; align-items:center; justify-content:center;">
          ${renderCompanionVisual(c, 52)}
        </div>
        <div style="font-weight:bold; font-size:11px; color:#fff; margin:2px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${c.name}">${c.name}</div>
        <div style="font-size:10px; color:${rarityInfo.color}; font-weight:bold;">${rarityInfo.name}</div>
        <div style="font-size:9.5px; color:#a4b0be; margin-top:3px; line-height:1.2;">+${val}%</div>
      </div>
    `;
  }
  gridHtml += '</div>';
  
  mBody.innerHTML = `
    <div style="padding:10px 12px; text-align:center;">
      <h2 style="margin:0 0 5px; font-size:22px; color:#f1c40f;">👥 Tirage x10 - Résultats !</h2>
      <p style="font-size:13px; color:#dfe4ea; margin:0 0 10px;">
        🎉 <b>${newCount}</b> nouveau(x) compagnon(s) · 💎 <b>${shardCount}</b> éclat(s) de doublon(s)<br>
        <i>(Cliquez sur une carte pour voir les détails)</i>
      </p>
      
      ${gridHtml}
      
      <div style="display:flex; justify-content:center; gap:12px; margin-top:15px; flex-wrap:wrap;">
        <button class="big-btn" onclick="closeModal()" style="min-width:140px; font-size:14px; padding:10px 18px;">
          ✓ Super !
        </button>
        <button class="big-btn" id="btnMultiSpinAgain" ${S.cookies < gachaCost(10) ? 'disabled' : ''} onclick="closeModal(); spinGacha(10);" style="min-width:180px; font-size:14px; padding:10px 18px; background:linear-gradient(135deg, #e67e22, #f39c12);">
          ✨ Retirer x10 ( ${fmt(gachaCost(10))} 🍪 )
        </button>
      </div>
    </div>
  `;
  
  modal.classList.add('on');
  if (hasMythicOrLegendary || newCount > 0) celebrate();
}

function spinGacha(count = 1) {
  if (isGachaSpinning) return;
  count = count === 10 ? 10 : 1;
  const cost = gachaCost(count);
  if (S.cookies < cost) {
    toast('❌', 'Fonds insuffisants', 'Il vous faut ' + fmt(cost) + ' cookies pour ' + (count > 1 ? count + ' tirages.' : 'un tirage.'));
    return;
  }
  
  const reel = document.getElementById('gachaReel');
  const container = document.querySelector('.gacha-reel-container');
  const btn1 = document.getElementById('btnSpinGacha');
  const btn10 = document.getElementById('btnSpinGacha10');
  
  if (!reel || !container) return;
  
  S.cookies -= cost;
  if (!S.compData) S.compData = { unlocked: [], equipped: [], shards: {}, levels: {}, pulls: 0, pityTracker: 0 };
  
  isGachaSpinning = true;
  if (btn1) { btn1.disabled = true; btn1.textContent = '👥 Tirage...'; }
  if (btn10) { btn10.disabled = true; btn10.textContent = '✨ Tirage...'; }
  
  function rollOneCompanion() {
    S.compData.pulls = (S.compData.pulls || 0) + 1;
    S.compData.pityTracker = (S.compData.pityTracker || 0) + 1;
    
    let rVal = Math.random() * 100;
    let rarity = 'commun';
    
    if (S.compData.pityTracker >= 20) {
      S.compData.pityTracker = 0;
      const highRoll = Math.random() * 10;
      if (highRoll < 8.0) rarity = 'epique';
      else if (highRoll < 9.8) rarity = 'legendaire';
      else rarity = 'mythique';
    } else {
      let acc = 0;
      for (let k in RARITIES) {
        acc += RARITIES[k].prob;
        if (rVal <= acc) { rarity = k; break; }
      }
    }
    
    const possible = COMPANIONS.filter(c => c.rarity === rarity);
    const chosen = possible[Math.floor(Math.random() * possible.length)] || COMPANIONS[0];
    
    let isNew = false;
    if (!S.compData.unlocked.includes(chosen.id)) {
      isNew = true;
      S.compData.unlocked.push(chosen.id);
      S.compData.levels[chosen.id] = 1;
    } else {
      S.compData.shards[chosen.id] = (S.compData.shards[chosen.id] || 0) + 1;
    }
    return { comp: chosen, isNew };
  }
  
  if (count === 1) {
    const res = rollOneCompanion();
    const result = res.comp;
    const isNew = res.isNew;
    
    // Animation très rapide (~1.2 secondes)
    const totalItems = 30;
    const targetIndex = 22;
    let reelHtml = '';
    
    for (let i = 0; i < totalItems; i++) {
      const itemComp = (i === targetIndex) ? result : COMPANIONS[Math.floor(Math.random() * COMPANIONS.length)];
      reelHtml += `
        <div class="gacha-item rarity-${itemComp.rarity}" data-idx="${i}">
          ${renderCompanionVisual(itemComp, 70)}
        </div>
      `;
    }
    reel.innerHTML = reelHtml;
    
    const itemStep = 92;
    const containerWidth = container.clientWidth || 500;
    const targetOffset = (targetIndex * itemStep) + (itemStep / 2) - (containerWidth / 2);
    
    reel.style.transition = 'none';
    reel.style.transform = 'translateX(0px)';
    void reel.offsetWidth;
    
    requestAnimationFrame(() => {
      setTimeout(() => {
        reel.style.transition = 'transform 1.2s cubic-bezier(0.12, 0.85, 0.25, 1)';
        reel.style.transform = `translateX(-${targetOffset}px)`;
      }, 20);
    });
    
    setTimeout(() => {
      isGachaSpinning = false;
      const winnerEl = reel.querySelector(`[data-idx="${targetIndex}"]`);
      if (winnerEl) winnerEl.classList.add('is-winner');
      
      if (isNew) {
        toast('🎉', 'Nouveau Compagnon !', `${result.name} (${RARITIES[result.rarity].name}) a rejoint votre équipe !`);
      } else {
        toast('✨', 'Doublon obtenu !', `+1 Éclat pour ${result.name}`);
      }
      
      save();
      recalc();
      renderCompanions();
      renderGachaPane();
      
      setTimeout(() => {
        showGachaWinModal(result, isNew);
      }, 100);
    }, 1250);
  } else {
    // Tirage x10 ultra rapide (~0.7s)
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(rollOneCompanion());
    }
    
    const totalItems = 25;
    let reelHtml = '';
    for (let i = 0; i < totalItems; i++) {
      const itemComp = COMPANIONS[Math.floor(Math.random() * COMPANIONS.length)];
      reelHtml += `
        <div class="gacha-item rarity-${itemComp.rarity}">
          ${renderCompanionVisual(itemComp, 70)}
        </div>
      `;
    }
    reel.innerHTML = reelHtml;
    reel.style.transition = 'none';
    reel.style.transform = 'translateX(0px)';
    void reel.offsetWidth;
    
    requestAnimationFrame(() => {
      setTimeout(() => {
        reel.style.transition = 'transform 0.7s cubic-bezier(0.15, 0.85, 0.3, 1)';
        reel.style.transform = `translateX(-${totalItems * 65}px)`;
      }, 20);
    });
    
    setTimeout(() => {
      isGachaSpinning = false;
      save();
      recalc();
      renderCompanions();
      renderGachaPane();
      showGachaMultiWinModal(results);
    }, 750);
  }
}
window.spinGacha = spinGacha;

/* Système d'équipement multi-slots intuitif (2 ou 3 slots) */
function equipCompanionSlot(id, slotIndex) {
  slotIndex = parseInt(slotIndex, 10);
  const maxSlots = maxCompanionSlots();
  if (slotIndex < 0 || slotIndex >= maxSlots) slotIndex = 0;

  if (!S.compData) S.compData = { equipped: [], unlocked: [], shards: {}, levels: {}, pulls: 0, pityTracker: 0 };
  if (!Array.isArray(S.compData.equipped)) S.compData.equipped = [];
  while (S.compData.equipped.length < maxSlots) S.compData.equipped.push(null);
  
  let slotTxt = `Slot ${slotIndex + 1}`;
  if (maxSlots === 2) {
    slotTxt = (slotIndex === 0) ? 'Slot Gauche (1)' : 'Slot Droite (2)';
  } else {
    slotTxt = (slotIndex === 0) ? 'Slot Gauche (1)' : (slotIndex === 1 ? 'Slot Centre (2)' : 'Slot Droite (3)');
  }

  if (S.compData.equipped[slotIndex] === id) {
    // Si déjà équipé sur ce slot -> déséquiper
    S.compData.equipped[slotIndex] = null;
    toast('🛡️', 'Compagnon retiré', `Emplacement ${slotTxt} libéré.`);
  } else {
    // Si le compagnon était dans un autre slot, le déplacer
    for (let i = 0; i < maxSlots; i++) {
      if (i !== slotIndex && S.compData.equipped[i] === id) {
        S.compData.equipped[i] = null;
      }
    }
    S.compData.equipped[slotIndex] = id;
    const c = COMPANIONS.find(x => x.id === id);
    const name = c ? c.name : id;
    toast('🛡️', 'Compagnon équipé !', `${name} placé au ${slotTxt}.`);
  }
  
  save();
  recalc();
  renderCompanions();
  renderGachaPane();
}
window.equipCompanionSlot = equipCompanionSlot;

function unequipCompanionSlot(slotIndex) {
  slotIndex = parseInt(slotIndex, 10);
  if (!S.compData || !S.compData.equipped) return;
  if (Array.isArray(S.compData.equipped) && S.compData.equipped.length > slotIndex) {
    S.compData.equipped[slotIndex] = null;
  }
  toast('🛡️', 'Compagnon retiré', 'Emplacement libéré.');
  save();
  recalc();
  renderCompanions();
  renderGachaPane();
}
window.unequipCompanionSlot = unequipCompanionSlot;

function renderEquippedCompanions() {
  renderCompanions();
}
window.renderEquippedCompanions = renderEquippedCompanions;

function upgradeCompanion(id) {
  if (!S.compData) return;
  const currentLvl = S.compData.levels[id] || 1;
  const cost = currentLvl;
  const shards = S.compData.shards[id] || 0;
  
  if (shards >= cost) {
    S.compData.shards[id] -= cost;
    S.compData.levels[id] = currentLvl + 1;
    const c = COMPANIONS.find(x => x.id === id);
    toast('⚡', 'Niveau Supérieur !', `${c.name} passe au niveau ${S.compData.levels[id]} !`);
    celebrate();
    save();
    recalc();
    renderCompanions();
    renderGachaPane();
  } else {
    toast('ℹ️', 'Éclats insuffisants', `Il vous faut ${cost} éclat(s) pour améliorer ce compagnon.`);
  }
}
window.upgradeCompanion = upgradeCompanion;

let currentRarityFilter = 'all';

function renderGachaPane() {
  const pane = document.getElementById('gachaPane');
  if (!pane) return;
  
  if (!S.compData) S.compData = { unlocked: [], equipped: [], shards: {}, levels: {}, pulls: 0, pityTracker: 0 };
  
  if (S.ascensions === 0 && !window.__adminMode) {
    pane.innerHTML = `
      <div class="gacha-locked">
        <div class="lock-icon">🔒</div>
        <h2>MACHINE À SOUS VERROUILLÉE</h2>
        <p>Effectuez votre première Ascension pour débloquer la Machine à sous et recruter vos compagnons.</p>
      </div>
    `;
    return;
  }
  
  const pityLeft = Math.max(0, 20 - (S.compData.pityTracker || 0));
  const maxSlots = maxCompanionSlots();
  
  let html = `
    <div class="gacha-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <div>
        <h3 style="display:flex; align-items:center; gap:10px; margin:0;">
          👥 Compagnons
          <button style="background:#3498db; border:none; border-radius:50%; width:24px; height:24px; color:white; font-weight:bold; cursor:pointer; font-size:14px; box-shadow:0 2px 5px rgba(0,0,0,0.4);" onclick="showGachaInfo()" title="Guide des compagnons">?</button>
        </h3>
        <p style="margin:4px 0 0; color:#a4b0be; font-size:13px;">Tirez et recrutez des compagnons légendaires !</p>
      </div>
      <div style="text-align:right;">
        <span style="background:rgba(235, 77, 75, 0.2); border:1px solid #eb4d4b; color:#ff7979; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:bold;">
          🛡️ Garantie Épique+ dans : <b>${pityLeft}</b> tirage${pityLeft > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  `;
  
  // Machine à sous
  html += `
    <div class="gacha-machine">
      <div class="gacha-reel-container">
        <div class="gacha-pointer-center"></div>
        <div class="gacha-reel" id="gachaReel">
          ${buildInitialReelHtml()}
        </div>
      </div>
      <div class="gacha-actions-row" style="display:flex; justify-content:center; gap:12px; margin-top:14px; flex-wrap:wrap;">
        <button class="big-btn" id="btnSpinGacha" ${isGachaSpinning || S.cookies < gachaCost(1) ? 'disabled' : ''} style="min-width:180px; font-size:15px; padding:12px 18px;">
          ${isGachaSpinning ? '👥 Tirage en cours...' : `👥 Tirer x1 ( ${fmt(gachaCost(1))} 🍪 )`}
        </button>
        <button class="big-btn" id="btnSpinGacha10" ${isGachaSpinning || S.cookies < gachaCost(10) ? 'disabled' : ''} style="min-width:210px; font-size:15px; padding:12px 18px; background:linear-gradient(135deg, #e67e22, #f39c12); box-shadow:0 4px 15px rgba(243,156,18,0.4);">
          ${isGachaSpinning ? '👥 Tirage en cours...' : `✨ Tirer x10 ( ${fmt(gachaCost(10))} 🍪 )`}
        </button>
      </div>
      <div style="margin-top:14px; font-size:12px; color:#ced6e0; display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
        <b style="color:#a4b0be;">Taux :</b>
        <span style="color:#bdc3c7;">Commun (52.05%)</span> ·
        <span style="color:#2ecc71;">Peu commun (26%)</span> ·
        <span style="color:#3498db;">Rare (14%)</span> ·
        <span style="color:#9b59b6;">Épique (6.2%)</span> ·
        <span style="color:#f1c40f;">Légendaire (1.7%)</span> ·
        <span style="color:#ff4757; font-weight:bold;">Mythique (0.05% 🌟)</span>
      </div>
    </div>
    
    <!-- Ligne d'explication des Éclats -->
    <div style="background: rgba(112, 161, 255, 0.1); border: 1px solid rgba(112, 161, 255, 0.35); border-radius: 12px; padding: 12px 16px; margin-bottom: 22px; font-size: 13px; color: #dfe4ea; text-align: left; display: flex; align-items: center; gap: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
      <div style="font-size: 26px; flex-shrink: 0;">💎</div>
      <div>
        <b style="color: #70a1ff; font-size: 13.5px;">C'est quoi les Éclats ?</b><br>
        Lorsque vous obtenez un compagnon que vous possédez déjà (<span style="color:#ffa502;">doublon</span>), vous recevez <b>+1 Éclat</b> de ce compagnon. Les Éclats servent à <b>augmenter son Niveau</b> pour multiplier encore plus la puissance de ses bonus !
      </div>
    </div>
  `;
  
  // Section Compagnons Actifs (Duo ou Trio)
  let activeSlotsHtml = '';
  for (let sIdx = 0; sIdx < maxSlots; sIdx++) {
    const sId = S.compData.equipped[sIdx] || null;
    const cObj = sId ? COMPANIONS.find(x => x.id === sId) : null;
    
    let sTitle = '';
    let sIcon = '🛡️';
    let sBtnTag = 'Slot G';
    if (maxSlots === 2) {
      sTitle = sIdx === 0 ? 'Emplacement 1 (Gauche)' : 'Emplacement 2 (Droite)';
      sIcon = sIdx === 0 ? '🛡️' : '⚔️';
      sBtnTag = sIdx === 0 ? 'Slot G' : 'Slot D';
    } else {
      if (sIdx === 0) { sTitle = 'Emplacement 1 (Gauche)'; sIcon = '🛡️'; sBtnTag = 'Slot G'; }
      else if (sIdx === 1) { sTitle = 'Emplacement 2 (Centre)'; sIcon = '👑'; sBtnTag = 'Slot C'; }
      else { sTitle = 'Emplacement 3 (Droite)'; sIcon = '⚔️'; sBtnTag = 'Slot D'; }
    }

    activeSlotsHtml += `
      <div class="duo-slot-box ${cObj ? 'filled rarity-' + cObj.rarity : ''}">
        ${cObj ? `
          <div class="duo-slot-avatar">
            ${renderCompanionVisual(cObj, 48)}
          </div>
          <div class="duo-slot-info">
            <div class="duo-slot-header">
              <span class="duo-slot-name">${cObj.name}</span>
              <span style="font-size:11px; font-weight:bold; color:${RARITIES[cObj.rarity].color};">Lvl ${S.compData.levels[cObj.id] || 1}</span>
            </div>
            <div class="duo-slot-desc">⚡ ${cObj.desc.replace('{val}', Math.round(companionVal(cObj.id)*100))}</div>
          </div>
          <button class="btn-unequip-slot" data-unequip-slot="${sIdx}" title="Retirer">✕</button>
        ` : `
          <div style="font-size:24px; color:#57606f; margin-left:6px;">${sIcon}</div>
          <div class="duo-slot-empty-text">
            <b>${sTitle}</b><br>
            <span style="font-size:11px; color:#747d8c;">Cliquez sur [${sIcon} ${sBtnTag}] sur un compagnon ci-dessous.</span>
          </div>
        `}
      </div>
    `;
  }

  html += `
    <div class="active-duo-section">
      <div class="active-duo-title">
        <span>⚔️ Vos ${maxSlots} Compagnons Actifs (${maxSlots === 3 ? 'Trio Équipé' : 'Duo Équipé'})</span>
        <small style="color:#a4b0be; font-size:12px; font-weight:normal;">
          ${maxSlots === 2 ? '(Débloquez un 3ème slot au Temple des Légendes !)' : 'Les 3 bonus se cumulent !'}
        </small>
      </div>
      <div class="active-duo-grid">
        ${activeSlotsHtml}
      </div>
    </div>
  `;
  
  // Section Collection
  const unlockedCount = S.compData.unlocked.length;
  html += `
    <div class="collection-section-header">
      <h3 style="margin:0;">Collection de Compagnons (${unlockedCount} / ${COMPANIONS.length})</h3>
      <div class="rarity-filter-bar">
        <button class="rarity-filter-btn ${currentRarityFilter === 'all' ? 'active' : ''}" onclick="filterGachaRarity('all')">Tous</button>
        <button class="rarity-filter-btn ${currentRarityFilter === 'commun' ? 'active' : ''}" onclick="filterGachaRarity('commun')">Communs</button>
        <button class="rarity-filter-btn ${currentRarityFilter === 'peu_commun' ? 'active' : ''}" onclick="filterGachaRarity('peu_commun')">Peu communs</button>
        <button class="rarity-filter-btn ${currentRarityFilter === 'rare' ? 'active' : ''}" onclick="filterGachaRarity('rare')">Rares</button>
        <button class="rarity-filter-btn ${currentRarityFilter === 'epique' ? 'active' : ''}" onclick="filterGachaRarity('epique')">Épiques</button>
        <button class="rarity-filter-btn ${currentRarityFilter === 'legendaire' ? 'active' : ''}" onclick="filterGachaRarity('legendaire')">Légendaires</button>
        <button class="rarity-filter-btn ${currentRarityFilter === 'mythique' ? 'active' : ''}" onclick="filterGachaRarity('mythique')">Mythiques</button>
      </div>
    </div>
    <div class="companion-grid">
  `;
  
  const filteredCompanions = COMPANIONS.filter(c => currentRarityFilter === 'all' || c.rarity === currentRarityFilter);
  
  for (let c of filteredCompanions) {
    const unl = S.compData.unlocked.includes(c.id);
    const lvl = S.compData.levels[c.id] || 1;
    const shards = S.compData.shards[c.id] || 0;
    const upgradeCost = lvl;
    const canUpgrade = shards >= upgradeCost;
    
    if (unl) {
      let cardActionsHtml = '';
      if (maxSlots === 2) {
        const isEq0 = S.compData.equipped[0] === c.id;
        const isEq1 = S.compData.equipped[1] === c.id;
        cardActionsHtml = `
          <button class="btn-slot-equip ${isEq0 ? 'active' : ''}" data-equip-id="${c.id}" data-equip-slot="0" title="Équiper ou retirer du Slot Gauche">
            ${isEq0 ? '✓ Slot G' : '🛡️ Slot G'}
          </button>
          <button class="btn-slot-equip ${isEq1 ? 'active' : ''}" data-equip-id="${c.id}" data-equip-slot="1" title="Équiper ou retirer du Slot Droite">
            ${isEq1 ? '✓ Slot D' : '⚔️ Slot D'}
          </button>
        `;
      } else {
        const isEq0 = S.compData.equipped[0] === c.id;
        const isEq1 = S.compData.equipped[1] === c.id;
        const isEq2 = S.compData.equipped[2] === c.id;
        cardActionsHtml = `
          <button class="btn-slot-equip ${isEq0 ? 'active' : ''}" data-equip-id="${c.id}" data-equip-slot="0" title="Slot Gauche">
            ${isEq0 ? '✓ Slot G' : '🛡️ Slot G'}
          </button>
          <button class="btn-slot-equip ${isEq1 ? 'active' : ''}" data-equip-id="${c.id}" data-equip-slot="1" title="Slot Centre">
            ${isEq1 ? '✓ Slot C' : '👑 Slot C'}
          </button>
          <button class="btn-slot-equip ${isEq2 ? 'active' : ''}" data-equip-id="${c.id}" data-equip-slot="2" title="Slot Droite">
            ${isEq2 ? '✓ Slot D' : '⚔️ Slot D'}
          </button>
        `;
      }

      html += `
        <div class="companion-card rarity-${c.rarity}">
          <div class="comp-card-top" data-comp-detail="${c.id}" style="cursor:pointer;" title="Cliquez pour les détails">
            <div class="comp-card-visual">
              ${renderCompanionVisual(c, 44)}
            </div>
            <div class="comp-card-details">
              <div class="comp-card-name" title="${c.name}">${c.name}</div>
              <div class="comp-card-rarity" style="color:${RARITIES[c.rarity].color};">${RARITIES[c.rarity].name} · Lvl ${lvl}</div>
            </div>
          </div>
          <div class="comp-card-power">⚡ ${c.desc.replace('{val}', Math.round(companionVal(c.id)*100))}</div>
          <div class="comp-shards-bar">💎 Éclats : <b>${shards} / ${upgradeCost}</b></div>
          <div class="comp-card-actions ${maxSlots === 3 ? 'trio-actions' : ''}">
            ${cardActionsHtml}
          </div>
          ${canUpgrade ? `
            <button class="btn-comp-upgrade" data-upgrade-id="${c.id}">
              ⬆️ Améliorer (Niv. ${lvl + 1})
            </button>
          ` : ''}
        </div>
      `;
    } else {
      html += `
        <div class="companion-card locked">
          <div class="comp-card-top">
            <div class="comp-card-visual" style="background:#111; font-size:20px;">
              🔒
            </div>
            <div class="comp-card-details">
              <div class="comp-card-name">???</div>
              <div class="comp-card-rarity" style="color:${RARITIES[c.rarity].color};">${RARITIES[c.rarity].name}</div>
            </div>
          </div>
          <div class="comp-card-power" style="color:#747d8c;">Débloquez ce compagnon dans l'onglet Compagnons.</div>
        </div>
      `;
    }
  }
  
  html += `</div>`;
  pane.innerHTML = html;
  
  const btn1 = document.getElementById('btnSpinGacha');
  if (btn1) btn1.addEventListener('click', () => spinGacha(1));
  const btn10 = document.getElementById('btnSpinGacha10');
  if (btn10) btn10.addEventListener('click', () => spinGacha(10));
}

window.filterGachaRarity = function(r) {
  currentRarityFilter = r;
  renderGachaPane();
};

window.showGachaInfo = function() {
  current = { ended: true, api: { frac: 0 } };
  mInfo.textContent = '';
  mBody.innerHTML = `
    <div style="padding:20px; text-align:left;">
      <h2 style="color:#f1c40f; margin-bottom:15px; text-align:center;">🎰 Guide de la Machine à Sous & Compagnons</h2>
      <p>Bienvenue dans la Machine à Sous ! Utilisez vos cookies pour débloquer des <b>Compagnons</b> uniques qui boosteront votre progression.</p>
      
      <h4 style="margin-top:15px; color:#3498db; border-bottom:1px solid #444; padding-bottom:5px;">📊 Les 6 Niveaux de Rareté</h4>
      <p style="font-size:13px; line-height:1.5;">
        <span style="color:#bdc3c7; font-weight:bold;">Commun</span> (52%)<br>
        <span style="color:#2ecc71; font-weight:bold;">Peu commun</span> (26%)<br>
        <span style="color:#3498db; font-weight:bold;">Rare</span> (14%)<br>
        <span style="color:#9b59b6; font-weight:bold;">Épique</span> (6.2%)<br>
        <span style="color:#f1c40f; font-weight:bold;">Légendaire</span> (1.7%) — Contour doré éclatant ✨<br>
        <span style="color:#ff4757; font-weight:bold;">Mythique</span> (0.1%) — Contour RGB arc-en-ciel animé 🌟
      </p>
      
      <h4 style="margin-top:15px; color:#e67e22; border-bottom:1px solid #444; padding-bottom:5px;">🛡️ Sélection & Équipement (2 à 3 Slots)</h4>
      <p style="font-size:13px; line-height:1.5;">
        Vous disposez de <b>2 emplacements actifs</b> de base (<b>Slot Gauche</b> et <b>Slot Droite</b>).<br>
        Débloquez l'amélioration <b>Trio Légendaire</b> dans le <b>Temple des Légendes</b> pour équiper un <b>3ème compagnon</b> au Centre !<br>
        Cliquez sur les boutons d'équipement ou directement sur les slots <b>[+]</b> sous le cookie principal !
      </p>
      
      <h4 style="margin-top:15px; color:#2ecc71; border-bottom:1px solid #444; padding-bottom:5px;">✨ Doublons et Montée en Niveau</h4>
      <p style="font-size:13px; line-height:1.5;">
        Obtenir un doublon vous donne un <b>Éclat 💎</b> de ce compagnon. Utilisez ces éclats pour faire monter son niveau et démultiplier ses effets !
      </p>
      
      <h4 style="margin-top:15px; color:#eb4d4b; border-bottom:1px solid #444; padding-bottom:5px;">🛡️ Garantie (Pity Tracker)</h4>
      <p style="font-size:13px; line-height:1.5;">
        Tous les <b>20 tirages</b>, vous êtes garanti d'obtenir un compagnon <b>Épique, Légendaire ou Mythique</b>.
      </p>
      
      <div style="text-align:center; margin-top:25px;">
        <button class="big-btn" onclick="closeModal()" style="width:200px;">J'ai compris !</button>
      </div>
    </div>
  `;
  modal.classList.add('on');
};

window.openCompanionDetail = function(cid) {
  const c = COMPANIONS.find(x => x.id === cid);
  if (!c) return;
  
  const lvl = S.compData?.levels[c.id] || 1;
  const shards = S.compData?.shards[c.id] || 0;
  const val = Math.round(companionVal(c.id) * 100);
  const isEquipped = S.compData?.equipped.includes(c.id);
  
  let explanation = '';
  if (c.powerType === 'cps_click_hybrid') {
    explanation = `Augmente à la fois la production automatique et la puissance des clics de ${val}%.`;
  } else if (c.powerType.includes('cps') || c.powerType === 'all_buildings') {
    explanation = `Multiplie de manière globale votre production automatique (CPS) par ${1 + (val/100)}.`;
  } else if (c.powerType.includes('click')) {
    explanation = `Rend vos clics manuels ${1 + (val/100)} fois plus puissants.`;
  } else if (c.powerType === 'building_discount') {
    explanation = `Réduit le prix des bâtiments de ${val}%.`;
  } else if (c.powerType === 'building_prism' || (c.powerType.startsWith('building_') && c.powerType !== 'building_discount')) {
    explanation = `Cible un bâtiment spécifique (ici : ${c.powerType.split('_')[1]}) pour démultiplier sa production.`;
  } else if (c.powerType === 'golden_freq') {
    explanation = `Les cookies dorés apparaissent ${val}% plus souvent.`;
  } else if (c.powerType === 'frenzy_dur' || c.powerType === 'golden_vision') {
    explanation = `Toutes vos frénésies durent ${val}% plus longtemps.`;
  } else if (c.powerType === 'events') {
    explanation = `Augmente la puissance et les gains lors des événements aléatoires de ${val}%.`;
  } else if (c.powerType === 'discount') {
    explanation = `Réduit le coût en cookies des bâtiments et améliorations de ${val}%.`;
  } else if (c.powerType === 'double_edged') {
    explanation = `Double tranchant : vous offre un énorme bonus, mais un malus équivalent sur un autre aspect du jeu.`;
  } else if (c.powerType === 'luck_mult') {
    explanation = `Vous confère ${val}% de chances aléatoires de doubler les gains obtenus.`;
  } else if (c.powerType === 'speed') {
    explanation = `Accélère drastiquement la cadence de jeu de ${val}%.`;
  } else if (c.powerType === 'minigame_god') {
    explanation = `Vos récompenses lors des mini-jeux sont augmentées de ${val}%.`;
  } else if (c.powerType === 'golden_reward') {
    explanation = `Augmente le jackpot du Cookie d'Or de ${val}%.`;
  } else if (c.powerType === 'arcade_speed') {
    explanation = `Réduit le temps de recharge des mini-jeux de ${val}%.`;
  } else if (c.powerType === 'combo_power') {
    explanation = `Augmente le plafond et l'efficacité de votre combo de ${val}%.`;
  } else if (c.powerType === 'chrono_master') {
    explanation = `Accélère les mini-jeux et prolonge les frénésies de ${val}%.`;
  } else {
    explanation = `Confère un puissant bonus thématique.`;
  }

  current = { ended: true, api: { frac: 0 } };
  mInfo.textContent = '';
  mBody.innerHTML = `
    <div style="padding:20px; text-align:center;">
      <div style="width:80px; height:80px; margin:0 auto 15px; border-radius:50%; box-shadow:0 0 20px ${RARITIES[c.rarity].color}88;">
        ${renderCompanionVisual(c, 80)}
      </div>
      <h2 style="color:#fff; margin-bottom:5px;">${c.name}</h2>
      <div style="color:${RARITIES[c.rarity].color}; font-weight:bold; font-size:14px; margin-bottom:15px;">
        ${RARITIES[c.rarity].name} · Niveau ${lvl}
      </div>
      
      <div style="background:rgba(0,0,0,0.3); border-radius:12px; padding:15px; text-align:left; margin-bottom:20px;">
        <h4 style="margin:0 0 10px; color:#f1c40f;">Statistiques actuelles</h4>
        <div style="font-size:14px; color:#dfe4ea; margin-bottom:8px;">
          <b>Effet :</b> ${c.desc.replace('{val}', val)}
        </div>
        <div style="font-size:13px; color:#a4b0be; font-style:italic;">
          ${explanation}
        </div>
      </div>
      
      <div style="display:flex; justify-content:space-around; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; margin-bottom:20px;">
        <div>💎 Éclats : <b>${shards} / ${lvl}</b></div>
        <div>Statut : <b style="color:${isEquipped ? '#2ecc71' : '#e74c3c'};">${isEquipped ? 'Équipé' : 'En repos'}</b></div>
      </div>
      
      <button class="big-btn" onclick="closeModal()" style="width:200px;">Fermer</button>
    </div>
  `;
  modal.classList.add('on');
};

function injectCompData(s) {
  if (!s.compData) s.compData = { unlocked: [], equipped: [], shards: {}, levels: {}, pulls: 0, pityTracker: 0 };
  return s;
}

/* Écouteur global d'événements pour les compagnons (100% compatible CSP et délégation) */
document.addEventListener('click', (e) => {
  // Ascension "Conserver mes amis" handler
  const ascKeepBtn = e.target.closest('[data-asc-keep]');
  if (ascKeepBtn) {
    const keepId = ascKeepBtn.dataset.ascKeep;
    const g = chipsPotential() - S.chips;
    closeModal();
    performAscension(g, keepId === 'none' ? null : keepId);
    return;
  }

  // Companion detail popup handler
  const compDetailBtn = e.target.closest('[data-comp-detail]');
  if (compDetailBtn && !e.target.closest('[data-equip-id]') && !e.target.closest('[data-upgrade-id]')) {
    const cid = compDetailBtn.dataset.compDetail;
    openCompanionDetail(cid);
    return;
  }

  const equipBtn = e.target.closest('[data-equip-id]');
  if (equipBtn) {
    const id = equipBtn.dataset.equipId;
    const slot = parseInt(equipBtn.dataset.equipSlot, 10);
    equipCompanionSlot(id, slot);
    if (modal && modal.classList.contains('on') && !e.target.closest('.companion-grid')) {
      closeModal();
    }
    return;
  }
  
  const unequipBtn = e.target.closest('[data-unequip-slot]');
  if (unequipBtn) {
    const slot = parseInt(unequipBtn.dataset.unequipSlot, 10);
    unequipCompanionSlot(slot);
    if (modal && modal.classList.contains('on')) {
      closeModal();
    }
    return;
  }
  
  const selectorBtn = e.target.closest('[data-open-selector]');
  if (selectorBtn) {
    const slot = parseInt(selectorBtn.dataset.openSelector, 10);
    openCompanionSelector(slot);
    return;
  }
  
  const upgradeBtn = e.target.closest('[data-upgrade-id]');
  if (upgradeBtn) {
    const id = upgradeBtn.dataset.upgradeId;
    upgradeCompanion(id);
    return;
  }
});

