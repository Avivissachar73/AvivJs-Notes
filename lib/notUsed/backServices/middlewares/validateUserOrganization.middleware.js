const { organizationStatuses, organizationRoles } = require('../services/globalServices/const.service.js');
const { createError } = require('../services/globalServices/utils.service.js');
const { getUserFromExpressReq } = require('../api/auth/user.session.service.js');
const { validateUserMinOrgRole } = require('../services/userValidation.service.js');


const validateOrganization = (req, res, next) => {
    const orgInUser = _getOrgFromReq(req);
    if (!orgInUser) return res.status(401).send(createError('userNotAllowdInOrganizationError', 401, 'Authorization error: user not allowd'));
    next();
}

const validateOrganizationMember = (req, res, next) => {
    const orgInUser = _getOrgFromReq(req);
    if (orgInUser?.status !== organizationStatuses.approved) return res.status(401).send(createError('userNotAllowdInOrganizationError', 401, 'Authorization error: user not allowd'));
    next();
}
const validateOrganizationRole = (role) => {
    return (req, res, next) => {
        const orgInUser = _getOrgFromReq(req);
        if (!orgInUser || !validateUserMinOrgRole(getUserFromExpressReq(req), orgInUser._id, role)) return res.status(401).send(createError('userNotAllowdInOrganizationError', 401, 'Authorization error: user not allowd'));
        next();
    }
}

function _getOrgFromReq(req) {
    const user = getUserFromExpressReq(req);
    const orgId = req.params.organizationId || req.params.id || req.body._id;
    if (orgId === 'public') return { status: organizationStatuses.approved };
    const orgInUser = user?.organizations?.find(c => [c._id, c.organizationId].includes(orgId));
    return orgInUser;
}

module.exports = { validateOrganization, validateOrganizationMember, validateOrganizationRole };
