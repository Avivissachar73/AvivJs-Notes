'use strict';

export default class NoteFilter {
    name = 'note-filter';
    template = `
        <section class="note-filter width-half1 flex align-cemter space-between wrap">
            <input type="text" placeholder="search" A-model="filterBy.searchStr" @keyup="filter"/>
            <select ref="selectEl" value="{{filterBy.type}}" A-model="filterBy.type" @change="filter">
                <option value="all" label="All"/>
                <option value="text" label="Text"/>    
                <option value="image" label="Image"/>    
                <option value="audio" label="Audio"/>    
                <option value="video" label="Video"/>    
            </select>    
        </section>
    `;
    state = {
        filterBy: {
            searchStr: '',
            type: 'all'
        }
    }
    methods = {
        filter() {
            this.context.emit('filter', {...this.filterBy});
            this.context.refs.selectEl.value = this.filterBy.type;
        }
    }
}