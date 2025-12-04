/* iOS 26 replica interactions */
const lock = document.getElementById('lock-screen');
const home = document.getElementById('home-screen');
const appWindow = document.getElementById('app-window');
const appBody = document.getElementById('app-body');
const appBack = document.getElementById('app-back');
const lib = document.getElementById('app-library');
const libGrid = document.getElementById('lib-grid');
const tpl = document.getElementById('app-tpl');

const homeGrid = document.getElementById('home-grid');
const dock = document.getElementById('dock');
const dynamic = document.getElementById('dynamic-island');
const control = document.getElementById('control-center');
const notif = document.getElementById('notif-center');
const lockTime = document.getElementById('lock-big-time');
const lockDate = document.getElementById('lock-date');
const homeTime = document.getElementById('home-time');

const APPS = [
  "Phone","Messages","Safari","Mail","Calendar","Photos","Camera","Maps",
  "Notes","Reminders","Wallet","Health","Settings","Files","Music","Clock",
  "Weather","App Store","Shortcuts","Home","Photoshop","Translate","Podcasts","TV"
];

// ---- util: create tiles ----
function makeTile(label){
  const node = tpl.content.cloneNode(true);
  const tile = node.querySelector('.app-tile');
  tile.querySelector('.app-label').textContent = label;
  const icon = tile.querySelector('.app-icon');
  icon.textContent = emojiFor(label);
  tile.onclick = ()=> openApp(label);
  tile.oncontextmenu = (e)=>{ e.preventDefault(); openQuickActions(label); }
  return tile;
}

function emojiFor(name){
  const map = {
    "Phone":"📞","Messages":"💬","Safari":"🔎","Mail":"✉️","Calendar":"📅","Photos":"🖼️","Camera":"📷","Maps":"🗺️","Notes":"📝",
    "Reminders":"✅","Wallet":"💳","Health":"❤️","Settings":"⚙️","Files":"📁","Music":"🎵","Clock":"⏰","Weather":"☀️","App Store":"🛒",
    "Shortcuts":"🔀","Home":"🏠","Podcasts":"🎙️","TV":"📺","Photoshop":"🖌️","Translate":"🈶"
  };
  return map[name] || '📱';
}

/* Build home + dock + library */
function buildHome(){
  homeGrid.innerHTML='';
  // first 20 apps into grid
  APPS.slice(0,20).forEach(app=>{
    homeGrid.appendChild(makeTile(app));
  });
  // dock = 4 primary
  dock.innerHTML='';
  APPS.slice(0,4).forEach(d=>{
    const dnode = document.createElement('div');
    dnode.className='dock-icon';
    dnode.innerHTML = `<div class="app-icon">${emojiFor(d)}</div><div class="app-label">${d}</div>`;
    dnode.onclick = ()=> openApp(d);
    dock.appendChild(dnode);
  });
  // library
  libGrid.innerHTML='';
  APPS.forEach(a=> libGrid.appendChild(makeTile(a)));
}

/* Clock updater */
function updateClock(){
  const d = new Date();
  const hh = d.getHours().toString().padStart(2,'0');
  const mm = d.getMinutes().toString().padStart(2,'0');
  const dt = d.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'});
  lockTime.textContent = `${hh}:${mm}`;
  lockDate.textContent = dt;
  homeTime.textContent = `${hh}:${mm}`;
}
setInterval(updateClock,1000);
updateClock();

/* Unlock gesture: swipe up (simple click/drag simulation) */
let startY = null;
lock.addEventListener('touchstart', e=> startY = e.touches[0].clientY);
lock.addEventListener('touchmove', e=>{
  if(!startY) return;
  const dy = startY - e.touches[0].clientY;
  if(dy > 80) unlockToHome();
});
lock.addEventListener('click', ()=> unlockToHome());

function unlockToHome(){
  lock.classList.add('hidden');
  home.classList.remove('hidden');
  home.classList.add('visible');
  lock.classList.remove('visible');
}

/* Open app: show app-window with stub content */
function openApp(name){
  appWindow.classList.remove('hidden');
  appBody.innerHTML = `<h2 style="margin:0 0 8px">${name}</h2>`;
  // sample stubs
  if(name === 'Notes'){
    appBody.innerHTML += `<textarea style="width:100%;height:60vh;border-radius:12px;padding:12px">New note…</textarea>`;
  } else if(name === 'Safari'){
    appBody.innerHTML += `<div style="background:#041928;padding:8px;border-radius:10px"><input style="width:100%;padding:10px;border-radius:8px;border:none;background:#02121b;color:#fff" placeholder="Search or enter website"></div><div style="margin-top:12px">Top sites (demo)</div>`;
  } else if(name === 'Music'){
    appBody.innerHTML += `<div style="display:flex;gap:12px;align-items:center"><div style="width:120px;height:120px;background:linear-gradient(135deg,#6fe2ff,#8b7bff);border-radius:12px"></div><div><strong>Song demo</strong><div>Artist · Album</div></div></div>`;
  } else {
    appBody.innerHTML += `<p style="opacity:.85">This is a demo stub for <strong>${name}</strong>. Build out app content here.</p>`;
  }
  // show dynamic island active
  dynamic.querySelector('.pill').classList.add('active');
}

/* Back button */
appBack.addEventListener('click', ()=> {
  appWindow.classList.add('hidden');
  dynamic.querySelector('.pill').classList.remove('active');
});

/* Quick actions (context) */
function openQuickActions(name){
  alert(`Quick actions for ${name} (demo) — long press / contextual menu`);
}

/* Control center + notifications toggle (desktop demo via keys) */
window.addEventListener('keydown', (e)=>{
  if(e.key === 'c'){ toggleControl(); }
  if(e.key === 'n'){ toggleNotif(); }
  if(e.key === 'l'){ lockToLockscreen(); } // lock
  if(e.key === 'a'){ openLibrary(); }
});

function toggleControl(){
  control.classList.toggle('hidden');
  if(!control.classList.contains('hidden')) notif.classList.add('hidden');
}
function toggleNotif(){
  notif.classList.toggle('hidden');
  if(!notif.classList.contains('hidden')) control.classList.add('hidden');
}
function lockToLockscreen(){
  home.classList.add('hidden');
  lock.classList.remove('hidden');
}

/* App library */
function openLibrary(){
  lib.classList.remove('hidden');
  lib.classList.add('visible');
}
document.getElementById('lib-close').addEventListener('click', ()=> lib.classList.add('hidden'));

/* Tap outside to dismiss overlays */
document.addEventListener('click', (e)=>{
  if(!control.classList.contains('hidden')){
    if(!e.target.closest('#control-center') && !e.target.closest('.btn')) control.classList.add('hidden');
  }
  if(!notif.classList.contains('hidden')){
    if(!e.target.closest('#notif-center') && !e.target.closest('.btn')) notif.classList.add('hidden');
  }
});

/* initial build */
buildHome();

/* small UX niceties */
document.querySelectorAll('.app-tile').forEach(t=>{
  t.addEventListener('mouseover', ()=> t.style.transform = 'translateY(-6px)');
  t.addEventListener('mouseout', ()=> t.style.transform = '');
});
