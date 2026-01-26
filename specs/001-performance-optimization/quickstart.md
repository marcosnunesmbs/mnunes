# Quickstart Guide: Website Performance Optimization

**Feature**: 001-performance-optimization  
**Date**: January 26, 2026  
**Audience**: Developers implementing the performance optimizations

## Prerequisites

- **Node.js**: v18+ (for build tools)
- **npm**: v9+ (comes with Node.js)
- **Git**: Branched from `001-performance-optimization`
- **Text Editor**: VS Code, Sublime, or similar
- **Browser**: Chrome 121+ (for testing with DevTools)
- **Server Access**: Ability to configure HTTP headers (nginx/Apache)

---

## Installation & Setup

### 1. Install Build Dependencies

```bash
# Navigate to project root
cd c:/Users/marco/projects/mnunes/new-site

# Ensure you're on the feature branch
git checkout 001-performance-optimization

# Initialize npm (creates package.json)
npm init -y

# Install build tools
npm install --save-dev esbuild tailwindcss

# Verify installations
npx esbuild --version  # Should show v0.20.x
npx tailwindcss --help # Should show Tailwind CLI help
```

**Expected package.json**:
```json
{
  "name": "mnunes-portfolio",
  "version": "1.0.0",
  "scripts": {
    "build:css": "tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css --minify",
    "build:js": "esbuild assets/js/main.js assets/js/projects.js assets/js/skills.js assets/js/certifications.js --bundle --minify --outfile=assets/js/bundle.min.js",
    "build": "npm run build:css && npm run build:js",
    "watch:css": "tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css --watch",
    "watch:js": "esbuild assets/js/main.js assets/js/projects.js assets/js/skills.js assets/js/certifications.js --bundle --outfile=assets/js/bundle.min.js --watch"
  },
  "devDependencies": {
    "esbuild": "^0.20.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

### 2. Configure Tailwind CSS

Create `tailwind.config.js` in project root:

```bash
npx tailwindcss init
```

Update the generated config:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./assets/js/**/*.js"
  ],
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
  },
  plugins: [],
}
```

Create `assets/css/input.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 3. Build Optimized Assets

```bash
# Build CSS (generates assets/css/output.css)
npm run build:css

# Build JavaScript (generates assets/js/bundle.min.js)
npm run build:js

# Or build both at once
npm run build
```

**Verify outputs**:
```bash
# Check CSS file exists and size
ls -lh assets/css/output.css  # Should be ~8-12KB

# Check JS bundle exists and size
ls -lh assets/js/bundle.min.js # Should be ~18-25KB
```

---

## Implementation Steps

### Phase 1: HTML Optimizations (FR-002, FR-003, FR-004, FR-011, FR-017, FR-018)

**File**: `index.html`

#### 1.1 Update Script Tags (Add defer, Remove CDNs)

**Before**:
```html
<script src="https://kit.fontawesome.com/ea04606ce9.js" crossorigin="anonymous"></script>
<script src="https://cdn.tailwindcss.com"></script>
<script>
    tailwind.config = { ... }
</script>
<script src="./assets/js/main.js"></script>
<script src="./assets/js/projects.js"></script>
<script src="./assets/js/skills.js"></script>
<script src="./assets/js/certifications.js"></script>
```

**After**:
```html
<!-- Deferred local bundle (replaces 4 files + Tailwind CDN) -->
<script defer src="./assets/js/bundle.min.js"></script>

<!-- Analytics (deferred to background) -->
<script defer src="https://stats.mnunes.xyz/script.js" data-website-id="b7007ab2-af02-466b-9ac7-e18b3537b118"></script>
```

#### 1.2 Replace Tailwind CDN with Compiled CSS

**Before**:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

**After**:
```html
<link rel="stylesheet" href="./assets/css/output.css">
```

#### 1.3 Remove Analytics Scripts (FR-008)

**Remove these lines**:
```html
<!-- DELETE: Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-X4LN7HP4TV"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-X4LN7HP4TV');
</script>

<!-- DELETE: Google Tag Manager -->
<script>(function(w,d,s,l,i){ ... })(window,document,'script','dataLayer','GTM-TS84PFDJ');</script>

<!-- DELETE: GTM noscript -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TS84PFDJ" ...></iframe></noscript>
```

**Keep only**:
```html
<script defer src="https://stats.mnunes.xyz/script.js" data-website-id="b7007ab2-af02-466b-9ac7-e18b3537b118"></script>
```

#### 1.4 Add Resource Hints

Add to `<head>` section:

```html
<!-- DNS Prefetch for non-critical domains -->
<link rel="dns-prefetch" href="https://stats.mnunes.xyz">

<!-- Preconnect for critical external resources -->
<link rel="preconnect" href="https://avatars.githubusercontent.com" crossorigin>

<!-- Preload critical CSS -->
<link rel="preload" as="style" href="./assets/css/output.css">
<link rel="preload" as="script" href="./assets/js/bundle.min.js">
```

#### 1.5 Add Image Dimensions (FR-003)

**Before**:
```html
<img src="https://avatars.githubusercontent.com/u/29044312?v=4" 
     alt="Marcos Nunes Photo Profile"
     class="w-48 h-48 rounded-full ...">
```

**After**:
```html
<img src="https://avatars.githubusercontent.com/u/29044312?v=4&s=192" 
     alt="Marcos Nunes Photo Profile"
     width="192" 
     height="192"
     loading="eager"
     fetchpriority="high"
     class="w-48 h-48 rounded-full ...">
```

**For badges/logos (below fold)**:
```html
<img src="./assets/img/badges/aws-cert.png" 
     alt="AWS Certification Badge"
     width="120"
     height="120"
     loading="lazy"
     class="...">
```

**Measurement**: Use browser inspect or image properties to get actual dimensions.

---

### Phase 2: Replace Font Awesome with Inline SVG (FR-007)

**Icon Mapping** (7 icons to replace):

1. **fa-terminal** → Terminal icon (used 3x)
2. **fa-blog** → Blog icon
3. **fa-github** → GitHub logo
4. **fa-linkedin** → LinkedIn logo
5. **fa-certificate** → Certificate icon (Credly)
6. **fa-envelope** → Email icon
7. **fa-bookmark** → Bookmark icon

**Example Replacement**:

**Before**:
```html
<i class="fa-brands fa-github fa-xl"></i>
```

**After**:
```html
<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
</svg>
```

**SVG Sources**:
- Font Awesome Free Icons: https://fontawesome.com/search?o=r&m=free
- Heroicons: https://heroicons.com/ (alternative)
- Download SVG, copy `<path>` content

---

### Phase 3: Server Configuration (FR-012, FR-013)

#### 3.1 Nginx Configuration

Edit `/etc/nginx/sites-available/mnunes.xyz` (or equivalent):

```nginx
server {
    listen 80;
    server_name mnunes.xyz www.mnunes.xyz;
    root /var/www/mnunes.xyz;
    index index.html;

    # Static assets - aggressive caching (1 year)
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML - short cache with revalidation (1 hour)
    location ~* \.(html)$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json image/svg+xml;

    # Enable brotli (if module installed)
    # brotli on;
    # brotli_comp_level 6;
    # brotli_types text/plain text/css text/xml text/javascript 
    #              application/x-javascript application/xml+rss 
    #              application/javascript application/json image/svg+xml;
}
```

**Apply configuration**:
```bash
sudo nginx -t           # Test config syntax
sudo systemctl reload nginx  # Reload nginx
```

#### 3.2 Apache Configuration (Alternative)

Edit `.htaccess` in project root:

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# Cache static assets (1 year)
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    
    # Cache HTML briefly (1 hour)
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Add Cache-Control headers
<IfModule mod_headers.c>
    <FilesMatch "\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot|webp)$">
        Header set Cache-Control "public, immutable, max-age=31536000"
    </FilesMatch>
    <FilesMatch "\.(html)$">
        Header set Cache-Control "public, must-revalidate, max-age=3600"
    </FilesMatch>
</IfModule>
```

---

## Testing & Validation

### 1. Local Development Testing

```bash
# Start local server (Python simple server)
python -m http.server 8000

# Or use Node.js http-server
npx http-server -p 8000

# Open browser
open http://localhost:8000
```

**Manual checks**:
- ✅ Page loads and displays correctly
- ✅ Styles applied (Tailwind classes working)
- ✅ JavaScript functionality intact (projects, skills, certifications load)
- ✅ Icons display (inline SVG instead of Font Awesome)
- ✅ No console errors

### 2. Performance Testing

#### Option A: Chrome DevTools Lighthouse

1. Open Chrome DevTools (F12)
2. Navigate to **Lighthouse** tab
3. Select:
   - ✅ Performance
   - ✅ Desktop (or Mobile)
   - ✅ Clear storage
4. Click **Analyze page load**
5. Verify:
   - Performance score ≥ 90
   - FCP ≤ 0.8s
   - LCP ≤ 1.5s
   - TBT ≤ 100ms
   - CLS ≤ 0.05

#### Option B: PageSpeed Insights

1. Deploy to production (or use ngrok for local testing)
2. Visit: https://pagespeed.web.dev/
3. Enter URL: https://mnunes.xyz
4. Run analysis (tests both mobile and desktop)
5. Verify scores ≥ 90

#### Option C: WebPageTest

1. Visit: https://www.webpagetest.org/
2. Enter URL
3. Select:
   - Location: Closest to target audience
   - Browser: Chrome
   - Connection: 4G
4. Run test (3 runs)
5. Review waterfall chart, filmstrip view

### 3. Network Inspection

Open **Network tab** in Chrome DevTools:

```
Requests to verify REMOVED:
❌ cdn.tailwindcss.com
❌ kit.fontawesome.com
❌ www.googletagmanager.com/gtag/js
❌ www.googletagmanager.com/gtm.js

Requests that should exist:
✅ index.html (~4.5KB)
✅ output.css (~12KB)
✅ bundle.min.js (~18KB)
✅ avatars.githubusercontent.com/u/29044312?v=4&s=192
✅ stats.mnunes.xyz/script.js (~2KB)
✅ Images (badges, logos)

Total requests: ≤ 8 (target: 6)
```

### 4. Cache Validation

```bash
# Test CSS cache header
curl -I https://mnunes.xyz/assets/css/output.css

# Expected output:
# Cache-Control: public, immutable, max-age=31536000

# Test HTML cache header
curl -I https://mnunes.xyz/

# Expected output:
# Cache-Control: public, must-revalidate, max-age=3600

# Test compression
curl -H "Accept-Encoding: gzip" -I https://mnunes.xyz/assets/css/output.css

# Expected output:
# Content-Encoding: gzip
```

---

## Troubleshooting

### Issue: Tailwind classes not applying

**Symptom**: Page loads but no styles  
**Cause**: Tailwind didn't detect HTML classes  
**Fix**:
```bash
# Verify tailwind.config.js content paths
# Should include: "./index.html"

# Rebuild CSS
npm run build:css

# Check output.css is not empty
cat assets/css/output.css | head -20
```

### Issue: JavaScript functionality broken

**Symptom**: Projects/skills don't load  
**Cause**: Bundling error or variable scope issue  
**Fix**:
```bash
# Check esbuild output for errors
npm run build:js

# Test unbundled version first
# Temporarily revert to individual script tags

# Check browser console for errors (F12)
```

### Issue: Icons not displaying

**Symptom**: Broken icon placeholders  
**Cause**: Incomplete SVG replacement  
**Fix**:
- Verify all `<i class="fa-*">` tags replaced with `<svg>`
- Check SVG `viewBox` attribute matches source
- Ensure `currentColor` in `fill` attribute (inherits text color)

### Issue: Images still causing layout shift

**Symptom**: CLS score high  
**Cause**: Missing or incorrect width/height  
**Fix**:
```bash
# Inspect image in browser (right-click → Inspect)
# Check actual rendered dimensions
# Update width/height attributes to match
```

### Issue: Cache headers not working

**Symptom**: `curl -I` shows no `Cache-Control`  
**Cause**: Server config not applied  
**Fix**:
```bash
# Nginx
sudo nginx -t  # Check syntax
sudo systemctl status nginx  # Check running
sudo systemctl reload nginx  # Reload config

# Apache
sudo apachectl configtest
sudo systemctl reload apache2
```

---

## Deployment Checklist

Before deploying to production:

- [ ] `npm run build` executes without errors
- [ ] `assets/css/output.css` exists and is ~8-15KB
- [ ] `assets/js/bundle.min.js` exists and is ~18-25KB
- [ ] All Font Awesome icons replaced with inline SVG
- [ ] Google Analytics and GTM scripts removed
- [ ] All images have width/height attributes
- [ ] Resource hints added to `<head>`
- [ ] Lighthouse score ≥ 90 (desktop and mobile)
- [ ] Server cache headers configured and tested
- [ ] gzip/brotli compression enabled and verified
- [ ] Manual functional testing passed (click all links, check all sections)

---

## Build Scripts Reference

```bash
# Development (watch mode, auto-rebuild on file changes)
npm run watch:css   # Watch CSS changes
npm run watch:js    # Watch JS changes

# Production (one-time build)
npm run build:css   # Build optimized CSS
npm run build:js    # Build minified JS bundle
npm run build       # Build both CSS and JS

# Clean build (remove old files first)
rm -f assets/css/output.css assets/js/bundle.min.js
npm run build
```

---

## Continuous Integration (Optional - Phase 2)

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main, 001-performance-optimization]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build assets
        run: npm run build
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun --collect.url=http://localhost:8000
      
      - name: Deploy to server
        run: |
          # Your deployment commands (rsync, scp, etc.)
          rsync -avz --delete ./ user@mnunes.xyz:/var/www/mnunes.xyz/
```

---

## Performance Monitoring

**Post-deployment**, bookmark these URLs:

1. **PageSpeed Insights**: https://pagespeed.web.dev/analysis?url=https://mnunes.xyz
2. **GTmetrix**: https://gtmetrix.com/?url=https://mnunes.xyz
3. **WebPageTest**: https://www.webpagetest.org/?url=https://mnunes.xyz

**Set reminder** to check monthly and document any regressions.

---

## Next Steps

After completing this quickstart:

1. Document actual metrics in `contracts/performance-results.md`
2. Compare against baseline (`contracts/performance-baseline.md`)
3. Verify all targets met (`contracts/performance-targets.md`)
4. Update plan.md with completion status
5. Create pull request to merge `001-performance-optimization` → `main`

---

## Support Resources

- **Tailwind Docs**: https://tailwindcss.com/docs
- **esbuild Docs**: https://esbuild.github.io/
- **Web.dev Performance**: https://web.dev/performance/
- **MDN Web Performance**: https://developer.mozilla.org/en-US/docs/Web/Performance
