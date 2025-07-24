

const maxmind = require('maxmind');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'GeoLite2-Country.mmdb');

let lookup;

const initGeoDb = async () => {
  lookup = await maxmind.open(dbPath);
}
initGeoDb();

const getCountryFromIp = (ip) => {
  // const unknownCountry = 'Unknown';
  const unknownCountry = null;
  if (!lookup) return unknownCountry;
  const result = lookup.get(ip);
  return result?.country?.iso_code || unknownCountry;
}

module.exports = { initGeoDb, getCountryFromIp }