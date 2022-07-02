'use strict';


export default class MediaNote {
    name = 'media-note';
    props = ['type', 'info', 'isEditable'];
    template = `
        <section class="note-info width-all column-layout">
            <form A-if="isEditable" @submit="saveUrl" class="flex align-center space-around wrap">
                <input placeholder="url" A-model="newUrl"/>
                <button>Change</button>
            </form>
            <{{infoType}} url="{{info.url}}"/>
        </section>
    `;
    state = {
        newUrl: ''
    }
    getters = {
        infoType() {
            switch (this.type) {
                case 'image':
                    return 'ImgInfo'
                case 'video':
                    return 'VideoInfo'
                case 'audio':
                    return 'AudioInfo'
                default :
                    return ''
            }
        }
    }
    methods = {
        saveUrl() {
            var newInfo = JSON.parse(JSON.stringify(this.info));
            newInfo.url = this.state.newUrl;
            this.context.emit('infoUpdated', newInfo);
        }
    }
    onCreated() {
        this.state.newUrl = this.info.url;
    }
    watch = {
        'info'(newInfo) {
            this.state.newUrl = newInfo.url;
        }
    }
    components = {
        ImgInfo: ({url}) => `<img class="note-info" src="${url}"/>`,
        AudioInfo: ({url}) => `<audio class="note-info" src="${url}" controls="controls"/>`,
        VideoInfo: ({url}) => `<iframe class="note-info" src="${url}"/>`,
    }
}