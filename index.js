// ======================
// SIDEBAR — TOGGLE RETRÁTIL
// ======================

const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

// ======================
// HISTORY — MENU RETRÁTIL
// ======================

const historyHeader = document.getElementById("historyHeader");
const historyList = document.getElementById("historyList");
const historyChevron = document.getElementById("historyChevron");

historyHeader.addEventListener("click", () => {
  const isClosed = historyList.classList.toggle("closed");
  historyChevron.classList.toggle("open");
  historyHeader.classList.toggle("closed", isClosed);
});

// ======================
// MODAL DE PERFIL
// ======================

const profileBtn = document.getElementById("profileBtn");
const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModal");
const saveProfileBtn = document.getElementById("saveProfile");

function openModal() {
  modalOverlay.classList.add("active");
}

function closeModal() {
  modalOverlay.classList.remove("active");
}

profileBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

saveProfileBtn.addEventListener("click", () => {
  const nome = document.getElementById("inputNome").value.trim();
  if (nome) {
    document.getElementById("profileName").textContent = nome;
  }
  closeModal();
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ======================
// CHAT SIMULADO
// ======================

const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const messagesContainer = document.getElementById("messages");

const replies = [
  "Boa pergunta! Quer que eu explique com um exemplo?",
  "Esse tema cai bastante no vestibular. Quer exercícios?",
  "Me conta mais sobre sua dúvida!",
  "Posso explicar a teoria ou ir direto pra prática, o que prefere?",
];

let busy = false;

function sendMsg() {
  if (busy) return;

  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = "";
  addMessage(text, "user");

  busy = true;
  const typingId = addTyping();

  setTimeout(
    () => {
      removeTyping(typingId);
      const reply = replies[Math.floor(Math.random() * replies.length)];
      addMessage(reply, "bot");
      busy = false;
    },
    800 + Math.random() * 500,
  );
}

function addMessage(text, side) {
  const div = document.createElement("div");
  div.className = "msg " + side;
  const p = document.createElement("p");
  p.textContent = text;
  div.appendChild(p);
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addTyping() {
  const div = document.createElement("div");
  div.className = "msg bot";
  const id = "typing-" + Date.now();
  div.id = id;
  div.innerHTML =
    '<div class="typing-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

newChatBtn.addEventListener("click", () => {
  messagesContainer.innerHTML =
    '<div class="msg bot"><p>Novo chat iniciado! O que vamos estudar hoje?</p></div>';
});

sendBtn.addEventListener("click", sendMsg);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMsg();
});
