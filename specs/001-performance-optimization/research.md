# Phase 0: Research & Technology Decisions

**Feature**: Website Performance Optimization  
**Date**: January 26, 2026  
**Status**: Complete

## Research Questions

This document resolves all "NEEDS CLARIFICATION" items from [plan.md Technical Context](plan.md#technical-context).

---

## 1. Build Tool Selection: esbuild vs Vite vs Parcel

**Question**: Which build tool should we use for bundling JavaScript and processing Tailwind CSS?

**Decision**: **esbuild**

**Rationale**:
- **Speed**: esbuild is the fastest bundler (10-100x faster than Webpack/Parcel), critical for maintaining developer experience
- **Simplicity**: Minimal configuration required, aligns with "no framework" philosophy
- **Size**: Produces optimally small bundles with tree-shaking and minification built-in
- **Tailwind Compatibility**: Works seamlessly with Tailwind CLI (they're independent tools)
- **Zero dependencies**: Written in Go, single binary, no npm dependency hell

**Alternatives Considered**:
- **Vite**: Excellent DX but adds dev server complexity we don't need for a static site; overkill for 4 simple JS files
- **Parcel**: Zero-config is appealing, but slower than esbuild and larger bundle sizes in benchmarks
- **Rollup**: Great for libraries, but esbuild is faster and simpler for application bundling
- **Webpack**: Too complex, slow build times, configuration overhead not justified

**Implementation Approach**:
```bash
# Install esbuild (only build dependency)
npm install --save-dev esbuild

# Bundle command
npx esbuild assets/js/main.js assets/js/projects.js assets/js/skills.js assets/js/certifications.js \
  --bundle --minify --outfile=assets/js/bundle.min.js
```

**Trade-offs**:
- ✅ Fastest builds, smallest bundles
- ✅ Simple configuration
- ⚠️ Less plugin ecosystem than Webpack (not needed here)

---

## 2. Tailwind CSS Build Strategy

**Question**: How should we integrate Tailwind CSS build process for optimal performance?

**Decision**: **Tailwind CSS CLI with JIT mode and PurgeCSS**

**Rationale**:
- **Standalone Tool**: Tailwind CLI is independent, no bundler coupling required
- **PurgeCSS Built-in**: Automatically removes unused styles, reducing CSS from ~3MB to <10KB
- **JIT Mode**: Just-In-Time compilation generates only classes used in HTML
- **No Runtime**: Eliminates the 50KB+ Tailwind CDN JavaScript overhead
- **Simple Integration**: Single npm script, no complex build pipeline

**Configuration**:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#121212',
        'dark-secondary': '#1E1E1E',
        'accent': '#00af1a',
        'accent-light': '#00c91f',
        'accent-dark': '#008a14'
      }
    }
  }
}
```

**Build Command**:
```bash
npx tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css --minify
```

**Expected Results**:
- Current: Tailwind CDN ~52KB JS + runtime compilation overhead
- After: ~8-12KB minified CSS, zero JavaScript, zero runtime processing

**Alternatives Considered**:
- **PostCSS + Tailwind Plugin**: More flexible but adds complexity; CLI is sufficient
- **Tailwind Play CDN with aggressive caching**: Still has runtime overhead, violates FR-006
- **Manual CSS extraction**: Too time-consuming, error-prone

---

## 3. Font Awesome Optimization Strategy

**Question**: How should we optimize Font Awesome to include only the 6-8 icons actually used?

**Decision**: **Inline SVG with manual extraction**

**Rationale**:
- **Zero JavaScript**: Eliminates 70KB Font Awesome Kit CDN entirely
- **Optimal Size**: 6-8 inline SVGs = ~2-3KB vs 70KB kit
- **No Network Requests**: SVGs embedded in HTML, no external dependencies
- **Full Control**: Can optimize SVG paths, add aria labels, customize colors via CSS
- **No Build Step**: Copy-paste SVG from Font Awesome website, one-time manual task

**Implementation Steps**:
1. Identify all icons used (from code audit):
   - `fa-terminal` (used 3x: header, skills, projects)
   - `fa-blog` (used 1x: blog link)
   - `fa-github` (social link)
   - `fa-linkedin` (social link)
   - `fa-certificate` (Credly link)
   - `fa-envelope` (email link)
   - `fa-bookmark` (certifications header)
   - Total: 7 unique icons

2. Download SVG from Font Awesome:
   ```html
   <!-- Example: GitHub icon -->
   <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
     <path d="M12 0c-6.626 0-12 5.373-12 12..."/>
   </svg>
   ```

3. Replace `<i class="fa-brands fa-github"></i>` with inline SVG

**Expected Savings**:
- Before: 70KB Font Awesome Kit JS
- After: ~2.5KB inline SVG
- **Net reduction: 67.5KB (~96% reduction)**

**Alternatives Considered**:
- **Font Awesome npm package + tree-shaking**: Still requires build step, produces larger output than manual SVG
- **Font Awesome subset generator**: Third-party tools unreliable, manual is simpler for 7 icons
- **Icon font subset**: Still requires font file download, SVG is more performant

---

## 4. Analytics Consolidation Decision

**Question**: Which analytics solution should we keep: Google Analytics, Google Tag Manager, or stats.mnunes.xyz?

**Decision**: **Keep stats.mnunes.xyz (self-hosted) + Remove GA and GTM**

**Rationale**:
- **Privacy-First**: Self-hosted analytics respects user privacy, no third-party tracking
- **Performance**: stats.mnunes.xyz script is lightweight (~2KB) vs GA (45KB) + GTM (28KB)
- **Ad-blocker Friendly**: Self-hosted domain less likely to be blocked
- **Compliance**: No GDPR cookie consent required for self-hosted analytics
- **Sufficient Data**: For a portfolio site, page views and referrers are enough; don't need GA's enterprise features

**Migration Plan**:
1. Verify stats.mnunes.xyz is capturing all necessary metrics (page views, referrers, device types)
2. Export any critical historical data from Google Analytics (if needed)
3. Remove GA and GTM scripts from HTML
4. Add `defer` attribute to stats.mnunes.xyz script

**Expected Savings**:
- Before: GA (45KB) + GTM (28KB) + stats.mnunes.xyz (2KB) = 75KB
- After: stats.mnunes.xyz (2KB)
- **Net reduction: 73KB (~97% reduction)**
- **Requests saved**: 3+ requests (GA, GTM, additional tracking pixels)

**Alternatives Considered**:
- **Keep GTM only**: Still 28KB, overkill for simple portfolio site without tag management needs
- **Keep GA only**: Privacy concerns, 45KB overhead, blocks by ad-blockers
- **Remove all analytics**: Loses valuable traffic insights

---

## 5. Performance Testing Strategy

**Question**: Do we need automated performance testing, or is manual testing with Lighthouse sufficient?

**Decision**: **Manual Lighthouse + PageSpeed Insights with documented baseline + targets**

**Rationale**:
- **Simplicity**: No CI/CD performance testing infrastructure required
- **Sufficient for Static Site**: Portfolio site changes infrequently, manual testing on each deploy is acceptable
- **Cost**: Automated tools (SpeedCurve, Calibre) cost money, not justified for personal portfolio
- **Lighthouse CI Considered**: Adds complexity without significant value for single-developer project

**Testing Protocol**:
1. **Before Optimization** (Baseline):
   - Run Lighthouse in Chrome DevTools (desktop + mobile)
   - Run PageSpeed Insights (captures real-world CrUX data)
   - Document scores in `contracts/performance-baseline.md`

2. **After Each Optimization Phase**:
   - Re-run same tests
   - Compare against baseline
   - Document in `contracts/performance-results.md`

3. **Acceptance Criteria** (from spec.md):
   - FCP: <0.8s (current ~1.5-2s)
   - LCP: <1.5s (current ~2.5-3s)
   - TBT: <100ms (current ~300-400ms)
   - CLS: <0.05 (current ~0.1-0.2)
   - PageSpeed Score: 90+ (both mobile/desktop)

**Tools to Use**:
- Chrome DevTools Lighthouse (local testing)
- PageSpeed Insights (online, includes CrUX data)
- WebPageTest (detailed waterfall analysis)

**Alternatives Considered**:
- **Lighthouse CI**: Automated testing in GitHub Actions - unnecessary complexity for this project
- **Playwright performance tests**: Over-engineering for a static site
- **Real User Monitoring (RUM)**: Costly, overkill for portfolio site

---

## 6. Image Optimization Approach

**Question**: Should we use automated image optimization tools or manual optimization?

**Decision**: **Hybrid: Manual dimension specification + WebP conversion for larger images**

**Rationale**:
- **Primary Issue**: Missing width/height causes CLS (layout shift)
- **Solution**: Add explicit dimensions to all `<img>` tags
- **Secondary**: Convert larger images (logos, profile photo) to WebP for size reduction
- **GitHub Avatar**: Use query parameter `?s=192` to request correct size from GitHub API

**Implementation**:
1. **Audit all images**:
   ```bash
   grep -r '<img' index.html
   ```

2. **Add dimensions**:
   ```html
   <!-- Before -->
   <img src="profile.jpg" alt="Profile">
   
   <!-- After -->
   <img src="profile.jpg" alt="Profile" width="192" height="192">
   ```

3. **Add loading attributes**:
   ```html
   <!-- Above fold (profile photo) -->
   <img src="profile.jpg" width="192" height="192" loading="eager" fetchpriority="high">
   
   <!-- Below fold (badges, logos) -->
   <img src="badge.png" width="120" height="120" loading="lazy">
   ```

4. **Convert larger images to WebP** (if any are >50KB):
   ```bash
   # Using cwebp (optional)
   cwebp -q 80 logo.png -o logo.webp
   ```

**Expected Results**:
- CLS reduction: 0.1-0.2 → <0.05 (80% improvement)
- LCP improvement: Faster image decode with correct sizing
- Potential size savings: 20-30% if WebP conversion applied

**Alternatives Considered**:
- **Automated image pipeline**: Tools like imagemin, sharp - overkill for ~10 images
- **CDN with automatic optimization**: Cloudinary, Imgix - adds cost and complexity
- **Responsive images (srcset)**: Useful but not critical for this fixed-layout portfolio

---

## 7. Caching Strategy

**Question**: What caching headers should be configured on the hosting server?

**Decision**: **Aggressive caching for versioned assets, short cache for HTML**

**Rationale**:
- **Static Assets Never Change**: Once deployed, bundle.min.js won't change until next deploy
- **Cache Busting**: Can use query params or file hashing for updates (`bundle.min.js?v=2`)
- **HTML Short TTL**: index.html cached briefly to allow quick updates

**Recommended Headers** (for nginx/Apache configuration):

```nginx
# Static assets (CSS, JS, images, fonts) - cache 1 year
location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot|webp)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML - short cache, must revalidate
location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}

# Enable compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml+rss 
           application/javascript application/json image/svg+xml;
```

**Verification**:
```bash
curl -I https://mnunes.xyz/assets/js/bundle.min.js | grep -i cache
curl -I https://mnunes.xyz/ | grep -i cache
```

**Expected Impact**:
- Returning visitors: Load page from cache in <0.5s
- Reduced server bandwidth: 80%+ reduction for repeat visitors

**Alternatives Considered**:
- **Service Worker caching**: Implemented as Phase 2 enhancement, not Phase 1 requirement
- **CDN caching**: Current hosting sufficient, no CDN migration needed

---

## 8. Resource Hints Strategy

**Question**: Which domains need DNS prefetch, preconnect, and which resources need preload?

**Decision**: **Implement selective resource hints based on critical rendering path**

**Domains Requiring Hints**:
1. **GitHub (avatars)**: Used above-the-fold, needs preconnect
2. **stats.mnunes.xyz**: Analytics, can use dns-prefetch only (not render-critical)

**After Optimization** (once CDNs removed):
- Font Awesome CDN: REMOVED (no hint needed)
- Tailwind CDN: REMOVED (no hint needed)
- Google Analytics/GTM: REMOVED (no hint needed)

**Implementation**:
```html
<head>
  <!-- Preconnect for critical resources -->
  <link rel="preconnect" href="https://avatars.githubusercontent.com" crossorigin>
  
  <!-- DNS prefetch for non-critical -->
  <link rel="dns-prefetch" href="https://stats.mnunes.xyz">
  
  <!-- Preload critical CSS (if split) -->
  <link rel="preload" as="style" href="./assets/css/output.css">
  
  <!-- Preload critical font (if using custom fonts) -->
  <!-- <link rel="preload" as="font" href="./assets/fonts/main.woff2" crossorigin> -->
</head>
```

**Expected Impact**:
- Saves ~200-300ms on GitHub avatar connection
- Minimal overhead (2 additional DNS lookups moved to parallel phase)

**Alternatives Considered**:
- **Prefetch**: Too speculative, not useful for current page load
- **Modulepreload**: Not needed, using bundled script not ES modules

---

## Technology Stack Summary

| Component | Current | After Optimization | Rationale |
|-----------|---------|-------------------|-----------|
| **HTML** | HTML5 | HTML5 (optimized) | Add dimensions, resource hints, defer attributes |
| **CSS** | Tailwind CDN + custom | Tailwind CLI + custom | Eliminate runtime compilation |
| **JavaScript** | 4 separate files | 1 bundled file (esbuild) | Reduce requests, minification |
| **Icons** | Font Awesome Kit CDN (70KB) | Inline SVG (2.5KB) | 96% size reduction |
| **Analytics** | GA + GTM + stats (75KB) | stats.mnunes.xyz (2KB) | 97% size reduction |
| **Build Tool** | None | esbuild + Tailwind CLI | Fast, simple, zero runtime overhead |
| **Testing** | Manual/ad-hoc | Lighthouse + PageSpeed | Documented baseline + targets |
| **Caching** | Unknown/default | 1yr static, 1hr HTML | Optimize repeat visits |

**Total Expected Savings**:
- JavaScript: ~197KB → ~52KB (74% reduction)
- HTTP Requests: ~12 → ~6 (50% reduction)
- Time to Interactive: ~2.5s → ~0.8s (68% improvement)

---

## Dependencies Required

```json
{
  "devDependencies": {
    "esbuild": "^0.20.0",
    "tailwindcss": "^3.4.0"
  }
}
```

**Total npm packages**: 2 (both build-time only, zero runtime dependencies)

---

## Next Steps

All NEEDS CLARIFICATION items resolved. Ready to proceed to **Phase 1: Design & Contracts**.

1. ✅ Build tool selected: esbuild
2. ✅ Tailwind strategy: CLI with JIT + PurgeCSS
3. ✅ Font Awesome approach: Inline SVG
4. ✅ Analytics decision: stats.mnunes.xyz only
5. ✅ Testing strategy: Manual Lighthouse
6. ✅ Image optimization: Manual dimensions + WebP
7. ✅ Caching headers: Documented nginx config
8. ✅ Resource hints: Preconnect GitHub, dns-prefetch stats
