# Zeriky BJJ Team — site

Esboço do site da Zeriky BJJ Team, escola de jiu-jitsu em São José e Palhoça/SC.

Site estático (HTML, CSS e JavaScript puro), sem build. Para ver localmente, é só abrir o `index.html` no navegador.

## Estrutura

```
index.html        página única
css/style.css     estilos
js/main.js        turmas, quiz, faixas, FAQ e formulário → WhatsApp
assets/           logo e ícones
```

## O que ainda falta (marcado entre [colchetes] no site)

- Endereço do polo Palhoça
- Dias, horários e faixa etária das turmas (em `js/main.js`, lista `TURMAS`)
- Idade mínima do Kids e se os pais podem assistir
- Tabela de planos
- Trajetória, graduação e títulos do professor
- Fotos reais e depoimentos

## Publicar no GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.

Antes de colocar no ar de verdade, remover a meta tag `robots noindex` do `index.html`.
