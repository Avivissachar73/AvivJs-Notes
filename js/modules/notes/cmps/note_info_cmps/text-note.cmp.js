'use strict';

export default class TextNote {
    name = 'text-note';
    props = ['info', 'isEditable'];
    template = `
        <section class="note-info column-layout">
            <textarea A-if="isEditable" placeholder="txt" A-model="newTxt">{{newTxt}}</textarea>
            <TextWrapper A-if="!isEditable" text="{{info.txt}}" limit="{{100}}"/>
        </section>
    `;
    state() {
        return {
            newTxt: this.info.txt
        }
    }
    // state = {
    //     newTxt: ''
    // }
    // constructor(props){this.state.newTxt = props.info.txt} 
    methods = {
        saveChanges() {
            var newInfo = JSON.parse(JSON.stringify(this.info));
            newInfo.txt = this.state.newTxt;
            this.context.emit('infoUpdated', newInfo);
        }
    }
    watch = {
        newTxt(curr, prev) {
            console.log('wowo');
            this.saveChanges();
        }
    }
    onCreated() {
        // this.state.newTxt = this.info.txt;
    }
}