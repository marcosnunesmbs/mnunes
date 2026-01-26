# Data Model: Asset Dependency Graph & Loading Strategy

**Feature**: Website Performance Optimization  
**Date**: January 26, 2026  
**Status**: Complete

## Overview

This document defines the logical structure of web assets, their dependencies, loading priorities, and state transitions during page load optimization. While this is not a traditional database-backed application, the "data model" here represents the **resource dependency graph** and **loading strategy state machine** that govern how assets are fetched, processed, and rendered.

---

## Entity 1: Asset Resource

Represents any loadable resource required by the webpage (HTML, CSS, JavaScript, images, fonts, external scripts).

### Attributes

| Attribute | Type | Description | Validation Rules |
|-----------|------|-------------|------------------|
| `resourceId` | String | Unique identifier (file path or URL) | Required, unique |
| `resourceType` | Enum | Type of resource | One of: `html`, `css`, `javascript`, `image`, `font`, `svg`, `external-script` |
| `loadPriority` | Enum | Browser loading priority | One of: `critical`, `high`, `medium`, `low` |
| `renderBlocking` | Boolean | Whether resource blocks page rendering | `true` for sync scripts/CSS, `false` for deferred |
| `sizeBytes` | Integer | File size in bytes | Positive integer, 0 if external/unknown |
| `cacheDuration` | Duration | HTTP cache TTL | Format: `1y`, `1h`, `no-cache` |
| `dependencies` | Array<String> | List of resourceIds this depends on | Empty array if no dependencies |
| `loadStrategy` | Enum | How resource should load | One of: `eager`, `lazy`, `defer`, `async`, `preload`, `prefetch`, `preconnect`, `dns-prefetch` |
| `currentState` | Enum | Loading state (runtime) | One of: `pending`, `loading`, `loaded`, `error`, `cached` |

### State Transitions

```
pending → loading → loaded
   ↓          ↓        ↓
  error    error    cached (on subsequent page loads)
```

**Transition Rules**:
- `pending`: Resource identified but not yet requested
- `loading`: Network request initiated
- `loaded`: Resource successfully downloaded and parsed
- `error`: Failed to load (404, network error, parse error)
- `cached`: Resource served from browser cache (bypasses `loading`)

### Examples

**Critical CSS** (compiled Tailwind):
```json
{
  "resourceId": "/assets/css/output.css",
  "resourceType": "css",
  "loadPriority": "critical",
  "renderBlocking": true,
  "sizeBytes": 12000,
  "cacheDuration": "1y",
  "dependencies": [],
  "loadStrategy": "eager",
  "currentState": "pending"
}
```

**JavaScript Bundle**:
```json
{
  "resourceId": "/assets/js/bundle.min.js",
  "resourceType": "javascript",
  "loadPriority": "high",
  "renderBlocking": false,
  "sizeBytes": 25000,
  "cacheDuration": "1y",
  "dependencies": [],
  "loadStrategy": "defer",
  "currentState": "pending"
}
```

**Profile Image** (above fold):
```json
{
  "resourceId": "https://avatars.githubusercontent.com/u/29044312?v=4&s=192",
  "resourceType": "image",
  "loadPriority": "high",
  "renderBlocking": false,
  "sizeBytes": 8000,
  "cacheDuration": "1h",
  "dependencies": [],
  "loadStrategy": "eager",
  "currentState": "pending"
}
```

**Certification Badge** (below fold):
```json
{
  "resourceId": "/assets/img/badges/aws-cert.png",
  "resourceType": "image",
  "loadPriority": "low",
  "renderBlocking": false,
  "sizeBytes": 15000,
  "cacheDuration": "1y",
  "dependencies": [],
  "loadStrategy": "lazy",
  "currentState": "pending"
}
```

---

## Entity 2: External Connection

Represents connections to external domains required for resources (CDNs, APIs, analytics).

### Attributes

| Attribute | Type | Description | Validation Rules |
|-----------|------|-------------|------------------|
| `domain` | String | External domain name | Valid FQDN (e.g., `avatars.githubusercontent.com`) |
| `connectionType` | Enum | Type of connection optimization | One of: `preconnect`, `dns-prefetch`, `none` |
| `purpose` | String | Why this domain is needed | Descriptive text |
| `isCritical` | Boolean | Whether required for initial render | `true` = use `preconnect`, `false` = use `dns-prefetch` |
| `protocol` | String | Connection protocol | `https` or `http` |
| `crossorigin` | Boolean | Requires CORS | `true` for fonts/images from external domains |

### Relationships

- **One External Connection** → **Many Asset Resources** (e.g., `avatars.githubusercontent.com` serves profile image and potentially other images)

### Examples

**GitHub Avatars** (critical):
```json
{
  "domain": "avatars.githubusercontent.com",
  "connectionType": "preconnect",
  "purpose": "Profile image above fold",
  "isCritical": true,
  "protocol": "https",
  "crossorigin": true
}
```

**Analytics** (non-critical):
```json
{
  "domain": "stats.mnunes.xyz",
  "connectionType": "dns-prefetch",
  "purpose": "Self-hosted analytics tracking",
  "isCritical": false,
  "protocol": "https",
  "crossorigin": false
}
```

---

## Entity 3: Loading Phase

Represents distinct phases of page load optimization strategy.

### Attributes

| Attribute | Type | Description | Validation Rules |
|-----------|------|-------------|------------------|
| `phaseName` | String | Identifier for load phase | One of: `critical-render`, `interactive`, `lazy-load`, `background` |
| `priority` | Integer | Execution order | 1-4, lower executes first |
| `triggerCondition` | String | When this phase activates | E.g., `"DOMContentLoaded"`, `"window.load"`, `"IntersectionObserver"` |
| `resourcesInPhase` | Array<String> | List of resourceIds to load | Must reference valid Asset Resources |
| `performanceGoal` | Object | Target metrics for phase | Keys: `maxDuration`, `maxBytes` |

### Phases Defined

**Phase 1: Critical Render Path** (Priority: 1)
```json
{
  "phaseName": "critical-render",
  "priority": 1,
  "triggerCondition": "HTML parse start",
  "resourcesInPhase": [
    "/index.html",
    "/assets/css/output.css",
    "https://avatars.githubusercontent.com/u/29044312?v=4&s=192"
  ],
  "performanceGoal": {
    "maxDuration": "800ms",
    "maxBytes": 25000,
    "targetMetric": "FCP < 0.8s"
  }
}
```

**Phase 2: Interactive** (Priority: 2)
```json
{
  "phaseName": "interactive",
  "priority": 2,
  "triggerCondition": "DOMContentLoaded",
  "resourcesInPhase": [
    "/assets/js/bundle.min.js"
  ],
  "performanceGoal": {
    "maxDuration": "1500ms",
    "maxBytes": 50000,
    "targetMetric": "TTI < 2s"
  }
}
```

**Phase 3: Lazy Load** (Priority: 3)
```json
{
  "phaseName": "lazy-load",
  "priority": 3,
  "triggerCondition": "IntersectionObserver (viewport)",
  "resourcesInPhase": [
    "/assets/img/badges/*",
    "/assets/img/logos/*"
  ],
  "performanceGoal": {
    "maxDuration": "N/A",
    "maxBytes": 150000,
    "targetMetric": "No impact on initial metrics"
  }
}
```

**Phase 4: Background** (Priority: 4)
```json
{
  "phaseName": "background",
  "priority": 4,
  "triggerCondition": "window.load + 2s idle",
  "resourcesInPhase": [
    "https://stats.mnunes.xyz/script.js"
  ],
  "performanceGoal": {
    "maxDuration": "N/A",
    "maxBytes": 5000,
    "targetMetric": "Zero impact on user experience"
  }
}
```

---

## Entity 4: Performance Budget

Represents constraints on asset sizes and load times to enforce performance targets.

### Attributes

| Attribute | Type | Description | Validation Rules |
|-----------|------|-------------|------------------|
| `metricName` | String | Name of performance metric | E.g., `"FCP"`, `"LCP"`, `"TBT"`, `"CLS"`, `"Total JS Size"` |
| `currentValue` | Number | Measured baseline value | From Chrome DevTools trace |
| `targetValue` | Number | Goal after optimization | From spec.md success criteria |
| `unit` | String | Measurement unit | E.g., `"ms"`, `"KB"`, `"score"` |
| `status` | Enum | Budget compliance | One of: `"exceeds"`, `"meets"`, `"fails"` |

### Validation Rules

- **FCP Budget**: MUST be ≤ 800ms (from FR-001)
- **LCP Budget**: MUST be ≤ 1500ms (from FR-002)
- **TBT Budget**: MUST be ≤ 100ms (from FR-014)
- **CLS Budget**: MUST be ≤ 0.05 (from FR-015)
- **Total JavaScript Budget**: MUST be ≤ 60KB (from research.md)
- **Total CSS Budget**: MUST be ≤ 15KB (from research.md)
- **HTTP Requests Budget**: MUST be ≤ 10 requests for initial load

### Examples

**FCP Budget**:
```json
{
  "metricName": "First Contentful Paint",
  "currentValue": 1500,
  "targetValue": 800,
  "unit": "ms",
  "status": "exceeds"
}
```

**JavaScript Size Budget**:
```json
{
  "metricName": "Total JavaScript Size",
  "currentValue": 197,
  "targetValue": 52,
  "unit": "KB",
  "status": "exceeds"
}
```

---

## Dependency Graph

```
index.html (Critical Path)
├── output.css (Critical, blocking)
├── bundle.min.js (High, deferred)
│   └── (bundles: main.js, projects.js, skills.js, certifications.js)
├── profile-image.jpg (High, eager, fetchpriority="high")
├── inline-svg-icons (Critical, embedded in HTML)
│   ├── fa-terminal.svg
│   ├── fa-github.svg
│   ├── fa-linkedin.svg
│   ├── fa-certificate.svg
│   ├── fa-envelope.svg
│   ├── fa-blog.svg
│   └── fa-bookmark.svg
└── lazy-images (Low, lazy)
    ├── badges/*.png
    └── logos/*.png

External Connections (Resource Hints)
├── preconnect: avatars.githubusercontent.com (for profile image)
└── dns-prefetch: stats.mnunes.xyz (for analytics)
```

**Loading Order** (waterfall):
1. **0ms**: HTML request starts
2. **~100ms**: HTML received, CSS request starts
3. **~200ms**: CSS loaded, first paint possible (FCP)
4. **~300ms**: Profile image request starts (preconnect saves ~200ms)
5. **~500ms**: Profile image loaded (LCP)
6. **~600ms**: DOMContentLoaded fires, bundle.min.js executes (deferred)
7. **~800ms**: Interactive (TTI)
8. **~1000ms+**: Lazy images load as viewport scrolls
9. **~3000ms**: Analytics script loads in background

---

## Asset Inventory: Before vs After

| Asset Type | Before | After | Change |
|------------|--------|-------|--------|
| **HTML** | index.html (4KB) | index.html optimized (4.5KB) | +0.5KB (added dimensions, hints) |
| **CSS** | Tailwind CDN (52KB JS) | output.css (12KB) | -40KB |
| **Custom CSS** | style.css (2KB) | style.css (2KB) | No change |
| **JavaScript (Core)** | 4 files (20KB) | bundle.min.js (18KB) | -2KB (minified) |
| **Font Awesome** | Kit CDN (70KB) | Inline SVG (2.5KB) | -67.5KB |
| **Analytics** | GA+GTM+stats (75KB) | stats.mnunes.xyz (2KB) | -73KB |
| **Images** | ~150KB (no dimensions) | ~150KB (with dimensions) | No size change, CLS fix |
| **Total Initial Load** | ~373KB, 12 requests | ~191KB, 6 requests | **-182KB (-49%), -6 requests (-50%)** |

---

## Relationships Summary

```
Asset Resource
  ├── belongs to → Loading Phase (many-to-one)
  ├── depends on → Asset Resource (many-to-many, directed graph)
  └── served from → External Connection (optional, many-to-one)

External Connection
  └── serves → Asset Resource (one-to-many)

Loading Phase
  ├── contains → Asset Resource (one-to-many)
  └── enforces → Performance Budget (one-to-one)

Performance Budget
  └── monitors → Asset Resource set (one-to-many)
```

---

## Validation Rules Across Entities

1. **No Circular Dependencies**: Asset dependency graph must be acyclic (DAG)
2. **Critical Path Minimal**: Resources in `critical-render` phase ≤ 3 items
3. **Render-Blocking Budget**: Max 1 render-blocking CSS, 0 render-blocking JS
4. **Resource Size Limits**: 
   - Single CSS file ≤ 20KB
   - Single JS file ≤ 40KB
   - Single image ≤ 100KB
5. **External Connections**: Max 2 preconnects, max 3 dns-prefetch hints
6. **Loading Strategy Compliance**:
   - Above-fold images: `eager` or `fetchpriority="high"`
   - Below-fold images: `lazy`
   - Non-critical JS: `defer` or `async`

---

## Next Steps

This data model will guide:
1. **Contract generation** (performance contracts in `contracts/`)
2. **Implementation** (asset bundling, HTML optimization)
3. **Testing** (validate against Performance Budget entities)
4. **Monitoring** (track Asset Resource state transitions in production)
