/* Shared pieces of the responsive audit: the viewport matrix, the in-page
   probe library (window.__audit), context options and the state seed.
   scripts/responsive-audit.mjs drives the full matrix with these; a one-off
   Playwright script can import them to probe after its own interactions:

     import { chromium } from "playwright";
     import { parseViewport, contextOptions, SEED, installAudit, waitForApp } from "./scripts/responsive-audit-lib.mjs";
     const vp = parseViewport("m390");
     const browser = await chromium.launch();
     const context = await browser.newContext(contextOptions(vp));
     await context.addInitScript(SEED);
     const page = await context.newPage();
     await page.goto(`http://127.0.0.1:5173/?shell=${vp.shell}&tab=heroes`, { waitUntil: "load" });
     await waitForApp(page);
     await installAudit(page, [".audit-work/fixes/my-fixes.css"]);
     // ... your own clicks / typing ...
     const result = await page.evaluate((cfg) => window.__audit.probe(cfg), { touch: vp.touch });
     console.log(result.counts, result.issues);
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";

export const ALL_TABS = [
  "overview", "planner", "inventory", "buildings", "chief-gear", "charms",
  "heroes", "hero-gear", "pets", "experts", "research", "t12-research",
  "troops", "svs", "skins", "sources",
];

/* name: [width, height, shell, touch, dpr] */
export const VIEWPORTS = {
  // Phones -> mobile shell. Portrait.
  m320: [320, 568, "mobile", true, 2],   // iPhone SE 1 / small Android
  m360: [360, 780, "mobile", true, 3],   // Galaxy S / most Android
  m375: [375, 667, "mobile", true, 2],   // iPhone SE 2-3 / 8
  m390: [390, 844, "mobile", true, 3],   // iPhone 12-14
  m412: [412, 915, "mobile", true, 2.6], // Pixel 7-8
  m430: [430, 932, "mobile", true, 3],   // iPhone Pro Max
  // Phones, landscape (short edge <= 500 keeps the mobile shell).
  mL667: [667, 375, "mobile", true, 2],
  mL844: [844, 390, "mobile", true, 3],
  mL932: [932, 430, "mobile", true, 3],
  // Tablets -> desktop shell with a coarse pointer.
  t600: [600, 960, "desktop", true, 2],   // 7" Android tablet
  t768: [768, 1024, "desktop", true, 2],  // iPad portrait
  t834: [834, 1194, "desktop", true, 2],  // iPad Pro 11 portrait
  t1024: [1024, 768, "desktop", true, 2], // iPad landscape
  t1194: [1194, 834, "desktop", true, 2], // iPad Pro 11 landscape
  // Desktop windows, fine pointer.
  d700: [700, 900, "desktop", false, 1],
  d900: [900, 900, "desktop", false, 1],
  d1100: [1100, 800, "desktop", false, 1],
  d1280: [1280, 720, "desktop", false, 1],
  d1366: [1366, 768, "desktop", false, 1],
  d1440: [1440, 900, "desktop", false, 1],
  d1920: [1920, 1080, "desktop", false, 1],
  d2560: [2560, 1440, "desktop", false, 1],
};

export const PHONE_VIEWPORTS = Object.keys(VIEWPORTS).filter((k) => k.startsWith("m"));
export const TABLET_VIEWPORTS = Object.keys(VIEWPORTS).filter((k) => k.startsWith("t"));
export const DESKTOP_VIEWPORTS = Object.keys(VIEWPORTS).filter((k) => k.startsWith("d"));

export function parseViewport(name) {
  if (VIEWPORTS[name]) {
    const [w, h, shell, touch, dpr] = VIEWPORTS[name];
    return { name, w, h, shell, touch, dpr };
  }
  // ad-hoc: 414x896m (mobile shell) or 1000x700d (desktop shell)
  const m = /^(\d+)x(\d+)([md])?$/.exec(name);
  if (!m) throw new Error(`unknown viewport ${name}`);
  const shell = m[3] === "m" ? "mobile" : "desktop";
  return { name, w: Number(m[1]), h: Number(m[2]), shell, touch: shell === "mobile", dpr: shell === "mobile" ? 2 : 1 };
}

export const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36";
export const IPAD_UA =
  "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

export function contextOptions(vp) {
  return {
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.dpr,
    hasTouch: vp.touch,
    isMobile: vp.shell === "mobile",
    serviceWorkers: "block",
    reducedMotion: "reduce",
    userAgent: vp.touch ? (vp.shell === "mobile" ? ANDROID_UA : IPAD_UA) : undefined,
  };
}

/* Marks the profile as configured so the onboarding wizard stays closed, and
   owner_profile:true makes app.js load the bundled game extract - the real
   account data, so every module renders with realistic content. */
export const SEED = () => {
  try {
    if (!localStorage.getItem("wos-personal-dashboard-state-v1")) {
      localStorage.setItem(
        "wos-personal-dashboard-state-v1",
        JSON.stringify({ onboarded_at: "2026-08-03T00:00:00.000Z", owner_profile: true }),
      );
    }
    localStorage.setItem("wos-dashboard-a2hs-dismissed-v1", "1");
  } catch {}
};

export async function waitForApp(page) {
  await page.waitForFunction("document.querySelectorAll('#moduleNav .nav-button').length > 0", null, { timeout: 30000 });
  await page
    .waitForFunction("document.querySelector('.tab-panel.active') && document.querySelector('.tab-panel.active').children.length > 0", null, { timeout: 30000 })
    .catch(() => {});
}

/* Injects extra stylesheets (fix candidates) and the annotate styles, then
   installs window.__audit. Call after every page.goto(). */
export async function installAudit(page, extraCssFiles = []) {
  for (const file of extraCssFiles) await page.addStyleTag({ content: fs.readFileSync(path.resolve(file), "utf8") });
  await page.addStyleTag({ content: ANNOTATE_CSS });
  await page.evaluate(IN_PAGE_LIB);
  await page.waitForTimeout(400);
}

export const ANNOTATE_CSS = `
html[data-audit-annotate] [data-audit-flag] { outline: 3px dashed #ff3b3b !important; outline-offset: -2px !important; }
html[data-audit-annotate] [data-audit-flag="overlap"] { outline-color: #ff9f0a !important; }
html[data-audit-annotate] [data-audit-flag="text-overflow"] { outline-color: #ffd60a !important; }
html[data-audit-annotate] [data-audit-flag="clipped"], html[data-audit-annotate] [data-audit-flag="clipped-at-viewport"] { outline-color: #ff375f !important; }
html[data-audit-annotate] [data-audit-flag="sticky-see-through"] { outline-color: #bf5af2 !important; }
html[data-audit-annotate] [data-audit-flag="truncated"], html[data-audit-annotate] [data-audit-flag="small-target"],
html[data-audit-annotate] [data-audit-flag="small-font-control"], html[data-audit-annotate] [data-audit-flag="tiny-text"] { outline: 2px dotted #64d2ff !important; }
`;

/* Kinds that get a screenshot and count as layout defects. */
export const SHOT_KINDS = new Set([
  "viewport-overflow", "scroller-wider-than-viewport", "clipped-at-viewport", "clipped",
  "text-overflow", "overlap", "sticky-see-through", "under-bar",
]);

export function flagsOf(results) {
  const c = {};
  let hscroll = false;
  for (const r of results) {
    if (!r || r.error) continue;
    if (r.hscroll) hscroll = true;
    for (const [k, v] of Object.entries(r.counts || {})) c[k] = Math.max(c[k] || 0, v);
  }
  const code = [];
  if (hscroll) code.push("H!");
  if (c["viewport-overflow"]) code.push(`V${c["viewport-overflow"]}`);
  if (c["scroller-wider-than-viewport"]) code.push(`W${c["scroller-wider-than-viewport"]}`);
  if (c["clipped-at-viewport"] || c["clipped"]) code.push(`C${(c["clipped-at-viewport"] || 0) + (c["clipped"] || 0)}`);
  if (c["text-overflow"]) code.push(`T${c["text-overflow"]}`);
  if (c["overlap"]) code.push(`O${c["overlap"]}`);
  if (c["sticky-see-through"]) code.push(`S${c["sticky-see-through"]}`);
  if (c["under-bar"]) code.push("B!");
  if (c["small-font-control"]) code.push(`f${c["small-font-control"]}`);
  if (c["small-target"]) code.push(`t${c["small-target"]}`);
  if (c["truncated"]) code.push(`e${c["truncated"]}`);
  if (c["tiny-text"]) code.push(`x${c["tiny-text"]}`);
  return code.length ? code.join(" ") : "ok";
}

export const CODES_LEGEND =
  "Codes: H! page scrolls sideways · Vn elements past the viewport · Wn scrollers wider than viewport · Cn clipped · Tn text wider than its box · On overlaps · Sn see-through sticky cells · B! content under the tab bar · fn sub-16px controls · tn sub-40px targets · en ellipsis truncations · xn sub-10px text";

/* ------------------------------------------------------------------------
   In-page library. Evaluated as a string so it carries no Node closures.
   ------------------------------------------------------------------------ */
export const IN_PAGE_LIB = String.raw`(() => {
  const doc = document;
  const REPLACED = new Set(["IMG", "SVG", "CANVAS", "VIDEO", "INPUT", "SELECT", "TEXTAREA", "BUTTON", "PROGRESS", "METER"]);
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEMPLATE", "LINK", "META", "HEAD", "NOSCRIPT", "OPTION", "BR", "WBR"]);
  const tagOf = (el) => String(el.tagName || "").toUpperCase();
  const classes = (el) => {
    const c = typeof el.className === "string" ? el.className : (el.className && el.className.baseVal) || "";
    return c.trim().split(/\s+/).filter(Boolean).slice(0, 4);
  };
  const sig = (el) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (classes(el).length ? "." + classes(el).join(".") : "");
  const pathOf = (el) => {
    const parts = [];
    let p = el;
    for (let i = 0; p && p !== doc.body && i < 6; i += 1) {
      parts.unshift(sig(p));
      p = p.parentElement;
    }
    return parts.join(" > ");
  };
  const textOf = (el) => {
    const t = el.innerText != null && String(el.innerText).trim() ? el.innerText : (el.value ?? el.getAttribute("aria-label") ?? el.alt ?? el.textContent ?? "");
    return String(t).replace(/\s+/g, " ").trim().slice(0, 70);
  };
  const R = (r) => ({ l: Math.round(r.left), t: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom + window.scrollY) });
  const hasDirectText = (el) => { for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) return true; return false; };
  const visible = (el) => {
    if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0.5 && r.height > 0.5;
  };
  const excluded = (el) => !!el.closest(".msheet:not(.open), .mtoast:not(.show), .skip-link, [data-audit-ignore]");
  const styleInfo = (el) => {
    const cs = getComputedStyle(el);
    const p = el.parentElement;
    const pcs = p ? getComputedStyle(p) : null;
    return {
      display: cs.display, position: cs.position, width: cs.width, minWidth: cs.minWidth, maxWidth: cs.maxWidth,
      whiteSpace: cs.whiteSpace, overflowX: cs.overflowX, overflowY: cs.overflowY, textOverflow: cs.textOverflow,
      flex: cs.flex, gridColumn: cs.gridColumn, fontSize: cs.fontSize, padding: cs.padding,
      parent: p ? sig(p) : null, parentDisplay: pcs && pcs.display, parentWidth: pcs && pcs.width,
      parentGtc: pcs && pcs.gridTemplateColumns && pcs.gridTemplateColumns.slice(0, 140),
      parentFlexWrap: pcs && pcs.flexWrap, parentOverflowX: pcs && pcs.overflowX,
    };
  };
  const clipAncestor = (el) => {
    let p = el.parentElement;
    while (p && p !== doc.body) {
      const o = getComputedStyle(p).overflowX;
      if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") return { el: p, mode: o };
      p = p.parentElement;
    }
    return null;
  };
  const fixedRoot = (el) => {
    let p = el;
    while (p && p !== doc.body) {
      const pos = getComputedStyle(p).position;
      if (pos === "fixed" || pos === "sticky") return p;
      p = p.parentElement;
    }
    return null;
  };
  const isAtom = (el) => {
    const tag = tagOf(el);
    if (SKIP_TAGS.has(tag)) return false;
    if (tag === "IMG" && el.getAttribute("alt") === "") return false;
    if ((tag === "IMG" || tag === "SVG") && el.getAttribute("aria-hidden") === "true") return false;
    return hasDirectText(el) || REPLACED.has(tag);
  };
  /* The part of an element that is actually painted: its rect clipped by every
     ancestor whose overflow is not visible (scrollers, overflow:hidden boxes).
     A nav button scrolled out of the sidebar's scroll box has a rect but no
     painted area, so it cannot overlap anything. */
  const paintedRect = (el) => {
    const r = el.getBoundingClientRect();
    const box = { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    const pos = getComputedStyle(el).position;
    if (pos === "fixed") return { ...box, width: r.width, height: r.height };
    let p = el.parentElement;
    let escaping = pos === "absolute";
    while (p && p !== doc.documentElement) {
      const cs = getComputedStyle(p);
      const clipsX = cs.overflowX !== "visible";
      const clipsY = cs.overflowY !== "visible";
      if ((clipsX || clipsY) && !(escaping && cs.position === "static")) {
        const pr = p.getBoundingClientRect();
        const bl = parseFloat(cs.borderLeftWidth) || 0, bt = parseFloat(cs.borderTopWidth) || 0;
        const br = parseFloat(cs.borderRightWidth) || 0, bb = parseFloat(cs.borderBottomWidth) || 0;
        if (clipsX) { box.left = Math.max(box.left, pr.left + bl); box.right = Math.min(box.right, pr.right - br); }
        if (clipsY) { box.top = Math.max(box.top, pr.top + bt); box.bottom = Math.min(box.bottom, pr.bottom - bb); }
      }
      if (cs.position !== "static") escaping = false;
      if (cs.position === "absolute") escaping = true;
      if (cs.position === "fixed") break;
      p = p.parentElement;
    }
    return { ...box, width: Math.max(0, box.right - box.left), height: Math.max(0, box.bottom - box.top) };
  };
  const alphaOf = (color) => {
    if (!color || color === "transparent") return 0;
    const m = /rgba?\(([^)]+)\)/.exec(color);
    if (!m) return 1;
    const parts = m[1].split(/[\s,\/]+/).filter(Boolean);
    return parts.length >= 4 ? parseFloat(parts[3]) : 1;
  };

  let idCounter = 0;
  function clearFlags(root) {
    (root || doc).querySelectorAll("[data-audit-flag]").forEach((el) => { delete el.dataset.auditFlag; delete el.dataset.auditId; });
  }

  function probe(cfg) {
    cfg = cfg || {};
    const root = cfg.rootSel ? doc.querySelector(cfg.rootSel) : doc.body;
    const touch = !!cfg.touch;
    const vw = doc.documentElement.clientWidth;
    const vh = window.innerHeight;
    const issues = [];
    clearFlags();
    if (!root) return { error: "root not found: " + cfg.rootSel, issues, vw, vh, counts: {} };

    const push = (kind, severity, el, extra) => {
      if (!el.dataset.auditId) el.dataset.auditId = String(++idCounter);
      if (!el.dataset.auditFlag || severity === "high") el.dataset.auditFlag = kind;
      issues.push(Object.assign({
        kind, severity, id: el.dataset.auditId, sel: sig(el), path: pathOf(el), text: textOf(el),
        rect: R(el.getBoundingClientRect()), styles: styleInfo(el),
      }, extra || {}));
    };

    const all = [];
    root.querySelectorAll("*").forEach((el) => {
      if (SKIP_TAGS.has(tagOf(el))) return;
      if (excluded(el)) return;
      if (!visible(el)) return;
      all.push(el);
    });

    const docW = doc.documentElement.scrollWidth;
    const hscroll = docW > vw + 1;

    /* 1. Elements sticking past the viewport edges (roots only). */
    const stick = all.filter((el) => {
      const r = el.getBoundingClientRect();
      if (getComputedStyle(el).position === "fixed") return false;
      return r.right > vw + 1.5 || r.left < -1.5;
    });
    const stickSet = new Set(stick);
    for (const el of stick) {
      let p = el.parentElement, rootMost = true;
      while (p) { if (stickSet.has(p)) { rootMost = false; break; } p = p.parentElement; }
      if (!rootMost) continue;
      const r = el.getBoundingClientRect();
      const by = Math.round(Math.max(r.right - vw, -r.left));
      const ca = clipAncestor(el);
      if (!ca) push("viewport-overflow", "high", el, { by });
      else if (ca.mode === "hidden" || ca.mode === "clip") push("clipped-at-viewport", "high", el, { by, container: sig(ca.el) });
    }
    const hscrollers = [];
    for (const el of all) {
      const cs = getComputedStyle(el);
      if (cs.overflowX !== "auto" && cs.overflowX !== "scroll") continue;
      const r = el.getBoundingClientRect();
      if (el.scrollWidth > el.clientWidth + 1 && hscrollers.length < 25) hscrollers.push({ sel: sig(el), path: pathOf(el), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth });
      if (r.right > vw + 1.5 || r.left < -1.5) push("scroller-wider-than-viewport", "high", el, { by: Math.round(Math.max(r.right - vw, -r.left)) });
    }

    /* 2. Clipping and truncation inside overflow-hidden boxes. */
    for (const el of all) {
      const cs = getComputedStyle(el);
      const clipsX = cs.overflowX === "hidden" || cs.overflowX === "clip";
      const clipsY = cs.overflowY === "hidden" || cs.overflowY === "clip";
      if (!clipsX && !clipsY) continue;
      const tag = tagOf(el);
      if (tag === "SELECT" || tag === "INPUT" || tag === "TEXTAREA") continue;
      const sw = el.scrollWidth, cw = el.clientWidth, sh = el.scrollHeight, ch = el.clientHeight;
      const overX = clipsX && sw > cw + 1;
      const overY = clipsY && sh > ch + 1;
      if (!overX && !overY) continue;
      const ellipsis = cs.textOverflow === "ellipsis" || (cs.webkitLineClamp && cs.webkitLineClamp !== "none");
      if (ellipsis) { push("truncated", "low", el, { overflowPx: Math.max(sw - cw, sh - ch) }); continue; }
      const box = el.getBoundingClientRect();
      const victims = [];
      el.querySelectorAll("*").forEach((d) => {
        if (victims.length >= 6) return;
        if (!isAtom(d) || excluded(d) || !visible(d)) return;
        const r = d.getBoundingClientRect();
        const ox = overX ? Math.max(r.right - box.right, box.left - r.left) : 0;
        const oy = overY ? Math.max(r.bottom - box.bottom, box.top - r.top) : 0;
        if (ox > 1.5 || oy > 1.5) victims.push({ sel: sig(d), text: textOf(d), ox: Math.round(ox), oy: Math.round(oy) });
      });
      if (hasDirectText(el) || victims.length) push("clipped", "high", el, { overflowX: overX ? sw - cw : 0, overflowY: overY ? sh - ch : 0, victims });
    }

    /* 3. Own text wider than the box while overflow is visible. */
    for (const el of all) {
      if (!hasDirectText(el)) continue;
      const cs = getComputedStyle(el);
      if (cs.overflowX !== "visible") continue;
      const d = cs.display;
      if (d === "inline" || d === "contents") continue;
      if (el.clientWidth <= 0) continue;
      if (el.scrollWidth > el.clientWidth + 2) {
        const ca = clipAncestor(el);
        if (ca && (ca.mode === "auto" || ca.mode === "scroll")) continue;
        push("text-overflow", "medium", el, { overflowPx: el.scrollWidth - el.clientWidth, clippedBy: ca ? sig(ca.el) : null });
      }
    }

    /* 4. Overlapping atoms (painted rects, same fixed/sticky group only).
       Two design patterns are not defects and are skipped: a badge placed
       (position: absolute) fully inside a picture or canvas, and two inline
       runs of the same paragraph whose union rects touch only because the
       text wrapped (their line boxes are compared instead). */
    const PICTURE = new Set(["IMG", "CANVAS", "SVG", "VIDEO"]);
    const lineBoxes = (el, pr) => {
      const cs = getComputedStyle(el);
      if (cs.display !== "inline") return [pr];
      const boxes = [...el.getClientRects()].map((r) => ({
        left: Math.max(r.left, pr.left), top: Math.max(r.top, pr.top),
        right: Math.min(r.right, pr.right), bottom: Math.min(r.bottom, pr.bottom),
      })).filter((b) => b.right - b.left > 1 && b.bottom - b.top > 1);
      return boxes.length ? boxes : [pr];
    };
    const inside = (inner, outer) => inner.left >= outer.left - 1 && inner.right <= outer.right + 1 && inner.top >= outer.top - 1 && inner.bottom <= outer.bottom + 1;
    const atoms = [];
    for (const el of all) {
      if (!isAtom(el)) continue;
      const pr = paintedRect(el);
      if (pr.width < 3 || pr.height < 3) continue;
      atoms.push({ el, r: pr, boxes: lineBoxes(el, pr), group: fixedRoot(el), abs: getComputedStyle(el).position === "absolute", picture: PICTURE.has(tagOf(el)) });
    }
    atoms.sort((a, b) => a.r.top - b.r.top);
    const seenPairs = new Set();
    for (let i = 0; i < atoms.length; i += 1) {
      const A = atoms[i];
      for (let j = i + 1; j < atoms.length; j += 1) {
        const B = atoms[j];
        if (B.r.top >= A.r.bottom - 2) break;
        if (A.group !== B.group) continue;
        let ix = 0, iy = 0;
        for (const a of A.boxes) for (const b of B.boxes) {
          const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (x >= 3 && y >= 3 && x * y > ix * iy) { ix = x; iy = y; }
        }
        if (ix < 3 || iy < 3) continue;
        if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
        if ((A.picture && B.abs && inside(B.r, A.r)) || (B.picture && A.abs && inside(A.r, B.r))) continue;
        const area = ix * iy;
        const minArea = Math.min(A.r.width * A.r.height, B.r.width * B.r.height) || 1;
        const ratio = area / minArea;
        if (ratio < 0.06 && area < 240) continue;
        const key = pathOf(A.el) + "|" + pathOf(B.el);
        if (seenPairs.has(key)) continue;
        seenPairs.add(key);
        const bothText = !REPLACED.has(tagOf(A.el)) && !REPLACED.has(tagOf(B.el));
        if (!B.el.dataset.auditId) B.el.dataset.auditId = String(++idCounter);
        B.el.dataset.auditFlag = "overlap";
        push("overlap", bothText ? "high" : "medium", A.el, {
          other: { id: B.el.dataset.auditId, sel: sig(B.el), path: pathOf(B.el), text: textOf(B.el), rect: R(B.r), styles: styleInfo(B.el) },
          overlapPx: { x: Math.round(ix), y: Math.round(iy) }, ratio: Number(ratio.toFixed(2)),
        });
      }
    }

    /* 5. Sticky cells that let scrolled content show through them. */
    for (const el of all) {
      const cs = getComputedStyle(el);
      if (cs.position !== "sticky") continue;
      const stickyLeft = cs.left !== "auto", stickyTop = cs.top !== "auto";
      if (!stickyLeft && !stickyTop) continue;
      let scroller = null;
      let p = el.parentElement;
      while (p && p !== doc.body) {
        const o = getComputedStyle(p);
        if (stickyLeft && (o.overflowX === "auto" || o.overflowX === "scroll") && p.scrollWidth > p.clientWidth + 1) { scroller = p; break; }
        if (stickyTop && (o.overflowY === "auto" || o.overflowY === "scroll") && p.scrollHeight > p.clientHeight + 1) { scroller = p; break; }
        p = p.parentElement;
      }
      if (!scroller) continue;
      if (alphaOf(cs.backgroundColor) < 0.9 && cs.backgroundImage === "none") push("sticky-see-through", "high", el, { backgroundColor: cs.backgroundColor, scroller: sig(scroller) });
    }

    /* 6. Touch ergonomics. */
    if (touch) {
      for (const el of all) {
        const tag = tagOf(el);
        if ((tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") && !["hidden", "file", "checkbox", "radio", "range"].includes(el.type)) {
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs < 16) push("small-font-control", "medium", el, { fontSize: fs });
        }
        if (el.matches('button, a[href], summary, [role="button"], input[type="checkbox"], input[type="radio"], select, .nav-button, .mtab, .extract-chip, .planner-tab, .charm-chip, .inv-reset')) {
          const r = el.getBoundingClientRect();
          if (r.height < 40 || r.width < 30) push("small-target", "low", el, { w: Math.round(r.width), h: Math.round(r.height) });
        }
      }
    }

    /* 7. Tiny text. */
    for (const el of all) {
      if (!hasDirectText(el)) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 10) push("tiny-text", "low", el, { fontSize: fs });
    }

    /* Dedupe repeated rows: same kind + same path (+ other path). */
    const byKey = new Map();
    for (const it of issues) {
      const key = it.kind + "|" + it.path + "|" + (it.other ? it.other.path : "") + "|" + (it.container || it.clippedBy || "");
      if (byKey.has(key)) { const e = byKey.get(key); e.count += 1; if (e.examples.length < 3) e.examples.push(it.text); }
      else byKey.set(key, Object.assign({ count: 1, examples: [it.text] }, it));
    }
    const deduped = [...byKey.values()];
    const counts = {};
    for (const it of deduped) counts[it.kind] = (counts[it.kind] || 0) + it.count;

    return {
      vw, vh, docW, docH: doc.documentElement.scrollHeight, hscroll,
      shell: doc.documentElement.dataset.shell, mchrome: doc.documentElement.dataset.mchrome || null,
      coarse: matchMedia("(pointer: coarse)").matches, noHover: matchMedia("(hover: none)").matches,
      maxTouchPoints: navigator.maxTouchPoints,
      activeTab: doc.body.dataset.activeTab || null,
      panelChildren: doc.querySelector(".tab-panel.active") ? doc.querySelector(".tab-panel.active").children.length : -1,
      atoms: atoms.length, elements: all.length, hscrollers,
      counts, issues: deduped,
    };
  }

  /* Scroll to the bottom and see whether the lowest content sits under the
     fixed phone tab bar. */
  function underBar() {
    const tabs = doc.querySelector(".mtabs");
    if (!tabs || getComputedStyle(tabs).display === "none") return null;
    const before = window.scrollY;
    window.scrollTo(0, doc.documentElement.scrollHeight);
    const tr = tabs.getBoundingClientRect();
    const area = doc.querySelector(".content-area") || doc.body;
    let lowest = null;
    area.querySelectorAll("*").forEach((el) => {
      if (!isAtom(el) || excluded(el) || !visible(el)) return;
      if (fixedRoot(el)) return;
      const r = el.getBoundingClientRect();
      if (!lowest || r.bottom > lowest.r.bottom) lowest = { el, r };
    });
    const out = lowest ? {
      lowestBottom: Math.round(lowest.r.bottom), tabsTop: Math.round(tr.top), tabsH: Math.round(tr.height),
      hidden: lowest.r.bottom > tr.top + 1, by: Math.round(lowest.r.bottom - tr.top),
      sel: sig(lowest.el), path: pathOf(lowest.el), text: textOf(lowest.el),
    } : null;
    window.scrollTo(0, before);
    return out;
  }

  function scrollThrough() {
    const h = doc.documentElement.scrollHeight;
    const step = Math.max(300, window.innerHeight - 40);
    const ys = [];
    for (let y = 0; y < h; y += step) ys.push(y);
    ys.push(h);
    return ys;
  }

  /* Scroll every horizontal scroller to its end (or back to 0). */
  function scrollWrappers(toEnd) {
    let n = 0;
    doc.querySelectorAll("*").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.overflowX !== "auto" && cs.overflowX !== "scroll") return;
      if (el.scrollWidth <= el.clientWidth + 1) return;
      el.scrollLeft = toEnd ? el.scrollWidth : 0;
      n += 1;
    });
    return n;
  }

  function expandAll(rootSel) {
    const root = rootSel ? doc.querySelector(rootSel) : doc.body;
    if (!root) return 0;
    let n = 0;
    root.querySelectorAll("details:not([open])").forEach((d) => { d.open = true; n += 1; });
    return n;
  }

  /* Interactive controls in a module, grouped by signature so one action per
     kind of control is enough to reach every re-rendered state. */
  const DESTRUCTIVE = /reset|clear|delete|remove|revert|import|export|sign|log ?(in|out)|run advisor|copy|reload|backup|re-run|setup/i;
  /* Actions are addressed by (root, kind, signature, nth) and re-resolved at
     the moment they run, because app.js re-renders a panel with innerHTML
     after most changes and any element reference or stamped attribute dies
     with it. */
  const ACTION_QUERIES = {
    click: "button, [role='button'], .extract-chip, .planner-tab, .charm-chip, .hero-portrait-btn, .building-list-item, .chief-gear-slot-card, summary",
    select: "select",
    input: "input[type='number'], input[type='text'], input:not([type])",
    check: "input[type='checkbox']",
  };
  const actionCandidates = (root, kind) => {
    const out = [];
    root.querySelectorAll(ACTION_QUERIES[kind]).forEach((el) => {
      if (!visible(el) || excluded(el) || el.disabled) return;
      if (kind === "click") {
        if (el.matches("[data-msheet-open], [data-msheet-close], .mtab, .nav-button, .file-button, .danger, [data-wizard-nav]")) return;
        if (DESTRUCTIVE.test(textOf(el)) || DESTRUCTIVE.test(el.id || "")) return;
      }
      if (kind === "select" && el.options.length < 2) return;
      if (kind === "input" && el.readOnly) return;
      out.push(el);
    });
    return out;
  };
  function listActions(rootSel, maxPerSig) {
    const root = doc.querySelector(rootSel) || doc.body;
    const out = [];
    const perSig = new Map();
    for (const kind of Object.keys(ACTION_QUERIES)) {
      const nthBySig = new Map();
      for (const el of actionCandidates(root, kind)) {
        const s = sig(el);
        const nth = nthBySig.get(s) || 0;
        nthBySig.set(s, nth + 1);
        const key = kind + ":" + s;
        const n = perSig.get(key) || 0;
        if (n >= (maxPerSig || 2)) continue;
        perSig.set(key, n + 1);
        out.push({ kind, act: kind + "-" + out.length, rootSel: rootSel || "body", sig: s, nth, text: textOf(el), sel: s });
      }
    }
    return out;
  }

  function resolveAction(act) {
    const root = doc.querySelector(act.rootSel) || doc.body;
    const same = actionCandidates(root, act.kind).filter((el) => sig(el) === act.sig);
    return same[act.nth] || same[0] || null;
  }

  function doAction(act) {
    const el = resolveAction(act);
    if (!el) return { ok: false, reason: "gone" };
    try {
      if (act.kind === "click" || act.kind === "check") { el.click(); return { ok: true }; }
      if (act.kind === "select") {
        const next = (el.selectedIndex + 1) % el.options.length;
        el.selectedIndex = next;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        return { ok: true, value: el.value };
      }
      if (act.kind === "input") {
        const value = el.type === "number" ? "1234567890" : "A deliberately very long value to stress the layout width";
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        setter.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.blur();
        return { ok: true, value };
      }
    } catch (e) { return { ok: false, reason: String(e) }; }
    return { ok: false, reason: "unknown kind" };
  }

  function scrollIntoView(id) {
    const el = doc.querySelector('[data-audit-id="' + id + '"]');
    if (!el) return false;
    el.scrollIntoView({ block: "center", inline: "nearest" });
    return true;
  }

  function switchTab(id) {
    const button = doc.querySelector('#moduleNav [data-tab="' + CSS.escape(id) + '"]');
    if (!button) return false;
    const sheet = doc.querySelector(".msheet");
    const wasInert = !!(sheet && sheet.inert);
    if (wasInert) sheet.inert = false;
    button.click();
    if (wasInert) sheet.inert = true;
    window.scrollTo(0, 0);
    return true;
  }

  window.__audit = { probe, underBar, scrollThrough, scrollWrappers, expandAll, listActions, doAction, scrollIntoView, switchTab, clearFlags };
  return true;
})()`;
