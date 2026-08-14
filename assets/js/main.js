/* Progressive enhancement only: theme toggle + scroll-spy.
   The site is fully usable with JS disabled (dark theme, working anchors). */

(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  /* The toggle label names the mode it switches TO. */

  function themeLabel(theme) {
    return theme === "light" ? "Dark" : "Light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) { /* private mode */ }
    document.querySelectorAll(".theme-toggle .theme-label").forEach(function (el) {
      el.textContent = themeLabel(theme);
    });
  }

  document.querySelectorAll(".theme-toggle .theme-label").forEach(function (el) {
    el.textContent = themeLabel(root.getAttribute("data-theme"));
  });

  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  });

  /* ---------- Scroll-spy ---------- */

  var links = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  if (!links.length || !sections.length) return;

  var current = null;

  function setActive(id) {
    if (id === current) return;
    current = id;
    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("data-nav") === id);
    });
  }

  var ticking = false;

  function spy() {
    ticking = false;
    var line = window.scrollY + window.innerHeight * 0.35;
    var id = sections[0].id;
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top + window.scrollY <= line) id = s.id;
    });
    /* Pin the last section once the page is scrolled to the bottom. */
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      id = sections[sections.length - 1].id;
    }
    setActive(id);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(spy);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  spy();
})();
