# Contributing to GitHub Readme Stats

Thanks for your interest in improving this project. This guide explains how to set the project up locally, how to add themes and card options, and what a good pull request looks like.

Questions are welcome in [Discussions](https://github.com/xsrazy/github-readme-stats/discussions): use Q&A for help, Ideas for proposals, and Show and tell for profiles that use these cards. Please open an issue only for bugs and concrete feature requests.

## Setup

You need Git and Node.js (18 or newer). There are no runtime dependencies and nothing to install for the card functions themselves.

1. Fork the repository on GitHub.
2. Clone your fork:

   ```bash
   git clone https://github.com/<your-username>/github-readme-stats.git
   cd github-readme-stats
   ```

3. Create a branch for your change:

   ```bash
   git checkout -b my-change
   ```

4. Run the site locally. The functions in `api/` are plain Node.js request handlers, so the easiest full local run is the Vercel CLI:

   ```bash
   npx vercel dev
   ```

   Then open `http://localhost:3000/` for the landing page, `http://localhost:3000/builder` for the theme builder, and call the cards directly, for example `http://localhost:3000/stats?username=xsrazy&theme=dracula`.

   Optional: set a `GITHUB_TOKEN` environment variable to raise GitHub API rate limits while testing. The cards only ever display public data, with or without a token.

## Adding a theme

1. Add ONE entry to `PALETTES` in `themes/themes.js`, keyed by the canonical theme name. A palette uses the fields `bg`, `border`, `title`, `line`, `point`, `grid`, and `text` (hex colors). A palette may also carry `bgGradient` with an `angle` and `colors` list.
2. Add only the canonical name, spelled exactly as it should be used. Do not add spelling variants, aliases, or a second palette with the same colors.
3. Add a row for the theme to the gallery in `themes/README.md`: name, palette hex values, and a preview image that points at the live card, for example `https://github-readme-stats.xsrazy.web.id/stats?username=xsrazy&theme=<name>`.
4. Spot-check the new theme on at least two different cards before opening the PR.

## Adding a card option

1. Shared options (colors, border, title) are parsed in `resolveStyle()` in `lib/cards.js`. Card-specific options are parsed in the endpoint file in `api/` (`graph.js`, `stats.js`, `streak.js`, `languages.js`, `trophy.js`).
2. Follow the existing conventions: an explicit parameter wins over the theme, the theme wins over the default, and invalid values fall back silently. An option must never turn a card into an error.
3. Document the option in the parameter tables in `README.md`, with an example whose rendered result is shown right below it. If the option is visual, expose it in the theme builder (`builder.html`) as well.
4. Keep the default output unchanged: with no new parameters set, every card must render exactly as before.

## Pull requests

- One topic per pull request. Keep unrelated changes in separate PRs.
- The default output of every card must stay byte-identical, unless the PR exists specifically to change that output. If output changes on purpose, say so in the PR description and show before and after previews.
- Describe what you verified: which endpoints you called, which themes or parameters you spot-checked, and the preview URLs you used. For visual changes, include screenshots or live preview URLs.
- Documentation is in English. Endpoint paths and existing parameter names are public API: do not rename or remove them in the same PR that changes behavior.
- By contributing, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
