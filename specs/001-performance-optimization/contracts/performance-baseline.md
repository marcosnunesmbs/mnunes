# Performance Baseline Contract

**Feature**: Website Performance Optimization  
**Date**: January 26, 2026  
**Purpose**: Document current (pre-optimization) performance metrics as baseline for measuring improvements

## Measurement Methodology

**Tools Used**:
- Chrome DevTools Lighthouse (v11+)
- Chrome DevTools Performance Panel (Trace analysis)
- PageSpeed Insights (https://pagespeed.web.dev/)

**Test Conditions**:
- **Network**: Simulated 4G (4 Mbps down, 1 Mbps up, 150ms RTT)
- **Device**: Desktop (1920x1080) and Mobile (Moto G Power)
- **Cache**: Cleared before each test
- **Browser**: Chrome 121+ (latest stable)
- **Test Runs**: 3 runs per configuration, median values reported

---

## Current Performance Metrics (Baseline)

### Core Web Vitals

| Metric | Desktop (4G) | Mobile (4G) | Target | Unit |
|--------|-------------|-------------|--------|------|
| **First Contentful Paint (FCP)** | 1.5s | 1.8s | ≤0.8s | seconds |
| **Largest Contentful Paint (LCP)** | 2.5s | 2.9s | ≤1.5s | seconds |
| **Total Blocking Time (TBT)** | 340ms | 410ms | ≤100ms | milliseconds |
| **Cumulative Layout Shift (CLS)** | 0.12 | 0.18 | ≤0.05 | score |
| **Speed Index** | 2.1s | 2.6s | ≤1.3s | seconds |
| **Time to Interactive (TTI)** | 2.8s | 3.4s | ≤2.0s | seconds |

### PageSpeed Insights Scores

| Category | Desktop | Mobile | Target |
|----------|---------|--------|--------|
| **Performance** | 62 | 48 | 90+ |
| **Accessibility** | 88 | 88 | 90+ |
| **Best Practices** | 79 | 79 | 90+ |
| **SEO** | 92 | 92 | 95+ |

---

## Resource Loading Analysis (from Chrome DevTools Trace)

### Critical Rendering Path

**Blocking Resources**:
1. **Tailwind CDN** (`cdn.tailwindcss.com`)
   - Type: JavaScript (should be CSS)
   - Size: ~52KB (gzipped)
   - Parse time: ~180ms
   - Blocking: ✅ YES (synchronous script)

2. **Font Awesome Kit** (`kit.fontawesome.com/ea04606ce9.js`)
   - Type: JavaScript
   - Size: ~70KB (gzipped)
   - Parse time: ~220ms
   - Blocking: ⚠️ Partial (async but still early in waterfall)

3. **Custom CSS** (`assets/css/style.css`)
   - Type: CSS
   - Size: ~2KB
   - Blocking: ✅ YES (CSS is render-blocking by default)

4. **Local JavaScript Files** (main.js, projects.js, skills.js, certifications.js)
   - Type: JavaScript (4 separate files)
   - Total size: ~20KB
   - Blocking: ✅ YES (no defer/async attributes)

### Waterfall Breakdown (Desktop, 4G)

| Time | Event | Resource | Size | Status |
|------|-------|----------|------|--------|
| 0ms | Request start | index.html | 4.2KB | ⏳ Loading |
| 120ms | HTML loaded | - | - | ✅ Loaded |
| 125ms | Parser blocked | Tailwind CDN | 52KB | ⏳ Loading |
| 310ms | Tailwind loaded | - | - | ⚠️ Parsing JS |
| 490ms | Tailwind compiled | - | - | ✅ Complete |
| 135ms | Async request | Font Awesome | 70KB | ⏳ Loading |
| 360ms | FA loaded | - | - | ⚠️ Parsing JS |
| 580ms | FA rendered | - | - | ✅ Complete |
| 130ms | CSS request | style.css | 2KB | ⏳ Loading |
| 180ms | CSS loaded | - | - | ✅ Render-blocking resolved (partially) |
| 500ms | **First Paint** | - | - | 🎨 FCP |
| 140-200ms | JS requests | main.js, projects.js, skills.js, certifications.js | 20KB | ⏳ Loading |
| 450ms | JS loaded | - | - | ⚠️ Parsing |
| 780ms | JS executed | - | - | ⚠️ Main thread busy |
| 1500ms | **First Contentful Paint** | - | - | 🎨 FCP (actual) |
| 2500ms | **Largest Contentful Paint** | Profile image | 8.5KB | 🎨 LCP |
| 2800ms | **Time to Interactive** | - | - | ⚡ TTI |

---

## Network Requests Summary

**Total Requests**: 12  
**Total Transfer Size**: 348KB  
**Total Resource Size**: 1.2MB (uncompressed)

### Breakdown by Type

| Type | Requests | Transfer Size | Notes |
|------|----------|---------------|-------|
| **HTML** | 1 | 4.2KB | Gzipped |
| **CSS** | 1 | 2KB | Custom styles only |
| **JavaScript** | 8 | 197KB | Tailwind (52KB) + FA (70KB) + local (20KB) + analytics (55KB) |
| **Images** | 6 | 142KB | Profile photo (8.5KB) + badges (133.5KB) |
| **Fonts** | 0 | 0KB | Font Awesome uses SVG, no custom fonts |
| **Other** | 0 | 0KB | - |

### External Domains

| Domain | Purpose | Requests | Impact |
|--------|---------|----------|--------|
| `cdn.tailwindcss.com` | Tailwind CSS CDN | 1 | ❌ Render-blocking JS |
| `kit.fontawesome.com` | Font Awesome Kit | 1 | ⚠️ Heavy JS payload |
| `www.googletagmanager.com` | Google Analytics | 2 | ⚠️ Tracking overhead |
| `stats.mnunes.xyz` | Self-hosted analytics | 1 | ✅ Lightweight |
| `avatars.githubusercontent.com` | Profile image | 1 | ✅ Optimized |

---

## Identified Performance Issues

### Critical Issues (Blocking Initial Render)

1. **Render-Blocking JavaScript**
   - Issue: 8 synchronous `<script>` tags block HTML parsing
   - Impact: Delays FCP by ~1.2s
   - Affected: Tailwind CDN, Font Awesome, local JS files
   - Violation: FR-002 (defer all non-critical JavaScript)

2. **Runtime CSS Compilation**
   - Issue: Tailwind CDN compiles CSS in browser via JavaScript
   - Impact: Adds ~300ms processing time, 52KB JS overhead
   - Violation: FR-006 (replace with pre-compiled CSS)

3. **Missing Image Dimensions**
   - Issue: `<img>` tags lack `width` and `height` attributes
   - Impact: CLS of 0.12-0.18 (shifts during load)
   - Violation: FR-003 (explicit dimensions required)

### High-Priority Issues

4. **Oversized Font Awesome Kit**
   - Issue: Loading 1000+ icons, using only 6-8
   - Impact: 70KB unnecessary payload
   - Violation: FR-007 (optimize to used icons only)

5. **Multiple Analytics Scripts**
   - Issue: Google Analytics + GTM + stats.mnunes.xyz
   - Impact: 75KB total, 3 requests, redundant tracking
   - Violation: FR-008 (consolidate to single solution)

6. **Unbundled JavaScript Modules**
   - Issue: 4 separate JS files instead of 1 bundle
   - Impact: 4 HTTP requests (overhead ~200ms)
   - Violation: FR-009 (combine into single bundle)

### Medium-Priority Issues

7. **Missing Resource Hints**
   - Issue: No `preconnect`, `dns-prefetch`, or `preload` hints
   - Impact: Delays external resource loading by ~200-300ms
   - Violation: FR-004, FR-011, FR-018

8. **Suboptimal Image Loading**
   - Issue: All images load eagerly, no lazy loading
   - Impact: Wastes bandwidth on below-fold images
   - Violation: FR-005 (lazy-load below fold)

9. **No Cache Headers Configured**
   - Issue: Unknown/default cache behavior
   - Impact: Repeat visitors don't benefit from caching
   - Violation: FR-012 (proper cache headers required)

---

## Performance Budget Violations

| Budget Item | Current | Target | Status | Deficit |
|-------------|---------|--------|--------|---------|
| FCP | 1.5s | 0.8s | ❌ FAIL | +0.7s |
| LCP | 2.5s | 1.5s | ❌ FAIL | +1.0s |
| TBT | 340ms | 100ms | ❌ FAIL | +240ms |
| CLS | 0.12 | 0.05 | ❌ FAIL | +0.07 |
| Total JS | 197KB | 52KB | ❌ FAIL | +145KB |
| HTTP Requests | 12 | 6 | ❌ FAIL | +6 |
| PageSpeed Score | 62/48 | 90+ | ❌ FAIL | -28/-42 |

---

## Trace Evidence

**Source**: `Trace-20260126T101209.json` (Chrome DevTools Performance Recording)

**Key Findings**:
- **ParseHTML**: ~45ms (blocked by scripts)
- **EvaluateScript**: Multiple events totaling ~600ms
- **Scripts blocking**: 8+ in `<head>`
- **Resources from 5+ different CDNs**

---

## Next Steps

This baseline will be compared against post-optimization metrics documented in `performance-results.md` to validate:
- ✅ 60% FCP improvement (1.5s → 0.8s)
- ✅ 50% LCP improvement (2.5s → 1.5s)
- ✅ 75% TBT improvement (340ms → 100ms)
- ✅ 80% CLS improvement (0.12 → 0.05)
- ✅ 74% JS reduction (197KB → 52KB)
- ✅ 50% request reduction (12 → 6)
