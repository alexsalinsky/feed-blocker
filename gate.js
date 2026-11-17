// Feed gate for Instagram and YouTube: the feed pages stay hidden until you
// take three slow breaths and then catch a button that runs from the mouse.
// Everything else (messages, profiles, search, single posts/videos) is untouched.
// Both sites are single-page apps, so this re-checks the path as you click around.
const SITES = {
  instagram: {
    feed: /^\/(explore(\/.*)?|reels(\/.*)?)?\/?$/i,       // home, Explore, Reels
    inPost: /^\/(p|reel)\//i,                             // a post opened from the feed
    hide: "main",
    note: "Messages, notifications and profiles still work.",
  },
  youtube: {
    feed: /^\/(feed\/(trending|explore|subscriptions)\/?)?$/i, // home, Trending, Subscriptions
    inPost: /^\/watch/i,
    hide: "ytd-page-manager",
    note: "Search and video links still work.",
  },
};
const SITE = SITES[location.hostname.includes("youtube") ? "youtube" : "instagram"];
const FEED = SITE.feed;
const section = (p) => p.split("/")[1] || "home";
const BREATHS = 3, BREATH_MS = 8000, DODGES = 5;

const style = document.createElement("style");
style.textContent = `
  html.fg-hide ${SITE.hide} { visibility:hidden !important; }
  #fg-card { position:fixed; inset:0; display:none; place-items:center; z-index:2147483646; pointer-events:none; }
  html.fg-hide #fg-card { display:grid; }
  #fg-card .box { pointer-events:auto; background:#17161f; color:#f3f0fa; border-radius:18px; padding:26px 30px;
    width:340px; text-align:center; font:16px/1.5 system-ui, "Segoe UI", sans-serif; box-shadow:0 12px 40px rgba(0,0,0,.35); }
  #fg-card h2 { margin:0 0 6px; font-size:1.3rem; }
  #fg-card p { margin:0 0 14px; color:#b5aec8; }
  #fg-card .orb { width:70px; height:70px; margin:6px auto 8px; border-radius:50%; background:#7fd36a;
    transform:scale(.5); transition:transform 4s ease-in-out; }
  #fg-card .cue { font-weight:600; min-height:1.5em; }
  #fg-card button { pointer-events:auto; font:inherit; font-weight:600; border:0; border-radius:999px; padding:9px 20px;
    cursor:pointer; background:#3a3550; color:#f3f0fa; transition:left .18s ease-out, top .18s ease-out; }
  #fg-card button.loose { position:fixed; box-shadow:0 6px 20px rgba(0,0,0,.35); }
  #fg-card button[hidden] { display:none; }
`;
const card = document.createElement("div");
card.id = "fg-card";
card.innerHTML = `<div class="box"><h2>Feed's hidden.</h2>
  <p>${SITE.note} Want the feed? Breathe first.</p>
  <div class="orb"></div><div class="cue"></div>
  <button type="button" hidden>Show the feed</button></div>`;
const orb = card.querySelector(".orb"), cue = card.querySelector(".cue"), btn = card.querySelector("button");

let shownFor = null;   // the feed section you unlocked; hides again once you leave it
let gateFor = null;    // the section the current exercise is running for
let timers = [], dodgesLeft = 0;

function clearTimers() { timers.forEach(clearTimeout); timers = []; }

function startGate(sec) {
  gateFor = sec; clearTimers();
  btn.hidden = true; btn.classList.remove("loose"); btn.style.left = btn.style.top = "";
  orb.style.display = ""; dodgesLeft = DODGES;
  for (let b = 0; b < BREATHS; b++) {
    const t0 = b * BREATH_MS;
    timers.push(setTimeout(() => { cue.textContent = `Breathe in (${b + 1} of ${BREATHS})`; orb.style.transform = "scale(1)"; }, t0));
    timers.push(setTimeout(() => { cue.textContent = `Breathe out (${b + 1} of ${BREATHS})`; orb.style.transform = "scale(.5)"; }, t0 + BREATH_MS / 2));
  }
  timers.push(setTimeout(() => {
    orb.style.display = "none";
    cue.textContent = "Still want it? Catch the button.";
    btn.hidden = false;
  }, BREATHS * BREATH_MS));
}

function dodge() {
  if (btn.hidden || dodgesLeft <= 0) return;
  dodgesLeft--;
  const r = btn.getBoundingClientRect();
  if (!btn.classList.contains("loose")) { btn.style.left = r.left + "px"; btn.style.top = r.top + "px"; }
  btn.classList.add("loose");
  const x = 40 + Math.random() * (innerWidth - r.width - 80);
  const y = 40 + Math.random() * (innerHeight - r.height - 80);
  btn.style.left = x + "px"; btn.style.top = y + "px";
  if (dodgesLeft === 0) cue.textContent = "Fine. You caught it.";
}
// run when the mouse gets within 30px of the button
document.addEventListener("mousemove", (e) => {
  if (btn.hidden || dodgesLeft <= 0) return;
  const r = btn.getBoundingClientRect(), pad = 30;
  if (e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad) dodge();
}, true);
btn.addEventListener("keydown", (e) => { if (dodgesLeft > 0) { e.preventDefault(); dodge(); } });
btn.addEventListener("click", (e) => {
  if (dodgesLeft > 0) { e.preventDefault(); dodge(); return; }
  shownFor = gateFor; clearTimers();
  document.documentElement.classList.remove("fg-hide");
});

function check() {
  const root = document.documentElement;
  if (!style.isConnected) root.appendChild(style);
  if (!card.isConnected) root.appendChild(card);
  const path = location.pathname;
  // stay unlocked inside a post or reel opened from the feed, lock again anywhere else
  const inPost = SITE.inPost.test(path);
  if (shownFor && !inPost && section(path) !== shownFor) shownFor = null;
  const loginPage = !!document.querySelector('input[name="password"]');
  const hide = FEED.test(path) && !shownFor && !loginPage;
  if (hide && gateFor !== section(path)) startGate(section(path));
  if (!hide && !shownFor) { gateFor = null; clearTimers(); }
  root.classList.toggle("fg-hide", hide);
}

check();
setInterval(check, 250);
window.addEventListener("popstate", check);
