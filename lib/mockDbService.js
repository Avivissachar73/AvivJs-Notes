import { Utils } from './utils.service.js';

export class DbService {
    constructor(collectionName, idFuild = '_id', loadFunc = Utils.loadFromStorage, storeFunc = Utils.storeToStorage) {
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
            item[this.idFuild] = Utils.getRandomId();
            collection.push(item);
        }
        await this.storeFunc(this.collectionName, collection);
        return item;
    }

    insert = async(items) => {
        var collection = await this.query();
        items.forEach(curr => curr[this.idFuild] = Utils.getRandomId());
        collection.push(...items);
        
        await this.storeFunc(this.collectionName, collection);
    }
}