# @easycontact/react

Drop-in contact form widget for [EasyContactForm](https://easycontactforms.com).
Paste one component into any React or Next.js page and you're done — no
backend wiring, no email server, no Tailwind dependency.

```bash
npm i @easycontact/react
```

```tsx
import { ContactForm } from '@easycontact/react';

export default function ContactPage() {
  return <ContactForm projectId="YOUR_PROJECT_TOKEN" />;
}
```

The widget posts to `https://api.easycontactforms.com/form/submit` by default
and the submission shows up in your project's submissions table.

---

## Full-page contact page

If the form is the entire content of a route — e.g. `app/contact/page.tsx` —
add `layout="page"`. The widget then wraps itself in a full-height centered
section, so the form sits vertically centered and the footer lands at the
natural bottom of the page (no awkward gap). Pass an optional `heading` and
`description` to render a title block above the form:

```tsx
<ContactForm
  projectId="YOUR_PROJECT_TOKEN"
  layout="page"
  heading="Get in touch"
  description="Questions, feedback, or just want to say hi? Send us a message."
/>
```

The default `layout="inline"` continues to render just the form, suitable
for embedding inside an existing page section.

The vanilla `<script>` embed exposes the same controls via data attributes:

```html
<div data-easycontact="YOUR_PROJECT_TOKEN"
     data-easycontact-layout="page"
     data-easycontact-heading="Get in touch"
     data-easycontact-description="Questions? Send us a message."></div>
```

---

## Light / dark mode

The form ships with a light **and** a dark palette and picks the right one for
every visitor. Choose the behavior per-form with the `theme` prop:

```tsx
<ContactForm projectId="…" theme="auto"  />   {/* default — follow OS */}
<ContactForm projectId="…" theme="light" />   {/* force light */}
<ContactForm projectId="…" theme="dark"  />   {/* force dark */}
```

Both palettes have been chosen so labels, placeholders, error banners, and
the success state stay readable in either mode. There is nothing extra to
import.

### Driving the form from your own theme switcher

If your site already has a light/dark toggle, pass the same value through:

```tsx
const { theme } = useMyTheme(); // 'light' | 'dark'

<ContactForm projectId="…" theme={theme} />
```

### Plain HTML / `<script>` tag

The script-tag embed exposes the same three modes via a data attribute on the
mount node:

```html
<div data-easycontact="YOUR_PROJECT_TOKEN"
     data-easycontact-theme="dark"></div>

<script src="https://api.easycontactforms.com/widget/embed.js" defer></script>
```

Omit `data-easycontact-theme` to default to `auto`.

### Customizing styles

The widget renders inside a wrapper with the class **`.ecf-wrap`**. Both
themes are driven by CSS variables (`--ecf-bg`, `--ecf-fg`, `--ecf-primary`,
etc.) defined on that element, so you can tweak individual colors without
forking the component:

```css
/* Brand the submit button without touching the rest. */
.ecf-wrap { --ecf-primary: #e11d48; }

/* Or fine-tune just the dark palette. */
.ecf-wrap[data-theme="dark"] .ecf-button {
  box-shadow: 0 0 0 1px #f87171;
}
```

Inner elements have stable class names you can target:

| Element        | Class            |
|----------------|------------------|
| Wrapper        | `.ecf-wrap`      |
| Field row      | `.ecf-field`     |
| Label          | `.ecf-label`     |
| Text input     | `.ecf-input`     |
| Message field  | `.ecf-textarea`  |
| Submit button  | `.ecf-button`    |
| Error banner   | `.ecf-error`     |
| Success state  | `.ecf-success`   |

The wrapper also exposes `data-theme="auto" | "light" | "dark"` so you can
scope rules to a specific palette.

---

## Props

| Prop          | Type                                    | Default                           | Notes |
|---------------|-----------------------------------------|-----------------------------------|-------|
| `projectId`   | `string`                                | —                                 | Required. The project token from your dashboard. |
| `theme`       | `'auto' \| 'light' \| 'dark'`           | `'auto'`                          | Color palette. See above. |
| `layout`      | `'inline' \| 'page'`                    | `'inline'`                        | `page` fills the viewport vertically — use for dedicated contact routes. |
| `heading`     | `string`                                | —                                 | Title rendered above the form in `layout="page"`. |
| `description` | `string`                                | —                                 | Supporting line below the heading in `layout="page"`. |
| `apiBase`     | `string`                                | `https://api.easycontactforms.com`| Override only when self-hosting. |
| `className`   | `string`                                | —                                 | Extra class on the outer `<form>`. |
| `style`       | `React.CSSProperties`                   | —                                 | Inline styles merged into the wrapper. |
| `onSuccess`   | `(data: unknown) => void`               | —                                 | Fired after a successful submission. |
| `onError`     | `(error: Error) => void`                | —                                 | Fired on validation/network failures. |
