'use strict';

export default class NoteFilter {
    name = 'note-filter';
    template = `
        <section class="note-filter width-half1 flex align-cemter space-between wrap gap5">
            <input type="text" placeholder="{{$t('_commonLocales.search')}}" A-model="filterBy.searchStr" @keyup="filter"/>
            <select ref="selectEl" value="{{filterBy.type}}" A-model="filterBy.type" @change="filter">
                <option value="all" label="{{$t('_noteLocales._types.all')}}"/>
                <option value="text" label="{{$t('_noteLocales._types.text')}}"/>    
                <option value="image" label="{{$t('_noteLocales._types.image')}}"/>    
                <option value="audio" label="{{$t('_noteLocales._types.audio')}}"/>    
                <option value="video" label="{{$t('_noteLocales._types.video')}}"/>    
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