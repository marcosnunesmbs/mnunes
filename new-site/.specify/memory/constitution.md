<!--
Sync Impact Report - Constitution Update

Version Change: None → 1.0.0
Type: Initial Constitution
Date: 2026-01-26

Modified Principles:
  ✨ NEW: I. Performance-First
  ✨ NEW: II. Progressive Enhancement
  ✨ NEW: III. Static-First Architecture
  ✨ NEW: IV. Accessibility & Standards
  ✨ NEW: V. Measurement & Optimization

Added Sections:
  ✨ NEW: Technology Standards
  ✨ NEW: Development Workflow

Templates Status:
  ✅ plan-template.md - Updated with specific Constitution Check gates
  ✅ spec-template.md - Compatible (no changes required)
  ✅ tasks-template.md - Compatible (no changes required)

Follow-up Actions:
  - No immediate follow-ups required
  - Constitution ready for use in feature planning
  - All templates synchronized with constitution principles

Notes:
  - Initial constitution created for personal portfolio website
  - Focused on web performance, accessibility, and maintainability
  - All principles derived from existing PERFORMANCE-RECOMMENDATIONS.md and site structure
  - Constitution Check section in plan-template.md now includes concrete verification gates
-->

# Marcos Nunes Portfolio Constitution

## Core Principles

### I. Performance-First

Every change MUST improve or maintain web performance metrics. Performance is non-negotiable.

**Rules**:
- All scripts MUST use `defer` or `async` attributes (except Google Analytics inline)
- CDN dependencies MUST be minimized and justified
- Images MUST be optimized and use appropriate formats (WebP with fallbacks)
- CSS MUST be pre-compiled; no runtime CSS compilation in production
- Third-party scripts MUST be evaluated for performance impact before inclusion

**Rationale**: A personal portfolio is a first impression. Slow load times directly impact professional perception. Performance is a feature, not an optimization task.

### II. Progressive Enhancement

Core content MUST be accessible without JavaScript. Enhancement layers added progressively.

**Rules**:
- HTML content MUST render meaningful information without CSS or JavaScript
- JavaScript MUST enhance, not enable, core functionality
- No-JS users MUST see complete portfolio content (projects, skills, certifications)
- Critical rendering path MUST not depend on external resources

**Rationale**: Ensures accessibility, SEO effectiveness, and resilience against script failures or slow networks.

### III. Static-First Architecture

Site MUST remain deployable as static files. No server-side processing required for core functionality.

**Rules**:
- All dynamic content MUST be client-side rendered or build-time generated
- Data sources MUST be JSON files or inline JavaScript data structures
- No backend services required for initial load or navigation
- Analytics and tracking MUST be optional enhancements, not dependencies

**Rationale**: Static sites are faster, more secure, cheaper to host, and easier to maintain. Complexity must be justified.

### IV. Accessibility & Standards

Site MUST meet WCAG 2.1 Level AA standards and follow web best practices.

**Rules**:
- Semantic HTML MUST be used correctly (`<header>`, `<nav>`, `<main>`, `<section>`, etc.)
- All images MUST have meaningful `alt` attributes
- Color contrast MUST meet AA standards (4.5:1 for normal text, 3:1 for large text)
- Keyboard navigation MUST work for all interactive elements
- `aria-*` attributes MUST be used where semantic HTML is insufficient
- Valid HTML5 structure MUST be maintained

**Rationale**: A portfolio showcasing technical skills must demonstrate commitment to web standards and inclusivity.

### V. Measurement & Optimization

Changes MUST be measured against baseline metrics. Optimization decisions MUST be data-driven.

**Rules**:
- Chrome DevTools Lighthouse audits MUST be run before and after changes
- Performance budgets: FCP < 1.5s, LCP < 2.5s, CLS < 0.1, TBT < 200ms
- File size budgets: Total JS < 150KB, Total CSS < 50KB (gzipped)
- Network waterfall traces MUST be analyzed for blocking resources
- User analytics (Umami) MUST inform UX decisions

**Rationale**: "Premature optimization is the root of all evil" but so is unmonitored degradation. Metrics provide objective quality gates.

## Technology Standards

**Allowed Technologies**:
- HTML5, CSS3, vanilla JavaScript (ES6+)
- Tailwind CSS (pre-compiled via CLI, NOT CDN)
- Font Awesome (subset or SVG icons, NOT full kit CDN)
- Google Analytics / Umami (async loaded)
- Static site generators (if build complexity is justified)

**Prohibited in Production**:
- Runtime CSS frameworks (Tailwind CDN, Bootstrap CDN in JIT mode)
- Full icon font CDN loading (Font Awesome kit without subsetting)
- jQuery or legacy libraries (use vanilla JS)
- Unused dependencies or "just in case" libraries

**Dependency Addition Process**:
1. Justify: Why is this dependency necessary?
2. Measure: What is the performance cost? (file size, parse time, render blocking)
3. Alternative: Can this be achieved with less/no code?
4. Document: Add rationale to PERFORMANCE-RECOMMENDATIONS.md

## Development Workflow

**Feature Development**:
1. Specification in `/specs/[###-feature-name]/spec.md` defines user stories
2. Implementation plan in `/specs/[###-feature-name]/plan.md` includes performance checks
3. Changes implemented with performance budgets in mind
4. Pre-deployment: Lighthouse audit (scores must not regress)
5. Post-deployment: Monitor analytics for user impact

**Performance Gates**:
- ❌ BLOCK: Any change that reduces Lighthouse Performance score by >5 points
- ⚠️ WARN: Any change that increases Total Blocking Time by >50ms
- ✅ PASS: Changes that improve metrics or maintain within ±2% variance

**Code Review Checklist**:
- [ ] Constitution principles verified
- [ ] Performance budget respected
- [ ] Accessibility standards maintained
- [ ] No unnecessary dependencies added
- [ ] Browser compatibility tested (Chrome, Firefox, Safari, Edge)

## Governance

This constitution supersedes all other development practices. Any deviation MUST be documented with justification.

**Amendment Process**:
1. Propose change in constitution file with rationale
2. Document impact on existing features
3. Update version number using semantic versioning:
   - MAJOR: Backward-incompatible principle changes
   - MINOR: New principles or sections added
   - PATCH: Clarifications, wording improvements
4. Propagate changes to dependent templates and documentation

**Compliance Review**:
- All feature specifications MUST include "Constitution Check" section
- Implementation plans MUST verify compliance before Phase 0
- Performance recommendations MUST be tracked in PERFORMANCE-RECOMMENDATIONS.md

**Living Document**:
- Constitution evolves as project needs change
- Amendments MUST be justified, not arbitrary
- Simplicity and maintainability remain paramount

**Version**: 1.0.0 | **Ratified**: 2026-01-26 | **Last Amended**: 2026-01-26
