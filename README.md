# Mayor Simulator Frontend

Mayor Simulator is a frontend-first demo for the `AI inDrive / Decentrathon 5.0` case. The current submission focuses on a visually strong, jury-ready website with a dense Palantir-style interface, Almaty district map, regional analytics, and visible compliance guardrails. FastAPI and ML can be attached later without redesigning the shell.

## What is included

- Palantir-style civic operations console for the demo
- Almaty district map with district switching and live-ready risk view
- sortable regional ranking table
- trend panel for employment, unemployment, and outside-labor-force signals
- district demographic profile
- compliance messaging for open data, no personal data, human-in-the-loop, and explainability
- live district risk feed support via Railway

## Current live integration

The frontend can pull district data from:

- `https://social-radar-production.up.railway.app/api/districts`

This endpoint is used for the current district risk snapshot and can be overridden with:

- `DISTRICTS_ENDPOINT`

## Stack

- React 18
- Framer Motion
- Tailwind CSS
- Recharts
- Leaflet / React Leaflet
- TanStack Table
- Parcel

## Project structure

- [src/App.jsx](/C:/Users/ford5/Desktop/INDRIVE-MVP/src/App.jsx) - main workspace and compliance shell
- [src/components/socialradar/DistrictMap.jsx](/C:/Users/ford5/Desktop/INDRIVE-MVP/src/components/socialradar/DistrictMap.jsx) - map workspace
- [src/components/socialradar/DistrictProfile.jsx](/C:/Users/ford5/Desktop/INDRIVE-MVP/src/components/socialradar/DistrictProfile.jsx) - district inspector
- [src/components/socialradar/TrendPanel.jsx](/C:/Users/ford5/Desktop/INDRIVE-MVP/src/components/socialradar/TrendPanel.jsx) - trend analytics
- [src/components/socialradar/RegionsTable.jsx](/C:/Users/ford5/Desktop/INDRIVE-MVP/src/components/socialradar/RegionsTable.jsx) - regional comparison table
- [src/api/socialRadar.js](/C:/Users/ford5/Desktop/INDRIVE-MVP/src/api/socialRadar.js) - live district API client
- [src/data/socialRadarData.json](/C:/Users/ford5/Desktop/INDRIVE-MVP/src/data/socialRadarData.json) - normalized regional and district indicators
- [src/data/almatyDistrictMap.js](/C:/Users/ford5/Desktop/INDRIVE-MVP/src/data/almatyDistrictMap.js) - prototype district geometry

## Why this matches the brief

This stage is intentionally conservative in terms of governance:

- no personal data is rendered
- the current build shows aggregated indicators only
- no autonomous government decision is made by AI
- future AI outputs must remain explainable and reviewable by a human expert
- the interface already exposes methodology and guardrails for the jury

This aligns with the brief expectations around:

- human-in-the-loop decision support
- explainability
- open-data usage
- safe handling of public-sector information

## Compliance baseline

The current frontend was checked against the case requirements and the following RK legal baseline:

- Law of the Republic of Kazakhstan `On Personal Data and Their Protection` from `21 May 2013 No. 94-V`
- Law of the Republic of Kazakhstan `On Informatization` from `24 November 2015 No. 418-V`
- Law of the Republic of Kazakhstan `On Access to Information` from `16 November 2015 No. 401-V`
- Law of the Republic of Kazakhstan `On Artificial Intelligence` from `17 November 2025 No. 230-VIII`

## Local run

```bash
npm install
npm start
```

Default local URL:

- `http://localhost:3000`

Production build:

```bash
npm run build
```

## Environment

Example environment variables are listed in [`.env.example`](/C:/Users/ford5/Desktop/INDRIVE-MVP/.env.example).

Relevant variables:

- `API_BASE_URL` - future FastAPI base URL
- `DISTRICTS_ENDPOINT` - current live district snapshot endpoint

## Data notes

- core statistics were normalized from the provided `dataset.zip`
- current district geometry is prototype geometry for demo purposes
- numbers shown in the UI are aggregated, not person-level

## Known limitations

- district geometry is approximate
- FastAPI business logic is not connected yet
- ML scoring and explainability engine are not connected yet
- no authentication or production hardening yet

## Submission checklist

Before submitting the first stage:

1. Create a private GitHub repository.
2. Push the code to that repository.
3. Add collaborator access for `dc-check`: [github.com/dc-check](https://github.com/dc-check)
4. Fill in the Google Form with the repository link, architecture description, and minimum working element.
5. Keep the repository accessible for review.
