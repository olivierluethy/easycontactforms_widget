import * as React from 'react';

export interface ContactFormProps {
  /**
   * The form token from your EasyContactForm dashboard. Looks like
   * `8570afb8223dd211693581bc`.
   *
   * The widget fetches this form's field definition and renders exactly the
   * fields you configured, in the order you configured them.
   *
   * Pass either `formId` or `projectId`.
   */
  formId?: string;

  /**
   * The project token from your EasyContactForm dashboard.
   *
   * Submits to whichever form is the project's default. This is what snippets
   * generated before custom forms existed use, and it keeps working — but
   * prefer `formId` for new work, since a project can now hold several forms.
   */
  projectId?: string;

  /**
   * Override the default backend URL. Defaults to the hosted EasyContactForm API
   * (`https://api.easycontactforms.com`). Pass this only if you self-host the
   * PHP backend on a different domain.
   */
  apiBase?: string;

  /** Class applied to the outer `<form>` element. */
  className?: string;

  /** Inline styles merged into the form's default wrapper styles. */
  style?: React.CSSProperties;

  /**
   * Color palette for the form.
   *
   * - `'auto'` (default): follows the visitor's `prefers-color-scheme`.
   * - `'light'`: always render the light palette.
   * - `'dark'`: always render the dark palette.
   *
   * The chosen value is exposed as `data-theme="…"` on the form's wrapper,
   * so your own CSS can fine-tune either mode via selectors like
   * `.ecf-wrap[data-theme="dark"] .ecf-button`.
   */
  theme?: 'auto' | 'light' | 'dark';

  /**
   * How the form is positioned in the page.
   *
   * - `'inline'` (default): render just the form, horizontally centered with
   *   a max-width of 480px. Use this when the form is one piece of a larger
   *   page.
   * - `'page'`: wrap the form in a full-height centered section so it fills
   *   the available vertical space — no awkward gap between the form and a
   *   footer. Use this for a dedicated contact route.
   */
  layout?: 'inline' | 'page';

  /**
   * Horizontal alignment of the form within its container.
   *
   * - `'center'` (default): the form is centered (`margin-inline: auto`).
   * - `'left'` / `'right'`: pin the form to the leading/trailing edge of
   *   its container. Useful when you want the form flush with a navbar
   *   or sidebar instead of floating in the middle of a wide section.
   *
   * The form keeps its `max-width: 480px` cap, so alignment is only
   * visible when the surrounding container is wider than the form.
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Distance from the leading edge (for `align="left"`) or trailing edge
   * (for `align="right"`) of the form's container. A `number` is treated
   * as pixels; pass any CSS length string (`'2rem'`, `'5%'`,
   * `'clamp(0px,4vw,48px)'`) for finer control. Ignored when
   * `align="center"`.
   */
  offsetX?: number | string;

  /**
   * Optional heading rendered above the form. Only displayed in
   * `layout="page"` mode.
   */
  heading?: string;

  /**
   * Optional supporting line rendered below the heading. Only displayed in
   * `layout="page"` mode.
   */
  description?: string;

  /**
   * Called after a successful submission with the server's response payload.
   * Use this to fire analytics, run a redirect, or show your own confirmation
   * UI alongside the built-in success state.
   */
  onSuccess?: (data: unknown) => void;

  /**
   * Called when a submission fails — either because of a validation error, a
   * network error, or a non-success response from the API. Receives a normal
   * `Error` whose `message` is the same human-readable string the widget
   * renders inline.
   */
  onError?: (error: Error) => void;
}

/**
 * Drop-in contact form for EasyContactForm.
 *
 * Fetches the form's field definition from the API and renders those fields,
 * validating each one according to its type before posting. If the definition
 * cannot be reached it falls back to Full name / Email / Message, so a network
 * problem degrades the form rather than blanking it.
 */
export const ContactForm: React.FC<ContactFormProps>;

export default ContactForm;
