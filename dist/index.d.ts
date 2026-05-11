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
