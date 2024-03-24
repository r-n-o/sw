const GENERATED_AT = "WILL_BE_REPLACED_BY_SERVER_TIMESTAMP"

self.addEventListener('install', event => {
  console.log(`Service worker generated at ${GENERATED_AT} is installing`, event);
});

self.addEventListener('activate', event => {
  console.log(`Service worker generated at ${GENERATED_AT} has been activated`, event);
});

self.addEventListener('fetch', event => {
  console.log(`Service worker generated at ${GENERATED_AT} is handling a fetch event`, event);
  event.respondWith(async function(request) {
    // Fetch the response...
    const response = await fetch(request)
    const responseText = await response.text();

    const currentTime = Date.now();
    const secondsAgo = Math.floor((currentTime - GENERATED_AT) / 1000);

    // And look for our placeholder
    const newText = responseText.replace(/SERVICE_WORKER_PLEASE_REPLACE_ME/g, `Content was replaced by Service Worker (sw.js script fetched from server ${secondsAgo}s ago at ${GENERATED_AT})`);
    // Now serve it.
    return new Response(newText, response);
  }(event.request))
});
  