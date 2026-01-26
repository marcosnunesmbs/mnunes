# Tasks: Website Performance Optimization

**Input**: Design documents from `/specs/001-performance-optimization/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not explicitly requested in specification. Performance validation will be done via Lighthouse/PageSpeed Insights as documented in contracts/performance-targets.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing. Each user story delivers measurable performance improvements that can be validated independently.

## Format: `- [x] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Project Infrastructure)

**Purpose**: Initialize build tooling and project dependencies

- [x] T001 Initialize npm project with package.json in project root
- [x] T002 [P] Install esbuild as dev dependency (npm install --save-dev esbuild)
- [x] T003 [P] Install tailwindcss as dev dependency (npm install --save-dev tailwindcss)
- [x] T004 Create tailwind.config.js in project root with custom theme colors
- [x] T005 Create assets/css/input.css with Tailwind directives
- [x] T006 [P] Add build scripts to package.json (build:css, build:js, build)
- [x] T007 [P] Add watch scripts to package.json for development (watch:css, watch:js)

**Validation**: Run `npm run build` successfully, verify assets/css/output.css and assets/js/bundle.min.js are generated

---

## Phase 2: Foundational (Shared Optimizations)

**Purpose**: Core HTML and infrastructure changes that ALL user stories depend on

**⚠️ CRITICAL**: These changes establish the foundation for all performance improvements

- [x] T008 Remove Google Analytics script tags from index.html (lines ~6-13)
- [x] T009 Remove Google Tag Manager script tags from index.html (lines ~51-59, ~65-67)
- [x] T010 Remove Tailwind CDN script from index.html (line ~30)
- [x] T011 Remove Tailwind config inline script from index.html (lines ~31-43)
- [x] T012 Add resource hints to index.html <head> (preconnect, dns-prefetch, preload)
- [x] T013 Link compiled Tailwind CSS in index.html (<link rel="stylesheet" href="./assets/css/output.css">)
- [x] T014 Update stats.mnunes.xyz script tag with defer attribute in index.html

**Checkpoint**: Foundation ready - HTML has no render-blocking CDN scripts, uses compiled CSS

---

## Phase 3: User Story 1 - Fast Initial Page Load (Priority: P1) 🎯 MVP

**Goal**: Achieve FCP ≤ 0.8s by eliminating render-blocking resources and optimizing critical path

**Independent Test**: Open site in incognito mode, run Lighthouse, verify FCP ≤ 800ms on desktop 4G simulation

### Implementation for User Story 1

- [x] T015 [P] [US1] Add defer attribute to bundle.min.js script tag in index.html
- [x] T016 [P] [US1] Add defer attribute to stats.mnunes.xyz script tag in index.html  
- [x] T017 [P] [US1] Build minified CSS with Tailwind CLI (npm run build:css)
- [x] T018 [P] [US1] Bundle JavaScript files with esbuild (npm run build:js)
- [x] T019 [US1] Run Lighthouse desktop test and verify FCP ≤ 800ms
- [x] T020 [US1] Run Lighthouse mobile test and verify FCP ≤ 1200ms on 3G
- [x] T021 [US1] Document baseline vs results in contracts/performance-results.md

**Checkpoint**: FCP improved by 60%, text content visible within 0.8s, no render-blocking JS

---

## Phase 4: User Story 2 - Responsive Interaction (Priority: P1)

**Goal**: Achieve TBT ≤ 100ms by reducing JavaScript overhead and deferring execution

**Independent Test**: Run Lighthouse, verify TBT ≤ 100ms, manually test scrolling and clicks feel instant

### Implementation for User Story 2

- [x] T022 [US2] Verify all JavaScript uses defer attribute in index.html (prevents main thread blocking)
- [x] T023 [US2] Remove Font Awesome Kit script tag from index.html (line ~29, eliminates 70KB JS)
- [x] T024 [US2] Test JavaScript bundle size is ≤ 25KB (run: ls -lh assets/js/bundle.min.js)
- [x] T025 [US2] Run Lighthouse and verify TBT ≤ 100ms on mobile simulation
- [x] T026 [US2] Manual test: scroll page, click navigation, verify no lag or frozen UI
- [x] T027 [US2] Document TBT improvement in contracts/performance-results.md

**Checkpoint**: TBT reduced by 75%, all interactions respond within 100ms

---

## Phase 5: User Story 3 - Stable Visual Experience (Priority: P2)

**Goal**: Achieve CLS ≤ 0.05 by adding explicit image dimensions and preventing layout shifts

**Independent Test**: Run Lighthouse, verify CLS ≤ 0.05, visually confirm no content jumps during load

### Implementation for User Story 3

- [x] T028 [P] [US3] Add width="192" height="192" to profile image in index.html (line ~81)
- [x] T029 [P] [US3] Add loading="eager" fetchpriority="high" to profile image in index.html
- [x] T030 [P] [US3] Update GitHub avatar URL with size parameter (?s=192) in index.html
- [x] T031 [P] [US3] Add width/height attributes to all certification badge images in certifications.js
- [x] T032 [P] [US3] Add width/height attributes to all skill icons in skills.js  
- [x] T033 [P] [US3] Add width/height attributes to all project logo images in projects.js
- [x] T034 [P] [US3] Add width/height to header logo image in index.html (line ~73)
- [x] T035 [P] [US3] Add width/height to footer logo image in index.html (line ~143)
- [x] T036 [US3] Run Lighthouse and verify CLS ≤ 0.05
- [x] T037 [US3] Visual test with network throttling: confirm no layout jumps
- [x] T038 [US3] Document CLS improvement in contracts/performance-results.md

**Checkpoint**: CLS below 0.05, stable layout during load, no visual jumps

---

## Phase 6: User Story 4 - Optimized Resource Loading (Priority: P2)

**Goal**: Implement resource hints and lazy loading to optimize resource fetch timing

**Independent Test**: Inspect Network waterfall in DevTools, verify preconnect saves ~200ms, lazy images load only when scrolled

### Implementation for User Story 4

- [x] T039 [P] [US4] Add <link rel="preconnect" href="https://avatars.githubusercontent.com" crossorigin> to index.html
- [x] T040 [P] [US4] Add <link rel="dns-prefetch" href="https://stats.mnunes.xyz"> to index.html
- [x] T041 [P] [US4] Add <link rel="preload" as="style" href="./assets/css/output.css"> to index.html
- [x] T042 [P] [US4] Add <link rel="preload" as="script" href="./assets/js/bundle.min.js"> to index.html
- [x] T043 [P] [US4] Add loading="lazy" to certification badge images in certifications.js
- [x] T044 [P] [US4] Add loading="lazy" to project logo images in projects.js
- [x] T045 [US4] Test in DevTools Network tab: verify preconnect appears before image request
- [x] T046 [US4] Test lazy loading: scroll page, verify images load only when entering viewport
- [x] T047 [US4] Verify no render-blocking JavaScript in Performance panel
- [x] T048 [US4] Document resource loading improvements in contracts/performance-results.md

**Checkpoint**: Resource hints reduce connection time, lazy loading saves ~100KB on initial load

---

## Phase 7: User Story 5 - Minimal JavaScript Overhead (Priority: P3)

**Goal**: Reduce JavaScript payload by 100KB+ through CDN removal and icon optimization

**Independent Test**: Compare bundle sizes before/after, verify ≥100KB reduction, functionality intact

### Implementation for User Story 5

- [x] T049 [P] [US5] Replace fa-terminal icon with inline SVG in index.html (3 occurrences)
- [x] T050 [P] [US5] Replace fa-blog icon with inline SVG in index.html
- [x] T051 [P] [US5] Replace fa-github icon with inline SVG in index.html
- [x] T052 [P] [US5] Replace fa-linkedin icon with inline SVG in index.html
- [x] T053 [P] [US5] Replace fa-certificate icon with inline SVG in index.html
- [x] T054 [P] [US5] Replace fa-envelope icon with inline SVG in index.html
- [x] T055 [P] [US5] Replace fa-bookmark icon with inline SVG in index.html
- [x] T056 [US5] Verify all Font Awesome classes removed from HTML and JavaScript
- [x] T057 [US5] Test icon rendering: all 7 icons display correctly with proper colors
- [x] T058 [US5] Measure total JavaScript size: verify ≤ 52KB (baseline was 197KB)
- [x] T059 [US5] Run functionality tests: verify projects/skills/certifications still load
- [x] T060 [US5] Document JavaScript reduction in contracts/performance-results.md

**Checkpoint**: JavaScript reduced by ≥100KB, all functionality works, icons display correctly

---

## Phase 8: User Story 6 - Efficient Repeat Visits (Priority: P3)

**Goal**: Configure caching headers for 1-year static assets, 1-hour HTML

**Independent Test**: Use curl -I to verify Cache-Control headers, test repeat visit loads from cache in <0.5s

### Implementation for User Story 6

- [x] T061 [US6] Create or update nginx configuration file with cache headers (see quickstart.md)
- [x] T062 [US6] Add static asset cache rule: max-age=31536000 for .css, .js, .png, .jpg, .svg, .webp
- [x] T063 [US6] Add HTML cache rule: max-age=3600 for .html files
- [x] T064 [US6] Enable gzip compression for text/css, application/javascript, text/html
- [x] T065 [US6] Test nginx config syntax (sudo nginx -t)
- [x] T066 [US6] Reload nginx configuration (sudo systemctl reload nginx)
- [x] T067 [US6] Verify CSS cache header: curl -I https://mnunes.xyz/assets/css/output.css
- [x] T068 [US6] Verify JS cache header: curl -I https://mnunes.xyz/assets/js/bundle.min.js
- [x] T069 [US6] Verify HTML cache header: curl -I https://mnunes.xyz/
- [x] T070 [US6] Verify gzip compression: curl -H "Accept-Encoding: gzip" -I https://mnunes.xyz/assets/css/output.css
- [x] T071 [US6] Test repeat visit: load page, refresh, verify cache hits in DevTools Network tab
- [x] T072 [US6] Document caching improvements in contracts/performance-results.md

**Checkpoint**: Caching configured, returning visitors load in <0.5s, bandwidth reduced 80%+ for repeats

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validations and documentation across all user stories

- [x] T073 [P] Run final Lighthouse audit on desktop (target: score ≥ 90)
- [x] T074 [P] Run final Lighthouse audit on mobile (target: score ≥ 90)
- [x] T075 [P] Run PageSpeed Insights and verify score ≥ 90
- [x] T076 [P] Complete contracts/performance-results.md with all metrics
- [x] T077 [P] Verify all acceptance criteria met in contracts/performance-targets.md
- [x] T078 [P] Test edge case: JavaScript disabled (content still readable)
- [x] T079 [P] Test edge case: 2G connection (content accessible in <3s)
- [x] T080 [P] Test edge case: GitHub CDN blocked (page degrades gracefully)
- [x] T081 [P] Test edge case: Analytics blocked by ad blocker (no errors)
- [x] T082 Update README.md with build instructions and performance achievements
- [x] T083 Add .gitignore entries for node_modules, assets/css/output.css, assets/js/bundle.min.js
- [x] T084 Validate all quickstart.md instructions are accurate
- [x] T085 Create deployment checklist from quickstart.md
- [x] T086 Document any deviations from plan.md

**Validation**: All Core Web Vitals meet targets, PageSpeed ≥90, all edge cases handled

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately  
  - Duration: ~30 minutes
  
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories  
  - Duration: ~1 hour
  - **CRITICAL GATE**: Must complete before any user story work
  
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion  
  - Can proceed sequentially in priority order (P1 → P2 → P3)
  - Or in parallel if multiple developers available
  
- **Polish (Phase 9)**: Depends on all desired user stories being complete  
  - Duration: ~2 hours

### User Story Dependencies

- **US1 - Fast Initial Page Load (P1)**: Depends on Phase 2 only - **INDEPENDENT**, can be MVP  
  - Duration: ~1 hour
  - Delivers: FCP ≤ 0.8s
  
- **US2 - Responsive Interaction (P1)**: Depends on Phase 2 only - **INDEPENDENT**  
  - Duration: ~45 minutes  
  - Delivers: TBT ≤ 100ms
  
- **US3 - Stable Visual Experience (P2)**: Depends on Phase 2 only - **INDEPENDENT**  
  - Duration: ~1.5 hours
  - Delivers: CLS ≤ 0.05
  
- **US4 - Optimized Resource Loading (P2)**: Depends on Phase 2 only - **INDEPENDENT**  
  - Duration: ~1 hour
  - Delivers: Resource hints, lazy loading
  
- **US5 - Minimal JavaScript Overhead (P3)**: Depends on Phase 2 only - **INDEPENDENT**  
  - Duration: ~2 hours (7 icon replacements)
  - Delivers: 100KB+ JS reduction
  
- **US6 - Efficient Repeat Visits (P3)**: Depends on Phase 2 + server access - **INDEPENDENT**  
  - Duration: ~1 hour
  - Delivers: Proper caching

### Within Each User Story

**User Story 1 (Fast Initial Page Load)**:
- T015-T016 (defer attributes) → T017-T018 (build assets) → T019-T021 (validation)

**User Story 2 (Responsive Interaction)**:
- T022 (verify defer) → T023 (remove Font Awesome CDN) → T024-T027 (validation)

**User Story 3 (Stable Visual Experience)**:
- T028-T035 (add dimensions) can all run in parallel → T036-T038 (validation)

**User Story 4 (Optimized Resource Loading)**:
- T039-T044 (add hints/lazy) can all run in parallel → T045-T048 (validation)

**User Story 5 (Minimal JavaScript Overhead)**:
- T049-T055 (replace icons) can all run in parallel → T056-T060 (validation)

**User Story 6 (Efficient Repeat Visits)**:
- T061-T064 (config) sequential → T065-T066 (apply) → T067-T072 (validation)

### Parallel Opportunities

**Within Setup (Phase 1)**:
- T002-T003 (install deps) in parallel
- T006-T007 (add scripts) in parallel

**Within Foundational (Phase 2)**:
- T008-T011 (remove scripts) in parallel
- No other parallelism (HTML modifications)

**Within User Story 3**:
- All T028-T035 (8 tasks) can run in parallel - different files

**Within User Story 4**:
- All T039-T044 (6 tasks) can run in parallel - different locations

**Within User Story 5**:
- All T049-T055 (7 tasks) can run in parallel - different icon replacements

**Cross-Story Parallelism**:
- After Phase 2 completes, ALL user stories (US1-US6) can start in parallel
- Different team members can own different stories
- Example: Developer A (US1+US2), Developer B (US3+US4), Developer C (US5+US6)

---

## Parallel Example: User Story 3

```bash
# Launch all dimension additions in parallel (different files/locations):
- Task T028: Add width/height to profile image (index.html line 81)
- Task T029: Add loading/priority to profile image (index.html line 81)
- Task T030: Add size param to avatar URL (index.html line 81)
- Task T031: Add dimensions to badge images (certifications.js)
- Task T032: Add dimensions to skill icons (skills.js)
- Task T033: Add dimensions to project logos (projects.js)
- Task T034: Add dimensions to header logo (index.html line 73)
- Task T035: Add dimensions to footer logo (index.html line 143)

# Then run validation sequentially:
- Task T036: Lighthouse CLS check
- Task T037: Visual throttling test
- Task T038: Document results
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only - Both P1)

**Fastest path to measurable improvement**:

1. ✅ Complete Phase 1: Setup (~30 min)
2. ✅ Complete Phase 2: Foundational (~1 hour) - **GATE**
3. ✅ Complete Phase 3: User Story 1 (~1 hour) → FCP ≤ 0.8s
4. ✅ Complete Phase 4: User Story 2 (~45 min) → TBT ≤ 100ms
5. **STOP and VALIDATE**: Run Lighthouse, verify P1 metrics met
6. **Deploy MVP**: Already achieving 60% FCP and 75% TBT improvements

**MVP Delivers**:
- FCP: 1.5s → 0.8s ✅
- TBT: 340ms → 100ms ✅
- PageSpeed likely 75-80 (not yet 90+, but significant improvement)

**Total Time**: ~4 hours for high-impact MVP

---

### Incremental Delivery (Recommended)

**Build on MVP progressively**:

1. **Foundation** (Phases 1-2): Setup + remove CDNs → ~1.5 hours
2. **MVP** (Phases 3-4): US1 + US2 → FCP + TBT goals → ~1.75 hours  
   - **Checkpoint**: Test independently, deploy if ready
3. **Visual Polish** (Phase 5): US3 → CLS goal → ~1.5 hours  
   - **Checkpoint**: All Core Web Vitals met
4. **Resource Optimization** (Phase 6): US4 → Loading strategy → ~1 hour  
   - **Checkpoint**: Network efficiency improved
5. **Size Reduction** (Phase 7): US5 → JS reduction → ~2 hours  
   - **Checkpoint**: Payload budget met
6. **Caching** (Phase 8): US6 → Repeat visit speed → ~1 hour  
   - **Checkpoint**: All stories complete
7. **Polish** (Phase 9): Final validation → ~2 hours  
   - **Final**: Deploy to production

**Each story adds value without breaking previous stories**

**Total Time**: ~10.75 hours spread across multiple sessions

---

### Parallel Team Strategy

**With 2-3 developers**:

1. **Together**: Complete Setup + Foundational (Phases 1-2) → ~1.5 hours
2. **Split after Phase 2**:
   - **Developer A**: US1 + US2 (P1 priorities) → ~1.75 hours
   - **Developer B**: US3 + US4 (P2 priorities) → ~2.5 hours
   - **Developer C**: US5 + US6 (P3 priorities) → ~3 hours
3. **Together**: Phase 9 (Polish) → ~2 hours

**Parallel Time**: ~7 hours total (vs 10.75 hours sequential)

---

## Success Criteria Validation

After completing all phases, verify against [contracts/performance-targets.md](contracts/performance-targets.md):

### Core Web Vitals (MUST Pass)
- [x] FCP ≤ 0.8s desktop (US1) - Baseline: 1.5s → Target: 0.8s
- [x] LCP ≤ 1.5s desktop (US1+US3) - Baseline: 2.5s → Target: 1.5s
- [x] TBT ≤ 100ms mobile (US2) - Baseline: 340ms → Target: 100ms
- [x] CLS ≤ 0.05 (US3) - Baseline: 0.12 → Target: 0.05

### Resource Budgets (MUST Pass)
- [x] Total JS ≤ 52KB (US5) - Baseline: 197KB → Target: 52KB
- [x] HTTP Requests ≤ 6 (US1+US2+US5) - Baseline: 12 → Target: 6
- [x] PageSpeed Score ≥ 90 desktop (All stories)
- [x] PageSpeed Score ≥ 90 mobile (All stories)

### Functional Requirements (All MUST Pass)
- [x] FR-001: Text visible ≤ 0.8s (US1)
- [x] FR-002: Zero render-blocking JS (US1)
- [x] FR-003: All images have dimensions (US3)
- [x] FR-004: DNS prefetch implemented (US4)
- [x] FR-005: Lazy loading below fold (US4)
- [x] FR-006: Tailwind pre-compiled (US1)
- [x] FR-007: Font Awesome optimized (US5)
- [x] FR-008: Analytics consolidated (Foundational)
- [x] FR-009: JS bundled (US1)
- [x] FR-010: Images optimized (US3)
- [x] FR-011: Preconnect hints (US4)
- [x] FR-012: Cache headers (US6)
- [x] FR-013: Compression enabled (US6)
- [x] FR-014: TBT ≤ 100ms (US2)
- [x] FR-015: CLS ≤ 0.05 (US3)

### Edge Cases (SHOULD Pass)
- [x] JavaScript disabled: Content readable
- [x] 2G connection: Content accessible
- [x] CDN blocked: Graceful degradation
- [x] Ad blocker: No errors

---

## Notes

- **[P] markers**: 45 tasks can run in parallel (52% parallelizable)
- **[Story] labels**: Clear mapping to user stories for traceability
- **File paths**: Exact locations specified for each task
- **No tests**: Per spec, performance validation via Lighthouse/PageSpeed only
- **Independent stories**: Each US can be completed and tested standalone
- **Checkpoints**: Built-in validation after each user story
- **MVP-ready**: US1+US2 delivers significant value in ~4 hours

**Total Tasks**: 86 tasks  
**Estimated Sequential Time**: ~10.75 hours  
**Estimated Parallel Time**: ~7 hours (with 3 developers)
