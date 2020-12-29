'use strict';

import noteService from '../note.service.js';
import {Utils} from '../../../services/utils.service.js';

import TextNote from './note_info_cmps/text-note.cmp.js';
import TodoNote from './note_info_cmps/todo-note.cmp.js';
import MediaNote from './note_info_cmps/media-note.cmp.js';

import ColorsEdit from '../../general/cmps/color-palate-edit.cmp.js';

export default class NoteEdit {
    name = 'note-edit';
    template = `
        <section class="note-edit">
            <div class="screen" @click.stop="close"/>
            <div A-if="noteToEdit" class="flex column-layout edit-section" style="{{styleStr}}">
                <h2>{{title}}</h2>
                <div class="select-btns width-all flex align-center space-around wrap">
                    <template A-for="item in selectBtnsInfo">
                        <button @click="setNewNote(item.type)">{{item.label}}</button>
                    </template>
                </div>
                <button class="close-btn" @click="close">X</button>
                <input A-model="noteToEdit.title" placeholder="title" ref="title"/>
                <{{infoType}} type="{{noteToEdit.type}}" info="{{noteToEdit.info}}" isEditable="{{true}}" @infoUpdated="updateInfo"/>  
                <div A-if="colorPalate" class="style-pannel width-all">
                    <div class="flex align-center space-between width-all">
                        Text-color:
                        <ColorPicker colors="{{colorPalate.txtColors}}" A-model="noteToEdit.style.color"/>
                    </div>
                    <div class="flex align-center space-between width-all">
                        Bg-color:
                        <ColorPicker colors="{{colorPalate.bgColors}}" A-model="noteToEdit.style.backgroundColor"/>
                    </div>
                </div>
                <button A-if="!isColorEditMode" @click="toggleColorEditMode">change colors?</button>
                <ColorsEdit A-if="isColorEditMode" colors="{{colorPalate}}" @colorsUpdate="updateColors" @close="toggleColorEditMode"/>
                <button @click="save">Save</button>
            </div>
        </section>
    `;

    state = {
        noteToEdit: null,
        selectBtnsInfo: [
            {type: 'text', label: 'T'},
            {type: 'image', label: 'I'},
            {type: 'audio', label: 'A'},
            {type: 'video', label: 'V'},
            {type: 'todo', label: 'O'},
        ],
        isColorEditMode: false
    }
    computed = {
        title() {
            if (!this.noteToEdit) return '';
            if (this.noteToEdit._id) return 'Edit note';
            return 'Add note';
        },
        noteType() {
            if (!this.noteToEdit) return 'text';
            return this.noteToEdit.type;
        },
        infoType() {
            switch (this.noteType) {
                case 'text':
                    return 'TextNote';
                case 'image':
                case 'video':
                case 'audio':
                    return 'MediaNote'
                case 'todo':
                    return 'TodoNote'
            }
        },
        styleStr() {
            if (!this.noteToEdit) return '';
            return Utils.getStyleStr(this.noteToEdit.style);
        },
        colorPalate() {
            return this.context.store.colorPalate;
        }
    }
    methods = {
        loadNote: async () => {
            var id = this.context.Router.params.id;
            if (!id) this.setNewNote(this.noteType);
            else this.state.noteToEdit = JSON.parse(JSON.stringify(await this.context.store.getNote(id)));
        },
        updateInfo(info) {
            if (this.noteToEdit.type === 'video') info.url = noteService.convertYoutubeUrl(info.url);
            this.state.noteToEdit.info = info;
        },
        async save() {
            await this.context.store.saveNote(this.noteToEdit);
            this.context.Router.push('/note');
        },
        close() {
            this.context.Router.push('/note');
        },
        setNewNote(type) {
            var title = `${type.split('').map((x,i) => i === 0 ? x.toUpperCase() : x.toLowerCase()).join('')} note`;
            this.state.noteToEdit = noteService.createNote(title, type);
            // this.context.Router.push('/note/edit');
        },
        updateColors(palate) {
            this.context.store.saveColorPalate(palate);
            this.toggleColorEditMode();
        },
        toggleColorEditMode() {
            this.state.isColorEditMode = !this.state.isColorEditMode;
        }
    }
    onCreated = () => {
        // console.log('got prop!', this.someProp);
        this.loadNote()
    }
    onDestroyed() {
        // console.log('edit was destroyed!!');
    }
    onRender() {
        // this.context.refs.title.focus();
    }
    watch = {
        'Router.params.id': () => {
            this.methods.loadNote();
        },
        'noteToEdit.style.backgroundColor': () => {
            // console.log('bg changed!', this.noteToEdit.style.backgroundColor);
        }
    }
    components = {
        TextNote,
        TodoNote,
        MediaNote,
        ColorsEdit
    }
}