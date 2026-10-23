// Streak card: current streak, longest streak, total contributions as SVG.
// Data: same jogruber contribution calendar (last year) the activity graph uses.
// Usage: /streak?username=xsrazy&theme=tokyo-night

const {
  getTheme, parseUsername, displayName, fmt, esc,
  fetchContributions, cardShell, errorCard, sendSVG,
} = require("../lib/cards");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_MS = 86400000;

function fmtDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00Z");
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function fmtRange(start, end) {
  if (!start) return "";
  if (start === end) return fmtDate(start);
  return `${fmtDate(start)} - ${fmtDate(end)}`;
}

function computeStreaks(days) {
  const total = days.reduce((s, d) => s + d.count, 0);

  // Longest run of consecutive calendar days with count > 0.
  let longest = { len: 0, start: null, end: null };
  let run = { len: 0, start: null, end: null };
  let prevTime = null;
  for (const d of days) {
    const t = Date.parse(d.date + "T00:00:00Z");
    if (d.count > 0) {
      if (run.len > 0 && prevTime !== null && t - prevTime === DAY_MS) {
        run.len += 1;
        run.end = d.date;
      } else {
        run = { len: 1, start: d.date, end: d.date };
      }
      if (run.len > longest.len) longest = { ...run };
    } else {
      run = { len: 0, start: null, end: null };
    }
    prevTime = t;
  }

  // Current streak: walk back from the last day. If the most recent day has
  // no contributions yet, the streak may still be alive from the day before.
  let current = { len: 0, start: null, end: null };
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i -= 1;
  if (i >= 0 && days[i].count > 0) {
    current.end = days[i].date;
    current.start = days[i].date;
    current.len = 1;
    let prevTime = Date.parse(days[i].date + "T00:00:00Z");
    for (let j = i - 1; j >= 0; j--) {
      const t = Date.parse(days[j].date + "T00:00:00Z");
      if (days[j].count > 0 && prevTime - t === DAY_MS) {
        current.len += 1;
        current.start = days[j].date;
        prevTime = t;
      } else {
        break;
      }
    }
  }

  return { total, longest, current };
}

module.exports = async (req, res) => {
  const q = req.query || {};
  const username = parseUsername(q);
  const theme = getTheme((q.theme || "github-dark").toString());

  let days;
  try {
    days = await fetchContributions(username);
    if (!days.length) throw new Error("no data");
  } catch (e) {
    return sendSVG(res, errorCard({
      username,
      theme,
      title: `${displayName(username)}'s Contribution Streak`,
      message: "Contribution data is temporarily unavailable",
    }), 300);
  }

  const { total, longest, current } = computeStreaks(days);
  const W = 540, H = 190;
  const col = (cx, value, label, range) => `
<text x="${cx}" y="98" text-anchor="middle" font-size="30" font-weight="700" fill="${theme.title}">${fmt(value)}</text>
<text x="${cx}" y="126" text-anchor="middle" font-size="13" fill="${theme.text}">${esc(label)}</text>
<text x="${cx}" y="148" text-anchor="middle" font-size="11" fill="${theme.text}">${esc(range)}</text>`;
  const body =
    col(100, total, "Total Contributions", fmtRange(days[0].date, days[days.length - 1].date)) +
    `<line x1="196" y1="62" x2="196" y2="152" stroke="${theme.grid}" stroke-width="1"/>` +
    col(270, current.len, "Current Streak", fmtRange(current.start, current.end) || "No active streak") +
    `<line x1="344" y1="62" x2="344" y2="152" stroke="${theme.grid}" stroke-width="1"/>` +
    col(440, longest.len, "Longest Streak", fmtRange(longest.start, longest.end));

  const svg = cardShell({
    width: W,
    height: H,
    theme,
    title: `${displayName(username)}'s Contribution Streak`,
    body,
  });
  return sendSVG(res, svg, 3600);
};
