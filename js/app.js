// Página principal: chat + exercícios + configurações
requireAuth();

const state = {
  chats: [],
  activeChatId: null,
  messages: [],
  exercises: [],
  sending: false,
};

// ===== Elementos =====
const chatsList = document.getElementById("chats-list");
const chatTitle = document.getElementById("chat-title");
const messagesEl = document.getElementById("messages");
const inputMsg = document.getElementById("input-message");
const btnSend = document.getElementById("btn-send");
const formSend = document.getElementById("form-send");
const exercisesList = document.getElementById("exercises-list");
const panelExercises = document.getElementById("panel-exercises");
const settingsModal = document.getElementById("settings-modal");

// ===== Helpers de render =====
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );

function renderChats() {
  if (state.chats.length === 0) {
    chatsList.innerHTML = `<p class="px-2 py-3 text-xs text-muted-fg">Sem conversas ainda</p>`;
    return;
  }
  chatsList.innerHTML = state.chats
    .map((c) => {
      const active = c.id === state.activeChatId;
      return `
<div class="flex items-center gap-2">
  <button
    data-id="${esc(c.id)}"
    class="chat-item flex-1 text-left rounded-lg px-3 py-2 text-sm truncate transition ${
      active
        ? "bg-surface-2 text-white"
        : "text-muted-fg hover:bg-muted hover:text-white"
    }"
  >
    ${active ? '<span class="text-primary mr-2">•</span>' : ""}
    ${esc(c.title)}
  </button>

  <button
    class="edit-chat text-yellow-400"
    data-id="${esc(c.id)}"
  >
    ✏️
  </button>

  <button
    class="delete-chat text-red-400"
    data-id="${esc(c.id)}"
  >
    🗑️
  </button>
</div>
`;
    })
    .join("");
  chatsList.querySelectorAll(".chat-item").forEach((btn) => {
    btn.onclick = () => selectChat(btn.dataset.id);
  });
  chatsList.querySelectorAll(".edit-chat").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;

      const chat = state.chats.find((c) => String(c.id) === String(id));

      const title = prompt("Novo título:", chat.title);

      if (!title) return;

      try {
        await chatApi.updateChat(id, title);

        await loadChats();

        if (state.activeChatId == id) {
          chatTitle.textContent = title;
        }
      } catch (e) {
        alert(e.message);
      }
    };
  });
  chatsList.querySelectorAll(".delete-chat").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;

      if (!confirm("Deseja excluir este chat?")) {
        return;
      }

      try {
        await chatApi.deleteChat(id);

        if (state.activeChatId == id) {
          state.activeChatId = null;
          state.messages = [];
          renderMessages();
        }

        await loadChats();
      } catch (e) {
        alert(e.message);
      }
    };
  });
}

function renderMessages() {
  if (!state.activeChatId) {
    messagesEl.innerHTML = `<div class="text-center text-sm text-muted-fg py-12">Crie um chat para começar.</div>`;
    return;
  }
  if (state.messages.length === 0) {
    messagesEl.innerHTML = `<div class="text-center text-sm text-muted-fg py-12">Olá! Mande sua primeira pergunta abaixo.</div>`;
    return;
  }
  messagesEl.innerHTML =
    state.messages
      .map((m) => {
        const isStudent = m.role === "student";
        return `
      <div class="flex gap-3 max-w-2xl mx-auto ${isStudent ? "flex-row-reverse" : ""}">
        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
          isStudent ? "bg-primary text-white" : "bg-muted text-white"
        }">${isStudent ? "EU" : "L"}</div>
        <div class="rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isStudent ? "bg-surface-2" : "bg-surface-2 border border-border"
        }">${esc(m.content)}</div>
      </div>`;
      })
      .join("") +
    (state.sending
      ? `
    <div class="flex items-center gap-2 text-xs text-muted-fg pl-10">
      <span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
      Lumina está pensando...
    </div>`
      : "");
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderExercises() {
  if (state.exercises.length === 0) {
    exercisesList.innerHTML = `<p class="text-xs text-muted-fg p-2">Nenhum exercício ainda.</p>`;
    return;
  }
  const colors = {
    easy: "bg-emerald-500/15 text-emerald-400",
    medium: "bg-amber-500/15 text-amber-400",
    hard: "bg-rose-500/15 text-rose-400",
  };
  const labels = { easy: "fácil", medium: "médio", hard: "difícil" };

  exercisesList.innerHTML = state.exercises
    .map(
      (ex) => `
    <div class="rounded-xl border border-border bg-surface-2 p-3" data-id="${esc(ex.id)}">
      <div class="text-[10px] uppercase tracking-widest text-muted-fg">${esc(ex.subject ?? "matéria")}</div>
      <p class="mt-1.5 text-sm leading-snug line-clamp-3">${esc(ex.question)}</p>
      <div class="mt-2 flex flex-wrap items-center gap-1.5">
        <span class="rounded-md px-2 py-0.5 text-[10px] ${colors[ex.difficulty] ?? "bg-muted"}">${labels[ex.difficulty] ?? ex.difficulty}</span>
        ${["A", "B", "C", "D"]
          .map(
            (l) => `
          <button data-answer="${l}" class="ex-answer rounded-md border border-border px-2 py-0.5 text-[10px] hover:bg-surface-2 transition">${l}</button>
        `,
          )
          .join("")}
      </div>
      <p class="ex-feedback mt-2 text-xs hidden"></p>
    </div>
  `,
    )
    .join("");

  exercisesList.querySelectorAll(".ex-answer").forEach((btn) => {
    btn.onclick = async () => {
      const card = btn.closest("[data-id]");
      const id = card.dataset.id;
      const feedback = card.querySelector(".ex-feedback");
      try {
        const r = await exerciseApi.answer(id, btn.dataset.answer);
        feedback.textContent = r.correct ? "✓ Correto!" : "✗ Tente novamente";
      } catch (e) {
        feedback.textContent = e.message;
      }
      feedback.classList.remove("hidden");
    };
  });
}

// ===== Ações =====
async function loadChats() {
  try {
    const r = await chatApi.listChats();
    state.chats = r.chats || [];
    if (state.chats[0] && !state.activeChatId) {
      await selectChat(state.chats[0].id);
    } else {
      renderChats();
    }
  } catch (e) {
    chatsList.innerHTML = `<p class="px-2 py-3 text-xs text-destructive">${esc(e.message)}</p>`;
  }
}

async function loadExercises() {
  try {
    const r = await exerciseApi.list();
    state.exercises = r.exercises || [];
    renderExercises();
  } catch (_) {
    /* ignorar */
  }
}

async function selectChat(id) {
  state.activeChatId = id;
  const chat = state.chats.find((c) => c.id === id);
  chatTitle.textContent = chat?.title ?? "Chat";
  inputMsg.disabled = false;
  btnSend.disabled = false;
  renderChats();
  messagesEl.innerHTML = `<div class="text-center text-sm text-muted-fg py-12">Carregando...</div>`;
  try {
    const r = await chatApi.listMessages(id);
    state.messages = r.messages || [];
    renderMessages();
  } catch (e) {
    messagesEl.innerHTML = `<div class="text-center text-sm text-destructive py-12">${esc(e.message)}</div>`;
  }
}

document.getElementById("btn-new-chat").onclick = async () => {
  const title = prompt("Título do novo chat:", "Nova conversa");
  if (!title) return;
  try {
    const r = await chatApi.newChat(title);
    state.chats.unshift(r.chat);
    await selectChat(r.chat.id);
  } catch (e) {
    alert(e.message);
  }
};

formSend.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = inputMsg.value.trim();
  if (!content || !state.activeChatId || state.sending) return;
  inputMsg.value = "";
  state.sending = true;
  state.messages.push({ role: "student", content });
  renderMessages();
  try {
    const r = await chatApi.sendMessage(state.activeChatId, content);
    state.messages.pop(); // remove otimista
    state.messages.push(
      ...(r.studentMessages || []),
      ...(r.luminaMessages || []),
    );
  } catch (err) {
    alert(err.message);
  } finally {
    state.sending = false;
    renderMessages();
  }
});

document.getElementById("btn-generate").onclick = async () => {
  const subject = prompt("Matéria:", "Matemática");
  if (!subject) return;
  const difficulty =
    prompt("Dificuldade (easy / medium / hard):", "medium") || "medium";
  try {
    const r = await exerciseApi.generate(subject, difficulty);
    state.exercises.unshift(r.exercise);
    renderExercises();
  } catch (e) {
    alert(e.message);
  }
};

document.getElementById("btn-toggle-exercises").onclick = () =>
  panelExercises.classList.toggle("hidden");
document.getElementById("btn-close-exercises").onclick = () =>
  panelExercises.classList.add("hidden");

// ===== Configurações =====
document.getElementById("btn-settings").onclick = () =>
  settingsModal.classList.remove("hidden");
document.getElementById("btn-close-settings").onclick = () =>
  settingsModal.classList.add("hidden");

document
  .getElementById("form-settings")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById("settings-msg");
    msgEl.textContent = "";
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {};
      if (data.nickname) payload.nickname = data.nickname;
      if (data.email) payload.email = data.email;
      if (Object.keys(payload).length) await userApi.updateProfile(payload);
      if (data.password) {
        const old = prompt("Confirme sua senha atual:");
        if (old) await userApi.changePassword(old, data.password);
      }
      msgEl.textContent = "Salvo!";
    } catch (err) {
      msgEl.textContent = err.message;
    }
  });

document.getElementById("btn-logout").onclick = async () => {
  await authApi.logout();
  clearToken();
  window.location.href = "index.html";
};

// ===== Init =====
async function init() {
  await loadChats();
  await loadExercises();
}

init();
