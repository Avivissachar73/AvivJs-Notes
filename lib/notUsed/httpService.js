const { Utils } = require('../utils.service');

const { default: axios } = require('axios');
// axios.default.withCredentials = true;

// const BASE_URL = process.env.NODE_ENV === 'production'
//   ? 'api/'
//   // ? window.location.origin + '/better-api/'
//   : 'http://localhost:3000/api/';

module.exports.HttpService = class HttpService {
  constructor(baseApiUrl) {
    this.BASE_URL = baseApiUrl;
    this.url = this.BASE_URL;
  }

  ajax = async (endpoint = '', method = 'get', data = {}, params = {}, headers = {}) => {
    try {
      const res = await axios({
        url: this.BASE_URL + '/' + endpoint,
        method,
        data,
        params,
        headers: {
          ...headers,
          'client-location': window.location.href,
          'client-subdomain': window.location.pathname?.split('/').filter(Boolean).join('/') || ''
        },
        withCredentials: true
      });
      return res.data;
    } catch(err) {
      return _handleError(err);
    }
  }
  get = (endpoint, query) => this.ajax(endpoint, 'GET', {}, query);
  post = (endpoint, data, query, headers) => this.ajax(endpoint, 'POST', data, query, headers);
  put = (endpoint, data) => this.ajax(endpoint, 'PUT', data);
  remove = (endpoint, data) => this.ajax(endpoint, 'DELETE', data);
  download = async (endpoint, params) => {
    const url = `${this.BASE_URL}/${endpoint}?${Utils.getQuerysStr(params)}`;
    // let fileName;
    // let blob;
    try {
        const res = await fetch(url, { credentials: 'include' });
        if (res.status !== 200) throw { ...await res.json(), status: res.status };

        const nameHeader = res.headers.get('content-disposition');
        const fileName = nameHeader.slice(nameHeader.indexOf('=') + 1);
        const blob = await res.blob();

        const objUrl = URL.createObjectURL(blob);
        const elLink = document.createElement('a');
        elLink.href = objUrl;
        elLink.download = fileName;
        elLink.click();
    } catch (err) {
        return _handleError(err);
    }
  }
  logToServer = (level, title, msg, data) => {
    return this.ajax('log', 'POST', {level, title, msg, data});
  }
}

function _handleError(err) {
  // console.error(err);
  // return err.response?.data || err;
  // throw err;
  throw err.response?.data || err;
}