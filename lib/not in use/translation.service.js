/** This file exports translation function to parse texts to different langs;
 * 
 * Translations map object example:
        transs = {
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


const transs = require('../translations');

const LOCAL = localStorage?.user_local || 'en';
const setLocal = localToSet => {
    LOCAL = localToSet;
    if (localStorage) localStorage.user_local = LOCAL;
}
const getLocal = () => LOCAL;

const $t = (key, lang = LOCAL) => {
    if (!transs[lang] || !transs[lang][key]) return key;
    return utils.getDeepVal(transs[lang][key]);
}

const create$t = (lang = LOCAL) => {
    return (key) => $t(key, lang);
}

const deep$t = (key, lang = LOCAL) => {
    if (typeof(key) !== 'object') return $t(key, lang);
    for (let currKey in key) {
        key[currKey] = deep$t(key[currKey], lang);
    }
    return key;
}

const createDeep$t = (lang = LOCAL) => {
    return (key) => deep$t(key, lang);
}


module.exports = {
    $t,
    create$t,
    deep$t,
    createDeep$t,
    setLocal,
    getLocal
}