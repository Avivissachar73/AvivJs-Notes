import { createCmp, createState, render } from "../lib/AmazingFramwork.js";
import { ContactList } from "./ContactList.cmp.js";
import { ContactFilter } from "./ContactFilter.cmp.js";

import contacts from '../contacts.js';


const state = createState({
  filterStr: ''
})

export const AppMain = () => {
  console.log('CREATING MAIN CMP');
  const contactsToShow = contacts.filter(c => c.name.includes(state.filterStr));
  const onFilter = (filterVal) => {
    state.filterStr = filterVal;
    // console.log('RENDERING');
    // render();
    // console.log('FILTERING IN MAIN~!!~');
  }
  return createCmp({
    template: `
      <main class="app-main"></main>
    `,
    children: [
      ContactFilter(onFilter, state.filterStr),
      ContactList(contactsToShow)
    ]
  });
}