"use client";

// src/ContactForm.jsx
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var API_BASE = "https://api.easycontactforms.com";
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var STYLE_ID = "ecf-widget-styles";
var STYLES = `
.ecf-wrap,
.ecf-page {
  /* Light palette \u2014 also the fallback for "auto" when the OS is light. */
  --ecf-bg: transparent;
  --ecf-fg: #1f2933;
  --ecf-muted: #4b5563;
  --ecf-input-bg: #ffffff;
  --ecf-input-fg: #1f2933;
  --ecf-border: #d1d5db;
  --ecf-primary: #2563eb;
  --ecf-primary-fg: #ffffff;
  --ecf-error-bg: #fef2f2;
  --ecf-error-border: #fecaca;
  --ecf-error-fg: #991b1b;
  --ecf-success-bg: #f0fdf4;
  --ecf-success-border: #bbf7d0;
  --ecf-success-fg: #166534;

  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
}

.ecf-wrap {
  max-width: 480px;
  padding-inline: 16px;
  width: 100%;
  font-size: 15px;
  line-height: 1.5;
  color: var(--ecf-fg);
  background: var(--ecf-bg);
}
.ecf-wrap * { box-sizing: border-box; }

/* Alignment \u2014 center by default; left/right honour the optional
   --ecf-offset-x custom property (a CSS length, set from the offsetX
   prop). The form keeps its max-width: 480px cap, so alignment only
   matters when the surrounding container is wider than the form. */
.ecf-wrap[data-align="center"] { margin-inline: auto; }
.ecf-wrap[data-align="left"]   { margin-inline-start: var(--ecf-offset-x, 0); margin-inline-end: auto; }
.ecf-wrap[data-align="right"]  { margin-inline-start: auto; margin-inline-end: var(--ecf-offset-x, 0); }

.ecf-wrap[data-theme="dark"],
.ecf-page[data-theme="dark"] {
  --ecf-fg: #e2e8f0;
  --ecf-muted: #94a3b8;
  --ecf-input-bg: #0b1322;
  --ecf-input-fg: #e2e8f0;
  --ecf-border: #334155;
  --ecf-primary: #60a5fa;
  --ecf-primary-fg: #0f172a;
  --ecf-error-bg: #3f1d1d;
  --ecf-error-border: #7f1d1d;
  --ecf-error-fg: #fecaca;
  --ecf-success-bg: #14352a;
  --ecf-success-border: #166534;
  --ecf-success-fg: #bbf7d0;
}

@media (prefers-color-scheme: dark) {
  .ecf-wrap[data-theme="auto"],
  .ecf-page[data-theme="auto"] {
    --ecf-fg: #e2e8f0;
    --ecf-muted: #94a3b8;
    --ecf-input-bg: #0b1322;
    --ecf-input-fg: #e2e8f0;
    --ecf-border: #334155;
    --ecf-primary: #60a5fa;
    --ecf-primary-fg: #0f172a;
    --ecf-error-bg: #3f1d1d;
    --ecf-error-border: #7f1d1d;
    --ecf-error-fg: #fecaca;
    --ecf-success-bg: #14352a;
    --ecf-success-border: #166534;
    --ecf-success-fg: #bbf7d0;
  }
}

/* "Page" layout \u2014 fills the available vertical space so the form doesn't
   leave a huge gap above whatever follows it (typically a footer pushed
   down by a flex-1 main). */
.ecf-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* clamp() keeps the section tall enough to feel like a real page on a
     mostly-empty layout, without overflowing on short viewports. */
  min-height: clamp(420px, calc(100vh - 12rem), 100vh);
  width: 100%;
  padding: 48px 16px;
  color: var(--ecf-fg);
}
@media (min-width: 640px) { .ecf-page { padding: 64px 24px; } }
@media (min-width: 768px) { .ecf-page { padding: 80px 24px; } }

.ecf-page .ecf-wrap {
  /* .ecf-page already provides the horizontal padding. */
  padding-inline: 0;
}

/* Alignment inside the page layout: the section is a flex column, so
   align-items controls horizontal placement of the heading block and the
   form. Heading text alignment follows. The --ecf-offset-x set on
   .ecf-page cascades down to .ecf-wrap and .ecf-page-heading. */
.ecf-page[data-align="left"]  { align-items: flex-start; }
.ecf-page[data-align="right"] { align-items: flex-end; }
.ecf-page[data-align="left"]  .ecf-page-heading { text-align: left;  margin-inline-start: var(--ecf-offset-x, 0); margin-inline-end: auto; }
.ecf-page[data-align="right"] .ecf-page-heading { text-align: right; margin-inline-start: auto; margin-inline-end: var(--ecf-offset-x, 0); }

.ecf-page-heading {
  text-align: center;
  width: 100%;
  max-width: 560px;
  margin: 0 auto 32px;
}
@media (min-width: 640px) { .ecf-page-heading { margin-bottom: 40px; } }

.ecf-page-title {
  font-size: 1.875rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.1;
  margin: 0 0 12px 0;
  color: var(--ecf-fg);
}
@media (min-width: 640px) { .ecf-page-title { font-size: 2.25rem; } }
@media (min-width: 768px) { .ecf-page-title { font-size: 3rem; } }

.ecf-page-description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--ecf-muted);
  margin: 0;
}
@media (min-width: 640px) { .ecf-page-description { font-size: 1.125rem; } }

.ecf-wrap .ecf-field { margin-bottom: 14px; }
.ecf-wrap .ecf-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 13px;
  color: var(--ecf-muted);
}
.ecf-wrap .ecf-input,
.ecf-wrap .ecf-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--ecf-border);
  border-radius: 6px;
  font: inherit;
  background: var(--ecf-input-bg);
  color: var(--ecf-input-fg);
}
.ecf-wrap .ecf-input:focus,
.ecf-wrap .ecf-textarea:focus {
  outline: none;
  border-color: var(--ecf-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ecf-primary) 25%, transparent);
}
.ecf-wrap .ecf-textarea { min-height: 120px; resize: vertical; }
.ecf-wrap .ecf-button {
  padding: 10px 18px;
  background: var(--ecf-primary);
  color: var(--ecf-primary-fg);
  border: none;
  border-radius: 6px;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
}
.ecf-wrap .ecf-button:disabled { opacity: 0.7; cursor: not-allowed; }
/* Full-width on mobile for thumb-reach; auto width above the sm breakpoint. */
@media (max-width: 640px) {
  .ecf-wrap .ecf-button { width: 100%; }
}
.ecf-wrap .ecf-error {
  background: var(--ecf-error-bg);
  border: 1px solid var(--ecf-error-border);
  color: var(--ecf-error-fg);
  padding: 10px 12px;
  border-radius: 6px;
  margin-bottom: 14px;
  font-size: 14px;
}
.ecf-wrap .ecf-success {
  background: var(--ecf-success-bg);
  border: 1px solid var(--ecf-success-border);
  color: var(--ecf-success-fg);
  padding: 14px 16px;
  border-radius: 6px;
  font-size: 15px;
}
.ecf-wrap .ecf-hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.ecf-wrap .ecf-fatal {
  padding: 14px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 6px;
  font-family: system-ui, sans-serif;
  font-size: 14px;
}
`;
function injectStylesOnce() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.appendChild(document.createTextNode(STYLES));
  document.head.appendChild(style);
}
function normalizeTheme(value) {
  return value === "light" || value === "dark" ? value : "auto";
}
function normalizeLayout(value) {
  return value === "page" ? "page" : "inline";
}
function normalizeAlign(value) {
  return value === "left" || value === "right" ? value : "center";
}
function formatOffsetX(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number") {
    return Number.isFinite(value) && value !== 0 ? `${value}px` : null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" || trimmed === "0" ? null : trimmed;
  }
  return null;
}
function ContactForm({
  projectId,
  apiBase = API_BASE,
  className,
  style,
  theme = "auto",
  layout = "inline",
  align = "center",
  offsetX,
  heading,
  description,
  onSuccess,
  onError
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    injectStylesOnce();
  }, []);
  const dataTheme = normalizeTheme(theme);
  const dataLayout = normalizeLayout(layout);
  const dataAlign = normalizeAlign(align);
  const offsetCss = dataAlign === "center" ? null : formatOffsetX(offsetX);
  const offsetStyle = offsetCss ? { "--ecf-offset-x": offsetCss } : null;
  if (!projectId) {
    return /* @__PURE__ */ jsx("div", { className: "ecf-wrap", "data-theme": dataTheme, "data-align": dataAlign, children: /* @__PURE__ */ jsxs("div", { className: "ecf-fatal", children: [
      "EasyContactForm: missing ",
      /* @__PURE__ */ jsx("code", { children: "projectId" }),
      " prop."
    ] }) });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!fullName.trim()) {
      setErr("Please enter your full name.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setErr("Please enter a valid email address.");
      return;
    }
    if (!message.trim()) {
      setErr("Please enter a message.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${apiBase.replace(/\/$/, "")}/form/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_token: projectId,
          full_name: fullName.trim(),
          email: email.trim(),
          message: message.trim(),
          website
        })
      });
      const json = await res.json().catch(() => null);
      if (!json || json.success !== true) {
        throw new Error(json && json.error || "Submission failed. Please try again.");
      }
      setDone(true);
      if (typeof onSuccess === "function") {
        try {
          onSuccess(json.data);
        } catch {
        }
      }
    } catch (e2) {
      const message2 = e2.message || "Submission failed. Please try again.";
      setErr(message2);
      if (typeof onError === "function") {
        try {
          onError(e2 instanceof Error ? e2 : new Error(message2));
        } catch {
        }
      }
    } finally {
      setBusy(false);
    }
  }
  const wrapClass = ["ecf-wrap", className].filter(Boolean).join(" ");
  const wrapStyle = dataLayout === "page" ? style : { ...offsetStyle || null, ...style || null };
  const formNode = done ? /* @__PURE__ */ jsx("div", { className: wrapClass, "data-theme": dataTheme, "data-align": dataAlign, style: wrapStyle, children: /* @__PURE__ */ jsx("div", { className: "ecf-success", children: "\u2713 Thanks! Your message has been sent." }) }) : /* @__PURE__ */ jsxs(
    "form",
    {
      className: wrapClass,
      "data-theme": dataTheme,
      "data-align": dataAlign,
      style: wrapStyle,
      onSubmit: handleSubmit,
      noValidate: true,
      children: [
        err && /* @__PURE__ */ jsx("div", { className: "ecf-error", children: err }),
        /* @__PURE__ */ jsxs("div", { className: "ecf-field", children: [
          /* @__PURE__ */ jsx("label", { className: "ecf-label", htmlFor: "ecf-name", children: "Full name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "ecf-name",
              className: "ecf-input",
              type: "text",
              value: fullName,
              onChange: (e) => setFullName(e.target.value),
              maxLength: 150,
              autoComplete: "name"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ecf-field", children: [
          /* @__PURE__ */ jsx("label", { className: "ecf-label", htmlFor: "ecf-email", children: "Email" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "ecf-email",
              className: "ecf-input",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              maxLength: 190,
              autoComplete: "email"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ecf-field", children: [
          /* @__PURE__ */ jsx("label", { className: "ecf-label", htmlFor: "ecf-message", children: "Message" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "ecf-message",
              className: "ecf-textarea",
              value: message,
              onChange: (e) => setMessage(e.target.value),
              maxLength: 5e3
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ecf-hp", "aria-hidden": "true", children: /* @__PURE__ */ jsxs("label", { children: [
          "Website",
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              tabIndex: -1,
              autoComplete: "off",
              value: website,
              onChange: (e) => setWebsite(e.target.value)
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "ecf-button", disabled: busy, children: busy ? "Sending\u2026" : "Send message" })
      ]
    }
  );
  if (dataLayout === "page") {
    return /* @__PURE__ */ jsxs(
      "section",
      {
        className: "ecf-page",
        "data-theme": dataTheme,
        "data-align": dataAlign,
        style: offsetStyle || void 0,
        children: [
          (heading || description) && /* @__PURE__ */ jsxs("header", { className: "ecf-page-heading", children: [
            heading && /* @__PURE__ */ jsx("h1", { className: "ecf-page-title", children: heading }),
            description && /* @__PURE__ */ jsx("p", { className: "ecf-page-description", children: description })
          ] }),
          formNode
        ]
      }
    );
  }
  return formNode;
}
var ContactForm_default = ContactForm;
export {
  ContactForm,
  ContactForm_default as default
};
//# sourceMappingURL=index.mjs.map