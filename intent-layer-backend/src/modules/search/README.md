# Search Module

Standalone module for filtering candidate spaces from the database. Easily integrable into intent-layer-backend or allspaces-backend.

## Usage in intent-layer-backend

```js
import { searchCandidates } from "./modules/search/index.js";
import { getPrisma } from "./lib/db.js";

const prisma = getPrisma();
const { candidates, total } = await searchCandidates(intent, {
  prisma,
  limit: 20,
});
```

## Usage in allspaces-backend

```js
import { prisma } from "./lib/prisma.js"; // or your Prisma instance
import { searchCandidates } from "../intent-layer-backend/src/modules/search/index.js";

const { candidates, total } = await searchCandidates(intent, {
  prisma,
  limit: 20,
});
```

Or copy the `modules/search` folder into allspaces-backend and import locally.

## API

### `searchCandidates(intent, options)`

- **intent**: `{ location?, userLocation?, categoryIds? }` — SearchIntent from intent parse
- **options.prisma**: PrismaClient (required)
- **options.limit**: Max results (default 20)
- **options.categoryIdMap**: `{ "cat-dining-001": "uuid" }` — map semantic IDs to DB UUIDs

Returns: `{ candidates, total }`

### `filterCandidates(prisma, intent, opts)`

Lower-level: returns raw Prisma profiles. Use when you need the full objects.

### `condenseProfile(profile)`

Condense a Prisma profile for LLM input (token-efficient).
