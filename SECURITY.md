# Security Policy

## Reporting a vulnerability

Please do NOT report security vulnerabilities in public issues, and never post secrets (tokens, keys, credentials) in any public channel of this repository.

Report privately instead, either way:

- Open a private security advisory: https://github.com/xsrazy/github-readme-stats/security/advisories/new
- Or start a discussion in the [Discussions](https://github.com/xsrazy/github-readme-stats/discussions) tab asking for a private contact channel first, without including any sensitive detail.

Reports are reviewed as quickly as possible. Please include the affected endpoint or file, the impact you observed, and steps to reproduce.

## Scope notes

- The cards only display public GitHub data. Search queries are restricted with `is:public` and private repositories are filtered out, even when a `GITHUB_TOKEN` is configured.
- The optional `GITHUB_TOKEN` environment variable is only used server-side to raise GitHub API rate limits. It is never exposed to clients.
