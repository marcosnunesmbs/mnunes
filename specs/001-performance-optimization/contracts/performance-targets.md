# Performance Target Contract

**Feature**: Website Performance Optimization  
**Date**: January 26, 2026  
**Purpose**: Define measurable acceptance criteria and target metrics post-optimization

## Contract Overview

This document serves as a **binding performance contract** between the implementation and the specification. All targets defined here map directly to Functional Requirements (FR-001 through FR-018) and Success Criteria (SC-001 through SC-010) from [spec.md](../spec.md).

---

## Core Web Vitals Targets

### Target Metrics (MUST Achieve)

| Metric | Desktop Target | Mobile Target | Baseline | Improvement | Requirement |
|--------|---------------|---------------|----------|-------------|-------------|
| **FCP** | ≤ 0.8s | ≤ 1.0s | 1.5s / 1.8s | 60% / 56% | FR-001, SC-001 |
| **LCP** | ≤ 1.5s | ≤ 2.0s | 2.5s / 2.9s | 50% / 45% | SC-002 |
| **TBT** | ≤ 100ms | ≤ 150ms | 340ms / 410ms | 75% / 75% | FR-014, SC-003 |
| **CLS** | ≤ 0.05 | ≤ 0.05 | 0.12 / 0.18 | 80% / 83% | FR-015, SC-004 |
| **TTI** | ≤ 2.0s | ≤ 3.0s | 2.8s / 3.4s | 40% / 15% | SC-008, SC-009 |

### PageSpeed Insights Score Targets

| Category | Desktop Target | Mobile Target | Baseline | Requirement |
|----------|---------------|---------------|----------|-------------|
| **Performance** | ≥ 90 | ≥ 90 | 62 / 48 | SC-007 |
| **Accessibility** | ≥ 90 | ≥ 90 | 88 / 88 | Best practice |
| **Best Practices** | ≥ 90 | ≥ 90 | 79 / 79 | Best practice |
| **SEO** | ≥ 95 | ≥ 95 | 92 / 92 | Best practice |

---

## Resource Budget Targets (MUST Not Exceed)

### JavaScript Budget

| Item | Current | Target | Max Allowed | Requirement |
|------|---------|--------|-------------|-------------|
| **Total JS (Initial)** | 197KB | ≤ 52KB | 60KB | SC-005 |
| **Render-Blocking JS** | 52KB (Tailwind) | 0KB | 0KB | FR-002, FR-006 |
| **Font Awesome** | 70KB (Kit CDN) | ≤ 3KB | 5KB | FR-007 |
| **Local JS Bundle** | 20KB (4 files) | ≤ 18KB | 25KB | FR-009 |
| **Analytics** | 75KB (3 scripts) | ≤ 2KB | 5KB | FR-008 |
| **JavaScript Requests** | 8 requests | ≤ 2 requests | 3 requests | SC-006 |

### CSS Budget

| Item | Current | Target | Max Allowed | Requirement |
|------|---------|--------|-------------|-------------|
| **Total CSS** | ~52KB (CDN) | ≤ 15KB | 20KB | FR-006 |
| **Render-Blocking CSS** | 1 file (2KB) | 1 file (12KB) | 1 file (20KB) | Acceptable |
| **CSS Requests** | 1 request | 1 request | 1 request | Maintained |

### HTTP Request Budget

| Category | Current | Target | Max Allowed | Requirement |
|----------|---------|--------|-------------|-------------|
| **Initial Page Load** | 12 requests | ≤ 6 requests | 8 requests | SC-006 |
| **External Domains** | 5 domains | ≤ 2 domains | 3 domains | FR-004, FR-011 |

---

## Optimization Deliverables (Functional Requirements)

### FR-001: Fast Content Display
**Target**: Text content visible within 0.8s on desktop 4G  
**Validation**: Lighthouse FCP metric ≤ 800ms  
**Implementation**: Defer non-critical JS, optimize critical rendering path  
**Status**: 🔴 REQUIRED

### FR-002: Defer Non-Critical JavaScript
**Target**: Zero render-blocking JavaScript  
**Validation**: Chrome DevTools shows no script tags blocking HTML parse  
**Implementation**: Add `defer` attribute to all `<script>` tags  
**Status**: 🔴 REQUIRED

### FR-003: Image Dimensions
**Target**: All `<img>` tags have explicit `width` and `height` attributes  
**Validation**: Manual HTML inspection, CLS ≤ 0.05  
**Implementation**: Add dimensions to ~10 images in index.html  
**Status**: 🔴 REQUIRED

### FR-004: DNS Prefetch
**Target**: `<link rel="dns-prefetch">` for all external domains  
**Validation**: HTML `<head>` contains prefetch hints  
**Implementation**: Add prefetch for avatars.githubusercontent.com, stats.mnunes.xyz  
**Status**: 🔴 REQUIRED

### FR-005: Lazy Loading
**Target**: Images below fold load lazily  
**Validation**: Network tab shows deferred image requests  
**Implementation**: Add `loading="lazy"` to certification badges, project logos  
**Status**: 🔴 REQUIRED

### FR-006: Pre-compiled Tailwind CSS
**Target**: Replace Tailwind CDN with static CSS file  
**Validation**: No `cdn.tailwindcss.com` request in Network tab  
**Implementation**: Use Tailwind CLI to generate output.css  
**Status**: 🔴 REQUIRED

### FR-007: Optimized Font Awesome
**Target**: Include only 6-8 icons used, ≤ 3KB total  
**Validation**: No `kit.fontawesome.com` request, inline SVG in HTML  
**Implementation**: Replace `<i class="fa-*">` with inline `<svg>`  
**Status**: 🔴 REQUIRED

### FR-008: Consolidated Analytics
**Target**: Single analytics solution (stats.mnunes.xyz)  
**Validation**: No Google Analytics or GTM requests in Network tab  
**Implementation**: Remove GA/GTM scripts, keep stats.mnunes.xyz only  
**Status**: 🔴 REQUIRED

### FR-009: Bundled JavaScript
**Target**: Combine 4 local JS files into 1 minified bundle  
**Validation**: Single `bundle.min.js` request instead of 4 separate files  
**Implementation**: Use esbuild to bundle main.js, projects.js, skills.js, certifications.js  
**Status**: 🔴 REQUIRED

### FR-010: Optimized External Images
**Target**: GitHub avatar uses `?s=192` size parameter  
**Validation**: URL includes size hint, smaller image downloaded  
**Implementation**: Update `src` attribute with query param  
**Status**: 🔴 REQUIRED

### FR-011: Preconnect Hints
**Target**: `<link rel="preconnect">` for critical resources  
**Validation**: HTML `<head>` contains preconnect for avatars.githubusercontent.com  
**Implementation**: Add preconnect hint before image loads  
**Status**: 🔴 REQUIRED

### FR-012: Cache Headers
**Target**: 1 year cache for static assets, 1 hour for HTML  
**Validation**: `curl -I` shows correct `Cache-Control` headers  
**Implementation**: Configure nginx/Apache (documented in quickstart.md)  
**Status**: 🔴 REQUIRED

### FR-013: Compression
**Target**: gzip/brotli enabled for text resources  
**Validation**: Response headers include `Content-Encoding: gzip` or `br`  
**Implementation**: Enable compression in server config  
**Status**: 🔴 REQUIRED

### FR-014: Total Blocking Time
**Target**: TBT ≤ 100ms on mid-range mobile  
**Validation**: Lighthouse TBT metric on Moto G Power simulation  
**Implementation**: Defer JS, reduce bundle size, avoid long tasks  
**Status**: 🔴 REQUIRED

### FR-015: Cumulative Layout Shift
**Target**: CLS ≤ 0.05  
**Validation**: Lighthouse CLS metric  
**Implementation**: Add image dimensions, avoid dynamic content insertion above fold  
**Status**: 🔴 REQUIRED

### FR-016: Service Worker (SHOULD)
**Target**: Basic offline caching for critical assets  
**Validation**: Service worker registered in DevTools, cache populated  
**Implementation**: Create service-worker.js with Cache API  
**Status**: 🟡 OPTIONAL (Phase 2 enhancement)

### FR-017: Fetch Priority (SHOULD)
**Target**: `fetchpriority="high"` on above-fold images  
**Validation**: Profile image has fetchpriority attribute  
**Implementation**: Add attribute to profile photo `<img>` tag  
**Status**: 🟡 OPTIONAL (nice-to-have)

### FR-018: Resource Hints (SHOULD)
**Target**: Comprehensive preconnect, dns-prefetch, preload hints  
**Validation**: HTML `<head>` contains all recommended hints  
**Implementation**: Add hints for CSS, external images, analytics  
**Status**: 🔴 REQUIRED (overlaps with FR-004, FR-011)

---

## Testing Acceptance Criteria

### Test Scenario 1: Desktop 4G (from User Story 1)
**Given**: Visitor on desktop with 4G connection  
**When**: Navigate to mnunes.xyz  
**Then**: First meaningful content renders within 0.8s

**Validation**:
- ✅ Run Lighthouse desktop simulation
- ✅ FCP metric ≤ 800ms
- ✅ Manual visual inspection confirms text visible

**Pass Criteria**: FCP ≤ 800ms in 3 consecutive runs (median)

---

### Test Scenario 2: Mobile 3G (from User Story 1)
**Given**: Visitor on mobile with 3G connection  
**When**: Load homepage  
**Then**: Readable text appears within 1.2s

**Validation**:
- ✅ Run Lighthouse mobile simulation with 3G throttling
- ✅ FCP metric ≤ 1200ms
- ✅ Visual check: text readable without scrolling

**Pass Criteria**: FCP ≤ 1.2s in 3 consecutive runs

---

### Test Scenario 3: Returning Visitor Cache (from User Story 1)
**Given**: Returning visitor with cached assets  
**When**: Reload page  
**Then**: Content appears within 0.3s

**Validation**:
- ✅ First visit (populate cache)
- ✅ Reload page, measure FCP with DevTools
- ✅ Network tab shows `(disk cache)` or `304 Not Modified`

**Pass Criteria**: FCP ≤ 300ms with cache, verified cache hits

---

### Test Scenario 4: Responsive Interaction (from User Story 2)
**Given**: Visitor scrolling through page  
**When**: Reach project cards  
**Then**: Content appears smoothly without stuttering

**Validation**:
- ✅ Lighthouse TBT ≤ 100ms
- ✅ Chrome DevTools Performance: No long tasks >50ms
- ✅ Manual scroll test: No visual jank

**Pass Criteria**: TBT ≤ 100ms, no dropped frames

---

### Test Scenario 5: Stable Layout (from User Story 3)
**Given**: Visitor loading page on slow connection  
**When**: Images load progressively  
**Then**: Text remains in original positions, CLS < 0.05

**Validation**:
- ✅ Lighthouse CLS metric
- ✅ Visual inspection with network throttling
- ✅ No content jumps during load

**Pass Criteria**: CLS ≤ 0.05 in Lighthouse

---

### Test Scenario 6: Optimized Resources (from User Story 4)
**Given**: Page loading  
**When**: Browser parses HTML  
**Then**: JavaScript does not block parsing

**Validation**:
- ✅ Chrome DevTools Network: All JS has `defer` or `async`
- ✅ Performance Panel: No `Parse HTML` blocked by scripts
- ✅ Waterfall shows parallel resource loading

**Pass Criteria**: Zero render-blocking JS

---

### Test Scenario 7: Minimal JavaScript (from User Story 5)
**Given**: Current site using Tailwind CDN  
**When**: Migrated to pre-compiled CSS  
**Then**: JavaScript payload reduces by ≥ 50KB

**Validation**:
- ✅ Network tab: Total JS transfer size
- ✅ Before: ~197KB, After: ≤ 52KB
- ✅ Functionality unchanged (manual testing)

**Pass Criteria**: JS reduction ≥ 100KB (SC-005)

---

### Test Scenario 8: Efficient Caching (from User Story 6)
**Given**: Returning visitor (previous visit within 24h)  
**When**: Return to site  
**Then**: CSS and JS load from browser cache

**Validation**:
- ✅ Network tab shows `(disk cache)` for bundle.min.js, output.css
- ✅ `curl -I` shows `Cache-Control: public, max-age=31536000` for assets
- ✅ No network requests for cached resources

**Pass Criteria**: Cache headers configured, assets load from cache

---

## Edge Case Testing

### Edge Case 1: JavaScript Disabled
**Scenario**: Visitor has JavaScript disabled  
**Expected**: Core content (text, images) remains readable  
**Validation**: Disable JS in Chrome, verify content visible  
**Pass Criteria**: HTML structure intact, CSS applies, images load

### Edge Case 2: 2G Connection
**Scenario**: Very slow connection (2G)  
**Expected**: Content accessible, even if slowly  
**Validation**: Lighthouse with 2G throttling  
**Pass Criteria**: FCP < 3s, no timeouts

### Edge Case 3: CDN Failure
**Scenario**: External CDN (GitHub avatars) fails  
**Expected**: Page degrades gracefully, no broken layout  
**Validation**: Block avatars.githubusercontent.com in DevTools  
**Pass Criteria**: Alt text displays, layout stable

### Edge Case 4: Ad Blocker Active
**Scenario**: Analytics script blocked by ad blocker  
**Expected**: Core functionality unaffected  
**Validation**: Enable uBlock Origin, test site  
**Pass Criteria**: Page loads normally, no errors

---

## Monitoring & Validation

### Pre-Deployment Checklist

- [ ] All MUST requirements (FR-001 through FR-015) implemented
- [ ] Lighthouse desktop score ≥ 90
- [ ] Lighthouse mobile score ≥ 90
- [ ] All 8 acceptance scenarios pass
- [ ] All 4 edge cases validated
- [ ] Performance budgets not exceeded

### Post-Deployment Verification

1. **Run PageSpeed Insights**: https://pagespeed.web.dev/?url=https://mnunes.xyz
2. **Run WebPageTest**: 3 runs, document median
3. **Manual DevTools Audit**: Network, Performance, Lighthouse tabs
4. **Document Results**: Create `performance-results.md` with actual metrics
5. **Compare to Baseline**: Verify improvements meet targets

---

## Contract Enforcement

**Failure Conditions** (deployment BLOCKED if):
- ❌ Any MUST requirement (FR-001 to FR-015) not met
- ❌ Lighthouse Performance score < 85 (10% tolerance)
- ❌ FCP > 1.0s desktop or > 1.5s mobile (20% tolerance)
- ❌ TBT > 150ms (50% tolerance)
- ❌ CLS > 0.08 (60% tolerance over target)

**Success Conditions** (deployment APPROVED if):
- ✅ All MUST requirements implemented
- ✅ Lighthouse Performance score ≥ 90
- ✅ Core Web Vitals meet or exceed targets
- ✅ All acceptance scenarios pass
- ✅ Edge cases handled gracefully

---

## Sign-off

This contract will be validated against actual metrics documented in `performance-results.md` after implementation is complete.

**Baseline Reference**: [performance-baseline.md](performance-baseline.md)  
**Specification**: [spec.md](../spec.md)  
**Data Model**: [data-model.md](../data-model.md)
