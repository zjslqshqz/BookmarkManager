# Tags — Bookmark Manager

A cross-browser bookmark manager extension for Chrome, Firefox, and Edge. Organize, search, and manage your bookmarks with smart grouping, tagging, URL health checking, and duplicate detection.

## Features

- **Multi-view Browsing** — View bookmarks grouped by domain, tags, or folder
- **Smart Categories** — Auto-categorize bookmarks using keyword matching with 7 preset categories (Technology, Shopping, News, Social, Video, Reference, Finance), plus custom categories
- **Tag Management** — Add/edit/delete categories with custom colors and keywords; manually tag or untag individual bookmarks
- **Search** — Full-text search across bookmark titles and URLs
- **Duplicate Detection** — Detect bookmarks with identical title + URL combinations; view and manage duplicates in a dedicated view
- **URL Health Check** — Check bookmark URLs for validity, redirects, broken links, and server errors
- **Bookmark Editing** — Edit bookmark title, URL, and folder location
- **Bulk Actions** — Select multiple bookmarks for batch URL checking or deletion
- **Internationalization** — Supports English and Chinese with auto-detection based on browser language; manually switchable in settings
- **Cross-browser** — Build for Chrome (MV3), Firefox, or Edge from a single codebase

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [WXT](https://wxt.dev) 0.20 (Web Extension Tools) |
| UI | [Vue 3](https://vuejs.org) 3.5 + [Ant Design Vue](https://antdv.com) 4.x |
| State | [Pinia](https://pinia.vuejs.org) 3.x |
| Routing | [Vue Router](https://router.vuejs.org) 5.x |
| i18n | [vue-i18n](https://vue-i18n.intlify.dev) 11.x |
| Build | [Vite](https://vitejs.dev) 8.x |
| Test | [Vitest](https://vitest.dev) 4.x |
| Language | TypeScript 6.x |
| Package Manager | pnpm 10.x |

## Project Structure

```
entrypoints/
├── background/          # Service worker (bookmark listener, URL checker, messaging)
├── i18n/                # Internationalization (en, zh-CN)
├── manager/             # Main manager page
│   ├── components/      # Vue components (Sidebar, BookmarkCard, Modals, etc.)
│   ├── composables/     # Composables (useDomainGroups, useTagGroups, useFolderGroups)
│   ├── lib/             # Utilities (domain extractor, duplicate detector, keyword matcher)
│   ├── stores/          # Pinia stores (bookmarks, settings, search, tags, URL status)
│   ├── views/           # Route views (Domain, Tag, Folder, Duplicate)
│   └── types/           # TypeScript types
├── popup/               # Browser action popup (quick launch)
└── manager.html         # Manager entry HTML
tests/                   # Unit tests
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 18
- [pnpm](https://pnpm.io) >= 10

### Install

```bash
pnpm install
```

### Development

```bash
# Chrome (default)
pnpm dev

# Firefox
pnpm dev:firefox

# Edge
pnpm dev:edge
```

### Build

```bash
# Chrome
pnpm build

# Firefox
pnpm build:firefox

# Edge
pnpm build:edge
```

### Package as ZIP

```bash
pnpm zip
pnpm zip:firefox
pnpm zip:edge
```

### Test

```bash
pnpm test
```

### Type Check

```bash
pnpm typecheck
```

## Browser Permissions

| Permission | Purpose |
|---|---|
| `bookmarks` | Read, create, update, move, and delete bookmarks |
| `storage` | Persist user settings, categories, and tag assignments |
| `alarms` | Schedule periodic URL health checks |

## License

MIT
