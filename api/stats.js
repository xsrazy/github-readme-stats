// Stats card: GitHub user stats as SVG.
// Data: GitHub REST API (profile, repos, search) + contributions total from
// the same jogruber source the activity graph uses. Any metric that cannot
// be fetched is simply omitted; numbers are never invented.
// Usage: /stats?username=xsrazy&theme=tokyo-night
// Customization: theme, bg_color, title_color, text_color, border_color,
// ring_color, hide_border, border_radius, custom_title, hide_title, and
// hide=stars,forks,contributions,prs,issues,followers,following,repos.

const {
  resolveStyle, parseUsername, displayName, fmt,
  fetchContributions, fetchProfile, fetchRepos, fetchSearchCount,
  cardShell, errorCard, sendSVG,
} = require("../lib/cards");

module.exports = async (req, res) => {
  const q = req.query || {};
  const username = parseUsername(q);
  const style = resolveStyle(q);
  const theme = style.theme;
  const title = style.customTitle || `${displayName(username)}'s GitHub Stats`;

  let profile;
  try {
    profile = await fetchProfile(username);
  } catch (e) {
    const msg = e.status === 404
      ? `GitHub user "${username}" was not found`
      : "GitHub data is temporarily unavailable";
    return sendSVG(res, errorCard({ username, theme, message: msg, ...style }), 300);
  }

  const hidden = new Set(
    String(q.hide || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
  );
  const rows = [];
  const push = (key, label, value) => {
    if (hidden.has(key)) return;
    if (value !== null && value !== undefined) rows.push([label, value]);
  };

  const [reposR, contribR, prR, issueR] = await Promise.allSettled([
    fetchRepos(username),
    fetchContributions(username),
    fetchSearchCount("pr", username),
    fetchSearchCount("issue", username),
  ]);

  if (reposR.status === "fulfilled") {
    const owned = reposR.value.filter((r) => !r.fork && !r.private);
    push("stars", "Total Stars", fmt(owned.reduce((s, r) => s + (r.stargazers_count || 0), 0)));
    push("forks", "Total Forks", fmt(owned.reduce((s, r) => s + (r.forks_count || 0), 0)));
  }
  if (contribR.status === "fulfilled" && contribR.value.length) {
    push("contributions", "Total Contributions (last year)", fmt(contribR.value.reduce((s, d) => s + d.count, 0)));
  }
  if (prR.status === "fulfilled") push("prs", "Total PRs", fmt(prR.value));
  if (issueR.status === "fulfilled") push("issues", "Total Issues", fmt(issueR.value));
  push("followers", "Followers", fmt(profile.followers || 0));
  push("following", "Following", fmt(profile.following || 0));
  push("repos", "Public Repos", fmt(profile.public_repos || 0));

  const W = 495;
  const rowH = 26;
  const H = 78 + rows.length * rowH + 14;
  let body = "";
  rows.forEach(([label, value], i) => {
    const y = 78 + i * rowH;
    body += `<text x="24" y="${y}" font-size="14" fill="${theme.text}">${label}</text>`;
    body += `<text x="${W - 24}" y="${y}" text-anchor="end" font-size="14" font-weight="700" fill="${theme.accent}">${value}</text>`;
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
