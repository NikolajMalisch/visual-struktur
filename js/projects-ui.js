// =============================================================================
// PROJECTS UI — PREMIUM VERSION
// Moderne Animationen + Hover-Effekte + Professionelle UX
// =============================================================================

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------------------------------------------------------------------------
  // FILTER LOGIC — MIT SMOOTH TRANSITIONS
  // ---------------------------------------------------------------------------
  function initProjectFilter() {
    const filterBtns = $$(".proj-filter");
    const cards = $$(".proj-card");

    if (!filterBtns.length || !cards.length) return;

    function setActive(el) {
      filterBtns.forEach(b => {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      el.classList.add("is-active");
      el.setAttribute("aria-pressed", "true");
    }

    function matches(card, filter) {
      if (filter === "all") return true;
      const cats = (card.dataset.cats || "").split(/\s+/).filter(Boolean);
      return cats.includes(filter);
    }

    // SMOOTH FADE-IN/OUT beim Filtern
    function filterCards(filter) {
      cards.forEach(card => {
        const shouldShow = matches(card, filter);
        
        if (shouldShow) {
          // Fade in
          card.style.display = "";
          requestAnimationFrame(() => {
            card.style.opacity = "0";
            card.style.transform = "scale(0.95)";
            requestAnimationFrame(() => {
              card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
            });
          });
        } else {
          // Fade out
          card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    }

    filterBtns.forEach(b => {
      b.addEventListener("click", () => {
        const f = b.dataset.filter || "all";
        setActive(b);
        filterCards(f);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // IMAGE HOVER ZOOM — Приближение картинки при наведении
  // ---------------------------------------------------------------------------
  function initImageHoverZoom() {
    const projImages = $$(".proj-card img, .proj-thumb");
    
    projImages.forEach(img => {
      const wrapper = img.parentElement;
      
      // Добавляем overflow: hidden для wrapper
      if (wrapper) {
        wrapper.style.overflow = "hidden";
        wrapper.style.borderRadius = "inherit";
      }
      
      // Плавный zoom при hover
      img.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      
      const parent = img.closest(".proj-card") || wrapper;
      
      parent.addEventListener("mouseenter", () => {
        img.style.transform = "scale(1.08)";
      });
      
      parent.addEventListener("mouseleave", () => {
        img.style.transform = "scale(1)";
      });
    });
  }

  // ---------------------------------------------------------------------------
  // DRAWER (SLIDE-OVER PANEL) — PREMIUM VERSION
  // ---------------------------------------------------------------------------
  function initProjectDrawer() {
    const overlay = $("#caseOverlay");
    const panel = $("#casePanel");
    const backdrop = $("#caseBackdrop");
    const closeBtn = $("#caseClose");

    if (!overlay || !panel) return;

    // Content elements
    const caseKicker = $("#caseKicker");
    const caseTitle = $("#caseTitle");
    const caseSub = $("#caseSub");
    const caseImg = $("#caseImg");
    const caseGoal = $("#caseGoal");
    const caseBullets = $("#caseBullets");
    const caseStack = $("#caseStack");
    const caseBranding = $("#caseBranding");
    const caseBrandingGrid = $("#caseBrandingGrid");
    const caseLinksWrap = $("#caseLinksWrap");
    const caseLink = $("#caseLink");

    // Required guards
    const required = [
      closeBtn, caseKicker, caseTitle, caseSub, caseImg,
      caseGoal, caseBullets, caseStack, caseLinksWrap, caseLink
    ];

    if (required.some(x => !x)) {
      console.error("Projects Drawer: missing required elements");
      return;
    }

    let lastFocused = null;

    function isOpen() {
      return !overlay.classList.contains("hidden");
    }

    // -------------------------------------------------------------------------
    // OPEN DRAWER — MIT STAGGER ANIMATION
    // -------------------------------------------------------------------------
    function openDrawer(key) {
      const data = (window.PROJECTS || {})[key];
      if (!data) {
        console.warn("Project key not found:", key);
        return;
      }

      lastFocused = document.activeElement;

      // Base content
      caseKicker.textContent = data.kicker || "Case Study";
      caseTitle.textContent = data.title || "—";
      caseSub.textContent = data.sub || "—";
      caseGoal.textContent = data.goal || "—";

      // Main image mit Zoom-Effekt
      if (data.img) {
        caseImg.src = data.img;
        caseImg.alt = data.imgAlt || data.title || "Case Visual";
        caseImg.classList.remove("hidden");
        
        // Hover zoom für main image
        caseImg.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        caseImg.addEventListener("mouseenter", () => {
          caseImg.style.transform = "scale(1.05)";
        });
        caseImg.addEventListener("mouseleave", () => {
          caseImg.style.transform = "scale(1)";
        });
      } else {
        caseImg.classList.add("hidden");
        caseImg.removeAttribute("src");
        caseImg.alt = "";
      }

      // Bullets mit Stagger Animation
      caseBullets.innerHTML = "";
      (data.bullets || []).forEach((txt, idx) => {
        const li = document.createElement("li");
        li.textContent = "• " + txt;
        li.style.opacity = "0";
        li.style.transform = "translateX(-10px)";
        li.style.transition = `opacity 0.3s ease ${idx * 0.05}s, transform 0.3s ease ${idx * 0.05}s`;
        caseBullets.appendChild(li);
        
        // Trigger animation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            li.style.opacity = "1";
            li.style.transform = "translateX(0)";
          });
        });
      });

      // Stack tags mit Stagger
      caseStack.innerHTML = "";
      (data.stack || []).forEach((tag, idx) => {
        const span = document.createElement("span");
        span.className = "panel rounded-full px-3 py-1";
        span.textContent = tag;
        span.style.opacity = "0";
        span.style.transform = "scale(0.9)";
        span.style.transition = `opacity 0.3s ease ${idx * 0.05}s, transform 0.3s ease ${idx * 0.05}s`;
        caseStack.appendChild(span);
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            span.style.opacity = "1";
            span.style.transform = "scale(1)";
          });
        });
      });

      // Branding assets mit Hover Zoom
      if (caseBranding && caseBrandingGrid) {
        const items = Array.isArray(data.branding) ? data.branding : [];
        if (items.length) {
          caseBrandingGrid.innerHTML = "";
          items.forEach((item, idx) => {
            if (!item?.src) return;

            const wrapper = document.createElement("div");
            wrapper.className = "block overflow-hidden rounded-xl";
            wrapper.style.opacity = "0";
            wrapper.style.transform = "translateY(10px)";
            wrapper.style.transition = `opacity 0.4s ease ${idx * 0.08}s, transform 0.4s ease ${idx * 0.08}s`;

            const a = document.createElement("a");
            a.href = item.src;
            a.target = "_blank";
            a.rel = "noopener";
            a.className = "block";

            const img = document.createElement("img");
            img.src = item.src;
            img.alt = item.alt || "";
            img.className = "block w-full h-32 object-cover panel";
            img.loading = "lazy";
            img.decoding = "async";
            img.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

            // Hover zoom
            wrapper.addEventListener("mouseenter", () => {
              img.style.transform = "scale(1.1)";
            });
            wrapper.addEventListener("mouseleave", () => {
              img.style.transform = "scale(1)";
            });

            a.appendChild(img);
            wrapper.appendChild(a);
            caseBrandingGrid.appendChild(wrapper);

            // Trigger animation
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                wrapper.style.opacity = "1";
                wrapper.style.transform = "translateY(0)";
              });
            });
          });

          caseBranding.classList.remove("hidden");
        } else {
          caseBranding.classList.add("hidden");
        }
      }

      // Link
      if (data.link) {
        caseLink.href = data.link;
        caseLink.textContent = data.linkLabel || "Website ansehen →";
        caseLinksWrap.classList.remove("hidden");
      } else {
        caseLinksWrap.classList.add("hidden");
        caseLink.href = "#";
        caseLink.textContent = "";
      }

      // Show overlay mit Backdrop Fade
      overlay.classList.remove("hidden");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("overflow-hidden");

      // Backdrop fade in
      if (backdrop) {
        backdrop.style.opacity = "0";
        backdrop.style.transition = "opacity 0.3s ease";
        requestAnimationFrame(() => {
          backdrop.style.opacity = "1";
        });
      }

      // Panel slide in
      requestAnimationFrame(() => {
        panel.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
        panel.classList.remove("translate-x-full");
        
        setTimeout(() => {
          closeBtn.focus();
        }, 100);
      });
    }

    // -------------------------------------------------------------------------
    // CLOSE DRAWER — SMOOTH EXIT
    // -------------------------------------------------------------------------
    function closeDrawer() {
      if (!isOpen()) return;

      // Panel slide out
      panel.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.6, 1)";
      panel.classList.add("translate-x-full");
      
      // Backdrop fade out
      if (backdrop) {
        backdrop.style.opacity = "0";
      }

      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("overflow-hidden");

      let closed = false;
      const finish = () => {
        if (closed) return;
        closed = true;
        overlay.classList.add("hidden");
        panel.removeEventListener("transitionend", finish);
        if (lastFocused && typeof lastFocused.focus === "function") {
          lastFocused.focus();
        }
      };

      panel.addEventListener("transitionend", finish, { once: true });
      setTimeout(finish, 350);
    }

    // -------------------------------------------------------------------------
    // EVENT LISTENERS
    // -------------------------------------------------------------------------
    $$(".proj-open").forEach(btn => {
      btn.addEventListener("click", () => openDrawer(btn.dataset.project));
    });

    if (backdrop) backdrop.addEventListener("click", closeDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

    window.addEventListener("keydown", (e) => {
      if (!isOpen()) return;
      if (e.key === "Escape") closeDrawer();
    });
  }

  // ---------------------------------------------------------------------------
  // CARD HOVER EFFECTS — Premium Lift & Shadow
  // ---------------------------------------------------------------------------
  function initCardHoverEffects() {
    const cards = $$(".proj-card");
    
    cards.forEach(card => {
      card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-4px)";
      });
      
      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });
    });
  }

  // ---------------------------------------------------------------------------
  // INIT — Alle Features
  // ---------------------------------------------------------------------------
  function init() {
    if (typeof window.PROJECTS === "undefined") {
      console.error("PROJECTS not loaded! Include projects-data.js first");
      return;
    }
    
    initProjectFilter();
    initProjectDrawer();
    initImageHoverZoom();
    initCardHoverEffects();
    
    console.log("✅ Projects UI loaded — Premium animations active");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();