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

- **Runtime:** Vercel Functions (Node.js); functions in `api/` (`graph.js` plus the `stats` / `streak` / `languages` cards sharing `lib/cards.js`)
- **Routing:** `vercel.json` rewrites `/graph`, `/stats`, `/streak`, and `/languages` to their functions in `api/`; `index.html` is a static landing page with live demos
- **Data source:** the public [github-contributions-api](https://github.com/jogruber/github-contributions-api) v4 endpoint, which aggregates a user's public GitHub contribution calendar (no auth required)
- **Rendering:** the SVG chart (path smoothing, gradient fill, grid, axis labels) is generated in code; nothing is stored

## API

| Endpoint | Method | Description |
| --- | --- | --- |
| `/graph` | GET | Returns the activity graph as `image/svg+xml` |
| `/stats` | GET | Returns a GitHub stats card (stars, forks, contributions, PRs, issues, followers, repos) as `image/svg+xml` |
| `/streak` | GET | Returns a contribution streak card (total, current streak, longest streak) as `image/svg+xml` |
| `/languages` | GET | Returns a top languages card (share by bytes across the user's repos) as `image/svg+xml` |

The `/stats` and `/languages` cards read from the GitHub REST API; `/streak` uses the same contribution calendar as `/graph`. The `days` parameter only applies to `/graph`.

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

Optional: `GITHUB_TOKEN`. When set, the stats and languages cards use it for GitHub API calls to get higher rate limits. Cards only ever show public data: search queries are restricted with `is:public` and private repos are filtered out.

## Credits

- Contribution data comes from [github-contributions-api](https://github.com/jogruber/github-contributions-api) by jogruber.
- Inspired by [github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph) by Ashutosh00710, whose public instance this project replaces on the owner's profile.

## License

MIT. See [LICENSE](LICENSE).
