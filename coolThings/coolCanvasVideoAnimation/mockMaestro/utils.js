const randInt = (min = -infinity, max) => Math.floor(Math.random() * (max - min) + min);

const randItem = (arr, start = 0, end = arr.length) => arr[randInt(start, end)];

const makeId = (len = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    let id = '';
    for (let i = 0; i < len; i++) id += randItem(chars);
    return id;
}


export default {
    makeId,
    randInt,
    randItem
}