import { createCmp } from "../lib/AmazingFramwork.js";

export const ContactFilter = (onFilter, filterVal) => createCmp({
  template: `
    <input class="contact-filter" placeholder="Search!" value="${filterVal}"/>
  `,
  events: {
    oninput: (ev) => {
      onFilter(ev.target.value);
      const inputEl = document.querySelector('.contact-filter');
      inputEl.focus();
      inputEl.selectionStart = inputEl.value.length;
    }
  }
});