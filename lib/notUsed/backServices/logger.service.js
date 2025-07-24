const config = require('../../config');
const dbService = require('../../services/db.service');
const { getCountryFromIp } = require('../../services/maxmind.service');
const { minimizeAccount } = require('../account/account.interface');

const COLNAME = 'log';

async function addLog(log = { msg: '', level: 'error', title: '', data: {}, user: null, global: false }) {
  if (!config.writeLogs) return;
  return dbService.getServiceByExpressReq().add(COLNAME, JSON.parse(JSON.stringify(log))); // parse stringify to make sure no infinite graph loops
}


function log(level = 'info', title = '', msg = '', data = null, user = null, organizationId = null, dontStore = false, global = false) {
  if (user) user = minimizeAccount(user);
  // console.log(`LOGGER_${level.toUpperCase()}: ${title} - ${msg}`, data, user);
  const block = (length) => '#'.repeat(length);
  console.log(block(60));
  console.log(`LOGGER_${level.toUpperCase()}: ${title || ''}`, new Date());
  if (msg)  console.log(msg);
  if (data) console.log('DATA ::', data);
  if (user) console.log('USER ::', user);
  console.log(block(60));
  // if (!config.isDev) addLog({ msg, level: level.toLowerCase(), data, user });
  if (!dontStore) return addLog({ title, msg, level: level.toLowerCase(), data, user, organizationId, global });
}


// const UAParser = require('ua-parser-js');
function getExpressReqRelevantDataForLog(expressRequestObject) {
  if (!expressRequestObject) return { msg: 'NO REQUEST DATA', requestData: null };
  const ip = expressRequestObject.headers['cf-connecting-ip'] ||
             expressRequestObject.headers['x-real-ip'] ||
             expressRequestObject.headers['x-forwarded-for'] ||
             expressRequestObject.connection.remoteAddress
  return {
    requestData: {
      path: expressRequestObject.path,
      query: {...expressRequestObject.query},
      params: {...expressRequestObject.params},
      body: {...expressRequestObject.body},
      refferer: expressRequestObject.get('Referrer'),
      'client-location': expressRequestObject.get('client-location'),
      'client-subdomain': expressRequestObject.get('client-subdomain'),
      originalUrl: expressRequestObject.originalUrl,
      // ip: expressRequestObject.headers['x-forwarded-for'] || 'UNKNOWN'
      ip: ip || 'UNKNOWN',
      userAgent: expressRequestObject.headers['user-agent'] || null,
      countryByIp: ip? getCountryFromIp(ip) || null : null
      // device: (new UAParser(expressRequestObject.headers['user-agent'])).getResult() || null
    }
  }
}

module.exports = {
  COLNAME,
  log,
  info(title, msg, data, user, organizationId) {log('INFO', title, msg, data, user, organizationId)},
  error(title, msg, data, user, organizationId) {log('ERROR', title, msg, data, user, organizationId)},
  warn(title, msg, data, user, organizationId) {log('WARNING', title, msg, data, user, organizationId)},
  debug(title, msg, data, user, organizationId) {log('DEBUG', title, msg, data, user, organizationId)},
  soft(title, msg, data, user, organizationId) {log('SOFT', title, msg, data, user, organizationId, true)},
  global(title, msg, data, user, organizationId) {log('GLOBAL_INFO', title, msg, data, user, organizationId, false, true)},
  getExpressReqRelevantDataForLog
}