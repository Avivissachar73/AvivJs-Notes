const { ObjectId } = require('mongodb');
const { BaseTypeClass, UseType } = require('./index');

class MongoId extends BaseTypeClass {
    validate(val, strict = true, validate) {
        try {
            const id = ObjectId(val.toString());    
        } catch(err) {
            return false;
        }
        return true;
    };
    toString(stringit = c => c) {
        return `MongoDB ObjectID or valid 12 characters mongo id string`;
    }
    empty = () => '';
    random = () => ObjectId().toString();
}
UseType(MongoId);

module.exports = {
    MongoId
}