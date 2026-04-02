# SocialRadar

SocialRadar is an early warning and decision-support platform for detecting social risk signals across Almaty districts.
The project is being built for `AI inDrive / Decentrathon 5.0`, case `#3`, where explainability, human-in-the-loop decision making, and public-sector applicability are mandatory.

## Project idea

SocialRadar helps operators and analysts see where social pressure may be growing before the situation escalates.
Instead of replacing a human expert, the system aggregates district-level signals, visualizes risk, explains why a case is being flagged, and leaves the final action to the operator.

In practical terms, the product combines:

- district-level monitoring across Almaty
- risk scoring and prioritization
- explainable AI recommendations
- case-centered operator workflow
- visible governance and compliance guardrails

## Current prototype scope

The current repository contains a working frontend-first prototype with:

- a Palantir-style analytics dashboard
- Almaty district map and district drilldown
- overview, district dossier, active case, and methodology screens
- AI recommendation panel with explainability blocks
- human-in-the-loop actions: `Approve`, `Escalate`, `Reject`
- data provenance and limitations panel
- live district snapshot integration through API

This stage is focused on proving the product UX, decision flow, and architecture readiness for full backend and ML integration.

## Demo video

For submission review, the demo video is attached directly in this repository:

- [IMG_1154.MP4](./IMG_1154.MP4)

## Quick start

```bash
npm install
npm start
```

Local URL:

- `http://localhost:3000`

Production build:

```bash
npm run build
```

## Environment

See [`.env.example`](./.env.example)

Main variables:

- `API_BASE_URL` - future FastAPI base URL
- `DISTRICTS_ENDPOINT` - current district snapshot endpoint

Current live endpoint:

- `https://social-radar-final.onrender.com/api/districts`

## Architecture

Architecture diagram:

- [public/assets/architecture.png](./public/assets/architecture.png)

High-level architecture:

1. Open/public and normalized indicator sources
2. Data preparation and feature engineering layer
3. ML scoring and explainability layer
4. FastAPI prediction and district snapshot API
5. React operator dashboard

Current status in this repo:

- frontend analytics workspace is implemented
- UX for cases and explainability is implemented
- district snapshot API consumption is implemented
- backend and ML are being integrated as the next stage

## Minimal working element

The current MVP already demonstrates a working end-to-end interaction:

1. The frontend fetches district data from `DISTRICTS_ENDPOINT`
2. The map and summary cards display district risk context
3. The operator opens a case and sees AI recommendation + explanation
4. The final decision remains manual and auditable

Technical entry point:

- [src/api/socialRadar.js](./src/api/socialRadar.js)

## Compliance with case #3

The prototype is designed around the main requirements of the challenge:

- Explainability: the UI shows why a recommendation appears
- Human-in-the-loop: AI does not make the final decision
- No personal data: only aggregated district-level signals are shown
- Open/public-data mindset: sources and limitations are surfaced explicitly
- GovTech relevance: the workflow is built for analyst/operator use, not entertainment

Important:

- this prototype does not claim autonomous decision making
- this prototype does not claim full production ML deployment in the frontend stage
- any proxy or demo-layer data must remain explicitly marked as such

## Tech stack

- React 18
- React Router
- Framer Motion
- Tailwind CSS
- Recharts
- Leaflet / React Leaflet
- TanStack Table
- Parcel

## Key files

- [src/App.jsx](./src/App.jsx)
- [src/routes/OverviewPage.jsx](./src/routes/OverviewPage.jsx)
- [src/routes/DistrictPage.jsx](./src/routes/DistrictPage.jsx)
- [src/routes/CasePage.jsx](./src/routes/CasePage.jsx)
- [src/routes/MethodologyPage.jsx](./src/routes/MethodologyPage.jsx)
- [src/components/socialradar/DistrictMap.jsx](./src/components/socialradar/DistrictMap.jsx)
- [src/components/advisor/AdvisorPanel.jsx](./src/components/advisor/AdvisorPanel.jsx)
- [src/components/socialradar/DataProvenancePanel.jsx](./src/components/socialradar/DataProvenancePanel.jsx)
- [src/hooks/useSocialRadarWorkspace.js](./src/hooks/useSocialRadarWorkspace.js)

## Product roadmap

The next stages of SocialRadar are planned as follows:

### Backend integration

- connect full FastAPI endpoints for districts, cases, predictions, and audit trail
- replace frontend-only demo actions with persistent server-side case workflow
- add role-based operator and reviewer states

### ML integration

- connect trained risk scoring model
- expose explainability outputs for each recommendation
- support district-level comparison and dynamic risk updates
- improve model provenance and score transparency

### Mobile application

After the web control center is stabilized, the project is planned to expand into a mobile app for field and operational workflows.

Planned mobile use cases:

- quick case review on phone
- push alerts for high-risk districts
- mobile escalation workflow
- supervisor approval flow
- compact district snapshot for on-the-go decision makers

In this model:

- the web platform remains the main analytical headquarters
- the mobile app becomes the lightweight operational companion

## Current limitations

- district geometry is used in prototype/demo mode and is not positioned as official GIS publication
- part of the current data layer may still rely on demo/proxy values and must remain explicitly marked
- full backend persistence is not fully merged into the frontend workflow yet
- full production ML lifecycle is still being integrated by the team

## Positioning for judges

SocialRadar should be understood as:

- a GovTech risk intelligence platform
- an explainable decision-support system
- a human-centered operational console
- a scalable base for backend, ML, and mobile expansion

The current prototype already shows the most important thing:
there is a clear operator workflow, a clear AI-assist logic, and a realistic path to production integration.
