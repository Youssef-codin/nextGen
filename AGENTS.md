# TradeBot Mobile — Development Guide

## Task Completion Requirements
- Always run `bunx expo lint` and make sure it passes before considering a task complete.

## Key Conventions
- DO NOT use `any` in prop definitions unless strictly necessary.
- **Runtime**: Bun (always use `bunx`, not npm/yarn/pnpm)

## UI Development
- react-native-reusables components are in `src/components/ui/` — they're **copied, not npm packages**
- **Always check for an existing reusables component before making your own**
- Run available reusables commands to add new components first
