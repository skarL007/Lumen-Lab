(function () {
  "use strict";

  const root = document.documentElement;
  const catalog = window.LUMEN_CATALOG?.addons || [];
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const searchInput = document.querySelector("[data-catalog-search]");
  const filterList = document.querySelector("[data-filter-list]");
  const catalogGrid = document.querySelector("[data-catalog-grid]");
  const emptyState = document.querySelector("[data-catalog-empty]");
  const clearFilters = document.querySelector("[data-clear-filters]");
  let activeFilter = "all";

  function setTheme(theme, persist) {
    const safeTheme = theme === "light" ? "light" : "dark";
    root.dataset.theme = safeTheme;
    root.style.colorScheme = safeTheme;
    themeToggle?.setAttribute("aria-label", safeTheme === "dark" ? "Use light theme" : "Use dark theme");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", safeTheme === "dark" ? "#0a0c12" : "#f3f5f9");
    if (persist) try { localStorage.setItem("lumen-theme", safeTheme); } catch (_) {}
  }

  function initialTheme() {
    try {
      const stored = localStorage.getItem("lumen-theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch (_) {}
    return "dark";
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function svgElement(tag, attributes) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attributes || {}).forEach(([name, value]) => node.setAttribute(name, value));
    return node;
  }

  function createGraphArtwork() {
    const visual = element("div", "module-art module-art-graph");
    visual.setAttribute("aria-hidden", "true");
    const svg = svgElement("svg", { viewBox: "0 0 560 390", role: "presentation" });
    [[280,190,145,102],[280,190,414,92],[280,190,118,274],[280,190,430,285],[145,102,65,55],[145,102,78,168],[414,92,500,52],[414,92,496,161],[118,274,53,334],[430,285,503,337]].forEach(([x1,y1,x2,y2]) => {
      svg.append(svgElement("path", { d: `M${x1} ${y1} C${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`, class: "graph-link" }));
    });
    [
      [280,190,52,"Study","root"],[145,102,37,"Languages","major"],[414,92,38,"Science","major"],
      [118,274,34,"History","major"],[430,285,35,"Code","major"],[65,55,17,"EN","leaf"],
      [78,168,18,"PT","leaf"],[500,52,18,"Bio","leaf"],[496,161,17,"Phy","leaf"],
      [53,334,16,"BR","leaf"],[503,337,17,"Py","leaf"]
    ].forEach(([x,y,r,label,type]) => {
      const group = svgElement("g", { class: `graph-node graph-node-${type}` });
      group.append(svgElement("circle", { cx: x, cy: y, r }));
      const text = svgElement("text", { x, y: y + 4, "text-anchor": "middle" });
      text.textContent = label;
      group.append(text);
      svg.append(group);
    });
    visual.append(svg);
    const stats = element("div", "graph-stats");
    stats.append(element("span", "", "FSRS · 87%"), element("span", "", "18 mastered tags"));
    visual.append(stats);
    return visual;
  }

  function createModuleCard(module) {
    const article = element("article", `module-card module-card-${module.accent}`);
    let artwork;
    if (module.art === "graph") artwork = createGraphArtwork();
    else {
      artwork = element("div", "module-art module-art-screenshot");
      const image = document.createElement("img");
      Object.assign(image, { src: module.screenshot, alt: module.screenshotAlt, width: 1327, height: 975, loading: "lazy", decoding: "async" });
      artwork.append(image, element("span", "module-art-label", "Real interface"));
    }
    const copy = element("div", "module-copy");
    const meta = element("div", "module-meta");
    meta.append(element("span", "module-number", module.order), element("span", "module-status", module.status));
    copy.append(meta, element("p", "module-label", module.label), element("h4", "", module.name), element("p", "module-statement", module.statement), element("p", "module-summary", module.summary));
    const proof = element("ul", "module-proof");
    module.proof.forEach((item) => proof.append(element("li", "", item)));
    const link = element("a", "module-open", `Explore ${module.name}`);
    link.href = module.page;
    link.append(element("span", "", "→"));
    copy.append(proof, link);
    article.append(artwork, copy);
    return article;
  }

  function productMatches(product, query) {
    const own = [product.name, product.eyebrow, product.summary, ...product.categories].join(" ").toLowerCase();
    return !query || own.includes(query) || product.modules.some((module) => [module.name, module.label, module.statement, module.summary, ...module.proof].join(" ").toLowerCase().includes(query));
  }

  function createProduct(product, query) {
    const fragment = document.createDocumentFragment();
    const article = element("article", "product-card reveal");
    const copy = element("div", "product-copy");
    const meta = element("div", "product-meta");
    meta.append(element("span", "status-pill", product.status), element("span", "version-pill", `Version ${product.version}`));
    copy.append(meta, element("p", "product-eyebrow", product.eyebrow), element("h3", "", product.name), element("p", "product-summary", product.summary));
    const metrics = element("div", "metric-grid");
    product.metrics.forEach((metric) => { const item = element("div", "metric"); item.append(element("strong", "", metric.value), element("span", "", metric.label)); metrics.append(item); });
    const actions = element("div", "product-actions");
    const first = element("a", "button button-primary", "Explore Card Template Manager"); first.href = product.modules[0].page;
    const second = element("a", "button button-secondary", "Explore Tag Mind Map"); second.href = product.modules[1].page;
    actions.append(first, second); copy.append(metrics, actions);
    const visual = element("div", "product-visual");
    const image = document.createElement("img"); Object.assign(image, { src: product.screenshot, alt: product.screenshotAlt, width: 1327, height: 975, loading: "lazy", decoding: "async" });
    visual.append(image, element("span", "visual-caption", "Real interface")); article.append(copy, visual); fragment.append(article);

    const section = element("section", "module-showcase reveal");
    const heading = element("div", "module-section-heading");
    const headingCopy = element("div"); headingCopy.append(element("p", "product-eyebrow", "The integration"), element("h3", "", "Two tools. One continuous workflow."));
    heading.append(headingCopy, element("p", "", product.integration)); section.append(heading);
    const flow = element("div", "module-flow");
    [["01","Design the note type"],["02","Organize with tags"],["03","Navigate progress"]].forEach(([n,label], index) => { const step = element("div", "module-flow-step"); step.append(element("span", "", n), element("strong", "", label)); flow.append(step); if (index < 2) flow.append(element("i", "module-flow-line")); });
    section.append(flow);
    const grid = element("div", "module-grid");
    product.modules.filter((module) => !query || [module.name,module.label,module.statement,module.summary,...module.proof].join(" ").toLowerCase().includes(query) || product.name.toLowerCase().includes(query)).forEach((module) => grid.append(createModuleCard(module)));
    section.append(grid); fragment.append(section);
    return fragment;
  }

  function renderCatalog() {
    if (!catalogGrid || !emptyState) return;
    const query = (searchInput?.value || "").trim().toLowerCase();
    const visible = catalog.filter((product) => (activeFilter === "all" || product.categories.includes(activeFilter)) && productMatches(product, query));
    const nodes = visible.map((product) => createProduct(product, query));
    catalogGrid.replaceChildren(...nodes); emptyState.hidden = visible.length !== 0; observeReveals(catalogGrid);
  }

  function observeReveals(scope) {
    const items = (scope || document).querySelectorAll(".reveal:not(.is-visible)");
    if (!items.length) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return items.forEach((item) => item.classList.add("is-visible"));
    const observer = new IntersectionObserver((entries, instance) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); instance.unobserve(entry.target); } }), { rootMargin: "0px 0px -8%", threshold: .08 });
    items.forEach((item) => observer.observe(item));
  }

  function closeMenu() { nav?.classList.remove("is-open"); menuToggle?.setAttribute("aria-expanded", "false"); menuToggle?.setAttribute("aria-label", "Open menu"); }

  setTheme(initialTheme(), false); renderCatalog(); observeReveals(document);
  document.querySelectorAll("[data-current-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });
  addEventListener("scroll", () => header?.classList.toggle("is-scrolled", scrollY > 20), { passive: true });
  themeToggle?.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
  menuToggle?.addEventListener("click", () => { const open = !nav?.classList.contains("is-open"); nav?.classList.toggle("is-open", open); menuToggle.setAttribute("aria-expanded", String(open)); menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu"); });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  searchInput?.addEventListener("input", renderCatalog);
  filterList?.addEventListener("click", (event) => { const button = event.target.closest("[data-filter]"); if (!button) return; activeFilter = button.dataset.filter; filterList.querySelectorAll("[data-filter]").forEach((item) => { const active = item === button; item.classList.toggle("is-active", active); item.setAttribute("aria-pressed", String(active)); }); renderCatalog(); });
  clearFilters?.addEventListener("click", () => { activeFilter = "all"; if (searchInput) searchInput.value = ""; filterList?.querySelectorAll("[data-filter]").forEach((item) => { const active = item.dataset.filter === "all"; item.classList.toggle("is-active", active); item.setAttribute("aria-pressed", String(active)); }); renderCatalog(); searchInput?.focus(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
})();
