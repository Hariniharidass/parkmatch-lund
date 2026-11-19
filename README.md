# ParkMatch Lund

A Svelte + TypeScript + Vite hackathon MVP for filtering fictional demonstration parks on an interactive Leaflet map. All included park records and attributes are explicitly demo data, not real-world facts.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). On systems where PowerShell permits npm scripts, `npm` works in place of `npm.cmd`.

## Verify

```powershell
npm.cmd run check
npm.cmd test
npm.cmd run build
```

## Data integration

See `src/data/README.md`. The UI consumes the typed `Park[]` contract from `src/types/park.ts`; replace the mock-data module with an adapter once the team confirms its CSV schema and geometry source. Missing values must remain `null` so filters do not misrepresent unknowns as confirmed matches.

## Limitations

This frontend does not provide routing, geolocation, distance, analytics, or real accessibility claims. OpenStreetMap tiles require an internet connection in the browser.
