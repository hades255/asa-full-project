# Intent Layer Backend

Node.js + Express backend for natural-language search. Parses prompts into structured SearchIntent using an LLM, fetches candidate spaces (mock, database, or external API), ranks them, and returns recommendations with full profile data.

## Quick Start

```bash
cd intent-layer-backend
npm install
cp .env.example .env
# Edit .env: OPENAI_API_KEY (required for LLM), CANDIDATE_SOURCE
npm run dev
```

Server runs at `http://localhost:3001`.

---

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` — at minimum set:

| Variable           | Required      | Description                                                                      |
| ------------------ | ------------- | -------------------------------------------------------------------------------- |
| `OPENAI_API_KEY`   | Yes (for LLM) | OpenAI API key for intent extraction and ranking                                 |
| `CANDIDATE_SOURCE` | No            | `mock` \| `db` \| `http` \| `auto` (default) — see [Data sources](#data-sources) |

### 3. Start the server

```bash
npm run dev    # development with nodemon
# or
npm start      # production
```

### Endpoints

| Method | Path                           | Description                              |
| ------ | ------------------------------ | ---------------------------------------- |
| POST   | `/api/intent/parse`            | Parse prompt → SearchIntent JSON         |
| POST   | `/api/intent/search`           | Intent JSON → ranked recommendations     |
| POST   | `/api/intent/search-by-prompt` | Prompt → intent + ranked recommendations |
| GET    | `/api-docs`                    | OpenAPI Swagger UI                       |
| GET    | `/health`                      | Health check                             |

---

## Database Initialization

The database is only needed when `CANDIDATE_SOURCE` is `db` or `auto` and you want local search.

### Prerequisites

- PostgreSQL running locally or remote
- Create an empty database, e.g. `intent_layer`

### Step 1: Set `DATABASE_URL` in `.env`

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
# Example:
DATABASE_URL=postgresql://postgres:password@localhost:5432/intent_layer
```

### Step 2: Run database setup

```bash
npm run db:setup
```

This command:

1. `prisma generate` — generates Prisma client
2. `prisma db push` — creates/updates tables (Profile, Category, Service, Facility, User)
3. `node prisma/seed.js` — seeds from `db/allspaces-mockdb-bundle.json` if the profiles table is empty

### Individual commands

```bash
npm run db:push   # Create/update tables only
npm run db:seed   # Run seed only (skips if profiles already exist)
```

### Seed data

- Source: `db/allspaces-mockdb-bundle.json`
- Creates categories, profiles (with users), facilities, and services
- Idempotent: skips seeding if profiles already exist

---

## Data Sources (CANDIDATE_SOURCE)

Choose how candidate spaces are fetched via the `CANDIDATE_SOURCE` env variable.

| Value  | Description                              | Required env             |
| ------ | ---------------------------------------- | ------------------------ |
| `mock` | Static mock data (3 Italian restaurants) | None                     |
| `db`   | PostgreSQL via Prisma                    | `DATABASE_URL`           |
| `http` | AllSpaces backend API                    | `ALLSPACES_API_BASE_URL` |
| `auto` | Fallback: db → http → mock               | —                        |

### Mock (`CANDIDATE_SOURCE=mock`)

- No database or external API
- Returns fixed mock profiles
- Use for quick local testing or demos

```env
CANDIDATE_SOURCE=mock
```

### Database (`CANDIDATE_SOURCE=db`)

- Uses local PostgreSQL
- Run `npm run db:setup` before use
- Expand-on-empty: retries with larger radius and relaxed category filter if no results

```env
CANDIDATE_SOURCE=db
DATABASE_URL=postgresql://user:pass@localhost:5432/intent_layer
```

### External API (`CANDIDATE_SOURCE=http`)

- Fetches from AllSpaces backend
- Requires the backend to be running and reachable

```env
CANDIDATE_SOURCE=http
ALLSPACES_API_BASE_URL=http://localhost:8080/api
ALLSPACES_API_KEY=optional
```

### Auto (`CANDIDATE_SOURCE=auto`)

- Tries DB first (if `DATABASE_URL` set)
- Then HTTP (if `ALLSPACES_API_BASE_URL` set)
- Finally falls back to mock

---

## Integration with Other Projects

### As an HTTP service

Deploy the intent-layer-backend and call it from your app:

```javascript
// Parse prompt to intent
const parseRes = await fetch("http://your-intent-layer/api/intent/parse", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "Italian dinner for 4 in LondonFriday at 7pm",
    context: {
      timezone: "America/New_York",
      lastLocation: { address: "Manhattan, NY", lat: 40.73, lng: -73.99 },
    },
  }),
});
const { intent } = await parseRes.json();

// Search by intent
const searchRes = await fetch("http://your-intent-layer/api/intent/search", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "session-id": "clerk-session-id", // optional, for HTTP source
  },
  body: JSON.stringify({ intent }),
});
const { recommendations, summary } = await searchRes.json();

// Or one-shot: prompt → recommendations
const oneShotRes = await fetch(
  "http://your-intent-layer/api/intent/search-by-prompt",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: "Italian dinner for 4 in LondonFriday at 7pm",
      context: {
        lastLocation: { lat: 40.73, lng: -73.99, address: "Manhattan, NY" },
      },
    }),
  }
);
```

### As a module (import search/candidate logic)

The candidate source and search modules can be imported:

```javascript
import { fetchCandidates } from "./modules/candidateSource/index.js";
import {
  searchCandidates,
  getFullProfilesByIds,
} from "./modules/search/index.js";

// Fetch candidates (uses CANDIDATE_SOURCE env)
const { candidates, total, fullCandidatesById } = await fetchCandidates(
  intent,
  {
    sessionId: "optional",
    categoryIds: ["cat-dining-001"],
  }
);
```

### Module structure

```
src/
├── modules/
│   ├── candidateSource/     # Env-driven: mock | db | http
│   │   ├── index.js         # fetchCandidates()
│   │   └── sources/
│   │       ├── mock.js
│   │       ├── db.js
│   │       └── http.js
│   └── search/              # DB filter, condense, toFullProfile
│       ├── index.js
│       ├── filterCandidates.js
│       └── condenseProfile.js
├── services/
│   ├── candidateFetcher.js  # Re-exports from candidateSource
│   ├── searchLLMRanker.js
│   └── ...
└── controllers/
```

### Sharing the database with allspaces-backend

Use the same `DATABASE_URL` and Prisma schema. The intent-layer schema (Profile, Category, Service, Facility) is compatible with allspaces-backend. You can:

- Run intent-layer with `CANDIDATE_SOURCE=db` and point to the same DB
- Or run intent-layer with `CANDIDATE_SOURCE=http` and call allspaces-backend’s search API

---

## Environment Variables

| Variable                    | Default       | Description                         |
| --------------------------- | ------------- | ----------------------------------- |
| `PORT`                      | 3001          | Server port                         |
| `CANDIDATE_SOURCE`          | auto          | `mock` \| `db` \| `http` \| `auto`  |
| `DATABASE_URL`              | —             | PostgreSQL URL (for `db` / `auto`)  |
| `ALLSPACES_API_BASE_URL`    | —             | AllSpaces API base URL (for `http`) |
| `ALLSPACES_API_KEY`         | —             | Optional API key                    |
| `OPENAI_API_KEY`            | —             | Required for LLM                    |
| `OPENAI_MODEL`              | gpt-4o        | OpenAI model                        |
| `INTENT_EXTRACTION_ENABLED` | false         | Enable LLM intent extraction        |
| `DEFAULT_TIMEZONE`          | Europe/London | Default timezone                    |

---

## Example Requests

### Parse intent

```bash
curl -X POST http://localhost:3001/api/intent/parse \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Breakfast for 2 next Tuesday 10am for 2 hours",
    "context": {
      "timezone": "Europe/London",
      "lastLocation": {"address": "14 Grange Road, London", "lat": 51.576, "lng": -0.153}
    }
  }'
```

### Search by prompt

```bash
curl -X POST http://localhost:3001/api/intent/search-by-prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Italian restaurant in Londonfor 4 people Friday 7pm"}'
```

### Search by intent

```bash
curl -X POST http://localhost:3001/api/intent/search \
  -H "Content-Type: application/json" \
  -d '{
    "intent": {
      "date": "2025-02-14T19:00:00Z",
      "duration": 2,
      "noOfGuests": 4,
      "location": {"address": "Manhattan, NY", "lat": 40.73, "lng": -73.99},
      "categoryIds": ["cat-dining-001"]
    }
  }'
```
