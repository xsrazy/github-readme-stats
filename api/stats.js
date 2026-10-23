// Stats card: GitHub user stats as SVG.
// Data: GitHub REST API (profile, repos, search) + contributions total from
// the same jogruber source the activity graph uses. Any metric that cannot
// be fetched is simply omitted; numbers are never invented.
// Usage: /stats?username=xsrazy&theme=tokyo-night

const {
  getTheme, parseUsername, displayName, fmt,
  fetchContributions, fetchProfile, fetchRepos, fetchSearchCount,
  cardShell, errorCard, sendSVG,
} = require("../lib/cards");

module.exports = async (req, res) => {
  const q = req.query || {};
  const username = parseUsername(q);
  const theme = getTheme((q.theme || "github-dark").toString());

  let profile;
  try {
    profile = await fetchProfile(username);
  } catch (e) {
    const msg = e.status === 404
      ? `GitHub user "${username}" was not found`
      : "GitHub data is temporarily unavailable";
    return sendSVG(res, errorCard({ username, theme, message: msg }), 300);
  }

  const rows = [];
  const push = (label, value) => { if (value !== null && value !== undefined) rows.push([label, value]); };

  const [reposR, contribR, prR, issueR] = await Promise.allSettled([
    fetchRepos(username),
    fetchContributions(username),
    fetchSearchCount("pr", username),
    fetchSearchCount("issue", username),
  ]);

  if (reposR.status === "fulfilled") {
    const owned = reposR.value.filter((r) => !r.fork && !r.private);
    push("Total Stars", fmt(owned.reduce((s, r) => s + (r.stargazers_count || 0), 0)));
    push("Total Forks", fmt(owned.reduce((s, r) => s + (r.forks_count || 0), 0)));
  }
  if (contribR.status === "fulfilled" && contribR.value.length) {
    push("Total Contributions (last year)", fmt(contribR.value.reduce((s, d) => s + d.count, 0)));
  }
  if (prR.status === "fulfilled") push("Total PRs", fmt(prR.value));
  if (issueR.status === "fulfilled") push("Total Issues", fmt(issueR.value));
  push("Followers", fmt(profile.followers || 0));
  push("Following", fmt(profile.following || 0));
  push("Public Repos", fmt(profile.public_repos || 0));

  const W = 495;
  const rowH = 26;
  const H = 78 + rows.length * rowH + 14;
  let body = "";
  rows.forEach(([label, value], i) => {
    const y = 78 + i * rowH;
    body += `<text x="24" y="${y}" font-size="14" fill="${theme.text}">${label}</text>`;
    body += `<text x="${W - 24}" y="${y}" text-anchor="end" font-size="14" font-weight="700" fill="${theme.title}">${value}</text>`;
  });

  const svg = cardShell({
    width: W,
    height: H,
    theme,
    title: `${displayName(username)}'s GitHub Stats`,
    body,
  });
  return sendSVG(res, svg, 3600);
};
