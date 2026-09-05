/* ==========================================================================
   Service worker - Whiteout Tracker
   --------------------------------------------------------------------------
   Offline goal (as chosen): app shell + game data. The dashboard opens and
   computes with no network; item art is cached as you browse rather than
   pre-downloaded, because assets/game/ is ~20 MB and precaching it would make
   installing the app a 20 MB event.

   Two independent version strings exist upstream and both have to be honoured
   or you get a mismatched pair after a deploy:
     BUILD - the ?v= on src/styles.css, src/mobile.css and src/app.js in
             index.html.
     DATA  - ASSET_CACHE_VERSION in src/app.js (line ~1370), which app.js
             appends to every data/*.json and assets/game/* request.
   Bump BUILD when you touch the shell; bump both here and in app.js when you
   touch data. The cache name embeds both, so a change to either drops the old
   caches wholesale on activate.
   ========================================================================== */

const BUILD = "20260906-gearsets";
const DATA = "20260731f";

const SHELL_CACHE = `wos-shell-${BUILD}`;
const DATA_CACHE = `wos-data-${BUILD}-${DATA}`;
const ART_CACHE = `wos-art-${DATA}`;
const CURRENT = new Set([SHELL_CACHE, DATA_CACHE, ART_CACHE]);

/* Cap the runtime art cache so a long browsing session cannot fill the origin
   quota and get the whole storage bucket evicted by iOS. */
const ART_LIMIT = 400;

const SHELL_ASSETS = [
  "./",
  "./index.html",
  `./src/styles.css?v=${BUILD}`,
  `./src/mobile.css?v=${BUILD}`,
  `./src/app.js?v=${BUILD}`,
  `./src/mobile.js?v=${BUILD}`,
  "./manifest.webmanifest",
  "./assets/favicon.svg",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-192.png",
  "./assets/icons/maskable-512.png",
  "./assets/frost-command-dashboard-mobile.webp",
  "./assets/frost-command-dashboard-mobile.jpg",
];

/* app.js fetches these four on boot. The first two are hard fetches: if either
   fails the app wipes .content-area and shows "Data could not load", so these
   are the ones offline support actually hinges on. */
const DATA_ASSETS = [
  `./data/game-data.json?v=${DATA}`,
  `./data/player-state-template.json?v=${DATA}`,
  `./data/current-player-state.json?v=${DATA}`,
  `./assets/game/manifest.json?v=${DATA}`,
];

/* --------------------------------------------------------------------------
   Install
   -------------------------------------------------------------------------- */

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const shell = await caches.open(SHELL_CACHE);
      // addAll is atomic - one 404 and nothing is cached - so add individually
      // and let an optional file fail without taking the install with it.
      await Promise.all(
        SHELL_ASSETS.map((url) =>
          shell.add(new Request(url, { cache: "reload" })).catch((error) => {
            console.warn("[sw] shell asset skipped", url, error);
          }),
        ),
      );

      const data = await caches.open(DATA_CACHE);
      await Promise.all(
        DATA_ASSETS.map((url) =>
          data.add(new Request(url, { cache: "reload" })).catch((error) => {
            console.warn("[sw] data asset skipped", url, error);
          }),
        ),
      );
    })(),
  );
});

/* --------------------------------------------------------------------------
   Activate
   -------------------------------------------------------------------------- */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith("wos-") && !CURRENT.has(name))
          .map((name) => caches.delete(name)),
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable().catch(() => {});
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */

/* app.js cache-busts with ?v=, and index.html uses a different string from the
   one app.js uses for data. Falling back to an ignoreSearch match means a
   version skew degrades to "serve the cached copy" rather than "go offline". */
async function cacheMatch(cacheName, request) {
  const cache = await caches.open(cacheName);
  return (
    (await cache.match(request)) ||
    (await cache.match(request, { ignoreSearch: true })) ||
    undefined
  );
}

async function trimCache(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= limit) return;
  // Cache keys are insertion-ordered, so the head is the oldest.
  await Promise.all(keys.slice(0, keys.length - limit).map((key) => cache.delete(key)));
}

/* Keeps background work alive past respondWith. The event is passed in rather
   than held in a module variable, because concurrent fetches would otherwise
   race over a shared "current event". */
function keepAlive(event, promise) {
  const settled = promise.catch(() => {});
  try {
    event.waitUntil(settled);
  } catch {
    /* waitUntil is only valid synchronously inside dispatch; the work still
       runs, it just is not guaranteed to finish before the worker sleeps. */
  }
}

/* Exact-match first, on purpose. Matching with ignoreSearch up front would
   serve last deploy's src/app.js?v=OLD alongside this deploy's index.html -
   the exact version skew the ?v= strings exist to prevent. A loose match is
   only acceptable as a last resort when the network is gone. */
async function staleWhileRevalidate(event, cacheName, request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      // Two of app.js's boot fetches use cache:"no-store"; a put that the
      // browser refuses must not take the live response down with it.
      if (response && response.ok) {
        try {
          cache.put(request, response.clone()).catch(() => {});
        } catch {
          /* not cacheable - still return the response */
        }
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    // Refresh in the background; the user still gets an instant render.
    keepAlive(event, network);
    return cached;
  }
  const fresh = await network;
  if (fresh) return fresh;
  // Offline with no exact hit: a previous version's copy beats nothing.
  const loose = await cache.match(request, { ignoreSearch: true });
  if (loose) return loose;
  throw new Error(`unavailable offline: ${request.url}`);
}

async function cacheFirst(event, cacheName, request, { limit } = {}) {
  const cached = await cacheMatch(cacheName, request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok && response.status === 200) {
    const cache = await caches.open(cacheName);
    try {
      await cache.put(request, response.clone());
      if (limit) keepAlive(event, trimCache(cacheName, limit));
    } catch {
      /* quota or an uncacheable request - serve it anyway */
    }
  }
  return response;
}

/* --------------------------------------------------------------------------
   Fetch
   -------------------------------------------------------------------------- */

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  /* Cross-origin: esm.sh (Supabase) and cdn.jsdelivr (three.js + the GLB).
     app.js already treats all three as optional and fails soft, so staying out
     of the way is both simpler and safer than caching opaque responses. */
  if (!sameOrigin) return;

  /* Never cache the API. /api/state carries a bearer token and /api/config
     gates auth; a stale copy of either is worse than an error. */
  if (url.pathname.startsWith("/api/")) return;

  // Navigations: network first so a deploy is picked up, cached shell on
  // failure. The address bar keeps its original URL, so Supabase's
  // detectSessionInUrl still sees any auth params on a magic-link return.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preload = await event.preloadResponse;
          if (preload) return preload;
          const fresh = await fetch(request);
          if (fresh && fresh.ok) {
            const cache = await caches.open(SHELL_CACHE);
            cache.put("./index.html", fresh.clone());
          }
          return fresh;
        } catch {
          return (
            (await cacheMatch(SHELL_CACHE, "./index.html")) ||
            (await cacheMatch(SHELL_CACHE, "./")) ||
            new Response("Offline", { status: 503, statusText: "Offline" })
          );
        }
      })(),
    );
    return;
  }

  // Game data: instant from cache, refreshed in the background.
  if (url.pathname.startsWith("/data/") && url.pathname.endsWith(".json")) {
    event.respondWith(
      staleWhileRevalidate(event, DATA_CACHE, request).catch(
        () => new Response("[]", { status: 503, headers: { "Content-Type": "application/json" } }),
      ),
    );
    return;
  }

  // assets/game/manifest.json is data, not art.
  if (url.pathname === "/assets/game/manifest.json") {
    event.respondWith(
      staleWhileRevalidate(event, DATA_CACHE, request).catch(
        () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }),
      ),
    );
    return;
  }

  // Item art and icons: cache on first sight, bounded.
  if (/\.(png|webp|jpe?g|svg|gif|avif)$/i.test(url.pathname)) {
    const isShellArt = url.pathname.startsWith("/assets/icons/") || url.pathname.startsWith("/assets/splash/");
    event.respondWith(
      cacheFirst(event, isShellArt ? SHELL_CACHE : ART_CACHE, request, {
        limit: isShellArt ? undefined : ART_LIMIT,
      }).catch(async () => {
        const cached = await cacheMatch(ART_CACHE, request);
        // A transparent 1x1 keeps a broken icon from breaking a grid layout.
        return (
          cached ||
          new Response(
            Uint8Array.from(
              atob(
                "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
              ),
              (c) => c.charCodeAt(0),
            ),
            { headers: { "Content-Type": "image/gif" } },
          )
        );
      }),
    );
    return;
  }

  // The shell itself: CSS, JS, the manifest, fonts.
  if (/\.(css|js|mjs|webmanifest|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      staleWhileRevalidate(event, SHELL_CACHE, request).catch(async () => {
        const cached = await cacheMatch(SHELL_CACHE, request);
        if (cached) return cached;
        throw new Error("offline");
      }),
    );
  }
});
