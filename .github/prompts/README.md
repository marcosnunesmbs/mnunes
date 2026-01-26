# GitHub Copilot Custom Prompts

Este diretório contém prompts customizados para o GitHub Copilot que automatizam tarefas específicas do projeto.

## 📋 Comandos Disponíveis

### SpecKit Commands (Feature Development Workflow)

| Comando | Arquivo | Descrição |
|---------|---------|-----------|
| `/speckit.specify` | [speckit.specify.prompt.md](speckit.specify.prompt.md) | Cria especificação de feature a partir de descrição |
| `/speckit.clarify` | [speckit.clarify.prompt.md](speckit.clarify.prompt.md) | Esclarece pontos da especificação |
| `/speckit.analyze` | [speckit.analyze.prompt.md](speckit.analyze.prompt.md) | Analisa especificação e sugere melhorias |
| `/speckit.checklist` | [speckit.checklist.prompt.md](speckit.checklist.prompt.md) | Gera checklists de validação |
| `/speckit.plan` | [speckit.plan.prompt.md](speckit.plan.prompt.md) | Cria plano de implementação |
| `/speckit.tasks` | [speckit.tasks.prompt.md](speckit.tasks.prompt.md) | Quebra plano em tarefas executáveis |
| `/speckit.implement` | [speckit.implement.prompt.md](speckit.implement.prompt.md) | Implementa tarefas específicas |
| `/speckit.taskstoissues` | [speckit.taskstoissues.prompt.md](speckit.taskstoissues.prompt.md) | Converte tarefas em issues do GitHub |
| `/speckit.constitution` | [speckit.constitution.prompt.md](speckit.constitution.prompt.md) | Define regras e convenções do projeto |

### Performance Analysis Commands

| Comando | Arquivo | Descrição |
|---------|---------|-----------|
| `/analyze-traces` | [analyze-traces.prompt.md](analyze-traces.prompt.md) | 🆕 Analisa Chrome DevTools Performance Traces e gera relatórios completos |

📋 **Quick Reference:** [analyze-traces-quickref.md](analyze-traces-quickref.md)  
📖 **Exemplo Completo:** [analyze-traces-example.md](analyze-traces-example.md)

## 🆕 Novo: Performance Trace Analysis

### `/analyze-traces`

Automatiza a análise de performance comparando dois Chrome DevTools Performance Traces (antes/depois de otimizações).

#### Uso

```
/analyze-traces
[Anexar 2 arquivos .json - trace ANTES e trace DEPOIS]
```

#### O que o comando faz:

1. ✅ **Valida** os traces recebidos
2. 📊 **Extrai métricas** (tempo de carregamento, eventos, recursos)
3. 📈 **Calcula melhorias** (percentuais e valores absolutos)
4. 📝 **Gera 5 relatórios**:
   - Relatório completo (~40 páginas)
   - Resumo executivo (2-3 páginas)
   - Dashboard visual (6-7 páginas)
   - CSV para Excel/Sheets
   - README de navegação
5. 🔬 **Cria script** de análise Node.js reutilizável
6. 💡 **Fornece recomendações** de próximas otimizações

#### Relatórios Gerados

```
new-site/Traces/
├── Trace-[BEFORE]/
│   └── trace.json
├── Trace-[AFTER]/
│   └── trace.json
├── Reports/
│   ├── performance-analysis-report.md  ⭐ Análise completa
│   ├── executive-summary.md            📊 Resumo executivo
│   ├── visual-dashboard.md             🎨 Dashboard visual
│   ├── metrics-data.csv                📁 Dados CSV
│   └── README.md                       📖 Índice
├── analyze-traces.js                   🔬 Script de análise
├── analysis-data.json                  💾 Dados brutos
└── README.md                           📚 Guia geral
```

#### Métricas Analisadas

- ⚡ **Tempo de Carregamento** (ms)
- 📊 **Total de Eventos** do navegador
- 💾 **Tamanho do Trace** (MB)
- 📦 **Recursos Inline** (KB)
- 🎯 **Web Vitals** (FCP, LCP, TBT, CLS) - estimados
- 📈 **ROI** e impacto no negócio

#### Exemplo de Saída

```
📊 Resultados Principais

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| ⚡ Tempo de Carregamento | 8.531 ms | 6.546 ms | -23,26% |
| 📊 Total de Eventos | 47.974 | 32.152 | -32,98% |
| 💾 Tamanho do Trace | 10,46 MB | 6,12 MB | -41,43% |
| 📦 Recursos Inline | 10,17 KB | 0 KB | -100% |
```

## 🔧 Como Usar os Prompts

### No GitHub Copilot Chat

1. Digite o comando (ex: `/analyze-traces`)
2. Siga as instruções do prompt
3. Forneça os dados necessários (arquivos, descrições, etc.)
4. Copilot executará o workflow completo

### Personalizações

Cada prompt pode aceitar parâmetros opcionais:
- Nome do projeto
- Título customizado
- Foco específico da análise
- Localização de output alternativa

## 📚 Documentação dos Prompts

Cada arquivo `.prompt.md` contém:
- ✅ **Command Trigger:** Como invocar o comando
- ✅ **Purpose:** O que o comando faz
- ✅ **Expected Input:** Dados necessários
- ✅ **Execution Steps:** Passo a passo detalhado
- ✅ **Output:** O que será gerado
- ✅ **Error Handling:** Como lidar com erros
- ✅ **Best Practices:** Recomendações de uso

## 🎯 Workflows Recomendados

### Desenvolvimento de Feature Nova

```
1. /speckit.specify "descrição da feature"
2. /speckit.clarify (se necessário)
3. /speckit.checklist
4. /speckit.plan
5. /speckit.tasks
6. /speckit.implement
7. /speckit.taskstoissues (opcional)
```

### Análise de Performance

```
1. Capturar trace ANTES (Chrome DevTools)
2. Implementar otimizações
3. Capturar trace DEPOIS
4. /analyze-traces [anexar ambos traces]
5. Revisar relatórios gerados
6. Implementar próximas recomendações
```

## 🔗 Referências

- [SpecKit Documentation](../../specs/README.md)
- [Performance Traces](../../new-site/Traces/README.md)
- [GitHub Copilot Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot)

## 📅 Histórico

| Data | Versão | Mudanças |
|------|--------|----------|
| 2026-01-26 | 1.1 | Adicionado comando `/analyze-traces` |
| 2024-XX-XX | 1.0 | Comandos SpecKit iniciais |

---

**Última atualização:** 26 de Janeiro de 2026
