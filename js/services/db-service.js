'use strict';

//UTILS
const Utils = {
    _storeToStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value|| null));
    },
    _loadFromStorage(key) {
        let data = localStorage.getItem(key);
        return (data) ? JSON.parse(data) : undefined;
    },
    _getRandomId() {
        var pt1 = Date.now().toString(16);
        var pt2 = Utils._getRandomInt(1000, 9999).toString(16);
        var pt3 = Utils._getRandomInt(1000, 9999).toString(16);
        return `${pt3}-${pt1}-${pt2}`.toUpperCase();
    },
    _getRandomInt(num1, num2) {
        var max = (num1 >= num2)? num1+1 : num2+1;
        var min = (num1 <= num2)? num1 : num2;
        return (Math.floor(Math.random()*(max - min)) + min);
    }

}

export class DbService {
    constructor(collectionName, idFuild = '_id', loadFunc = Utils._loadFromStorage, storeFunc = Utils._storeToStorage) {
        this.collectionName = collectionName;
        this.idFuild = idFuild;
        this.loadFunc = loadFunc;
        this.storeFunc = storeFunc;;
    }

    query = async () => {
        var collection = await this.loadFunc(this.collectionName);
        if (!collection) collection = [];
        return collection;
    }

    get = async (id) => {
        var collection = await this.query();
        return collection.find(curr => curr[this.idFuild] === id);
    }

    remove = async(id) => {
        console.log('removing in db..', id);
        var collection = await this.query();
        var idx = collection.findIndex(curr => curr[this.idFuild] === id);
        if (idx === -1) throw new Error('something went wrong');
        collection.splice(idx, 1);
        await this.storeFunc(this.collectionName, collection);
    }

    save = async (item) => {
        var collection = await this.query();
        if (item[this.idFuild]) {
            let idx = collection.findIndex(curr => curr[this.idFuild] === item[this.idFuild]);
            if (idx === -1) throw new Error('something went wrong');
            collection[idx] = item;
        } else {
            console.log('else..');
            item[this.idFuild] = Utils._getRandomId();
            collection.push(item);
        }
        await this.storeFunc(this.collectionName, collection);
        return item;
    }

    insert = async(items) => {
        var collection = await this.query();
        items.forEach(curr => curr[this.idFuild] = Utils._getRandomId());
        collection.push(...items);
        
        await this.storeFunc(this.collectionName, collection);
    }
}
