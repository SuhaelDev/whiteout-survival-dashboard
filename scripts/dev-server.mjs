/* Minimal static server used for local verification. Mirrors the bits of
   Vercel's behaviour the dashboard depends on: correct MIME types (including
   .webmanifest), no-cache on the shell, and a stubbed /api so initAuth() takes
   its "not configured" path instead of hanging. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PORT = Number(process.argv[2] || 5173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".glb": "model/gltf-binary",
  ".csv": "text/csv; charset=utf-8",
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname.startsWith("/api/")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("{}");
      return;
    }

    if (pathname === "/") pathname = "/index.html";
    const file = path.join(ROOT, pathname);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("not found");
      return;
    }

    const ext = path.extname(file).toLowerCase();
    const headers = { "Content-Type": TYPES[ext] || "application/octet-stream" };
    if (pathname === "/sw.js" || pathname === "/index.html" || pathname === "/manifest.webmanifest") {
      headers["Cache-Control"] = "public, max-age=0, must-revalidate";
      if (pathname === "/sw.js") headers["Service-Worker-Allowed"] = "/";
    }
    res.writeHead(200, headers);
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`dev server on http://127.0.0.1:${PORT}`));
