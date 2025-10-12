// 🧩 CodeMirror setup
const htmlEditor = CodeMirror.fromTextArea(document.getElementById("html-code"), {
  mode: "xml",
  theme: "dracula",
  lineNumbers: true,
  autoCloseTags: true,
});

const cssEditor = CodeMirror.fromTextArea(document.getElementById("css-code"), {
  mode: "css",
  theme: "dracula",
  lineNumbers: true,
  autoCloseBrackets: true,
});

const jsEditor = CodeMirror.fromTextArea(document.getElementById("js-code"), {
  mode: "javascript",
  theme: "dracula",
  lineNumbers: true,
  autoCloseBrackets: true,
});

const output = document.getElementById("output");
const runBtn = document.getElementById("run-btn");
const themeToggle = document.getElementById("theme-toggle");
const downloadBtn = document.getElementById("download-btn");
const fileInput = document.getElementById("file-input");
const aiBtn = document.getElementById("ai-btn");
const aiSuggestions = document.getElementById("ai-suggestions"); // div or p in your HTML

// 🔹 Load saved code and theme
window.addEventListener("load", () => {
  htmlEditor.setValue(localStorage.getItem("html-code") || "");
  cssEditor.setValue(localStorage.getItem("css-code") || "");
  jsEditor.setValue(localStorage.getItem("js-code") || "");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.textContent = "🌙 Dark Mode";
  } else {
    themeToggle.textContent = "☀️ Light Mode";
  }

  runCode();
});

// 🔹 Run code in iframe
function runCode() {
  const html = htmlEditor.getValue();
  const css = `<style>${cssEditor.getValue()}</style>`;
  const js = `<script>${jsEditor.getValue()}<\/script>`;
  output.srcdoc = html + css + js;
}

// 🔹 Save code
function saveCode() {
  localStorage.setItem("html-code", htmlEditor.getValue());
  localStorage.setItem("css-code", cssEditor.getValue());
  localStorage.setItem("js-code", jsEditor.getValue());
}

// 🔹 Auto save + run on typing
[htmlEditor, cssEditor, jsEditor].forEach(editor => {
  editor.on("keyup", () => {
    saveCode();
    runCode();
  });
});

// 🔹 Run button
runBtn.addEventListener("click", runCode);

// 🔹 Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  themeToggle.textContent = isLight ? "🌙 Dark Mode" : "☀️ Light Mode";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// 🔹 Download code
downloadBtn.addEventListener("click", () => {
  const htmlContent = htmlEditor.getValue();
  const cssContent = `<style>${cssEditor.getValue()}</style>`;
  const jsContent = `<script>${jsEditor.getValue()}<\/script>`;

  const finalCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Exported Code</title>
  ${cssContent}
</head>
<body>
  ${htmlContent}
  ${jsContent}
</body>
</html>`;

  const blob = new Blob([finalCode], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "my_project.html";
  a.click();
  URL.revokeObjectURL(url);
});

// 🔹 Import code
fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const content = reader.result;
    if (file.name.endsWith(".html")) htmlEditor.setValue(content);
    else if (file.name.endsWith(".css")) cssEditor.setValue(content);
    else if (file.name.endsWith(".js")) jsEditor.setValue(content);
    saveCode();
    runCode();
  };
  reader.readAsText(file);
});

// 🤖 AI Assistant
aiBtn.addEventListener("click", async () => {
  const code = htmlEditor.getValue() + "\n" + cssEditor.getValue() + "\n" + jsEditor.getValue();

  aiBtn.textContent = "🤖 Thinking...";
  aiBtn.disabled = true;
  aiSuggestions.textContent = "Loading AI suggestions...";

  try {
    const response = await fetch("http://localhost:5000/api/ai-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `Help me improve or fix this code:\n${code}` }),
    });

    const data = await response.json();
    aiSuggestions.textContent = data.suggestion || "No suggestion received.";
  } catch (err) {
    aiSuggestions.textContent = "❌ Error connecting to AI assistant.";
    console.error(err);
  }

  aiBtn.textContent = "🤖 Get AI Help";
  aiBtn.disabled = false;
});
// 🤖 AI Assistant
aiBtn.addEventListener("click", async () => {
  const code = htmlEditor.getValue() + "\n" + cssEditor.getValue() + "\n" + jsEditor.getValue();

  aiBtn.textContent = "🤖 Thinking...";
  aiBtn.disabled = true;
  aiSuggestions.textContent = "Loading AI suggestions...";

  try {
    const response = await fetch("http://localhost:5000/api/ai-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `Help me improve or fix this code:\n${code}` }),
    });

    const data = await response.json();
    aiSuggestions.textContent = data.suggestion || "No suggestion received.";

    // Scroll to bottom automatically
    const panel = document.getElementById("ai-panel");
    panel.scrollTop = panel.scrollHeight;

  } catch (err) {
    aiSuggestions.textContent = "❌ Error connecting to AI assistant.";
    console.error(err);
  }

  aiBtn.textContent = "🤖 Get AI Help";
  aiBtn.disabled = false;
});
