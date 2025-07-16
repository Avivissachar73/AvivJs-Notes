// The role of this file is to gather all the outsource libs of the game modules together, so it will be eas to be moved from project to project;

import { Utils as _Utils } from '../../../../../lib/utils.service.js';
import { EventEmiter as _EventEmiter } from '../../../../../lib/EventEmiter.js';
// import _A_Alert from '../../../../../lib/Alert.js';
import { alertService } from '../../../../../lib/Alert.js';
import { elementService as _elementService } from '../../../../../lib/element.service.js';
import { getBaseCssAndHelpers as _getBaseCssAndHelpers } from '../../../../../lib/getBaseCss.function.js';
import { Intervaler as _Intervaler } from '../../../../../lib/Intervaler.js';
import { Timer as _Timer } from '../../../../../lib/Timer.js';

export const Utils = _Utils;
export const EventEmiter = _EventEmiter;
export const A_Alert = alertService.A_Alert;
export const elementService = _elementService;
export const getBaseCssAndHelpers = _getBaseCssAndHelpers;
export const Intervaler = _Intervaler;
export const Timer = _Timer;