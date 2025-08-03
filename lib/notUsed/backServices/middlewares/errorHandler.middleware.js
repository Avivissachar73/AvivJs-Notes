const { getMiniUserFromExpressReq } = require('../api/auth/user.session.service.js');
const loggerService = require('../api/logger/logger.service.js');
const { createError } = require('../services/globalServices/utils.service.js');

const errorHandlerMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  loggerService.error(
    'Error handler middleware error',
    `ERROR ${status}: ${err.msg || err.message} | ${err.err?.stack?.toString?.() || ''}`,
    { 
      err,
      ...loggerService.getExpressReqRelevantDataForLog(req)
      // requestData: {
      //   path: req.path,
      //   query: {...req.query},
      //   params: {...req.params},
      //   refferer: req.get('Referrer'),
      //   originalUrl: req.originalUrl
      // }
    },
    getMiniUserFromExpressReq(req)
  );
  
  res.status(status).json(createError('internalServerError', status, 'Internal server error'));
}

module.exports = { errorHandlerMiddleware };