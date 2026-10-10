
"use strict";

/*
  STUDYSPARK AI CONTACT PAGE

  IMPORTANT:
  Replace the placeholder below with your WhatsApp number.
  India example: 919876543210
  Do not include +, spaces or hyphens.
*/
const WHATSAPP_NUMBER = "917498280416";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const fallback = document.getElementById("whatsappFallback");
  const messageField = document.getElementById("message");
  const charCount = document.getElementById("charCount");

  const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    topic: document.getElementById("topic"),
    subject: document.getElementById("subject"),
    message: messageField
  };

  const preview = {
    name: document.getElementById("previewName"),
    email: document.getElementById("previewEmail"),
    topic: document.getElementById("previewTopic"),
    subject: document.getElementById("previewSubject"),
    message: document.getElementById("previewMessage")
  };

  // Footer year
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Keep the preview safe by using textContent, not innerHTML.
  function updatePreview() {
    preview.name.textContent =
      fields.fullName.value.trim() || "Your name";

    preview.email.textContent =
      fields.email.value.trim() || "Your email";

    preview.topic.textContent =
      fields.topic.value || "Not selected";

    preview.subject.textContent =
      fields.subject.value.trim() || "Your subject";

    preview.message.textContent =
      fields.message.value.trim() ||
      "Your message will appear here as you type...";

    charCount.textContent = `${fields.message.value.length} / 1000`;
  }

  Object.values(fields).forEach((field) => {
    field.addEventListener("input", updatePreview);
    field.addEventListener("change", updatePreview);
  });

  function showStatus(message) {
    status.textContent = message;
  }

  function isConfiguredWhatsAppNumber(number) {
    return /^\d{10,15}$/.test(number) && !number.includes("X");
  }

  function buildWhatsAppMessage(data) {
    return [
      "✨ *NEW CONTACT MESSAGE* ✨",
      "",
      "👋 Hello StudySpark AI Team!",
      "",
      "━━━━━━━━━━━━━━━━━━━━",
      "👤 *CONTACT DETAILS*",
      "━━━━━━━━━━━━━━━━━━━━",
      `🙋 *Name:* ${data.fullName}`,
      `📧 *Email:* ${data.email}`,
      `📱 *Phone:* ${data.phone || "Not provided"}`,
      "",
      "━━━━━━━━━━━━━━━━━━━━",
      "📝 *ENQUIRY DETAILS*",
      "━━━━━━━━━━━━━━━━━━━━",
      `📌 *Topic:* ${data.topic}`,
      `💡 *Subject:* ${data.subject}`,
      "",
      "💬 *MESSAGE:*",
      data.message,
      "",
      "━━━━━━━━━━━━━━━━━━━━",
      "🎓 Sent from StudySpark AI Contact Page",
      "💜 Thank you!"
    ].join("\n");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showStatus("");
    fallback.hidden = true;
    fallback.removeAttribute("href");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!isConfiguredWhatsAppNumber(WHATSAPP_NUMBER)) {
      showStatus(
        "Please add your real WhatsApp number in contact.js before submitting."
      );
      return;
    }

    const data = {
      fullName: fields.fullName.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      topic: fields.topic.value,
      subject: fields.subject.value.trim(),
      message: fields.message.value.trim()
    };

    if (data.fullName.length < 2) {
      showStatus("Please enter your full name.");
      fields.fullName.focus();
      return;
    }

    if (data.subject.length < 3) {
      showStatus("Please enter a subject with at least 3 characters.");
      fields.subject.focus();
      return;
    }

    if (data.message.length < 10) {
      showStatus("Please enter a message with at least 10 characters.");
      fields.message.focus();
      return;
    }

    // Optional phone number: if supplied, check its format.
    if (
      data.phone &&
      !/^\+?[\d\s()-]{7,20}$/.test(data.phone)
    ) {
      showStatus("Please enter a valid phone number, or leave it blank.");
      fields.phone.focus();
      return;
    }

    const text = buildWhatsAppMessage(data);
    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    /*
      Open the page from the actual button submission gesture.
      The user must still press Send in WhatsApp.
    */
    const whatsappWindow = window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );

    if (whatsappWindow) {
      whatsappWindow.opener = null;
      showStatus(
        "WhatsApp has been opened. Please review your message and press Send there."
      );
    } else {
      // Fallback for browsers that block the new tab.
      fallback.href = whatsappURL;
      fallback.hidden = false;
      showStatus(
        "Your message is ready. Use the link below if WhatsApp did not open."
      );
      fallback.focus();
    }
  });

  updatePreview();
});