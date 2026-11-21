# PWT360 — Product Brief

## 1. Product Overview

**PWT360** is a public CCTV discovery and city exploration platform focused initially on Purwokerto, Banyumas, Central Java, Indonesia.

The platform aims to bring publicly accessible CCTV streams from different sources into one centralized, intuitive, and visually appealing interface.

Instead of requiring users to visit multiple government websites or navigate poorly organized CCTV directories, PWT360 provides a unified experience where users can discover camera locations, explore them through an interactive map, and watch available public CCTV streams directly from the platform.

PWT360 should feel like a modern city-monitoring and exploration platform rather than a conventional government CCTV dashboard.

The initial geographical focus is Purwokerto, with an architecture and product direction that can accommodate expansion to other cities in the future.

## 2. Product Vision

**Explore Purwokerto from every angle.**

PWT360 aims to make publicly available city surveillance and traffic information more accessible, discoverable, and easier to understand.

The platform should become a centralized destination for people who want to:

- Check traffic conditions around Purwokerto.
- Explore different public locations through available CCTV cameras.
- Discover publicly accessible cameras without visiting multiple websites.
- Monitor road intersections and public spaces.
- Understand the current conditions of different areas in the city.

The long-term vision is to establish PWT360 as a scalable public CCTV discovery platform that can eventually cover multiple cities across Indonesia.

## 3. Target Audience

The platform is intended for:

**General Public**
- Residents of Purwokerto and surrounding areas.
- People who want to check traffic before travelling.
- Visitors and tourists exploring Purwokerto.

**Commuters and Travelers**
- People checking road conditions.
- Drivers looking for alternative routes.
- People monitoring busy intersections and public areas.

**Local Communities**
- People interested in public infrastructure and city conditions.
- Communities that want easier access to publicly available city information.

## 4. Core Product Features

### 4.1. CCTV Discovery

The platform should provide a centralized directory of publicly accessible CCTV cameras around Purwokerto.

Users should be able to discover cameras from multiple legitimate public sources, including:

- Government CCTV portals.
- ATCS (Area Traffic Control System).
- Public transportation monitoring systems.
- Official public webcams.
- Other publicly advertised CCTV services.

Each camera should have relevant information, including:

- Camera name.
- Location and geographical coordinates.
- Area or neighborhood.
- Camera category.
- Source or provider.
- Stream availability.
- Last successful status check.
- Original source reference.

The system should support multiple streaming formats and playback methods where technically possible.

### 4.2. Automated CCTV & OSINT Discovery

PWT360 does not rely solely on manually registered or government-only cameras.

The platform employs a hybrid ingestion pipeline that actively aggregates publicly exposed feeds across the internet:

- **Official Portals & APIs:** ATCS Banyumas, Pemkab CCTV, Dishub streams.
- **Public YouTube Streams:** 24/7 community live streams (e.g., Alun-Alun Purwokerto, Menara Pandang Teratai, major train stations, road traffic).
- **Open Webcam Aggregators:** Windy Webcams, Webcams.travel, EarthCam public feeds.
- **OSINT & Open Directory Dorks:** Search engine dorks and indexed public endpoints (m3u8/HLS, MJPEG, public snapshot streams).
- **Network Reconnaissance:** Identified open RTSP/HTTP video endpoints located within Banyumas/Purwokerto IP blocks and ASNs.
- **Community Submissions:** Public submissions with source URL and coordinates.

#### Hybrid Ingestion & Publication Workflow

To balance scale with strict privacy guarantees, PWT360 uses a two-tier publication pipeline:

1. **Tier 1 — Trusted / Official Sources (Auto-Publish):**
   - Verified government portals (ATCS, Pemkab) and verified official live streams.
   - Stream automatically verified for reachability and published directly to the active map and directory.
2. **Tier 2 — OSINT & Open Web Feeds (Staging Review):**
   - Feeds discovered via OSINT, network reconnaissance, or community submissions enter `staging_review` status.
   - Automated workers verify stream health, resolve geocoordinates, and capture a 1-frame preview snapshot.
   - Feeds are held in an administrative review queue where an admin can approve or reject them with a single click.
   - Feeds must be confirmed as outdoor public spaces (roads, intersections, squares, tourist landmarks). Any indoor or private feed is immediately rejected and blacklisted.
3. **Public Safeguards:**
   - Every camera player includes a "Report Feed" button allowing users to flag broken, offline, or misplaced/private feeds.
   - Automated health monitoring routinely removes or flags feeds that go offline.

### 4.3. Interactive CCTV Map

The map should be one of the primary experiences of PWT360.

Users should be able to explore Purwokerto geographically and identify available cameras through interactive markers.

Expected capabilities:

- Interactive and responsive map.
- Camera markers with visual status indicators.
- Marker clustering for dense camera locations.
- Camera previews when selecting markers.
- Camera location information.
- Zoom and pan interactions.
- Search by location or area.
- Filtering by camera category and availability.
- Ability to navigate from a camera preview to its detailed view.

The map should feel integrated into the application rather than simply embedding a standard map.

### 4.4. CCTV Video Player

Users should be able to watch available public CCTV streams directly from PWT360.

The playback experience should support different source formats where feasible.

Expected capabilities:

- Live stream playback.
- Appropriate playback controls.
- Full-screen mode.
- Loading and buffering indicators.
- Offline and unavailable states.
- Stream error handling.
- Camera information alongside the player.
- Original source attribution.

The application must not assume that every public CCTV source provides the same streaming format.

When direct playback is not supported, the interface should communicate the limitation clearly instead of displaying a broken player.

PWT360 should preferably play authorized streams directly from their original providers rather than unnecessarily relaying all video traffic through its own infrastructure.

### 4.5. Multi-Camera Monitoring

Users should have the option to monitor several cameras simultaneously.

Potential capabilities:

- Multi-camera viewing layout.
- 2x2 camera grid.
- Expandable camera panels.
- Quick camera switching.
- Individual full-screen viewing.
- Ability to add and remove cameras from the viewing layout.

This feature should remain usable on different screen sizes, including mobile devices.

### 4.6. Search and Filtering

The platform should provide a centralized search experience.

Users should be able to search by:

- Camera name.
- Street or intersection.
- Neighborhood or area.
- Public facility.
- Camera category.

Filtering options should include:

- Online cameras.
- Offline cameras.
- Traffic cameras.
- Public-space cameras.
- Tourism-related cameras.
- Other supported categories.

Search results should be synchronized with the map and camera directory where appropriate.

### 4.7. Weather and City Context

PWT360 may provide additional contextual information to make the platform more useful.

Potential features:

- Current weather in Purwokerto.
- Temperature and weather conditions.
- Rain information.
- Weather forecasts.
- Weather overlays on the map.
- Time and local date.
- Relevant city information.

Weather information must come from a reliable external data source and clearly distinguish current observations from forecasts.

Visual weather effects and animations may be used as decorative enhancements, provided they do not compromise performance or usability.

### 4.8. Favorites and Personalization

Users may be able to save frequently accessed cameras.

Potential capabilities:

- Favorite cameras.
- Recently viewed cameras.
- Personalized camera collections.
- Remember preferred viewing layouts.

These capabilities should not require an account unless persistent cross-device synchronization is necessary.

### 4.9. Administrative Dashboard

PWT360 should include an administrative interface for managing camera information and discovery activities.

Expected capabilities:

- Add and edit camera information.
- Register and manage stream sources.
- Verify discovered cameras.
- Approve or reject submitted cameras.
- Monitor camera availability.
- Review failed stream connections.
- Manage camera categories and locations.
- Review discovery logs.
- View basic platform statistics.

Administrative functionality must be protected through appropriate authentication and authorization.

## 5. Visual Identity and Design Direction

### Design Concept: Modern Claymorphism + Soft-Tech

PWT360 should have a distinctive visual identity.

The desired interface combines modern dashboard aesthetics, soft claymorphism, and a clean geospatial exploration experience.

The design should feel:

- Modern.
- Friendly.
- Premium.
- Interactive.
- Approachable.
- Technologically sophisticated.
- Visually distinctive.

Avoid making the platform look like a conventional enterprise monitoring system or an outdated government portal.

### Visual Characteristics

**Claymorphism**

Use dimensional surfaces, soft shadows, rounded corners, and subtle depth to create an engaging interface.

Clay effects should be applied selectively to cards, panels, controls, statistics, and supporting interface elements.

**Color Palette**

Explore a soft and cohesive palette using:

- Soft blue as a primary accent.
- Lavender and purple as secondary accents.
- Mint green for positive and online states.
- Warm off-white or soft lavender for backgrounds.
- Carefully selected darker tones for video and map interfaces.

The final palette should maintain sufficient contrast and readability.

**Typography**

Use a modern sans-serif typeface with excellent readability and a friendly appearance.

Plus Jakarta Sans is a suggested direction.

**Icons**

Use a consistent modern icon system. Lucide-style icons are preferred.

**Animations**

Use subtle transitions and micro-interactions to improve the experience.

Possible applications:

- Card hover effects.
- Smooth navigation transitions.
- Animated status indicators.
- Interactive map markers.
- Loading animations.
- Weather-related visual effects.

Avoid unnecessary animations that reduce performance.

### Important Design Principle

The actual CCTV video player and map must prioritize clarity and functionality over decorative styling.

Claymorphism should enhance the surrounding interface without interfering with video visibility, map interactions, or information hierarchy.

The overall experience should remain lightweight, responsive, and accessible.

## 6. Main Application Experience

PWT360 should provide a cohesive navigation experience.

Suggested application structure:

### Home / Overview

A welcoming dashboard introducing PWT360.

It may include:

- Product introduction.
- Summary of available cameras.
- Number of online cameras.
- Recently added cameras.
- Popular camera locations.
- Current weather information.
- Quick access to the CCTV explorer.

### Explore

The main CCTV discovery experience.

It should combine:

- Interactive map.
- Camera directory.
- Search and filtering.
- Camera previews.
- Location information.

### Live Monitoring

A dedicated viewing experience for users who want to monitor multiple cameras.

### Camera Details

A dedicated camera view containing:

- Video player.
- Camera information.
- Location.
- Provider attribution.
- Availability status.
- Related nearby cameras.

### About PWT360

Information about the platform, its purpose, data sources, limitations, and contact or contribution channels.

### Administration

A protected interface for camera management, discovery verification, and operational monitoring.

## 7. User Experience Requirements

PWT360 should prioritize usability over feature density.

Key principles:

1. Users should be able to discover available cameras quickly.
2. The map and camera directory should work together naturally.
3. Camera availability should be communicated clearly.
4. Video playback should require minimal interaction.
5. Search should be fast and intuitive.
6. The interface must work on desktop, tablet, and mobile.
7. Loading, offline, and error states should be thoughtfully designed.
8. Users should never be confused about whether a stream is actually live.
9. Navigation should remain consistent across application sections.

The platform should not require users to understand CCTV streaming technologies to use it.

## 8. Data and Source Management

The platform should maintain structured information about each camera and its source.

Each camera should be associated with its original provider or source.

Source management should consider:

- Source ownership.
- Public accessibility.
- Attribution requirements.
- Usage restrictions.
- Stream format.
- Geographical location.
- Verification status.
- Last availability check.

Camera information should be normalized to avoid duplicate registrations.

The platform should also provide a mechanism to report broken or outdated camera links.

## 9. Preferred Technology Stack

The following technologies represent the preferred technology direction for PWT360.

They are recommendations rather than strict implementation constraints. Development agents may adjust or introduce alternatives when there is a clear technical justification.

### Frontend

- Next.js — Primary application framework.
- React — User interface development.
- TypeScript — Application development language.
- Tailwind CSS — Styling and design system.
- shadcn/ui — Reusable UI components.
- Lucide React — Iconography.
- Plus Jakarta Sans — Primary typography.
- Motion — Interface animations and transitions.

### Mapping and Geospatial

- Leaflet — Interactive geographical maps.
- React Leaflet — React integration for Leaflet.
- OpenStreetMap — Geographical map data.
- PostGIS — Geospatial database capabilities.

MapLibre GL JS may be considered if more advanced map rendering or styling becomes necessary.

### Video Playback

- Video.js — Video player interface.
- HLS.js — HLS streaming support.

The implementation should accommodate different publicly available streaming formats and playback methods.

### Backend and Database

- Supabase — Backend platform and database infrastructure.
- PostgreSQL — Primary relational database.
- PostGIS — Geographical data management.
- Supabase Auth — Administrative authentication where appropriate.

### Background Processing and Automation

- Python — CCTV discovery, source processing, and health monitoring.
- Background workers — Long-running discovery and monitoring tasks.
- Scheduled jobs — Periodic source discovery and camera availability checks.

### Infrastructure and Deployment

- Vercel — Frontend and application deployment.
- Cloudflare — DNS, CDN, and application security.
- Railway or Render — Potential hosting for background workers.
- Sentry — Error monitoring.
- PostHog — Product analytics.

The final infrastructure should remain cost-conscious while supporting future production growth.

### Optional Visual and Enhancement Libraries

- Three.js — Optional 3D visualizations and atmospheric weather effects.
- Recharts — Data visualization and monitoring statistics.

These libraries should only be introduced when they provide meaningful value to the user experience.

### Technology Selection Guidelines

- Prefer technologies that integrate naturally with the proposed stack.
- Avoid unnecessary dependencies.
- Prioritize maintainability and performance.
- Consider infrastructure and operational costs.
- Keep the architecture modular.
- Avoid tightly coupling the application to a single CCTV provider.
- Record significant technology changes and their rationale in `progress.md`.

Technology versions, package configurations, implementation details, and deployment specifications should be determined by the development agent based on current compatibility and project requirements.
## 10. Security, Privacy, and Responsible Usage

PWT360 is intended exclusively for publicly accessible and legitimately published CCTV sources in public domains.

The platform enforces strict safeguards, particularly for OSINT-discovered sources:

- **Public-Space Only Policy:** Feeds must strictly monitor public spaces (streets, highways, public plazas, transit hubs, outdoor tourist destinations). Any feed showing private properties, residential interiors, or non-public commercial facilities is strictly forbidden.
- **No Authentication Bypass:** Never brute-force credentials, exploit vulnerabilities, or bypass access controls. Streams must be accessible without credential exploitation.
- **Staging Review Gate:** All OSINT and open web feeds must be visually vetted via the administrative staging review queue before public display.
- **Geofence Enforcement:** Coordinates must be strictly verified within the Purwokerto / Banyumas geographic bounding box.
- **No Video Recording or Archiving:** PWT360 operates as a live discovery and viewing proxy/directory; feeds are not stored, recorded, or intercepted.
- **Prompt Removal & User Reporting:** A visible report action allows citizens and property owners to flag cameras for immediate takedown.
- **SSRF & Input Sanitization:** Discovery workers run in isolated network sandboxes with strict SSRF filtering preventing internal network discovery.

## 11. Performance and Reliability

The application should provide a smooth experience even when users access multiple cameras.

Important considerations:

- Lazy loading of camera previews.
- Efficient marker rendering.
- Map clustering.
- Appropriate caching.
- Optimized frontend assets.
- Graceful video playback failures.
- Responsive layouts.
- Efficient background jobs.
- Controlled health-check frequency.

The application should not unnecessarily load every camera stream simultaneously when users are simply browsing the map.

## 12. Future Expansion

Although the initial focus is Purwokerto, the product should be designed with future expansion in mind.

Potential future directions:

- Additional cities in Banyumas Regency.
- Other cities in Central Java.
- Public CCTV directories across Indonesia.
- Community-submitted camera sources.
- Additional public information integrations.
- Advanced geographical filtering.
- Traffic and weather contextual information.
- Public API for verified camera metadata.

These are future opportunities, not requirements for the initial release.

## 13. Initial Release Priorities

### Essential

- Responsive application interface.
- CCTV directory.
- Verified public CCTV sources.
- Interactive geographical map.
- Camera search and filtering.
- CCTV video playback.
- Camera detail information.
- Online/offline status.
- Source attribution.
- Administrative camera management.

### Important

- Automated discovery.
- Automated stream health monitoring.
- Camera clustering.
- Multi-camera viewing.
- Weather information.
- Error reporting.

### Future Enhancements

- Favorites and personalization.
- Community submissions.
- Multiple-city support.
- Advanced weather visualization.
- Additional city information integrations.

## 14. Definition of Success

The initial release should be considered successful when:

- Users can discover publicly accessible CCTV around Purwokerto from one platform.
- Verified cameras are displayed accurately on an interactive map.
- Supported streams can be played directly from the application.
- Camera availability is monitored and communicated clearly.
- Users can search and filter cameras efficiently.
- Administrators can manage and verify camera sources.
- The interface provides a substantially better experience than conventional CCTV directories.
- The architecture supports future geographical expansion.

## 15. Final Product Direction

PWT360 should not be treated as merely a website that embeds CCTV streams.

It should be developed as a modern public CCTV discovery and city exploration platform.

The combination of centralized CCTV discovery, interactive geographical exploration, accessible video playback, contextual city information, and a distinctive claymorphism-inspired interface should define the product experience.

**PWT360 — Explore Your City, From Every Angle.**