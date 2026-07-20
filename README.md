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
e leitura do agendador. O pacote público será liberado quando os gates finais de
migração, tradução e QA visual forem concluídos.

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
