# Feed Blocker

A small Chrome extension that cuts the feeds out of Reddit, Instagram, YouTube and Facebook, while messages, search and the things you open on purpose keep working.

Demo: https://alexsalinsky.github.io/build-room-visuals/reddit-feed-blocker/demo.html

## What it does

| Site | Blocked or gated | Still works |
|---|---|---|
| Reddit | Home page, `/best`, `/hot`, `/new`, `/top`, `/rising`, `/r/popular`, `/r/all` go to a grumpy alien bouncer page | Subreddits and posts |
| Instagram | Home feed, Explore and Reels: three guided breaths, then catch a "Show the feed" button that runs from your mouse five times | Messages, notifications, profiles, single posts and reels |
| YouTube | Home page gets the same breathe-and-chase gate. Shorts always get the bouncer. Videos play with no "up next" column, no end-screen suggestions, and autoplay off | Search, subscriptions, any video link |
| Facebook | Feed, stories, reels, Watch and the groups feed always go to Messages | Messages, Marketplace, groups, profiles, events |

The bouncer page suggests a few slow breaths with a breathing circle, or a glass of water.

## Install (about a minute)

1. Download this repo: green **Code** button, then **Download ZIP**, and unzip it somewhere you'll keep it.
2. In Chrome, go to `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and pick the unzipped folder.

Works in Chrome, Edge and Brave. After you edit any file, hit the reload arrow on the extension's card.

## Make it yours

Open the folder in Claude Code (or paste the files into Claude) and ask for what you want, for example "block LinkedIn's feed but keep messages", "make the Instagram gate five breaths", or "change what the bouncer says".

- `rules.json`: network rules that redirect feed pages on full page loads.
- `watch.js`, `gate.js`, `youtube.js`, `facebook.js`: small scripts that catch the clicks inside each site that change the page without reloading.
- `blocked.html`, `alien.svg`, `cue.js`: the bouncer page.

Built with Claude Code as part of [Humans V Robots](https://alexsalinsky.github.io/build-room-visuals/build-vault.html).
