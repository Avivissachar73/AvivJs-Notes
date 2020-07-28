'use strict';

import NotePreview from './note-preview.cmp.js';

export default {
    name: 'note-list',
    props: ['notes', 'className'],
    template: `
        <div class="note-list1 width-all {{className}}">
            <ul class="note-list container clean-list flex1 space-between1 wrap1">
                <li A-for="note in notes">
                    <NotePreview note="{{note}}" key="{{note._id}}" @infoChanged="updateInfo(note._id)">
                        <div class="actions width-all flex align-center space-around">    
                            <RouterLink url="{{'/note/edit/'+note._id}}">Edit</RouterLink>
                            <button @click="pinNote(note._id)">P</button>
                            <button @click="removeNote(note._id)">X</button>
                        </div>
                    </NotePreview>
                </li>
            </ul>
        </div>
    `,
    methods: {
        updateInfo(noteId, info) {
            this.context.emit('noteUpdate', noteId, info);
        },
        removeNote(id) {
            this.context.emit('removeNote', id);
        },
        pinNote(id) {
            this.context.emit('pinNote', id);
        }
    },
    components: {
        NotePreview
    },
    onCreated() {
        console.log('list was created!');
    }
}
// export default class NoteList {
//     name = 'note-list';
//     props = ['notes', 'className'];
//     template = `
//         <div class="note-list1 width-all {{className}}">
//             <ul class="note-list container clean-list flex1 space-between1 wrap1">
//                 <li A-for="note in notes">
//                     <NotePreview note="{{note}}" key="{{note._id}}" @infoChanged="updateInfo(note._id)">
//                         <div class="actions width-all flex align-center space-around">    
//                             <RouterLink url="{{'/note/edit/'+note._id}}">Edit</RouterLink>
//                             <button @click="pinNote(note._id)">P</button>
//                             <button @click="removeNote(note._id)">X</button>
//                         </div>
//                     </NotePreview>
//                 </li>
//             </ul>
//         </div>

//     `;
//     methods = {
//         updateInfo(noteId, info) {
//             this.context.emit('noteUpdate', noteId, info);
//         },
//         removeNote(id) {
//             this.context.emit('removeNote', id);
//         },
//         pinNote(id) {
//             this.context.emit('pinNote', id);
//         }
//     }
//     components = {
//         NotePreview
//     }
// }