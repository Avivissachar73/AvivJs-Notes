import mockData from './mockHttpData.js';

// const mockHttpData = {   // mock data example
//   'get/someApi': 'regReq',
//   'get/someApi/:param': 'with param',
//   'get/someApi/:param?': 'with optional param',
//   'get/someApi|?param1=val1&param2=val2': 'with query params',
// }

async function getMockDataFromUrl(url = '', method = 'get', data = null, params = {}) {
  await delay(Math.random() * (500) + 500);
  return getDataFromPath(mockData, `${method.toLowerCase()}/${url.split('?')[0]}`, params);
}

function getDataFromPath(map = {}, reqPath = '', params = {}) {
  const [path, queryStr] = reqPath.split('?');
  const queryParams = { ...params, ...getParamsFromQuery(queryStr) };

  // const fullPath = `${method.toLowerCase()}/${path}`;
  if (map[path] && !Object.keys(queryParams).length) return map[path];

  const splited = path.split('/').filter(Boolean);
  for (let urlKey in map) {
    const [currPath, currQueryStr] = urlKey.split('|?');

    const currParams = getParamsFromQuery(currQueryStr);
    let match = true;
    for (let key in currParams) {
      if (currParams[key] !== queryParams[key]) {
        match = false;
        break;
      }
    }
    if (!match) continue;

    const currSplited = currPath.split('/');
    if ((currSplited.length !== splited.length) && urlKey[urlKey.length-1] !== '?') continue;
    for (let i = 0; i < splited.length; i++) {
      const currK = splited[i];       // K === urlKey;
      const currO = currSplited[i];   // O === original;
      if (currO === currK) continue;
      const isParam = currO[0] === ':';
      if (isParam && currK) continue;
      match = false;
      break;
    }
    if (match) return map[urlKey];
  }
  return null;
}

function delay(time = 3000) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}

function getQuerysStr(filterBy = {}) {
  var queryStr = '?';
  for (let key in filterBy) {
      let val = (typeof(filterBy[key]) === 'object')? 
                          JSON.stringify(filterBy[key]) : 
                          filterBy[key];
      queryStr += `${key}=${val}&`;
  }
  return queryStr.slice(0, queryStr.length-1);
}
function getParamsFromQuery(queryStr = '') {
  if (!queryStr) return {};
  if (queryStr[0] === '?') queryStr = queryStr.slice(1);
  return queryStr.split('&').reduce((params, curr) => {
    const [key, val] = curr.split('=');
    params[key] = val;
    return params;
  }, {});
}

export const mockHttpService = {
  get(endpoint, params) {
      return getMockDataFromUrl(endpoint, 'GET', null, params)
  },
  post(endpoint, data) {
      return getMockDataFromUrl(endpoint, 'POST', data)
  },
  put(endpoint, data) {
      return getMockDataFromUrl(endpoint, 'PUT', data)
  },
  delete(endpoint, data) {
      return getMockDataFromUrl(endpoint, 'DELETE', data)
  }
}