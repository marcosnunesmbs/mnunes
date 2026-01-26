# Implementation Plan: Website Performance Optimization

**Branch**: `001-performance-optimization` | **Date**: January 26, 2026 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/001-performance-optimization/spec.md`

## Summary

Optimize the mnunes.xyz static website to achieve 60-80% improvements in Core Web Vitals (FCP, LCP, TBT, CLS) by eliminating render-blocking scripts, replacing CDN resources with pre-compiled assets, implementing resource hints, optimizing images, consolidating analytics, and adding proper caching strategies. The primary technical approach involves transitioning from runtime-compiled Tailwind CSS to a build-time workflow, replacing Font Awesome CDN with selective icon embedding, bundling JavaScript modules, and implementing progressive loading strategies.

## Technical Context

**Language/Version**: HTML5, CSS3, Vanilla JavaScript (ES6+), Node.js 18+ for build tools  
**Primary Dependencies**: Tailwind CSS (currently CDN, migrate to CLI), Font Awesome (currently Kit CDN, migrate to selective SVG or subset), build tools (NEEDS CLARIFICATION: esbuild vs Vite vs Parcel)  
**Storage**: N/A (static site, no backend database)  
**Testing**: NEEDS CLARIFICATION: Browser-based performance testing with Lighthouse, PageSpeed Insights, WebPageTest - need to determine if automated testing framework required  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge last 2 years), optimized for mobile and desktop, static file hosting (current server supports custom headers)  
**Project Type**: Static website (single-page application pattern with dynamic content injection)  
**Performance Goals**: FCP <0.8s, LCP <1.5s, TBT <100ms, CLS <0.05, PageSpeed score 90+, <2s time-to-interactive on 4G  
**Constraints**: <200ms render-blocking time, maintain visual design, no framework dependencies (remain vanilla JS), backward compatible with existing URLs/structure  
**Scale/Scope**: Single-page portfolio site, ~4KB HTML, current ~150KB total JS (target: ~50KB), ~6-8 Font Awesome icons, 4 local JS files to bundle, 3 analytics scripts to consolidate

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Status**: Template constitution file is not populated with specific project principles. Proceeding with standard web performance best practices as implicit constitution:

✅ **No Gates Identified** - The template constitution is unpopulated, so no specific architectural principles, testing requirements, or governance rules apply to this project.

**Implicit Best Practices Applied**:
- Maintain simplicity: Use minimal build tooling, avoid framework overhead
- Progressive enhancement: Ensure core content accessible without JavaScript
- Performance-first: Prioritize measurable user experience improvements
- Backward compatibility: No breaking changes to existing functionality

**Note**: If project-specific constitutional principles exist, they should be documented in `.specify/memory/constitution.md` before proceeding.

## Project Structure

### Documentation (this feature)

```text
specs/001-performance-optimization/
├── plan.md              # This file
├── research.md          # Phase 0 output (build tool selection, hosting config)
├── data-model.md        # Phase 1 output (asset dependency graph, loading strategy)
├── quickstart.md        # Phase 1 output (setup, build, deploy)
└── contracts/           # Phase 1 output (performance contracts, API specifications)
```

### Source Code (repository root)

```text
new-site/
├── index.html                    # Main HTML (to be optimized)
├── assets/
│   ├── css/
│   │   ├── style.css            # Custom styles (existing)
│   │   ├── input.css            # NEW: Tailwind input (Phase 1)
│   │   └── output.css           # NEW: Compiled Tailwind (Phase 1)
│   ├── img/                     # Images (to be optimized with dimensions)
│   │   ├── badges/
│   │   └── logos/
│   └── js/
│       ├── main.js              # Current modular files (to be bundled)
│       ├── projects.js
│       ├── skills.js
│       ├── certifications.js
│       ├── bundle.js            # NEW: Combined minified output (Phase 1)
│       └── bundle.min.js        # NEW: Production bundle (Phase 1)
├── build/                       # NEW: Build tooling (Phase 0/1)
│   ├── tailwind.config.js       # Tailwind configuration
│   └── bundle.config.js         # JS bundler config
├── dist/                        # NEW: Production-ready output (optional)
│   └── [optimized assets]
├── package.json                 # NEW: Build dependencies (Phase 0)
├── .github/
│   └── workflows/
│       └── deploy.yml           # NEW: CI/CD for automated builds (Phase 2)
└── service-worker.js            # NEW: Optional offline caching (Phase 2)
```

**Structure Decision**: This is a static website project with no backend. The structure adds a build workflow while preserving the existing asset organization. The `build/` directory contains configuration for Tailwind CLI and JavaScript bundling. The existing `assets/` structure remains intact to minimize migration risk, with new compiled outputs added alongside sources.

## Complexity Tracking

> **No constitution violations identified** - Template constitution is unpopulated, and this project follows standard web development practices without introducing unnecessary complexity.

| Decision | Justification | Alternative Considered |
|----------|---------------|------------------------|
| Maintain vanilla JS | Spec requires "no framework dependencies", site is simple enough for vanilla JS, avoids React/Vue overhead | Could use lightweight framework (Alpine.js), but adds unnecessary bundle size for this use case |
| Add build step | Required to pre-compile Tailwind and bundle JS per FR-006 and FR-009 | Could continue with CDN, but violates performance requirements |
| Keep modular JS files | Maintains developer experience during development, bundled only for production | Could consolidate source files, but reduces code organization |

---

## Phase 0 Completion: Research ✅

**Status**: Complete  
**Output**: [research.md](research.md)

All NEEDS CLARIFICATION items from Technical Context resolved:
- ✅ Build tool selected: **esbuild** (fastest, simplest for static bundling)
- ✅ Tailwind strategy: **CLI with JIT mode** (eliminates runtime overhead)
- ✅ Font Awesome approach: **Inline SVG** (96% size reduction, 7 icons)
- ✅ Analytics consolidation: **stats.mnunes.xyz only** (97% reduction, privacy-first)
- ✅ Testing approach: **Manual Lighthouse + PageSpeed Insights** (sufficient for static site)
- ✅ Image optimization: **Manual dimensions + WebP for large images**
- ✅ Caching strategy: **1yr static assets, 1hr HTML** (nginx/Apache config documented)
- ✅ Resource hints: **Preconnect GitHub, dns-prefetch stats** (critical path optimization)

**Key Decisions**:
- Total npm dependencies: 2 (esbuild, tailwindcss - both dev-only)
- Expected savings: 182KB (-49%), 6 fewer requests (-50%)
- Build time: <2s for both CSS and JS

---

## Phase 1 Completion: Design & Contracts ✅

**Status**: Complete

### Artifacts Generated

1. **[data-model.md](data-model.md)** ✅
   - Defined Asset Resource entity (resourceType, loadPriority, loadStrategy, etc.)
   - Defined External Connection entity (preconnect/dns-prefetch strategy)
   - Defined Loading Phase entity (4 phases: critical-render, interactive, lazy-load, background)
   - Defined Performance Budget entity (FCP, LCP, TBT, CLS targets)
   - Documented asset dependency graph and state transitions
   - Before/After inventory: 373KB → 191KB total payload

2. **[contracts/performance-baseline.md](contracts/performance-baseline.md)** ✅
   - Documented current metrics from Chrome DevTools trace
   - FCP: 1.5s (desktop), LCP: 2.5s, TBT: 340ms, CLS: 0.12
   - PageSpeed scores: 62 (desktop), 48 (mobile)
   - Identified 9 performance issues (3 critical, 4 high-priority, 2 medium)
   - Network analysis: 12 requests, 348KB transfer, 8 render-blocking scripts

3. **[contracts/performance-targets.md](contracts/performance-targets.md)** ✅
   - Defined all 18 functional requirements (FR-001 to FR-018) with validation criteria
   - Core Web Vitals targets: FCP ≤0.8s, LCP ≤1.5s, TBT ≤100ms, CLS ≤0.05
   - Resource budgets: Total JS ≤52KB, Total CSS ≤15KB, Requests ≤6
   - 8 acceptance test scenarios mapped to user stories
   - 4 edge case validations
   - Contract enforcement rules (deployment gates)

4. **[quickstart.md](quickstart.md)** ✅
   - Complete setup instructions (Node.js, npm dependencies)
   - Tailwind configuration with custom theme colors
   - esbuild bundling configuration
   - Step-by-step HTML optimization guide
   - Font Awesome → SVG replacement examples
   - Server configuration (nginx and Apache)
   - Testing procedures (Lighthouse, PageSpeed, WebPageTest)
   - Troubleshooting guide
   - Deployment checklist

### Agent Context Update

Attempted to run `update-agent-context.ps1`, but script requires agent-file-template.md which is not present in this workspace. This is an optional enhancement and doesn't block implementation.

**Recommendation**: If using GitHub Copilot or similar AI coding assistants, manually add the following to `.github/copilot-instructions.md` or similar:

```markdown
## Performance Optimization Technologies

- **Build Tools**: esbuild (v0.20+), Tailwind CSS CLI (v3.4+)
- **Performance Focus**: Core Web Vitals optimization (FCP, LCP, TBT, CLS)
- **No Frameworks**: Vanilla JavaScript, no React/Vue/Angular
- **Asset Strategy**: Pre-compiled CSS, bundled JS, inline SVG icons
- **Caching**: 1 year for static assets, 1 hour for HTML
```

---

## Phase 2: Tasks Generation (Not in Scope)

Per mode instructions, `/speckit.plan` stops after Phase 1. The next step is to run `/speckit.tasks` to generate the implementation task breakdown.

**What's Next**:
- Use `/speckit.tasks` command to generate `tasks.md` with granular implementation steps
- Tasks will reference the artifacts created here (plan, research, data-model, contracts, quickstart)

---

## Re-evaluation: Constitution Check ✅

**Post-Design Review**: No changes from initial assessment. Template constitution remains unpopulated, no architectural gates apply.

**Implicit Best Practices Compliance**:
- ✅ Simplicity maintained: Minimal build tooling (2 npm packages)
- ✅ Progressive enhancement: Core content accessible without JavaScript
- ✅ Performance-first: All decisions optimize for measurable user experience
- ✅ Backward compatibility: No breaking changes to existing functionality

---

## Summary

**Planning Status**: ✅ **COMPLETE**

All mandatory planning phases executed:
- ✅ Phase 0: Research completed, all unknowns resolved
- ✅ Phase 1: Data model, contracts, and quickstart generated
- ✅ Constitution checks passed (initial + post-design)
- ✅ Project structure documented
- ✅ Complexity tracking completed

**Artifacts Created**:
1. plan.md (this file)
2. research.md (8 research questions answered)
3. data-model.md (4 entities defined with relationships)
4. contracts/performance-baseline.md (current metrics documented)
5. contracts/performance-targets.md (acceptance criteria defined)
6. quickstart.md (complete setup and deployment guide)

**Ready for**: `/speckit.tasks` to generate implementation tasks

**Branch**: `001-performance-optimization`  
**Specification**: [spec.md](spec.md)  
**Next Command**: `/speckit.tasks` or begin implementation using [quickstart.md](quickstart.md)

