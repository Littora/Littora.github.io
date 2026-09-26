import { createPixelRenderer } from './pixel-art.mjs';
import { LIGHT_LEVELS, createMirrors, traceLight, placeCoral, nextSeed, createOcean, stepBoat, oceanCurrent } from './engine.mjs';

const TEXT = {
    skip:'Skip to games', home:'Back to Littora', eyebrow:'THE LITTORA PLAY COLLECTION', title:'A little wonder.<br>A world to <em>play.</em>', intro:'Follow a light. Find your current. Grow something unexpected. Three small worlds, made for the joy of discovery.', explore:'Find your next little escape', horizon:'SOMEWHERE BETWEEN CALM & CURIOSITY', collection:'Choose a world', browser:'No downloads. Just play.', lightGenre:'LIGHT & LOGIC', lightTime:'A quiet puzzle', lightName:'Lightkeeper', lightDesc:'A scattered archipelago. One wandering beam. Turn the mirrors and bring every beacon home.', driftGenre:'PIXEL OCEAN ADVENTURE', driftTime:'A flowing voyage', driftName:'Driftline', driftDesc:'Set sail through living currents. Gather little lights, find your rhythm, and see how far the sea takes you.', gardenGenre:'GROWTH & STRATEGY', gardenTime:'One more turn', gardenName:'Tide Garden', gardenDesc:'Plant a tiny coral. Gather three, grow something new. Make room for a reef that is entirely your own.', play:'Enter the world', afterword:'No rush. No noise. A little space to be curious.', crafted:'DESIGNED TO BE DISCOVERED · MADE BY LITTORA', footer:'Small worlds. Human feeling.', saved:'Your progress stays in this browser.', sound:'Enable sound', soundOff:'Mute sound', close:'Close game', level:'Chapter', moves:'Turns', beacons:'Receivers', reset:'Start over', hint:'A little hint', next:'Next chapter →', chapters:'THE NINE STUDIES', lightHeading:'A clear path starts with one turn.', lightInstructions:'Turn the mirrors to connect the violet beam with every circular receiver. Blocks stop the light. Receivers let it pass. All receivers must light up together.', lightKeyboard:'Keyboard: Tab to a mirror, then Enter or Space to turn it.', mirror:'Mirror', beacon:'Receiver', lit:'Lit', waiting:'Unlit', lightStatus:'Connect every receiver with a single beam.', allLit:'Every receiver is connected.', allChapters:'All nine studies complete. A little clarity, well earned.', lightHint:'One mirror has been aligned. Follow the beam from there.', noHint:'The main mirrors are aligned. Check the extra mirrors in the beam’s path.', chapterNames:['First light','Right angle','The third point','A longer line','Northern passage','The circuit','Crossings','Reflections','Perfect alignment'], rotateLabel:'Turn mirror at row {r}, column {c}; currently {o}', slash:'rising diagonal', backslash:'falling diagonal', chooseChapter:'Choose chapter {n}', score:'Score', best:'Best', turns:'Plantings', undo:'Undo', gardenHeading:'Hello, little grower.', gardenInstructions:'Plant the next coral in an empty pool. Three or more matching corals connected by an edge merge where you plant. The new coral can merge again, making a chain.', gardenKeyboard:'Keyboard: Tab or arrow keys to choose a pool, then Enter or Space to plant.', seed:'NEXT TO PLANT', upcoming:'Coming next', growth:'THE GROWTH CYCLE', tiers:['Pip','Sprout','Sunny','Rosie','Bloom','Royal'], gardenCaption:'Match 3 · Edges connect · Chains grow', gardenStatus:'A little polyp today. A whole reef tomorrow.', occupied:'This pool is growing. Choose an empty pool.', merged:'Room to grow. {n} {mergeText}!', crown:'A crown coral! Your reef has reached its rarest form. Keep growing.', full:'Your reef is complete. Start a fresh garden and try a new arrangement.', fullHeading:'A reef of your own.', emptyPool:'Empty pool, row {r}, column {c}; plant {tier}', filledPool:'{tier}, row {r}, column {c}', willMerge:'This planting creates {n} {mergeText}.', noMerge:'A new beginning in this pool.', restartQuestion:'Begin a new reef? Your best score will stay.', cancel:'Keep growing', confirm:'New reef', free:'Free sail', timed:'90-second voyage', lights:'Stars', time:'Time', driftStartHeading:'Ready, captain?', driftStart:'A little boat, an open ocean, and a pocketful of stars to find. Ride the currents and explore the islands. Your map shows the way.', driftChallenge:'Collect as many stars as you can in 90 seconds. Keep moving, read the currents, and find a path through the islands.', launch:'Set sail', resume:'Continue sailing', pause:'Pause', paused:'A moment of stillness.', pauseCopy:'Your little boat will be right here.', again:'Sail again', voyageComplete:'A voyage to remember.', voyageResult:'You collected {n} {starText}. Your best voyage: {best}.', freeResult:'You gathered {n} lights. A whole archipelago is still waiting.', driftControls:'Arrow keys / WASD to steer. Hold on the sea to sail toward your pointer. On touch screens, use the control in the lower left. Space to pause.', driftTouch:'Use the control in the lower left, or hold anywhere on the sea to steer. Gather the golden stars; the map reveals the next ones.', quietSea:'An unhurried sea. No timer, no finish line.', exploreSea:'OPEN WATER', driftMap:'Map of the archipelago', steer:'STEER', lightFound:'+1 STAR', allFound:'Every light found. The sea is yours.', storage:'Browser storage is unavailable; progress lasts for this visit.', progress:'Progress saved on this device', voyageCanvas:'Driftline ocean. Steer with arrow keys or WASD to collect stars. Press Space to pause.', mirrorLegend:'Turn a mirror', beaconLegend:'Connect a receiver', help:'HOW TO PLAY', restartVoyage:'Restart voyage', driftBest:'Best timed voyage: {n} lights', soundUnavailable:'Sound is unavailable in this browser.'
};
const $ = (selector, root=document) => root.querySelector(selector);
let storageAvailable = true;
const sessionStore = new Map();
function read(key, fallback) {
  try { const value = sessionStore.get(key) || localStorage.getItem('littora.play.v1.'+key); return value ? JSON.parse(value) : fallback; }
  catch { storageAvailable=false; return fallback; }
}
function write(key,value) {
  const serialized=JSON.stringify(value);sessionStore.set(key,serialized);
  try { localStorage.setItem('littora.play.v1.'+key,serialized); }
  catch { storageAvailable=false;const notice=$('[data-storage-notice]');if(notice)notice.textContent=t('storage'); }
}
function t(key, values={}) {
  let result=TEXT[key] || key;
  for (const [name,value] of Object.entries(values)) result=result.replaceAll('{'+name+'}',value);
  return result;
}
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let sound=false, audioContext=null;
function tone(frequency=440,duration=.12,type='sine',volume=.045) {
  if (!sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state==='suspended') audioContext.resume().catch(()=>{});
    const osc=audioContext.createOscillator(), gain=audioContext.createGain(), now=audioContext.currentTime;
    osc.type=game==='drift'?'square':type;if(game==='drift')volume*=.45;osc.frequency.setValueAtTime(frequency,now);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(volume,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+duration+.02);
  } catch { sound=false; updateSound(); }
}
function chord() { [392,493.88,587.33].forEach((f,i)=>setTimeout(()=>tone(f,.6,'sine',.028),i*100)); }
function updateSound() { $('#sound-toggle').setAttribute('aria-pressed',String(sound));$('#sound-toggle').setAttribute('aria-label',t(sound?'soundOff':'sound'));$('#sound-waves').setAttribute('d',sound?'M15 8q5 4 0 8M18 5q7 7 0 14':'M15 9l6 6m0-6l-6 6'); }
$('#sound-toggle').addEventListener('click',()=>{sound=!sound;updateSound();tone(523.25,.2);});
const body=$('#game-body');
const game=document.body.dataset.game;

function lightkeeper() {
  const raw=read('light',{}), saved=raw && typeof raw==='object' ? raw : {};
  const completed=Array.isArray(saved.completed)?saved.completed.filter(n=>Number.isInteger(n)&&n>=0&&n<9):[];
  let chapter=Number.isInteger(saved.chapter)&&saved.chapter>=0&&saved.chapter<9?saved.chapter:0;
  let mirrors=[],moves=0,hints=0,won=false;
  body.innerHTML=`<div class="room-layout"><section class="game-main"><div class="room-toolbar"><div class="stat-group"><div class="stat"><span>${t('level')}</span><strong id="light-chapter"></strong></div><div class="stat"><span>${t('moves')}</span><strong id="light-moves">0</strong></div><div class="stat"><span>${t('beacons')}</span><strong id="light-beacons"></strong></div></div><button id="light-reset" class="subtle-button">${t('reset')}</button></div><div class="board-frame"><div class="light-grid" role="group" aria-label="${t('lightName')}"></div><svg class="beam-layer" viewBox="0 0 700 700" aria-hidden="true"><polyline class="beam-glow"/><polyline class="beam-line"/></svg></div><div class="board-caption"><span>${t('mirrorLegend')}</span><span>${t('beaconLegend')}</span></div><div id="light-message" class="game-message" role="status"></div></section><aside class="game-sidebar"><p class="small-label">${t('help')}</p><h2>${t('lightHeading')}</h2><p>${t('lightInstructions')}</p><p class="keyboard-note">${t('lightKeyboard')}</p><button id="light-hint" class="subtle-button">✦ ${t('hint')}</button><div class="instruction-rule"></div><p class="small-label">${t('chapters')}</p><div class="level-picker">${LIGHT_LEVELS.map((_,i)=>`<button class="level-button" data-chapter="${i}" aria-label="${t('chooseChapter',{n:i+1})}">${String(i+1).padStart(2,'0')}</button>`).join('')}</div><button class="primary-button next-level" id="next-chapter" hidden>${t('next')}</button></aside></div>`;
  const grid=$('.light-grid',body), message=$('#light-message',body);
  function save() {write('light',{chapter,completed,rotations:mirrors.map(m=>m.rotation),moves,hints});}
  function update() {
    const result=traceLight(LIGHT_LEVELS[chapter],mirrors);
    const points=result.points.map(([x,y])=>`${x*100+50},${y*100+50}`).join(' ');
    body.querySelectorAll('polyline').forEach(el=>el.setAttribute('points',points));
    $('#light-moves',body).textContent=moves;$('#light-beacons',body).textContent=result.lit.size+' / '+LIGHT_LEVELS[chapter].beacons.length;
    for (const mirror of mirrors) {const button=$(`[data-mirror="${mirror.x},${mirror.y}"]`,grid);button.dataset.rotation=mirror.rotation;button.setAttribute('aria-label',t('rotateLabel',{r:mirror.y+1,c:mirror.x+1,o:t(mirror.rotation?'backslash':'slash')}));}
    grid.querySelectorAll('[data-beacon]').forEach(el=>{const lit=result.lit.has(el.dataset.beacon);el.classList.toggle('lit',lit);el.setAttribute('aria-label',t('beacon')+': '+t(lit?'lit':'waiting'));});
    if(result.solved&&!won){won=true;if(!completed.includes(chapter))completed.push(chapter);save();chord();message.classList.add('success');message.textContent=t(chapter===8&&completed.length===9?'allChapters':'allLit')+` · ${moves} ${moves===1?'turn':'turns'}${hints?' · '+hints+' '+(hints===1?'hint':'hints'):''}`;$('#next-chapter',body).hidden=chapter===8;$('#light-hint',body).disabled=true;}
    if(!result.solved&&won){won=false;message.classList.remove('success');message.textContent=t('lightStatus');$('#next-chapter',body).hidden=true;$('#light-hint',body).disabled=false;}
    body.querySelectorAll('[data-chapter]').forEach(button=>{button.classList.toggle('complete',completed.includes(Number(button.dataset.chapter)));button.classList.toggle('active',Number(button.dataset.chapter)===chapter);button.setAttribute('aria-pressed',String(Number(button.dataset.chapter)===chapter));});
    save();
  }
  function start(index,restore=false) {
    chapter=index;mirrors=createMirrors(chapter);moves=0;hints=0;won=false;
    if(restore&&Array.isArray(saved.rotations)&&saved.rotations.length===mirrors.length&&saved.rotations.every(n=>n===0||n===1)){mirrors.forEach((m,i)=>m.rotation=saved.rotations[i]);moves=Number.isInteger(saved.moves)&&saved.moves>=0?saved.moves:0;hints=Number.isInteger(saved.hints)&&saved.hints>=0?saved.hints:0;}
    save();
    $('#light-chapter',body).textContent=String(chapter+1).padStart(2,'0');message.classList.remove('success');message.textContent=TEXT.chapterNames[chapter]+' · '+t('lightStatus');$('#next-chapter',body).hidden=true;$('#light-hint',body).disabled=false;
    grid.innerHTML='';const level=LIGHT_LEVELS[chapter];
    for(let y=0;y<7;y++)for(let x=0;x<7;x++){
      const mirror=mirrors.find(m=>m.x===x&&m.y===y), key=x+','+y,cell=document.createElement(mirror?'button':'div');cell.className='light-cell'+(mirror?' mirror':'');
      if(mirror){cell.type='button';cell.dataset.mirror=key;cell.addEventListener('click',()=>{mirror.rotation^=1;moves++;grid.querySelectorAll('.hint').forEach(el=>el.classList.remove('hint'));tone(310+mirror.x*30,.085);update();});}
      else if(level.beacons.some(p=>p[0]===x&&p[1]===y))cell.innerHTML=`<span class="beacon" role="img" data-beacon="${key}"></span>`;
      else if(level.rocks.some(p=>p[0]===x&&p[1]===y))cell.innerHTML='<span class="rock" aria-hidden="true"></span>';
      if(x===0&&y===level.source)cell.insertAdjacentHTML('beforeend','<span class="source-mark" aria-hidden="true">▸</span>');grid.append(cell);
    }update();
  }
  $('#light-reset',body).addEventListener('click',()=>start(chapter));
  body.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>start(Number(button.dataset.chapter))));
  $('#next-chapter',body).addEventListener('click',()=>{start(Math.min(chapter+1,8));grid.querySelector('button')?.focus();window.scrollTo({top:0,behavior:'instant'});});
  $('#light-hint',body).addEventListener('click',()=>{const mirror=mirrors.find(m=>m.rotation!==m.solution);if(!mirror){message.textContent=t('noHint');return;}mirror.rotation=mirror.solution;moves++;hints++;tone(520,.2);message.textContent=t('lightHint');$(`[data-mirror="${mirror.x},${mirror.y}"]`,grid).classList.add('hint');update();});
  start(chapter,true);return ()=>{};
}

const CORAL_COLORS=['','#d3ab71','#76a895','#d8b864','#cf8d91','#a28eba','#ba9b57'];
function coralSVG(tier) {
  if(!tier)return '';
  const fills=['','#eed1a4','#aed5bc','#f4d782','#f1b2ad','#c9b4de','#edd086'];
  const paths=['',
    'M21 52Q12 49 13 38Q10 34 12 29Q13 25 18 27Q15 16 21 14Q27 13 29 24Q32 17 36 17Q42 17 42 27Q47 20 51 24Q56 29 50 36Q54 47 44 52Z',
    'M27 53V40Q12 39 10 27Q9 21 14 20Q19 20 19 26Q20 29 27 30V17Q27 11 32 11Q37 11 37 17V28Q43 26 45 20Q48 14 52 17Q58 22 52 30Q45 38 37 39V53Z',
    'M28 53V42Q10 37 8 26Q6 20 11 18Q9 11 15 9Q21 7 24 16Q22 6 29 5Q35 3 37 15Q39 6 45 9Q51 11 48 20Q54 16 57 22Q59 32 46 39L37 43V53Z',
    'M27 53V44Q11 43 9 33Q6 28 10 24Q15 21 19 26Q13 17 18 13Q25 10 28 20V11Q28 5 33 6Q39 7 38 18Q44 9 50 14Q56 20 47 28Q53 22 58 28Q61 37 49 41L38 45V53Z',
    'M26 54V42Q11 42 9 30Q7 25 12 23Q18 23 17 29Q18 33 26 33V26Q17 25 16 16Q15 10 20 10Q25 10 24 16Q25 18 30 18V9Q30 4 35 5Q40 5 39 12V28Q47 26 47 19Q46 14 51 14Q57 14 55 23Q54 34 39 37V42Q47 41 49 37Q52 31 57 34Q61 41 54 47Q48 51 39 51V54Z',
    'M27 54V43Q10 41 9 27Q7 22 11 20Q15 18 18 24Q19 31 27 32V20Q25 11 30 10Q36 7 38 15V29Q46 25 47 19Q49 13 54 16Q60 21 53 30Q47 37 38 39V54Z'];
  const faceY=tier===1?39:tier===3?29:36;
  const decoration=tier===3?'<path d="M16 18l10 18M30 12v24M44 18L37 35" fill="none" stroke="#fff1c2" stroke-width="1.8"/>':tier===6?'<path d="M22 14l-3-9 8 5 5-9 5 9 8-5-3 9Z" fill="#edbc58" stroke="#b48c45" stroke-width="1.2"/><circle cx="32" cy="9" r="1.5" fill="#fff8d7"/>':'';
  return `<svg class="coral-svg" viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="56" rx="22" ry="4" fill="#709b91" opacity=".13"/><path d="${paths[tier]}" fill="${fills[tier]}" stroke="${CORAL_COLORS[tier]}" stroke-width="1.6" stroke-linejoin="round"/>${decoration}<path d="M29 48v-5" stroke="#ffffff" stroke-opacity=".4" stroke-width="2.5" stroke-linecap="round"/><g fill="#685753"><circle cx="27" cy="${faceY}" r="1.3"/><circle cx="38" cy="${faceY}" r="1.3"/></g><path d="M30 ${faceY+4}q2.5 3 5 0" fill="none" stroke="#685753" stroke-width="1.2" stroke-linecap="round"/><g fill="#e79391" opacity=".55"><ellipse cx="23.5" cy="${faceY+3}" rx="2.5" ry="1.3"/><ellipse cx="41.5" cy="${faceY+3}" rx="2.5" ry="1.3"/></g></svg>`;
}
function validGarden(value) {
  return value&&Array.isArray(value.board)&&value.board.length===25&&value.board.every(n=>Number.isInteger(n)&&n>=0&&n<=6)&&Array.isArray(value.queue)&&value.queue.length===3&&value.queue.every(n=>Number.isInteger(n)&&n>=1&&n<=3)&&Number.isFinite(value.score)&&value.score>=0&&Number.isInteger(value.turns)&&value.turns>=0;
}
function tideGarden() {
  const saved=read('garden',null);let state=validGarden(saved)?{board:saved.board,queue:saved.queue,score:saved.score,turns:saved.turns}:fresh();
  let previous=null,best=read('gardenBest',0),crowned=state.board.includes(6);if(!Number.isFinite(best)||best<0)best=0;
  function fresh(){return {board:Array(25).fill(0),queue:[1,1,1],score:0,turns:0};}
  body.innerHTML=`<div class="room-layout"><section class="game-main"><div class="room-toolbar"><div class="stat-group"><div class="stat"><span>${t('score')}</span><strong id="garden-score"></strong></div><div class="stat"><span>${t('best')}</span><strong id="garden-best"></strong></div><div class="stat"><span>${t('turns')}</span><strong id="garden-turns"></strong></div></div><button class="subtle-button" id="garden-undo" disabled>↶ ${t('undo')}</button></div><div class="mobile-seed-tray"><span class="small-label">${t('seed')}</span><span id="mobile-garden-seed"></span><strong id="mobile-seed-name"></strong><span class="seed-preview" id="mobile-garden-queue" aria-label="${t('upcoming')}"></span></div><div class="preview-tooltip" id="garden-preview" aria-hidden="true"></div><div class="board-frame"><div class="garden-grid" role="group" aria-label="${t('gardenName')}"></div></div><div class="board-caption"><span>${t('gardenCaption')}</span></div><div id="garden-message" class="game-message" role="status">${t('gardenStatus')}</div></section><aside class="game-sidebar garden-sidebar"><figure class="garden-portrait"><img src="${document.body.dataset.art}" alt="A sunlit pastel reef with friendly coral creatures"><figcaption>A little kindness. A little room to grow.</figcaption></figure><div class="seed-tray"><div class="next-seed" id="garden-seed"></div><div><p>${t('seed')}</p><strong id="seed-name"></strong></div><div class="seed-preview" id="garden-queue" aria-label="${t('upcoming')}"></div></div><p class="small-label">${t('help')}</p><h2>${t('gardenHeading')}</h2><p>${t('gardenInstructions')}</p><p class="keyboard-note">${t('gardenKeyboard')}</p><div class="instruction-rule"></div><p class="small-label">${t('growth')}</p><div class="growth-guide">${[1,2,3,4,5,6].map(tier=>`<div>${coralSVG(tier)}<span>${TEXT.tiers[tier-1]}</span></div>`).join('')}</div><div class="instruction-rule"></div><button id="garden-restart" class="subtle-button">${t('reset')}</button><div class="restart-confirm" id="garden-confirm" hidden><p>${t('restartQuestion')}</p><button class="subtle-button" id="garden-cancel">${t('cancel')}</button><button class="primary-button" id="garden-new">${t('confirm')}</button></div></aside></div>`;
  const grid=$('.garden-grid',body),message=$('#garden-message',body),preview=$('#garden-preview',body);
  const cells=[];
  for(let index=0;index<25;index++) {
    const button=document.createElement('button');button.type='button';button.className='garden-cell';button.dataset.index=index;
    button.addEventListener('click',()=>{
      const result=placeCoral(state.board,index,state.queue[0]);if(!result){message.textContent=t('occupied');return;}
      previous=structuredClone(state);state.board=result.board;state.score+=result.score;state.turns++;state.queue.shift();state.queue.push(nextSeed());
      if(state.score>best){best=state.score;write('gardenBest',best);}write('garden',state);message.classList.remove('success');
      if(result.full){message.textContent=t('full');message.classList.add('success');chord();}
      else if(state.board.includes(6)&&!crowned){crowned=true;message.textContent=t('crown');message.classList.add('success');chord();}
      else if(result.merges.length){message.textContent=t('merged',{n:result.merges.length,mergeText:result.merges.length===1?'merge':'merges'});tone(262*Math.pow(1.26,result.merges.at(-1).tier),.4);}
      else{message.textContent=t('gardenStatus');tone(220+state.queue[0]*30,.08,'sine',.025);}
      render();if(result.merges.length&&!reducedMotion.matches){button.classList.remove('just-grown');void button.offsetWidth;button.classList.add('just-grown');}showPreview(index);
    });
    function showPreview(index){const result=placeCoral(state.board,index,state.queue[0]);preview.textContent=result?t(result.merges.length?'willMerge':'noMerge',{n:result.merges.length,mergeText:result.merges.length===1?'merge':'merges'}):'';}
    button.addEventListener('pointerenter',()=>showPreview(index));button.addEventListener('focus',()=>showPreview(index));button.addEventListener('pointerleave',()=>preview.textContent='');
    button.addEventListener('keydown',event=>{const offsets={ArrowUp:-5,ArrowDown:5,ArrowLeft:-1,ArrowRight:1};if(!(event.key in offsets))return;event.preventDefault();const x=index%5,y=Math.floor(index/5);let nx=x,ny=y;if(event.key==='ArrowLeft')nx=(x+4)%5;if(event.key==='ArrowRight')nx=(x+1)%5;if(event.key==='ArrowUp')ny=(y+4)%5;if(event.key==='ArrowDown')ny=(y+1)%5;cells[ny*5+nx].focus();});
    cells.push(button);grid.append(button);
  }
  function render(){
    cells.forEach((cell,i)=>{const value=state.board[i];cell.dataset.tier=value;cell.innerHTML=coralSVG(value)+(value?`<span class="coral-tier" aria-hidden="true">${value}</span>`:'');cell.setAttribute('aria-label',t(value?'filledPool':'emptyPool',{r:Math.floor(i/5)+1,c:i%5+1,tier:TEXT.tiers[(value||state.queue[0])-1]}));cell.setAttribute('aria-disabled',String(Boolean(value)));});
    $('#garden-score',body).textContent=state.score.toLocaleString();$('#garden-best',body).textContent=best.toLocaleString();$('#garden-turns',body).textContent=state.turns;$('#garden-seed',body).innerHTML=coralSVG(state.queue[0]);$('#seed-name',body).textContent=TEXT.tiers[state.queue[0]-1];$('#garden-queue',body).innerHTML=state.queue.slice(1).map(tier=>`<span role="img" aria-label="${TEXT.tiers[tier-1]}">${coralSVG(tier)}</span>`).join('');$('#garden-undo',body).disabled=!previous;$('#mobile-garden-seed',body).innerHTML=coralSVG(state.queue[0]);$('#mobile-seed-name',body).textContent=TEXT.tiers[state.queue[0]-1];$('#mobile-garden-queue',body).innerHTML=$('#garden-queue',body).innerHTML;
  }
  $('#garden-undo',body).addEventListener('click',()=>{if(!previous)return;state=previous;previous=null;crowned=state.board.includes(6);write('garden',state);message.classList.remove('success');message.textContent=t('gardenStatus');preview.textContent='';render();});
  $('#garden-restart',body).addEventListener('click',()=>{if(!state.turns)return;$('#garden-confirm',body).hidden=false;$('#garden-cancel',body).focus();});
  $('#garden-cancel',body).addEventListener('click',()=>{$('#garden-confirm',body).hidden=true;$('#garden-restart',body).focus();});
  $('#garden-new',body).addEventListener('click',()=>{state=fresh();previous=null;crowned=false;write('garden',state);$('#garden-confirm',body).hidden=true;message.classList.remove('success');message.textContent=t('gardenStatus');preview.textContent='';render();cells[0].focus();});
  render();if(state.board.every(Boolean)){message.textContent=t('full');message.classList.add('success');}return()=>{};
}

function driftline() {
  let mode='free',world=createOcean(),boat={x:0,y:0,vx:0,vy:0},camera={x:0,y:0},elapsed=0,count=0,running=false,started=false,finished=false,frame=0,last=0,disposed=false;
  let best=read('driftBest',0);if(!Number.isInteger(best)||best<0)best=0;
  const keys=new Set(),trail=[],pointer={x:0,y:0,active:false},stick={x:0,y:0,active:false};
  let toastUntil=0,width=800,height=420,dpr=1,heading=-Math.PI/2;
  const coarse=matchMedia('(pointer: coarse)').matches||matchMedia('(max-width: 740px)').matches;
  body.innerHTML=`<section class="drift-layout"><div class="drift-top"><div class="stat-group"><div class="stat"><span>${t('lights')}</span><strong id="drift-count">0</strong></div><div class="stat"><span>${t('time')}</span><strong id="drift-time">∞</strong></div><div class="stat"><span>${t('best')}</span><strong id="drift-best">${best}</strong></div></div><div class="mode-switch" role="group" aria-label="${t('driftName')}"><button data-mode="free" class="active" aria-pressed="true">${t('free')}</button><button data-mode="timed" aria-pressed="false">${t('timed')}</button></div></div><div class="ocean-frame"><canvas id="ocean" tabindex="0" aria-label="${t('voyageCanvas')}"></canvas><div class="ocean-hud"><span>${t('exploreSea')}</span><span id="boat-coordinates">0 · 0</span></div><div class="compass" aria-hidden="true">↑</div><div class="touch-control" id="joystick" role="group" aria-label="${t('steer')}"><div class="touch-stick"></div><span class="joystick-label">${t('steer')}</span></div><div class="minimap" role="img" aria-label="${t('driftMap')}"><canvas id="ocean-map" aria-hidden="true"></canvas></div><div class="ocean-toast" id="ocean-toast" aria-hidden="true"></div><div class="ocean-overlay" id="ocean-overlay"><div class="voyage-intro"><p class="small-label">${t('driftGenre')}</p><h2 id="voyage-title"></h2><p id="voyage-copy"></p><div class="button-row"><button class="primary-button" id="sail-button">${t('launch')}</button><button class="subtle-button" id="overlay-restart" hidden>${t('restartVoyage')}</button></div></div></div></div><div class="drift-bottom"><p>${t(coarse?'driftTouch':'driftControls')}</p><div class="button-row"><button class="subtle-button" id="drift-pause" disabled>${t('pause')}</button><button class="subtle-button" id="drift-restart">${t('reset')}</button></div></div><p class="keyboard-note" id="drift-description" style="margin:14px 0 0">${t('quietSea')}</p><div class="screenreader" id="drift-announcement" role="status"></div></section>`;
  const canvas=$('#ocean',body),renderer=createPixelRenderer(canvas),map=$('#ocean-map',body),mapctx=map.getContext('2d'),oceanFrame=$('.ocean-frame',body),overlay=$('#ocean-overlay',body),joystick=$('#joystick',body),stickEl=$('.touch-stick',body),sail=$('#sail-button',body);
  map.width=170;map.height=170;mapctx.imageSmoothingEnabled=false;
  function resize(){const bounds=oceanFrame.getBoundingClientRect();width=Math.max(1,bounds.width-2);height=Math.max(1,bounds.height-2);dpr=Math.min(window.devicePixelRatio||1,2);renderer.resize(width,height,dpr);draw();}
  const observer=new ResizeObserver(resize);observer.observe(oceanFrame);
  function clearInput(){keys.clear();pointer.active=false;stick.active=false;stick.x=0;stick.y=0;stickEl.style.transform='';}
  function showOverlay(kind){
    overlay.hidden=false;overlay.dataset.state=kind;$('#drift-pause',body).disabled=true;
    $('#voyage-title',body).textContent=t(kind==='pause'?'paused':kind==='finish'?'voyageComplete':'driftStartHeading');
    $('#voyage-copy',body).textContent=kind==='pause'?t('pauseCopy'):kind==='finish'?t('voyageResult',{n:count,best,starText:count===1?'star':'stars'}):t(mode==='free'?'driftStart':'driftChallenge');
    sail.textContent=t(kind==='pause'?'resume':kind==='finish'?'again':'launch');$('#overlay-restart',body).hidden=kind!=='pause';
  }
  function pause(){if(!running)return;running=false;clearInput();showOverlay('pause');sail.focus();}
  function reset(){running=false;started=false;finished=false;elapsed=0;count=0;boat={x:0,y:0,vx:0,vy:0};camera={x:0,y:0};world=createOcean();trail.length=0;heading=-Math.PI/2;clearInput();$('#drift-count',body).textContent=0;$('#drift-time',body).textContent=mode==='free'?'∞':'1:30';$('#ocean-toast',body).classList.remove('show');showOverlay('start');draw();}
  function start(){if(finished)reset();running=true;started=true;finished=false;last=performance.now();overlay.hidden=true;$('#drift-pause',body).disabled=false;canvas.focus();}
  function finish(){running=false;finished=true;clearInput();if(count>best){best=count;write('driftBest',best);$('#drift-best',body).textContent=best;}showOverlay('finish');$('#drift-announcement',body).textContent=t('voyageResult',{n:count,best,starText:count===1?'star':'stars'});chord();sail.focus();}
  sail.addEventListener('click',start);$('#overlay-restart',body).addEventListener('click',()=>{reset();start();});$('#drift-pause',body).addEventListener('click',pause);$('#drift-restart',body).addEventListener('click',reset);
  body.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;body.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});$('#drift-description',body).textContent=t(mode==='free'?'quietSea':'driftChallenge');reset();}));
  const controlKeys=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'];
  function keydown(event){if(event.target!==canvas)return;if(controlKeys.includes(event.key)){event.preventDefault();if(running)keys.add(event.key.toLowerCase());}if(event.code==='Space'){event.preventDefault();if(!event.repeat){if(running)pause();else if(started&&!finished)start();}}}
  function keyup(event){keys.delete(event.key.toLowerCase());}
  function blur(){clearInput();if(running)pause();}
  function visibility(){if(document.hidden)blur();}
  window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility);
  function setPointer(event){const bounds=canvas.getBoundingClientRect();pointer.x=event.clientX-bounds.left-width/2;pointer.y=event.clientY-bounds.top-height/2;pointer.active=true;}
  canvas.addEventListener('pointerdown',event=>{if(!running)return;event.preventDefault();canvas.focus();canvas.setPointerCapture(event.pointerId);setPointer(event);});
  canvas.addEventListener('pointermove',event=>{if(pointer.active)setPointer(event);});
  canvas.addEventListener('pointerup',()=>pointer.active=false);canvas.addEventListener('pointercancel',()=>pointer.active=false);canvas.addEventListener('lostpointercapture',()=>pointer.active=false);
  function moveStick(event){const rect=joystick.getBoundingClientRect(),dx=event.clientX-rect.left-rect.width/2,dy=event.clientY-rect.top-rect.height/2,length=Math.hypot(dx,dy),scale=length>30?30/length:1;stick.x=dx*scale/30;stick.y=dy*scale/30;stickEl.style.transform=`translate(${dx*scale}px,${dy*scale}px)`;}
  joystick.addEventListener('pointerdown',event=>{if(!running)return;event.preventDefault();joystick.setPointerCapture(event.pointerId);stick.active=true;moveStick(event);});
  joystick.addEventListener('pointermove',event=>{if(stick.active)moveStick(event);});
  function releaseStick(){stick.active=false;stick.x=0;stick.y=0;stickEl.style.transform='';}
  joystick.addEventListener('pointerup',releaseStick);joystick.addEventListener('pointercancel',releaseStick);joystick.addEventListener('lostpointercapture',releaseStick);
  function input(){
    if(stick.active)return{x:stick.x,y:stick.y};
    if(pointer.active){const length=Math.hypot(pointer.x,pointer.y);return length<12?{x:0,y:0}:{x:pointer.x/Math.max(length,60),y:pointer.y/Math.max(length,60)};}
    return{x:Number(keys.has('arrowright')||keys.has('d'))-Number(keys.has('arrowleft')||keys.has('a')),y:Number(keys.has('arrowdown')||keys.has('s'))-Number(keys.has('arrowup')||keys.has('w'))};
  }
  function draw(){
    renderer.draw({world,boat,camera,time:elapsed,heading,trail,reducedMotion:reducedMotion.matches});
    drawMap();
  }
  function drawMap(){
    mapctx.clearRect(0,0,170,170);const scale=154/2900;mapctx.save();mapctx.translate(85,85);
    mapctx.fillStyle='#468354';for(const island of world.islands){mapctx.beginPath();mapctx.arc(island.x*scale,island.y*scale,Math.max(1.5,island.r*scale),0,Math.PI*2);mapctx.fill();}
    mapctx.fillStyle='#cf7438';for(const light of world.lights)if(!light.collected){mapctx.beginPath();mapctx.arc(light.x*scale,light.y*scale,1.3,0,Math.PI*2);mapctx.fill();}
    mapctx.fillStyle='#fff9dd';mapctx.beginPath();mapctx.arc(boat.x*scale,boat.y*scale,3,0,Math.PI*2);mapctx.fill();mapctx.strokeStyle='#2a607c';mapctx.lineWidth=1;mapctx.strokeRect((camera.x-width/2)*scale,(camera.y-height/2)*scale,width*scale,height*scale);mapctx.restore();
  }
  function tick(now){
    if(disposed)return;const dt=last?Math.min((now-last)/1000,.04):0;last=now;
    if(running){
      elapsed+=dt;const found=stepBoat(boat,input(),dt,elapsed,world);camera.x=boat.x;camera.y=boat.y;
      if(Math.hypot(boat.vx,boat.vy)>8)heading=Math.atan2(boat.vy,boat.vx);
      if(!reducedMotion.matches){trail.push({x:boat.x,y:boat.y});if(trail.length>55)trail.shift();}
      if(found.length){count+=found.length;$('#drift-count',body).textContent=count;tone(440+count%8*55,.25,'sine',.035);$('#ocean-toast',body).textContent=t(count===world.lights.length?'allFound':'lightFound');$('#ocean-toast',body).classList.add('show');toastUntil=elapsed+2;$('#drift-announcement',body).textContent=count+' '+(count===1?'star':'stars');}
      if(elapsed>toastUntil)$('#ocean-toast',body).classList.remove('show');
      $('#boat-coordinates',body).textContent=Math.round(boat.x)+' · '+Math.round(-boat.y);
      if(mode==='timed'){const remaining=Math.max(0,Math.ceil(90-elapsed));$('#drift-time',body).textContent=Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0');if(elapsed>=90)finish();}
      draw();
    }
    frame=requestAnimationFrame(tick);
  }
  reset();resize();frame=requestAnimationFrame(tick);
  return()=>{disposed=true;running=false;cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);};
}


const disposeGame=game==='light'?lightkeeper():game==='garden'?tideGarden():driftline();
window.addEventListener('pagehide',disposeGame,{once:true});
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
if(!storageAvailable)$('[data-storage-notice]').textContent=t('storage');
