/*
The role of this file is to download or upload data from or to the database.
set the 'process.env.NODE_ENV' variable to what env you want to download/uplod data;
to download data - set the 'IS_IMPORT' variable to true, to upload set it to false;
the imported data is stored in /db folder.
when uploading data you need to have data to upload in the db folder.
make sure the relevant collection name are reffered in the 'ALL_COLS' Array;
if you want to skip some cols on import, mention the col name in the 'SKIP_COLS_IMPORT' Array;
if you want to skip some cols on upload, mention the col name in the 'SKIP_COLS_UPLOAD' Array;
usage example:
if i want to copy the production db to dev env, i run the script in import mode on prod and then run it again on upload mode on dev.
*/
// const IS_IMPORT = true;
const MODE = ['IMPORT', 'UPLOAD'][1];
process.env.NODE_ENV = ['development', 'staging', 'production', 'patiphonDev'][3];
// else process.env.NODE_ENV = 'staging';
// else process.env.NODE_ENV = 'production';

const config = require('../config');
const IS_IMPORT = MODE === 'IMPORT';
console.log(`${IS_IMPORT? 'IMPORTING' : 'UPLOADING'} DB`);
console.log('PROCESSING ON ENV:', config.env);

const dbService = require('../services/db.service');
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');
const { splitDataToPages } = require('../services/utils.service');

const DIR_PATH = (colName) => `db/${colName}`;
const FILE_PATH = (colName, pageIdx) => `${DIR_PATH(colName)}/${colName}_data.${pageIdx+1}.json`;

const ALL_COLS = [
  // 'users',
  // 'organizations',

  // 'releases',
  // 'contacts',
  // 'companies',
  // 'tags',
  // 'mailingLists',
  // 'distributions',
  
  // 'log',
  // 'session',
  'selectItem'
]
const SKIP_COLS_IMPORT = [
  'log', 'session',
];
const SKIP_COLS_UPLOAD = [ 
  ...SKIP_COLS_IMPORT,
  'organizations',
  'users',
];



(async () => {
  if (IS_IMPORT) importDataFromDb();
  else uploadDataToDb();
})();



async function importDataFromDb() {
  console.log('IMPORTING DATA');
  const _dbService = dbService.getService();
  // const cols = await _dbService.getCollectionList();
  const colsToUpload = ALL_COLS.filter(c => !SKIP_COLS_IMPORT.includes(c));
  let successCount = 0;
  // const prms = colsToUpload.map(async colName => {
  for (let colName of colsToUpload) {
    console.log('importing', colName);
    const dirPath = DIR_PATH(colName);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
    try {
      const collection = await _dbService.getCollection(colName);
      let items = await collection.find({}).toArray();
      const dataPages = splitDataToPages(items, 5000);
      dataPages.forEach((page, idx) => {
        fs.writeFileSync(FILE_PATH(colName, idx), JSON.stringify(page));
      });
      console.log('done importing', colName, `${++successCount}/${colsToUpload.length}`);
    } catch (err) {
      console.log('HAD ERROR WITH COL:', colName);
      console.error(err);
    }
  }
  // });
  // await Promise.all(prms);
  console.log('DONE IMPORTING DATA');
}

async function uploadDataToDb(isDropOld = true) {
  console.log('UPLOADING DATA');
  const _dbService = dbService.getService();
  const db = await _dbService.connect();
  // const cols = await _dbService.getCollectionList();
  const colsToUpload = ALL_COLS.filter(c => !SKIP_COLS_UPLOAD.includes(c));
  let successCount = 0;
  // const prms = colsToUpload.map(async colName => {
  for (let colName of colsToUpload) {
    console.log('importing', colName);
    if (!fs.existsSync(DIR_PATH(colName))) return console.log('no data to upload for col', colName, `${++successCount}/${colsToUpload.length}`);
    console.log('uploading', colName);
    if (isDropOld) {
      try {
        await db.dropCollection(colName);
      } catch(err) {}
    }
    const collection = await _dbService.getCollection(colName);
    let fileIdx = 0;
    while (true) {
      try {
        const filePath = FILE_PATH(colName, fileIdx);
        if (!fs.existsSync(filePath)) break;
        let items = require('../../' + filePath);
        items = items.filter(c => dbService.isValidMongoId(c._id, true)).map(c => ({...c, _id: ObjectId(c._id)}));
        await collection.insertMany(items);
        console.log('uploaded col ' + colName, 'page: ', fileIdx + 1);
        fileIdx++;
      } catch (err) {
        console.log('HAD ERROR WITH COL', colName, 'PAGE:', fileIdx);
        console.error(err);
        break;
      }
    }
    console.log('done uploading', colName, `${++successCount}/${colsToUpload.length}`);
  }
  // });
  // await Promise.all(prms);
  console.log('DONE UPLOADING DATA');
}