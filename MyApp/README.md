# MyApp - Search Flow (AllSpaces MVP 1.5)

Standalone search flow copied from `allspaces-mobile-app`. Same APIs and frontend design.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure API (create `.env` from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Set `EXPO_PUBLIC_API_BASE_URL` to your AllSpaces backend URL (e.g. `http://localhost:8080/api`).

3. For authenticated search, ensure your backend accepts the request. The app sends `session-id` from SecureStore when available. You may need to log in via the main AllSpaces app first and have session stored.

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
