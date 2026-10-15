const editor = document.getElementById("editor");
const language = document.getElementById("language");
const fileName = document.getElementById("fileName");
const editorHint = document.getElementById("editorHint");
const lineNumbers = document.getElementById("lineNumbers");
const lineCount = document.getElementById("lineCount");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");
const clearOutputBtn = document.getElementById("clearOutputBtn");
const output = document.getElementById("output");
const errors = document.getElementById("errors");
const runStatus = document.getElementById("runStatus");
const outputPlaceholder = document.getElementById("outputPlaceholder");
const errorPlaceholder = document.getElementById("errorPlaceholder");
const stdin = document.getElementById("stdin");
const htmlPreview = document.getElementById("htmlPreview");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const toast = document.getElementById("toast");

const examples = {
  python: 'print("Hello, StudySpark AI!")\na = 10\nb = 20\nprint("Addition =", a + b)',
  javascript: 'console.log("Hello, StudySpark AI!");\nconst a = 10;\nconst b = 20;\nconsole.log("Addition =", a + b);',
  c: '#include <stdio.h>\n\nint main(void) {\n    int a = 10, b = 20;\n    printf("Hello, StudySpark AI!\\n");\n    printf("Addition = %d\\n", a + b);\n    return 0;\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 10, b = 20;\n    cout << "Hello, StudySpark AI!" << endl;\n    cout << "Addition = " << a + b << endl;\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        int a = 10, b = 20;\n        System.out.println("Hello, StudySpark AI!");\n        System.out.println("Addition = " + (a + b));\n    }\n}',
  php: '<?php\n$a = 10;\n$b = 20;\necho "Hello, StudySpark AI!\\n";\necho "Addition = " . ($a + $b) . "\\n";\n?>',
  html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My First Page</title>\n  <style>\n    body { font-family: Arial; padding: 30px; background: #f3edff; }\n    h1 { color: #7048dc; }\n  </style>\n</head>\n<body>\n  <h1>Hello, StudySpark AI!</h1>\n  <p>My first live HTML preview.</p>\n  <button onclick="alert(\\'It works!\\')">Click me</button>\n</body>\n</html>'
};

const extensions = {
  python: "py",
  javascript: "js",
  c: "c",
  cpp: "cpp",
  java: "java",
  php: "php",
  html: "html"
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function updateEditorInfo() {
  const lang = language.value;
  fileName.textContent = `main.${extensions[lang]}`;
  editorHint.textContent = `${lang.toUpperCase()} editor`;

  const count = editor.value.split("\n").length;
  lineNumbers.textContent = Array.from({ length: count }, (_, i) => i + 1).join("\n");
  lineCount.textContent = `${count} line${count === 1 ? "" : "s"}`;
}

function setActiveTab(name) {
  document.querySelectorAll(".result-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === name);
  });

  document.getElementById("outputView").hidden = name !== "output";
  document.getElementById("errorsView").hidden = name !== "errors";
  document.getElementById("previewView").hidden = name !== "preview";
}

function clearResults() {
  output.textContent = "";
  errors.textContent = "";
  runStatus.textContent = "";
  output.hidden = true;
  errors.hidden = true;
  outputPlaceholder.hidden = false;
  errorPlaceholder.hidden = false;
  htmlPreview.hidden = true;
  previewPlaceholder.hidden = false;
  htmlPreview.srcdoc = "";
}

function showOutput(text) {
  output.textContent = text;
  output.hidden = !text;
  outputPlaceholder.hidden = Boolean(text);
}

function showErrors(text) {
  errors.textContent = text;
  errors.hidden = !text;
  errorPlaceholder.hidden = Boolean(text);
}

function displayRunResult(data) {
  const stdout = data.output || "";
  const errorText = [
    data.compileOutput,
    data.stderr,
    data.message
  ].filter(Boolean).join("\n").trim();

  showOutput(stdout || "(Program ran successfully but produced no output.)");
  showErrors(errorText || "");

  if (!errorText) {
    errorPlaceholder.querySelector("strong").textContent = "No errors found";
    errorPlaceholder.querySelector("p").textContent = "Your program finished without reported errors.";
  } else {
    errorPlaceholder.querySelector("strong").textContent = "Execution details";
    errorPlaceholder.querySelector("p").textContent = "Compiler or runtime messages are shown below.";
  }

  const details = [];
  if (data.status) details.push(data.status);
  if (data.time) details.push(`Time: ${data.time}s`);
  if (data.memory) details.push(`Memory: ${data.memory} KB`);
  runStatus.textContent = details.join("  ·  ");

  setActiveTab(errorText ? "errors" : "output");
}

async function runCode() {
  const code = editor.value;

  if (!code.trim()) {
    showToast("Please write some code first.");
    editor.focus();
    return;
  }

  clearResults();

  if (language.value === "html") {
    htmlPreview.srcdoc = code;
    htmlPreview.hidden = false;
    previewPlaceholder.hidden = true;
    setActiveTab("preview");
    runStatus.textContent = "HTML preview updated.";
    showOutput("HTML preview is ready.");
    showToast("Preview updated!");
    return;
  }

  runBtn.disabled = true;
  runBtn.innerHTML = '<span>⏳</span> Running...';
  runStatus.textContent = "Sending code to the execution service...";

  try {
    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language.value,
        code,
        stdin: stdin.value
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Request failed (${response.status}).`);
    }

    displayRunResult(data);
  } catch (error) {
    showOutput("");
    outputPlaceholder.hidden = false;
    outputPlaceholder.querySelector("strong").textContent = "Could not run code";
    outputPlaceholder.querySelector("p").textContent = "Check the server and internet connection, then try again.";

    showErrors(error.message || "Unknown execution error.");
    errorPlaceholder.hidden = false;
    errorPlaceholder.querySelector("strong").textContent = "Execution error";
    errorPlaceholder.querySelector("p").textContent = "The request could not be completed.";

    runStatus.textContent = "Execution failed.";
    setActiveTab("errors");
  } finally {
    runBtn.disabled = false;
    runBtn.innerHTML = "<span>▶</span> Run Code";
  }
}

language.addEventListener("change", () => {
  editor.value = examples[language.value] || "";
  clearResults();
  updateEditorInfo();
});

editor.addEventListener("input", updateEditorInfo);

editor.addEventListener("scroll", () => {
  lineNumbers.scrollTop = editor.scrollTop;
});

editor.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.setRangeText("    ", start, end, "end");
    updateEditorInfo();
  }

  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    runCode();
  }
});

runBtn.addEventListener("click", runCode);

resetBtn.addEventListener("click", () => {
  editor.value = examples[language.value] || "";
  stdin.value = "";
  clearResults();
  updateEditorInfo();
  showToast("Editor reset.");
});

clearOutputBtn.addEventListener("click", () => {
  clearResults();
  setActiveTab("output");
  showToast("Results cleared.");
});

document.querySelectorAll(".result-tab").forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});

editor.value = examples[language.value];
updateEditorInfo();
clearResults();