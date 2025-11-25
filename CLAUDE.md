# CLAUDE.md

Guidance for AI assistants when working with this codebase.

## Project Overview
- React Native app built with Expo 54, TypeScript (strict), Zustand, TanStack Query, and Expo Router.
- Feature-first architecture with clear separation between routes and business logic.

## Tooling & Commands
```bash
bun install       # Required package manager (never npm/yarn)
bun postinstall   # Apply patches after installs
bun start         # Expo dev server
bun android | bun ios  # Run on device/emulator
bun lint          # ESLint (fixes enabled)
bun prettier:fix  # Prettier formatting
bun fix           # lint:fix + prettier:fix
bun typecheck     # TypeScript validation
bun test          # Jest suite
```

## Architecture
```
app/       # Expo Router routes only (import + export screens)

src/
├─ features/<domain>/
│  ├─ components/    # Feature UI pieces
│  ├─ screens/       # Screen components
│  ├─ hooks/         # Feature hooks
│  ├─ store/         # Zustand stores
│  ├─ data/          # API + types
│  └─ services/      # Business logic
└─ shared/
   ├─ components/ ui/ layouts/
   ├─ hooks/ stores/ providers/
   ├─ services/ utils/ constants/
   └─ assets/
```

## Key Rules
- Route files in `app/` must only import and export screen components
- Always import `Text` from `@/shared/ui/Text`
- Use `Pressable` over `TouchableOpacity`
- Use absolute imports via `@/`
- Use Logger from `@/shared/utils/helpers/logger` (never console.*)

## Query Guards (MANDATORY)
```typescript
const { user } = useAuth();
const shouldFetch = enabled && !!user?.id;

return useQuery({
  queryKey: ['key', user?.id],
  queryFn,
  enabled: shouldFetch &&
    AppStateManager.isActive() &&
    !SimpleAuthManager.isRefreshing(),
});
```

## Commit Format
```
feat: add new feature
fix: bug fix
docs: documentation
refactor: code refactoring
test: add/fix tests
chore: tooling updates
```
