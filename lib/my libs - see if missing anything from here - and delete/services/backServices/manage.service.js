const dbService = require('./db.service');
const { getDeepVal, setDeepVal } = require('./utils.service');

const COL_NAME = 'manage';

async function getManage() {
  const _dbService = dbService.getServiceByExpressReq();
  const manageData = await _dbService.query(COL_NAME);
  const manageItem = manageData.items[0];
  if (!manageItem) {
    const initialManageItem = {};
    return _dbService.add(COL_NAME, initialManageItem);
  }
  return manageItem;
}

async function getManageParam(field) {
  const manage = await getManage();
  return getDeepVal(manage, field);
}

async function updateFullManage(manageItem) {
  return dbService.getServiceByExpressReq().update(COL_NAME, manageItem);
}

async function setManageParam(field, val) {
  const manage = await getManage();
  setDeepVal(manage, field, val);
  await updateFullManage(manage);
}

module.exports = {
  getManage,
  getManageParam,
  setManageParam
}