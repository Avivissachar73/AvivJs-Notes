
export const El = (() => {
  // This function gets HTML string as an input and returns its HTML element type (h1 / div / td ...); 
  function getElType(template) {
      if (!(template[0] === '<' && template[template.length-1] === '>')) return '';
      if (template[1] === '/') return template.split('/')[1].split(' ')[0].split('>')[0];
      else return template.split('<')[1].split(' ')[0].split('>')[0].split('/')[0];
  }
  // This function creates an HTML element using given params;
  return (template = '') => {
      template = template.trim();
      let parentType = 'div';
      const elType = getElType(template);
      if (elType === 'tr') parentType = 'table';
      else if (elType === 'td') parentType = 'tr';
      const parent = document.createElement(parentType);
      parent.innerHTML = template;
      const el = parent.firstChild;
      return el;
  }
})();

// this function gets object and a callback, and makes the object reactive. whenever a parameter in the object changes, the cb runs;
export const watchOnObj = (obj, cb, basePath = '') => {
  if (!obj || typeof(obj) !== 'object') return;
  let keys = Object.keys(obj);
  let isToCall = false;
  for (let key of keys) {
      let path = basePath + (basePath.length ? `.${key}` : key);
      if (!isNaN(+key)) key = +key; 
      let initialVal = obj[key];
      let fieldName = key;
      Object.defineProperty(obj, key, {
          set: function(val) {
              let oldVal = key;
              key = val;
              if (isToCall) cb(val, oldVal, path);
              watchOnObj(val, cb, path);
          },
          get: function() {
              return key;
          }
      });
      obj[fieldName] = initialVal;
      if (typeof(obj[fieldName]) === 'object' && !Array.isArray(obj[fieldName]) && obj[fieldName]) watchOnObj(obj[fieldName], cb, path);
  }
  isToCall = true;
  return obj;
}



// UNIT TESTING
function unitTesting() {
  // console.log('Utils Unit testing::');
  // console.log('######')
  // console.log('Testing "El" function:', El('<h1>Hello world!</h1>'));
  // console.log('######')




  console.log('Testing "watchOnObj" function:');
  const person = { name: 'Aviv', age: 23, adress: { city: 'Jerusalem' } };
  const cb = (newVal, oldVal, pathInPerson) => {
    console.log('person changed at:', pathInPerson, '|', 'old value:', oldVal, '|', 'new value:', newVal);
  }
  watchOnObj(person, cb);
  person.age = 24;
  person.adress.city = 'Tel Aviv';
  person.adress = null;
}
unitTesting();