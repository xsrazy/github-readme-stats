// Activity Graph API: renders a GitHub contribution activity graph as SVG.
// Data source: github-contributions-api (jogruber) v4, public JSON, no auth.
// Usage: /graph?username=xsrazy&theme=tokyo-night&days=31

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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

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

function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  return d;
}

function renderSVG({ username, days, theme, error }) {
  const W = 800, H = 320;
  const t = THEMES[theme] || THEMES["github-dark"];
  const padL = 46, padR = 16, padTop = 64, padBot = 34;
  const plotW = W - padL - padR;
  const plotH = H - padTop - padBot;
  const baseY = padTop + plotH;
  const displayName = username.charAt(0).toUpperCase() + username.slice(1);
  const total = days.reduce((s, d) => s + d.count, 0);

  let body = "";
  if (error) {
    body = `<text x="${W / 2}" y="${H / 2 + 10}" text-anchor="middle" font-size="16" fill="${t.text}">Contribution data is temporarily unavailable</text>`;
  } else {
    const max = Math.max(...days.map((d) => d.count), 1);
    const stepX = days.length > 1 ? plotW / (days.length - 1) : plotW;
    const pts = days.map((d, i) => ({
      x: Math.round(padL + i * stepX),
      y: Math.round(baseY - (d.count / max) * plotH),
      ...d,
    }));
    // grid lines + y labels (4 steps)
    for (let i = 0; i <= 4; i++) {
      const v = Math.round((max / 4) * i);
      const y = Math.round(baseY - (v / max) * plotH);
      body += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="${t.grid}" stroke-width="1"/>`;
      body += `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="${t.text}">${v}</text>`;
    }
    const line = smoothPath(pts);
    const area = `${line} L ${pts[pts.length - 1].x},${baseY} L ${pts[0].x},${baseY} Z`;
    body += `<path d="${area}" fill="url(#fill)" stroke="none"/>`;
    body += `<path d="${line}" fill="none" stroke="${t.line}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    for (const p of pts) {
      body += `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${t.point}"><title>${p.count} contributions on ${p.date}</title></circle>`;
    }
    // x labels: first, every ~5th, last
    const labelIdx = new Set([0, pts.length - 1]);
    for (let i = 4; i < pts.length - 1; i += 5) labelIdx.add(i);
    for (const i of [...labelIdx].sort((a, b) => a - b)) {
      const d = new Date(pts[i].date + "T00:00:00Z");
      const label = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
      const anchor = i === 0 ? "start" : i === pts.length - 1 ? "end" : "middle";
      const lx = i === 0 ? padL : i === pts.length - 1 ? W - padR : pts[i].x;
      body += `<text x="${lx}" y="${baseY + 22}" text-anchor="${anchor}" font-size="10" fill="${t.text}">${label}</text>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">
<defs>
<linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="${t.line}" stop-opacity="0.45"/>
<stop offset="100%" stop-color="${t.line}" stop-opacity="0.02"/>
</linearGradient>
</defs>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="8" fill="${t.bg}" stroke="${t.border}"/>
<text x="24" y="36" font-family="Segoe UI, Ubuntu, sans-serif" font-size="19" font-weight="600" fill="${t.title}">${esc(displayName)}&apos;s Activity Graph</text>
<text x="${W - 24}" y="36" text-anchor="end" font-family="Segoe UI, Ubuntu, sans-serif" font-size="13" fill="${t.text}">${error ? "" : `${total} contributions in the last ${days.length} days`}</text>
<g font-family="Segoe UI, Ubuntu, sans-serif">${body}</g>
</svg>`;
}

module.exports = async (req, res) => {
  const q = req.query || {};
  const username = (q.username || "xsrazy").toString().replace(/[^a-zA-Z0-9-]/g, "").slice(0, 39) || "xsrazy";
  const theme = (q.theme || "github-dark").toString();
  let daysN = parseInt(q.days, 10);
  if (!Number.isFinite(daysN)) daysN = 31;
  daysN = Math.min(90, Math.max(7, daysN));

  let svg;
  try {
    const all = await fetchContributions(username);
    const days = all.slice(-daysN);
    if (!days.length) throw new Error("no data");
    svg = renderSVG({ username, days, theme, error: false });
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  } catch (e) {
    svg = renderSVG({ username, days: [], theme, error: true });
    res.setHeader("Cache-Control", "public, s-maxage=300");
  }
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.status(200).send(svg);
};
