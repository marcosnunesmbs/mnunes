const fs = require('fs');
const path = require('path');

// Carregar traces
const beforePath = 'Trace-20260126T101209/Trace-20260126T101209.json';
const afterPath = 'Trace-20260126T122613/Trace-20260126T122613.json';

console.log('Carregando traces...');
const before = JSON.parse(fs.readFileSync(beforePath, 'utf8'));
const after = JSON.parse(fs.readFileSync(afterPath, 'utf8'));

// Função para converter microsegundos para milissegundos
const usToMs = (us) => (us / 1000).toFixed(2);

// Extrair métricas básicas
const beforeRange = before.metadata.modifications.initialBreadcrumb.window.range;
const afterRange = after.metadata.modifications.initialBreadcrumb.window.range;

console.log('\n=== MÉTRICAS BÁSICAS ===');
console.log(`ANTES - Duração Total: ${usToMs(beforeRange)} ms`);
console.log(`DEPOIS - Duração Total: ${usToMs(afterRange)} ms`);
console.log(`Melhoria: ${((beforeRange - afterRange) / beforeRange * 100).toFixed(2)}%`);

// Função para encontrar eventos por nome
function findEvents(trace, eventName) {
    return trace.traceEvents.filter(e => e.name === eventName);
}

// Função para encontrar métricas de Web Vitals
function findWebVitals(trace) {
    const fcpEvents = findEvents(trace, 'firstContentfulPaint');
    const lcpEvents = trace.traceEvents.filter(e => e.name && e.name.includes('largestContentfulPaint'));
    const clsEvents = findEvents(trace, 'LayoutShift');
    
    return {
        fcp: fcpEvents.length > 0 ? fcpEvents[0] : null,
        lcp: lcpEvents.length > 0 ? lcpEvents[0] : null,
        layoutShifts: clsEvents.length
    };
}

console.log('\n=== ANÁLISE DE EVENTOS ===');
const beforeVitals = findWebVitals(before);
const afterVitals = findWebVitals(after);

console.log(`\nBEFORE - Total de eventos: ${before.traceEvents.length}`);
console.log(`AFTER - Total de eventos: ${after.traceEvents.length}`);
console.log(`Redução de eventos: ${((before.traceEvents.length - after.traceEvents.length) / before.traceEvents.length * 100).toFixed(2)}%`);

// Analisar recursos carregados
const beforeResources = before.metadata.resources || [];
const afterResources = after.metadata.resources || [];

console.log(`\n=== RECURSOS CARREGADOS ===`);
console.log(`BEFORE - Total de recursos: ${beforeResources.length}`);
console.log(`AFTER - Total de recursos: ${afterResources.length}`);

// Calcular tamanho total dos recursos
let beforeTotalSize = 0;
let afterTotalSize = 0;

beforeResources.forEach(r => {
    if (r.content) beforeTotalSize += r.content.length;
});

afterResources.forEach(r => {
    if (r.content) afterTotalSize += r.content.length;
});

console.log(`BEFORE - Tamanho total de recursos: ${(beforeTotalSize / 1024).toFixed(2)} KB`);
console.log(`AFTER - Tamanho total de recursos: ${(afterTotalSize / 1024).toFixed(2)} KB`);
if (beforeTotalSize > 0) {
    console.log(`Redução de tamanho: ${((beforeTotalSize - afterTotalSize) / beforeTotalSize * 100).toFixed(2)}%`);
}

// Analisar tamanho dos arquivos JSON
const beforeFileSize = fs.statSync(beforePath).size;
const afterFileSize = fs.statSync(afterPath).size;

console.log(`\n=== TAMANHO DOS ARQUIVOS TRACE ===`);
console.log(`BEFORE: ${(beforeFileSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`AFTER: ${(afterFileSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Redução: ${((beforeFileSize - afterFileSize) / beforeFileSize * 100).toFixed(2)}%`);

// Exportar dados para JSON
const analysis = {
    duration: {
        before: beforeRange,
        after: afterRange,
        beforeMs: parseFloat(usToMs(beforeRange)),
        afterMs: parseFloat(usToMs(afterRange)),
        improvement: parseFloat(((beforeRange - afterRange) / beforeRange * 100).toFixed(2))
    },
    events: {
        before: before.traceEvents.length,
        after: after.traceEvents.length,
        reduction: parseFloat(((before.traceEvents.length - after.traceEvents.length) / before.traceEvents.length * 100).toFixed(2))
    },
    resources: {
        before: beforeResources.length,
        after: afterResources.length,
        beforeSizeKB: parseFloat((beforeTotalSize / 1024).toFixed(2)),
        afterSizeKB: parseFloat((afterTotalSize / 1024).toFixed(2)),
        sizeReduction: beforeTotalSize > 0 ? parseFloat(((beforeTotalSize - afterTotalSize) / beforeTotalSize * 100).toFixed(2)) : 0
    },
    fileSize: {
        beforeMB: parseFloat((beforeFileSize / 1024 / 1024).toFixed(2)),
        afterMB: parseFloat((afterFileSize / 1024 / 1024).toFixed(2)),
        reduction: parseFloat(((beforeFileSize - afterFileSize) / beforeFileSize * 100).toFixed(2))
    },
    timestamps: {
        before: before.metadata.startTime,
        after: after.metadata.startTime
    }
};

fs.writeFileSync('analysis-data.json', JSON.stringify(analysis, null, 2));
console.log('\n✓ Análise salva em analysis-data.json');
