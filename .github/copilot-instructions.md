# Copilot Instructions - Marcos Nunes Portfolio

## Project Overview
Personal portfolio website built as a **performance-optimized static site**. No framework—vanilla JavaScript with ES6 modules, compiled Tailwind CSS, and inline SVG icons for maximum speed.

## Architecture & Data Flow

### Component Structure
- **Single HTML entry**: `index.html` (Portuguese language, `lang="pt-BR"`)
- **JavaScript modules**: `main.js` imports and renders data from `projects.js`, `skills.js`, `certifications.js`
- **Data pattern**: Each module exports an array of objects with consistent schema (see examples below)
- **Rendering**: Vanilla DOM manipulation in `DOMContentLoaded` event, dynamically populating `#certifications-container`, `#skills-container`, `#projects-container`

### Build System (Not Live-Reload)
```bash
npm run build:css    # Tailwind: input.css → output.css (minified)
npm run build:js     # esbuild: main.js → bundle.min.js (bundles ES6 modules)
npm run build        # Both CSS + JS
npm run watch:css    # Watch mode for CSS
npm run watch:js     # Watch mode for JS
```

**Local dev server**: `php -S localhost:8000` (from `new-site/` directory)
- ⚠️ No hot-reload. After JS/CSS changes, run build commands and refresh browser manually.

## Performance-First Conventions

### 1. Image Optimization (CRITICAL)
Always include `width`, `height`, and `loading` attributes on ALL images:
```javascript
// Example from projects.js
{
    name: "NutriAI",
    width: 48, height: 48, loading: "lazy",
    imgSrc: "https://nutri.mnunes.xyz/nutri-ai-logo-2.png"
}
```

### 2. Inline SVG Icons (No Icon Fonts)
**Do NOT use Font Awesome classes**. Site uses inline SVG with `fill="currentColor"`:
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" class="w-6 h-6 inline-block fill-current">
  <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6..."/>
</svg>
```
Icons inherit text color via `fill-current` utility class.

### 3. Resource Hints (Required in `<head>`)
New external resources need corresponding hints:
```html
<link rel="preconnect" href="https://example.com" crossorigin>
<link rel="dns-prefetch" href="https://example.com">
```

### 4. Script Loading Strategy
- **All scripts**: Use `defer` attribute (no blocking render)
- **CSS**: Preload critical stylesheets with `<link rel="preload" as="style">`
- **Order matters**: Resource hints → preloads → stylesheets → scripts

## Tailwind CSS Customization

Custom theme in `tailwind.config.js`:
```javascript
colors: {
  'dark-bg': '#121212',        // Primary background
  'dark-secondary': '#1E1E1E', // Secondary background
  'accent': '#00af1a',         // Primary green
  'accent-light': '#00c91f',   // Hover green
  'accent-dark': '#008a14'     // Active green
}
```
Use these instead of default Tailwind colors for consistency.

## Adding New Content

### New Project
Add to `assets/js/projects.js` array:
```javascript
{
    name: "Project Name",
    width: 48, height: 48, loading: "lazy",
    url: "https://example.com",
    imgSrc: "./assets/img/logos/project.svg",
    alt: "Logo description",
    description: "Project description. Can include <a> tags."
}
```

### New Skill
Add to `assets/js/skills.js` array:
```javascript
{
    name: "Technology Name",
    width: 80, height: 80, loading: "lazy",
    image: "./assets/img/logos/tech.svg",
    color: "bg-gray-800"  // Tailwind background color
}
```

### New Certification Badge
Add to `assets/js/certifications.js` array:
```javascript
{
    name: "Cert Name",
    width: 128, height: 128, loading: "lazy",
    imgSrc: "./assets/img/badges/cert.png",
    alt: "Certification badge description"
}
```

## CSS Patterns

### Custom Animations (See `style.css`)
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Applied via utility class: `animate-fade-in`

### Hover Effects (Consistent Pattern)
- **Images**: `filter: grayscale(30%)` → `grayscale(0%)` + `scale(1.1)` on hover
- **Cards**: `translateY(-5px)` + accent border color
- **Icons**: `transform: translateY(-3px)` + color transition

## Deployment Context

**Production server**: nginx with aggressive caching (see `nginx.conf`)
- Static assets: 1 year cache (`Cache-Control: public, immutable`)
- HTML: 1 hour cache with revalidation
- Gzip compression enabled for text assets

**Analytics**: Uses self-hosted analytics at `stats.mnunes.xyz` (privacy-focused, no Google Analytics/GTM in production)

## Common Pitfalls

1. ❌ **Don't** add Font Awesome kit/CDN links—uses inline SVG only
2. ❌ **Don't** use Tailwind CDN—always use compiled `output.css`
3. ❌ **Don't** add `async` to scripts—use `defer` for proper execution order
4. ✅ **Do** run `npm run build` after changing JS/CSS before testing
5. ✅ **Do** add width/height to prevent Cumulative Layout Shift (CLS)
6. ✅ **Do** maintain the ES6 module pattern (export/import) in JS files

## Testing Performance
After changes, validate with:
```bash
# Local server
php -S localhost:8000

# Then test in Chrome DevTools:
# - Lighthouse (Performance tab)
# - Network tab (check resource loading)
# - Coverage tab (unused CSS/JS)
```

Target metrics: FCP < 0.8s, LCP < 1.5s, CLS < 0.05, TBT < 100ms
