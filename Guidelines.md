# 🌿 ProToolsGarden — Project Guidelines

> **Pro Tools Garden** is an online shop for gardening tools and heavy construction equipment.  
> Stack: React 18 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui · Radix UI · Supabase · React Router v7

---

## 📁 Project Structure

```
ProToolsGarden/
├── src/                   # All application source code
├── node_modules/          # Dependencies (never commit)
├── index.html             # Vite entry point
├── vite.config.ts         # Vite configuration
├── vite-env.d.ts          # TypeScript Vite env types
├── package.json           # Dependencies & scripts
├── pnpm-workspace.yaml    # pnpm workspace config
├── postcss.config.mjs     # PostCSS (Tailwind pipeline)
├── default_shadcn_theme.css  # shadcn/ui base theme
├── .env.local             # 🔒 Local secrets — NEVER commit
├── .gitignore             # Git ignore rules
├── ATTRIBUTIONS.md        # Third-party credits
└── Guidelines.md          # This file
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| UI Primitives | Radix UI |
| Backend / DB | Supabase |
| Routing | React Router v7 |
| Forms | React Hook Form |
| Charts | Recharts |
| Animations | Motion (Framer Motion v12) |
| Icons | Lucide React |
| Package Manager | pnpm |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Install & Run

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```



## 🧱 Architecture & Conventions

### Component Structure
- Use **functional components** with hooks only — no class components.
- Co-locate component styles with the component file where possible.
- Shared UI primitives live in `src/components/ui/` (shadcn/ui pattern).

### Styling Rules
- Use **Tailwind utility classes** as the primary styling method.
- Use `cn()` (clsx + tailwind-merge) for conditional class merging.
- Follow the shadcn/ui token system defined in `default_shadcn_theme.css`.
- Do **not** write raw CSS unless absolutely necessary.

### TypeScript
- Strict mode is on — no `any` types unless absolutely justified.
- Define prop types with `interface`, not `type`, for component props.
- Keep types co-located with their component unless reused across multiple files.

### Routing
- All routes are defined using **React Router v7**.
- Use `<Link>` for internal navigation — never `<a>` tags.

### State Management
- Prefer **local state** (`useState`) and **context** before reaching for a global store.
- Server state is managed via **Supabase** client queries.

---

## 🗂️ Feature Areas

### Shop
- Product listing pages (gardening tools, construction tools)
- Product detail pages
- Category filtering and search

### Cart & Checkout
- Cart state management
- Order flow

### Admin (if applicable)
- Product management
- Order management

---

## ✅ Code Quality Standards

- **No unused imports** — remove them before committing.
- **No console.log** in production code — use a proper logger or remove.
- Keep components **under 200 lines** — split if larger.
- Write **descriptive commit messages**: `feat: add product filter by category`.


---

## 🔒 Security

- All Supabase keys used in the frontend must be the **anon** (public) key only.
- Never expose the **service_role** key anywhere in the frontend codebase.
- Row Level Security (RLS) must be enabled on all Supabase tables.
- `.env.local` is git-ignored and must never be committed.

---

## 📦 Key Dependencies Reference

| Package | Purpose |
|---|---|
| `@supabase/supabase-js` | Database & Auth |
| `react-router-dom` | Client-side routing |
| `react-hook-form` | Form management |
| `lucide-react` | Icon library |
| `recharts` | Data visualisation |
| `motion` | Animations |
| `sonner` | Toast notifications |
| `cmdk` | Command palette |
| `vaul` | Drawer component |
| `embla-carousel-react` | Carousel / sliders |
| `next-themes` | Dark/light mode |
| `date-fns` | Date utilities |

---
