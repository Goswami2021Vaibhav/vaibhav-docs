# Vaibhav Docs

My personal interview-prep and developer-notes site, built with [Docusaurus](https://docusaurus.io/).

Live at: **https://Goswami2021Vaibhav.github.io/vaibhav-docs/**

## What's in here

Two sections:

- **Interview Prep** (`docs-interview/`) — question banks by subject (JavaScript, more subjects to come), one topic per page, questions in a collapsible self-test format: read the question, try to answer it out loud, then reveal the answer to check yourself. Curated to the highest-value questions per topic, not padded out for volume.
- **Dev Notes** (`docs/`) — quick-reference commands and runbooks for tools I use day-to-day (currently Git; Docker/Linux/CI-CD to come as notes get written).

Both are searchable from the navbar (self-hosted local search, no external service).

## Local Development

```bash
npm install
npm run start
```

Starts a local dev server with live reload.

## Build

```bash
npm run build
```

Generates static output into `build/`.

## Deployment

Deployed to GitHub Pages.

```bash
USE_SSH=true npm run deploy
# or, without SSH:
GIT_USER=<your-github-username> npm run deploy
```

This builds the site and pushes it to the `gh-pages` branch.

## Adding content

- **Interview Prep questions**: each topic file lives in `docs-interview/<subject>/`, capped at ~15 questions per topic, flat (no difficulty grouping), each in its own `<details>` accordion.
- **Dev Notes pages**: plain Markdown under `docs/<tool>/`, copy-paste-first style with a troubleshooting section at the end.
