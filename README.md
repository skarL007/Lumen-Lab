# Lumen Lab

Site público dos add-ons independentes do Lumen Lab para Anki e da visão do
futuro projeto Lumen.

## Anki Studio Suite

A suíte reúne dois módulos em uma única extensão:

- **Card Template Manager** — criação e personalização visual de notetypes com
  12 temas estruturais, prévia e escrita protegida;
- **Tag Mind Map** — mapa interativo da coleção, progresso, metas, insights e
  métricas alinhadas ao FSRS.

Os módulos compartilham o mesmo núcleo de segurança, busca, internacionalização
e leitura do agendador. O desenvolvimento da v3.0.0 está concluído: migração
opt-in com diff e backup, tradução da interface, exportação Mermaid e QA visual
estático já passaram. A publicação no AnkiWeb aguarda a aceitação do proprietário
dentro do Anki e a escolha de qual ID legado representará a suíte unificada.

## Site

O frontend é estático, sem framework, fontes remotas, telemetria ou dependências
de runtime. Para abrir localmente:

```powershell
python -m http.server 4173
```

Depois acesse `http://127.0.0.1:4173`.

Novos produtos e módulos são adicionados em `data/catalog.js`. O deploy para
GitHub Pages acontece automaticamente pelo workflow `Deploy Lumen Lab`.

## Licença

AGPL-3.0. Consulte [LICENSE](LICENSE).
