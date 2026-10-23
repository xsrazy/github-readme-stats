// Languages card: top languages by bytes across the user's repos, as SVG.
// Data: GitHub REST API (repos list + per-repo language breakdown).
// Usage: /languages?username=xsrazy&theme=tokyo-night

const {
  getTheme, parseUsername, displayName, esc,
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
  const theme = getTheme((q.theme || "github-dark").toString());

  let repos;
  try {
    await fetchProfile(username); // 404 check so bad usernames get a clean card
    repos = await fetchRepos(username);
  } catch (e) {
    const msg = e.status === 404
      ? `GitHub user "${username}" was not found`
      : "GitHub data is temporarily unavailable";
    return sendSVG(res, errorCard({ username, theme, message: msg, title: `${displayName(username)}'s Top Languages` }), 300);
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
    return sendSVG(res, errorCard({
      username, theme, title: `${displayName(username)}'s Top Languages`, message: "GitHub data is temporarily unavailable",
    }), 300);
  }
  for (const r of results) {
    for (const [lang, bytes] of Object.entries(r.value)) {
      totals[lang] = (totals[lang] || 0) + bytes;
    }
  }

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const grand = sorted.reduce((s, [, b]) => s + b, 0);
  if (!grand) {
    return sendSVG(res, errorCard({
      username, theme, title: `${displayName(username)}'s Top Languages`, message: "No language data found for this user",
    }), 300);
  }

  const TOP = 6;
  const top = sorted.slice(0, TOP);
  const restBytes = sorted.slice(TOP).reduce((s, [, b]) => s + b, 0);
  if (restBytes > 0) top.push(["Other", restBytes]);

  const W = 400;
  const rowH = 26;
  const H = 78 + top.length * rowH + 26;
  const barX = 24, barW = W - 48;
  let body = "";

  // Stacked proportion bar.
  let bx = barX;
  for (const [lang, bytes] of top) {
    const w = Math.max(2, (bytes / grand) * barW);
    const color = LANG_COLORS[lang] || theme.line;
    body += `<rect x="${bx.toFixed(1)}" y="52" width="${Math.min(w, barX + barW - bx).toFixed(1)}" height="10" fill="${color}"/>`;
    bx += w;
  }
  top.forEach(([lang, bytes], i) => {
    const y = 92 + i * rowH;
    const pct = ((bytes / grand) * 100).toFixed(1);
    const color = LANG_COLORS[lang] || theme.line;
    body += `<circle cx="30" cy="${y - 4}" r="5" fill="${color}"/>`;
    body += `<text x="44" y="${y}" font-size="13.5" fill="${theme.text}">${esc(lang)}</text>`;
    body += `<text x="${W - 24}" y="${y}" text-anchor="end" font-size="13.5" font-weight="700" fill="${theme.title}">${pct}%</text>`;
  });

  const svg = cardShell({
    width: W,
    height: H,
    theme,
    title: `${displayName(username)}'s Top Languages`,
    body,
  });
  return sendSVG(res, svg, 21600);
};
