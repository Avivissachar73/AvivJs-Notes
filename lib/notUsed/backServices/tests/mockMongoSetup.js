const { MongoMemoryServer } = require('mongodb-memory-server');
const dbService = require('../services/db.service');

const initDb = require('../initDb/initDb.function');

exports.setUpMongo = function setUpMongo() {
    let mongod;
    beforeAll(async () => {
        mongod = new MongoMemoryServer();
        const uri = await mongod.getUri();
        const db = await dbService.connectToDb(uri, 'TEST_DB');

        // const TEST_DATA = JSON.parse(JSON.stringify(require('./testData.json')));
        // _fixIds(TEST_DATA);
        // for (const collectionName in TEST_DATA) {
        //     const data = TEST_DATA[collectionName];
        //     if (!data || !data.length) continue;
        //     const collection = await db.collection(collectionName);
        //     await collection.insertMany(data);
        // }
        await initDb(false);
    });

    beforeEach(async () => {
    });

    afterAll(async () => {
        await mongod.stop();
    });
}

function _fixIds(data) {
    for (const colName in data) {
        const collection = data[colName];
        collection.forEach(item => {
            item._id = dbService.ObjectId(item._id);
        });
    }
}