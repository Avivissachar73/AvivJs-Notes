const { createError, noop } = require('../services/globalServices/utils.service.js');

const CODE = 666; // God sleeps in shabat so Satan handles the error;

function keepShabat(req, res, next) {
  noop(req);
  const isShabat = new Date().getDay() === 6;
  if (isShabat) return res.status(CODE).send(createError('shabesError', CODE, 'Shabes!'));
  next();
}

module.exports = { keepShabat };

/**
 * TODO:
 * - make sure middleware tests not only 00:00 - 00:00, but real shabat time;
 * - make sure shabat time is according to user timezone and not server timezone;
 * - write dontPayTaxes middleware;
 * - make sure server is not familiar with the existence of math, 
 *   science and housing crisis in Israel;
 */