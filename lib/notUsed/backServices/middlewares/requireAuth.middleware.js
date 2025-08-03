// const jwtTokenService = require('../services/jwt-token.service.js');
const { createError } = require('../services/globalServices/utils.service.js');
const { getUserFromExpressReq, is2FactorAuth, updateAccuntSessionData } = require('../api/auth/user.session.service.js');
const organizationService = require('../api/organization/organization.service.js');
const accountService = require('../api/account/account.service.js');
// const authService = require('../api/auth/auth.service.js');
const { validateUserApprovedInOrg, getOrgInUser, validateUserOrgProducer, validateUserOrgAdmin, validateAppAdmin } = require('../services/userValidation.service.js');


async function requireAuth(req, res, next) {  
  const endIt = (data) => res.status(401).send(createError('authLocales.notLoggedInError', 401, 'Unauthorized, please login.', data));
  try {
    if (req.query.apiKey) {
      const user = await accountService.getByApiKey(req.query.apiKey);
      if (user) {
        updateAccuntSessionData(req, user);
        return next();
      }
      else return endIt();
    }
    const user = getUserFromExpressReq(req);
    if (!user) return endIt();
    // if (!user.emailVerified) {
    //   await authService.makeAth2FactorToken(user);
    //   return endIt({needs2FactorAuth: true, comunicationMethods: ['email']});
    // }
    // req.user = user; // TODO:: need this?;
    next();
  } catch(err) {
    endIt();
  }
}

async function dynamicRequireAuthByOrganization(req, res, next) {
  const endIt = (data) => res.status(401).send(createError('authLocales.unAuthorizedError', 401, 'Unauthorized', data));
  try {
    const orgId = req.params.organizationId;
    const org = await organizationService.get(orgId);
    if (!org) return res.status(404).send(createError('notFoundError', 401, 'Not found'));
    if (!org.requireAuth) return next();
    const user = getUserFromExpressReq(req);
    if (!user) return endIt();
    const userOrgItem = getOrgInUser(user, orgId);
    if (userOrgItem?.skipSecondFactorAuth) return next();
    if (!validateUserApprovedInOrg(user, org._id)) return endIt();
    // if (validateUserOrgProducer(user, org._id) || validateUserOrgAdmin(user, org._id)) return next();
    if (validateAppAdmin(user)) return next();
    if (org.require2FactorAuth && !is2FactorAuth(req)) return endIt({needs2FactorAuth: true});
    next();
  } catch(err) {
    endIt();
  }
}

// function requireAuth(req, res, next) {
//   if (!getUserFromExpressReq(req)) return res.status(401).end('Not Authenticated')
// }
// async function _____requireAuth(req, res, next) {
//   const token = req.cookies.token;
//   const endIt = () => res.status(401).send(createError('authLocales.notLoggedInError', 401, 'Unauthorized, please login.'));
//   if (!token) return endIt();

//   try {
//     const decodedUser = await jwtTokenService.verify(token);
//     req.user = decodedUser;
//     if (!req.session.userData) throw new Error('Coocky but no session, needs login');
//     // if (!req.session.userData) req.session.userData = { user: decodedUser, token };
//     next();
//   } catch(err) {
//     endIt();
//   }
// }


module.exports = { 
  requireAuth,
  dynamicRequireAuthByOrganization
};