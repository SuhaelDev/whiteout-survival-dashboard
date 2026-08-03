/* ==========================================================================
   mobile.js - iOS phone shell + PWA runtime
   --------------------------------------------------------------------------
   Loads after src/app.js. It never imports from app.js and app.js never calls
   into it: the two talk through the DOM only.

   The integration contract with app.js, in full:
     - Reads  document.body.dataset.activeTab, which renderActive() sets on
       every render (app.js:8947).
     - Reads  #saveStatus text.
     - Clicks #moduleNav [data-tab="..."] to change module, so app.js's own
       handler (app.js:9267) does the work - same code path as the sidebar,
       including its window.scrollTo reset. No duplicated switching logic.
     - Moves  the <aside class="sidebar"> node into the sheet. Moving rather
       than cloning keeps every listener bindEvents() attached and every
       innerHTML target (#moduleNav, #accountPanel, #saveStatus) live.
   Nothing here mutates app.js state.
   ========================================================================== */

const doc = document;
const root = doc.documentElement;

/* --------------------------------------------------------------------------
   Shell detection
   --------------------------------------------------------------------------
   "Phone" means: coarse pointer without hover, and a short edge <= 500px so it
   holds through a rotate. iPads and desktops are excluded, and a desktop
   browser resized narrow keeps the desktop shell because it still reports a
   fine pointer. ?shell=mobile|desktop forces either side for testing.
   The same predicate is duplicated in the inline boot script in index.html so
   the first paint is already correct; keep the two in sync.
   -------------------------------------------------------------------------- */

function detectShell() {
  const forced = new URLSearchParams(location.search).get("shell");
  if (forced === "mobile" || forced === "desktop") return forced;
  const coarse =
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    navigator.maxTouchPoints > 1;
  const shortEdge = Math.min(window.innerWidth, window.innerHeight);
  return coarse && shortEdge <= 500 ? "mobile" : "desktop";
}

let shell = detectShell();
root.dataset.shell = shell;

/* Modules pinned to the tab bar. Everything else lives in the More sheet,
   which shows all sixteen grouped exactly as the sidebar does. */
const TAB_BAR = [
  { id: "overview", label: "Overview", icon: iconOverview },
  { id: "planner", label: "Planner", icon: iconPlanner },
  { id: "inventory", label: "Inventory", icon: iconInventory },
  { id: "heroes", label: "Heroes", icon: iconHeroes },
];

/* --------------------------------------------------------------------------
   Icons - 24x24, stroked with currentColor, sized by CSS
   -------------------------------------------------------------------------- */

function svg(paths) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
}
function iconOverview() {
  return svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.5 20v-6h5v6"/>');
}
function iconPlanner() {
  return svg(
    '<path d="M12 3.2l1.9 4.3 4.6.5-3.5 3.1 1 4.6L12 13.4 8 15.7l1-4.6L5.5 8l4.6-.5z"/><path d="M18.5 16.5l.8 1.8 1.9.2-1.4 1.3.4 1.9-1.7-1-1.7 1 .4-1.9-1.4-1.3 1.9-.2z"/>',
  );
}
function iconInventory() {
  return svg('<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5"/><path d="M12 12v9"/>');
}
function iconHeroes() {
  return svg(
    '<circle cx="9" cy="8" r="3.2"/><path d="M3.4 20c0-3.1 2.5-5.4 5.6-5.4s5.6 2.3 5.6 5.4"/><path d="M16.2 5.2a3.2 3.2 0 0 1 0 6.1"/><path d="M17.6 14.9c2 .7 3.4 2.6 3.4 5.1"/>',
  );
}
function iconMore() {
  return svg(
    '<circle cx="5.5" cy="6.5" r="1.4"/><circle cx="5.5" cy="12" r="1.4"/><circle cx="5.5" cy="17.5" r="1.4"/><path d="M10 6.5h10"/><path d="M10 12h10"/><path d="M10 17.5h10"/>',
  );
}
function iconMenu() {
  return svg('<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>');
}

/* --------------------------------------------------------------------------
   DOM construction
   -------------------------------------------------------------------------- */

let topbar = null;
let tabbar = null;
let sheet = null;
let sheetBody = null;

function buildChrome() {
  if (tabbar) return;

  topbar = doc.createElement("header");
  topbar.className = "mtopbar";
  topbar.innerHTML = `
    <span class="mtopbar__mark" aria-hidden="true">W</span>
    <div class="mtopbar__titles">
      <span class="mtopbar__title" id="mTopTitle">Whiteout Tracker</span>
      <span class="mtopbar__status" id="mTopStatus">Loading data</span>
    </div>
    <button type="button" class="mtopbar__menu" data-msheet-open aria-label="All modules and settings" aria-expanded="false" aria-controls="mSheet">${iconMenu()}</button>
  `;

  tabbar = doc.createElement("nav");
  tabbar.className = "mtabs";
  tabbar.id = "mTabs";
  tabbar.setAttribute("aria-label", "Primary");
  tabbar.innerHTML =
    TAB_BAR.map(
      (t) =>
        `<button type="button" class="mtab" data-mtab="${t.id}" aria-label="${t.label}">${t.icon()}<span class="mtab__label">${t.label}</span></button>`,
    ).join("") +
    `<button type="button" class="mtab" data-msheet-open aria-label="All modules and settings" aria-expanded="false" aria-controls="mSheet">${iconMore()}<span class="mtab__label">More</span></button>`;

  sheet = doc.createElement("div");
  sheet.className = "msheet";
  sheet.id = "mSheet";
  sheet.innerHTML = `
    <div class="msheet__scrim" data-msheet-close></div>
    <div class="msheet__panel" role="dialog" aria-modal="true" aria-label="All modules and settings">
      <div class="msheet__grab" data-msheet-grab></div>
      <div class="msheet__body" id="mSheetBody"></div>
    </div>
  `;
  sheetBody = sheet.querySelector("#mSheetBody");

  const main = doc.querySelector(".main");
  if (main) main.insertBefore(topbar, main.firstChild);
  doc.body.append(tabbar, sheet);
  setSheetHidden(true);

  measureTabBar();
}

/* The tab bar height feeds .content-area's bottom padding through a custom
   property, so the clearance follows the real rendered height. */
function measureTabBar() {
  if (!tabbar) return;
  const h = Math.round(tabbar.getBoundingClientRect().height);
  const inset = parseFloat(getComputedStyle(tabbar).paddingBottom) || 0;
  if (h > 0) root.style.setProperty("--mtabs-h", `${Math.max(48, h - inset)}px`);
}

/* --------------------------------------------------------------------------
   Sidebar adoption
   -------------------------------------------------------------------------- */

function adoptSidebar() {
  const sidebar = doc.querySelector(".sidebar");
  if (!sidebar) return;
  if (shell === "mobile") {
    if (!sheetBody) return;
    if (sidebar.parentElement !== sheetBody) sheetBody.appendChild(sidebar);
    // Only now is it safe for CSS to hide the in-shell sidebar.
    root.dataset.mchrome = "ready";
  } else {
    const appShell = doc.querySelector(".app-shell");
    if (appShell && sidebar.parentElement !== appShell) appShell.prepend(sidebar);
    delete root.dataset.mchrome;
  }
}

/* --------------------------------------------------------------------------
   Sheet open / close
   -------------------------------------------------------------------------- */

let sheetOpen = false;
let lastFocus = null;

function setExpanded(value) {
  doc.querySelectorAll("[data-msheet-open]").forEach((el) => {
    el.setAttribute("aria-expanded", String(value));
  });
}

const SUPPORTS_INERT = "inert" in HTMLElement.prototype;

/* The sheet stays in the layout when closed (see the note in mobile.css), so
   it has to be explicitly removed from the tab order and the a11y tree. */
function setSheetHidden(hidden) {
  if (!sheet) return;
  if (SUPPORTS_INERT) sheet.inert = hidden;
  sheet.setAttribute("aria-hidden", String(hidden));
}

function openSheet() {
  if (!sheet || sheetOpen) return;
  lastFocus = doc.activeElement;
  sheetOpen = true;
  setSheetHidden(false);
  // Flush layout before the transform changes, so the slide always animates
  // from the parked position rather than from wherever the last frame left it.
  void sheet.offsetWidth;
  sheet.classList.add("open");
  setExpanded(true);
  const appShell = doc.querySelector(".app-shell");
  if (appShell && SUPPORTS_INERT) appShell.inert = true;
  // Land focus on the active module so VoiceOver announces where you are.
  const target =
    sheetBody.querySelector(".nav-button.active") || sheetBody.querySelector(".nav-button");
  window.setTimeout(() => target?.focus({ preventScroll: true }), 60);
}

function closeSheet() {
  if (!sheet || !sheetOpen) return;
  sheetOpen = false;
  sheet.classList.remove("open", "dragging");
  sheet.querySelector(".msheet__panel").style.transform = "";
  setExpanded(false);
  const appShell = doc.querySelector(".app-shell");
  if (appShell && SUPPORTS_INERT) appShell.inert = false;
  if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
  lastFocus = null;
  // Wait out the slide before making it inert, or focus jumps mid-animation.
  window.setTimeout(() => {
    if (!sheetOpen) setSheetHidden(true);
  }, 320);
}

/* Swipe the sheet down to dismiss: from the grabber always, and from the body
   only when it is already scrolled to the top, so the gesture never steals a
   scroll. */
function bindSheetDrag() {
  const panel = sheet.querySelector(".msheet__panel");
  const grab = sheet.querySelector("[data-msheet-grab]");
  let startY = 0;
  let dy = 0;
  let active = false;

  const start = (event) => {
    if (!sheetOpen || event.isPrimary === false) return;
    const fromGrab = event.currentTarget === grab;
    if (!fromGrab && sheetBody.scrollTop > 0) return;
    active = true;
    startY = event.clientY;
    dy = 0;
    sheet.classList.add("dragging");
  };

  const move = (event) => {
    if (!active) return;
    dy = event.clientY - startY;
    if (dy < 0) dy = dy / 4; // resist upward pull
    panel.style.transform = `translate3d(0, ${Math.max(0, dy)}px, 0)`;
  };

  const end = () => {
    if (!active) return;
    active = false;
    sheet.classList.remove("dragging");
    panel.style.transform = "";
    const tall = panel.getBoundingClientRect().height;
    if (dy > Math.min(120, tall * 0.28)) closeSheet();
  };

  [grab, sheetBody].forEach((el) => {
    el.addEventListener("pointerdown", start);
  });
  panel.addEventListener("pointermove", move);
  panel.addEventListener("pointerup", end);
  panel.addEventListener("pointercancel", end);
}

/* --------------------------------------------------------------------------
   Wiring
   -------------------------------------------------------------------------- */

function switchTo(id, retry = true) {
  // Re-use app.js's own handler rather than reimplementing it: activeTab and
  // renderActive() are module-private in app.js, so clicking its real nav
  // button is the only way to switch modules without duplicating that logic.
  const button = doc.querySelector(`#moduleNav [data-tab="${CSS.escape(id)}"]`);
  if (button) {
    // #moduleNav lives inside the closed (inert) sheet. Lift inert across the
    // synthetic click so browsers that suppress activation in inert subtrees
    // still deliver it.
    const wasInert = !!(sheet && sheet.inert);
    if (wasInert) sheet.inert = false;
    button.click();
    if (wasInert) sheet.inert = true;
    return true;
  }
  // renderNav() has not run yet (init() is still awaiting its data fetches).
  if (retry) window.setTimeout(() => switchTo(id, false), 400);
  return false;
}

function bindChrome() {
  doc.addEventListener("click", (event) => {
    const open = event.target.closest("[data-msheet-open]");
    if (open) {
      event.preventDefault();
      sheetOpen ? closeSheet() : openSheet();
      return;
    }
    if (event.target.closest("[data-msheet-close]")) {
      closeSheet();
      return;
    }
    const tab = event.target.closest("[data-mtab]");
    if (tab) {
      event.preventDefault();
      switchTo(tab.dataset.mtab);
      return;
    }
    // A module chosen from inside the sheet closes it; app.js already switched.
    if (sheetOpen && event.target.closest(".msheet [data-tab]")) closeSheet();
  });

  doc.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (sheetOpen) {
      event.preventDefault();
      closeSheet();
    }
  });

  // Keep focus inside the sheet while it is modal.
  sheet.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !sheetOpen) return;
    const focusables = sheet.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  bindSheetDrag();
}

/* --------------------------------------------------------------------------
   Mirror app state into the chrome
   -------------------------------------------------------------------------- */

function labelFor(id) {
  const button = doc.querySelector(`#moduleNav [data-tab="${CSS.escape(id)}"]`);
  if (button) return button.textContent.trim();
  const known = TAB_BAR.find((t) => t.id === id);
  return known ? known.label : "Whiteout Tracker";
}

function syncActive() {
  const active = doc.body.dataset.activeTab || "overview";
  if (tabbar) {
    let matched = false;
    tabbar.querySelectorAll("[data-mtab]").forEach((el) => {
      const on = el.dataset.mtab === active;
      el.classList.toggle("active", on);
      el.setAttribute("aria-current", on ? "page" : "false");
      if (on) matched = true;
    });
    // Nothing pinned matches, so "More" carries the active state.
    const more = tabbar.querySelector("[data-msheet-open]");
    if (more) more.classList.toggle("active", !matched);
  }
  const title = doc.getElementById("mTopTitle");
  if (title) title.textContent = labelFor(active);
}

function syncStatus() {
  const from = doc.getElementById("saveStatus");
  const to = doc.getElementById("mTopStatus");
  if (from && to && to.textContent !== from.textContent) to.textContent = from.textContent;
}

/* Keep the URL's ?tab= in step so a standalone relaunch or a reload reopens the
   module you were on - app.js reads that param at boot. Only ever fired by an
   explicit tab change, well after Supabase's detectSessionInUrl has consumed
   and cleaned any auth params, and the hash is left alone. */
function syncUrl() {
  const active = doc.body.dataset.activeTab;
  if (!active) return;
  const url = new URL(location.href);
  if (url.searchParams.get("tab") === active) return;
  url.searchParams.set("tab", active);
  history.replaceState(history.state, "", url);
}

/* --------------------------------------------------------------------------
   Collapsible chief profile
   --------------------------------------------------------------------------
   The six profile fields live inside the hero band and take about half of an
   iPhone's first screen, above every module's actual content. They are
   set-once values, so on a phone they collapse behind a summary that shows the
   two you actually glance at.

   #profileInputs is re-rendered by renderProfile() via innerHTML on the
   element itself, so a wrapper around it survives every render, and the
   [data-path] listeners are delegated on document so the fields keep saving.
   -------------------------------------------------------------------------- */

const PROFILE_OPEN_KEY = "wos-dashboard-mprofile-open-v1";

function wrapProfile() {
  const grid = doc.getElementById("profileInputs");
  if (!grid || grid.closest(".mprofile")) return;

  const box = doc.createElement("details");
  box.className = "mprofile";
  try {
    box.open = localStorage.getItem(PROFILE_OPEN_KEY) === "1";
  } catch {
    box.open = false;
  }

  const summary = doc.createElement("summary");
  summary.className = "mprofile__summary";
  summary.innerHTML = `<span class="mprofile__label">Chief profile</span><span class="mprofile__facts" id="mProfileFacts"></span>`;

  grid.parentNode.insertBefore(box, grid);
  box.append(summary, grid);

  box.addEventListener("toggle", () => {
    try {
      localStorage.setItem(PROFILE_OPEN_KEY, box.open ? "1" : "0");
    } catch {
      /* private mode */
    }
  });
}

function syncProfileFacts() {
  const facts = doc.getElementById("mProfileFacts");
  if (!facts) return;
  const value = (path) => {
    const el = doc.querySelector(`#profileInputs [data-path="${CSS.escape(path)}"]`);
    return el && el.value !== "" ? el.value : null;
  };
  const parts = [
    value("profile.chief_name"),
    value("profile.furnace_level"),
    value("profile.state_number") ? `State ${value("profile.state_number")}` : null,
  ].filter(Boolean);
  const text = parts.join(" · ");
  if (facts.textContent !== text) facts.textContent = text;
}

/* --------------------------------------------------------------------------
   Input hygiene
   --------------------------------------------------------------------------
   app.js re-renders whole panels with innerHTML, so attributes have to be
   re-stamped after each render. inputmode gives number fields the compact iOS
   keypad, and the autocorrect family stops Safari offering to autofill a
   contact name into a resource count.
   -------------------------------------------------------------------------- */

function stampInputs(scope) {
  scope.querySelectorAll("input[type='number']:not([inputmode])").forEach((el) => {
    const step = el.getAttribute("step");
    el.setAttribute("inputmode", !step || Number.isInteger(Number(step)) ? "numeric" : "decimal");
    el.setAttribute("autocomplete", "off");
    el.setAttribute("autocorrect", "off");
    el.setAttribute("autocapitalize", "off");
    el.setAttribute("spellcheck", "false");
  });
  scope
    .querySelectorAll("input[type='text']:not([data-mstamped]), input[type='search']:not([data-mstamped])")
    .forEach((el) => {
      el.dataset.mstamped = "1";
      el.setAttribute("autocorrect", "off");
      el.setAttribute("spellcheck", "false");
    });
}

function watchRenders() {
  const area = doc.querySelector(".content-area");
  let queued = false;
  const run = () => {
    queued = false;
    syncActive();
    syncStatus();
    if (shell === "mobile") {
      stampInputs(doc);
      syncProfileFacts();
    }
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  };

  // renderActive() writes body[data-active-tab] on every render, which makes
  // body attributes a cheap proxy for "the app just re-rendered".
  new MutationObserver(schedule).observe(doc.body, {
    attributes: true,
    attributeFilter: ["data-active-tab"],
  });
  if (area) new MutationObserver(schedule).observe(area, { childList: true, subtree: false });
  const status = doc.getElementById("saveStatus");
  if (status) new MutationObserver(syncStatus).observe(status, { childList: true, characterData: true, subtree: true });
  schedule();
}

/* --------------------------------------------------------------------------
   Software keyboard
   --------------------------------------------------------------------------
   iOS renders the keyboard's accessory bar over anything bottom-fixed, so the
   tab bar drops out of the way while a field is focused.
   -------------------------------------------------------------------------- */

function watchKeyboard() {
  const vv = window.visualViewport;
  if (!vv) return;
  const update = () => {
    const hidden = window.innerHeight - vv.height - vv.offsetTop;
    root.dataset.kb = hidden > 140 ? "open" : "closed";
  };
  vv.addEventListener("resize", update);
  vv.addEventListener("scroll", update);
  update();
}

/* --------------------------------------------------------------------------
   Toasts
   -------------------------------------------------------------------------- */

let toastEl = null;
let toastTimer = 0;

function toast(message, action) {
  if (!toastEl) {
    toastEl = doc.createElement("div");
    toastEl.className = "mtoast";
    toastEl.setAttribute("role", "status");
    doc.body.appendChild(toastEl);
  }
  window.clearTimeout(toastTimer);
  toastEl.innerHTML = `<span></span>`;
  toastEl.firstChild.textContent = message;
  if (action) {
    const button = doc.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", () => {
      hideToast();
      action.run();
    });
    toastEl.appendChild(button);
  }
  requestAnimationFrame(() => toastEl.classList.add("show"));
  if (!action) toastTimer = window.setTimeout(hideToast, 3600);
}

function hideToast() {
  if (toastEl) toastEl.classList.remove("show");
}

/* --------------------------------------------------------------------------
   Service worker
   -------------------------------------------------------------------------- */

const STANDALONE =
  window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;

  navigator.serviceWorker
    .register("sw.js")
    .then((reg) => {
      // A worker sitting in "waiting" means a newer build is cached and ready.
      const offerUpdate = (worker) => {
        if (!worker) return;
        toast("A new version is ready.", {
          label: "Reload",
          run: () => worker.postMessage({ type: "SKIP_WAITING" }),
        });
      };

      if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);

      reg.addEventListener("updatefound", () => {
        const incoming = reg.installing;
        if (!incoming) return;
        incoming.addEventListener("statechange", () => {
          // No controller means this is the very first install, not an update.
          if (incoming.state === "installed" && navigator.serviceWorker.controller) {
            offerUpdate(reg.waiting || incoming);
          }
        });
      });

      // Re-check on foreground, which is when a home-screen app usually wakes.
      doc.addEventListener("visibilitychange", () => {
        if (!doc.hidden) reg.update().catch(() => {});
      });
    })
    .catch((error) => console.warn("[pwa] service worker registration failed", error));

  /* clients.claim() makes the very first install take control of this page,
     which fires controllerchange too. Reloading there would mean every first
     visit silently reloads itself - so only reload when we are replacing a
     worker that was already driving the page, i.e. a real update. */
  const hadController = !!navigator.serviceWorker.controller;
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || reloading) return;
    reloading = true;
    location.reload();
  });
}

function watchConnectivity() {
  window.addEventListener("offline", () => toast("Offline - showing your saved data."));
  window.addEventListener("online", () => toast("Back online."));
}

/* --------------------------------------------------------------------------
   Add to Home Screen hint (iOS Safari has no install prompt API)
   -------------------------------------------------------------------------- */

const A2HS_KEY = "wos-dashboard-a2hs-dismissed-v1";

function maybeOfferInstall() {
  if (shell !== "mobile" || STANDALONE) return;
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!isIOS) return;
  try {
    if (localStorage.getItem(A2HS_KEY)) return;
  } catch {
    return;
  }
  const remember = () => {
    try {
      localStorage.setItem(A2HS_KEY, "1");
    } catch {
      /* private mode - just don't remember it */
    }
  };

  const show = () => {
    // Don't stack it on top of the sheet or the setup wizard.
    if (sheetOpen || doc.getElementById("wizardOverlay")) {
      window.setTimeout(show, 8000);
      return;
    }
    toast("Install it: tap Share, then Add to Home Screen.", {
      label: "Got it",
      run: remember,
    });
  };

  window.setTimeout(show, 12000);
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */

function applyShell() {
  shell = detectShell();
  root.dataset.shell = shell;
  if (shell === "mobile") {
    buildChrome();
    if (!tabbar.dataset.bound) {
      tabbar.dataset.bound = "1";
      bindChrome();
    }
    wrapProfile();
  } else if (sheetOpen) {
    closeSheet();
  }
  adoptSidebar();
  measureTabBar();
  syncActive();
  syncStatus();
  if (shell === "mobile") syncProfileFacts();
}

function start() {
  applyShell();
  watchRenders();
  watchKeyboard();
  watchConnectivity();
  registerServiceWorker();
  maybeOfferInstall();

  // Only start writing ?tab= once the user has actually navigated.
  doc.addEventListener("click", (event) => {
    if (event.target.closest("[data-tab], [data-mtab]")) {
      window.setTimeout(syncUrl, 0);
    }
  });

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(applyShell, 150);
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
}

if (doc.readyState === "loading") {
  doc.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
