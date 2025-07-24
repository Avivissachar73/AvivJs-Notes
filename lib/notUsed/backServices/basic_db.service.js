const { MongoClient, ObjectId } = require('mongodb');
// const { minimizeAccount } = require('../api/account/account.interface');

const config = require('../config');
const DB_NAME = config.db.name;
const DB_URL = config.db.url;

const CREATED_KEY = '_createdAt';
const UPDATED_KEY = '_updatedAt';
// const _getTimeMark = () => Date.now();
const _getTimeMark = () => new Date();

module.exports = {
    connectToDb,
    getCollection,
    connect,
    disConnect,
    ObjectId,
    query,
    get,
    remove,
    save,
    insert,
    add,
    update,
    updateMany,
    removeBy,
    getBy,
    buildBasicSearchFilterBy,
    buildSimpleSortObject,
    getMany,
    objectIdWithTimestamp,
    getCollectionList,
    isValidMongoId,
    createIndexes,
    getEmptyQueryResult,
    getAggregators
}



var dbConn = null;
var client = null;

/**
 * @returns {Object} MongoBd connection
 */
async function connect() {
    if (dbConn) return dbConn;
    dbConn = connectToDb(DB_URL, DB_NAME);
    dbConn.catch(err => dbConn = null);
    return dbConn;
}

/**
 * This function creates a connection to the db;
 * if connection is already exists - returns the old connection from cash;
 * @param {String} dbUrl 
 * @param {String} dbName 
 * @returns 
 */
async function connectToDb(dbUrl = DB_URL, dbName = DB_NAME) {
    try {
        // const url = process.env.nodeEnv === 'test'? dbUrl : `${dbUrl}/${dbName}`;
        const url = process.env.NODE_ENV === 'test'? dbUrl : `${dbUrl}/${dbName}`;
        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        return db;
    } catch (err) {
        console.error('HAD ERROR CONNECTING TO DB');
        console.error(err);
        throw err;
    }
}

// This function disconnect the db;
async function disConnect() {
    if (!client) return;
    await client.close();
    client = dbConn = null;
}


/**
 * @param {String} collectionName the name of the required collection from the db;
 * @returns {Object} mongoDb collection object
 */
async function getCollection(collectionName) {
    const db = await connect()
    return db.collection(collectionName);
}




async function query(collectionName, criteria = {}, sortBy = {}, pagination = { limit: 0, page: 0 }, aggregators) {
    const collection = await getCollection(collectionName);
    
    sortBy = { ...sortBy };
    
    if (criteria.$and && criteria.$or) {
        criteria.$and = [...criteria.$and, criteria.$or];
        delete criteria.$or;
    }
    if (criteria.$or && criteria.$or.length <= 1) {
        
    }
    else if (criteria.$and && criteria.$and.length <= 1) {

    }

    if (aggregators) {
        const defaultAggregators = getAggregators(criteria, sortBy, pagination);
        let total = (await collection.aggregate([...aggregators, ...defaultAggregators.count]).toArray())[0]?.length || 0;
        let items = await collection.aggregate([
            ...aggregators,
            ...defaultAggregators.pagination
        ].filter(Boolean)).toArray();
        return { items, total };
    }


    let itemsPrm = collection.find(criteria).sort({...sortBy });
    const total = await itemsPrm.count();
    if (pagination.page && pagination.limit) itemsPrm = itemsPrm.skip(pagination.page * pagination.limit);
    if (pagination.limit) itemsPrm = itemsPrm.limit(pagination.limit);
    const items = await itemsPrm.toArray();

    // await Promise.all(items.map(putCreatedByOnItem));
    
    return { items, total };
}


function getMany(collectionName, ids) {
    return query(collectionName, { $or: ids.map(id => ({ _id: ObjectId(id) })) });
}

async function get(collectionName, id) {
    if (!id) return null;
    const collection = await getCollection(collectionName)
    const item = await collection.findOne({ "_id": ObjectId(id) });
    // await putCreatedByOnItem(item);
    return item;
}

async function save(collectionName, item) {
    if (!item._id) return add(collectionName, item);
    return update(collectionName ,item);
  }
  
async function add(collectionName, item) {
  item[CREATED_KEY] = _getTimeMark();
  const collection = await getCollection(collectionName);
  await collection.insertOne(item);
//   await putCreatedByOnItem(item);
  return item;
}

async function update(collectionName, item) {
  item[UPDATED_KEY] = _getTimeMark();
  const collection = await getCollection(collectionName);
  item._id = ObjectId(item._id);
  await collection.updateOne({"_id": item._id}, {$set : item});
//   await putCreatedByOnItem(item);
  return item;
}

async function updateMany(collectionName, items) {
  return Promise.all(items.map(item => update(collectionName, item)));
}

async function remove(collectionName, id) {
    const collection = await getCollection(collectionName);
    await collection.deleteOne({ "_id": ObjectId(id) });
    return id;
}


async function insert(collectionName, items) {
    items.forEach(item => item[CREATED_KEY] = _getTimeMark());
    const collection = await getCollection(collectionName);
    await collection.insertMany(items);
    // await Promise.all(items.map(putCreatedByOnItem));
    return items;
}


async function removeBy(collectionName, critiria) {
    const collection = await getCollection(collectionName);
    await collection.deleteOne(critiria);
    return true;
}
async function getBy(collectionName, critiria) {
    const collection = await getCollection(collectionName);
    return collection.findOne(critiria);
}


function buildBasicSearchFilterBy(filterBy = { search: '', params: {} }, searchOnFields = []) {
    // const $or = [];
    // for (let field of searchOnFields) $or.push({[field]: {$regex: RegExp(filterBy?.search || '', 'i')}})
    // return { $or, ...(filterBy?.params || {}) };
    let fixedSearch = filterBy.search || '';

    function escapeRegExp(string) {
        return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    }
      
    fixedSearch = escapeRegExp(fixedSearch);
    // const badChars = [] || '[]()'.split('');
    // badChars.forEach(c => {
    //     fixedSearch = fixedSearch.split(c).join(`\${c}`);
    // });
    fixedSearch = fixedSearch.trim();
    let resCrit = { 
        $or: [
            ...searchOnFields.map(field => ({[field]: {$regex: new RegExp(fixedSearch || '', 'i')}})),
            // ...searchOnFields.map(field => ({[field]: {$regex: new RegExp(`^${fixedSearch || ''}$`, 'i')}})),
            // ...searchOnFields.map(field => ({[field]: filterBy.search })),
            // ...searchOnFields.map(field => ({[field]: RegExp(filterBy?.search || '')}))
        ],
    };
    if (!resCrit.$or.length) delete resCrit.$or;
    // if (searchOnFields.length === 1) {
    //     resCrit = { ...resCrit.$or[0] };
    // }
    resCrit = {
        ...resCrit,
        ...(filterBy?.params || {})
    }
    return resCrit;
}

function buildSimpleSortObject(sortBy = {}, simpleSortKey = '', naturalSortKey = '$natural', deepField = '') {
    const res = {};
    for (let key in sortBy) {
        const fixedKey = [deepField, key].join('.');
        res[fixedKey] = sortBy[key];
    }
    if (simpleSortKey) res[simpleSortKey] = 1;
    if (naturalSortKey) {
        if (!Object.keys(res).length) res[naturalSortKey] = -1;
    }
    return res;
}



// async function putCreatedByOnItem(item) {
//     const accountId = item._createdBy;
//     if (!accountId) return;
//     const account = await get('account', accountId);
//     const miniAccount = account? minimizeAccount(account) : null;
//     item.createdBy = miniAccount;
// }
  

// from web::
function objectIdWithTimestamp(timestamp) {
    /* Convert string date to Date object (otherwise assume timestamp is a date) */
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }
  
    /* Convert date object to hex seconds since Unix epoch */
    var hexSeconds = Math.floor(timestamp/1000).toString(16);
  
    /* Create an ObjectId with that hex timestamp */
    var constructedObjectId = ObjectId(hexSeconds + "0000000000000000");
  
    return constructedObjectId
  }
  

async function getCollectionList() {
    const db = await connect();
    const cols = await db.listCollections().toArray();
    return cols.map(c => c.name);
}

function isValidMongoId(mongoIdLike, toLog) {
    if (!mongoIdLike) return false;
    try {
        ObjectId(mongoIdLike);
        return true;
    } catch(err) {
        if (toLog) console.log('NOT A MONGO ID!', mongoIdLike);
        return false;
    }
}

function getEmptyQueryResult() {
    return { items: [], total: 0 };
}



async function createIndexes(colName = '', fields = []) {
    const col = await getCollection(colName);
    const existedIndexKeys = (await col.indexes()).map(c => Object.keys(c.key)[0]);
    const fieldsToAdd = fields.filter(c => !existedIndexKeys.includes(c));
    if (!fieldsToAdd.length) return Promise.resolve();
    return col.createIndexes(fieldsToAdd.map(c => ({key: {[c]:1}, name: `${colName}_${c}_index`})));
}


function getAggregators(criteria, sort, pageData) {
    return {
        count: [ {$project: {_id: 1}}, {$count: 'length'} ],
        find: [
            { $match: criteria },
        ],
        pagination: [
            (Object.keys(sort).length? { $sort: sort } : undefined),
            ...((pageData?.limit)? [
                { $skip: (pageData.page || 0) * pageData.limit },
                { $limit: pageData.limit }
            ]: [])
        ].filter(Boolean)
    }
}