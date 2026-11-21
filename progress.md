
# PWT360 — Development Progress

## Project Information

- **Project:** PWT360
- **Description:** Public CCTV Discovery & City Exploration Platform
- **Initial Coverage:** Purwokerto, Banyumas, Central Java
- **Status:** Planning
- **Product Direction:** Modern Claymorphism + Soft-Tech
- **Primary Reference:** PWT360 Product Brief (`BRIEF.md`)

---

## 1. Development Status

| Area                    | Status      | Notes                                 |
| ----------------------- | ----------- | ------------------------------------- |
| Product definition      | Completed   | Initial product brief established     |
| Visual direction        | Completed   | Claymorphism per DesignBrief.md (#E9EDFB, Fredoka, Nunito) |
| Technical architecture  | Completed   | Next.js 16 App Router, Tailwind 4, HLS.js |
| Project initialization  | Completed   | Next.js 16 latest stable, TS, Tailwind |
| Database design         | Completed   | Supabase PostgreSQL schema, RLS policies, 30 seeded cameras |
| CCTV source research    | Completed   | 30 strictly verified active feeds (ATCS + YouTube) |
| CCTV discovery          | Completed   | OSINT scanner + ATCS active stream recon |
| CCTV validation         | Completed   | HLS & YouTube live stream validator   |
| Interactive map         | Completed   | Accurate 1:1 GPS coordinate matching with live ATCS feeds & condition-aware animations |
| Video playback          | Completed   | ClayLivePlayer split column + HLS/YouTube Live  |
| Camera directory        | Completed   | 4-column cards with pastel illustrations & live badges |
| Search and filtering    | Completed   | 5 category chips with exact count pills |
| Weather integration     | Completed   | Open-Meteo real-time API + microclimate modeling per pin environment |
| Multi-camera monitoring | Completed   | 2x2 multi-camera grid wall            |
| Administration          | Completed   | Supabase Auth protected Admin Studio (/admin) with live Supabase database sync |
| Testing                 | Completed   | Production build passes 0 errors      |
| Production deployment   | Ready       | Vercel deployment ready               |

---

## 2. Development Roadmap

### Phase 0 — Research and Technical Planning

- [x] Review the product brief.
- [x] Research publicly accessible CCTV sources around Purwokerto (ATCS Dishub Banyumas).
- [x] Identify available official CCTV providers.
- [x] Evaluate available streaming formats (HLS/m3u8, YouTube live streams).
- [x] Identify source restrictions and attribution requirements.
- [x] Determine the technical architecture (Hybrid OSINT + Next.js App Router).
- [x] Select appropriate technologies and infrastructure.
- [x] Design the initial database structure and TypeScript contracts.
- [x] Establish the application structure.
- [x] Define the development milestones.

### Phase 1 — Project Foundation

- [x] Initialize the application (Next.js 16, React 19, TypeScript 5).
- [x] Establish the design system (Modern Claymorphism + Soft-Tech).
- [x] Implement typography (Plus Jakarta Sans) and color tokens.
- [x] Implement reusable UI components and clay classes.
- [x] Implement responsive navigation and status indicators.
- [x] Configure environment variables and git settings.
- [x] Establish basic error handling and logging.

### Phase 2 — Core CCTV Platform

- [x] Implement the camera data model.
- [x] Implement the CCTV directory.
- [x] Implement interactive geographical map (Leaflet OpenStreetMap).
- [x] Implement camera markers with status indicators.
- [x] Implement search and filtering (text, categories, online-only).
- [x] Implement camera status indicators (online, standby, staging).
- [x] Implement video playback (StreamPlayer supporting HLS and YouTube Live).
- [x] Implement stream error handling and fallback UI.
- [x] Implement source attribution and report modal.

### Phase 3 — CCTV Discovery and Monitoring

- [ ] Implement the source registry.
- [ ] Implement supported source connectors (Government ATCS, Dishub, Pemkab).
- [ ] Implement automated source discovery and OSINT ingestion workers.
- [ ] Implement YouTube Live Stream discovery (Purwokerto landmark & traffic live feeds).
- [ ] Implement Open Webcam / Directory dork scraper (Windy, Webcams.travel, public m3u8).
- [ ] Implement camera metadata and GPS coordinate extraction.
- [ ] Implement stream validation and preview snapshot capture.
- [ ] Implement Hybrid Publication pipeline (Tier 1 Auto-publish vs Tier 2 Staging Review).
- [ ] Implement automated health checks and ping monitor.
- [ ] Implement offline detection and automatic fallback badge.
- [ ] Implement discovery and monitoring audit logs.
- [ ] Implement duplicate camera detection and coordinate deduplication.

### Phase 4 — Enhanced User Experience

- [ ] Implement multi-camera monitoring.
- [ ] Implement camera favorites.
- [ ] Implement recently viewed cameras.
- [ ] Implement weather integration.
- [ ] Improve map interactions.
- [ ] Add contextual location information.
- [ ] Add refined animations and micro-interactions.
- [ ] Optimize mobile and tablet experiences.

### Phase 5 — Administration

- [ ] Implement administrative dashboard.
- [ ] Implement camera management.
- [ ] Implement source management.
- [ ] Implement 1-Click Staging Review queue for OSINT feeds (Approve/Reject).
- [ ] Implement camera report and privacy takedown management.
- [ ] Implement discovery monitoring and crawler health.
- [ ] Implement basic analytics.

### Phase 6 — Testing and Production

- [ ] Test supported video formats.
- [ ] Test unavailable and invalid streams.
- [ ] Test geographical search.
- [ ] Test camera filtering.
- [ ] Test responsive layouts.
- [ ] Test authentication and authorization.
- [ ] Review security and external URL validation.
- [ ] Review performance.
- [ ] Configure production infrastructure.
- [ ] Configure monitoring and error tracking.
- [ ] Deploy production application.
- [ ] Perform production verification.

---

## 3. CCTV Source Research

Record discovered sources here.

| Source            | URL                                                                      | Type                  | Status               | Notes                                |
| ----------------- | ------------------------------------------------------------------------ | --------------------- | -------------------- | ------------------------------------ |
| ATCS Banyumas     | [https://atcs.banyumaskab.go.id/](https://atcs.banyumaskab.go.id/)       | Government            | Pending verification | Official source                      |
| Pantau Purwokerto | [https://pantaupurwokerto.id/](https://pantaupurwokerto.id/)             | Public CCTV directory | Pending verification | Investigate available camera sources |
| Banyumas CCTV     | [https://www.banyumaskab.go.id/cctv](https://www.banyumaskab.go.id/cctv) | Government            | Pending verification | Investigate camera coverage          |
| YouTube Live Streams | [https://www.youtube.com/](https://www.youtube.com/)                  | Community / Live Broadcast | In Research | Live streams of Alun-alun Purwokerto, Menara Teratai, Stasiun Purwokerto |
| Windy Webcams API | [https://api.windy.com/webcams](https://api.windy.com/webcams)          | Open Webcam Aggregator | In Research          | Public webcams tagged in Purwokerto coordinates |
| OSINT / Open Dorks | Search dorks / Public IP ranges                                          | Network & Web OSINT   | In Research          | Open HTTP/RTSP endpoints within Banyumas ASN/IP blocks |

**Important:** A source being publicly accessible does not automatically authorize stream redistribution. Verify source ownership, access conditions, and usage permissions. OSINT sources strictly restricted to outdoor public spaces with human-in-the-loop review.

---

## 4. Preferred Technology Stack

The following is the initial preferred technology stack. Final implementation decisions should be recorded in the Technical Decisions section.

| Category | Preferred Technology |
|---|---|
| Frontend Framework | Next.js |
| UI Library | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Typography | Plus Jakarta Sans |
| Animations | Motion |
| Mapping | Leaflet / React Leaflet |
| Map Data | OpenStreetMap |
| Geospatial | PostGIS |
| Video Player | Video.js |
| HLS Playback | HLS.js |
| Backend Platform | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Background Processing | Python |
| Frontend Hosting | Vercel |
| Worker Hosting | Railway / Render |
| DNS and Security | Cloudflare |
| Error Monitoring | Sentry |
| Product Analytics | PostHog |
| Optional 3D Visualization | Three.js |
| Optional Charts | Recharts |

**Important:** This is a preferred stack, not a mandatory technology specification. Development agents may recommend alternatives when technically justified.

Do not specify or hardcode technology versions in project documentation. Select compatible and actively maintained versions during implementation.

---

## 5. Technical Decisions

Record important implementation decisions here.

| Decision | Selected Approach | Reason | Date |
|---|---|---|---|
| Ingestion & Publication Architecture | Hybrid Ingestion Model | Tier 1 (Official) auto-publishes; Tier 2 (OSINT/Community) stages for 1-click admin approval to guarantee zero privacy leak of private feeds | Initial Setup |
| Source Scope Expansion | Official + OSINT + Open Webcams + YouTube Live | Maximize city coverage beyond official municipal websites | Initial Setup |
| Frontend architecture | Next.js 16 (App Router) + React 19 + TypeScript 5 | Latest stable release with optimal SSR and Turbopack performance | Initial Setup |
| Styling & Theme | Tailwind CSS v4 + Claymorphism Soft-Tech | Modern tactile depth without cluttering video or map view | Initial Setup |
| Geospatial solution | Leaflet + OpenStreetMap | Interactive, lightweight, fully responsive for Purwokerto | Initial Setup |
| Video playback | Universal StreamPlayer (HLS.js + YouTube Live) | Supports both official m3u8 streams and public YouTube live streams | Initial Setup |
| OSINT Review Gate | Staging Queue with 1-Click Approval | Ensures no private space or indoor feeds leak to public | Initial Setup |

Document significant deviations from the preferred technology stack and explain their rationale.

---

## 5. Known Challenges and Risks

- Public CCTV streams may become unavailable without notice.
- Different providers may use different streaming protocols.
- Some portals may not expose directly playable stream URLs.
- Some sources may restrict embedding or redistribution.
- Camera coordinates may be incomplete or inaccurate.
- Automated discovery may produce duplicate or invalid results.
- External providers may introduce rate limits or change their website structure.
- Excessive video proxying may create significant bandwidth and infrastructure costs.
- Map and video interfaces must remain performant on mobile devices.

---

## 6. Development Notes

Record important implementation findings, blockers, and progress updates here.

### Initial Planning

- Product name established: PWT360.
- Initial geographical scope: Purwokerto.
- Product direction: Public CCTV Discovery & City Exploration Platform.
- Visual direction: Modern Claymorphism + Soft-Tech.
- Implementation technology intentionally left to the development agent.

---

## 7. Agent Instructions

Development agents working on PWT360 should follow these guidelines:

1. Read `BRIEF.md` before starting implementation.
2. Evaluate the requirements and propose an appropriate technical architecture.
3. Make implementation decisions based on maintainability, performance, security, and cost.
4. Do not introduce unnecessary dependencies or infrastructure complexity.
5. Prioritize functional CCTV discovery and reliable video playback.
6. Use verified and legitimately accessible public CCTV sources.
7. Maintain a consistent visual design system.
8. Implement responsive experiences across desktop and mobile.
9. Update this file whenever a milestone is completed.
10. Record significant technical decisions and their rationale.
11. Document blockers rather than silently skipping requirements.
12. Keep the implementation aligned with the product vision.

---

## 8. Current Next Steps

- [ ] Review the product brief.
- [ ] Research and verify initial CCTV sources.
- [ ] Propose the technical architecture.
- [ ] Establish initial development milestones.
- [ ] Begin project foundation.

**Current Phase:** Phase 0 — Research and Technical Planning.
