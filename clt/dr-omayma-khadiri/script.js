(function() {
    'use strict';

    const LANGS = ['fr', 'ar'];
    const DEFAULT_LANG = 'fr';
    const STORAGE_KEY = 'dr-khadiri-lang';
    const WHATSAPP = '212671818169';
    const TIME_ZONE = 'Africa/Casablanca';

    // Opening hours by weekday (0 = Sunday)
    const WEEKDAY_HOURS = [['09:00', '12:30'], ['15:00', '18:00']];
    const HOURS = {
        0: [],
        1: WEEKDAY_HOURS,
        2: WEEKDAY_HOURS,
        3: WEEKDAY_HOURS,
        4: WEEKDAY_HOURS,
        5: WEEKDAY_HOURS,
        6: [['09:00', '12:30']]
    };

    const i18n = {
        fr: {
            title: 'Dr Omayma Khadiri — Dermatologue à Agadir',
            whatsapp: 'Bonjour Docteur, je souhaite prendre rendez-vous.',
            days: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
            openUntil: t => 'Ouvert maintenant · ferme à ' + t,
            opensToday: t => 'Fermé · ouvre aujourd\'hui à ' + t,
            opensTomorrow: t => 'Fermé · ouvre demain à ' + t,
            opensOn: (d, t) => 'Fermé · ouvre ' + d + ' à ' + t
        },
        ar: {
            title: 'الدكتورة أميمة الخضيري — طبيبة الأمراض الجلدية بأكادير',
            whatsapp: 'مرحباً دكتورة، أرغب في حجز موعد.',
            days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
            openUntil: t => 'مفتوح الآن · يغلق على الساعة ' + t,
            opensToday: t => 'مغلق · يفتح اليوم على الساعة ' + t,
            opensTomorrow: t => 'مغلق · يفتح غداً على الساعة ' + t,
            opensOn: (d, t) => 'مغلق · يفتح يوم ' + d + ' على الساعة ' + t
        }
    };

    let currentLang = DEFAULT_LANG;
    const toMinutes = hhmm => {
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
    };

    // ============================================================
    // LANGUAGE
    // ============================================================
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
        document.title = i18n[currentLang].title;

        const href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(i18n[currentLang].whatsapp);
        ['whatsappBtn', 'whatsappLink', 'whatsappFloat'].forEach(id => {
            document.getElementById(id).href = href;
        });

        updateOpenStatus();
    }

    document.getElementById('langToggle').addEventListener('click', function() {
        setLanguage(currentLang === 'fr' ? 'ar' : 'fr');
    });

    // ============================================================
    // OPEN NOW (clinic local time)
    // ============================================================
    function clinicNow() {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: TIME_ZONE,
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
        }).formatToParts(new Date());
        const get = type => parts.find(p => p.type === type).value;
        const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
        return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
    }

    function updateOpenStatus() {
        const el = document.getElementById('openStatus');
        const t = i18n[currentLang];
        const { day, minutes } = clinicNow();

        document.querySelectorAll('#hoursTable tr').forEach(row => {
            row.classList.toggle('is-today', Number(row.dataset.day) === day);
        });

        const current = HOURS[day].find(([open, close]) => minutes >= toMinutes(open) && minutes < toMinutes(close));
        let text;
        if (current) {
            text = t.openUntil(current[1]);
        } else {
            const laterToday = HOURS[day].find(([open]) => minutes < toMinutes(open));
            if (laterToday) {
                text = t.opensToday(laterToday[0]);
            } else {
                for (let offset = 1; offset <= 7; offset++) {
                    const next = (day + offset) % 7;
                    if (HOURS[next].length) {
                        const time = HOURS[next][0][0];
                        text = offset === 1 ? t.opensTomorrow(time) : t.opensOn(t.days[next], time);
                        break;
                    }
                }
            }
        }

        el.textContent = text;
        el.classList.toggle('is-open', Boolean(current));
        el.hidden = false;
    }

    document.getElementById('year').textContent = new Date().getFullYear();
    setLanguage(readSavedLang());
    setInterval(updateOpenStatus, 60000);
})();
