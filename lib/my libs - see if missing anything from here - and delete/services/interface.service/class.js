class Enumerator {
    constructor(...posibleVals) {
        if (!posibleVals.length) throw new Error('Enumerator must have at least one option!');
        if (posibleVals.some(curr => typeof (curr) !== 'string')) throw new Error('Enumerator options must be of type string!');
        this.posibleVals = posibleVals;
    }
    validate(val, strict = true) {
        return this.posibleVals.includes(val) || !strict && val === '';
    }
    toString(stringit = c => c) {
        return `Enumerator - One of: ${this.posibleVals.map(stringit).join(', ')}`;
    }
    empty = () => '';
    random(rand) {
        return rand.item(this.posibleVals);
    }
}

class Range {
    constructor(min = -infinity, max = Infinity) {
        if (typeof (min) !== 'number' ||
            typeof (max) !== 'number') throw new Error('Range min and max params must be of type number!');
        this.min = min;
        this.max = max;
    }
    validate(val, strict = true) {
        if (!strict && val === 0) return true;
        if (typeof (val) !== 'number') return false;
        return val >= this.min && val <= this.max;
    }
    toString(stringit = c => c) {
        return `Range - A number between ${this.min} and ${this.max}`;
    }
    empty = () => 0;
    random(rand) {
        return rand.int(this.min, this.max);
    }
}

class MultiType {
    constructor(...types) {  // the 'falsy' type should be the first one (for testing and creating item);
        if (types.length < 2) throw new Error('MultiType class must have at least two types!');
        this.types = types;
    }
    validate(val, strict = true, validate) {
        if (!strict && !val) return true;
        for (const type of this.types) {
            if (validate(type, val, false)) return true;
        }
        return false;
    }
    toString(stringit = c => c) {
        return `Multi type - One of types: ${this.types.map(curr => stringit(curr)).join(', ')}`;
    }
    empty() {
        return this.types[0];
    }
    random(rand) {
        return rand.item(this.types, 1);
    }
}

class BaseTypeClass {   //  Helps to create new type class without missing the required methods.
    validate = (val, strict = true, validate) => true;
    toString(stringit = c => c) {
        return stringit(this);
    }
    empty = () => undefined;
    random = () => undefined;
}

class Any {
    validate(val, strict = true, validate) {
        return true;
    }
    toString(stringit = c => c) {
        return `Any type`;
    }
    empty() {
        return null;
    }
    random() {
        return null;
    }
}

class TimeMS {
    constructor(val = 0) {
        this.val = val;
    }
    validate(val, strict = true, validate) {
        return typeof this.val === 'number';
    }
    toString(stringit = c => c) {
        return `TimeMS - ${this.val}`;
    }
    empty() {
        return 0;
    }
    random(rand) {
        return rand.int(0, 10000000);
    }
}

const LocalTypeClass = [Enumerator, Range, MultiType, BaseTypeClass, Any, TimeMS];
const UseType = InterFace => LocalTypeClass.push(InterFace); // send a new type class to this function so the service will know to use it.

const isNativTypeClass = (val) => [String, Number, Boolean, Object, Array, Date, undefined].includes(val);
const isInstanceOfLocalClass = (val) => LocalTypeClass.some(curr => val instanceof curr);
const isLocalTypeClass = (val) => LocalTypeClass.includes(val);


module.exports = {
    Enumerator,
    Range,
    MultiType,
    Any,
    TimeMS,

    isNativTypeClass,
    isInstanceOfLocalClass,
    isLocalTypeClass,
    
    BaseTypeClass,
    UseType
}