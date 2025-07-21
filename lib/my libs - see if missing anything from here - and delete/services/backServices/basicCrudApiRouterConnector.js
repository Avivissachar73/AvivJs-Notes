const express = require('express');

const dbService = require('./db.service');
const { validateType } = require('./interface.service');

const BasicService = (dbCol, searchFields = [], scheme) => ({
  add(item) {
    if (scheme) validateType(releaseScheme, item, true);
    return dbService.getServiceByExpressReq().add(dbCol, item);
  },
  update(item) {
    if (scheme) validateType(releaseScheme, item, true);
    return dbService.getServiceByExpressReq().update(dbCol, item);
  },
  remove(itemId) {
    return dbService.getServiceByExpressReq().remove(dbCol, itemId);
  },
  get(itemId) {
    return dbService.getServiceByExpressReq().get(dbCol, itemId);
  },
  query(filterBy) {
    const criteria = dbService.buildBasicSearchFilterBy(filterBy.filter, searchFields)
    // let sort = { ...filterBy.sort };
    // if (filterBy.simpleSort) sort[filterBy.simpleSort] = 1;
    const sort = dbService.buildSimpleSortObject(filterBy.sort, filterBy.simpleSort);
    return dbService.getServiceByExpressReq().query(dbCol, criteria, sort, filterBy.pagination);
  }
});


const _errMsg = require('./utils.service').getCreateErrMsg('basicBasicCrudApiRouterConnector');
const { fixDeepQuery, createError } = require('./utils.service');
const { validateCreatorOrAdmin } = require('./userValidation.service');
const { getUserFromExpressReq } = require('../api/auth/user.session.service');

const BasicController = (dbCol = '', searchFields = [], scheme, strictActions = false, service) => {
  if (!service) service = BasicService(dbCol, searchFields, scheme);
  return {
    async add(req, res, next) {
      try {
        const addedItem = await service.add(req.body);
        res.send(addedItem);
      } catch(err) {
        next({msg: _errMsg(`Couldn't add item | module:: ${dbCol}`, 'add', err), err});
      }
    },
    async update(req, res, next) {
      try {
        
        const id = req.body._id;
        if (strictActions) {
          const item = await service.get(id);
          if (!validateCreatorOrAdmin(item, getUserFromExpressReq(req))) return res.status(401).send(createError('unauthorized', 401, 'Unauthorized'));
        }
        
        const updatedItem = await service.update(req.body);
        res.send(updatedItem);
      } catch(err) {
        next({msg: _errMsg(`Couldn't update item | module:: ${dbCol}`, 'update', err), err});
      }
    },
    async remove(req, res, next) {
      try {
        const id = req.params.id;
    
        if (strictActions) {
          const item = await service.get(id);
          if (!validateCreatorOrAdmin(item, getUserFromExpressReq(req))) return res.status(401).send(createError('unauthorized', 401, 'Unauthorized'));
        }
    
        await service.remove(id);
        res.send({msg: `removed item with id: ${id}`});
      } catch(err) {
        next({msg: _errMsg(`Couldn't remove item | module:: ${dbCol}`, 'remove', err), err});
      }
    },
    async get(req, res, next) {
      try {
        const id = req.params.id;
        const item = await service.get(id);
        res.send(item);
      } catch(err) {
        next({msg: _errMsg(`Couldn't get item | module:: ${dbCol}`, 'get', err), err});
      }
    },
    async query(req, res, next) {
      try {
        const items = await service.query(fixDeepQuery(req.query), req.params.organizationId);
        res.send(items);
      } catch(err) {
        next({msg: _errMsg(`Couldn't query items | module:: ${dbCol}`, 'query', err), err});
      }
    }
  }
}

const BasicCrudApiRouter = (path = '', middlewares = [], useDefaultRoutes = true, extraRoutes = [/* {on: '', path: '', do: []} */], controller, dbCol = '', searchFields = [], scheme, strictActions = false) => {
  if (!controller) controller = BasicController(dbCol, searchFields, scheme, strictActions);
  
  const router = express.Router({ mergeParams: true });
  // const baseUrl = `${rootBaseUrl}/${path}`;
  middlewares.forEach(m => router.use(m));

  extraRoutes.forEach(r => router[r.on.toLowerCase()](r.path, ...r.do));

  // default routes::
  if (useDefaultRoutes) {
    router.get('/', controller.query);
    router.get('/:id', controller.get);
    router.post('/', controller.add);
    router.put('/', controller.update);
    router.delete('/:id', controller.remove);
  }
  
  return router;
}

const BasicCrudApiRouterConnector = (path = '', middlewares = [], useDefaultRoutes = true, extraRoutes = [/* {on: '', path: '', do: []} */], controller, dbCol = '', searchFields = [], scheme, strictActions = false) => {
  // if (!controller) controller = BasicController(dbCol, searchFields, scheme, strictActions);
  return (server, rootBaseUrl) => {
    // const router = express.Router({ mergeParams: true });
    // middlewares.forEach(m => router.use(m));
    
    // extraRoutes.forEach(r => router[r.on.toLowerCase()](r.path, ...r.do));
    
    // // default routes::
    // router.get('/', controller.query);
    // router.get('/:id', controller.get);
    // router.post('/', controller.add);
    // router.put('/', controller.update);
    // router.delete('/:id', controller.remove);

    const router = BasicCrudApiRouter(path, middlewares, useDefaultRoutes, extraRoutes, controller, dbCol, searchFields, scheme, strictActions);
    
    const baseUrl = `${rootBaseUrl}/${path}`;
    server.use(baseUrl, router);
    return router;
  }
}


const BasicModule = (dbCol = '', searchFields = [], scheme, strictActions = false, path, useDefaultRoutes, routerMiddlewares) => {
  const service = BasicService(dbCol, searchFields, scheme);
  const controller = BasicController(dbCol, searchFields, scheme, strictActions, service);
  const _funcConnectedRoutes = [];
  // const routesConnector = (path = '', routerMiddlewares = [], extraRoutes = []) => BasicCrudApiRouterConnector(path, routerMiddlewares, [..._funcConnectedRoutes ,...extraRoutes], controller);
  const routesConnector = BasicCrudApiRouterConnector(path, routerMiddlewares, useDefaultRoutes, _funcConnectedRoutes, controller);
  
  dbService.getService().createIndexes(dbCol, searchFields);
  // // (async () => {
  //   // const col = await dbService.getService().getCollection(dbCol);
  //   // await col.createIndexes(searchFields.map(c => ({[c]:1})));
  // // })();
  
  return {
    service,
    controller,
    routesConnector,
    makeRasicRouterConnector: (path, routerMiddlewares, useDefaultRoutes, extraRoutes) => BasicCrudApiRouterConnector(path, routerMiddlewares, useDefaultRoutes, extraRoutes, controller),
    ...(['get', 'post', 'put', 'delete', 'patch'].reduce((acc, key) => {
      return { ...acc, [key]: (_path, ..._middlwares) => _funcConnectedRoutes.push({on: key, path: _path, do: _middlwares}) }
    }, {}))
  };
}

module.exports = { 
  BasicService,
  BasicController,
  BasicCrudApiRouterConnector,
  BasicModule
 };