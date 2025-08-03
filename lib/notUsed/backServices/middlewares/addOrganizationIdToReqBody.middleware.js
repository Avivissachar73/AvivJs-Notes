const { noop } = require('../services/globalServices/utils.service.js');

function addOrganizationIdToReqBody(req, res, next) {
  noop(res);
  req.body._organizationId = req.params.organizationId;
  next();
}

module.exports = { addOrganizationIdToReqBody };