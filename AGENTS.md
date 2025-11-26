# Repository Guidelines

This repo is a Bun workspace for `tanstack-meta`, a TypeScript utility that turns structured metadata into TanStack Router/Start-compatible head tags. Use the notes below to stay consistent and ship safe changes.

## Project Structure & Module Organization
- Root manages workspaces; primary package lives in `packages/meta`.
- Library source is in `packages/meta/src` with focused folders such as `generate`, `normalize`, and `types`; unit tests sit next to implementations as `.test.ts`.
- Built artifacts are written to `packages/meta/dist` via `tsdown` and are the only exported files.
- `playground/` is a TanStack Start app wired to the workspace build for manual validation; keep it in sync when changing public APIs.

## Build, Test, and Development Commands
```bash
bun install                # install all workspace deps
bun meta build             # bundle to dist/ with tsdown
bun test                   # run bun:test suite in src/**
bun meta lint              # biome lint + format check
bun meta typecheck         # tsc via tsgo --noEmit
bun meta publint           # sanity-check published surface

bun playground dev         # optional: preview changes in the demo app
```

## Coding Style & Naming Conventions
- Biome enforces tabs for indentation and double quotes; run `bun run lint` before pushing.
- Code is TypeScript-first; prefer typed helpers over `any`, keep exports small and pure, and mirror the existing `generate*` and `normalize*` naming patterns.
- Tests follow `bun:test`’s `describe/test/expect` style and reside beside the code they cover.

## Testing Guidelines
- Add or update `*.test.ts` alongside new logic; extend existing fixtures in `src/generate`/`src/normalize` to cover edge cases.
- Favor deterministic inputs and explicit expectations; ensure new behavior is exercised in both metadata generation and normalization paths when relevant.
- Run `bun test` locally; for public API changes, also sanity-check the playground to catch integration regressions.

## Commit & Pull Request Guidelines
- Use short, imperative commits (e.g., “add more tests for normalize” as seen in the log); group unrelated changes separately.
- PRs should include a clear summary, rationale, and scope of impact; link issues when applicable.
- Demonstrate safety: include test results, note playground updates or screenshots for UI-facing tweaks, and update docs when the API or behavior changes.
