const { isNativTypeClass, isInstanceOfLocalClass, isLocalTypeClass } = require('./class');

const validate = (Interface, data, isToFail = false, isOptionalMissingVals = false, strict = true, debug = false, debugPath = 'Data') => {
    function resolve(resolvedVal = false, errMsg = '') {
        if (!resolvedVal && (debug || isToFail)) _createError(debugPath, Interface, data, errMsg, isToFail);
        return resolvedVal;
    }

    if (isNativTypeClass(Interface)) {
        switch (Interface) {
            case String: return resolve(typeof data === 'string');
            case Number: return resolve(typeof data === 'number');
            case Boolean: return resolve(typeof data === 'boolean');
            case Object: return resolve(typeof data === 'object');
            case Array: return resolve(Array.isArray(data));
            case Date: return resolve(!isNaN(+new Date(data)));
            case undefined: return resolve(typeof data === 'undefined');
        }
    }

    if (isLocalTypeClass(Interface)) Interface = new Interface();
    if (isInstanceOfLocalClass(Interface)) return resolve(Interface.validate(data, strict, validate, isToFail));

    if (Array.isArray(Interface)) {
        if (!Array.isArray(data)) return resolve(false);
        if (!Interface.length) return resolve(true);
        const [arrType, arrLength] = Interface;
        if (arrLength && data.length !== arrLength) return resolve(false, `Expected an array in the length of ${arrLength}`);
        for (let i = 0; i < data.length; i++) {
            const currData = data[i];
            if (!validate(arrType, currData, isToFail, isOptionalMissingVals, strict, debug, `${debugPath}[${i}]`)) return false;
        }
        return true;
    }

    if (Interface && typeof Interface === 'object') {
        if (!data || typeof data !== 'object') return resolve(false);
        // const allKeys = Object.keys({...Interface, ...data});
        for (const key in Interface) {
            const currType = Interface[key];
            if (!(key in data)) {
                if (isOptionalMissingVals) continue;
                else return resolve(false, `Missing property ${key} of type ${_stringit(currType)}`);
            }
            const currData = data[key];
            // if (!(key in Interface)) {
            //     return resolve(false, `Unexpected property ${key}, with the vlue of ${_stringit(currData)}, of type ${_stringit(currType)}`);
            // }
            if (!validate(currType, currData, isToFail, isOptionalMissingVals, strict, debug, `${debugPath}.${key}`)) return false;
        }
        return true;
    }

    return resolve(data === Interface);
}

module.exports = validate;




const _stringit = (val, deep = false) => {
    if (val === '') return '<-EMPTY_STRING->'
    if (isNativTypeClass(val)) {
        switch (val) {
            case String: return 'String';
            case Number: return 'Number';
            case Object: return 'Object';
            case Boolean: return 'Boolean';
            case Array: return 'Array';
            case Date: return 'Date';
            case undefined: return 'undefined';
        }
    }
    if (isInstanceOfLocalClass(val)) return val.toString(_stringit);
    if (Array.isArray(val)) {
        const [item, requiredLength] = val;
        return `Array${val.length ? (' of: ' + _stringit(item, true) + (requiredLength ? (', in length of ' + requiredLength) : '')) : ' in the length of 0'}`;
    }
    if (typeof val === 'object') {
        if (!val) return 'null';
        const itemToReturn = {};
        for (const key in val) itemToReturn[key] = _stringit(val[key], true);
        return deep? itemToReturn : JSON.stringify(itemToReturn);
    };
    return val;
}


const _createError = (debugPath, type, data, msg = '', isToFail) => {
    // const defaultMsgEndpoint = `    Expected: ${_stringit(type)}, of type ${typeof type}.\n` +
    //                            `    Got: ${_stringit(data)}, of type: ${typeof data}\n\n`;
    const defaultMsgEndpoint = `    Expected: ${_stringit(type)}\n` +
                               `    Got: ${_stringit(data)}\n\n`;

    const msgEndPoint = msg? `    ${msg}\n\n` : defaultMsgEndpoint;

    const errorMsg = `\n\nError while validating data!\n` +
                     `    At: ${debugPath}\n\n` +
                     msgEndPoint;
    
    if (!isToFail) console.error(errorMsg);
    else throw new Error(errorMsg)
}