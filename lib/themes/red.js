import { elementService } from "../element.service.js";

export default {
  name: 'red',
  colors: [
    'rgb(252, 47, 47)',
    '#fff',
    'white',
    'rgb(252, 47, 47)',
    'rgb(252, 47, 47)'
  ],
  fonts: [],
  css: elementService.dataToCss('', {
    '.logo': {
      color: 'inherit'
    }
  }, true)
}