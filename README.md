# 🌟 Lumina

Uma plataforma de estudos com Inteligência Artificial voltada para vestibulandos brasileiros.

O Lumina permite que estudantes conversem com uma IA para tirar dúvidas, resolvam exercícios gerados automaticamente e acompanhem seu progresso ao longo dos estudos.

---

## 🚀 Funcionalidades

### 👤 Autenticação

- Cadastro de usuários
- Login com JWT
- Alteração de senha
- Atualização de perfil

### 🤖 Chat com IA

- Criação de múltiplos chats
- Histórico de conversas
- Respostas geradas por IA (Google Gemini)
- Persistência das mensagens

### 📚 Exercícios

- Geração automática de exercícios por matéria
- Níveis de dificuldade:
  - Fácil
  - Médio
  - Difícil
- Correção automática
- Registro de tentativas
- Histórico de progresso

### 🛠 Administração

- Exclusão de exercícios
- Controle de acesso por cargo (Admin)

---

## 🏗 Arquitetura

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT
- Bcrypt
- Google Gemini API

### Frontend

- HTML
- CSS
- JavaScript
- TailwindCSS

---

## 📂 Estrutura do Projeto

```text
lumina/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── database/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── login.html
    ├── app.html
    ├── admin.html
    ├── css/
    └── scripts/
```

---

## 🗄 Banco de Dados

Principais entidades:

- Users
- Chats
- Messages
- Subjects
- Exercises
- Alternatives
- Progress

Relacionamentos:

```text
Users
 ├── Chats
 │    └── Messages
 │
 └── Progress
      └── Exercises
            └── Alternatives
```

---

## 🔐 Autenticação

O sistema utiliza JWT para autenticação.

Exemplo de payload:

```json
{
  "id": "user-id",
  "role": "student"
}
```

O token deve ser enviado em:

```http
Authorization: Bearer TOKEN
```

---

## ⚙️ Configuração

### 1. Clone o projeto

```bash
git clone https://github.com/bernardobgf/lumina.git
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo .env

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=lumina
DB_USER=postgres
DB_PASSWORD=sua_senha

JWT_SECRET=seu_secret

GEMINI_API_KEY=sua_chave
```

### 4. Execute o projeto

```bash
npm run dev
```

---

## 📡 Rotas

### Auth

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /auth/register | Cadastro |
| POST | /auth/login | Login |
| POST | /auth/logout | Logout |

### Usuários

| Método | Endpoint |
|----------|----------|
| PATCH | /users/profile |
| PATCH | /users/change-password |

### Chat

| Método | Endpoint |
|----------|----------|
| POST | /lumina/new-chat |
| GET | /lumina/chats |
| GET | /lumina/chats/:chatId/messages |
| POST | /lumina/chats/:chatId/messages |

### Exercícios

| Método | Endpoint |
|----------|----------|
| GET | /exercises |
| POST | /exercises/generate |
| POST | /exercises/:exerciseId/answer |
| DELETE | /exercises/:exerciseId |

---

## 🎯 Objetivo

O Lumina foi desenvolvido como projeto de estudo para aplicar conceitos de:

- APIs REST
- Autenticação JWT
- PostgreSQL
- Integração com IA
- Arquitetura Backend
- Desenvolvimento Full Stack

---

## 🔮 Melhorias Futuras

- Interface em React / Next.js
- Sistema de ranking
- Dashboard de desempenho
- Estatísticas por matéria
- Upload de PDFs para estudo
- Flashcards com IA
- Modo ENEM
- Recomendação personalizada de exercícios

---

## 👨‍💻 Autor

Desenvolvido por Bernardo Bregeron Flores.

Projeto criado para aprendizado, portfólio e evolução profissional.
