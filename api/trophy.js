// Trophy card: a strip of GitHub achievement trophies as SVG, modeled on
// github-profile-trophy (ryo-ma). Rank thresholds and rank messages are
// taken from that project's public source (src/trophy.ts). All data is
// public-only, from the same sources as the other cards.
// Usage: /trophy?username=xsrazy&theme=tokyo-night
// Options: column=N (tiles per row), rank=SSS,S (only show those ranks),
// plus the shared theme/color/border/title options. The Contributions
// trophy uses the last-year total from the jogruber contribution calendar,
// the same window as the streak card.

const {
  resolveStyle, parseUsername, displayName, fmt, esc,
  fetchContributions, fetchProfile, fetchRepos, fetchSearchCount,
  cardShell, errorCard, sendSVG,
} = require("../lib/cards");

const RANKS = ["SSS", "SS", "S", "AAA", "AA", "A", "B", "C"];
const RANK_COLORS = {
  SSS: "#00e5ff", SS: "#e040fb", S: "#ff5252", AAA: "#ff8a00",
  AA: "#ffb700", A: "#ffd700", B: "#c0c0c0", C: "#cd7f32", UNKNOWN: "#6e7681",
};

// [threshold, rank message] pairs in RANKS order, from ryo-ma/github-profile-trophy.
const CATEGORIES = [
  {
    key: "stars", label: "Stars",
    conditions: [[2000, "Super Stargazer"], [700, "High Stargazer"], [200, "Stargazer"], [100, "Super Star"], [50, "High Star"], [30, "You are a Star"], [10, "Middle Star"], [1, "First Star"]],
  },
  {
    key: "followers", label: "Followers",
    conditions: [[1000, "Super Celebrity"], [400, "Ultra Celebrity"], [200, "Hyper Celebrity"], [100, "Famous User"], [50, "Active User"], [20, "Dynamic User"], [10, "Many Friends"], [1, "First Friend"]],
  },
  {
    key: "contributions", label: "Contributions",
    conditions: [[4000, "God Committer"], [2000, "Deep Committer"], [1000, "Super Committer"], [500, "Ultra Committer"], [200, "Hyper Committer"], [100, "High Committer"], [10, "Middle Committer"], [1, "First Commit"]],
  },
  {
    key: "prs", label: "Pull Requests",
    conditions: [[1000, "God Puller"], [500, "Deep Puller"], [200, "Super Puller"], [100, "Ultra Puller"], [50, "Hyper Puller"], [20, "High Puller"], [10, "Middle Puller"], [1, "First Pull"]],
  },
  {
    key: "issues", label: "Issues",
    conditions: [[1000, "God Issuer"], [500, "Deep Issuer"], [200, "Super Issuer"], [100, "Ultra Issuer"], [50, "Hyper Issuer"], [20, "High Issuer"], [10, "Middle Issuer"], [1, "First Issue"]],
  },
  {
    key: "repos", label: "Public Repos",
    conditions: [[50, "God Repo Creator"], [45, "Deep Repo Creator"], [40, "Super Repo Creator"], [35, "Ultra Repo Creator"], [30, "Hyper Repo Creator"], [20, "High Repo Creator"], [10, "Middle Repo Creator"], [1, "First Repository"]],
  },
  {
    // Score is account age in years; thresholds follow the year comments on
    // the reference's AccountDurationTrophy conditions.
    key: "experience", label: "Experience",
    conditions: [[20, "Seasoned Veteran"], [15, "Grandmaster"], [10, "Master Dev"], [7.5, "Expert Dev"], [5, "Experienced Dev"], [3, "Intermediate Dev"], [1.5, "Junior Dev"], [0.5, "Newbie"]],
  },
];

function rankFor(category, score) {
  for (let i = 0; i < category.conditions.length; i++) {
    if (score >= category.conditions[i][0]) {
      return { rank: RANKS[i], message: category.conditions[i][1] };
    }
  }
  return { rank: "UNKNOWN", message: "Unknown" };
}

module.exports = async (req, res) => {
  const q = req.query || {};
  const username = parseUsername(q);
  const style = resolveStyle(q);
  const theme = style.theme;
  const title = style.customTitle || "GitHub Trophies";
  const errOpts = {
    username, theme, title: "GitHub Trophies",
    customTitle: style.customTitle, hideTitle: style.hideTitle,
    hideBorder: style.hideBorder, borderRadius: style.borderRadius,
  };

  let profile;
  try {
    profile = await fetchProfile(username);
  } catch (e) {
    const msg = e.status === 404
      ? `GitHub user "${username}" was not found`
      : "GitHub data is temporarily unavailable";
    return sendSVG(res, errorCard({ ...errOpts, message: msg }), 300);
  }

  const [reposR, contribR, prR, issueR] = await Promise.allSettled([
    fetchRepos(username),
    fetchContributions(username),
    fetchSearchCount("pr", username),
    fetchSearchCount("issue", username),
  ]);

  const values = {};
  if (reposR.status === "fulfilled") {
    const owned = reposR.value.filter((r) => !r.fork && !r.private);
    values.stars = owned.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  }
  values.followers = profile.followers || 0;
  if (contribR.status === "fulfilled" && contribR.value.length) {
    values.contributions = contribR.value.reduce((s, d) => s + d.count, 0);
  }
  if (prR.status === "fulfilled") values.prs = prR.value;
  if (issueR.status === "fulfilled") values.issues = issueR.value;
  values.repos = profile.public_repos || 0;
  const created = Date.parse(profile.created_at || "");
  if (Number.isFinite(created)) {
    values.experience = (Date.now() - created) / (365.25 * 86400000);
  }

  let tiles = [];
  for (const cat of CATEGORIES) {
    const v = values[cat.key];
    if (v === null || v === undefined) continue; // never invent a number
    const { rank, message } = rankFor(cat, v);
    const display = cat.key === "experience" ? `${v.toFixed(1)} yrs` : fmt(Math.round(v));
    tiles.push({ label: cat.label, rank, message, display });
  }

  const rankFilter = new Set(
    String(q.rank || "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean)
  );
  if (rankFilter.size) tiles = tiles.filter((t) => rankFilter.has(t.rank));
  if (!tiles.length) {
    return sendSVG(res, errorCard({ ...errOpts, message: "No trophy data found for this user" }), 300);
  }

  let perRow = parseInt(q.column, 10);
  if (!Number.isFinite(perRow) || perRow < 1) perRow = tiles.length;
  perRow = Math.min(perRow, tiles.length);
  const rows = Math.ceil(tiles.length / perRow);

  const TW = 118, TH = 122, GAP = 10, TOP = 56;
  const W = perRow * TW + (perRow - 1) * GAP + 48;
  const H = TOP + rows * TH + (rows - 1) * GAP + 16;

  let body = "";
  tiles.forEach((t, i) => {
    const x = 24 + (i % perRow) * (TW + GAP);
    const y = TOP + Math.floor(i / perRow) * (TH + GAP);
    const cx = x + TW / 2;
    const rc = RANK_COLORS[t.rank] || RANK_COLORS.UNKNOWN;
    body += `<rect x="${x}" y="${y}" width="${TW}" height="${TH}" rx="8" fill="${theme.grid}" fill-opacity="0.25" stroke="${theme.border}"/>`;
    body += `<circle cx="${cx}" cy="${y + 34}" r="17" fill="none" stroke="${rc}" stroke-width="3"/>`;
    body += `<text x="${cx}" y="${y + 38}" text-anchor="middle" font-size="${t.rank.length > 2 ? 10 : 12}" font-weight="800" fill="${rc}">${t.rank}</text>`;
    body += `<text x="${cx}" y="${y + 68}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${theme.text}">${esc(t.label)}</text>`;
    body += `<text x="${cx}" y="${y + 86}" text-anchor="middle" font-size="9.5" fill="${theme.text}">${esc(t.message)}</text>`;
    body += `<text x="${cx}" y="${y + 106}" text-anchor="middle" font-size="13" font-weight="700" fill="${theme.accent}">${esc(t.display)}</text>`;
  });

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
  return sendSVG(res, svg, 3600);
};
