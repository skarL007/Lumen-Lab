(function () {
  "use strict";
  const config = window.LUMEN_LOCALES || { languages: [], messages: {} };
  const fallback = config.messages.en || {};
  const storageKey = "lumen-language";

  function valid(code) { return config.languages.some((language) => language.code === code); }
  function initialLanguage() {
    const query = new URLSearchParams(location.search).get("lang");
    if (valid(query)) return query;
    try { const stored = localStorage.getItem(storageKey); if (valid(stored)) return stored; } catch (_) {}
    return "en";
  }
  function translate(code, key) { return config.messages[code]?.[key] || fallback[key] || ""; }
  function apply(code, persist) {
    const language = config.languages.find((item) => item.code === code) || config.languages[0];
    if (!language) return;
    document.documentElement.lang = code.replace("_", "-");
    document.documentElement.dir = language.dir || "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => { const value = translate(code, node.dataset.i18n); if (value) node.textContent = value; });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { const value = translate(code, node.dataset.i18nPlaceholder); if (value) node.placeholder = value; });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => { const value = translate(code, node.dataset.i18nAriaLabel); if (value) node.setAttribute("aria-label", value); });
    document.querySelectorAll("[data-language-select]").forEach((select) => { select.value = code; select.setAttribute("aria-label", translate(code, "common.language")); });
    document.querySelectorAll("[data-translation-note]").forEach((note) => { note.hidden = Boolean(language.reviewed); });
    if (persist) {
      try { localStorage.setItem(storageKey, code); } catch (_) {}
      const url = new URL(location.href); if (code === "en") url.searchParams.delete("lang"); else url.searchParams.set("lang", code); history.replaceState(null, "", url);
    }
    window.LUMEN_LANGUAGE = code;
    dispatchEvent(new CustomEvent("lumen:languagechange", { detail: { code } }));
  }
  document.querySelectorAll("[data-language-select]").forEach((select) => {
    config.languages.forEach((language) => { const option = document.createElement("option"); option.value = language.code; option.textContent = language.label; select.append(option); });
    select.addEventListener("change", () => apply(select.value, true));
  });
  window.LumenI18n = { apply, t: (key) => translate(window.LUMEN_LANGUAGE || "en", key) };
  apply(initialLanguage(), false);
})();
