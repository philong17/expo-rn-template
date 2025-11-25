# Expo React Native Template

A production-ready React Native template built with Expo, TypeScript, and modern best practices.

## Tech Stack

- **React Native** 0.81 + **Expo** 54
- **TypeScript** (strict mode)
- **Expo Router** - File-based routing with typed routes
- **Zustand** - State management
- **TanStack Query** - Server state & caching
- **React Native Reanimated** - Smooth animations
- **ESLint + Prettier** - Code quality

## Features

- File-based routing with Expo Router
- Feature-first architecture (`src/features/`)
- Shared UI components and utilities
- Authentication flow with JWT tokens
- Push notifications setup
- Bottom sheet integration
- Form handling with validation
- Logging system (no console.*)
- E2E testing with Detox

## Quick Start

### Use this template

Click **"Use this template"** button on GitHub, or:

```bash
gh repo create my-app --template philong17/expo-rn-template
cd my-app
```

### Setup

1. **Install dependencies**
   ```bash
   bun install
   bun postinstall
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Update app configuration**
   - Edit `app.json`: Update name, slug, bundleIdentifier, package
   - Edit `eas.json`: Update server URLs
   - Add `google-services.json` for Android Firebase

4. **Start development**
   ```bash
   bun start
   ```

5. **Run on device**
   ```bash
   bun android  # Android
   bun ios      # iOS
   ```

## Project Structure

```
app/                  # Expo Router routes (import/export only)
src/
├── features/         # Feature modules
│   └── <feature>/
│       ├── components/
│       ├── screens/
│       ├── hooks/
│       ├── store/
│       ├── data/     # API, queries, types
│       └── services/
└── shared/
    ├── components/   # Shared UI
    ├── ui/           # UI primitives
    ├── hooks/
    ├── stores/
    ├── utils/
    └── constants/
```

## Commands

| Command | Description |
|---------|-------------|
| `bun start` | Start Expo dev server |
| `bun android` | Run on Android |
| `bun ios` | Run on iOS |
| `bun lint` | Run ESLint |
| `bun typecheck` | TypeScript check |
| `bun test` | Run Jest tests |
| `bun fix` | Lint + Prettier fix |

## EAS Build

> **Note**: Builds require EAS setup and may incur costs.

```bash
# Development build
eas build --profile development --platform ios

# Production build
eas build --profile production --platform all
```

## Documentation

See [TEMPLATE_SETUP.md](TEMPLATE_SETUP.md) for detailed setup instructions.

## License

MIT
