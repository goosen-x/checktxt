# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 project using the App Router with React 19 and TypeScript.

### Directory Structure

- `app/` - Next.js App Router pages and layouts
- `components/ui/` - shadcn/ui components (new-york style)
- `lib/utils.ts` - Utility functions including `cn()` for class merging

### Key Technologies

- **Styling**: Tailwind CSS v4 with CSS variables for theming (light/dark mode support via oklch colors)
- **UI Components**: shadcn/ui with `new-york` style, Lucide icons, Radix UI primitives
- **Path Aliases**: `@/*` maps to project root

### Adding UI Components

Use shadcn CLI to add components:
```bash
npx shadcn@latest add <component-name>
```

Components are configured with RSC support enabled (`rsc: true` in components.json).

Automatically use context7 for Next.js, React, Tailwind code generation and library documentation.
