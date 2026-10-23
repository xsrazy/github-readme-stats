// Shared helpers for the card suite (stats / streak / languages / trophy).
// Theme catalog lives in themes/themes.js: one entry per canonical theme,
// with hyphen and underscore spellings of every name both resolving.

const { THEMES } = require("../themes/themes.js");

const FONT = "Segoe UI, Ubuntu, sans-serif";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function getTheme(name) {
  return THEMES[name] || THEMES["github-dark"];
}

// Normalize a hex color: optional leading "#", 3, 6, or 8 hex digits.
// Returns "#rrggbb" / "#rrggbbaa" (lowercase) or null when invalid.
function normHex(raw) {
  if (raw == null) return null;
  let v = String(raw).trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(v)) v = v.split("").map((c) => c + c).join("");
  if (/^[0-9a-fA-F]{6}$/.test(v) || /^[0-9a-fA-F]{8}$/.test(v)) return "#" + v.toLowerCase();
  return null;
}

// Parse a color parameter following the github-readme-stats convention:
// either a plain hex color or a gradient spec "angle,color1,color2,..."
// (up to 6 colors). Returns { hex } or { gradient: { angle, colors } },
// or null when invalid (callers then fall back silently).
function parseColorParam(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  if (s.includes(",")) {
    const parts = s.split(",").map((p) => p.trim()).filter((p) => p.length);
    if (parts.length >= 3) {
      const angle = Number(parts[0]);
      const colors = parts.slice(1, 7).map((c) => normHex(c)).filter(Boolean);
      if (Number.isFinite(angle) && colors.length >= 2) {
        return { gradient: { angle, colors } };
      }
    }
    return null;
  }
  const hex = normHex(s);
  return hex ? { hex } : null;
}

// Resolve the effective style for a card request: theme first, then the
// customization parameters on top. Priority: explicit param > theme >
// default. Invalid values are ignored, never an error.
function resolveStyle(q) {
  const theme = { ...(THEMES[(q.theme || "github-dark").toString()] || THEMES["github-dark"]) };

  const bg = parseColorParam(q.bg_color);
  if (bg) {
    if (bg.gradient) {
      theme.bgGradient = bg.gradient;
      theme.bg = bg.gradient.colors[0];
    } else {
      theme.bg = bg.hex;
      delete theme.bgGradient;
    }
  }
  const titleC = normHex(q.title_color);
  if (titleC) theme.title = titleC;
  const textC = normHex(q.text_color);
  if (textC) theme.text = textC;
  const borderC = normHex(q.border_color);
  if (borderC) { theme.border = borderC; theme.grid = borderC; }
  const lineC = normHex(q.line);
  if (lineC) theme.line = lineC;
  const pointC = normHex(q.point);
  if (pointC) theme.point = pointC;
  // Accent for key numbers: ring_color wins, fire is its streak alias.
  theme.accent = normHex(q.ring_color) || normHex(q.fire) || theme.title;

  let borderRadius = null;
  if (q.border_radius != null && q.border_radius !== "") {
    const r = parseFloat(q.border_radius);
    if (Number.isFinite(r)) borderRadius = Math.min(30, Math.max(0, r));
  }

  return {
    theme,
    hideBorder: String(q.hide_border) === "true",
    hideTitle: String(q.hide_title) === "true",
    borderRadius,
    customTitle: q.custom_title != null && String(q.custom_title) !== ""
      ? String(q.custom_title).slice(0, 80)
      : null,
  };
}

function gradientDef(id, gradient) {
  const stops = gradient.colors.map((c, i) => {
    const pct = gradient.colors.length === 1 ? 0 : Math.round((i / (gradient.colors.length - 1)) * 100);
    const color = c.length === 9 ? c.slice(0, 7) : c;
    const opacity = c.length === 9 ? ` stop-opacity="${(parseInt(c.slice(7, 9), 16) / 255).toFixed(3)}"` : "";
    return `<stop offset="${pct}%" stop-color="${color}"${opacity}/>`;
  }).join("");
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(${gradient.angle} 0.5 0.5)">${stops}</linearGradient>`;
}

function parseUsername(q) {
  return (q.username || "xsrazy").toString().replace(/[^a-zA-Z0-9-]/g, "").slice(0, 39) || "xsrazy";
}

function displayName(username) {
  return username.charAt(0).toUpperCase() + username.slice(1);
}

function fmt(n) {
  return Number(n).toLocaleString("en-US");
}

// Same data source as api/graph.js: github-contributions-api (jogruber) v4.
async function fetchContributions(username) {
  const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`;
  const res = await fetch(url, { headers: { "User-Agent": "github-readme-stats/1.0" } });
  if (!res.ok) throw new Error(`contributions api ${res.status}`);
  const data = await res.json();
  const list = Array.isArray(data.contributions) ? data.contributions : [];
  return list
    .filter((d) => d && d.date && typeof d.count === "number")
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

function ghHeaders() {
  // A token only raises rate limits (unauthenticated calls from shared
  // serverless egress IPs get throttled hard). Public-only results are
  // enforced separately: search queries carry is:public and repo lists are
  // filtered on the API's own `private` flag, so no private data can leak
  // into a card even when the token belongs to the profile owner.
  const h = {
    "User-Agent": "github-readme-stats/1.0",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function ghJSON(url) {
  const res = await fetch(url, { headers: ghHeaders() });
  if (!res.ok) {
    const err = new Error(`github api ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function fetchProfile(username) {
  return ghJSON(`https://api.github.com/users/${encodeURIComponent(username)}`);
}

async function fetchRepos(username) {
  const repos = [];
  for (let page = 1; page <= 3; page++) {
    const batch = await ghJSON(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&type=owner&sort=updated`
    );
    if (!Array.isArray(batch) || batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

async function fetchSearchCount(kind, username) {
  const data = await ghJSON(
    `https://api.github.com/search/issues?q=type:${kind}+author:${encodeURIComponent(username)}+is:public&per_page=1`
  );
  return typeof data.total_count === "number" ? data.total_count : null;
}

async function fetchRepoLanguages(languagesUrl) {
  return ghJSON(languagesUrl);
}

function cardShell({ width, height, theme, title, body, hideTitle = false, hideBorder = false, borderRadius = null }) {
  const t = theme;
  const effH = hideTitle ? height - 34 : height;
  const r = borderRadius == null ? 8 : borderRadius;
  const stroke = hideBorder ? "none" : t.border;
  const defs = t.bgGradient ? `\n<defs>${gradientDef("bggrad", t.bgGradient)}</defs>` : "";
  const fill = t.bgGradient ? "url(#bggrad)" : t.bg;
  const titleLine = hideTitle ? "" : `\n<text x="24" y="36" font-family="${FONT}" font-size="19" font-weight="600" fill="${t.title}">${esc(title)}</text>`;
  const groupAttrs = hideTitle ? ` font-family="${FONT}" transform="translate(0,-34)"` : ` font-family="${FONT}"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${effH}" viewBox="0 0 ${width} ${effH}" fill="none">${defs}
<rect x="0.5" y="0.5" width="${width - 1}" height="${effH - 1}" rx="${r}" fill="${fill}" stroke="${stroke}"/>${titleLine}
<g${groupAttrs}>${body}</g>
</svg>`;
}

function errorCard({ username, theme, message, title, hideTitle = false, hideBorder = false, borderRadius = null, customTitle = null }) {
  return cardShell({
    width: 495,
    height: 130,
    theme,
    title: customTitle || title || `${displayName(username)}'s GitHub Stats`,
    hideTitle,
    hideBorder,
    borderRadius,
    body: `<text x="24" y="76" font-size="14" fill="${theme.text}">${esc(message)}</text>`,
  });
}

function sendSVG(res, svg, cacheSeconds) {
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`);
  res.status(200).send(svg);
}

module.exports = {
  THEMES, FONT, esc, getTheme, normHex, parseColorParam, resolveStyle, gradientDef,
  parseUsername, displayName, fmt,
  fetchContributions, fetchProfile, fetchRepos, fetchSearchCount, fetchRepoLanguages,
  cardShell, errorCard, sendSVG,
};
