window.LUMEN_CATALOG = {
  addons: [
    {
      id: "anki-studio-suite",
      name: "Anki Studio Suite",
      eyebrow: "Two tools · one extension",
      status: "Ready for owner QA",
      version: "3.0.0",
      categories: ["templates", "visualization", "in-development"],
      summary: "Design distinctive cards and explore your collection as a knowledge map — without leaving Anki.",
      metrics: [
        { value: "12", label: "distinct themes" },
        { value: "2", label: "integrated tools" },
        { value: "13", label: "supported languages" }
      ],
      integration: "Both modules share the same safety layer, search, internationalization and scheduler-aware metrics. Build the note type in Card Template Manager, then navigate its knowledge structure in Tag Mind Map.",
      modules: [
        {
          id: "card-template-manager",
          order: "01",
          page: "addons/card-template-manager/",
          name: "Card Template Manager",
          label: "Card design",
          status: "Feature complete",
          categories: ["templates", "in-development"],
          accent: "blue",
          art: "screenshot",
          screenshot: "screenshots/03-card-template-manager.png",
          screenshotAlt: "Theme gallery and live card preview in Card Template Manager",
          statement: "Templates that feel like a product, not a configuration screen.",
          summary: "Create and customize note types with a visual gallery, front/back/night previews, suggested fields and an engine that truly applies the selected layout.",
          proof: ["12 layouts", "v3 engine", "Collection-safe"]
        },
        {
          id: "tag-mind-map",
          order: "02",
          page: "addons/tag-mind-map/",
          name: "Tag Mind Map",
          label: "Knowledge map",
          status: "Feature complete",
          categories: ["visualization", "in-development"],
          accent: "mint",
          art: "graph",
          statement: "Your collection stops looking like a list and becomes a map.",
          summary: "Explore tag hierarchy as a graph, track progress, activity and mastery, find connections and use study signals aligned with FSRS.",
          proof: ["FSRS-aware", "Interactive graph", "100% offline"]
        }
      ],
      screenshot: "screenshots/03-card-template-manager.png",
      screenshotAlt: "Dark Card Template Manager interface with theme gallery and card preview"
    }
  ]
};
