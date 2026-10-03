(function() {
    'use strict';

    const LANGS = ['fr', 'en', 'ar'];
    const DEFAULT_LANG = 'fr';
    const STORAGE_KEY = 'vanisca_lang';
    const WHATSAPP_NUMBER = '212611700033';

    let currentLang = DEFAULT_LANG;
    const t = key => I18N[currentLang][key];

    // ============================================================
    // LANGUAGE
    // ============================================================
    const langButtons = document.querySelectorAll('#lang button');

    function readSavedLang() {
        const fromUrl = new URLSearchParams(window.location.search).get('lang');
        if (LANGS.includes(fromUrl)) return fromUrl;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (LANGS.includes(saved)) return saved;
        } catch (e) { /* storage unavailable */ }
        return DEFAULT_LANG;
    }

    function setLanguage(lang) {
        currentLang = LANGS.includes(lang) ? lang : DEFAULT_LANG;
        try { localStorage.setItem(STORAGE_KEY, currentLang); } catch (e) { /* storage unavailable */ }

        const html = document.documentElement;
        html.lang = currentLang;
        html.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        document.title = t('metaTitle');
        document.querySelector('meta[name="description"]').setAttribute('content', t('metaDesc'));

        document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
        langButtons.forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === currentLang));

        document.querySelectorAll('[data-wa]').forEach(link => {
            link.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(t(link.dataset.wa));
        });
        closeMenu();
    }

    langButtons.forEach(b => b.addEventListener('click', () => setLanguage(b.dataset.lang)));

    // ============================================================
    // HEADER: transparent over the hero, solid once scrolled
    // ============================================================
    const header = document.getElementById('header');
    const floatBook = document.querySelector('.float-book');

    function onScroll() {
        const scrolled = window.scrollY > 40;
        header.classList.toggle('solid', scrolled || nav.classList.contains('open'));
        floatBook.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
    }

    // ============================================================
    // MOBILE MENU
    // ============================================================
    const nav = document.getElementById('nav');
    const burger = document.getElementById('burger');

    function closeMenu() {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        onScroll();
    }

    burger.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', open);
        document.body.classList.toggle('menu-open', open);
        onScroll();
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

    window.addEventListener('scroll', onScroll, { passive: true });

    // ============================================================
    // REVEAL ON SCROLL
    // ============================================================
    const revealItems = document.querySelectorAll('.heading, .intro-text, .split-media, .split-text > p, .menu-list, .g-item, .review, .contact-list');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealItems.forEach(el => el.classList.add('reveal'));
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealItems.forEach(el => observer.observe(el));
    }

    document.getElementById('year').textContent = new Date().getFullYear();
    setLanguage(readSavedLang());
    onScroll();
})();
