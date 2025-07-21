const { createNamespace } = require('cls-hooked');

const namespace = createNamespace('namespace');

function addExpressReqToContextMiddleware(req, res, next) {
  namespace.run(() => {
    namespace.set('expressReq', req);
    next();
  });
}

function getExpressReqFromContext() {
  const expressReq = namespace.get('expressReq');
  return expressReq;
}

function getRelevantConfigByContextRequest(configItems = [{routes: ['/', '/example'], appNames: ['example']}]) {
  const expressRequestObject = getExpressReqFromContext();
  if (!expressRequestObject) return null;
  const subDomain = getServerSubDomain();
  const relevantConfig = configItems.find(c => 
    c.routes?.includes(subDomain) || 
    c.routes?.includes(subDomain.substring(0, subDomain.length-1)) ||
    c.appNames?.includes(expressRequestObject.params.appName)
  );
  return relevantConfig;
}

function getServerSubDomain() {
  const expressRequestObject = getExpressReqFromContext();
  if (!expressRequestObject) return '';
  const domain = expressRequestObject.get('host') || '';
  const referrer = expressRequestObject.get('Referrer') || '';
  const headerSubDomain = expressRequestObject.get('client-subdomain');
  return headerSubDomain ? `/${headerSubDomain}` : (referrer?.split(domain)[1] || '');;
}

module.exports = {
  addExpressReqToContextMiddleware,
  getExpressReqFromContext,
  getRelevantConfigByContextRequest,
  getServerSubDomain
}