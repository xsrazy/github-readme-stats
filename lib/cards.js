// Shared helpers for the card suite (stats / streak / languages).
// Themes are copied verbatim from api/graph.js so every card matches the
// existing activity graph's look. api/graph.js itself is untouched.

const THEMES = {
  "tokyo-night": {
    bg: "#1a1b27", border: "#2a2e4a", title: "#7aa2f7", line: "#7aa2f7",
    point: "#bb9af7", grid: "#2a2e4a", text: "#9aa5ce",
  },
  "github-dark": {
    bg: "#0d1117", border: "#30363d", title: "#58a6ff", line: "#58a6ff",
    point: "#79c0ff", grid: "#21262d", text: "#8b949e",
  },
  react: {
    bg: "#20232a", border: "#3a3f4a", title: "#61dafb", line: "#61dafb",
    point: "#ffffff", grid: "#343842", text: "#c9d1d9",
  },
  radical: {
    bg: "#141321", border: "#2e2a4a", title: "#fe428e", line: "#fe428e",
    point: "#f8d847", grid: "#2e2a4a", text: "#a9fef7",
  },
  highcontrast: {
    bg: "#000000", border: "#ffffff", title: "#e7f216", line: "#e7f216",
    point: "#ffffff", grid: "#3a3a3a", text: "#ffffff",
  },
};

const FONT = "Segoe UI, Ubuntu, sans-serif";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function getTheme(name) {
  return THEMES[name] || THEMES["github-dark"];
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
  const res = await fetch(url, { headers: { "User-Agent": "activity-graph/1.0" } });
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
    "User-Agent": "activity-graph/1.0",
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

function cardShell({ width, height, theme, title, body }) {
  const t = theme;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="8" fill="${t.bg}" stroke="${t.border}"/>
<text x="24" y="36" font-family="${FONT}" font-size="19" font-weight="600" fill="${t.title}">${esc(title)}</text>
<g font-family="${FONT}">${body}</g>
</svg>`;
}

function errorCard({ username, theme, message, title }) {
  return cardShell({
    width: 495,
    height: 130,
    theme,
    title: title || `${displayName(username)}'s GitHub Stats`,
    body: `<text x="24" y="76" font-size="14" fill="${theme.text}">${esc(message)}</text>`,
  });
}

function sendSVG(res, svg, cacheSeconds) {
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`);
  res.status(200).send(svg);
}

module.exports = {
  THEMES, FONT, esc, getTheme, parseUsername, displayName, fmt,
  fetchContributions, fetchProfile, fetchRepos, fetchSearchCount, fetchRepoLanguages,
  cardShell, errorCard, sendSVG,
};
