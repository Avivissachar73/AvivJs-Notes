'use strict';

import {Utils} from '../../../services/utils.service.js';

import TextNote from './note_info_cmps/text-note.cmp.js';
import TodoNote from './note_info_cmps/todo-note.cmp.js';
import MediaNote from './note_info_cmps/media-note.cmp.js';

export default class NotePreview {
    name = 'note-preview';
    props = ['note'];
    template = `
        <section @click="print" class="note-preview column-layout" style="{{styleStr}}">
            <h3 class="text-center">{{note.title}}</h3>
            <{{infoType}} type="{{note.type}}" info="{{note.info}}" isEditable="{{false}}" @infoUpdated="update"/>
            <content/>
        </section>
    `;
    getters = {
        styleStr() {
            return Utils.getStyleStr(this.note.style);
        },
        infoType() {
            switch (this.note.type) {
                case 'text':
                    return 'TextNote';
                case 'image':
                case 'video':
                case 'audio':
                    return 'MediaNote'
                case 'todo':
                    return 'TodoNote'
            }
        }
    }
    methods = {
        update(info) {
            this.context.emit('infoChanged', info);
        },
        print() {
            // console.log(this.note);
        }
    }
    components = {
        TextNote,
        TodoNote,
        MediaNote
    }
}