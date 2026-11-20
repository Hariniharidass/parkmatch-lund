# ParkMatch Lund

A Svelte + TypeScript + Vite hackathon MVP for filtering fictional demonstration parks on an interactive Leaflet map. All included park records and attributes are explicitly demo data, not real-world facts.

## Run locally

From Windows Command Prompt (`cmd`), run:

```bat
cd C:\Users\hello\Desktop\SESAC-Hackathon-2026\parkmatch-web
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). Keep the Command Prompt window open while using the app. Press `Ctrl+C` to stop the development server.

## Verify

```bat
npm run check
npm test
npm run build
```

## Data integration

See `src/data/README.md`. The UI consumes the typed `Park[]` contract from `src/types/park.ts`; replace the mock-data module with an adapter once the team confirms its CSV schema and geometry source. Missing values must remain `null` so filters do not misrepresent unknowns as confirmed matches.

## Limitations

This frontend does not provide routing, geolocation, distance, analytics, or real accessibility claims. OpenStreetMap tiles require an internet connection in the browser.
