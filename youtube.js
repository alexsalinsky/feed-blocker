// YouTube extras on top of the feed gate:
// - Shorts go to the bouncer page (the network rule catches full loads, this catches in-site clicks)
// - Shorts shelves, the "up next" sidebar and end-of-video suggestions are hidden
// - Autoplay gets switched off, so one video doesn't roll into the next
const css = document.createElement("style");
css.textContent = `
  ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts], ytd-rich-section-renderer:has([is-shorts]),
  ytd-guide-entry-renderer:has(a[title="Shorts"]), ytd-mini-guide-entry-renderer[aria-label="Shorts"],
  ytd-watch-flexy #related, ytd-watch-next-secondary-results-renderer,
  .ytp-endscreen-content, .ytp-ce-element, .ytp-autonav-endscreen-countdown-overlay,
  .ytp-fullscreen-grid, .ytp-fullscreen-grid-stills-container { display:none !important; }
`;
const blocked = chrome.runtime.getURL("blocked.html?site=shorts");

setInterval(() => {
  if (!css.isConnected) document.documentElement.appendChild(css);
  if (/^\/shorts(\/|$)/i.test(location.pathname)) location.replace(blocked);
  const auto = document.querySelector('.ytp-autonav-toggle-button[aria-checked="true"]');
  if (auto) auto.click();
}, 400);
