import { createCmp } from "../lib/AmazingFramwork.js";

export const ContactPreview = (contact) => createCmp({
  template: `
    <li class="contact-preview">
      <pre>${JSON.stringify(contact, null, 2)}</pre>
    </li>
  `,
});