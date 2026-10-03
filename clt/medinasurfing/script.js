(function() {
    'use strict';

    const LANGS = ['en', 'fr'];
    const DEFAULT_LANG = 'en';
    const STORAGE_KEY = 'medinasurfing_lang';
    const WHATSAPP_NUMBER = '212656578306';

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
        return (navigator.language || '').toLowerCase().startsWith('fr') ? 'fr' : DEFAULT_LANG;
    }

    function setLanguage(lang) {
        currentLang = LANGS.includes(lang) ? lang : DEFAULT_LANG;
        try { localStorage.setItem(STORAGE_KEY, currentLang); } catch (e) { /* storage unavailable */ }

        document.documentElement.lang = currentLang;
        document.title = t('metaTitle');
        document.querySelector('meta[name="description"]').setAttribute('content', t('metaDesc'));
        document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
        langButtons.forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === currentLang));
        const lbLabels = { close: 'lbClose', prev: 'lbPrev', next: 'lbNext' };
        document.querySelectorAll('.lb-btn').forEach(b => b.setAttribute('aria-label', t(lbLabels[b.dataset.lb])));

        document.querySelectorAll('[data-wa]').forEach(link => {
            link.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(t(link.dataset.wa));
        });
        closeMenu();
    }

    langButtons.forEach(b => b.addEventListener('click', () => setLanguage(b.dataset.lang)));

    // ============================================================
    // HEADER & MOBILE MENU
    // ============================================================
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const burger = document.getElementById('burger');

    function onScroll() {
        header.classList.toggle('solid', window.scrollY > 60 || nav.classList.contains('open'));
    }

    function closeMenu() {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        onScroll();
    }

    burger.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', open);
        onScroll();
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('scroll', onScroll, { passive: true });

    // ============================================================
    // FAQ: one answer open at a time
    // ============================================================
    const faqs = document.querySelectorAll('.faq');
    faqs.forEach(item => item.addEventListener('toggle', () => {
        if (item.open) faqs.forEach(other => { if (other !== item) other.open = false; });
    }));

    // ============================================================
    // GALLERY LIGHTBOX
    // ============================================================
    const galleryItems = [...document.querySelectorAll('.g-item')];
    const lightbox = document.getElementById('lightbox');
    const lbImage = document.getElementById('lbImage');
    const lbCaption = document.getElementById('lbCaption');
    const lbCount = document.getElementById('lbCount');
    let lbIndex = 0;

    function showPhoto(index) {
        lbIndex = (index + galleryItems.length) % galleryItems.length;
        const item = galleryItems[lbIndex];
        const caption = item.querySelector('[data-i18n]').textContent;
        lbImage.src = item.querySelector('img').src;
        lbImage.alt = caption;
        lbCaption.textContent = caption;
        lbCount.textContent = (lbIndex + 1) + ' / ' + galleryItems.length;
    }

    galleryItems.forEach((item, i) => item.addEventListener('click', () => {
        showPhoto(i);
        lightbox.showModal();
    }));

    lightbox.addEventListener('click', e => {
        const action = e.target.closest('[data-lb]')?.dataset.lb;
        if (action === 'close' || e.target === lightbox) lightbox.close();
        else if (action === 'prev') showPhoto(lbIndex - 1);
        else if (action === 'next') showPhoto(lbIndex + 1);
    });

    lightbox.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') showPhoto(lbIndex - 1);
        if (e.key === 'ArrowRight') showPhoto(lbIndex + 1);
    });

    // Swipe on touch screens
    let touchX = null;
    lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) showPhoto(lbIndex + (dx < 0 ? 1 : -1));
        touchX = null;
    });

    // ============================================================
    // REVEAL ON SCROLL
    // ============================================================
    const items = document.querySelectorAll('.title, .about-text, .feature, .offer, .level, .coach-text, .spots-media, .spot, .community-media, .review, .g-item');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        items.forEach(el => el.classList.add('reveal'));
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        items.forEach(el => observer.observe(el));
    }

    document.getElementById('year').textContent = new Date().getFullYear();
    setLanguage(readSavedLang());
    onScroll();
})();
