# toto-picks — Movie & Series Catalog

## Project Overview
A movie and series catalog website (IMDB-like) with advanced filters.
Stack: Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query v5, Zustand v5, next-intl v4, Motion v12.
Data source: TMDB API (no backend, no database).

## Stack Versions (March 2026)
- next: 16.1.6 (Turbopack default, React 19.2)
- react: 19.2
- typescript: 5+
- tailwindcss: v4
- shadcn/ui: latest (v3.5+, unified radix-ui package)
- @tanstack/react-query: 5.90.x
- zustand: 5.0.11
- next-intl: 4.8.3
- motion: 12.x (formerly framer-motion — package is now `motion`, NOT `framer-motion`)

## Architecture
- `src/app/` — Next.js App Router pages (root layout only, no locale pages here)
- `src/app/[locale]/` — all locale-prefixed pages
- `src/components/` — shared UI components
- `src/components/ui/` — shadcn/ui components (do not edit manually)
- `src/components/layout/` — header, footer
- `src/components/cards/` — movie-card, person-card
- `src/features/` — feature-based modules (filters, home, catalog)
- `src/lib/` — utilities, TMDB client, helpers, constants
- `src/store/` — Zustand stores (filters, favorites)
- `src/i18n/` — next-intl routing config and request config
- `src/messages/` — translation files (en.json, ru.json)
- `src/providers/` — React context providers
- `src/hooks/` — custom hooks
- `src/types/` — TypeScript types and interfaces
- `src/proxy.ts` — next-intl proxy (Next.js 16 uses proxy.ts instead of middleware.ts)

## Code Style
- Always use TypeScript with strict types — no `any`
- Prefer named exports over default exports for components
- Use `cn()` utility from `lib/utils` for conditional classNames
- Components: functional only, no class components
- File naming: `kebab-case` for files, `PascalCase` for components
- Group imports: external libs → internal → relative
- Use `const` arrow functions for components: `export const MyComponent = () => {}`

## Design
- Dark theme only (no light mode needed)
- Primary color: use CSS variables defined in globals.css
- All pages must be responsive: mobile (375px), tablet (768px), desktop (1280px+)
- Use Motion (`motion` package) for page transitions and card hover effects
- Cards always show: poster, title, rating, year, genre

## Next.js 16 Specifics
- Use `proxy.ts` for next-intl routing (middleware.ts is deprecated in Next.js 16)
- Use `"use cache"` directive for caching where applicable
- Turbopack is the default bundler — no webpack config needed
- React Compiler is stable — avoid unnecessary useMemo/useCallback

## Internationalization
- Two languages: English (`en`) and Russian (`ru`)
- Default language: Russian
- All user-facing strings must use `useTranslations()` from next-intl in Client Components
- Use `getTranslations()` in Server Components
- Never hardcode UI text strings in components
- Route structure: `/ru/...` and `/en/...`

## Data & State
- All TMDB API calls go through `src/lib/tmdb.ts` — never call TMDB directly from components
- Use TanStack Query for all data fetching (not useEffect + fetch)
- Favorites are stored in `localStorage` key `toto-picks-favorites` via Zustand persist middleware
- Filter state lives in Zustand store `src/store/filters.ts`
- Sync filters to URL search params for shareable links (via use-filters-url-sync hook)

## Git
- After completing each logical task, create a git commit using the `/commit` skill
- Commit messages in English, format: `type(scope): description`
  - Types: `feat`, `fix`, `refactor`, `style`, `chore`
  - Example: `feat(catalog): add year range filter`
- Never commit `.env.local` or any files with API keys
- Stage only relevant files — avoid `git add -A` without review

## Environment
- Node.js + npm
- TMDB API key stored in `.env.local` as `TMDB_API_KEY` (server-only, no NEXT_PUBLIC prefix)
- Dev server: `npm run dev` → http://localhost:3000 (redirects to /ru)

## Do NOT
- Do not create a backend or database — TMDB API is the only data source
- Do not add light mode
- Do not use Redux (use Zustand)
- Do not use React class components
- Do not hardcode movie data
- Do not add features not requested by the user
- Do not use `framer-motion` package — use `motion` instead
- Do not use `middleware.ts` for next-intl — use `proxy.ts`
