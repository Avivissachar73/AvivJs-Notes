const { minimizeAccount } = require('../api/account/account.interface.js');
const { noop } = require('../services/globalServices/utils.service.js');
const { getUserFromExpressReq } = require('../api/auth/user.session.service.js');

function addCreatedByToReqBody(req, res, next) {
  noop(res);
  const user = getUserFromExpressReq(req);
  // const createdBy = user ? minimizeAccount(user) : { err: 'unknown user' };
  const createdBy = user ? minimizeAccount(user) : null;
  req.body._createdBy = createdBy._id;
  next();
}

module.exports = { addCreatedByToReqBody };