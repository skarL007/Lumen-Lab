(function () {
  "use strict";
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const menu = document.querySelector("[data-menu-toggle]");
  const theme = document.querySelector("[data-theme-toggle]");
  function setTheme(value, save) {
    value = value === "light" ? "light" : "dark";
    root.dataset.theme = value; root.style.colorScheme = value;
    theme?.setAttribute("aria-label", value === "dark" ? "Use light theme" : "Use dark theme");
    if (save) try { localStorage.setItem("lumen-theme", value); } catch (_) {}
  }
  let initial = "dark"; try { initial = localStorage.getItem("lumen-theme") || "dark"; } catch (_) {}
  setTheme(initial, false);
  theme?.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
  menu?.addEventListener("click", () => { const open = !nav?.classList.contains("is-open"); nav?.classList.toggle("is-open", open); menu.setAttribute("aria-expanded", String(open)); });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => { nav.classList.remove("is-open"); menu?.setAttribute("aria-expanded", "false"); }));
  addEventListener("scroll", () => header?.classList.toggle("is-scrolled", scrollY > 20), { passive: true });
  document.querySelectorAll("[data-current-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });
})();
