/* =====================================================================
   Anant Gupta — Portfolio interactivity (progressive enhancement).
   The page is fully readable with JS disabled; this only enhances:
     1. Scroll-spy — highlights the active section in the sidebar nav.
     2. Stack explorer — click a layer to swap the detail panel.
   No framework, no build step. ~40 lines of real work.
   ===================================================================== */
(function () {
  "use strict";

  /* ---- 1. Scroll-spy nav ------------------------------------------ */
  var navLinks = document.querySelectorAll(".nav-link");
  var byId = {};
  navLinks.forEach(function (a) { byId[a.getAttribute("data-nav")] = a; });

  var sections = document.querySelectorAll("section[id]");
  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove("is-active"); });
        var active = byId[e.target.id];
        if (active) active.classList.add("is-active");
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- 2. Stack explorer ------------------------------------------ */
  var dataEl = document.getElementById("layers-data");
  var detail = document.getElementById("layer-detail");
  var rows = document.querySelectorAll(".layer-row");
  if (dataEl && detail && rows.length) {
    var layers = JSON.parse(dataEl.textContent);
    var fields = {};
    detail.querySelectorAll("[data-field]").forEach(function (el) {
      fields[el.getAttribute("data-field")] = el;
    });

    function select(i) {
      var L = layers[i];
      if (!L) return;
      rows.forEach(function (r) {
        r.toggleAttribute("data-active", Number(r.getAttribute("data-layer")) === i);
      });
      if (fields.num)  fields.num.textContent  = String(i + 1).padStart(2, "0");
      if (fields.tier) fields.tier.textContent = L.label;
      if (fields.name) fields.name.textContent = L.name;
      if (fields.body) fields.body.textContent = L.body;
      if (fields.tags) fields.tags.textContent = L.tags;
    }

    rows.forEach(function (r) {
      r.addEventListener("click", function () {
        select(Number(r.getAttribute("data-layer")));
      });
    });
  }
})();
