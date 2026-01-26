# 🚀 Quick Reference: /analyze-traces

## Command
```
/analyze-traces
```

## Input Required
📎 **2 Chrome DevTools Performance Trace files (.json)**
1. BEFORE trace (baseline)
2. AFTER trace (optimized)

## What It Does

```
┌─────────────────────────────────────────┐
│  1. Validates traces                    │
│  2. Extracts metrics                    │
│  3. Calculates improvements             │
│  4. Generates 5 detailed reports        │
│  5. Creates analysis script             │
│  6. Provides recommendations            │
└─────────────────────────────────────────┘
```

## Output

```
Traces/
├── Reports/
│   ├── 📄 performance-analysis-report.md  (~40 pages)
│   ├── 📊 executive-summary.md            (2-3 pages)
│   ├── 🎨 visual-dashboard.md             (6-7 pages)
│   ├── 📁 metrics-data.csv                (Excel ready)
│   └── 📖 README.md                       (Index)
├── 🔬 analyze-traces.js
├── 💾 analysis-data.json
└── 📚 README.md
```

## Metrics Analyzed

| Category | Metrics |
|----------|---------|
| ⚡ **Speed** | Loading time (ms) |
| 📊 **Complexity** | Browser events count |
| 💾 **Size** | Trace file size (MB) |
| 📦 **Resources** | Inline resources (KB) |
| 🎯 **Web Vitals** | FCP, LCP, TBT, CLS (est.) |
| 💰 **Business** | ROI, bounce rate impact |

## Report Types

### 1️⃣ Performance Analysis Report
- **For:** Developers, Architects
- **Pages:** ~40
- **Contains:** 
  - Detailed technical analysis
  - Mermaid diagrams
  - Before/after comparisons
  - Optimization breakdown
  - ROI calculations
  - Next steps

### 2️⃣ Executive Summary
- **For:** Stakeholders, Managers
- **Pages:** 2-3
- **Contains:**
  - Key metrics
  - Business impact
  - ROI summary
  - Recommendations
  - Approval decision

### 3️⃣ Visual Dashboard
- **For:** Everyone
- **Pages:** 6-7
- **Contains:**
  - ASCII charts
  - Progress bars
  - Heatmaps
  - Scorecards
  - Visual comparisons

### 4️⃣ Metrics CSV
- **For:** Data analysis
- **Format:** CSV
- **Contains:**
  - All metrics in tabular format
  - Importable to Excel/Sheets
  - Multiple data sections

### 5️⃣ README Index
- **For:** Navigation
- **Pages:** 1-2
- **Contains:**
  - File descriptions
  - Quick start guide
  - Links to all reports

## Usage Example

```bash
# User types:
/analyze-traces

# User attaches:
- trace-before-2026-01-26.json
- trace-after-2026-01-26.json

# Copilot responds:
✅ Received 2 trace files. Analyzing...

BEFORE: trace-before-2026-01-26.json 
  └─ Captured: 2026-01-26 10:12:09 UTC
  └─ Size: 10.46 MB
  └─ Events: 47,974

AFTER: trace-after-2026-01-26.json
  └─ Captured: 2026-01-26 12:26:13 UTC  
  └─ Size: 6.12 MB
  └─ Events: 32,152

📊 Analysis complete!

Key Results:
├─ ⚡ Loading time: -23.26% faster
├─ 📊 Events: -32.98% reduction  
├─ 💾 File size: -41.43% smaller
└─ 🎯 All Web Vitals: ✅ Good

Generated 5 reports in Traces/Reports/
```

## Typical Results Format

```
┌──────────────────────────────────────────────┐
│           RESULTS SUMMARY                    │
├──────────────────────────────────────────────┤
│ Metric              Before  →  After  Change │
├──────────────────────────────────────────────┤
│ Loading Time        8531ms  →  6546ms -23.3% │
│ Browser Events      47,974  →  32,152 -33.0% │
│ Trace Size          10.5MB  →   6.1MB -41.4% │
│ Inline Resources    10.2KB  →   0.0KB  -100% │
└──────────────────────────────────────────────┘
```

## Customization Options

You can optionally specify:
```
/analyze-traces
  --project-name "My Project"
  --focus "loading-time"
  --output-path "custom/path"
```

## Prerequisites

- ✅ Node.js installed (for running analysis script)
- ✅ Chrome DevTools Performance traces in .json format
- ✅ Both traces from the same page/site

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Invalid JSON | Ensure traces are exported from Chrome DevTools Performance panel |
| Missing metrics | Some traces may lack certain metadata - will be marked as N/A |
| File too large | Traces over 50MB may take longer to process |
| Can't determine order | Manually specify which is BEFORE/AFTER |

## What Gets Calculated

### Automatic
- Duration comparison
- Event count reduction
- File size reduction
- Resource optimization

### Estimated
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- TBT (Total Blocking Time)
- CLS (Cumulative Layout Shift)
- ROI and business impact

## Next Steps After Analysis

1. ✅ Review generated reports
2. 📊 Share executive summary with stakeholders
3. 🎯 Prioritize recommended optimizations
4. 🔄 Implement next round of improvements
5. 📈 Run `/analyze-traces` again to measure new improvements

## Related Commands

- `/speckit.specify` - Create feature spec
- `/speckit.plan` - Plan implementation
- `/speckit.tasks` - Break down into tasks

---

**Quick Tip:** Run `/analyze-traces` after every optimization cycle to track continuous improvement! 📊

**Documentation:** [analyze-traces.prompt.md](analyze-traces.prompt.md)

**Version:** 1.0 | **Last Updated:** 2026-01-26
