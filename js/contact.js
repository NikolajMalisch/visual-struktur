(() => {
  "use strict";

  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  const pad = (n) => String(n).padStart(2, "0");
  const makeId = () => {
    const d = new Date();
    const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
    return `VS-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}-${rand}`;
  };

  const escapeHtml = (str = "") =>
    String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));

  const servicesChecked = () => qsa('input[name="service"]:checked');
  const servicesValue = () => servicesChecked().map(i => i.value).join(", ");

  function updateServicesLabel() {
    const lbl = qs("#servicesLabel");
    if (!lbl) return;

    const val = servicesValue();
    if (!val) {
      lbl.textContent = "Bitte wählen…";
      lbl.setAttribute("data-empty", "true");
    } else {
      lbl.textContent = val;
      lbl.setAttribute("data-empty", "false");
    }
  }

  const getData = (form) => {
    const fd = new FormData(form);
    return {
      inquiryId: fd.get("inquiryId") || "",
      services: servicesValue() || "—",
      timeline: fd.get("timeline") || "",
      budget: fd.get("budget") || "Noch offen",
      website: fd.get("website") || "—",
      goal: fd.get("goal") || "",
      name: fd.get("name") || "",
      email: fd.get("email") || "",
      phone: fd.get("phone") || "—",
      companyName: fd.get("companyName") || "—",
      message: fd.get("message") || "—",
      pageUrl: fd.get("pageUrl") || "",
      referrer: fd.get("referrer") || "—"
    };
  };

  const buildPrintHtml = (d) => `
    <div style="font-family:Arial,sans-serif;line-height:1.35;margin:24px">
      <h2 style="margin:0 0 8px">Projektanfrage</h2>
      <div style="color:#555;margin:0 0 10px">
        <strong>ID:</strong> ${escapeHtml(d.inquiryId)}<br/>
        <strong>Datum:</strong> ${escapeHtml(new Date().toLocaleString())}
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px;border:1px solid #ddd;background:#f7f7f7;width:32%"><strong>Leistung</strong></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(d.services)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;background:#f7f7f7"><strong>Zeitplan</strong></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(d.timeline)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;background:#f7f7f7"><strong>Budget</strong></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(d.budget)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;background:#f7f7f7"><strong>Ziel</strong></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(d.goal)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;background:#f7f7f7"><strong>Website</strong></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(d.website)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;background:#f7f7f7"><strong>Kontakt</strong></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(d.name)} · ${escapeHtml(d.email)} · ${escapeHtml(d.phone)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;background:#f7f7f7"><strong>Firma/Branche</strong></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(d.companyName)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;background:#f7f7f7"><strong>Details</strong></td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(d.message)}</td></tr>
      </table>
      <p style="color:#666;font-size:12px;margin-top:10px">
        Seite: ${escapeHtml(d.pageUrl)}<br/>
        Referrer: ${escapeHtml(d.referrer)}
      </p>
    </div>
  `;

  const openPrint = (html) => {
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    w.document.open();
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Druck</title></head><body>${html}</body></html>`);
    w.document.close();
    w.focus();
  };

  // ---------- App Picker (dialog sheets)
  function initSheets() {
    // Open sheet
    qsa("[data-open-sheet]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-open-sheet");
        const dlg = document.getElementById(id);
        if (!dlg) return;
        if (typeof dlg.showModal === "function") dlg.showModal();
      });
    });

    // Close sheet
    qsa("[data-close-sheet]").forEach(btn => {
      btn.addEventListener("click", () => btn.closest("dialog")?.close());
    });

    // Pick option (timeline/budget)
    qsa("[data-pick]").forEach(opt => {
      opt.addEventListener("click", () => {
        const type = opt.getAttribute("data-pick");   // timeline | budget
        const val = opt.getAttribute("data-value") ?? "";
        const label = opt.getAttribute("data-label") || opt.textContent.trim();

        if (type === "timeline") {
          const input = qs("#timeline");
          const lbl = qs("#timelineLabel");
          if (input) input.value = val;
          if (lbl) {
            lbl.textContent = label;
            lbl.setAttribute("data-empty", val ? "false" : "true");
          }
          qs("#timelineRow")?.classList.remove("vs-error");
          qs("#timelineError")?.classList.add("u-hidden");
        }

        if (type === "budget") {
          const input = qs("#budget");
          const lbl = qs("#budgetLabel");
          if (input) input.value = val;
          if (lbl) lbl.textContent = label;
        }

        opt.closest("dialog")?.close();
      });
    });

    // Click outside -> close (premium feel)
    qsa("dialog.vs-sheet").forEach(dlg => {
      dlg.addEventListener("click", (e) => {
        const rect = dlg.getBoundingClientRect();
        const inBox =
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!inBox) dlg.close();
      });
    });

    // Services reset
    const resetBtn = qs("#servicesReset");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        servicesChecked().forEach(i => { i.checked = false; });
        updateServicesLabel();
      });
    }

    // Services label live update
    qsa('input[name="service"]').forEach(i => {
      i.addEventListener("change", updateServicesLabel);
    });
  }

  // ---------- Validation (premium: no alerts)
  function validateServices(statusEl) {
    const any = servicesChecked().length > 0;
    const err = qs("#serviceError");
    const block = qs("#serviceBlock");

    if (!any) {
      err?.classList.remove("u-hidden");
      block?.classList.add("vs-error");
      statusEl.textContent = "Bitte mindestens eine Leistung auswählen.";
      return false;
    }

    err?.classList.add("u-hidden");
    block?.classList.remove("vs-error");
    return true;
  }

  function validateTimeline(statusEl) {
    const val = qs("#timeline")?.value?.trim();
    const row = qs("#timelineRow");
    const err = qs("#timelineError");

    if (!val) {
      row?.classList.add("vs-error");
      err?.classList.remove("u-hidden");
      statusEl.textContent = "Bitte Zeitplan auswählen.";
      return false;
    }
    row?.classList.remove("vs-error");
    err?.classList.add("u-hidden");
    return true;
  }

  function validateRequiredNative(statusEl) {
    const goal = qs("#goal");
    const name = qs("#name");
    const email = qs("#email");
    const privacy = qs("#privacy");

    if (!goal?.value?.trim()) { goal?.focus(); goal?.reportValidity?.(); statusEl.textContent = "Bitte Pflichtfelder ausfüllen."; return false; }
    if (!name?.value?.trim()) { name?.focus(); name?.reportValidity?.(); statusEl.textContent = "Bitte Pflichtfelder ausfüllen."; return false; }
    if (!email?.value?.trim()) { email?.focus(); email?.reportValidity?.(); statusEl.textContent = "Bitte Pflichtfelder ausfüllen."; return false; }
    if (!privacy?.checked) { privacy?.focus(); privacy?.reportValidity?.(); statusEl.textContent = "Bitte Datenschutz bestätigen."; return false; }

    return true;
  }

  // ---------- Init
  document.addEventListener("DOMContentLoaded", () => {
    const form = qs("#contactForm");
    if (!form) return;

    const idEl = qs("#inquiryId");
    const urlEl = qs("#pageUrl");
    const refEl = qs("#referrer");
    const statusEl = qs("#formStatus");
    const printBtn = qs("#printBtn");

    if (idEl) idEl.value = makeId();
    if (urlEl) urlEl.value = window.location.href;
    if (refEl) refEl.value = document.referrer || "";

    initSheets();
    updateServicesLabel();

    // print
    printBtn?.addEventListener("click", () => {
      const d = getData(form);
      if (!d.inquiryId) d.inquiryId = makeId();
      openPrint(buildPrintHtml(d));
    });

    // clear service error when user changes something
    qsa('input[name="service"]').forEach(i => {
      i.addEventListener("change", () => {
        qs("#serviceError")?.classList.add("u-hidden");
        qs("#serviceBlock")?.classList.remove("vs-error");
        if ((statusEl.textContent || "").includes("Leistung")) statusEl.textContent = "";
      });
    });

    // submit (UX validation only; EmailJS later)
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      statusEl.textContent = "";

      // Honeypot
      const hp = qs("#hp_company");
      if (hp && hp.value) return;

      const ok1 = validateServices(statusEl);
      const ok2 = validateTimeline(statusEl);
      const ok3 = validateRequiredNative(statusEl);

      if (!(ok1 && ok2 && ok3)) return;

      statusEl.textContent = "Formular ist bereit. Nächster Schritt: EmailJS/Sheets подключение.";
    });
  });

})();
