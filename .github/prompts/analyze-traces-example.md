# Exemplo de Uso: /analyze-traces

Este documento mostra um exemplo completo de uso do comando `/analyze-traces`.

## Cenário

Você implementou otimizações de performance no seu site e quer medir o impacto.

## Passo 1: Capturar Trace ANTES

1. Abra o Chrome DevTools (F12)
2. Vá para a aba **Performance**
3. Clique em **Reload** (🔄) para gravar
4. Aguarde o carregamento completo
5. Clique em **Stop**
6. Clique no botão **Download** (⬇️)
7. Salve como `trace-before.json`

## Passo 2: Implementar Otimizações

Exemplo de otimizações que podem ser feitas:
- ✅ Compilar Tailwind CSS (remover CDN)
- ✅ Remover Font Awesome Kit (usar SVG inline)
- ✅ Bundle JavaScript com esbuild
- ✅ Adicionar resource hints
- ✅ Implementar lazy loading de imagens

## Passo 3: Capturar Trace DEPOIS

1. Repita o processo do Passo 1
2. Salve como `trace-after.json`

## Passo 4: Executar Análise

### No GitHub Copilot Chat

```
Você: /analyze-traces
```

**Anexar arquivos:**
- 📎 `trace-before.json`
- 📎 `trace-after.json`

### Resposta do Copilot

```
GitHub Copilot:

✅ Received 2 trace files. Analyzing...

═══════════════════════════════════════════════════════════
                    TRACE IDENTIFICATION
═══════════════════════════════════════════════════════════

BEFORE TRACE:
├─ File: trace-before.json
├─ Captured: 2026-01-26 13:12:09 UTC
├─ File Size: 10.46 MB
├─ Total Events: 47,974
└─ Duration: 8,530.64 ms

AFTER TRACE:
├─ File: trace-after.json
├─ Captured: 2026-01-26 15:26:13 UTC
├─ File Size: 6.12 MB
├─ Total Events: 32,152
└─ Duration: 6,546.34 ms

═══════════════════════════════════════════════════════════
                      CREATING STRUCTURE
═══════════════════════════════════════════════════════════

✓ Created Traces/Trace-20260126T131209/
✓ Created Traces/Trace-20260126T152613/
✓ Created Traces/Reports/
✓ Copied trace files to structure

═══════════════════════════════════════════════════════════
                    EXTRACTING METRICS
═══════════════════════════════════════════════════════════

✓ Analyzing duration metrics...
  BEFORE: 8,530.64 ms
  AFTER:  6,546.34 ms
  IMPROVEMENT: -1,984.30 ms (-23.26%)

✓ Analyzing browser events...
  BEFORE: 47,974 events
  AFTER:  32,152 events
  REDUCTION: -15,822 events (-32.98%)

✓ Analyzing trace file size...
  BEFORE: 10.46 MB
  AFTER:  6.12 MB
  REDUCTION: -4.34 MB (-41.43%)

✓ Analyzing inline resources...
  BEFORE: 2 resources (10.17 KB)
  AFTER:  0 resources (0.00 KB)
  REDUCTION: -10.17 KB (-100%)

═══════════════════════════════════════════════════════════
                    ESTIMATING WEB VITALS
═══════════════════════════════════════════════════════════

Based on duration and event improvements, estimating:

FCP (First Contentful Paint):
  BEFORE: ~2,500 ms
  AFTER:  ~1,200 ms (-52%)
  STATUS: ✅ Good (< 1,800 ms)

LCP (Largest Contentful Paint):
  BEFORE: ~3,200 ms
  AFTER:  ~1,800 ms (-43.75%)
  STATUS: ✅ Good (< 2,500 ms)

TBT (Total Blocking Time):
  BEFORE: ~350 ms
  AFTER:  ~150 ms (-57.14%)
  STATUS: ✅ Good (< 200 ms)

CLS (Cumulative Layout Shift):
  BEFORE: ~0.05
  AFTER:  ~0.02 (-60%)
  STATUS: ✅ Good (< 0.1)

═══════════════════════════════════════════════════════════
                    GENERATING REPORTS
═══════════════════════════════════════════════════════════

✓ Creating analyze-traces.js...
✓ Running analysis script...
✓ Generated analysis-data.json

✓ Creating performance-analysis-report.md... (40 pages)
  ├─ Executive summary
  ├─ Detailed metrics analysis
  ├─ Technical breakdown
  ├─ Web Vitals estimations
  ├─ Optimizations implemented
  ├─ ROI calculations
  ├─ Next steps recommendations
  └─ Mermaid diagrams

✓ Creating executive-summary.md... (3 pages)
  ├─ Key metrics
  ├─ Business impact
  ├─ ROI summary
  └─ Recommendations

✓ Creating visual-dashboard.md... (7 pages)
  ├─ ASCII charts
  ├─ Progress bars
  ├─ Heatmaps
  └─ Visual comparisons

✓ Creating metrics-data.csv...
  ├─ Comparison tables
  ├─ Web Vitals data
  ├─ Optimizations list
  └─ Next steps

✓ Creating README.md files...
  ├─ Traces/Reports/README.md
  └─ Traces/README.md

═══════════════════════════════════════════════════════════
                      ANALYSIS COMPLETE!
═══════════════════════════════════════════════════════════

📊 KEY RESULTS

┌────────────────────────────────────────────────────────┐
│ Metric              Before  →  After       Improvement │
├────────────────────────────────────────────────────────┤
│ Loading Time      8,531 ms → 6,546 ms      -23.26% ⚡ │
│ Browser Events      47,974 →  32,152       -32.98% 📊 │
│ Trace File Size   10.46 MB →  6.12 MB      -41.43% 💾 │
│ Inline Resources  10.17 KB →  0.00 KB        -100% 📦 │
└────────────────────────────────────────────────────────┘

🎯 WEB VITALS STATUS

ALL METRICS IN "GOOD" RANGE! ✅
├─ FCP:  1.2s  ✅ (target: < 1.8s)
├─ LCP:  1.8s  ✅ (target: < 2.5s)
├─ TBT:  150ms ✅ (target: < 200ms)
└─ CLS:  0.02  ✅ (target: < 0.1)

💼 BUSINESS IMPACT

├─ Page loads ~2 seconds faster
├─ Estimated bounce rate reduction: -15%
├─ Estimated conversion increase: +10-15%
└─ Better SEO ranking (Core Web Vitals pass)

📁 FILES GENERATED

Traces/
├── Trace-20260126T131209/
│   └── Trace-20260126T131209.json
├── Trace-20260126T152613/
│   └── Trace-20260126T152613.json
├── Reports/
│   ├── performance-analysis-report.md  ⭐ MAIN REPORT
│   ├── executive-summary.md            📊 STAKEHOLDERS
│   ├── visual-dashboard.md             🎨 VISUAL
│   ├── metrics-data.csv                📁 DATA
│   └── README.md                       📖 INDEX
├── analyze-traces.js                   🔬 SCRIPT
├── analysis-data.json                  💾 RAW DATA
└── README.md                           📚 GUIDE

🚀 NEXT STEPS

Curto Prazo (1-2 semanas):
├─ Image optimization (WebP/AVIF)
├─ Service Worker implementation
└─ Font subsetting

Médio Prazo (1-2 meses):
├─ CDN migration
├─ HTTP/2 Server Push
└─ Critical CSS inline

Longo Prazo (3+ meses):
├─ PWA implementation
├─ Performance monitoring (RUM)
└─ A/B testing framework

✅ RECOMMENDATION

APPROVE FOR PRODUCTION ✅

Justification:
├─ All metrics improved significantly
├─ No functionality degradation
├─ All Web Vitals in "Good" range
└─ Strong foundation for future optimizations

═══════════════════════════════════════════════════════════

View reports:
├─ Full analysis: Traces/Reports/performance-analysis-report.md
├─ Quick summary: Traces/Reports/executive-summary.md
└─ Visual charts: Traces/Reports/visual-dashboard.md

Would you like me to:
1. Open the main report?
2. Show specific metrics?
3. Explain any optimization?
4. Generate additional charts?
```

## Passo 5: Revisar Relatórios

### Relatório Principal
```bash
# Abrir no VS Code
code new-site/Traces/Reports/performance-analysis-report.md

# Ou ler no terminal
cat new-site/Traces/Reports/performance-analysis-report.md
```

### Resumo Executivo
```bash
cat new-site/Traces/Reports/executive-summary.md
```

### Dashboard Visual
```bash
cat new-site/Traces/Reports/visual-dashboard.md
```

### Dados em CSV
```bash
# Abrir no Excel
start new-site/Traces/Reports/metrics-data.csv

# Ou importar no Google Sheets
# File → Import → Upload → metrics-data.csv
```

## Passo 6: Compartilhar Resultados

### Para Stakeholders
Envie o **executive-summary.md** com os principais números e recomendação.

### Para Time Técnico
Compartilhe o **performance-analysis-report.md** com toda a análise detalhada.

### Para Apresentações
Use os gráficos do **visual-dashboard.md** em slides.

### Para Tracking
Importe o **metrics-data.csv** para planilhas de acompanhamento.

## Passo 7: Implementar Próximas Otimizações

Com base nas recomendações do relatório:

1. Priorize otimizações de curto prazo
2. Crie tasks no projeto
3. Implemente as melhorias
4. Capture novos traces
5. Execute `/analyze-traces` novamente
6. Compare com baseline anterior

## Exemplo de Iteração

```
Ciclo 1: Baseline → Build System
  /analyze-traces → -23% faster

Ciclo 2: Build System → Image Optimization
  /analyze-traces → -15% faster (total: -35%)

Ciclo 3: Image Opt → Service Worker
  /analyze-traces → -10% faster (total: -42%)
```

## Dicas

### ✅ DO
- Sempre desabilite cache ao capturar traces
- Use mesma máquina/rede para ambos traces
- Capture traces com página "limpa" (sem extensões interferindo)
- Aguarde carregamento completo antes de parar o trace
- Documente qual otimização foi feita entre os traces

### ❌ DON'T
- Não compare traces de páginas diferentes
- Não use throttling diferente entre traces
- Não capture com cache habilitado
- Não pare o trace antes do carregamento completo
- Não mistre condições de rede (WiFi vs Ethernet)

## Troubleshooting

### "Trace files are too similar"
```
Possível causa: Otimizações não surtiram efeito
Solução: Verifique se as mudanças foram aplicadas corretamente
```

### "Cannot determine which trace is BEFORE"
```
Possível causa: Timestamps muito próximos ou ausentes
Solução: Renomeie arquivos com sufixos -before e -after
```

### "Missing metadata in trace"
```
Possível causa: Trace foi exportado incorretamente
Solução: Re-exporte do Chrome DevTools Performance panel
```

## Recursos Adicionais

- 📖 [Prompt Completo](analyze-traces.prompt.md)
- 📋 [Quick Reference](analyze-traces-quickref.md)
- 🔗 [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- 🎯 [Web Vitals](https://web.dev/vitals/)

---

**Tip:** Mantenha um histórico de traces para acompanhar evolução contínua! 📈

**Última atualização:** 26 de Janeiro de 2026
