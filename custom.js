(function() {
    'use strict';

    // ============================================================
    // CONFIG
    // ============================================================
    const LANGS = ['fr', 'ar', 'en'];
    const DEFAULT_LANG = 'fr';
    const STORAGE_KEY = 'yancode-lang';
    const phoneNumber = '212704771336';
    const baseUrl = 'https://wa.me/' + phoneNumber;
    // Set to your Google review link (Google Business Profile > "Ask for reviews").
    // While empty, the QR code opens a WhatsApp chat to leave a review.
    const REVIEW_URL = '';
    const WEBSITE_SERVICES = ['basic', 'professional'];

    const i18n = {
        fr: {
            title: 'YanCode — Sites web modernes pour votre entreprise',
            description: 'YanCode crée des sites web modernes, rapides et optimisés SEO au Maroc. Sites vitrines dès 850 MAD, logo, Google Business et maintenance. Devis gratuit sur WhatsApp.',
            added: 'Ajouté',
            removed: 'Retiré',
            alertTitle: 'Attention',
            alert: 'Veuillez sélectionner au moins un service',
            remove: 'Retirer',
            currency: 'MAD',
            perMonth: 'MAD/mois',
            greeting: 'Bonjour, je souhaite obtenir un devis pour :\n\n',
            total: 'Total estimé',
            closing: '\n\nMerci de m\'envoyer les détails.',
            contact: 'Bonjour, je souhaite avoir plus d\'informations sur vos services.',
            review: 'Bonjour, je souhaite laisser un avis sur YanCode : ',
            qrLabel: 'QR code pour laisser un avis',
            next: 'Continuer',
            skip: 'Passer cette étape',
            stepOf: (n, total) => 'Étape ' + n + ' sur ' + total,
            edit: 'Modifier',
            reviewEmpty: 'Vous n\'avez encore choisi aucun service.',
            reviewStart: 'Commencer à l\'étape 1',
            oneTime: 'Total estimé',
            monthlyLabel: 'Abonnement mensuel'
        },
        ar: {
            title: 'YanCode — مواقع إلكترونية عصرية لأعمالك',
            description: 'YanCode تصمم مواقع إلكترونية عصرية وسريعة ومحسّنة لمحركات البحث في المغرب. مواقع تعريفية ابتداءً من 850 درهم، شعار، Google Business وصيانة. عرض سعر مجاني عبر واتساب.',
            added: 'تمت الإضافة',
            removed: 'تم الإلغاء',
            alertTitle: 'تنبيه',
            alert: 'الرجاء اختيار خدمة على الأقل',
            remove: 'إزالة',
            currency: 'درهم',
            perMonth: 'درهم/شهر',
            greeting: 'مرحباً، أرغب في الحصول على عرض سعر للخدمات التالية:\n\n',
            total: 'المجموع التقديري',
            closing: '\n\nأرجو إرسال التفاصيل الكاملة وشكراً.',
            contact: 'مرحباً، أرغب في معرفة المزيد عن خدماتكم.',
            review: 'مرحباً، أرغب في ترك تقييم لـ YanCode: ',
            qrLabel: 'رمز QR لترك تقييم',
            next: 'متابعة',
            skip: 'تخطَّ هذه الخطوة',
            stepOf: (n, total) => 'الخطوة ' + n + ' من ' + total,
            edit: 'تعديل',
            reviewEmpty: 'لم تختر أي خدمة بعد.',
            reviewStart: 'ابدأ من الخطوة 1',
            oneTime: 'المجموع التقديري',
            monthlyLabel: 'اشتراك شهري'
        },
        en: {
            title: 'YanCode — Modern websites for your business',
            description: 'YanCode builds modern, fast, SEO-optimised websites in Morocco. Showcase sites from 850 MAD, logo design, Google Business and maintenance. Free quote on WhatsApp.',
            added: 'Added',
            removed: 'Removed',
            alertTitle: 'Notice',
            alert: 'Please select at least one service',
            remove: 'Remove',
            currency: 'MAD',
            perMonth: 'MAD/month',
            greeting: 'Hello, I would like a quote for:\n\n',
            total: 'Estimated Total',
            closing: '\n\nPlease send me the details. Thank you.',
            contact: 'Hello, I would like more information about your services.',
            review: 'Hello, I would like to leave a review for YanCode: ',
            qrLabel: 'QR code to leave a review',
            next: 'Continue',
            skip: 'Skip this step',
            stepOf: (n, total) => 'Step ' + n + ' of ' + total,
            edit: 'Edit',
            reviewEmpty: 'You haven\'t picked any services yet.',
            reviewStart: 'Start at step 1',
            oneTime: 'Estimated total',
            monthlyLabel: 'Monthly subscription'
        }
    };

    let currentLang = DEFAULT_LANG;
    const t = () => i18n[currentLang];
    const priceFormat = new Intl.NumberFormat('fr-FR');
    const formatPrice = n => priceFormat.format(n);

    // Keyboard support for clickable non-button elements
    function makePressable(el) {
        el.setAttribute('role', 'button');
        el.tabIndex = 0;
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    }

    // ============================================================
    // LANGUAGE SWITCHER
    // ============================================================
    const langOptions = document.querySelectorAll('.lang-dropdown .option');
    const langDropdown = document.getElementById('langDropdown');
    const langSelected = document.getElementById('langSelected');
    const allLangElements = document.querySelectorAll('[data-lang]');
    const metaDescription = document.querySelector('meta[name="description"]');

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
        if (!LANGS.includes(lang)) lang = DEFAULT_LANG;
        currentLang = lang;
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage unavailable */ }

        langOptions.forEach(opt => {
            const active = opt.dataset.langValue === lang;
            opt.classList.toggle('active', active);
            opt.setAttribute('aria-selected', active);
        });
        allLangElements.forEach(el => {
            el.classList.toggle('active', el.dataset.lang === lang);
        });

        const html = document.documentElement;
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.body.classList.toggle('rtl', lang === 'ar');
        document.title = t().title;
        if (metaDescription) metaDescription.setAttribute('content', t().description);

        closeLangMenu();
        closeMobileMenu();
        updateSummary();
        updateContactLinks();
        renderReviewQr();
    }

    function closeLangMenu() {
        langDropdown.classList.remove('open');
        langSelected.setAttribute('aria-expanded', 'false');
    }

    makePressable(langSelected);
    langSelected.setAttribute('aria-haspopup', 'listbox');
    langSelected.setAttribute('aria-expanded', 'false');
    langDropdown.querySelector('.menu').setAttribute('role', 'listbox');

    langSelected.addEventListener('click', function(e) {
        e.stopPropagation();
        const open = langDropdown.classList.toggle('open');
        langSelected.setAttribute('aria-expanded', open);
        if (open) langDropdown.querySelector('.option.active').focus();
    });

    langOptions.forEach(opt => {
        makePressable(opt);
        opt.setAttribute('role', 'option');
        opt.addEventListener('click', function() {
            setLanguage(this.dataset.langValue);
            langSelected.focus();
        });
    });

    langDropdown.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLangMenu();
            langSelected.focus();
        }
    });

    // ============================================================
    // MOBILE MENU
    // ============================================================
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');
    const hamburgerIcon = hamburger.querySelector('i');

    function closeMobileMenu() {
        navLinksContainer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburgerIcon.classList.add('fa-bars');
        hamburgerIcon.classList.remove('fa-times');
    }

    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'navLinks');
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        const open = navLinksContainer.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', open);
        hamburgerIcon.classList.toggle('fa-bars', !open);
        hamburgerIcon.classList.toggle('fa-times', open);
    });

    navLinksContainer.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ============================================================
    // STICKY NAVBAR
    // ============================================================
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    }, { passive: true });

    // ============================================================
    // KEY FIGURES COUNTERS
    // ============================================================
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCount(el) {
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const duration = 1400;
        const start = performance.now();
        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = (target * eased).toFixed(decimals);
            if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    if (!reduceMotion) {
        document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
    }

    // ============================================================
    // SCROLL ANIMATIONS
    // ============================================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up, .stagger').forEach(el => observer.observe(el));

    // ============================================================
    // FAQ TOGGLE
    // ============================================================
    const faqCards = document.querySelectorAll('.faq-card');

    function syncFaq() {
        faqCards.forEach(c => {
            c.querySelector('.faq-question').setAttribute('aria-expanded', c.classList.contains('open'));
        });
    }

    faqCards.forEach(card => {
        const question = card.querySelector('.faq-question');
        makePressable(question);
        question.addEventListener('click', function() {
            const isOpen = card.classList.contains('open');
            faqCards.forEach(c => c.classList.remove('open'));
            if (!isOpen) card.classList.add('open');
            syncFaq();
        });
    });
    syncFaq();

    // ============================================================
    // TOAST NOTIFICATION
    // ============================================================
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon i');
    let toastTimeout = null;

    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    function showToast(title, message, icon = 'fa-check') {
        clearTimeout(toastTimeout);
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        toastIcon.className = 'fas ' + icon;
        toast.classList.add('show');
        toastTimeout = setTimeout(hideToast, 3500);
    }

    function hideToast() {
        toast.classList.remove('show');
        clearTimeout(toastTimeout);
        toastTimeout = null;
    }

    document.getElementById('toastClose').addEventListener('click', hideToast);

    // ============================================================
    // OUTSIDE CLICKS: close menus and toast
    // ============================================================
    document.addEventListener('click', function(e) {
        if (!langDropdown.contains(e.target)) closeLangMenu();
        if (!navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) closeMobileMenu();
        // Clicks that open a toast must not immediately close it
        const opensToast = e.target.closest('.builder-option, .builder-selected-item, #builderWhatsAppBtn, #reviewWhatsAppBtn');
        if (toast.classList.contains('show') && !toast.contains(e.target) && !opensToast) hideToast();
    });

    // ============================================================
    // GLOBAL BUILDER
    // ============================================================
    const services = {};
    document.querySelectorAll('.builder-option').forEach(option => {
        services[option.dataset.service] = {
            el: option,
            price: parseInt(option.dataset.price, 10),
            monthly: option.dataset.recurring === 'monthly',
            step: Number(option.closest('.builder-step').dataset.step)
        };
    });

    let selectedServices = [];

    function serviceName(id) {
        const el = services[id].el.querySelector('.option-name[data-lang="' + currentLang + '"]');
        return el ? el.textContent.trim() : id;
    }

    function servicePrice(id) {
        const s = services[id];
        return formatPrice(s.price) + ' ' + (s.monthly ? t().perMonth : t().currency);
    }

    function totals() {
        return selectedServices.reduce((acc, id) => {
            const s = services[id];
            acc[s.monthly ? 'monthly' : 'oneTime'] += s.price;
            return acc;
        }, { oneTime: 0, monthly: 0 });
    }

    function toggleService(id) {
        if (selectedServices.includes(id)) {
            selectedServices = selectedServices.filter(s => s !== id);
            showToast(t().removed, serviceName(id), 'fa-times');
        } else {
            // Only one website package at a time
            if (WEBSITE_SERVICES.includes(id)) {
                selectedServices = selectedServices.filter(s => !WEBSITE_SERVICES.includes(s));
            }
            selectedServices.push(id);
            showToast(t().added, serviceName(id), 'fa-plus-circle');
        }
        updateSummary();
    }

    Object.keys(services).forEach(id => {
        const el = services[id].el;
        makePressable(el);
        el.addEventListener('click', () => toggleService(id));
    });

    const totalPriceEl = document.getElementById('totalPrice');
    const monthlyPriceEl = document.getElementById('monthlyPrice');
    const selectedList = document.getElementById('selectedList');
    const navTotal = document.getElementById('navTotal');

    function updateSummary() {
        Object.keys(services).forEach(id => {
            const selected = selectedServices.includes(id);
            services[id].el.classList.toggle('selected', selected);
            services[id].el.setAttribute('aria-pressed', selected);
        });

        const { oneTime, monthly } = totals();
        totalPriceEl.textContent = formatPrice(oneTime);
        monthlyPriceEl.hidden = monthly === 0;
        monthlyPriceEl.textContent = '+ ' + formatPrice(monthly) + ' ' + t().perMonth;
        navTotal.textContent = formatPrice(oneTime) + ' ' + t().currency + (monthly ? ' + ' + formatPrice(monthly) + ' ' + t().perMonth : '');

        selectedList.replaceChildren(...selectedServices.map(id => {
            const item = document.createElement('span');
            item.className = 'builder-selected-item';
            item.textContent = serviceName(id) + ' ';
            const remove = document.createElement('span');
            remove.className = 'remove-btn';
            remove.dataset.service = id;
            remove.setAttribute('aria-label', t().remove + ' ' + serviceName(id));
            remove.innerHTML = '<i class="fas fa-times"></i>';
            makePressable(remove);
            item.appendChild(remove);
            return item;
        }));

        updateSteps();
    }

    selectedList.addEventListener('click', function(e) {
        const btn = e.target.closest('.remove-btn');
        if (btn) toggleService(btn.dataset.service);
    });

    // ============================================================
    // BUILDER STEPS
    // ============================================================
    const builderSection = document.getElementById('builder');
    const stepPanels = [...document.querySelectorAll('.builder-step')];
    const stepItems = [...document.querySelectorAll('#builderSteps li')];
    const stepPrev = document.getElementById('stepPrev');
    const stepNext = document.getElementById('stepNext');
    const stepNextLabel = document.getElementById('stepNextLabel');
    const stepCount = document.getElementById('stepCount');
    const reviewList = document.getElementById('reviewList');
    const reviewStep = stepPanels.length - 1;
    let currentStep = 0;

    const selectedInStep = step => selectedServices.filter(id => services[id].step === step);

    function stepTitle(step) {
        const el = stepPanels[step].querySelector('.builder-category-title [data-lang="' + currentLang + '"]');
        return el ? el.textContent.trim() : '';
    }

    function goToStep(step) {
        currentStep = Math.max(0, Math.min(reviewStep, step));
        updateSteps();
        // Keep the step header in view when the panel changes height
        if (builderSection.getBoundingClientRect().top < 0) {
            document.getElementById('builderSteps').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function updateSteps() {
        stepPanels.forEach((panel, i) => { panel.hidden = i !== currentStep; });
        stepItems.forEach((item, i) => {
            item.classList.toggle('active', i === currentStep);
            item.classList.toggle('done', i < reviewStep && selectedInStep(i).length > 0);
            const button = item.querySelector('button');
            if (i === currentStep) button.setAttribute('aria-current', 'step');
            else button.removeAttribute('aria-current');
        });
        builderSection.classList.toggle('has-selection', selectedServices.length > 0);
        stepPrev.disabled = currentStep === 0;
        stepNext.hidden = currentStep === reviewStep;
        stepNextLabel.textContent = selectedInStep(currentStep).length ? t().next : t().skip;
        stepCount.textContent = t().stepOf(currentStep + 1, stepPanels.length);
        if (currentStep === reviewStep) renderReview();
    }

    function renderReview() {
        const msgs = t();
        if (selectedServices.length === 0) {
            reviewList.innerHTML = '<div class="review-empty"><p></p><button type="button" class="btn-outline" data-goto="0"></button></div>';
            reviewList.querySelector('p').textContent = msgs.reviewEmpty;
            reviewList.querySelector('button').textContent = msgs.reviewStart;
            return;
        }
        const groups = [];
        for (let step = 0; step < reviewStep; step++) {
            const ids = selectedInStep(step);
            if (!ids.length) continue;
            const group = document.createElement('div');
            group.className = 'review-group';
            const head = document.createElement('div');
            head.className = 'review-group-head';
            const title = document.createElement('span');
            title.textContent = stepTitle(step);
            const edit = document.createElement('button');
            edit.type = 'button';
            edit.className = 'review-edit';
            edit.dataset.goto = step;
            edit.textContent = msgs.edit;
            head.append(title, edit);
            group.appendChild(head);
            ids.forEach(id => {
                const row = document.createElement('div');
                row.className = 'review-row';
                const name = document.createElement('span');
                name.textContent = serviceName(id);
                const price = document.createElement('strong');
                price.textContent = servicePrice(id);
                row.append(name, price);
                group.appendChild(row);
            });
            groups.push(group);
        }
        const { oneTime, monthly } = totals();
        const total = document.createElement('div');
        total.className = 'review-total';
        total.innerHTML = '<span></span><strong></strong>';
        total.querySelector('span').textContent = msgs.oneTime;
        total.querySelector('strong').textContent = formatPrice(oneTime) + ' ' + msgs.currency;
        groups.push(total);
        if (monthly) {
            const sub = document.createElement('div');
            sub.className = 'review-total review-total-monthly';
            sub.innerHTML = '<span></span><strong></strong>';
            sub.querySelector('span').textContent = msgs.monthlyLabel;
            sub.querySelector('strong').textContent = '+ ' + formatPrice(monthly) + ' ' + msgs.perMonth;
            groups.push(sub);
        }
        reviewList.replaceChildren(...groups);
    }

    stepPrev.addEventListener('click', () => goToStep(currentStep - 1));
    stepNext.addEventListener('click', () => goToStep(currentStep + 1));
    builderSection.addEventListener('click', function(e) {
        const target = e.target.closest('[data-goto]');
        if (target) goToStep(Number(target.dataset.goto));
    });

    // ============================================================
    // WHATSAPP
    // ============================================================
    function whatsAppUrl(text) {
        return baseUrl + '?text=' + encodeURIComponent(text);
    }

    function buildQuoteMessage() {
        const msgs = t();
        const { oneTime, monthly } = totals();
        let message = msgs.greeting;
        selectedServices.forEach(id => {
            message += '  ✓ ' + serviceName(id) + ' (' + servicePrice(id) + ')\n';
        });
        message += '\n📊 *' + msgs.total + ': ' + formatPrice(oneTime) + ' ' + msgs.currency;
        if (monthly) message += ' + ' + formatPrice(monthly) + ' ' + msgs.perMonth;
        message += '*' + msgs.closing;
        return message;
    }

    function requestQuote(e) {
        e.preventDefault();
        if (selectedServices.length === 0) {
            showToast(t().alertTitle, t().alert, 'fa-exclamation-triangle');
            return;
        }
        window.open(whatsAppUrl(buildQuoteMessage()), '_blank', 'noopener');
    }

    document.getElementById('builderWhatsAppBtn').addEventListener('click', requestQuote);
    document.getElementById('reviewWhatsAppBtn').addEventListener('click', requestQuote);

    // Contact buttons open a plain chat, no package required
    const contactLinks = [document.getElementById('mainWhatsAppBtn'), document.getElementById('floatWhatsAppBtn')];

    function updateContactLinks() {
        contactLinks.forEach(link => { link.href = whatsAppUrl(t().contact); });
    }

    // ============================================================
    // REVIEW QR CODE
    // ============================================================
    const reviewQr = document.getElementById('reviewQr');

    function renderReviewQr() {
        const url = REVIEW_URL || whatsAppUrl(t().review);
        reviewQr.href = url;
        reviewQr.setAttribute('aria-label', t().qrLabel);
        if (typeof window.qrcode !== 'function') return; // library not loaded: keep icon fallback
        const qr = window.qrcode(0, 'M');
        qr.addData(url);
        qr.make();
        reviewQr.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true, alt: t().qrLabel });
    }

    // ---- Init Language ----
    setLanguage(readSavedLang());
})();
