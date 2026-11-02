// Stryx Skills project page: theme, copy buttons, the tree's light, pause.
(function () {
  "use strict";
  var root = document.documentElement;
  var live = document.getElementById("live");
  function say(text) { if (live) { live.textContent = ""; setTimeout(function () { live.textContent = text; }, 30); } }

  // Theme: system by default, the choice is kept.
  var toggle = document.getElementById("theme-toggle");
  function label() {
    var dark = root.classList.contains("dark");
    toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  if (toggle) {
    label();
    toggle.addEventListener("click", function () {
      var dark = !root.classList.contains("dark");
      root.classList.toggle("dark", dark);
      try { localStorage.setItem("stryx-theme", dark ? "dark" : "light"); } catch (e) {}
      label();
      say(dark ? "Dark theme" : "Light theme");
    });
  }

  // Copy the install line.
  document.querySelectorAll(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.textContent = "Copied";
        say("Install command copied");
        setTimeout(function () { btn.textContent = "Copy"; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { say("Copy failed. Select the line and copy it."); });
      } else {
        say("Copy is not available here. Select the line and copy it.");
      }
    });
  });

  // The tree: leaves bud when it comes into view; a group lights its branch.
  var tree = document.getElementById("tree");
  if (tree) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { tree.classList.add("is-in"); io.disconnect(); } });
      }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });
      io.observe(tree);
    } else {
      tree.classList.add("is-in");
    }

    var books = Array.prototype.slice.call(document.querySelectorAll(".book"));
    var pinned = "";
    function light(g) {
      tree.setAttribute("data-active", g);
      books.forEach(function (b) { b.classList.toggle("is-on", b.getAttribute("data-g") === g); });
    }
    books.forEach(function (b) {
      var g = b.getAttribute("data-g");
      var btn = b.querySelector(".book-btn");
      b.addEventListener("mouseenter", function () { light(g); });
      b.addEventListener("mouseleave", function () { light(pinned); });
      btn.addEventListener("focus", function () { light(g); });
      btn.addEventListener("blur", function () { light(pinned); });
      btn.addEventListener("click", function () {
        pinned = pinned === g ? "" : g;
        books.forEach(function (o) { o.querySelector(".book-btn").setAttribute("aria-pressed", String(o.getAttribute("data-g") === pinned)); });
        light(pinned || g);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && pinned) {
        pinned = "";
        books.forEach(function (o) { o.querySelector(".book-btn").setAttribute("aria-pressed", "false"); });
        light("");
      }
    });
  }

  // Pause every loop on the page.
  var pause = document.getElementById("pause");
  function pauseLabel() {
    var p = root.classList.contains("is-paused");
    pause.textContent = p ? "Play the tree" : "Pause the tree";
  }
  if (pause) {
    pauseLabel();
    pause.addEventListener("click", function () {
      var p = !root.classList.contains("is-paused");
      root.classList.toggle("is-paused", p);
      try { localStorage.setItem("stryx-motion", p ? "paused" : "playing"); } catch (e) {}
      pauseLabel();
    });
  }
})();
