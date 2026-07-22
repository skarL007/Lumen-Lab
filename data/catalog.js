window.LUMEN_CATALOG = {
  addons: [
    {
      id: "anki-studio-suite",
      name: "Anki Studio Suite",
      eyebrow: "Two tools · one extension",
      status: "Release candidate",
      version: "3.0.0",
      categories: ["templates", "visualization", "in-development"],
      summary: "Design distinctive cards and explore your collection as a knowledge map — without leaving Anki.",
      metrics: [
        { value: "12", label: "distinct themes" },
        { value: "2", label: "integrated tools" },
        { value: "14", label: "supported languages" }
      ],
      integration: "Both modules share the same safety layer, search, internationalization and scheduler-aware metrics. Build the note type in Card Template Manager, then navigate its knowledge structure in Tag Mind Map.",
      modules: [
        {
          id: "card-template-manager",
          order: "01",
          page: "addons/card-template-manager/",
          name: "Card Template Manager",
          label: "Card design",
          status: "Included in the suite",
          categories: ["templates", "in-development"],
          accent: "blue",
          art: "screenshot",
          screenshot: "screenshots/card-gallery.png",
          screenshotAlt: "Six of the twelve v3 themes rendered by the engine",
          artCaption: "site.engineRendered",
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
          status: "Included in the suite",
          categories: ["visualization", "in-development"],
          accent: "mint",
          art: "screenshot",
          screenshot: "screenshots/tag-mind-map-graph.png",
          screenshotAlt: "Tag Mind Map: knowledge graph of study tags with activity heatmap and mastery colors",
          artCaption: "site.realInterface",
          statement: "Your collection stops looking like a list and becomes a map.",
          summary: "Explore tag hierarchy as a graph, track progress, activity and mastery, find connections and use study signals aligned with FSRS.",
          proof: ["FSRS-aware", "Interactive graph", "100% offline"]
        }
      ],
      screenshot: "screenshots/card-gallery.png",
      screenshotAlt: "Twelve v3 themes rendered by the Card Template Manager engine",
      artCaption: "site.engineRendered"
    }
  ]
};
