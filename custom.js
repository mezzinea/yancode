(function() {
    'use strict';

    // ============================================================
    // LANGUAGE SWITCHER
    // ============================================================
    const langOptions = document.querySelectorAll('.lang-dropdown .option');
    const langDropdown = document.getElementById('langDropdown');
    const langSelected = document.getElementById('langSelected');
    const allLangElements = document.querySelectorAll('[data-lang]');

    let currentLang = 'ar';

    function setLanguage(lang) {
        currentLang = lang;
        langOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.langValue === lang);
        });
        langSelected.querySelectorAll('span').forEach(el => {
            el.classList.toggle('active', el.dataset.lang === lang);
        });
        allLangElements.forEach(el => {
            el.classList.toggle('active', el.dataset.lang === lang);
        });
        const html = document.documentElement;
        if (lang === 'ar') {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ar');
            document.body.classList.add('rtl');
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', lang);
            document.body.classList.remove('rtl');
        }
        langDropdown.classList.remove('open');
        document.getElementById('navLinks').classList.remove('open');
        updateSummary();
    }

    langSelected.addEventListener('click', function(e) {
        e.stopPropagation();
        langDropdown.classList.toggle('open');
    });

    langOptions.forEach(opt => {
        opt.addEventListener('click', function() {
            setLanguage(this.dataset.langValue);
        });
    });

    document.addEventListener('click', function(e) {
        if (!langDropdown.contains(e.target)) {
            langDropdown.classList.remove('open');
        }
    });

    // ============================================================
    // MOBILE MENU
    // ============================================================
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinksContainer.classList.toggle('open');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    navLinksContainer.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function() {
            navLinksContainer.classList.remove('open');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (!navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) {
            navLinksContainer.classList.remove('open');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });

    // ============================================================
    // STICKY NAVBAR
    // ============================================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // ============================================================
    // SCROLL ANIMATIONS
    // ============================================================
    const fadeElements = document.querySelectorAll('.fade-up');
    const staggerElements = document.querySelectorAll('.stagger');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(el => observer.observe(el));
    staggerElements.forEach(el => observer.observe(el));

    // ============================================================
    // FAQ TOGGLE
    // ============================================================
    document.querySelectorAll('.faq-card').forEach(card => {
        const question = card.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const isOpen = card.classList.contains('open');
            // Close all other FAQ cards
            document.querySelectorAll('.faq-card').forEach(c => c.classList.remove('open'));
            if (!isOpen) {
                card.classList.add('open');
            }
        });
    });

    // ============================================================
    // TOAST NOTIFICATION
    // ============================================================
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.getElementById('toastClose');
    let toastTimeout = null;

    function showToast(title, message, icon = 'fa-check') {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        const iconEl = toast.querySelector('.toast-icon i');
        iconEl.className = 'fas ' + icon;
        toast.classList.add('show');
        toastTimeout = setTimeout(function() {
            toast.classList.remove('show');
            toastTimeout = null;
        }, 3500);
    }

    toastClose.addEventListener('click', function() {
        toast.classList.remove('show');
        if (toastTimeout) {
            clearTimeout(toastTimeout);
            toastTimeout = null;
        }
    });

    document.addEventListener('click', function(e) {
        if (toast.classList.contains('show') && !toast.contains(e.target)) {
            toast.classList.remove('show');
            if (toastTimeout) {
                clearTimeout(toastTimeout);
                toastTimeout = null;
            }
        }
    });

    // ============================================================
    // GLOBAL BUILDER
    // ============================================================
    const phoneNumber = '212704771336';
    const baseUrl = 'https://wa.me/' + phoneNumber;

    const serviceLabels = {
        'basic': { ar: 'موقع تعريفي - أساسي', fr: 'Site vitrine - Basique', en: 'Showcase - Basic' },
        'professional': { ar: 'موقع احترافي - متقدم', fr: 'Site professionnel - Avancé', en: 'Professional - Advanced' },
        'premium': { ar: 'موقع متكامل - بريميوم', fr: 'Site complet - Premium', en: 'Complete - Premium' },
        'logo': { ar: 'تصميم شعار احترافي', fr: 'Création de logo', en: 'Logo Design' },
        'google': { ar: 'هوية Google Business', fr: 'Identité Google Business', en: 'Google Business' },
        'review': { ar: 'باقة التقييمات الذكية', fr: 'Pack Avis Intelligent', en: 'Smart Review Pack' },
        'pages': { ar: 'إضافة صفحة جديدة', fr: 'Ajouter une page', en: 'Add new page' },
        'content': { ar: 'تحديث المحتوى', fr: 'Mise à jour contenu', en: 'Content update' },
        'features': { ar: 'إضافة مميزات جديدة', fr: 'Ajouter des fonctionnalités', en: 'Add new features' },
        'maintenance': { ar: 'صيانة شهرية', fr: 'Maintenance mensuelle', en: 'Monthly maintenance' }
    };

    const toastMsgs = {
        'ar': { added: 'تم إضافة: ', removed: 'تم إلغاء: ', alert: 'الرجاء اختيار خدمة على الأقل' },
        'fr': { added: 'Ajouté: ', removed: 'Supprimé: ', alert: 'Veuillez sélectionner un service' },
        'en': { added: 'Added: ', removed: 'Removed: ', alert: 'Please select a service' }
    };

    const waMsgs = {
        'ar': {
            greeting: 'مرحباً، أرغب في الحصول على عرض سعر للخدمات التالية:\n\n',
            empty: '⚠️ لم يتم اختيار أي خدمة بعد.\n',
            total: 'المجموع التقديري',
            currency: 'درهم',
            closing: '\n\nأرجو إرسال التفاصيل الكاملة وشكراً.'
        },
        'fr': {
            greeting: 'Bonjour, je souhaite obtenir un devis pour :\n\n',
            empty: '⚠️ Aucun service sélectionné.\n',
            total: 'Total estimé',
            currency: 'MAD',
            closing: '\n\nMerci de m\'envoyer les détails.'
        },
        'en': {
            greeting: 'Hello, I would like a quote for:\n\n',
            empty: '⚠️ No services selected.\n',
            total: 'Estimated Total',
            currency: 'MAD',
            closing: '\n\nPlease send me the details. Thank you.'
        }
    };

    let selectedServices = [];

    document.querySelectorAll('.builder-option').forEach(option => {
        option.addEventListener('click', function() {
            const serviceId = this.dataset.service;
            const price = parseInt(this.dataset.price);
            const index = selectedServices.findIndex(s => s.id === serviceId);

            if (index > -1) {
                selectedServices.splice(index, 1);
                this.classList.remove('selected');
                const name = serviceLabels[serviceId]?.[currentLang] || serviceId;
                showToast('❌ ' + (toastMsgs[currentLang]?.removed || 'Removed: '), (toastMsgs[
                    currentLang]?.removed || 'Removed: ') + name, 'fa-times');
            } else {
                const websiteServices = ['basic', 'professional', 'premium'];
                if (websiteServices.includes(serviceId)) {
                    document.querySelectorAll('.builder-option').forEach(opt => {
                        if (websiteServices.includes(opt.dataset.service)) {
                            opt.classList.remove('selected');
                            const idx = selectedServices.findIndex(s => s.id === opt.dataset
                                .service);
                            if (idx > -1) selectedServices.splice(idx, 1);
                        }
                    });
                }
                selectedServices.push({ id: serviceId, price: price });
                this.classList.add('selected');
                const name = serviceLabels[serviceId]?.[currentLang] || serviceId;
                showToast('✅ ' + (toastMsgs[currentLang]?.added || 'Added: '), (toastMsgs[
                    currentLang]?.added || 'Added: ') + name, 'fa-plus-circle');
            }
            updateSummary();
        });
    });

    function updateSummary() {
        const total = selectedServices.reduce((sum, s) => sum + s.price, 0);
        document.getElementById('totalPrice').textContent = total;

        const list = document.getElementById('selectedList');
        list.innerHTML = '';
        selectedServices.forEach((s, index) => {
            const span = document.createElement('span');
            span.className = 'builder-selected-item';
            const name = serviceLabels[s.id]?.[currentLang] || s.id;
            span.innerHTML = name +
                ' <span class="remove-btn" data-index="' + index + '"><i class="fas fa-times"></i></span>';
            list.appendChild(span);
        });

        document.querySelectorAll('.builder-selected-item .remove-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const idx = parseInt(this.dataset.index);
                const serviceId = selectedServices[idx].id;
                selectedServices.splice(idx, 1);
                document.querySelectorAll('.builder-option').forEach(opt => {
                    if (opt.dataset.service === serviceId) {
                        opt.classList.remove('selected');
                    }
                });
                const name = serviceLabels[serviceId]?.[currentLang] || serviceId;
                showToast('❌ ' + (toastMsgs[currentLang]?.removed || 'Removed: '), (toastMsgs[
                    currentLang]?.removed || 'Removed: ') + name, 'fa-times');
                updateSummary();
            });
        });
    }

    function buildWhatsAppMessage() {
        const msgs = waMsgs[currentLang] || waMsgs['ar'];
        let message = msgs.greeting;

        if (selectedServices.length === 0) {
            message += msgs.empty;
        } else {
            let total = 0;
            selectedServices.forEach(s => {
                const name = serviceLabels[s.id]?.[currentLang] || s.id;
                message += '  ✓ ' + name + ' (' + s.price + ' ' + msgs.currency + ')\n';
                total += s.price;
            });
            message += '\n📊 *' + msgs.total + ': ' + total + ' ' + msgs.currency + '*';
        }

        message += msgs.closing;
        return encodeURIComponent(message);
    }

    function sendWhatsAppMessage() {
        if (selectedServices.length === 0) {
            showToast('⚠️ تنبيه', toastMsgs[currentLang]?.alert || 'Please select a service',
            'fa-exclamation-triangle');
            return;
        }
        const message = buildWhatsAppMessage();
        const url = baseUrl + '?text=' + message;
        window.open(url, '_blank');
    }

    document.getElementById('builderWhatsAppBtn').addEventListener('click', function(e) {
        e.preventDefault();
        sendWhatsAppMessage();
    });

    document.getElementById('mainWhatsAppBtn').addEventListener('click', function(e) {
        e.preventDefault();
        sendWhatsAppMessage();
    });

    document.getElementById('floatWhatsAppBtn').addEventListener('click', function(e) {
        e.preventDefault();
        sendWhatsAppMessage();
    });

    // ---- Init Language ----
    setLanguage('ar');

    console.log('✅ YanCode — Redesigned FAQ with grid layout');
    console.log('💡 Select services to build your custom package.');
})();
