import * as React from 'react';

export interface ContactFormProps {
  /**
   * The project token from your EasyContactForm dashboard. Required.
   * Looks like `8570afb8223dd211693581bc`.
   */
  projectId: string;

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
 * Drop-in contact form for EasyContactForm. Renders three fields (Full Name,
 * Email, Message), validates client-side, posts to the EasyContactForm API,
 * and swaps to a success state on submission.
 */
export const ContactForm: React.FC<ContactFormProps>;

export default ContactForm;
