const { isInstanceOfLocalClass, isNativTypeClass, isLocalTypeClass } = require('./class');

function generate(Interface, random = false, defaultLenForArray = 0) {
    if (isNativTypeClass(Interface)) {
        switch (Interface) {
            case String: return random ? rand.txt() : '';
            case Number: return random ? rand.int(-1000, 1000) : 0;
            case Boolean: return random ? rand.item([false, true]) : false;
            case Object: return {};
            case Array: return [];
            case Date: return random ? new Date(Date.now() - rand.int(0, Date.now())) : null;
            case undefined: return undefined;
        }
    }

    if (isLocalTypeClass(Interface)) Interface = new Interface();
    if (isInstanceOfLocalClass(Interface)) {
        return generate(
            random
                ? Interface.random(rand)
                : Interface.empty(),
            random,
            defaultLenForArray
        );
    }

    if (Array.isArray(Interface)) {
        if (!Interface.length) return [];
        const [arrType, arrLength = defaultLenForArray] = Interface;
        const res = [];
        for (let i = 0; i < arrLength; i++) {
            res.push(generate(arrType, random, defaultLenForArray));
        }
        return res;
    }

    if (Interface && typeof Interface === 'object') {
        const res = {};
        for (const key in Interface) {
            res[key] = generate(Interface[key], random, defaultLenForArray);
        }
        return res;
    }

    return Interface;
}

module.exports = generate;


const randInt = (min = -infinity, max = infinity) => Math.floor(Math.random() * (max - min) + min);
const randItem = (arr, start = 0, end = arr.length) => arr[randInt(start, end)];

const _range = (len = 0) => '0'.repeat(len).split('').map((c, i) => i);

const _randLetter = () => String.fromCharCode(randInt(97, 123));

const _randChar = () => randItem([_randLetter(), _randLetter().toUpperCase(), randInt(0, 9), randInt(0, 9)]);
const _randPass = (len = 6) => _range(len).reduce((acc) => acc + _randChar(), '');

const _randWord = (len = 4) => _range(len).reduce((acc) => acc + _randLetter(), '');
const randTxt = (len = 7) => _range(len).map(c => _randWord(randInt(2, 6))).join(' ');

const rand = {
    int: randInt,
    item: randItem,
    txt: randTxt
}