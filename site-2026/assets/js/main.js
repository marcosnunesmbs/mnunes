import { certifications } from './certifications.js';
import { skills } from './skills.js';
import { projects } from './projects.js';

/**
 * Adjust asset paths from parent directory.
 * Data modules use "./assets/" relative to parent; from site-2026/ we need "../assets/".
 */
function resolveAssetPath(path) {
    if (path && path.startsWith('./assets/')) {
        return path.replace('./assets/', '../');
    }
    return path;
}

/** Skill categories for grouped rendering */
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    renderStats();
    renderSkills();
    renderCertifications();
    renderProjects();
    initScrollAnimations();
    initNavbar();
    initMobileMenu();
});

/* ===== Stats ===== */
function renderStats() {
    const techEl = document.getElementById('stat-technologies');
    const projEl = document.getElementById('stat-projects');
    const certEl = document.getElementById('stat-certifications');

    if (techEl) techEl.textContent = skills.length + '+';
    if (projEl) projEl.textContent = projects.length;
    if (certEl) certEl.textContent = certifications.length;
}

/* ===== Skills ===== */
function renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    const categories = new Map();
    skills.forEach(skill => {
        if (!skill.category || !skill.image) return;
        if (!categories.has(skill.category)) categories.set(skill.category, []);
        categories.get(skill.category).push(skill);
    });

    categories.forEach((categorySkills, categoryName) => {
        const section = document.createElement('div');
        section.className = 'animate-on-scroll';

        const title = document.createElement('h3');
        title.className = 'skill-category-title';
        title.textContent = categoryName;
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3';

        categorySkills.forEach(skill => {
            const imgSrc = resolveAssetPath(skill.image);
            const isSvg = imgSrc.endsWith('.svg');
            const isLocal = !imgSrc.startsWith('http');

            const item = document.createElement('div');
            item.className = 'skill-item';

            if (isSvg && isLocal && skill.brandColor) {
                const darkClass = skill.darkInvert ? ' skill-icon-dark-invert' : '';
                item.innerHTML = `
                    <div class="skill-icon${darkClass}" style="--brand-color: ${skill.brandColor}; -webkit-mask-image: url(${imgSrc}); mask-image: url(${imgSrc})" role="img" aria-label="${skill.name}"></div>
                    <span>${skill.name}</span>
                `;
            } else {
                item.innerHTML = `
                    <img src="${imgSrc}" alt="${skill.name}" width="32" height="32" loading="lazy">
                    <span>${skill.name}</span>
                `;
            }
            grid.appendChild(item);
        });

        section.appendChild(grid);
        container.appendChild(section);
    });
}

/* ===== Certifications ===== */
function renderCertifications() {
    const container = document.getElementById('certifications-container');
    if (!container) return;

    certifications.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'cert-card animate-on-scroll';
        card.innerHTML = `
            <img src="${resolveAssetPath(cert.imgSrc)}" alt="${cert.alt}" width="88" height="88" loading="lazy">
            <span>${cert.name}</span>
        `;
        container.appendChild(card);
    });
}

/* ===== Projects ===== */
function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    projects.forEach(project => {
        const imgSrc = resolveAssetPath(project.imgSrc);
        const isSvg = imgSrc.endsWith('.svg');

        const card = document.createElement('div');
        card.className = 'project-card animate-on-scroll';
        card.innerHTML = `
            <div class="p-6 flex flex-col gap-4 h-full">
                <div class="flex items-center gap-4">
                    <img src="${imgSrc}" alt="${project.alt}" width="48" height="48" loading="lazy"
                        class="w-12 h-12 rounded-lg object-contain flex-shrink-0${isSvg ? ' brightness-0 invert' : ''}">
                    <h3 class="font-heading font-semibold text-base-50 text-lg">${project.name}</h3>
                </div>
                <p class="text-base-400 text-sm leading-relaxed flex-1">${project.description}</p>
                <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link mt-auto">
                    Visitar
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd"/>
                    </svg>
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

/* ===== Scroll Animations (Intersection Observer) ===== */
function initScrollAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('animate-in'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

/* ===== Theme Toggle ===== */
function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    const iconMoon = document.getElementById('icon-moon');
    const iconSun = document.getElementById('icon-sun');
    if (!btn) return;

    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isLight = saved === 'light' || (!saved && !prefersDark);

    if (isLight) {
        document.documentElement.classList.add('light');
    }
    updateIcon(isLight);

    btn.addEventListener('click', () => {
        const light = document.documentElement.classList.toggle('light');
        localStorage.setItem('theme', light ? 'light' : 'dark');
        updateIcon(light);
    });

    function updateIcon(light) {
        if (iconMoon && iconSun) {
            iconMoon.classList.toggle('hidden', light);
            iconSun.classList.toggle('hidden', !light);
        }
        document.querySelectorAll('.logo-site').forEach(img => {
            img.src = light ? '../img/logo.png' : '../img/logo-white.png';
        });
    }
}

/* ===== Navbar Scroll Effect ===== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = () => {
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ===== Mobile Menu ===== */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        const isOpen = !menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        if (iconOpen) iconOpen.classList.toggle('hidden');
        if (iconClose) iconClose.classList.toggle('hidden');
        btn.setAttribute('aria-expanded', String(!isOpen));
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            if (iconOpen) iconOpen.classList.remove('hidden');
            if (iconClose) iconClose.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
        });
    });
}
