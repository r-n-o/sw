# Service Workers

## 💡 Idea: Service Worker as a hardened client-side resource loading mechanism

There's a cool paper talking about how service workers can be used to avoid MITM attacks in HTTPS: https://arxiv.org/pdf/2105.05551.pdf

The TL;DR of the idea is to register a service worker on the website and use it as a way to validate that all resources loaded on the website are signed by a key only the server has.

This is pretty powerful especially for static sites: the key signing the different resources could be a key held by a developer on a smartcard. Or you can even imagine a service worker which has **quorum** logic: content cannot be loaded on the website unless it is signed by N out of M keys.

## 😭 Why it can't work well in practice

The issue with a setup like this is it relies on Trust-On-First-Use (TOFU): if the service worker script is compromised when the user first loads it, all bets are off. An attacker can disable the integrity verification logic and modify loaded resources as they wish.

This TOFU setup would be fine if service workers were fetched once and kept cached for long periods of time. Unfortunately that is not the case. Service workers [**are updated often**](https://developer.chrome.com/docs/workbox/service-worker-lifecycle#when_updates_happen): whenever the user navigates to a page within the service worker's scope (gasp!).

Now, you may think that caching can save you. That's true to some extent: if you specify [`updateViaCache: all`](https://developer.chrome.com/blog/fresher-sw#updateviacache) during registration, the browser will abide by the caching headers and avoid refetching the service worker. However, if `max-age` is greater than 86400 (24 hours), it is treated "as if it were 86400, to avoid users being stuck with a particular version forever" ([source](https://developer.chrome.com/blog/fresher-sw#whats_changing)). This is great for usability, poor for security! Our TOFU system is now bound to be useful for a maximum of 24hrs.

In other words: you have make this TOFU assumption at least once a day!

## What's in this repo

The bare minimum to prove that this idea can't really be useful in real life:

* The `http` folder contains a static HTML page
* This HTML page lets you install / uninstall / fetch a service worker
* The service worker is hosted at `/sw.js`, which is *dynamically* generated. It will replace a target placeholder value in the index.html page (`SERVICE_WORKER_PLEASE_REPLACE_ME`), with a custom message containing the service worker's fetch time. This lets us see, simply by navigating or manually refreshing, when the worker script is updated by the browser.
* The `/sw.js` script is served with immutable caching headers for a **full week**
* The service worker is registered with `updateViaCache: all` to make sure it respects caching headers

To run this locally, use [`wrangler`](https://developers.cloudflare.com/workers/wrangler/) (needed to run the `_worker.js`, which serves the `/sw.js` content):
```
$ npx wrangler pages dev http
```

## See it live

This repo is hosted (via Cloudflare) at https://sw.tkhqlabs.xyz.
