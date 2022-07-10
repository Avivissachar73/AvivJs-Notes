import { Utils } from '../utils.service.js';

export const mockHttpService = {
    get,
    delete: remove,
    post,
    put,
    insert
}


const ID_FIELD = '_id';
const CREATEDAt_FEILD = 'createdAt';
const UPDATEDAT_FEILD = 'updatedAt';


async function get(path,) {
    const [collectionName, id] = _getPathParts(path);
    const collection = await _query(collectionName);
    if (!id) return collection;
    return collection.find(curr => curr[ID_FIELD] === id);
}

async function remove(path) {
    const [collectionName, id] = _getPathParts(path);
    const collection = await _query(collectionName);

    const idx = collection.findIndex(curr => curr[ID_FIELD] === id);
    if (idx === -1) throw new Error('something went wrong');
    collection.splice(idx, 1);
    
    Utils.storeToStorage(collectionName, collection);
    return id;
}

async function post(path, item) {
    const [collectionName] = _getPathParts(path);
    const collection = await _query(collectionName);

    _addCreatedDataToItem(item);
    collection.push(item);

    Utils.storeToStorage(collectionName, collection);
    return Utils.copy(item);
}

async function put(path, item) {
    const [collectionName, id] = _getPathParts(path);
    const collection = await _query(collectionName);

    let idx = collection.findIndex(curr => curr[ID_FIELD] === id);
    if (idx === -1) throw new Error('something went wrong');

    item[UPDATEDAT_FEILD] = Date.now();
    collection[idx] = item;

    Utils.storeToStorage(collectionName, collection);
    return Utils.copy(item);
}

async function insert(path, items) {
    const [collectionName] = _getPathParts(path);
    const collection = await _query(collectionName);

    // items.forEach(curr => curr[ID_FIELD] = Utils.makeId());
    items.forEach(_addCreatedDataToItem);
    collection.push(...items);
    
    Utils.storeToStorage(collectionName, collection);
    return Utils.copy(items);
}


function _query(collectionName) {
    let collection = Utils.loadFromStorage(collectionName);
    if (!collection) collection = [];
    return collection;
}
function _getPathParts(path) {
    const parts = path.split('/');
    if (parts.length && !parts[0]) parts.shift();
    return parts;
}
function _addCreatedDataToItem(item) {
    item[ID_FIELD] = Utils.getRandomId();
    item[CREATEDAt_FEILD] = item[UPDATEDAT_FEILD] = Date.now();
}