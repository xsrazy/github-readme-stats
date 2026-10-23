// Languages card: top languages by bytes across the user's repos, as SVG.
// Data: GitHub REST API (repos list + per-repo language breakdown).
// Usage: /languages?username=xsrazy&theme=tokyo-night
// Options: layout=normal|compact|donut, langs_count=1..10 (default 6),
// exclude_lang=HTML,CSS, plus the shared theme/color/border/title options.

const {
  resolveStyle, parseUsername, displayName, esc,
  fetchProfile, fetchRepos, fetchRepoLanguages, cardShell, errorCard, sendSVG,
} = require("../lib/cards");

// GitHub's official language colors (subset; unknown languages use the theme accent).
const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", HTML: "#e34c26",
  CSS: "#663399", Shell: "#89e051", Java: "#b07219", "C#": "#178600", C: "#555555",
  "C++": "#f34b7d", Go: "#00ADD8", Rust: "#dea584", PHP: "#4F5D95", Ruby: "#701516",
  Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB", Lua: "#000080",
  Vue: "#41b883", Svelte: "#ff3e00", SCSS: "#c6538c", Dockerfile: "#384d54",
  PowerShell: "#012456", Batchfile: "#C1F12E", EJS: "#a91e50", Astro: "#ff5a03",
};

module.exports = async (req, res) => {
  const q = req.query || {};
  const username = parseUsername(q);
  const style = resolveStyle(q);
  const theme = style.theme;
  const title = style.customTitle || `${displayName(username)}'s Top Languages`;
  const errOpts = {
    username, theme, title: `${displayName(username)}'s Top Languages`,
    customTitle: style.customTitle, hideTitle: style.hideTitle,
    hideBorder: style.hideBorder, borderRadius: style.borderRadius,
  };

  let repos;
  try {
    await fetchProfile(username); // 404 check so bad usernames get a clean card
    repos = await fetchRepos(username);
  } catch (e) {
    const msg = e.status === 404
      ? `GitHub user "${username}" was not found`
      : "GitHub data is temporarily unavailable";
    return sendSVG(res, errorCard({ ...errOpts, message: msg }), 300);
  }

  const owned = repos.filter((r) => !r.fork && !r.private && r.languages_url);
  const totals = {};
  // A silently skipped repo would skew every percentage, so each fetch gets
  // one retry and any lasting failure fails the whole card instead.
  const results = await Promise.allSettled(
    owned.map(async (r) => {
      try {
        return await fetchRepoLanguages(r.languages_url);
      } catch (e) {
        return fetchRepoLanguages(r.languages_url);
      }
    })
  );
  if (results.some((r) => r.status !== "fulfilled")) {
    return sendSVG(res, errorCard({ ...errOpts, message: "GitHub data is temporarily unavailable" }), 300);
  }
  for (const r of results) {
    for (const [lang, bytes] of Object.entries(r.value)) {
      totals[lang] = (totals[lang] || 0) + bytes;
    }
  }

  const exclude = new Set(
    String(q.exclude_lang || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
  );
  const sorted = Object.entries(totals)
    .filter(([lang]) => !exclude.has(lang.toLowerCase()))
    .sort((a, b) => b[1] - a[1]);
  const grand = sorted.reduce((s, [, b]) => s + b, 0);
  if (!grand) {
    return sendSVG(res, errorCard({ ...errOpts, message: "No language data found for this user" }), 300);
  }

  let count = parseInt(q.langs_count, 10);
  if (!Number.isFinite(count)) count = 6;
  count = Math.min(10, Math.max(1, count));
  const top = sorted.slice(0, count);
  const restBytes = sorted.slice(count).reduce((s, [, b]) => s + b, 0);
  if (restBytes > 0) top.push(["Other", restBytes]);

  const layout = ["normal", "compact", "donut"].includes(String(q.layout)) ? String(q.layout) : "normal";
  const W = 400;
  const pct = (bytes) => ((bytes / grand) * 100).toFixed(1);
  const colorOf = (lang) => LANG_COLORS[lang] || theme.line;
  let H, body = "";

  if (layout === "compact") {
    const rows = Math.ceil(top.length / 2);
    const rowH = 24;
    H = 78 + rows * rowH + 26;
    const barX = 24, barW = W - 48;
    let bx = barX;
    for (const [lang, bytes] of top) {
      const w = Math.max(2, (bytes / grand) * barW);
      body += `<rect x="${bx.toFixed(1)}" y="52" width="${Math.min(w, barX + barW - bx).toFixed(1)}" height="10" fill="${colorOf(lang)}"/>`;
      bx += w;
    }
    const colW = 168, colX = [24, 208];
    top.forEach(([lang, bytes], i) => {
      const row = Math.floor(i / 2), col = i % 2;
      const x = colX[col];
      const y = 92 + row * rowH;
      body += `<circle cx="${x + 6}" cy="${y - 4}" r="5" fill="${colorOf(lang)}"/>`;
      body += `<text x="${x + 18}" y="${y}" font-size="13" fill="${theme.text}">${esc(lang)}</text>`;
      body += `<text x="${x + colW}" y="${y}" text-anchor="end" font-size="13" font-weight="700" fill="${theme.accent}">${pct(bytes)}%</text>`;
    });
  } else if (layout === "donut") {
    const rowH = 26;
    H = Math.max(212, 78 + top.length * rowH + 26);
    const cx = 100, cy = Math.round((52 + (H - 14)) / 2), r = 52, C = 2 * Math.PI * r;
    body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${theme.grid}" stroke-width="20"/>`;
    let acc = 0;
    for (const [lang, bytes] of top) {
      const len = (bytes / grand) * C;
      body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colorOf(lang)}" stroke-width="20" stroke-dasharray="${Math.max(0, len - 1.5).toFixed(1)} ${C.toFixed(1)}" stroke-dashoffset="${(-acc).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
      acc += len;
    }
    top.forEach(([lang, bytes], i) => {
      const y = 92 + i * rowH;
      body += `<circle cx="196" cy="${y - 4}" r="5" fill="${colorOf(lang)}"/>`;
      body += `<text x="210" y="${y}" font-size="13.5" fill="${theme.text}">${esc(lang)}</text>`;
      body += `<text x="${W - 24}" y="${y}" text-anchor="end" font-size="13.5" font-weight="700" fill="${theme.accent}">${pct(bytes)}%</text>`;
    });
  } else {
    const rowH = 26;
    H = 78 + top.length * rowH + 26;
    const barX = 24, barW = W - 48;
    // Stacked proportion bar.
    let bx = barX;
    for (const [lang, bytes] of top) {
      const w = Math.max(2, (bytes / grand) * barW);
      body += `<rect x="${bx.toFixed(1)}" y="52" width="${Math.min(w, barX + barW - bx).toFixed(1)}" height="10" fill="${colorOf(lang)}"/>`;
      bx += w;
    }
    top.forEach(([lang, bytes], i) => {
      const y = 92 + i * rowH;
      body += `<circle cx="30" cy="${y - 4}" r="5" fill="${colorOf(lang)}"/>`;
      body += `<text x="44" y="${y}" font-size="13.5" fill="${theme.text}">${esc(lang)}</text>`;
      body += `<text x="${W - 24}" y="${y}" text-anchor="end" font-size="13.5" font-weight="700" fill="${theme.accent}">${pct(bytes)}%</text>`;
    });
  }

  const svg = cardShell({
    width: W,
    height: H,
    theme,
    title,
    hideTitle: style.hideTitle,
    hideBorder: style.hideBorder,
    borderRadius: style.borderRadius,
    body,
  });
  return sendSVG(res, svg, 21600);
};
