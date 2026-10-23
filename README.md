# Activity Graph API

A self-hosted GitHub contribution activity graph API that renders SVG charts for profile READMEs.

**Live:** https://activity-graph.xsrazy.web.id

![Xsrazy's Activity Graph](https://activity-graph.xsrazy.web.id/graph?username=xsrazy&theme=tokyo-night)

## About

Activity Graph API draws a smooth area chart of a GitHub user's daily contributions over the last 7 to 90 days and serves it as a plain SVG image that can be embedded anywhere, including a GitHub profile README. It was built after the popular third-party activity graph widget went offline (its deployment was disabled), leaving a broken image on the profile. This version runs on infrastructure the owner controls, has zero runtime dependencies, and needs no authentication or API keys.

## Features

- Smooth SVG area chart of daily GitHub contributions, rendered on request
- Five built-in themes: `tokyo-night`, `github-dark`, `react`, `radical`, `highcontrast`
- Configurable range via the `days` parameter (7 to 90 days, default 31)
- Total contribution count for the selected range shown in the chart header
- Per-day values available as hover tooltips on every data point
- Edge caching (1 hour fresh, stale-while-revalidate) so profile page loads stay fast
- Graceful fallback image when contribution data is temporarily unavailable, so the embed never shows a broken image
- Zero dependencies: a single Node.js function and a static landing page

## Architecture

- **Runtime:** Vercel Functions (Node.js), one function at `api/graph.js`
- **Routing:** `vercel.json` rewrites `/graph` to `/api/graph`; `index.html` is a static landing page with a live demo
- **Data source:** the public [github-contributions-api](https://github.com/jogruber/github-contributions-api) v4 endpoint, which aggregates a user's public GitHub contribution calendar (no auth required)
- **Rendering:** the SVG chart (path smoothing, gradient fill, grid, axis labels) is generated in code; nothing is stored

## API

| Endpoint | Method | Description |
| --- | --- | --- |
| `/graph` | GET | Returns the activity graph as `image/svg+xml` |

| Parameter | Required | Default | Notes |
| --- | --- | --- | --- |
| `username` | No | `xsrazy` | GitHub username to chart |
| `theme` | No | `github-dark` | One of `tokyo-night`, `github-dark`, `react`, `radical`, `highcontrast` |
| `days` | No | `31` | Days to chart, clamped to 7 to 90 |

Example:

```text
https://activity-graph.xsrazy.web.id/graph?username=xsrazy&theme=tokyo-night&days=31
```

## Environment Variables

None. The function needs no secrets or configuration.

## Credits

- Contribution data comes from [github-contributions-api](https://github.com/jogruber/github-contributions-api) by jogruber.
- Inspired by [github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph) by Ashutosh00710, whose public instance this project replaces on the owner's profile.

## License

MIT. See [LICENSE](LICENSE).
