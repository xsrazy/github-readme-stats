# Activity Graph API

A self-hosted GitHub card suite that renders SVG cards for profile READMEs: an activity graph, a stats card, a streak card, a top languages card, and a trophy card, all with deep theme and color customization.

**Live:** https://activity-graph.xsrazy.web.id
**Theme builder:** https://activity-graph.xsrazy.web.id/builder

![Xsrazy's Activity Graph](https://activity-graph.xsrazy.web.id/graph?username=xsrazy&theme=tokyo-night)

## About

Activity Graph API draws a smooth area chart of a GitHub user's daily contributions over the last 7 to 90 days and serves it as a plain SVG image that can be embedded anywhere, including a GitHub profile README. It was built after the popular third-party activity graph widget went offline (its deployment was disabled), leaving a broken image on the profile. This version runs on infrastructure the owner controls, has zero runtime dependencies, and needs no authentication or API keys. The companion cards (stats, streak, languages, trophy) share the same theming system, so a whole profile can run on one self-hosted suite instead of four different third-party services.

## Features

- Five cards: activity graph, stats, streak, top languages, and trophies
- 148 themes: the complete github-readme-stats theme catalog, this project's five original themes, and extra palettes such as the Catppuccin and Rose Pine families
- Full custom colors on every card: per-element hex overrides, gradient and transparent backgrounds, following the parameter conventions popularized by github-readme-stats
- A visual [theme builder](https://activity-graph.xsrazy.web.id/builder) with live preview and one-click copy of the final URL and Markdown embed
- Trophy card modeled on github-profile-trophy, with the same rank thresholds and rank messages
- Languages card with three layouts (normal, compact, donut)
- Edge caching (1 hour fresh for most cards, stale-while-revalidate) so profile page loads stay fast
- Graceful fallback image when data is temporarily unavailable, so the embed never shows a broken image
- Zero dependencies: plain Node.js functions and static pages

## Architecture

- **Runtime:** Vercel Functions (Node.js); functions in `api/` (`graph.js`, `stats.js`, `streak.js`, `languages.js`, `trophy.js`) sharing `lib/cards.js` for themes, data fetching, and SVG shells
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

Example embeds:

```text
https://activity-graph.xsrazy.web.id/graph?username=xsrazy&theme=tokyo-night&days=31
https://activity-graph.xsrazy.web.id/stats?username=xsrazy&theme=dracula&hide=prs,issues
https://activity-graph.xsrazy.web.id/streak?username=xsrazy&theme=nord&ring_color=88c0d0
https://activity-graph.xsrazy.web.id/languages?username=xsrazy&layout=donut&langs_count=8
https://activity-graph.xsrazy.web.id/trophy?username=xsrazy&theme=rose_pine&column=4
```

## Customization

Every card accepts the parameters below. Priority is always: explicit parameter over theme over default. Invalid values fall back silently to the theme value; they never produce an error card.

### Common parameters (all cards)

| Parameter | Default | Notes |
| --- | --- | --- |
| `username` | `xsrazy` | GitHub username to chart |
| `theme` | `github-dark` | Any theme from the list below; underscore and hyphen spellings both work |
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
| `/graph` | `days` | Days to chart, clamped to 7 to 90 (default 31) |
| `/graph` | `line`, `point` | Hex colors for the chart line and data points |
| `/stats`, `/streak`, `/trophy`, `/languages` | `ring_color` | Hex accent for key numbers; on `/streak` the alias `fire` is also accepted |
| `/stats` | `hide` | Comma list of rows to hide: `stars`, `forks`, `contributions`, `prs`, `issues`, `followers`, `following`, `repos` |
| `/languages` | `layout` | `normal` (default), `compact` (stacked bar, two-column legend), or `donut` (donut chart with legend) |
| `/languages` | `langs_count` | Languages to show, 1 to 10 (default 6); the remainder is grouped as Other |
| `/languages` | `exclude_lang` | Comma list of languages to exclude, case-insensitive; percentages recompute over the rest |
| `/trophy` | `column` | Tiles per row; the SVG wraps and grows taller as needed. Default: all tiles in one row |
| `/trophy` | `rank` | Comma list of ranks to show, for example `rank=SSS,SS,S` |

### Themes (148)

algolia, ambient-gradient, ambient_gradient, apprentice, aura, aura-dark, aura_dark, ayu-dark, ayu-light, ayu-mirage, ayu_dark, ayu_light, ayu_mirage, bear, blue-green, blue-navy, blue_green, blue_navy, blueberry, buefy, calm, calm-pink, calm_pink, carbonfox, catppuccin-frappe, catppuccin-latte, catppuccin-macchiato, catppuccin-mocha, catppuccin_frappe, catppuccin_latte, catppuccin_macchiato, catppuccin_mocha, chartreuse-dark, chartreuse_dark, city-lights, city_lights, cobalt, cobalt2, codeSTACKr, darcula, dark, date-night, date_night, default, default-repocard, default_repocard, discord-old-blurple, discord_old_blurple, dracula, duskfox, everforest, everforest-light, everforest_light, flag-india, flag_india, flexoki, github, github-dark, github-dark-dimmed, github-light, github_dark, github_dark_dimmed, github_light, gotham, graywhite, great-gatsby, great_gatsby, gruvbox, gruvbox-light, gruvbox_light, highcontrast, holi, horizon, jolly, kacho-ga, kacho_ga, kanagawa-wave, kanagawa_wave, lackluster, maroongold, material-palenight, material_palenight, melange, merko, midnight-purple, midnight_purple, moltack, monokai, neon, nightfox, nightowl, noctis-minimus, noctis_minimus, nord, ocean-dark, ocean_dark, omni, one-dark-pro, one_dark_pro, onedark, outrun, panda, poimandres, prussian, radical, react, rose, rose-pine, rose-pine-dawn, rose-pine-moon, rose_pine, rose_pine_dawn, rose_pine_moon, shades-of-purple, shades_of_purple, shadow-blue, shadow-green, shadow-red, shadow_blue, shadow_green, shadow_red, slateorange, snazzy, solarized-dark, solarized-light, solarized_dark, solarized_light, swift, synthwave, synthwave_84, tokyo-night, tokyo-night-light, tokyo-night-storm, tokyo_night, tokyo_night_light, tokyo_night_storm, tokyonight, transparent, vision-friendly-dark, vision_friendly_dark, vitesse-dark, vitesse-light, vitesse_dark, vitesse_light, vue, vue-dark, vue_dark, yeblu

The five original themes of this project (`tokyo-night`, `github-dark`, `react`, `radical`, `highcontrast`) keep their exact original palettes. The `transparent` theme has a fully transparent background, and `ambient_gradient` has a gradient background; both can be reproduced on any card with `bg_color`.

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

## License

MIT. See [LICENSE](LICENSE).
