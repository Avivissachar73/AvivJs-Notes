const loggerService = require('../services/logger.service');
jest.mock('../services/logger.service');

loggerService.info.mockResolvedValue(true);
loggerService.debug.mockResolvedValue(true);
loggerService.error.mockResolvedValue(true);
loggerService.warn.mockResolvedValue(true);