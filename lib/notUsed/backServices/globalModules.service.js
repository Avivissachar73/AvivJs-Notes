

// to avoid circular dipendency, all files can register here, and be fetched from here.
// this file imports none, so no worries about circular dependency anymore;
// USAGE EXAMPLE:: // inside distributionService::  registerModule('distributionService', module.exports);

const modules = {};

function registerModule(moduleName, _module) {
  modules[moduleName] = _module;
}

function getModule(moduleName) {
  return modules[moduleName];
}

module.exports = {
  registerModule,
  getModule
}