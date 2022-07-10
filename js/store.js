'use strict';

import noteService from './modules/notes/note.service.js';

import A_Alert from '../lib/Alert.js';
import { Utils } from '../lib/utils.service.js';
const {Confirm, Prompt, Alert} = new A_Alert();

class Store {
    state = {
        notes: [],
        currNote: null,
        filterBy: null,

        colorPalate: null
    }

    get notesToShow() {
        const filterBy = this.state.filterBy;
        var filteredNotes = [...this.state.notes].reverse();
        if(!filterBy) return filteredNotes;
        filteredNotes = filteredNotes.filter(note => Utils.deepSearch(note, filterBy.searchStr));
        filteredNotes = filteredNotes.filter(note => {
            return (!filterBy.type || filterBy.type === 'all' || note.type === filterBy.type);
        })
        return filteredNotes;
    }

    get colorPalate() {
        // return noteService.loadColorPalate();
        return this.state.colorPalate;
    }

    setFilter(filterBy) {
        this.state.filterBy = filterBy;
    }

    async loadNotes() {
        var notes = await noteService.query();
        this.state.notes = notes;
        return notes;
    }

    async getNote(id) {
        var note = await noteService.get(id);
        this.state.currNote = note;
        return note;
    }

    async saveNote(note) {
        if (note.type === 'video') note.info.url = noteService.convertYoutubeUrl(note.info.url);
        note = await noteService.save(note);
        var notes = this.state.notes;
        var idx = notes.findIndex(curr => curr._id === note._id);
        console.log('saved,', note, idx);
        if (idx === -1) notes.push(note);
        else notes[idx] = note;
        this.state.notes = notes;
        return note;
    }
    
    async removeNote(id) {
        if (!await Confirm('Are you sure you want to remove this note? id: ' + id)) return;
        console.log('removing in store..', id)
        await noteService.remove(id);
        var notes = this.state.notes;
        var idx = notes.findIndex(note => note._id === id);
        if (idx === -1) throw new Error('Something went wrong removing note. id: '+id);
        notes.splice(idx, 1);
        this.state.notes = notes;
        return id;
    }

    async updateNoteInfo(noteId, newInfo) {
        var notes = this.state.notes;
        var prevNote = notes.find(note => note._id === noteId);
        var noteToUpdate = JSON.parse(JSON.stringify(prevNote));
        noteToUpdate.info = newInfo;
        this.saveNote(noteToUpdate);
    }

    async pinNote(noteId) {
        var notes = this.state.notes;
        var prevNote = notes.find(note => note._id === noteId);
        var noteToUpdate = JSON.parse(JSON.stringify(prevNote));
        noteToUpdate.isPined = !noteToUpdate.isPined;
        this.saveNote(noteToUpdate);
    }



    async loadColorPalate() {
        var palate = await noteService.loadColorPalate();
        this.state.colorPalate = palate;
        return palate;
    }

    async saveColorPalate(palate) {
        await noteService.saveColorPalate(palate);
        this.state.colorPalate = palate;
    }
}
export default new Store();