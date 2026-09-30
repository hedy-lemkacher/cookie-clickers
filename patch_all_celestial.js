const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const newLogic = `// CELESTIAL GAMES LOGIC

function gameCelestialBowling(api, g) {
  let playing = false, angle = -90, dir = 1, speed = 2.5;
  let raf, animRaf;
  
  api.body.innerHTML = \`<div class="game-bowling" style="background:#1a0f14; border-radius:12px; padding:20px; overflow:hidden;">
    <p class="game-hint" style="color:#ddd; margin-bottom:15px;">Arrêtez la flèche bien au centre pour un <b>Strike</b> !</p>
    
    <div style="position:relative; width:280px; height:350px; margin:0 auto 20px auto; background:linear-gradient(#2c1e16, #5c3a21); border-left:10px solid #111; border-right:10px solid #111; border-radius:5px; perspective:600px; overflow:hidden;" id="cBowlingAlley">
      <!-- Piste -->
      <div style="position:absolute; inset:0; background:repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 22px);"></div>
      
      <!-- Quilles -->
      <div id="cBowlingPins" style="position:absolute; top:30px; left:0; width:100%; height:60px; display:flex; justify-content:center; gap:8px; transition: 0.5s;">
        <span class="b-pin" style="font-size:32px; filter:drop-shadow(0 5px 2px rgba(0,0,0,0.5));">🥛</span>
        <span class="b-pin" style="font-size:32px; filter:drop-shadow(0 5px 2px rgba(0,0,0,0.5)); margin-top:-15px;">🥛</span>
        <span class="b-pin" style="font-size:32px; filter:drop-shadow(0 5px 2px rgba(0,0,0,0.5));">🥛</span>
      </div>
      
      <!-- Boule (Cookie) -->
      <div id="cBowlingBall" style="position:absolute; bottom:20px; left:50%; width:40px; height:40px; margin-left:-20px; font-size:40px; line-height:40px; text-align:center; transition: all 1s cubic-bezier(0.1, 0.8, 0.3, 1);">🍪</div>
      
      <!-- Flèche de visée -->
      <div style="position:absolute; bottom:40px; left:50%; width:4px; height:80px; background:rgba(241, 196, 15, 0.8); transform-origin:bottom center; transform:translateX(-50%) rotate(-90deg); z-index:10;" id="cBowlingArrow">
        <div style="position:absolute; top:-5px; left:-8px; width:0; height:0; border-left:10px solid transparent; border-right:10px solid transparent; border-bottom:15px solid #f1c40f;"></div>
      </div>
    </div>
    
    <div style="text-align:center;">
      <button id="cBowlingBtn" class="big-btn" style="background:linear-gradient(135deg, #e74c3c, #c0392b); width:180px; font-size:18px;">LANCER</button>
    </div>
  </div>\`;
  
  const arrow = api.body.querySelector('#cBowlingArrow');
  const btn = api.body.querySelector('#cBowlingBtn');
  const ball = api.body.querySelector('#cBowlingBall');
  const pinsArea = api.body.querySelector('#cBowlingPins');
  
  function runBowling() {
    angle += speed * dir;
    if (angle >= 90) { angle = 90; dir = -1; }
    if (angle <= -90) { angle = -90; dir = 1; }
    arrow.style.transform = \`translateX(-50%) rotate(\${angle}deg)\`;
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
      ball.style.transform = \`translate(\${targetX}px, -260px) scale(0.5)\`;
      
      setTimeout(() => {
        if (pins === 10) {
          pinsArea.innerHTML = '<div style="font-size:36px; color:#f1c40f; font-weight:bold; text-shadow:0 0 10px #f1c40f; animation: pulse 0.5s infinite;">STRIKE !</div>';
          setTimeout(() => api.end(1, "Strike Céleste !"), 1500);
        } else if (pins > 0) {
          pinsArea.style.opacity = '0.5';
          pinsArea.style.transform = 'translateY(-20px) rotate(' + (angle) + 'deg)';
          setTimeout(() => api.end(pins/10, \`\${pins} quilles renversées\`), 1500);
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
  
  api.body.innerHTML = \`<div class="game-basketball">
    <p class="game-hint">Tirez quand le panier est aligné avec le cookie. <span id="cBaskTries">\${tries}</span> essais.</p>
    <div style="position:relative;width:100%;height:150px;background:#222;border:2px solid #e67e22;border-radius:10px;margin-bottom:10px;overflow:hidden;" id="cBaskArea">
      <div id="cHoop" style="position:absolute;top:10px;left:0;width:50px;height:15px;border:3px solid #e74c3c;border-radius:50%;box-shadow:0 10px 0 rgba(231,76,60,0.3);"></div>
      <div id="cBall" style="position:absolute;bottom:10px;left:50%;margin-left:-15px;width:30px;height:30px;font-size:24px;line-height:30px;text-align:center;">🍪</div>
    </div>
    <div style="text-align:center;">
      <button id="cBaskBtn" class="big-btn" style="background:linear-gradient(135deg, #e67e22, #d35400); width:150px;">Tirer</button>
    </div>
  </div>\`;
  
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
      ball.style.bottom = (10 + cookieY) + 'px';
      
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
  let playing = false, gkX = 0, gkDir = 1, gkSpeed = 3.5;
  let cookieY = 0;
  let raf, shootRaf;
  let tries = 3;
  let shooting = false;
  
  api.body.innerHTML = \`<div class="game-football">
    <p class="game-hint">Marquez le penalty en évitant le verre de lait. <span id="cFooTries">\${tries}</span> essais.</p>
    <div style="position:relative;width:100%;height:150px;background:#2ecc71;border:2px solid #27ae60;border-radius:10px;margin-bottom:10px;overflow:hidden;" id="cFooArea">
      <div style="position:absolute;top:0;left:10%;width:80%;height:20px;border-bottom:3px solid #fff;border-left:3px solid #fff;border-right:3px solid #fff;box-sizing:border-box;"></div>
      <div id="cGk" style="position:absolute;top:20px;left:0;width:30px;height:40px;font-size:30px;text-align:center;line-height:40px;">🥛</div>
      <div id="cBallFoo" style="position:absolute;bottom:10px;left:50%;margin-left:-15px;width:30px;height:30px;font-size:24px;line-height:30px;text-align:center;">🍪</div>
    </div>
    <div style="text-align:center;">
      <button id="cFooBtn" class="big-btn" style="background:linear-gradient(135deg, #27ae60, #2ecc71); width:150px;">Tirer</button>
    </div>
  </div>\`;
  
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
      ball.style.bottom = (10 + cookieY) + 'px';
      
      if (cookieY > 80 && cookieY < 120) { // ball reaching GK level
        const ballCenter = areaW / 2;
        const gkCenter = gkX + 15;
        if (Math.abs(ballCenter - gkCenter) < 15) { // harder for GK to save!
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
`;

const index = code.indexOf('// CELESTIAL GAMES LOGIC');
if (index !== -1) {
  code = code.substring(0, index) + newLogic;
  fs.writeFileSync('app.js', code);
  console.log('Successfully rewrote ALL celestial games from scratch to avoid any regex issue.');
} else {
  console.log('Error: Could not find // CELESTIAL GAMES LOGIC');
}
