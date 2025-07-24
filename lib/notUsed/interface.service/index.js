const validateType = require('./typeValidation.function');
const generateItemFromInterface = require('./generateItem.function');
const { Enumerator, Range, MultiType, BaseTypeClass, UseType, Any, TimeMS } = require('./class');

module.exports = {
    validateType,
    generateItemFromInterface,

    Enumerator: (...posibleVals) => new Enumerator(...posibleVals),
    Range: (min = -infinity, max = Infinity) => new Range(min, max),
    MultiType: (...types) => new MultiType(...types),
    Any: () => new Any(),
    TimeMS: (...args) => new TimeMS(...args),
    BaseTypeClass,
    UseType,

    cleanItem: (item, interface) => {
        const interfaceKeys = Object.keys(interface);
        for (let key in item) if (!interfaceKeys.includes(key)) {delete item[key];}
    }
};