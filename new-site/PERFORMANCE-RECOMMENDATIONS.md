# 🚀 Recomendações de Performance - mnunes.xyz

## Análise do Chrome DevTools Trace (26/01/2026)

### 📊 Métricas Atuais Identificadas
- **ParseHTML**: ~45ms (bloqueado por scripts)
- **EvaluateScript**: Múltiplos scripts causando delays
- **Scripts bloqueantes**: 8+ no `<head>`
- **Recursos externos**: 5+ CDNs diferentes

---

## 🔴 CRÍTICO - Implementar Imediatamente

### 1. Otimizar Carregamento de Scripts

**Problema Atual:**
```html
<!-- ❌ BLOQUEANTES -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-X4LN7HP4TV"></script>
<script src="https://kit.fontawesome.com/ea04606ce9.js" crossorigin="anonymous"></script>
<script src="https://cdn.tailwindcss.com"></script>
<script src="./assets/js/main.js"></script>
<script src="./assets/js/projects.js"></script>
<script src="./assets/js/skills.js"></script>
<script src="./assets/js/certifications.js"></script>
```

**Solução:**
```html
<!-- ✅ OTIMIZADO -->
<script defer src="https://kit.fontawesome.com/ea04606ce9.js" crossorigin="anonymous"></script>
<script defer src="./assets/js/main.js"></script>
<script defer src="./assets/js/projects.js"></script>
<script defer src="./assets/js/skills.js"></script>
<script defer src="./assets/js/certifications.js"></script>
```

**Ganho Estimado:** 40-60% melhoria no FCP (First Contentful Paint)

---

### 2. Substituir Tailwind CDN por Build Estático

**Problema Atual:**
```html
<!-- ❌ CDN JIT - Compila no browser -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
    tailwind.config = { ... }
</script>
```

**Solução - Opção A (Recomendada): Tailwind CLI**
```bash
# Instalar Tailwind
npm install -D tailwindcss
npx tailwindcss init

# Configurar tailwind.config.js
# Build CSS otimizado
npx tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css --minify
```

```html
<!-- ✅ CSS Pré-compilado -->
<link rel="stylesheet" href="./assets/css/output.css">
```

**Solução - Opção B (Mais Simples): Tailwind CDN Play + Preload**
```html
<!-- Se precisar usar CDN, ao menos faça preload -->
<link rel="preload" as="script" href="https://cdn.tailwindcss.com">
<script src="https://cdn.tailwindcss.com" defer></script>
```

**Ganho Estimado:** 70-80% redução no JavaScript inicial

---

### 3. Otimizar Font Awesome

**Problema:** Kit completo carrega ~1000+ ícones, você usa apenas 6-8

**Solução - Opção A: Self-hosted subset**
```bash
# Baixar apenas ícones usados
npm install @fortawesome/fontawesome-free
```

**Solução - Opção B: Usar SVG inline**
```html
<!-- Exemplo: GitHub Icon -->
<svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
</svg>
```

**Ganho Estimado:** 50-70KB menos de JavaScript

---

## 🟠 IMPORTANTE - Implementar em Seguida

### 4. Consolidar Tracking/Analytics

**Problema Atual:** 3 ferramentas de analytics
- Google Analytics (gtag.js)
- stats.mnunes.xyz
- Google Tag Manager (GTM)

**Solução:**
Escolha UMA ferramenta principal. Recomendação:
- **GTM** (se precisa gerenciar múltiplos scripts) OU
- **stats.mnunes.xyz** (se é self-hosted e privacy-focused)

Remova redundâncias.

**Ganho Estimado:** 30-40KB menos JavaScript, menos requisições

---

### 5. Otimizar Imagens

**Problema Atual:**
```html
<!-- ❌ Sem otimização -->
<img src="https://avatars.githubusercontent.com/u/29044312?v=4" 
     alt="Marcos Nunes Photo Profile"
     class="w-48 h-48 rounded-full ...">
```

**Solução:**
```html
<!-- ✅ Otimizado -->
<img src="https://avatars.githubusercontent.com/u/29044312?v=4&s=192" 
     alt="Marcos Nunes Photo Profile"
     width="192" 
     height="192"
     loading="eager"
     fetchpriority="high"
     class="w-48 h-48 rounded-full ...">

<!-- Para imagens de logos/badges abaixo da dobra -->
<img src="./assets/img/badges/badge1.png" 
     alt="Certification Badge"
     width="120"
     height="120"
     loading="lazy"
     class="...">
```

**Ganho Estimado:** Reduz CLS (Cumulative Layout Shift) drasticamente

---

### 6. Adicionar Resource Hints

**Adicionar no `<head>`:**
```html
<!-- DNS Prefetch para domínios externos -->
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
<link rel="dns-prefetch" href="https://avatars.githubusercontent.com">
<link rel="dns-prefetch" href="https://kit.fontawesome.com">

<!-- Preconnect para recursos críticos -->
<link rel="preconnect" href="https://avatars.githubusercontent.com" crossorigin>

<!-- Preload para CSS crítico -->
<link rel="preload" as="style" href="./assets/css/style.css">
```

---

### 7. Minificar e Combinar Scripts Locais

**Problema Atual:** 4 arquivos JS separados
- main.js
- projects.js
- skills.js
- certifications.js

**Solução:**
```bash
# Opção 1: Combinar em um único arquivo
cat assets/js/main.js assets/js/projects.js assets/js/skills.js assets/js/certifications.js > assets/js/bundle.js

# Opção 2: Usar build tool (Vite, esbuild, etc)
npm install -D vite
# Configurar bundling
```

```html
<!-- Apenas um script -->
<script defer src="./assets/js/bundle.min.js"></script>
```

**Ganho Estimado:** 3 requisições HTTP a menos

---

## 🟡 RECOMENDADO - Melhorias Adicionais

### 8. Implementar Service Worker para Cache

```javascript
// service-worker.js
const CACHE_NAME = 'mnunes-v1';
const urlsToCache = [
  '/',
  '/assets/css/style.css',
  '/assets/js/bundle.js',
  '/assets/img/logo-white.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

---

### 9. Adicionar Headers de Cache

**Configurar no servidor (nginx):**
```nginx
location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

---

### 10. Comprimir Recursos

**Nginx:**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml+rss 
           application/javascript application/json;
```

---

## 📈 Impacto Esperado Total

### Antes (Estimativa baseada no trace):
- FCP: ~1.5-2s
- LCP: ~2.5-3s
- TBT: ~300-400ms
- CLS: ~0.1-0.2

### Depois (Com todas otimizações):
- FCP: ~0.5-0.8s ⚡ **60% melhoria**
- LCP: ~1.0-1.5s ⚡ **50% melhoria**
- TBT: ~50-100ms ⚡ **75% melhoria**
- CLS: <0.05 ⚡ **80% melhoria**

---

## 🎯 Prioridade de Implementação

1. ✅ **HOJE**: Adicionar `defer` em todos os scripts (#1)
2. ✅ **HOJE**: Adicionar width/height nas imagens (#5)
3. ✅ **Esta Semana**: Migrar Tailwind CDN → Build (#2)
4. ✅ **Esta Semana**: Otimizar Font Awesome (#3)
5. ✅ **Próxima Semana**: Consolidar Analytics (#4)
6. ✅ **Próxima Semana**: Resource Hints (#6)
7. 📅 **Backlog**: Service Worker (#8)
8. 📅 **Backlog**: Server configs (#9, #10)

---

## 🔧 Ferramentas de Teste

Após implementar, teste com:
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/
- **Chrome DevTools** → Lighthouse
- **GTmetrix**: https://gtmetrix.com/

---

## 📞 Dúvidas?

Se precisar de ajuda para implementar qualquer uma dessas otimizações, me avise!
