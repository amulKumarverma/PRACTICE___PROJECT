const realapi = "AIzaSyBks8xKewnGWMFdVjIwI-4SAYFo4ej_PKE";

const API_KEY = realapi; // Replace with your real key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function createLoadingMessage() {
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("message", "bot");
  loadingDiv.id = "loading-msg";

  const span = document.createElement("span");
  span.textContent = "Thinking";

  loadingDiv.appendChild(span);

  let dotCount = 0;
  const maxDots = 3;

  const interval = setInterval(() => {
    dotCount = (dotCount + 1) % (maxDots + 1);
    span.textContent = "Thinking" + ".".repeat(dotCount);
  }, 500);

  loadingDiv.dataset.interval = interval;
  return loadingDiv;
}

function removeLoadingMessage() {
  const loadingDiv = document.getElementById("loading-msg");
  if (loadingDiv) {
    clearInterval(loadingDiv.dataset.interval);
    loadingDiv.remove();
  }
}

async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  input.value = "";
  input.disabled = true;
  sendBtn.disabled = true;

  // Show loading animation
  const loadingMsg = createLoadingMessage();
  chatBox.appendChild(loadingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userText }] }]
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error.message || "API error");
    }

    const data = await res.json();
    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "🤖 Sorry, I couldn't understand.";

    removeLoadingMessage();
    addMessage(botReply, "bot");
  } catch (err) {
    removeLoadingMessage();
    addMessage(`⚠️ Error: ${err.message}`, "bot");
  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Initial welcome message
window.onload = () => {
  addMessage("Hello! I am your AI Crop Assistant. Ask me anything about crop health or farming in Bihar.", "bot");
};
