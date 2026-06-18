# Lumina Frontend — HTML / CSS / JS puro

Frontend completo do projeto Lumina em HTML, TailwindCSS (via CDN) e JavaScript vanilla.

## Estrutura

```
lumina-frontend/
├── index.html       # Landing page
├── auth.html        # Login / Cadastro
├── app.html         # Chat + exercícios + configurações
├── README.md
└── js/
    ├── api.js              # Cliente da API Lumina (todos endpoints)
    ├── tailwind-config.js  # Tema (cores Lumina)
    └── app.js              # Lógica da página principal
```

## Como rodar

1. **Suba o backend Lumina** em `http://localhost:3000`
   (com CORS liberado para `http://localhost:8000` ou `*`)

2. **Sirva os arquivos** com qualquer servidor estático.
   Não abra direto com `file://` — o navegador bloqueia `fetch`.

   ```bash
   # Opção 1: Python
   python3 -m http.server 8000

   # Opção 2: Node (npx)
   npx serve .

   # Opção 3: PHP
   php -S localhost:8000

   # Opção 4: VS Code → extensão "Live Server"
   ```

3. Abra `http://localhost:8000` no navegador.

## Configuração

A URL do backend está em `js/api.js`, primeira linha:

```js
const API_BASE = "http://localhost:3000";
```

Troque por sua URL pública quando deployar.

## Endpoints consumidos

Todos da documentação Lumina:

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`
- `PATCH /users/profile`, `PATCH /users/change-password`
- `POST /lumina/new-chat`, `GET /lumina/chats`
- `GET|POST /lumina/chats/:chatId/messages`
- `GET /exercises`, `POST /exercises/generate`
- `POST /exercises/:id/answer`, `DELETE /exercises/:id`

O token JWT é salvo em `localStorage["lumina_token"]` e enviado
automaticamente no header `Authorization: Bearer ...`.

## Stack

- HTML5
- TailwindCSS v3 (CDN — não precisa build)
- JavaScript ES6+ (sem framework, sem build)
- Fonte: Inter (Google Fonts)
