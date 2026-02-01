# Agent Guide for Benchmark-Vector-DB-RAG-LLM-Result

This document provides comprehensive guidelines and commands for agentic coding assistants operating in this repository. Adhering to these rules ensures consistency, maintainability, and quality across the codebase.

---

## 1. Build, Lint, and Test Commands

### Package Manager
- **Always use bun** for dependency management and script execution. Do not use npm, yarn, or pnpm.

### Development & Build
- **Start Development Server:** `bun run dev`
- **Build for Production:** `bun run build`
- **Start Production Server:** `bun run start`
- **Lint Code:** `bun run lint` (runs ESLint)
- **Check Types:** `bunx tsc --noEmit`

### Testing
- **Status:** No test framework (Jest/Vitest) is currently configured in `package.json`.
- **Pre-requisite:** If asked to write tests, you must first install a runner (Vitest is recommended for this stack).
- **Run All Tests:** `bun test`
- **Run Single Test:** `bunx vitest run path/to/your-test.test.ts`
- **Watch Mode:** `bunx vitest`
- **Coverage:** `bunx vitest run --coverage`

---

## 2. Code Style & Conventions

### Directory Structure
- `app/`: Next.js App Router pages, layouts, and global styles.
- `components/`: Application-specific components.
- `components/ui/`: Reusable primitive components (Shadcn UI).
- `lib/`: Shared utility functions, types, and constants.
- `public/`: Static assets like images and fonts.
- `hooks/`: Custom React hooks.

### Naming Conventions
- **Component Files:** PascalCase (e.g., `BenchmarkDashboard.tsx`, `ModeToggle.tsx`).
- **Utility Files:** kebab-case (e.g., `chart-utils.ts`, `data-fetcher.ts`).
- **Components:** PascalCase function declarations (e.g., `export function MyComponent()`).
- **Variables/Functions:** camelCase (e.g., `const [isActive, setIsActive] = useState(false)`).
- **Types/Interfaces:** PascalCase (e.g., `interface BenchmarkData {}`).
- **CSS Classes:** Tailwind utility classes preferred. Custom classes (if any) should be kebab-case.

### Formatting & Imports
- **Indentation:** 2 spaces.
- **Semicolons:** Required.
- **Quotes:** Double quotes for JSX/strings, single quotes only when necessary.
- **Import Ordering:**
    1. React and Next.js built-ins.
    2. External libraries (e.g., `recharts`, `clsx`).
    3. Internal components (`@/components/...`).
    4. Internal utilities/hooks (`@/lib/...`, `@/hooks/...`).
    5. Styles (`.css`).
- **Alias:** Use the `@/` prefix for all internal absolute imports.

### TypeScript Usage
- **Strict Mode:** Enabled. Avoid using `any` at all costs. Use `unknown` if a type is truly variable.
- **Interfaces vs Types:**
    - Use `interface` for defining object shapes and component Props.
    - Use `type` for unions, intersections, or simple primitives.
- **Prop Typing:** Always define a `Props` interface for components.
- **Enums:** Prefer `const` objects or union types over TS `enum`.

### React Conventions (React 19)
- **Functional Components:** Use function declarations rather than arrow functions for top-level components.
- **Directives:**
    - Use `"use client";` at the very top for components using hooks (`useState`, `useEffect`) or browser APIs.
    - Use `"use server";` for Server Actions in `lib/` or separate action files.
- **Hooks:** Always provide dependency arrays for `useEffect`, `useMemo`, and `useCallback`.

### Styling & UI (Tailwind CSS 4)
- **Engine:** Tailwind CSS 4.
- **Merging Classes:** Always use the `cn()` utility from `@/lib/utils` for conditional class merging.
- **Variants:** Use `cva` (class-variance-authority) for components with multiple states (see `components/ui/button.tsx`).
- **Icons:** **Use Remix Icon** via class names: `<i className="ri-home-line" />`. 
    - Do not use `lucide-react`.
    - Ensure `remixicon/fonts/remixicon.css` is imported in `app/layout.tsx`.
- **Colors:** Use CSS variables (e.g., `text-primary`, `bg-background`).

### Error Handling
- **Async Logic:** Wrap all async operations in `try/catch` blocks.
- **User Feedback:** Log errors to the console in development, but provide a user-friendly UI state (e.g., toast or error message) for production.
- **Error Boundaries:** Use React Error Boundaries for critical UI sections to prevent full-page crashes.

---

## 3. Tech Stack Details

- **Framework:** Next.js 16.1.1 (App Router)
- **UI Primitives:** Radix UI / Base UI
- **Styling:** Tailwind CSS 4
- **Visuals:** Recharts (for benchmark graphs)
- **Icons:** Remix Icon
- **Fonts:** Geist (Sans, Mono)

---

## 4. Common Workflows

### Adding a Shadcn UI Component
1. Use `npx shadcn@latest add <component>`.
2. Ensure the component follows the `cva` pattern.
3. Update imports to use the `@/components/ui` alias.
4. Clean up any Lucide imports and replace with Remix Icon if applicable.

### Modifying the Dashboard
- The core logic is in `components/benchmark-dashboard.tsx`.
- Benchmark data is imported from JSON files in the parent directory.
- When adding charts, follow the `ChartContainer` pattern from `@/components/ui/chart`.
- Use the predefined `--chart-1` through `--chart-5` CSS variables for chart colors to ensure theme compatibility.

---

## 5. Security & Performance
- **Secrets:** Never hardcode API keys. Use `.env.local`.
- **Images:** Always use the Next.js `<Image />` component for optimization.
- **Bundles:** Keep client components small. Move logic to Server Components or small utility functions where possible.
- **Performance:** Memoize expensive calculations with `useMemo` when they depend on benchmark data.
- **Accessibility:** Use semantic HTML and ensure Radix UI components maintain their ARIA attributes.

---

## 6. Git Conventions
- **Commit Messages:** Follow Conventional Commits (e.g., `feat: add new chart`, `fix: layout issue on mobile`).
- **Branch Naming:** Use descriptive names (e.g., `feature/database-comparison`, `bugfix/theme-toggle`).
- **PR Summary:** Provide a clear summary of changes and mention any UI modifications with screenshots if applicable.

---

*This guide is maintained for autonomous agents. If you identify missing conventions, please update this file.*
