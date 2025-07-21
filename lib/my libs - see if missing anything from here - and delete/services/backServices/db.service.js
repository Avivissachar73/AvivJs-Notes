const { MongoClient, ObjectId } = require('mongodb');

const { DynamicDbService } = require('./dynamic.db.service');

module.exports = DynamicDbService;
// const config = require('../config');
// module.exports = DynamicDbService.getService(config.db[0]);
// // put all statics on module exports to make it easyer to use::
// // module.exports.getService = DynamicDbService.getService;
// module.exports.buildBasicSearchFilterBy = DynamicDbService.buildBasicSearchFilterBy;
// module.exports.buildSimpleSortObject = DynamicDbService.buildSimpleSortObject;
// module.exports.objectIdWithTimestamp = DynamicDbService.objectIdWithTimestamp;
// module.exports.isValidMongoId = DynamicDbService.isValidMongoId;
// module.exports.getEmptyQueryResult = DynamicDbService.getEmptyQueryResult;
// module.exports.getAggregators = DynamicDbService.getAggregators;
// module.exports.ObjectId = DynamicDbService.ObjectId;