window.LUMEN_CATALOG = {
  addons: [
    {
      id: "anki-studio-suite",
      name: "Anki Studio Suite",
      eyebrow: "Duas ferramentas · uma extensão",
      status: "Em acabamento",
      statusTone: "progress",
      version: "3.0.0",
      categories: ["templates", "visualizacao", "em-desenvolvimento"],
      summary: "Crie templates com identidade e enxergue sua coleção como um mapa de conhecimento — sem sair do Anki.",
      longDescription: "A suíte une o Card Template Manager e o Tag Mind Map em uma única extensão. O motor v3 aplica layouts realmente distintos, as métricas entendem FSRS e toda operação sensível respeita a coleção do usuário.",
      metrics: [
        { value: "12", label: "temas distintos" },
        { value: "2", label: "ferramentas integradas" },
        { value: "13", label: "idiomas na fundação" }
      ],
      features: [
        "Motor v3 com layouts estruturais, modo noturno e mobile",
        "Mapa de tags com progresso, insights e exportacao Mermaid",
        "Métricas modernas de retrievability e stability no FSRS",
        "Funcionamento offline e escrita protegida por backup"
      ],
      releaseGates: [
        "Diálogo opt-in de migração com diff e backup",
        "Troca completa das strings da interface",
        "QA visual final dentro do Anki, com autorização do usuário"
      ],
      integration: "Os dois módulos compartilham segurança, busca, internacionalização e leitura do agendador. Você desenha o notetype no Card Template Manager e acompanha a evolução desse conhecimento no Tag Mind Map — sem instalar ou manter extensões separadas.",
      modules: [
        {
          id: "card-template-manager",
          order: "01",
          name: "Card Template Manager",
          label: "Design de cartões",
          status: "Integrado à suíte",
          categories: ["templates", "em-desenvolvimento"],
          accent: "blue",
          art: "screenshot",
          screenshot: "screenshots/03-card-template-manager.png",
          screenshotAlt: "Galeria de temas e prévia do Card Template Manager",
          statement: "Templates que parecem produto, não configuração.",
          summary: "Crie e personalize tipos de nota com uma galeria visual, prévia de frente, verso e modo noturno, campos sugeridos e um motor que aplica de verdade o layout escolhido.",
          features: [
            "12 temas v3 com estruturas realmente distintas",
            "Prévia ao vivo para frente, verso e modo noturno",
            "Editor de campos, cores, tipografia, layout e CSS",
            "Importação sanitizada, backups e escrita protegida"
          ],
          proof: ["12 layouts", "Motor v3", "Collection-safe"],
          connection: "Define como cada ideia aparece e garante que alterações sensíveis no notetype passem por confirmação e backup.",
          gate: "O diálogo visual de migração de notetypes existentes será concluído antes da publicação."
        },
        {
          id: "tag-mind-map",
          order: "02",
          name: "Tag Mind Map",
          label: "Mapa de conhecimento",
          status: "Integrado à suíte",
          categories: ["visualizacao", "em-desenvolvimento"],
          accent: "mint",
          art: "graph",
          statement: "Sua coleção deixa de ser uma lista e vira um mapa.",
          summary: "Explore a hierarquia das tags como um grafo, acompanhe progresso, atividade e domínio, encontre conexões e receba sinais de estudo alinhados ao FSRS.",
          features: [
            "Grafo interativo com busca, filtros e foco por tag",
            "Progresso diário, heatmap, metas e sequência de estudo",
            "Retrievability e stability corretas quando o FSRS está ativo",
            "Insights, recomendações e gerador de exportação Mermaid"
          ],
          proof: ["FSRS-aware", "Grafo interativo", "100% offline"],
          connection: "Lê a mesma coleção e transforma a estrutura criada nos cartões em uma visão navegável de progresso e relações.",
          gate: "O gerador Mermaid já está testado; o botão de exportação na interface será ligado antes da publicação."
        }
      ],
      screenshot: "screenshots/03-card-template-manager.png",
      screenshotAlt: "Interface escura do Card Template Manager com galeria de temas e prévia do cartão",
      links: [
        { label: "Ver showcase dos temas", href: "redesign/_artifact.html", kind: "primary" },
        { label: "Código do site", href: "https://github.com/skarL007/Lumen-Lab", kind: "secondary", external: true }
      ]
    }
  ]
};
