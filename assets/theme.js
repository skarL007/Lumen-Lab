(function () {
  "use strict";

  const root = document.documentElement;
  const STORAGE_KEY = "lumen-theme";
  const DARK_COLOR = "#0a0c12";
  const LIGHT_COLOR = "#f3f5f9";

  function storedTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (_) {}
    return null;
  }

  function systemTheme() {
    try {
      return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    } catch (_) {
      return "dark";
    }
  }

  function initialTheme() {
    return storedTheme() || systemTheme();
  }

  function applyMetaThemeColor(theme) {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? DARK_COLOR : LIGHT_COLOR);
  }

  let onChange = null;

  function setTheme(theme, persist) {
    const safeTheme = theme === "light" ? "light" : "dark";
    root.dataset.theme = safeTheme;
    root.style.colorScheme = safeTheme;
    applyMetaThemeColor(safeTheme);
    if (persist) try { localStorage.setItem(STORAGE_KEY, safeTheme); } catch (_) {}
    if (typeof onChange === "function") onChange(safeTheme);
    return safeTheme;
  }

  function toggle(persist) {
    return setTheme(root.dataset.theme === "dark" ? "light" : "dark", persist !== false);
  }

  function init(options) {
    options = options || {};
    onChange = typeof options.onChange === "function" ? options.onChange : null;
    const theme = setTheme(initialTheme(), false);
    options.toggle?.addEventListener("click", () => toggle(true));
    return theme;
  }

  window.LumenTheme = {
    init,
    toggle,
    current: () => (root.dataset.theme === "light" ? "light" : "dark"),
  };
})();
