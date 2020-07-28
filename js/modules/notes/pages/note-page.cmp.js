'use strict';

import NoteList from '../cmps/note-list.cmp.js';
import NoteFilter from '../cmps/note-filter.cmp.js';

export default class NotePage {
    name = 'note-page';
    template = `
        <main class="note-page app-main column-layout">
            <div class="actions container width-all flex align-center space-between wrap">
                <NoteFilter @filter="setFilter"/>
                <RouterLink className="inline-block" url="/note/edit">New</RouterLink>
            </div>
            <NoteList A-if="pinedNotes && pinedNotes.length" className="pinned-notes" notes="{{pinedNotes}}" @noteUpdate="updateNote" @removeNote="removeNote" @pinNote="pinNote"/>
            <note-list A-if="unPinedNotes && unPinedNotes.length" className="" notes="{{unPinedNotes}}" @noteUpdate="updateNote" @removeNote="removeNote" @pinNote="pinNote"/>
            <RouterView someProp="wow"/>
        </main>
    `;
    computed = {
        notesToShow() {
            return this.context.store.notesToShow;
        },
        pinedNotes() {
            return this.notesToShow.filter(curr => {
                return curr.isPined;
            });
        },
        unPinedNotes() {
            return this.notesToShow.filter(curr => {
                return !curr.isPined;
            });
        }
    }
    methods = {
        setFilter(filterBy) {
            this.context.store.setFilter(filterBy);
        },
        updateNote(noteId, newInfo) {
            this.context.store.updateNoteInfo(noteId, newInfo);
        },
        removeNote(id) {
            this.context.store.removeNote(id);
        },
        pinNote(id) {
            this.context.store.pinNote(id);
        }
    }
    onCreated() {
        this.context.store.loadNotes();
        this.context.store.loadColorPalate();
    }
    components = {
        NoteList,
        NoteFilter
    }
}