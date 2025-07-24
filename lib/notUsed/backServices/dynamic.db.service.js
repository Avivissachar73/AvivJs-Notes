const { MongoClient, ObjectId } = require('mongodb');
// const { minimizeAccount } = require('../api/account/account.interface');

const config = require('../config');
const { getExpressReqFromContext, getRelevantConfigByContextRequest } = require('../services/ALS.service');


// to know wich db use wasnt yet specified for a specific db, search for: "dbService.getService()";
// if specified, the brakets wont be empty;
class DynamicDbService {
  static Services = [];
  static getService = (dbConfig = config.db[0]) => {
    const existedService = this.Services.find(c => (c.DB_NAME === dbConfig.name) && (c.DB_URL === dbConfig.url));
    if (existedService) return existedService;
    const newService = new DynamicDbService(dbConfig);
    this.Services.push(newService);
    return newService;
  }
  static getServiceByExpressReq() {
    const relevantConfig = getRelevantConfigByContextRequest(config.db);
    const _dbConfig = relevantConfig || config.db[0];
    return this.getService(_dbConfig);
  }

  dbConn = null;
  client = null;
  constructor(dbConfig = config.db[0]) {
    this.DB_NAME = dbConfig.name;
    this.DB_URL = dbConfig.url;
  }

  static CREATED_KEY = '_createdAt';
  static UPDATED_KEY = '_updatedAt';
  // static _getTimeMark = () => Date.now();
  static _getTimeMark = () => new Date();

  static ObjectId = (...args) => ObjectId(...args);


  ////////////::: SERVICE_METHODS :::////////////
  ////////////::: SERVICE_METHODS :::////////////
  ////////////::: SERVICE_METHODS :::////////////
  

  /**
   * @returns {Object} MongoBd connection
   */
  connect = async () => {
    if (this.dbConn) return this.dbConn;
    this.dbConn = await this.connectToDb(this.DB_URL, this.DB_NAME);
    // this.dbConn.catch(err => this.dbConn = null);
    return this.dbConn;
  }
  // This function disconnect the db;
  disConnect = async () => {
    if (!this.client) return;
    await this.client.close();
    this.client = this.dbConn = null;
  }

  /**
  * This function creates a connection to the db;
  * if connection is already exists - returns the old connection from cash;
  * @param {String} dbUrl 
  * @param {String} dbName 
  * @returns 
  */
  connectToDb = async (dbUrl = this.DB_URL, dbName = this.DB_NAME) => {
    try {
        // const url = process.env.nodeEnv === 'test'? dbUrl : `${dbUrl}/${dbName}`;
        const url = process.env.NODE_ENV === 'test'? dbUrl : `${dbUrl}/${dbName}`;
        this.client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = this.client.db(dbName);
        return db;
    } catch (err) {
        console.error('HAD ERROR CONNECTING TO DB');
        console.error(err);
        throw err;
    }
  }

  /**
  * @param {String} collectionName the name of the required collection from the db;
  * @returns {Object} mongoDb collection object
  */
  getCollection = async (collectionName) => {
    const db = await this.connect();
    return db.collection(collectionName);
  }




  query = async (collectionName, criteria = {}, sortBy = {}, pagination = { limit: 0, page: 0, noLimit: false }, aggregators, debug) => {
    if (!pagination) pagination = { limit: 0, page: 0 };
    if (!pagination.limit) pagination.limit = 500;
    if (pagination.limit > 500) pagination.limit = 500;
    if (pagination.noLimit) delete pagination.limit;
    const collection = await this.getCollection(collectionName);
    
    sortBy = { ...sortBy };
    
    if (criteria.$and && criteria.$or) {
        criteria.$and = [...criteria.$and, criteria.$or];
        delete criteria.$or;
    }
    // if (criteria.$or && criteria.$or.length <= 1) {
        
    // }
    // else if (criteria.$and && criteria.$and.length <= 1) {

    // }

    function _buildRes(items, total) {
      return { total, count: items.length, criteria, sortBy, pagination, items }
    }

    if (aggregators?.length) {
        const defaultAggregators = this.constructor.getAggregators(criteria, sortBy, pagination);
        let total = (await collection.aggregate([...aggregators, ...defaultAggregators.count], { allowDiskUse: true }).toArray())[0]?.length || 0;
        let items = await collection.aggregate([
            ...aggregators,
            ...(pagination.noLimit ? [] : defaultAggregators.pagination)
        ].filter(Boolean), { allowDiskUse: true }).toArray();
        return _buildRes(items, total);
    }


    let itemsPrm = collection.find(criteria).sort({...sortBy });
    const total = await itemsPrm.count();
    if (!pagination.noLimit) {
      if (pagination.page && pagination.limit) itemsPrm = itemsPrm.skip(pagination.page * pagination.limit);
      if (pagination.limit) itemsPrm = itemsPrm.limit(pagination.limit);
    }
    const items = await itemsPrm.toArray();

    // await Promise.all(items.map(putCreatedByOnItem));
    
    return _buildRes(items, total);
  }


  getMany = (collectionName, ids) => {
    return this.query(collectionName, { $or: ids.map(id => ({ _id: ObjectId(id) })) });
  }

  get = async (collectionName, id) => {
    if (!id) return null;
    const collection = await this.getCollection(collectionName)
    const item = await collection.findOne({ "_id": ObjectId(id) });
    // await putCreatedByOnItem(item);
    return item;
  }

  save = async (collectionName, item) => {
    if (!item._id) return this.add(collectionName, item);
    return update(collectionName ,item);
  }

  add = async (collectionName, item) => {
    item[this.constructor.CREATED_KEY] = this.constructor._getTimeMark();
    const collection = await this.getCollection(collectionName);
    await collection.insertOne(item);
    //   await putCreatedByOnItem(item);
    return item;
  }

  update = async (collectionName, item) => {
    item[this.constructor.UPDATED_KEY] = this.constructor._getTimeMark();
    const collection = await this.getCollection(collectionName);
    item._id = ObjectId(item._id);
    await collection.updateOne({"_id": item._id}, {$set : item});
    //   await putCreatedByOnItem(item);
    return item;
  }

  updateMany = async (collectionName, items) => {
    return Promise.all(items.map(item => update(collectionName, item)));
  }

  remove = async (collectionName, id) => {
    const collection = await this.getCollection(collectionName);
    await collection.deleteOne({ "_id": ObjectId(id) });
    return id;
  }


  insert = async (collectionName, items) => {
    items.forEach(item => item[this.constructor.CREATED_KEY] = this.constructor._getTimeMark());
    const collection = await getCollection(collectionName);
    await collection.insertMany(items);
    // await Promise.all(items.map(putCreatedByOnItem));
    return items;
  }


  removeBy = async (collectionName, critiria) => {
    const collection = await this.getCollection(collectionName);
    await collection.deleteOne(critiria);
    return true;
  }
  getBy = async (collectionName, critiria) => {
    const collection = await this.getCollection(collectionName);
    return collection.findOne(critiria);
  }

  
  getCollectionList = async () => {
    const db = await connect();
    const cols = await db.listCollections().toArray();
    return cols.map(c => c.name);
  }

  createIndexes = async (colName = '', fields = []) => {
    const col = await this.getCollection(colName);
    const existedIndexKeys = (await col.indexes()).map(c => Object.keys(c.key)[0]);
    const fieldsToAdd = fields.filter(c => !existedIndexKeys.includes(c));
    if (!fieldsToAdd.length) return Promise.resolve();
    return col.createIndexes(fieldsToAdd.map(c => ({key: {[c]:1}, name: `${colName}_${c}_index`})));
  }


  //////////////////::: STATICS ::://////////////////
  //////////////////::: STATICS ::://////////////////
  //////////////////::: STATICS ::://////////////////


  static buildBasicSearchFilterBy = (filterBy = { search: '', params: {}, datesRange: { from: 0, to: 0 } }, searchOnFields = []) => {
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

    if (filterBy.datesRange?.from && filterBy.datesRange?.to) {
      const this$nd = [ { _id: { $gt: this.objectIdWithTimestamp(filterBy.datesRange.from) } }, { _id: { $lt: this.objectIdWithTimestamp(filterBy.datesRange.to) } } ];
      this.append$andOr$or(resCrit, {$and: this$nd});
    }


    return resCrit;
  }

  static buildSimpleSortObject = (sortBy = {}, simpleSortKey = '', naturalSortKey = ('_id' || '$natural'), deepField = '') => {
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



  // async putCreatedByOnItem(item) {
  //     const accountId = item._createdBy;
  //     if (!accountId) return;
  //     const account = await get('account', accountId);
  //     const miniAccount = account? minimizeAccount(account) : null;
  //     item.createdBy = miniAccount;
  // }


  // from web::
  static objectIdWithTimestamp = (timestamp) => {
    /* Convert string date to Date object (otherwise assume timestamp is a date) */
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }
    timestamp = new Date(timestamp).getTime();

    /* Convert date object to hex seconds since Unix epoch */
    var hexSeconds = Math.floor(timestamp/1000).toString(16);

    /* Create an ObjectId with that hex timestamp */
    var constructedObjectId = ObjectId(hexSeconds + "0000000000000000");

    return constructedObjectId
  }



  static isValidMongoId = (mongoIdLike, toLog) => {
    if (!mongoIdLike) return false;
    try {
        ObjectId(mongoIdLike);
        return true;
    } catch(err) {
        if (toLog) console.log('NOT A MONGO ID!', mongoIdLike);
        return false;
    }
  }

  static getEmptyQueryResult = () => {
    return { items: [], total: 0 };
  }




  static getAggregators = (criteria, sort, pageData) => {
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

  static append$andOr$or = (_criteria, newExpr) => {
    const _$or = newExpr.$or;
    const _$and = newExpr.$and;
    if (_$or) {
      if (_criteria.$and) _criteria.$and.push({$or: _$or});
      else {
        if (_criteria.$or) {
          _criteria.$and = [
            { $or: _criteria.$or },
            { $or: _$or }
          ]
          delete _criteria.$or;
        } else {
          _criteria.$or = _$or;
        }
      }
    }
    if (_$and) {
      if (_criteria.$and) _criteria.$and.push(..._$and);
      else {
        _criteria.$and = [
          // { $or: _criteria.$or },
          ..._$and
        ];
        if (_criteria.$or) {
          _criteria.$and.push({ $or: _criteria.$or })
          delete _criteria.$or;
        }
      }
    }
  }
}



module.exports = {
  DynamicDbService,
  // service: DynamicDbService.getService(config.db[0])
}