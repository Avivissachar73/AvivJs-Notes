/** This file exports translation function to parse texts to different langs;
 * 
 * Translations map object example:
        transsMap = {
            en: {
                hello: 'Hello',
                toster: 'Toster'
            },
            he: {
                hello: 'שלום',
                toster: 'טוסטר'
            }
        }
*/

const utils = require('./utils.service');
const transsMap = require('../locales');

// const DEFAULT_LOCALE = localStorage?.user_local || 'en';
const DEFAULT_LOCALE = 'en';
// const setLocal = localToSet => {
//     DEFAULT_LOCALE = localToSet;
//     if (localStorage) localStorage.user_local = DEFAULT_LOCALE;
// }
// const getLocal = () => DEFAULT_LOCALE;

const $t = (locale = DEFAULT_LOCALE, key, _transsMap = transsMap) => {
    // if (!_transsMap[locale] || !_transsMap[locale][key]) return key;
    if (!_transsMap[locale]) locale = DEFAULT_LOCALE;
    return utils.getDeepVal(_transsMap[locale], key) || key;
}

const create$t = (locale = DEFAULT_LOCALE) => {
    return (key) => $t(locale, key);
}

const deep$t = (locale = DEFAULT_LOCALE, key) => {
    if (typeof(key) !== 'object') return $t(locale, key);
    for (let currKey in key) {
        key[currKey] = deep$t(locale, key[currKey]);
    }
    return key;
}

const createDeep$t = (locale = DEFAULT_LOCALE) => {
    return (key) => deep$t(locale, key);
}


module.exports = {
    $t,
    create$t,
    deep$t,
    createDeep$t,
    // setLocal,
    // getLocal
}