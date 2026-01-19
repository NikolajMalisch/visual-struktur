/* =========================================================
  Visual Struktur — Global App JS
  - Active nav highlighting (aria-current="page")
  - Mobile menu toggle
  - Sticky nav shrink + shadow
  - Footer year
  - Reveal on scroll (IntersectionObserver)
  - FAQ: single-open per .faq group
  Notes:
  - Works even if elements are missing on some pages
  - No dependencies
========================================================= */

(() => {
    "use strict";

    /* =========================
        Helpers
    ========================= */
    const qs = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const normalizePath = (p) => {
        if (!p) return "";
        p = p.split("#")[0].split("?")[0];
        p = p.replace(/^\.\//, "").replace(/^\//, "");
        return p.toLowerCase();
    };

    const getCurrentPage = () => {
        const parts = (location.pathname || "").split("/").filter(Boolean);
        const last = parts.length ? parts[parts.length - 1] : "";
        return normalizePath(last || "index.html");
    };

    /* =========================
        1) Footer Year
    ========================= */
    (() => {
        const y = qs("#year");
        if (y) y.textContent = String(new Date().getFullYear());
    })();

    /* =========================
        2) Active Navigation
        - sets aria-current="page" automatically
    ========================= */
    (() => {
        const current = getCurrentPage();

        // nav + footer links
        const links = qsa('a.nav-link, nav a[href$=".html"], footer a[href$=".html"]');

        links.forEach((a) => {
            const hrefRaw = a.getAttribute("href") || "";
            if (!hrefRaw) return;

            // ignore external links
            if (/^https?:\/\//i.test(hrefRaw)) return;

            const href = normalizePath(hrefRaw);
            const hrefParts = href.split("/").filter(Boolean);
            const hrefLast = hrefParts.length ? hrefParts[hrefParts.length - 1] : "";
            const hrefFile = hrefLast === "" ? "index.html" : hrefLast;

            if (hrefFile === current) a.setAttribute("aria-current", "page");
            else a.removeAttribute("aria-current");
        });
    })();

    /* =========================
        3) Sticky Nav: shrink + shadow
    ========================= */
    (() => {
        const nav = qs("#siteNav") || qs(".glass-header");
        if (!nav) return;

        let ticking = false;

        const update = () => {
            const y = window.scrollY || 0;
            nav.classList.toggle("nav-shrink", y > 8);
            nav.classList.toggle("nav-shadow", y > 12);
            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
    })();

    /* =========================
        4) Mobile Menu Toggle
        IDs:
        - button#mobileBtn
        - div#mobileMenu
        (fallbacks: #menuBtn / #menuMenu)
    ========================= */
    (() => {
        const btn = qs("#mobileBtn") || qs("#menuBtn");
        const menu = qs("#mobileMenu");
        if (!btn || !menu) return;

        const isOpen = () => btn.getAttribute("aria-expanded") === "true";

        const open = () => {
            menu.classList.remove("hidden");
            btn.setAttribute("aria-expanded", "true");
        };

        const close = () => {
            menu.classList.add("hidden");
            btn.setAttribute("aria-expanded", "false");
        };

        btn.addEventListener("click", () => (isOpen() ? close() : open()));

        // Close on link click
        menu.addEventListener("click", (e) => {
            const a = e.target && e.target.closest ? e.target.closest("a") : null;
            if (a) close();
        });

        // Close on ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") close();
        });

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (!isOpen()) return;
            const t = e.target;
            if (t === btn || btn.contains(t) || menu.contains(t)) return;
            close();
        });
    })();

    /* =========================
        5) Reveal on scroll
    ========================= */
    (() => {
        const items = qsa(".reveal");
        if (!items.length) return;

        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced || !("IntersectionObserver" in window)) {
            items.forEach((el) => el.classList.add("is-visible"));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add("is-visible");
                        io.unobserve(e.target);
                    }
                });
            },
            { root: null, threshold: 0.12 }
        );

        items.forEach((el) => io.observe(el));
    })();

    /* =========================
        6) FAQ: open only one per .faq group
    ========================= */
    (() => {
        qsa(".faq").forEach((faqRoot) => {
            faqRoot.addEventListener(
                "toggle",
                (e) => {
                    const t = e.target;
                    if (t && t.tagName === "DETAILS" && t.open) {
                        qsa("details", faqRoot).forEach((d) => {
                            if (d !== t) d.open = false;
                        });
                    }
                },
                true
            );
        });
    })();
})();
