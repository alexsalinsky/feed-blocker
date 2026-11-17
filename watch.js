// Reddit is a single-page app, so clicking the logo or "Popular" from a
// subreddit changes the URL without a new page load. The network rule can't
// see that, so this watches the path and bounces feed pages too.
const FEED = /^\/?((r\/(popular|all)|best|hot|new|top|rising|controversial)(\/.*)?)?\/?$/i;
const target = chrome.runtime.getURL("blocked.html");

let last = "";
function check() {
  const path = location.pathname;
  if (path === last) return;
  last = path;
  if (FEED.test(path)) location.replace(target);
}

check();
setInterval(check, 300);
window.addEventListener("popstate", check);
