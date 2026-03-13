## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure API (create `.env` from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Set `EXPO_PUBLIC_INTENT_API_BASE_URL` to your AllSpaces backend URL (e.g. `http://localhost:8080/api`).

## Run

```bash
npm start
# or
npx expo start
```

## Flow

1. **Search Screen**: When, Duration, Guests, Where (location), Categories
2. Tap "Use my location" to set location from device GPS
3. Tap "Continue" to search
4. **Search Results**: List of spaces from `POST /mobile/profiles/search`
5. Tap a space to view details

## APIs Used

- `POST /mobile/profiles/search` - Search with `{ page, limit, location: { lat, lng }, categoryIds }`
- `GET /mobile/profiles/filters` - Get filter categories
