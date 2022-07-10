'use strict';

import {DbService} from '../../../lib/mockDbService.js';
import { Utils } from '../../../lib/utils.service.js';
const dbService = new DbService('notes', '_id');

export default {
    query: async function query() {
        var notes = await dbService.query();
        if (!notes || !notes.length) {
            notes = _getDefaultNotes();
            dbService.insert(notes);
        }
        return notes;
    },
    get: dbService.get.bind(dbService),
    save: dbService.save.bind(dbService),
    remove: dbService.remove.bind(dbService),

    createNote,
    convertYoutubeUrl,
    loadColorPalate,
    saveColorPalate
};

function createNote(title = '', type = 'text', info = null, style = null, isPined = false) {
    if (!info) info = (() => {
        if (type === 'text') return {txt: ''};
        if (type === 'audio' || type === 'video' || type === 'image') return _createMediaInfo(type);
        if (type === 'todo') return {todos: []}
        return {}
    })();
    return {
        title,
        type,
        info,
        style: style? style : _createNoteStyle(type),
        isPined
    }
} function _createMediaInfo(type) {
    var url = '';
    if (type === 'audio') url = '';
    else if (type === 'video') url = 'https://www.youtube.com/embed/otrH5hxJ2GE';
    else if (type === 'image') url = 'http://vignette1.wikia.nocookie.net/marveldatabase/images/a/a9/Spider-Man_Vol_1_1.jpg/revision/latest?cb=20080331205551';
    return {url};
} function _createNoteStyle(type) {
    const NoteTypes = ['text', 'image', 'video', 'audio', 'todo'];
    var colors = _getDefaultColorPalate();
    var idx = NoteTypes.findIndex(curr => curr === type);
    var backgroundColor = colors.bgColors[idx];
    var color = colors.txtColors[idx];
    return {color, backgroundColor};
}


function convertYoutubeUrl(url) {
    if (url.toLowerCase().includes('youtube')) {
        if (url.split('=').length === 1) return url;
        var youtubeId = url.split('=')[1];
        return `https://www.youtube.com/embed/${youtubeId}`;
    }
    else return url;
}

async function loadColorPalate() {
    var palate = Utils.loadFromStorage('color_palate');
    var palateToReturn = null;
    if (palate) palateToReturn = palate;
    else palateToReturn = _getDefaultColorPalate();
    return palateToReturn;
}
function saveColorPalate(palate) {
    Utils.storeToStorage('color_palate', palate);
}

function _getDefaultColorPalate() {
    return {
        txtColors: ['#5f5e5d', '#fd7322', '#99bdff', '#fffdbf', '#dcdfe6'],
        bgColors: ['#fffdbf', '#91eabf', '#148998', '#49c7c5', '#e02626']
    }
}


function _getDefaultNotes() {
    return [
        createNote('text', 'text', {txt: 'this is a text note!'}),
        createNote('todos', 'todo', {todos: [{txt: 'do this', isDone: false, id: '1'}, {txt: 'do that', isDone: true, id: '2'}, {txt: 'go to sleep', isDone: false, id: '3'}]}),
        createNote('The Beatles', 'video', {url: 'https://www.youtube.com/embed/otrH5hxJ2GE'}, null, true),
        createNote('audio', 'audio', {url: 'http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3'}),
        createNote('another spiderMan', 'image', {url: 'https://jakeallston.com/wp-content/uploads/2019/09/Marvels-Spider-Man-Desktop-Wallpaper-3-1.jpg'}, {backgroundColor: "#e02626",color: "#fffdbf"}),
        createNote('Hasa guy', 'video', {url: 'https://www.youtube.com/embed/KxSd-l-urj8'}, {backgroundColor: "#fffdbf",color: "#99bdff"}),
        createNote('lorem!', 'text', {txt: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt dolorum temporibus enim ea quibusdam molestias illo facilis culpa voluptate dolor tempore maiores, pariatur aut est debitis officiis vel molestiae laboriosam.'}, null, true),
        createNote('SpiderMan', 'image', {url: 'http://vignette1.wikia.nocookie.net/marveldatabase/images/a/a9/Spider-Man_Vol_1_1.jpg/revision/latest?cb=20080331205551'}, null, true),
    ];
}
