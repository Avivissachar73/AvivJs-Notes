import { createCmp } from "../lib/AmazingFramwork.js";
import { ContactPreview } from "./ContactPreview.cmp.js";

export const ContactList = (contacts) => createCmp({
  template: `
    <ul class="contact-list clean-list flex wrap justify-center"></ul>`,
  children: contacts.map(contact => ContactPreview(contact))
});