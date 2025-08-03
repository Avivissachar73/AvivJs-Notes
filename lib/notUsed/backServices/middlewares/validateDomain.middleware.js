const { createError } = require('../services/globalServices/utils.service.js');

const config = require('../config');
const loggerService = require('../api/logger/logger.service.js');
async function validateDomain(req, res, next) { 
  const endIt = () => res.status(400).send(createError('auth.unauthorized', 401, 'Unauthorized'));
  try {
    const domain = req.get('host');
    loggerService.info('DomainValidation', 'Domain: ' + domain);
    const verifiedDomain = config.authorizedDomaines.find(dom => dom.toLowerCase().includes(domain.toLowerCase()))
    if (!verifiedDomain) return endIt();
    next();
  } catch(err) {
    endIt();
  }
}

module.exports = { 
  validateDomain
};