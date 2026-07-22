(function () {
  "use strict";
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const menu = document.querySelector("[data-menu-toggle]");
  const themeToggle = document.querySelector("[data-theme-toggle]");

  const t = (key) => (window.LumenI18n ? window.LumenI18n.t(key) : "");

  function updateThemeLabel(theme) {
    const label = theme === "dark" ? t("site.themeLight") : t("site.themeDark");
    themeToggle?.setAttribute("aria-label", label || (theme === "dark" ? "Use light theme" : "Use dark theme"));
  }

  window.LumenTheme?.init({ toggle: themeToggle, onChange: updateThemeLabel });
  menu?.addEventListener("click", () => { const open = !nav?.classList.contains("is-open"); nav?.classList.toggle("is-open", open); menu.setAttribute("aria-expanded", String(open)); });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => { nav.classList.remove("is-open"); menu?.setAttribute("aria-expanded", "false"); }));
  addEventListener("scroll", () => header?.classList.toggle("is-scrolled", scrollY > 20), { passive: true });
  document.querySelectorAll("[data-current-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });
})();
