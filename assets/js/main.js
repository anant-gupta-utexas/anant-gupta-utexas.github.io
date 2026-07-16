/* =====================================================================
   Anant Gupta — Portfolio interactivity (progressive enhancement).
   The page is fully readable with JS disabled; this only enhances:
     1. Scroll-spy — highlights the active section in the sidebar nav.
     2. Stack explorer — click OR arrow-key a layer to swap the panel.
     3. Theme toggle — light/dark, remembered, follows OS by default.
     4. Command palette (Cmd/Ctrl+K) — jump to sections, open repos.
   No framework, no build step.
   ===================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Scroll-spy nav ------------------------------------------ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
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

  /* ---- 2. Stack explorer (click + keyboard + smooth swap) --------- */
  var dataEl = document.getElementById("layers-data");
  var detail = document.getElementById("layer-detail");
  var rows = Array.prototype.slice.call(document.querySelectorAll(".layer-row"));
  if (dataEl && detail && rows.length) {
    var layers = JSON.parse(dataEl.textContent);
    var fields = {};
    detail.querySelectorAll("[data-field]").forEach(function (el) {
      fields[el.getAttribute("data-field")] = el;
    });

    function currentIndex() {
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].hasAttribute("data-active")) return i;
      }
      return 0;
    }

    function select(i, focusRow) {
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
      // smooth panel swap (respects reduced-motion via CSS)
      detail.classList.remove("swap");
      void detail.offsetWidth;           // reflow so the animation replays
      detail.classList.add("swap");
      if (focusRow && rows[i]) rows[i].focus();
    }

    rows.forEach(function (r, i) {
      r.addEventListener("click", function () { select(i); });
      r.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault(); select(Math.min(rows.length - 1, currentIndex() + 1), true);
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault(); select(Math.max(0, currentIndex() - 1), true);
        } else if (e.key === "Home") {
          e.preventDefault(); select(0, true);
        } else if (e.key === "End") {
          e.preventDefault(); select(rows.length - 1, true);
        }
      });
    });
  }

  /* ---- 3. Theme toggle -------------------------------------------- */
  var toggle = document.getElementById("theme-toggle");
  function applyLabel() {
    var isDark = root.getAttribute("data-theme") === "dark";
    var label = toggle && toggle.querySelector(".theme-toggle-label");
    if (label) label.textContent = isDark ? "Light" : "Dark";
    if (toggle) toggle.setAttribute("aria-pressed", String(isDark));
  }
  if (toggle) {
    applyLabel();
    toggle.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) { root.removeAttribute("data-theme"); }
      else { root.setAttribute("data-theme", "dark"); }
      try { localStorage.setItem("theme", isDark ? "light" : "dark"); } catch (e) {}
      applyLabel();
    });
    // If the user hasn't chosen explicitly, track OS changes live.
    try {
      matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (localStorage.getItem("theme")) return;
        if (e.matches) root.setAttribute("data-theme", "dark");
        else root.removeAttribute("data-theme");
        applyLabel();
      });
    } catch (e) {}
  }

  /* ---- 4. Command palette (Cmd/Ctrl+K) ---------------------------- */
  var palette = document.getElementById("cmdk");
  if (palette) {
    var input = palette.querySelector(".cmdk-input");
    var listEl = palette.querySelector(".cmdk-list");
    var toast = document.getElementById("cmdk-toast");

    function go(id) {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
    function copyEmail() {
      var email = "anant.gupta@utexas.edu";
      if (navigator.clipboard) navigator.clipboard.writeText(email).catch(function () {});
      flash("Copied " + email);
    }
    function flash(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add("show");
      clearTimeout(flash._t);
      flash._t = setTimeout(function () { toast.classList.remove("show"); }, 1600);
    }

    var COMMANDS = [
      { label: "About", hint: "section", run: function () { go("s-about"); } },
      { label: "How I Think", hint: "section", run: function () { go("s-think"); } },
      { label: "The Climb", hint: "section", run: function () { go("s-climb"); } },
      { label: "Work", hint: "section", run: function () { go("s-work"); } },
      { label: "Builds", hint: "section", run: function () { go("s-builds"); } },
      { label: "Staying Ahead", hint: "section", run: function () { go("s-ahead"); } },
      { label: "The Stack", hint: "section", run: function () { go("s-stack"); } },
      { label: "Contact", hint: "section", run: function () { go("s-contact"); } },
      { label: "Open plumb repo", hint: "github ↗", run: function () { window.open("https://github.com/anant-gupta-utexas/plumb", "_blank"); } },
      { label: "Open atlas repo", hint: "github ↗", run: function () { window.open("https://github.com/anant-gupta-utexas/atlas", "_blank"); } },
      { label: "Open content-pipeline repo", hint: "github ↗", run: function () { window.open("https://github.com/anant-gupta-utexas/content-pipeline", "_blank"); } },
      { label: "Open slo-recommendation repo", hint: "github ↗", run: function () { window.open("https://github.com/anant-gupta-utexas/slo-recommendation-engine", "_blank"); } },
      { label: "All repos on GitHub", hint: "github ↗", run: function () { window.open("https://github.com/anant-gupta-utexas", "_blank"); } },
      { label: "Copy email address", hint: "clipboard", run: copyEmail },
      { label: "Toggle theme", hint: "light / dark", run: function () { if (toggle) toggle.click(); } }
    ];

    var filtered = COMMANDS.slice();
    var sel = 0;

    function render() {
      listEl.innerHTML = "";
      if (!filtered.length) {
        var empty = document.createElement("li");
        empty.className = "cmdk-empty";
        empty.textContent = "No matches";
        listEl.appendChild(empty);
        return;
      }
      filtered.forEach(function (c, i) {
        var li = document.createElement("li");
        li.className = "cmdk-item";
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", i === sel ? "true" : "false");
        li.innerHTML = '<span class="cmdk-label"></span><span class="cmdk-hint"></span>';
        li.querySelector(".cmdk-label").textContent = c.label;
        li.querySelector(".cmdk-hint").textContent = c.hint;
        li.addEventListener("click", function () { c.run(); close(); });
        li.addEventListener("mousemove", function () {
          if (sel === i) return; sel = i; paintSel();
        });
        listEl.appendChild(li);
      });
    }
    function paintSel() {
      var items = listEl.querySelectorAll(".cmdk-item");
      items.forEach(function (el, i) {
        el.setAttribute("aria-selected", i === sel ? "true" : "false");
      });
      var cur = items[sel];
      if (cur) cur.scrollIntoView({ block: "nearest" });
    }
    function applyFilter() {
      var q = input.value.trim().toLowerCase();
      filtered = q ? COMMANDS.filter(function (c) { return c.label.toLowerCase().indexOf(q) !== -1; }) : COMMANDS.slice();
      sel = 0; render();
    }
    function open() {
      palette.hidden = false;
      requestAnimationFrame(function () { palette.classList.add("open"); });
      input.value = ""; filtered = COMMANDS.slice(); sel = 0; render();
      setTimeout(function () { input.focus(); }, 20);
    }
    function close() {
      palette.classList.remove("open");
      var done = function () { palette.hidden = true; palette.removeEventListener("transitionend", done); };
      if (reduceMotion) { palette.hidden = true; }
      else { palette.addEventListener("transitionend", done); }
    }
    function isOpen() { return !palette.hidden && palette.classList.contains("open"); }

    input.addEventListener("input", applyFilter);
    palette.addEventListener("click", function (e) { if (e.target === palette) close(); });

    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); isOpen() ? close() : open(); return;
      }
      if (!isOpen()) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(filtered.length - 1, sel + 1); paintSel(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); paintSel(); }
      else if (e.key === "Enter" && filtered[sel]) { e.preventDefault(); filtered[sel].run(); close(); }
    });

    // Expose an opener for the optional sidebar hint / button.
    var opener = document.getElementById("cmdk-open");
    if (opener) opener.addEventListener("click", open);
  }
})();
