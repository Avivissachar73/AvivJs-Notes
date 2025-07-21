
const { userRoles, userRolesMap, organizationRoles, organizationStatuses, organizationRolesMap } = require('./const.service.js');


function validateUserRole(user, role) {
  if (!role) return false;
  if (Array.isArray(user.roles)) {
      if (user.roles.includes(role)) return true;
  } else if (user.role === role) return true;
  return false;
}
function validateUserMinRole(user, role) {
  const reqRoleVal = userRolesMap[role];
  if (Array.isArray(user.roles)) {
    return user.roles.some(c => userRolesMap[c] <= reqRoleVal);
  } else {
    const userRoleVal = userRolesMap[user.role];
    return userRoleVal <= reqRoleVal;
  }
}

function validateAppAdmin(user) {
  return validateUserRole(user, userRoles.admin)
}

function validateCreator(item, user) {
  return (item._createdBy?._id === user._id);
}

function validateCreatorOrRole(item, user, role) {
  return (validateCreator(item, user) || validateUserRole(user, role));
}

function validateCreatorOrAdmin(item, user) {
  return validateCreatorOrRole(item, user, userRoles.admin);
}


function validateCreatorOrOrgRole(item, user, role) {
  return (validateCreator(item, user) || validateUserOrgRole(user, item.organizationId, role));
}




function getOrgInUser(user, organizationId) {
  return user?.organizations?.find(c => c._id?.toString() === organizationId?.toString());
}

function validateUserApprovedInOrg(user, organizationId) {
  const orgInUser = getOrgInUser(user, organizationId);
  return orgInUser?.status === organizationStatuses.approved;
}

function validateUserOrgRole(user, organizationId, role) {
  const orgInUser = getOrgInUser(user, organizationId);
                //  || user?.organizations?.find(c => c.organizationId?.toString() === organizationId.toString());
  if (!validateUserApprovedInOrg(user, organizationId)) return false;
  return orgInUser?.roles?.includes(role);
}

function validateUserOrgAdmin(user, organizationId) {
  return validateUserOrgRole(user, organizationId, organizationRoles.admin);
}
function validateUserOrgProducer(user, organizationId) {
  return validateUserOrgRole(user, organizationId, organizationRoles.producer);
}

function validateCreatorOrOrgAdmin(item, user) {
  return validateCreatorOrOrgRole(item, user, organizationRoles.admin);
}
function validateUserMinOrgRole(user, organizationId, role) {
  const reqRoleVal = organizationRolesMap[role];
  const orgItem = getOrgInUser(user, organizationId);
  if (!orgItem) return false;
  return orgItem.roles.some(c => organizationRolesMap[c] <= reqRoleVal);
}
function validateUserMaxOrgRole(user, organizationId, role) {
  const reqRoleVal = userRolesMap[role];
  const orgItem = getOrgInUser(user, organizationId);
  if (!orgItem) return false;
  return orgItem.roles.every(c => organizationRolesMap[c] >= reqRoleVal);
}

module.exports = {
  validateUserRole,
  validateUserMinRole,
  validateCreator,
  validateCreatorOrAdmin,
  validateAppAdmin,

  getOrgInUser,
  validateUserApprovedInOrg,

  validateCreatorOrOrgRole,
  validateUserOrgRole,
  validateUserOrgAdmin,
  validateUserOrgProducer,
  validateCreatorOrOrgAdmin,
  validateUserMinOrgRole,
  validateUserMaxOrgRole
}