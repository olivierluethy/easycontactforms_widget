"use client";

// src/ContactForm.jsx
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var API_BASE = "https://api.easycontactforms.com";
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var styles = {
  wrap: {
    maxWidth: 480,
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: "#1f2933",
    fontSize: 15,
    lineHeight: 1.5
  },
  field: { marginBottom: 14 },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: 500,
    fontSize: 13,
    color: "#4b5563"
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    font: "inherit",
    background: "#fff",
    color: "#1f2933",
    boxSizing: "border-box"
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    font: "inherit",
    minHeight: 120,
    resize: "vertical",
    background: "#fff",
    color: "#1f2933",
    boxSizing: "border-box"
  },
  button: {
    padding: "10px 18px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    font: "inherit",
    fontWeight: 500,
    cursor: "pointer"
  },
  buttonBusy: {
    opacity: 0.7,
    cursor: "not-allowed"
  },
  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "10px 12px",
    borderRadius: 6,
    marginBottom: 14,
    fontSize: 14
  },
  success: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534",
    padding: "14px 16px",
    borderRadius: 6,
    fontSize: 15
  },
  honeypot: {
    position: "absolute",
    left: "-9999px",
    width: 1,
    height: 1,
    opacity: 0
  },
  fatal: {
    padding: "14px 16px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: 6,
    fontFamily: "system-ui, sans-serif",
    fontSize: 14
  }
};
function ContactForm({
  projectId,
  apiBase = API_BASE,
  className,
  style,
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
  if (!projectId) {
    return /* @__PURE__ */ jsxs("div", { style: styles.fatal, children: [
      "EasyContactForm: missing ",
      /* @__PURE__ */ jsx("code", { children: "projectId" }),
      " prop."
    ] });
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
  const wrapStyle = { ...styles.wrap, ...style || {} };
  if (done) {
    return /* @__PURE__ */ jsx("div", { className, style: wrapStyle, children: /* @__PURE__ */ jsx("div", { style: styles.success, children: "\u2713 Thanks! Your message has been sent." }) });
  }
  return /* @__PURE__ */ jsxs("form", { className, style: wrapStyle, onSubmit: handleSubmit, noValidate: true, children: [
    err && /* @__PURE__ */ jsx("div", { style: styles.error, children: err }),
    /* @__PURE__ */ jsxs("div", { style: styles.field, children: [
      /* @__PURE__ */ jsx("label", { style: styles.label, htmlFor: "ecf-name", children: "Full name" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "ecf-name",
          style: styles.input,
          type: "text",
          value: fullName,
          onChange: (e) => setFullName(e.target.value),
          maxLength: 150,
          autoComplete: "name"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { style: styles.field, children: [
      /* @__PURE__ */ jsx("label", { style: styles.label, htmlFor: "ecf-email", children: "Email" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "ecf-email",
          style: styles.input,
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          maxLength: 190,
          autoComplete: "email"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { style: styles.field, children: [
      /* @__PURE__ */ jsx("label", { style: styles.label, htmlFor: "ecf-message", children: "Message" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          id: "ecf-message",
          style: styles.textarea,
          value: message,
          onChange: (e) => setMessage(e.target.value),
          maxLength: 5e3
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { style: styles.honeypot, "aria-hidden": "true", children: /* @__PURE__ */ jsxs("label", { children: [
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
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        style: { ...styles.button, ...busy ? styles.buttonBusy : null },
        disabled: busy,
        children: busy ? "Sending\u2026" : "Send message"
      }
    )
  ] });
}
var ContactForm_default = ContactForm;
export {
  ContactForm,
  ContactForm_default as default
};
//# sourceMappingURL=index.mjs.map