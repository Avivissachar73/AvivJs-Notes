const { userRoles, userRolesMap, organizationRoles } = require('../services/globalServices/const.service.js');
const { createError } = require('../services/globalServices/utils.service.js');
const { getUserFromExpressReq } = require('../api/auth/user.session.service.js');
const { validateUserRole, validateUserMinRole, validateCreator, validateCreatorOrAdmin, validateUserOrgRole } = require('../services/userValidation.service');


const validateRole = (...roles) => {
    return (req, res, next) => {
        const user = getUserFromExpressReq(req);
        for (const role of roles) {
            if (validateUserRole(user, role)) return next();
        }
        res.status(401).send(createError('authLocales.userNotAllowedError', 401, 'Authorization error: missing required roles for user: ' + roles.join(', ')));
    }
}
exports.validateRole = validateRole;

exports.validateAdmin = validateRole(userRoles.admin);
exports.validateProducer = validateRole(userRoles.admin, userRoles.producer);
exports.validateUser = validateRole(userRoles.user, userRoles.admin, userRoles.producer);
exports.validateAdminOrProducer = validateRole(userRoles.admin, userRoles.producer);

const validateOrgRole = (...roles) => {
    return (req, res, next) => {
        const orgId = req.params.organizationId || req.body.organizationId || req.params.id || req.body._id;
        const user = getUserFromExpressReq(req);
        for (const role of roles) {
            if (validateUserOrgRole(user, orgId, role)) return next();
        }
        res.status(401).send(createError('authLocales.userNotAllowedError', 401, 'Authorization error: missing required roles for user in organization: ' + roles.join(', ')));
    }
}
exports.validateOrgRole = validateOrgRole;

exports.validateOrgAdmin = validateOrgRole(organizationRoles.admin);
exports.validateOrgProducer = validateOrgRole(organizationRoles.producer);
exports.validateOrgAdminOrProducer = validateOrgRole(organizationRoles.admin, organizationRoles.producer);

const validateMinRole = (role) => {
    return (req, res, next) => {
        const user = getUserFromExpressReq(req);
        if (validateUserMinRole(user, role)) return next();
        res.status(401).send(createError('authLocales.userNotAllowedError', 401, 'Authorization error: missing min role for user: ' + role));
    }
}
exports.validateMinRole = validateMinRole;


const validateSelfOrRole = (role) => {
    return (req, res, next) => {
        const user = getUserFromExpressReq(req);
        if (_validateSelf(req) || validateUserRole(user, role)) return next();
        res.status(401).send(createError('authLocales.userNotAllowedError', 401, 'Unauthorized'));
    }
}
exports.validateSelfOrRole = validateSelfOrRole;
exports.validateSelfOrAdmin = validateSelfOrRole(userRoles.admin);

const validateSelfOrOrgRole = (role) => {
    return (req, res, next) => {
        const user = getUserFromExpressReq(req);
        const orgId = req.params.organizationId || req.body.organizationId;
        if (_validateSelf(req) || validateUserOrgRole(user, orgId, role)) return next();
        res.status(401).send(createError('authLocales.userNotAllowedError', 401, 'Unauthorized'));
    }
}
exports.validateSelfOrOrgProducer = validateSelfOrOrgRole(organizationRoles.producer);
exports.validateSelfOrOrgAdmin = validateSelfOrOrgRole(organizationRoles.admin);

const validateSelfOrMinRole = (role) => {
    return (req, res, next) => {
        const user = getUserFromExpressReq(req);
        if (_validateSelf(req) || validateUserMinRole(user, role)) return next();
        res.status(401).send(createError('authLocales.userNotAllowedError', 401, 'Unauthorized'));
    }
}
exports.validateSelfOrMinRole = validateSelfOrMinRole;


exports.getAccountRolesLevel = (account) => {
    return Math.min(...account.roles.map(c => userRolesMap[c]));
}

function _validateSelf(req) {
    const user = getUserFromExpressReq(req);
    if (!user) return false;
    const id = req.params.id || req.body._id;
    return id === user._id;
}