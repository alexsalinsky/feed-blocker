// Facebook: the feed, stories, reels, Watch and the groups feed always go to
// Messages. Messages, Marketplace, single groups, profiles and events still work.
// The network rule catches full loads; this catches clicks inside the site.
// Only when logged in (c_user cookie), so the login page can't loop.
const FB_FEED = /^\/(home\.php|watch(\/.*)?|reels?(\/.*)?|stories(\/.*)?|groups\/feed\/?)?\/?$/i;

setInterval(() => {
  if (document.cookie.includes("c_user=") && FB_FEED.test(location.pathname)) {
    location.replace(location.origin + "/messages/");
  }
}, 250);
