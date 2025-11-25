# Repository Guidelines

## Project Layout
- `app/` → Expo Router routes only; each file imports a screen and exports it
- `src/features/<domain>/` → Feature modules (components, screens, hooks, stores, data, services)
- `src/shared/` → Cross-cutting UI, hooks, utils, stores, providers, assets

## Commands & Tooling
- Package manager: **Bun only** (`bun install`, `bun postinstall`)
- Development: `bun start`, `bun android`, `bun ios`
- Quality: `bun lint`, `bun typecheck`, `bun test`

## Coding Standards
- TypeScript strict mode, 2 spaces, single quotes, 130 width
- Absolute imports via `@/`
- Use shared Logger instead of console.*
- Follow feature vs shared boundaries

## Workflow
- Commit messages: conventional format (`feat:`, `fix:`, `docs:`, etc.)
- Run `bun lint`, `bun typecheck`, `bun test` before review
