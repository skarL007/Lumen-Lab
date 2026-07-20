(function () {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const searchInput = document.querySelector("[data-catalog-search]");
  const filterList = document.querySelector("[data-filter-list]");
  const catalogGrid = document.querySelector("[data-catalog-grid]");
  const emptyState = document.querySelector("[data-catalog-empty]");
  const clearFilters = document.querySelector("[data-clear-filters]");
  const dialog = document.querySelector("[data-product-dialog]");
  const dialogContent = document.querySelector("[data-dialog-content]");
  const dialogClose = document.querySelector("[data-dialog-close]");
  const catalog = Array.isArray(window.LUMEN_CATALOG?.addons) ? window.LUMEN_CATALOG.addons : [];

  let activeFilter = "todos";

  function setTheme(theme, persist) {
    const safeTheme = theme === "light" ? "light" : "dark";
    root.dataset.theme = safeTheme;
    root.style.colorScheme = safeTheme;
    themeToggle?.setAttribute("aria-label", safeTheme === "dark" ? "Ativar tema claro" : "Ativar tema escuro");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", safeTheme === "dark" ? "#0a0c12" : "#f3f5f9");
    if (persist) {
      try { localStorage.setItem("lumen-theme", safeTheme); } catch (_) { /* Storage may be unavailable. */ }
    }
  }

  function initialTheme() {
    try {
      const stored = localStorage.getItem("lumen-theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch (_) { /* Fall through to the dark brand default. */ }
    return "dark";
  }

  function closeMenu() {
    nav?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function makeLink(link) {
    const anchor = element("a", `button ${link.kind === "primary" ? "button-primary" : "button-secondary"}`, link.label);
    anchor.href = link.href;
    if (link.external) {
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      anchor.append(" ↗");
    }
    return anchor;
  }

  function createProductCard(product) {
    const article = element("article", "product-card reveal");
    article.dataset.productId = product.id;

    const copy = element("div", "product-copy");
    const meta = element("div", "product-meta");
    meta.append(element("span", "status-pill", product.status));
    meta.append(element("span", "version-pill", `Versão ${product.version}`));
    copy.append(meta);
    copy.append(element("p", "product-eyebrow", product.eyebrow));
    copy.append(element("h3", "", product.name));
    copy.append(element("p", "product-summary", product.summary));

    const metrics = element("div", "metric-grid");
    product.metrics.forEach((metric) => {
      const item = element("div", "metric");
      item.append(element("strong", "", metric.value));
      item.append(element("span", "", metric.label));
      metrics.append(item);
    });
    copy.append(metrics);

    const actions = element("div", "product-actions");
    const details = element("button", "button button-primary", "Ver detalhes");
    details.type = "button";
    details.addEventListener("click", () => openProductDialog(product));
    actions.append(details);
    if (product.links?.[0]) actions.append(makeLink({ ...product.links[0], kind: "secondary" }));
    copy.append(actions);

    const visual = element("div", "product-visual");
    const image = document.createElement("img");
    image.src = product.screenshot;
    image.alt = product.screenshotAlt;
    image.width = 1327;
    image.height = 975;
    image.loading = "lazy";
    image.decoding = "async";
    visual.append(image);
    visual.append(element("span", "visual-caption", "Interface real"));

    article.append(copy, visual);
    return article;
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

    const connections = [
      [280, 190, 145, 102], [280, 190, 414, 92], [280, 190, 118, 274],
      [280, 190, 430, 285], [145, 102, 65, 55], [145, 102, 78, 168],
      [414, 92, 500, 52], [414, 92, 496, 161], [118, 274, 53, 334],
      [430, 285, 503, 337]
    ];
    connections.forEach(([x1, y1, x2, y2]) => {
      svg.append(svgElement("path", { d: `M${x1} ${y1} C${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`, class: "graph-link" }));
    });

    const nodes = [
      { x: 280, y: 190, r: 52, label: "Estudo", type: "root" },
      { x: 145, y: 102, r: 37, label: "Idiomas", type: "major" },
      { x: 414, y: 92, r: 38, label: "Ciência", type: "major" },
      { x: 118, y: 274, r: 34, label: "História", type: "major" },
      { x: 430, y: 285, r: 35, label: "Código", type: "major" },
      { x: 65, y: 55, r: 17, label: "EN", type: "leaf" },
      { x: 78, y: 168, r: 18, label: "PT", type: "leaf" },
      { x: 500, y: 52, r: 18, label: "Bio", type: "leaf" },
      { x: 496, y: 161, r: 17, label: "Fís", type: "leaf" },
      { x: 53, y: 334, r: 16, label: "BR", type: "leaf" },
      { x: 503, y: 337, r: 17, label: "Py", type: "leaf" }
    ];
    nodes.forEach((item) => {
      const group = svgElement("g", { class: `graph-node graph-node-${item.type}` });
      group.append(svgElement("circle", { cx: item.x, cy: item.y, r: item.r }));
      const textNode = svgElement("text", { x: item.x, y: item.y + 4, "text-anchor": "middle" });
      textNode.textContent = item.label;
      group.append(textNode);
      svg.append(group);
    });
    visual.append(svg);

    const stats = element("div", "graph-stats");
    stats.append(element("span", "", "FSRS · 87%"));
    stats.append(element("span", "", "18 tags dominadas"));
    visual.append(stats);
    return visual;
  }

  function createModuleCard(product, module) {
    const article = element("article", `module-card module-card-${module.accent}`);
    article.dataset.moduleId = module.id;

    let artwork;
    if (module.art === "graph") {
      artwork = createGraphArtwork();
    } else {
      artwork = element("div", "module-art module-art-screenshot");
      const image = document.createElement("img");
      image.src = module.screenshot;
      image.alt = module.screenshotAlt;
      image.width = 1327;
      image.height = 975;
      image.loading = "lazy";
      image.decoding = "async";
      artwork.append(image);
      artwork.append(element("span", "module-art-label", "Interface real"));
    }

    const copy = element("div", "module-copy");
    const meta = element("div", "module-meta");
    meta.append(element("span", "module-number", module.order));
    meta.append(element("span", "module-status", module.status));
    copy.append(meta);
    copy.append(element("p", "module-label", module.label));
    copy.append(element("h4", "", module.name));
    copy.append(element("p", "module-statement", module.statement));
    copy.append(element("p", "module-summary", module.summary));

    const proof = element("ul", "module-proof");
    module.proof.forEach((item) => proof.append(element("li", "", item)));
    copy.append(proof);

    const button = element("button", "module-open", `Explorar ${module.name}`);
    button.type = "button";
    button.setAttribute("aria-label", `Ver detalhes do ${module.name}`);
    button.append(element("span", "", "→"));
    button.addEventListener("click", () => openModuleDialog(product, module));
    copy.append(button);

    article.append(artwork, copy);
    return article;
  }

  function moduleMatches(module, query) {
    if (!query) return true;
    const text = [module.name, module.label, module.statement, module.summary, ...module.features, ...module.proof]
      .join(" ").toLocaleLowerCase("pt-BR");
    return text.includes(query);
  }

  function visibleModules(product, query, productOwnMatch) {
    const modules = Array.isArray(product.modules) ? product.modules : [];
    return modules.filter((module) => {
      const matchesFilter = activeFilter === "todos" || activeFilter === "em-desenvolvimento" || module.categories.includes(activeFilter);
      const matchesQuery = !query || productOwnMatch || moduleMatches(module, query);
      return matchesFilter && matchesQuery;
    });
  }

  function createModuleShowcase(product, modules) {
    const section = element("section", "module-showcase reveal");
    section.setAttribute("aria-labelledby", `${product.id}-modules-title`);

    const heading = element("div", "module-section-heading");
    const headingCopy = element("div");
    headingCopy.append(element("p", "product-eyebrow", "A integração"));
    const title = element("h3", "", "Dois add-ons. Um fluxo contínuo.");
    title.id = `${product.id}-modules-title`;
    headingCopy.append(title);
    heading.append(headingCopy);
    heading.append(element("p", "", product.integration));
    section.append(heading);

    const flow = element("div", "module-flow");
    [
      ["01", "Criar o notetype"],
      ["02", "Organizar com tags"],
      ["03", "Navegar pelo progresso"]
    ].forEach(([number, label], index) => {
      const step = element("div", "module-flow-step");
      step.append(element("span", "", number));
      step.append(element("strong", "", label));
      flow.append(step);
      if (index < 2) flow.append(element("i", "module-flow-line"));
    });
    section.append(flow);

    const grid = element("div", `module-grid${modules.length === 1 ? " is-single" : ""}`);
    modules.forEach((module) => grid.append(createModuleCard(product, module)));
    section.append(grid);
    return section;
  }

  function openProductDialog(product) {
    if (!dialog || !dialogContent) return;
    dialogContent.replaceChildren();

    dialogContent.append(element("p", "dialog-eyebrow", `${product.status} · versão ${product.version}`));
    const title = element("h3", "dialog-title", product.name);
    title.id = "dialog-title";
    dialogContent.append(title);
    dialogContent.append(element("p", "dialog-description", product.longDescription));

    const columns = element("div", "dialog-columns");
    const ready = element("div");
    ready.append(element("h4", "", "O que já está pronto"));
    const readyList = element("ul");
    product.features.forEach((feature) => readyList.append(element("li", "", feature)));
    ready.append(readyList);

    const gates = element("div");
    gates.append(element("h4", "", "Antes da publicação"));
    const gateList = element("ul", "release-list");
    product.releaseGates.forEach((gate) => gateList.append(element("li", "", gate)));
    gates.append(gateList);
    columns.append(ready, gates);
    dialogContent.append(columns);

    const actions = element("div", "dialog-actions");
    product.links.forEach((link) => actions.append(makeLink(link)));
    dialogContent.append(actions);
    dialog.showModal();
  }

  function openModuleDialog(product, module) {
    if (!dialog || !dialogContent) return;
    dialogContent.replaceChildren();

    dialogContent.append(element("p", "dialog-eyebrow", `Módulo ${module.order} · ${module.status}`));
    const title = element("h3", "dialog-title", module.name);
    title.id = "dialog-title";
    dialogContent.append(title);
    dialogContent.append(element("p", "dialog-module-statement", module.statement));
    dialogContent.append(element("p", "dialog-description", module.summary));

    const columns = element("div", "dialog-columns dialog-module-columns");
    const capabilities = element("div");
    capabilities.append(element("h4", "", "Capacidades integradas"));
    const featureList = element("ul");
    module.features.forEach((feature) => featureList.append(element("li", "", feature)));
    capabilities.append(featureList);

    const integration = element("div", "dialog-integration");
    integration.append(element("h4", "", "Como se conecta"));
    integration.append(element("p", "", module.connection));
    const gate = element("div", "dialog-gate");
    gate.append(element("span", "", "Gate transparente"));
    gate.append(element("p", "", module.gate));
    integration.append(gate);
    columns.append(capabilities, integration);
    dialogContent.append(columns);

    const actions = element("div", "dialog-actions");
    if (module.id === "card-template-manager" && product.links?.[0]) actions.append(makeLink(product.links[0]));
    const back = element("button", "button button-secondary", "Voltar à suíte");
    back.type = "button";
    back.addEventListener("click", () => dialog.close());
    actions.append(back);
    dialogContent.append(actions);
    dialog.showModal();
  }

  function renderCatalog() {
    if (!catalogGrid || !emptyState) return;
    const query = (searchInput?.value || "").trim().toLocaleLowerCase("pt-BR");
    const visible = catalog.map((product) => {
      const matchesFilter = activeFilter === "todos" || product.categories.includes(activeFilter);
      const ownSearchable = [product.name, product.eyebrow, product.summary, ...product.categories].join(" ").toLocaleLowerCase("pt-BR");
      const productOwnMatch = !query || ownSearchable.includes(query);
      const modules = visibleModules(product, query, productOwnMatch);
      const anyModuleMatches = modules.some((module) => moduleMatches(module, query));
      return { product, modules, visible: matchesFilter && (productOwnMatch || anyModuleMatches) };
    }).filter((entry) => entry.visible);

    const nodes = [];
    visible.forEach(({ product, modules }) => {
      nodes.push(createProductCard(product));
      if (modules.length) nodes.push(createModuleShowcase(product, modules));
    });
    catalogGrid.replaceChildren(...nodes);
    emptyState.hidden = visible.length !== 0;
    observeReveals(catalogGrid);
  }

  function resetCatalog() {
    activeFilter = "todos";
    if (searchInput) searchInput.value = "";
    filterList?.querySelectorAll("[data-filter]").forEach((button) => {
      const active = button.dataset.filter === "todos";
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderCatalog();
    searchInput?.focus();
  }

  function observeReveals(scope) {
    const items = (scope || document).querySelectorAll(".reveal:not(.is-visible)");
    if (!items.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    items.forEach((item) => observer.observe(item));
  }

  setTheme(initialTheme(), false);
  renderCatalog();
  observeReveals(document);

  document.querySelectorAll("[data-current-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });

  window.addEventListener("scroll", () => header?.classList.toggle("is-scrolled", window.scrollY > 20), { passive: true });

  themeToggle?.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark", true));

  menuToggle?.addEventListener("click", () => {
    const open = !nav?.classList.contains("is-open");
    nav?.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  searchInput?.addEventListener("input", renderCatalog);
  filterList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    filterList.querySelectorAll("[data-filter]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderCatalog();
  });

  clearFilters?.addEventListener("click", resetCatalog);
  dialogClose?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
