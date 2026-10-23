# GitHub Readme Stats

A self-hosted GitHub card suite that renders SVG cards for profile READMEs: an activity graph, a stats card, a streak card, a top languages card, and a trophy card, all with deep theme and color customization.

- **Live:** https://github-readme-stats.xsrazy.web.id
- **Theme builder:** https://github-readme-stats.xsrazy.web.id/builder

> **Note:** this project was previously served from `activity-graph.xsrazy.web.id`. That domain now permanently redirects to this one, so existing embeds keep working.

> **Note on the name:** this is an independent project, built and hosted by its owner, and it is not affiliated with the original [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) by anuraghazra. It follows the same card ideas and parameter conventions, with its own codebase and an expanded card set.

![Xsrazy's Activity Graph](https://github-readme-stats.xsrazy.web.id/graph?username=xsrazy&theme=tokyo-night)

## About

GitHub Readme Stats is a self-hosted suite of five SVG cards for GitHub profile READMEs: an activity graph, a stats card, a streak card, a top languages card, and a trophy card. Every card is generated on request and served as a plain SVG image that can be embedded anywhere.

The suite started as a single activity graph, built after the popular third-party activity graph widget went offline (its deployment was disabled) and left a broken image on the owner's profile. It then grew into a full suite, so a whole profile can run on one self-hosted service instead of four different third-party ones.

All five cards share one theming system: exactly 100 themes with unique palettes, full per-card color customization, and a visual theme builder. The suite runs on infrastructure the owner controls, has zero runtime dependencies, and needs no authentication or API keys; an optional GitHub token only raises API rate limits. It only ever displays public data.

## Features

- Five cards: activity graph, stats, streak, top languages, and trophies
- 100 themes: the full theme catalog popularized by github-readme-stats, this project's five original themes, and extra palettes such as the Catppuccin and Rose Pine families. Full gallery with live previews: [themes/README.md](themes/README.md)
- Full custom colors on every card: per-element hex overrides, gradient and transparent backgrounds, following the parameter conventions popularized by github-readme-stats
- A visual [theme builder](https://github-readme-stats.xsrazy.web.id/builder) with live preview and one-click copy of the final URL and Markdown embed
- Trophy card modeled on github-profile-trophy, with the same rank thresholds and rank messages
- Languages card with three layouts (normal, compact, donut)
- Edge caching (1 hour fresh for most cards, stale-while-revalidate) so profile page loads stay fast
- Graceful fallback image when data is temporarily unavailable, so the embed never shows a broken image
- Zero dependencies: plain Node.js functions and static pages

## Architecture

- **Runtime:** Vercel Functions (Node.js); functions in `api/` (`graph.js`, `stats.js`, `streak.js`, `languages.js`, `trophy.js`) sharing `lib/cards.js` for data fetching and SVG shells, with the theme catalog in `themes/themes.js` (gallery in `themes/README.md`)
- **Routing:** `vercel.json` rewrites `/graph`, `/stats`, `/streak`, `/languages`, and `/trophy` to their functions, and `/builder` to the static builder page; `index.html` is a static landing page with live demos
- **Data sources:** the public [github-contributions-api](https://github.com/jogruber/github-contributions-api) v4 endpoint (contribution calendar, no auth) and the GitHub REST API (profile, repos, search). All queries are public-only: search queries carry `is:public` and private repos are filtered out
- **Rendering:** every SVG (path smoothing, gradient fills, donut charts, trophy tiles) is generated in code; nothing is stored

## Endpoints

| Endpoint | Description |
| --- | --- |
| `/graph` | Activity graph: daily contributions as a smooth area chart |
| `/stats` | Stats card: stars, forks, contributions (last year), PRs, issues, followers, following, public repos |
| `/streak` | Streak card: total contributions, current streak, longest streak (last-year calendar) |
| `/languages` | Top languages card: language share by bytes across the user's repos |
| `/trophy` | Trophy card: ranked achievement tiles for stars, followers, contributions, PRs, issues, public repos, and account age |
| `/builder` | Interactive theme builder page (HTML) |

## Examples

Every example below is followed by its rendered result.

### Activity graph

```text
https://github-readme-stats.xsrazy.web.id/graph?username=xsrazy&theme=tokyo-night&days=31
```

![Activity graph example](https://github-readme-stats.xsrazy.web.id/graph?username=xsrazy&theme=tokyo-night&days=31)

### Stats card

```text
https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&theme=tokyo-night
```

![Stats card example](https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&theme=tokyo-night)

### Streak card

```text
https://github-readme-stats.xsrazy.web.id/streak?username=xsrazy&theme=tokyo-night
```

![Streak card example](https://github-readme-stats.xsrazy.web.id/streak?username=xsrazy&theme=tokyo-night)

### Languages card

```text
https://github-readme-stats.xsrazy.web.id/languages?username=xsrazy&theme=tokyo-night
```

![Languages card example](https://github-readme-stats.xsrazy.web.id/languages?username=xsrazy&theme=tokyo-night)

### Trophy card

```text
https://github-readme-stats.xsrazy.web.id/trophy?username=xsrazy&theme=tokyo-night
```

![Trophy card example](https://github-readme-stats.xsrazy.web.id/trophy?username=xsrazy&theme=tokyo-night)

### Custom colors

```text
https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&title_color=ff6e96&text_color=f8f8f2&bg_color=282a36&border_color=ff79c6
```

![Custom colors example](https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&title_color=ff6e96&text_color=f8f8f2&bg_color=282a36&border_color=ff79c6)

### Gradient background

```text
https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&bg_color=30,e96443,904e95
```

![Gradient background example](https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&bg_color=30,e96443,904e95)

### No border, large corner radius

```text
https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&theme=nord&hide_border=true&border_radius=20
```

![No border example](https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&theme=nord&hide_border=true&border_radius=20)

### Hiding stats rows

```text
https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&hide=prs,issues
```

![Hiding rows example](https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&hide=prs,issues)

### Languages layouts

Normal (default):

```text
https://github-readme-stats.xsrazy.web.id/languages?username=xsrazy&layout=normal
```

![Languages normal layout](https://github-readme-stats.xsrazy.web.id/languages?username=xsrazy&layout=normal)

Compact:

```text
https://github-readme-stats.xsrazy.web.id/languages?username=xsrazy&layout=compact
```

![Languages compact layout](https://github-readme-stats.xsrazy.web.id/languages?username=xsrazy&layout=compact)

Donut:

```text
https://github-readme-stats.xsrazy.web.id/languages?username=xsrazy&layout=donut&langs_count=8
```

![Languages donut layout](https://github-readme-stats.xsrazy.web.id/languages?username=xsrazy&layout=donut&langs_count=8)

### Themes

Three of the 100 themes on the stats card:

```text
https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&theme=dracula
https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&theme=gruvbox
https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&theme=rose-pine
```

![Dracula theme example](https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&theme=dracula)

![Gruvbox theme example](https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&theme=gruvbox)

![Rose Pine theme example](https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&theme=rose-pine)


## Customization

Every card accepts the parameters below. Priority is always: explicit parameter over theme over default. Invalid values fall back silently to the theme value; they never produce an error card.

### Common parameters (all cards)

| Parameter | Default | Notes |
| --- | --- | --- |
| `username` | `xsrazy` | GitHub username to chart |
| `theme` | `github-dark` | Any theme from the list below; use the exact theme name |
| `bg_color` | theme | Hex (3, 6, or 8 digits; 8 digits adds an alpha channel) or a gradient spec `angle,color1,color2,...` with up to 6 colors, for example `bg_color=30,e96443,904e95` |
| `title_color` | theme | Hex color for the card title |
| `text_color` | theme | Hex color for body text |
| `border_color` | theme | Hex color for the card border (and grid lines) |
| `hide_border` | `false` | `true` removes the card border |
| `border_radius` | `8` | Corner radius, 0 to 30 |
| `custom_title` | card default | Replaces the card title (URL-encoded) |
| `hide_title` | `false` | `true` removes the title and shrinks the card height |

### Card-specific parameters

| Card | Parameter | Notes |
| --- | --- | --- |
| `/graph` | `days` | Days to chart, clamped to 7 to 365 (default 31) |
| `/graph` | `line`, `point` | Hex colors for the chart line and data points |
| `/stats`, `/streak`, `/trophy`, `/languages` | `ring_color` | Hex accent for key numbers |
| `/stats` | `hide` | Comma list of rows to hide: `stars`, `forks`, `contributions`, `prs`, `issues`, `followers`, `following`, `repos` |
| `/languages` | `layout` | `normal` (default), `compact` (stacked bar, two-column legend), or `donut` (donut chart with legend) |
| `/languages` | `langs_count` | Languages to show, 1 to 10 (default 6); the remainder is grouped as Other |
| `/languages` | `exclude_lang` | Comma list of languages to exclude, case-insensitive; percentages recompute over the rest |

### Themes (100)

The suite ships exactly 100 themes, each with one canonical name and a unique palette. Theme names are exact: use the names listed in the gallery, with no alternate spellings. Popular picks: `tokyo-night`, `github-dark`, `dracula`, `nord`, `gruvbox`, `onedark`, `catppuccin-mocha`, `rose-pine`, `synthwave`, and `transparent` (fully transparent background).

The five original themes of this project (`tokyo-night`, `github-dark`, `react`, `radical`, `highcontrast`) keep their exact original palettes.

**Full gallery with every palette and a live preview per theme: [themes/README.md](themes/README.md).**

## Trophy ranks

Trophies are awarded per category. Thresholds and rank messages match [github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy). A score below the C threshold shows rank UNKNOWN.

| Category | C | B | A | AA | AAA | S | SS | SSS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Stars | 1 | 10 | 30 | 50 | 100 | 200 | 700 | 2000 |
| Followers | 1 | 10 | 20 | 50 | 100 | 200 | 400 | 1000 |
| Contributions (last year) | 1 | 10 | 100 | 200 | 500 | 1000 | 2000 | 4000 |
| Pull Requests | 1 | 10 | 20 | 50 | 100 | 200 | 500 | 1000 |
| Issues | 1 | 10 | 20 | 50 | 100 | 200 | 500 | 1000 |
| Public Repos | 1 | 10 | 20 | 30 | 35 | 40 | 45 | 50 |
| Experience (account age, years) | 0.5 | 1.5 | 3 | 5 | 7.5 | 10 | 15 | 20 |

The Contributions trophy uses the total of the last-year contribution calendar from github-contributions-api, the same window the streak card uses. The Experience trophy ranks the age of the account in years.

## Environment Variables

Optional: `GITHUB_TOKEN`. When set, the stats, languages, and trophy cards use it for GitHub API calls to get higher rate limits. Cards only ever show public data: search queries are restricted with `is:public` and private repos are filtered out.

## Credits

- Contribution data comes from [github-contributions-api](https://github.com/jogruber/github-contributions-api) by jogruber.
- Theme palettes and the customization parameter conventions come from [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) by anuraghazra.
- Trophy ranks and messages come from [github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy) by ryo-ma.
- Inspired by [github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph) by Ashutosh00710, whose public instance this project replaces on the owner's profile.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to run the project locally, add a theme or a card option, and open a pull request. Questions and ideas go in [Discussions](https://github.com/xsrazy/github-readme-stats/discussions): Q&A for help, Ideas for proposals, Show and tell for profiles using these cards.

## License

MIT. See [LICENSE](LICENSE).
