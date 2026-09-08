/**
 * GK8 DASHBOARD — SPA
 * Page Switching · Country Carousel · Background Theme Switch
 * Navbar · Search · Toast
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Refs ──────────────────────────────────────────────── */
    const bgPrev        = document.getElementById('bgPrev');
    const bgNext        = document.getElementById('bgNext');

    const navMenu       = document.getElementById('navMenu');
    const hamburgerBtn  = document.getElementById('hamburgerBtn');
    const mobileOverlay = document.getElementById('mobileOverlay');

    const searchBtn      = document.getElementById('searchBtn');
    const searchModal    = document.getElementById('searchModal');
    const searchInput    = document.getElementById('searchInput');
    const searchCloseBtn = document.getElementById('searchCloseBtn');

    const countryViewport = document.getElementById('countryViewport');
    const countryTrack    = document.getElementById('countryTrack');
    const countryItems    = document.querySelectorAll('.country-item');
    const btnArrowUp      = document.getElementById('btnArrowUp');
    const btnArrowDown    = document.getElementById('btnArrowDown');

    const toastNotification = document.getElementById('toastNotification');
    const btnGabung         = document.getElementById('btnGabung');
    const btnSponsor        = document.getElementById('btnSponsor');

    /* ── Page Theme Map ────────────────────────────────────── */
    const PAGE_THEMES = {
        beranda:   'radial-gradient(ellipse 120% 150% at 60% 40%, #f0ffcc 0%, #d4f05a 28%, #b8e02a 65%, #96cc18 100%)',
        tentang:   'radial-gradient(ellipse 120% 150% at 60% 40%, #e8f4ff 0%, #b3d9ff 28%, #7ab8ff 60%, #4a96e8 100%)',
        ketentuan: 'radial-gradient(ellipse 120% 150% at 60% 40%, #f5f0ff 0%, #ddd0ff 28%, #b8a0f8 60%, #9070e8 100%)',
        alternatif:'radial-gradient(ellipse 120% 150% at 60% 40%, #fffde8 0%, #fff5a0 28%, #ffe566 65%, #ffd020 100%)',
    };

    /* ── Country themes (used inside Beranda only) ─────────── */
    const COUNTRY_THEMES = {
        id:     'radial-gradient(ellipse 120% 150% at 60% 40%, #ffffff 0%, #dbeafe 25%, #93c5fd 55%, #3b82f6 100%)',
        my:     'radial-gradient(ellipse 120% 150% at 60% 40%, #ffffff 0%, #fff2cc 25%, #ffd966 55%, #e8a100 100%)',
        sg:     'radial-gradient(ellipse 120% 150% at 60% 40%, #f0ffcc 0%, #d4f05a 28%, #b8e02a 65%, #96cc18 100%)',
        th:     'radial-gradient(ellipse 120% 150% at 60% 40%, #ffffff 0%, #eedcff 25%, #d9b8ff 55%, #be8fff 100%)',
        vn:     'radial-gradient(ellipse 120% 150% at 60% 40%, #ffffff 0%, #ffe0e0 25%, #ff9e9e 55%, #ef4444 100%)',
        crypto: 'radial-gradient(ellipse 120% 150% at 60% 40%, #ffffff 0%, #fff8d6 25%, #ffe99a 55%, #ffd740 100%)',
    };

    /* Accent colors per country — for flag ring, arrows, text */
    const COUNTRY_ACCENTS = {
        id:     { ring: 'rgba(59,130,246,0.95)',  text: '#1e3a8a', arrowBg: 'linear-gradient(145deg, #60a5fa 0%, #3b82f6 100%)', arrowText: '#ffffff' },
        my:     { ring: 'rgba(232,161,0,0.95)',   text: '#7c2d12', arrowBg: 'linear-gradient(145deg, #ffd66b 0%, #e8a100 100%)', arrowText: '#422006' },
        sg:     { ring: 'rgba(150,204,24,0.95)',  text: '#3f6212', arrowBg: 'linear-gradient(145deg, #c2df50 0%, #96cc1c 100%)', arrowText: '#1a2e05' },
        th:     { ring: 'rgba(190,143,255,0.95)', text: '#581c87', arrowBg: 'linear-gradient(145deg, #d6b3ff 0%, #a878f0 100%)', arrowText: '#2e1065' },
        vn:     { ring: 'rgba(239,68,68,0.95)',   text: '#7f1d1d', arrowBg: 'linear-gradient(145deg, #ff9090 0%, #ef4444 100%)', arrowText: '#ffffff' },
        crypto: { ring: 'rgba(255,215,64,0.95)',  text: '#78350f', arrowBg: 'linear-gradient(145deg, #ffe170 0%, #f7b500 100%)', arrowText: '#451a03' },
    };

    const DEFAULT_CODE = 'id';
    let isSwitching = false;
    let switchTimer = null;
    let currentPage = 'beranda';

    /* Initialise both layers to default Indonesia (blue) country theme */
    const INITIAL_BG = COUNTRY_THEMES[DEFAULT_CODE] || PAGE_THEMES.beranda;
    bgPrev.style.background = INITIAL_BG;
    bgNext.style.background = INITIAL_BG;
    bgNext.style.opacity    = '0';

    /* ── Background crossfade helper ──────────────────────── */
    function crossfadeBg(newBg) {
        if (isSwitching && switchTimer) {
            clearTimeout(switchTimer);
            bgPrev.style.transition = 'none';
            bgNext.style.transition = 'none';
            bgPrev.style.background = bgNext.style.background;
            bgNext.style.opacity    = '0';
            requestAnimationFrame(() => {
                bgPrev.style.transition = '';
                bgNext.style.transition = '';
            });
        }
        isSwitching = true;
        bgNext.style.background = newBg;
        bgNext.style.opacity    = '1';
        switchTimer = setTimeout(() => {
            bgPrev.style.background = newBg;
            bgNext.style.opacity    = '0';
            isSwitching = false;
        }, 900);
    }

    /* ── Page Switching ────────────────────────────────────── */
    function switchPage(pageId) {
        if (pageId === currentPage) return;
        currentPage = pageId;

        /* Hide all pages */
        document.querySelectorAll('.page-section').forEach(p => { p.hidden = true; });

        /* Show target page */
        const target = document.getElementById('page-' + pageId);
        if (target) target.hidden = false;

        /* Update nav active state */
        document.querySelectorAll('.nav-item[data-page]').forEach(a => {
            a.classList.toggle('active', a.dataset.page === pageId);
        });

        /* Switch background */
        let bg = PAGE_THEMES[pageId] || PAGE_THEMES.beranda;
        /* If switching back to beranda, use current country theme + accents */
        if (pageId === 'beranda') {
            const code = countryItems[currentIndex]?.dataset.code || DEFAULT_CODE;
            bg = COUNTRY_THEMES[code] || COUNTRY_THEMES[DEFAULT_CODE];
            applyCountryAccents(code);
        }
        crossfadeBg(bg);

        /* Scroll to top */
        window.scrollTo({ top: 0, behavior: 'smooth' });

        /* Re-trigger reveal animations on new page */
        setTimeout(() => {
            const winH = window.innerHeight;
            document.querySelectorAll('#page-' + pageId + ' .reveal').forEach(el => {
                el.classList.remove('visible');
                const r = el.getBoundingClientRect();
                if (r.top < winH * 0.88) el.classList.add('visible');
            });
        }, 120);
    }

    /* Wire nav links (data-page) */
    document.querySelectorAll('.nav-item[data-page], .footer-link[data-page]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            switchPage(link.dataset.page);
            closeMenu();
        });
    });

    /* Logo click → beranda */
    document.getElementById('mainLogo')?.addEventListener('click', e => {
        e.preventDefault();
        switchPage('beranda');
    });

    /* ── Country Carousel ──────────────────────────────────── */
    let currentIndex = 0;   /* default: Indonesia */
    const total  = countryItems.length;
    const ITEM_H = 96;

    function updateCarousel(animate = true) {
        if (!countryViewport || !countryTrack || total === 0) return;

        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            /* Horizontal carousel */
            const vpW    = countryViewport.clientWidth || 300;
            const itemW  = 80;
            const offset = (vpW / 2) - (currentIndex * itemW + itemW / 2);

            countryTrack.style.transition = animate
                ? 'transform 0.44s cubic-bezier(0.22, 1, 0.36, 1)'
                : 'none';
            countryTrack.style.transform = `translateX(${offset}px)`;
        } else {
            /* Vertical carousel */
            const vpH    = countryViewport.clientHeight || 300;
            const offset = (vpH / 2) - (currentIndex * ITEM_H + ITEM_H / 2);

            countryTrack.style.transition = animate
                ? 'transform 0.44s cubic-bezier(0.22, 1, 0.36, 1)'
                : 'none';
            countryTrack.style.transform = `translateY(${offset}px)`;
        }

        countryItems.forEach((item, i) => {
            const dist = Math.abs(i - currentIndex);
            item.classList.toggle('active', i === currentIndex);
            if (i === currentIndex) {
                item.style.opacity   = '1';
                item.style.transform = 'scale(1.06)';
            } else if (dist === 1) {
                item.style.opacity   = '0.50';
                item.style.transform = 'scale(0.87)';
            } else if (dist === 2) {
                item.style.opacity   = '0.20';
                item.style.transform = 'scale(0.78)';
            } else {
                item.style.opacity   = '0';
                item.style.transform = 'scale(0.68)';
            }
        });
    }

    function applyCountryTheme(code) {
        /* Only crossfade if we're on Beranda */
        if (currentPage !== 'beranda') return;
        const bg = COUNTRY_THEMES[code] || COUNTRY_THEMES[DEFAULT_CODE];
        crossfadeBg(bg);
    }

    function applyCountryAccents(code) {
        const accents = COUNTRY_ACCENTS[code] || COUNTRY_ACCENTS[DEFAULT_CODE];
        /* Apply CSS variables to root so all country-picker elements inherit */
        document.documentElement.style.setProperty('--country-accent', accents.ring);
        document.documentElement.style.setProperty('--country-text',  accents.text);
        document.documentElement.style.setProperty('--arrow-bg',      accents.arrowBg);
        document.documentElement.style.setProperty('--arrow-text',    accents.arrowText);
    }

    function selectCountry(index) {
        currentIndex = index;
        updateCarousel();
        const code = countryItems[index]?.dataset.code || DEFAULT_CODE;
        applyCountryTheme(code);
        applyCountryAccents(code);
        const name = countryItems[index]?.querySelector('.country-name')?.textContent || '';
        if (name) showToast(`Wilayah dipilih: ${name}`);
    }

    function prevCountry() { selectCountry(currentIndex > 0 ? currentIndex - 1 : total - 1); }
    function nextCountry() { selectCountry(currentIndex < total - 1 ? currentIndex + 1 : 0); }

    btnArrowUp?.addEventListener('click',   e => { e.preventDefault(); prevCountry(); });
    btnArrowDown?.addEventListener('click', e => { e.preventDefault(); nextCountry(); });

    countryItems.forEach((item, i) => {
        item.addEventListener('click', () => { if (currentIndex !== i) selectCountry(i); });
    });

    if (countryViewport) {
        let wheelLock = false;
        countryViewport.addEventListener('wheel', e => {
            e.preventDefault();
            if (wheelLock) return;
            wheelLock = true;
            e.deltaY < 0 ? prevCountry() : nextCountry();
            setTimeout(() => { wheelLock = false; }, 320);
        }, { passive: false });
    }

    window.addEventListener('keydown', e => {
        if (document.activeElement === searchInput) return;
        if (e.key === 'ArrowUp')   prevCountry();
        if (e.key === 'ArrowDown') nextCountry();
    });

    /* Initialise accent colors to default Indonesia */
    applyCountryAccents(DEFAULT_CODE);
    window.addEventListener('resize', () => updateCarousel(false));
    updateCarousel(false);

    /* ── Mobile Navbar ─────────────────────────────────────── */
    function openMenu() {
        navMenu?.classList.add('open');
        hamburgerBtn?.classList.add('open');
        mobileOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        navMenu?.classList.remove('open');
        hamburgerBtn?.classList.remove('open');
        mobileOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }
    hamburgerBtn?.addEventListener('click', () =>
        navMenu?.classList.contains('open') ? closeMenu() : openMenu()
    );
    mobileOverlay?.addEventListener('click', closeMenu);

    /* ── Search Modal ──────────────────────────────────────── */
    function openSearch() {
        searchModal?.classList.add('active');
        setTimeout(() => searchInput?.focus(), 140);
    }
    function closeSearch() {
        searchModal?.classList.remove('active');
        if (searchInput) searchInput.value = '';
    }
    searchBtn?.addEventListener('click', openSearch);
    searchCloseBtn?.addEventListener('click', closeSearch);
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && searchModal?.classList.contains('active')) closeSearch();
    });
    searchInput?.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const q = searchInput.value.trim();
            if (q) { showToast(`Mencari: "${q}"`); closeSearch(); }
        }
    });

    /* ── CTAs ──────────────────────────────────────────────── */
    btnGabung?.addEventListener('click', e => {
        e.preventDefault();
        showToast('Membuka formulir pendaftaran GK8...');
    });
    btnSponsor?.addEventListener('click', e => {
        e.preventDefault();
        showToast('Informasi Sponsorship Resmi GK8 × Michael Owen');
    });

    /* ── Toast ─────────────────────────────────────────────── */
    let toastTimer = null;
    function showToast(msg) {
        if (!toastNotification) return;
        toastNotification.textContent = msg;
        toastNotification.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastNotification.classList.remove('show'), 2800);
    }

    /* ── Scroll-based background sections ─────────────────── */
    const SCROLL_BG = [
        /* selector dalam page-beranda → bg gradient */
        { sel: '.main-content',        bg: null },          /* hero: pakai warna negara aktif */
        { sel: '.ambassador-section',  bg: 'radial-gradient(ellipse 120% 150% at 60% 40%, #fff8ec 0%, #ffe4b8 28%, #ffcc70 65%, #e08c20 100%)' },
        { sel: '.why-section',         bg: 'radial-gradient(ellipse 120% 150% at 40% 50%, #f5efff 0%, #d8c8ff 28%, #b290f0 60%, #7c4ddc 100%)' },
        { sel: '.commission-section',  bg: 'radial-gradient(ellipse 120% 150% at 60% 40%, #e8fff8 0%, #a8f0e0 28%, #50dcc0 60%, #10b898 100%)' },
        { sel: '.stats-section',       bg: 'radial-gradient(ellipse 120% 150% at 60% 40%, #fff5f5 0%, #ffe0e8 28%, #ffb8cc 60%, #ff80a8 100%)' },
        { sel: '.testi-section',       bg: 'radial-gradient(ellipse 120% 150% at 50% 40%, #ffe0f0 0%, #ffb3d9 28%, #ff80bf 60%, #f050a0 100%)' },
        { sel: '.license-section',     bg: 'radial-gradient(ellipse 120% 150% at 60% 40%, #e0f2ff 0%, #a8d8f5 28%, #60b5e0 60%, #2080c0 100%)' },
    ];

    let lastScrollBg = null;

    /* ── Smart Header (hide on scroll down, show on scroll up) ── */
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let headerTicking = false;

    function updateHeader() {
        const currentScrollY = window.scrollY;

        /* Add frosted glass after 10px scroll */
        if (currentScrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
        headerTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!headerTicking) {
            requestAnimationFrame(updateHeader);
            headerTicking = true;
        }
    }, { passive: true });

    /* Init */
    updateHeader();
    function onScroll() {
        const winH    = window.innerHeight;
        const scrollY = window.scrollY;

        /* Reveal elements in currently visible page */
        document.querySelectorAll('#page-' + currentPage + ' .reveal:not(.visible)').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < winH * 0.88) el.classList.add('visible');
        });

        /* Scroll-based background — only on beranda */
        if (currentPage !== 'beranda') return;

        /* Find the LAST section whose top has entered the viewport — triggers immediately on entry */
        let activeBg = null;

        for (const s of SCROLL_BG) {
            const el = document.querySelector('#page-beranda ' + s.sel);
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            /* As soon as the top edge enters viewport, this becomes the active bg */
            if (rect.top < winH) {
                activeBg = s.bg;
            }
        }

        /* If hero section is active, use the current country theme */
        if (activeBg === null) {
            const code = countryItems[currentIndex]?.dataset.code || DEFAULT_CODE;
            activeBg   = COUNTRY_THEMES[code] || COUNTRY_THEMES[DEFAULT_CODE];
        }

        /* Only crossfade when bg actually changes */
        if (activeBg !== lastScrollBg) {
            lastScrollBg = activeBg;
            crossfadeBg(activeBg);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* run once on load */

    /* Ensure beranda is shown on load */
    document.querySelectorAll('.page-section').forEach(p => { p.hidden = true; });
    const berandaPage = document.getElementById('page-beranda');
    if (berandaPage) berandaPage.hidden = false;
    currentPage = 'beranda';
    onScroll();

});
