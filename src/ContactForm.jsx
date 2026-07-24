// EasyContactForm React widget. Drop into any React/Next.js page with:
//   <ContactForm projectId="<your-token>" />
//
// Renders a 3-field form (Full Name, Email, Message) with a honeypot,
// client-side validation, loading state, inline errors, and a success state.
//
// ──────────────────────────────────────────────────────────────────────────
//  Theming
// ──────────────────────────────────────────────────────────────────────────
// The form supports three modes via the `theme` prop:
//
//   <ContactForm projectId="…" theme="auto"  />   // default — follows OS
//   <ContactForm projectId="…" theme="light" />   // forced light
//   <ContactForm projectId="…" theme="dark"  />   // forced dark
//
// The value is applied as `data-theme="…"` on the form's wrapper. The
// stylesheet (injected once per page) defines a light palette as default,
// overrides it for `[data-theme="dark"]`, and — when `[data-theme="auto"]`
// is set — falls back to the user's `prefers-color-scheme`.
//
// ──────────────────────────────────────────────────────────────────────────
//  Layout
// ──────────────────────────────────────────────────────────────────────────
// By default the wrapper is horizontally centered with a small horizontal
// gutter, so dropping `<ContactForm />` into any page produces a sensibly-
// laid-out form without extra wrapper markup.
//
// For pages where the form is the entire route (a dedicated "Contact" page),
// pass `layout="page"` plus optional `heading` / `description` props:
//
//   <ContactForm
//     projectId="…"
//     layout="page"
//     heading="Get in touch"
//     description="Questions, feedback, or just want to say hi?"
//   />
//
// That wraps the form in a `.ecf-page` section that fills the available
// vertical space (no awkward gap above the footer) and renders the heading
// block above the form.
//
// ──────────────────────────────────────────────────────────────────────────
//  Alignment
// ──────────────────────────────────────────────────────────────────────────
// Position the form within its container with the `align` and `offsetX`
// props. `align` accepts `"left" | "center" | "right"` (default `"center"`),
// and `offsetX` accepts a number (treated as pixels) or any CSS length
// (`"2rem"`, `"5%"`, `"clamp(0px,4vw,48px)"`, …). The offset is applied to
// the leading edge for `align="left"` and the trailing edge for
// `align="right"`; it is a no-op when `align="center"`.
//
//   <ContactForm projectId="…" align="left" />                  // flush left
//   <ContactForm projectId="…" align="right" />                 // flush right
//   <ContactForm projectId="…" align="left"  offsetX={32} />    // 32px from left
//   <ContactForm projectId="…" align="right" offsetX="2rem" />  // 2rem from right
//   <ContactForm projectId="…" offsetX="5%" />                  // centered (offset ignored)
//
// The form keeps its `max-width: 480px` cap, so left/right alignment only
// reveals itself when the surrounding container is wider than the form.
// On narrow viewports the form already fills the available width and stays
// where it is — there is no separate mobile-alignment knob to tune.
//
// To target the form from your own CSS for fine-tuning, use the
// `.ecf-wrap` class (e.g. `.ecf-wrap[data-theme="dark"] .ecf-button { … }`).
// Avoid relying on inline styles — they no longer exist on inner elements.
//
// NOTE: the same palette and layout rules are duplicated in `embed.js` (the
// script-tag version). If you tweak them here, update embed.js too.

import { useEffect, useState } from 'react';

// Production backend for the hosted EasyContactForm service. Consumers can
// override with the `apiBase` prop if they self-host their own backend.
const API_BASE = 'https://api.easycontactforms.com';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STYLE_ID = 'ecf-widget-styles';

const STYLES = `
.ecf-wrap,
.ecf-page {
  /* Light palette — also the fallback for "auto" when the OS is light. */
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

/* Alignment — center by default; left/right honour the optional
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

/* "Page" layout — fills the available vertical space so the form doesn't
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
.ecf-wrap .ecf-optional {
  font-weight: 400;
  opacity: 0.75;
}

/* Placeholder rows shown while the form definition is being fetched. */
.ecf-wrap .ecf-loading {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ecf-wrap .ecf-skeleton {
  display: block;
  height: 62px;
  border-radius: 6px;
  background: var(--ecf-input-bg);
  border: 1px solid var(--ecf-border);
  opacity: 0.6;
}
.ecf-wrap .ecf-skeleton-tall { height: 140px; }

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
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.appendChild(document.createTextNode(STYLES));
  document.head.appendChild(style);
}

// The fields every form had before the builder existed. Used as the fallback
// when the form definition cannot be fetched: a visitor facing a blank page
// because our API had a bad minute is far worse than a visitor filling in the
// classic three fields, which the backend still accepts.
const FALLBACK_FIELDS = [
  { key: 'full_name', label: 'Full name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'message', label: 'Message', type: 'textarea', required: true },
];

const FIELD_LIMITS = { text: 150, email: 190, phone: 40, textarea: 5000 };

const AUTOCOMPLETE = {
  full_name: 'name',
  name: 'name',
  email: 'email',
  phone: 'tel',
  company: 'organization',
};

/** Client-side validation, mirroring what the API enforces. */
function validateValue(field, raw) {
  const value = (raw || '').trim();

  if (!value) return field.required ? `${field.label} is required.` : null;
  if (field.type === 'email' && !EMAIL_RE.test(value)) return `${field.label} must be a valid email address.`;
  if (field.type === 'phone' && !/^[0-9+()/.\s-]{3,40}$/.test(value)) {
    return `${field.label} must be a valid phone number.`;
  }
  return null;
}

function normalizeTheme(value) {
  return value === 'light' || value === 'dark' ? value : 'auto';
}

function normalizeLayout(value) {
  return value === 'page' ? 'page' : 'inline';
}

function normalizeAlign(value) {
  return value === 'left' || value === 'right' ? value : 'center';
}

// Returns a CSS length string for the `offsetX` prop, or null when there
// is nothing to apply. Numbers are treated as pixels; strings pass through
// so callers can use any CSS length (`"2rem"`, `"5%"`, `clamp(...)`, …).
function formatOffsetX(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) && value !== 0 ? `${value}px` : null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' || trimmed === '0' ? null : trimmed;
  }
  return null;
}

export function ContactForm({
  formId,
  projectId,
  apiBase = API_BASE,
  className,
  style,
  theme = 'auto',
  layout = 'inline',
  align = 'center',
  offsetX,
  heading,
  description,
  onSuccess,
  onError,
}) {
  // Whatever fields the customer configured, keyed by field key.
  const [values, setValues] = useState({});
  const [fields, setFields] = useState(null); // null = still loading
  const [website, setWebsite] = useState(''); // honeypot
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => { injectStylesOnce(); }, []);

  const base = apiBase.replace(/\/$/, '');

  // Fetch the form definition so the widget renders the fields the customer
  // actually asked for rather than a hardcoded three.
  useEffect(() => {
    if (!formId && !projectId) return undefined;

    let cancelled = false;
    const params = formId
      ? `form_token=${encodeURIComponent(formId)}`
      : `project_token=${encodeURIComponent(projectId)}`;

    fetch(`${base}/form/config?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const definition = json && json.success === true ? json.data?.form?.fields : null;
        setFields(Array.isArray(definition) && definition.length > 0 ? definition : FALLBACK_FIELDS);
      })
      .catch(() => {
        if (!cancelled) setFields(FALLBACK_FIELDS);
      });

    return () => { cancelled = true; };
  }, [base, formId, projectId]);

  const dataTheme = normalizeTheme(theme);
  const dataLayout = normalizeLayout(layout);
  const dataAlign = normalizeAlign(align);
  const offsetCss = dataAlign === 'center' ? null : formatOffsetX(offsetX);
  const offsetStyle = offsetCss ? { '--ecf-offset-x': offsetCss } : null;

  // Input ids have to be unique when two forms share a page.
  const tokenForIds = String(formId || projectId || '').slice(0, 12);

  function setValue(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  if (!formId && !projectId) {
    return (
      <div className="ecf-wrap" data-theme={dataTheme} data-align={dataAlign}>
        <div className="ecf-fatal">
          EasyContactForm: pass a <code>formId</code> (or a <code>projectId</code> for the project&apos;s
          default form).
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');

    for (const field of fields) {
      const problem = validateValue(field, values[field.key]);
      if (problem) { setErr(problem); return; }
    }

    const payload = {};
    fields.forEach((field) => {
      const value = (values[field.key] || '').trim();
      if (value) payload[field.key] = value;
    });

    setBusy(true);
    try {
      const res = await fetch(`${base}/form/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(formId ? { form_token: formId } : { project_token: projectId }),
          fields: payload,
          website,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!json || json.success !== true) {
        throw new Error((json && json.error) || 'Submission failed. Please try again.');
      }
      setDone(true);
      if (typeof onSuccess === 'function') {
        try { onSuccess(json.data); } catch { /* consumer callback failure must not break the UI */ }
      }
    } catch (e2) {
      const message = e2.message || 'Submission failed. Please try again.';
      setErr(message);
      if (typeof onError === 'function') {
        try { onError(e2 instanceof Error ? e2 : new Error(message)); } catch { /* swallow */ }
      }
    } finally {
      setBusy(false);
    }
  }

  const wrapClass = ['ecf-wrap', className].filter(Boolean).join(' ');
  // When the form sits inside .ecf-page the CSS variable is set on the
  // section instead, so the wrap doesn't need its own copy.
  const wrapStyle = dataLayout === 'page'
    ? style
    : { ...(offsetStyle || null), ...(style || null) };

  const formNode = fields === null ? (
    // The definition is still in flight. Placeholder rows rather than nothing,
    // so the surrounding page does not jump once the fields arrive.
    <div className={wrapClass} data-theme={dataTheme} data-align={dataAlign} style={wrapStyle}>
      <div className="ecf-loading" aria-live="polite" aria-busy="true">
        <span className="ecf-skeleton" />
        <span className="ecf-skeleton" />
        <span className="ecf-skeleton ecf-skeleton-tall" />
      </div>
    </div>
  ) : done ? (
    <div className={wrapClass} data-theme={dataTheme} data-align={dataAlign} style={wrapStyle}>
      <div className="ecf-success">✓ Thanks! Your message has been sent.</div>
    </div>
  ) : (
    <form
      className={wrapClass}
      data-theme={dataTheme}
      data-align={dataAlign}
      style={wrapStyle}
      onSubmit={handleSubmit}
      noValidate
    >
      {err && <div className="ecf-error">{err}</div>}

      {fields.map((field) => {
        const inputId = `ecf-${tokenForIds}-${field.key}`;
        const limit = FIELD_LIMITS[field.type] || 255;

        return (
          <div className="ecf-field" key={field.key}>
            <label className="ecf-label" htmlFor={inputId}>
              {field.label}
              {!field.required && <span className="ecf-optional"> (optional)</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={inputId}
                className="ecf-textarea"
                value={values[field.key] || ''}
                onChange={(e) => setValue(field.key, e.target.value)}
                maxLength={limit}
                required={field.required}
              />
            ) : (
              <input
                id={inputId}
                className="ecf-input"
                type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                value={values[field.key] || ''}
                onChange={(e) => setValue(field.key, e.target.value)}
                maxLength={limit}
                autoComplete={AUTOCOMPLETE[field.key] || 'on'}
                required={field.required}
              />
            )}
          </div>
        );
      })}

      {/* Honeypot — invisible to humans, irresistible to bots. */}
      <div className="ecf-hp" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="ecf-button" disabled={busy}>
        {busy ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );

  if (dataLayout === 'page') {
    return (
      <section
        className="ecf-page"
        data-theme={dataTheme}
        data-align={dataAlign}
        style={offsetStyle || undefined}
      >
        {(heading || description) && (
          <header className="ecf-page-heading">
            {heading && <h1 className="ecf-page-title">{heading}</h1>}
            {description && <p className="ecf-page-description">{description}</p>}
          </header>
        )}
        {formNode}
      </section>
    );
  }

  return formNode;
}

export default ContactForm;
