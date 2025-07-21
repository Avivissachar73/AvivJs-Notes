
const { getRandomId } = require('./utils.service');
const dbService = require('./db.service');

// const TOKEN_DATA = {}; // { 'SOME_TOKEN': {/*DATA*/} } // as a map object, not in use currently;
const COLLECTION_NAME = 'dataToken';
const makeTokenItem = (data, expirationTime, token) => ({
  // _id: getRandomId(), // givven by mongo db;
  data,
  token: token || getRandomId(),
  validUntil: Date.now() + expirationTime,
  expirationTime
});

async function sign(data, token) {
  // TOKEN_DATA[token] = data && (typeof data === 'object')? JSON.parse(JSON.stringify(data)) : data;
  const expirationTime = 1000*60*5; // 5 minutes;
  const newTokenItem = makeTokenItem(data, expirationTime, token);
  await dbService.getServiceByExpressReq().add(COLLECTION_NAME, newTokenItem);
  setTimeout(() => {
    remove(newTokenItem.token);
  }, expirationTime);
  return newTokenItem;
}

async function remove(token) {
  // delete TOKEN_DATA[token];
  return dbService.getServiceByExpressReq().removeBy(COLLECTION_NAME, {token});
}

function makeReturnVal(tokenItem) {
  if (!tokenItem) return null;
  if (_checkIfExpired(tokenItem)) {
    remove(tokenItem.token);
    return null;
  }
  return tokenItem; // .data;
}

async function get(token) {
  // return TOKEN_DATA[token] || null;
  const tokenItem = await dbService.getServiceByExpressReq().getBy(COLLECTION_NAME, {token});
  return makeReturnVal(tokenItem);
}

async function getBy(crit) {
  const tokenItem = await dbService.getServiceByExpressReq().getBy(COLLECTION_NAME, crit);
  return makeReturnVal(tokenItem);
}

async function getAndTerminate(token) {
  const res = await get(token);
  await remove(token);
  return res;
}

function _checkIfExpired(tokenItem) {
  return tokenItem.validUntil <= Date.now();
}

async function clearAllExpired() {
  const allData = await dbService.getServiceByExpressReq().query(COLLECTION_NAME);
  return Promise.all(allData.items.map(c => {
    if (_checkIfExpired(c)) return remove(c);
    return Promise.resolve();
  }));
}

module.exports = {
  sign,
  remove,
  get,
  getBy,
  getAndTerminate,
  clearAllExpired
}

// setInterval(clearAllExpired, 1000*60*60);