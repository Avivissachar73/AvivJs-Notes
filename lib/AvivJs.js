'use strict';

// export const AvivJs = (() => {
window.AvivJs = (() => {
    
    //////////////////// CONSTANTS ////////////////////
    //////////////////// CONSTANTS ////////////////////
    //////////////////// CONSTANTS ////////////////////
    //////////////////// CONSTANTS ////////////////////
    //////////////////// CONSTANTS ////////////////////

    const ElIdAtrrName = 'elid';
    const KeyAttrName = 'key';

    const IfAtrr = 'A-if';
    const ForAtrr = 'A-for';
    const DataBindAtrr = 'A-model';
    const SavedAttrs = [IfAtrr, ForAtrr, DataBindAtrr];

    const StartVarScope = '{{';
    const FinishVarScope = '}}';

    const RouterViewName = 'RouterView';
    
    const NoneTemplateType = 'none';
    const emptyTypeTemplateType = 'template';


    // Component props;            // 'CPN' stands for 'component prop name';

    /**
     * @typedef {{
     * name: String,
     * template: String,
     * render: Function,
     * state: {Object | Function():Object },
     * getters: {{Function}},
     * props: String[],
     * methods: {{Function}},
     * onCreated: Function,
     * onDestroyed: Function,
     * onMounted: Function,
     * onRender: Function,
     * watch: {{Function}},
     * components: Object,
     * store: StoreType,
     * routes: RoutesType
     * }} Component;
     */

    const StateCPN = 'state';
    const GettersCPN = 'getters';
    const PropsCPN = 'props';
    // const GetPropsCPN = 'props';
    const MethodsCPN = 'methods';
    const OnCreatedCPN = 'onCreated';
    const OnDestroyedCPN = 'onDestroyed';
    const OnMountedCPN = 'onMounted';
    const OnRenderCPN = 'onRender';
    const WatchCPN = 'watch';
    const NameCPN = 'name';
    const ComponentsCPN = 'components';
    const TemplateCPN = 'template';
    const RenderCPN = 'render';
    const StoreCPN = 'store';
    const RoutesCPN = 'routes';

    // generatedCmp props;
    const isCreatedCPN = '__isCreated';
    const idCPN = '__id';
    const GeneratedTemplateTreeCPN = '__generatedTree';
    const InitTemplateTreeCPN = '__initTemplateTree';
    const GeneratedChildCmpsCPN = '__children';
    const GeneratedElementCPN = 'element';
    const ContextCPN = 'context';
    const RootPropsCPN = '__rootProps';
    const IsDestroyedCPN = '__isDestroyed'
    const IsInitedCPN = '__isInit';

    // context prop names; // 'CoPN' stands for 'context prop name';
    const RefsCoPN = 'refs';
    const emitCoPN = 'emit';
    const storeCoPN = 'store';
    const routerCoPN = 'router';

    /**
     * @typedef {{
     *  refs: object,
     *  emit: function
     *  store: object,
     *  router: object;
     * }} CmpContext;
     */

    const GeneratedTemplateCPN = '__generatedTemplate';

    
    const SavedCmpPropNames = [
        StateCPN,GettersCPN,PropsCPN,MethodsCPN,OnCreatedCPN,OnDestroyedCPN,WatchCPN,NameCPN,
        ComponentsCPN,TemplateCPN,RenderCPN,OnMountedCPN,OnRenderCPN,StoreCPN
        
    ];
    const SavedCmpGPropNames = [
        isCreatedCPN,idCPN,GeneratedTemplateTreeCPN,InitTemplateTreeCPN,GeneratedChildCmpsCPN,GeneratedElementCPN,
        ContextCPN,GeneratedTemplateCPN,RootPropsCPN,IsDestroyedCPN
    ];
    const AllSavedCmpPropNames = SavedCmpPropNames.concat(SavedCmpGPropNames);

    /**
     * @typedef {{
     *  type: string,
     *  attributes: object
     *  children: object[],
     *  vars: object,
     *  events: object,
     *  element: HTMLElement,
     * }} TemplateTree
     */


    // RootProps props // 'RPN' stands for 'rootProps prop name';
    const propsRPN = 'props';
    const eventsRPN = 'events';
    // const storeRPN = 'store';
    /**
     * @typedef {{
     *  props: object,
     *  events: object
     *  store: object,
     *  content: object[],
     * }} RootProps
     */

    // class GeneratedCmpObj {
    //     constructor(cmp = {}, isExist = true) {
    //         this.cmp = cmp;
    //         this.isExist = isExist;
    //     }
    // }
    /**
     * @typedef {{
     *  cmp: object,
     *  isExist: object
     * }} GeneratedCmpObj
     */


    //////////////////// UTILS ////////////////////
    //////////////////// UTILS ////////////////////
    //////////////////// UTILS ////////////////////
    //////////////////// UTILS ////////////////////
    //////////////////// UTILS ////////////////////

    const Utils = {
        getRandomInt(num1, num2) {
            var max = (num1 >= num2)? num1+1 : num2+1;
            var min = (num1 <= num2)? num1 : num2;
            return (Math.floor(Math.random()*(max - min)) + min);
        },
        getRandomId() {
            var pt1 = Date.now().toString(16);
            var pt2 = Utils.getRandomInt(1000, 9999).toString(16);
            var pt3 = Utils.getRandomInt(1000, 9999).toString(16);
            return `_${pt3}${pt1}${pt2}`.toUpperCase();
        },
        watchOnObj(obj, cb, basePath = '', ignoreFilds = [], isDeep = true, debug) {
            if (!obj || typeof(obj) !== 'object') return;
            if (Array.isArray(obj)) return;
            let keys = Object.keys(obj);
            let isToCall = false;
            for (let key of keys) {
                let path = basePath + (basePath.length ? `.${key}` : key);
                if (ignoreFilds.includes(path)) continue;
                const _key = key;
                if (!isNaN(+key)) key = +key; 
                let initialVal = obj[key];
                let fieldName = key;
                Object.defineProperty(obj, key, {
                    set: function(val) {
                        let oldVal = key;
                        key = val;
                        if (isToCall) cb(val, oldVal, path);
                        Utils.watchOnObj(val, cb, path, ignoreFilds, isDeep);
                    },
                    get: function() {
                        return key;
                    }
                });
                obj[fieldName] = initialVal;
                if (!isDeep) continue;
                Utils.watchOnObj(obj[fieldName], cb, path, ignoreFilds, isDeep);
                // if ((typeof(obj[fieldName]) === 'object') && !Array.isArray(obj[fieldName]) && obj[fieldName]) Utils.watchOnObj(obj[fieldName], cb, path, ignoreFilds, isDeep);
                // if (typeof(obj[fieldName]) === 'object') Utils.watchOnObj(obj[fieldName], cb, path, ignoreFilds, isDeep);
                // if (typeof(obj[fieldName]) === 'object' && obj[fieldName]) watchOnObj(obj[fieldName], cb, path, ignoreFilds, isDeep);
            }
            isToCall = true;
        },
        stringToLowerKabab(str) {
            const letterMap = {
                'a': 'A',
                'b': 'B',
                'c': 'C',
                'd': 'D',
                'e': 'E',
                'f': 'F',
                'g': 'G',
                'h': 'H',
                'i': 'I',
                'j': 'J',
                'k': 'K',
                'l': 'L',
                'm': 'M',
                'n': 'N',
                'o': 'O',
                'p': 'P',
                'q': 'Q',
                'r': 'R',
                's': 'S',
                't': 'T',
                'u': 'U',
                'v': 'V',
                'w': 'W',
                'x': 'X',
                'y': 'Y',
                'z': 'Z',
            }
            const capitals = Object.values(letterMap);
            let fixedStr = '';
            for (let i = 0; i < str.length; i++) {
                let curr = str[i];
                let lowerCurr = curr.toLowerCase();
                if (capitals.includes(curr)) {
                    if (i === 0) fixedStr += lowerCurr;
                    if (str[i-1] && (str[i-1] !== ' ')) fixedStr += `-${lowerCurr}`;
                } else fixedStr += lowerCurr;
            }
            return fixedStr;
        },
        getDeepVal(obj, field) {
            const splited = field.split('.');
            let val = obj;
            for (const curr of splited) {
              if (!val[curr]) {
                val = null;
                break;
              } else val = val[curr];
            }
            return val;
        },
        createStyleEl(selector = '', style = {}) {
            let styleStr = `${selector} {`;
            let nestedStyle = ''
            for (let key in style) {
                const val = style[key];
                if (typeof val === 'object') {
                    if (key[0] === '@') {
                        nestedStyle += `${key}{\n\t${Utils.createStyleEl(selector, val)}\n}`
                    } else {
                        key.split(',').forEach(c => {
                            c = c.trim();
                            let nestedSelector = selector;
                            if (c[0] === '&') nestedSelector += c.slice(1);
                            else nestedSelector += ` ${c}`;
                            nestedStyle += Utils.createStyleEl(nestedSelector, val);
                        });
                    }
                }
                else styleStr += `\n\t${Utils.stringToLowerKabab(key)}: ${val};`;
            }
            styleStr += '\n}\n';
            styleStr += nestedStyle;
            return styleStr;
        }
    };
    
    function createError(cmp, msg) {
        let name = (cmp && cmp[NameCPN])? cmp[NameCPN] : 'Anonymus'; 
        throw new Error(`${msg} \n At: <${name}/>`);
    }

    function findIdx(list, cb) {
        for (let i = 0; i < list.length; i++) {
            if (cb(list[i], i, list)) return i;
        }
        return -1;
    }

    //////////////////// SERVICES ////////////////////
    //////////////////// SERVICES ////////////////////
    //////////////////// SERVICES ////////////////////
    //////////////////// SERVICES ////////////////////
    //////////////////// SERVICES ////////////////////

    
    const ComponentService = (() => {
        const HtmlNativeElements = ['h1','h2','h3','h4','h5','h6','p','div','section','main','header','footer','nav','ul','li','table','tbody','thead','tfoot','th','td','tr','title','head','body','html','script','style','marquee','center','strong','small','input','textarea','label','a','select','option','button','form','hr','br','audio','iframe','img','media','aside','b','u','i','canvas','link','ol','pre','span','svg'];
        const CmpUtils = {
            // returns data from script string using given cmp data;
            getDataFromScriptStr(cmp, dataStr, vars = {}) {
                var allVars_AvivJs_SomeLongNameSoNoOneWillDeclareVarInThatName = {...cmp, ...vars};
                var varsStr = '';
                for (let key in allVars_AvivJs_SomeLongNameSoNoOneWillDeclareVarInThatName) {
                    varsStr += `var ${key} = allVars_AvivJs_SomeLongNameSoNoOneWillDeclareVarInThatName.${key};\n`;
                }
                try {
                    return eval(`(function(){${varsStr} return (${dataStr})})()`);
                } catch(err) {
                    createError(cmp, err.message);
                }
            },
            // returns the type of a given html element string expretion;
            getElType(template) {
                if (template[0] === '<' && template[template.length-1] === '>') {
                    if (template[1] === '/') {
                        return template.split('/')[1].split(' ')[0].split('>')[0];
                    } 
                    else {
                        return template.split('<')[1].split(' ')[0].split('>')[0].split('/')[0];
                    }
                } else return;
            },
            // gets an empty templateTree object;
            getEmptyTemplateTree() {
                /** @type {TemplateTree} */
                const emptyTTree = {
                    type: '',
                    attributes: {},
                    children: [],
                    element: null,
                    events: {},
                    vars: {}
                };
                return emptyTTree;
            },
            // creates template tree from template string;
            createTemplateTree: (() => {
                function _getSplitedTemplate(template) {
                    const openTag = '<';
                    const closingTag = '>';
                    var splitted = [];
                    var openTagIdx = -1;
                    var closingTagIdx = -1;
                    
                    for (let i = 0; i < template.length; i++) {
                        let curr = template[i];
                        if (curr === openTag && openTagIdx === -1) openTagIdx = i;
                        else if (curr === closingTag && closingTagIdx === -1) closingTagIdx = i;
                        
                        if (closingTagIdx > -1 && openTagIdx > -1) {
                            if (closingTagIdx > openTagIdx) {
                                splitted.push(template.slice(openTagIdx, closingTagIdx+1));
                                openTagIdx = -1;
                            }
                            else if (openTagIdx > closingTagIdx) {
                                splitted.push(template.slice(closingTagIdx+1, openTagIdx));
                                closingTagIdx = -1;
                            }
                        }; 
                    }
                    return splitted;
                }
                function _getIsTemplatePartStr(template) {
                    return (template[0] === '<' && template[template.length-1] === '>');
                }
                function _checkIfCloseTag(template, isSelf) {
                    return isSelf? (template.substring(template.length-2) === '/>') :
                                   (template.substring(0,2) === '</');
                }
            
                function _getFulSplitedlEl(splitedTemplate, elIdx = 0, cmp) {
                    if (!_getIsTemplatePartStr(splitedTemplate[elIdx])) return [splitedTemplate[elIdx]];

                    let elName = CmpUtils.getElType(splitedTemplate[elIdx]);
                    if (_checkIfCloseTag(splitedTemplate[elIdx], true)) return [splitedTemplate[elIdx]];
                    else {
                        let openCount = 1;
                        let closeCount = 0;
                        for (let i = elIdx+1; i < splitedTemplate.length; i++) {
                            let currPart = splitedTemplate[i];
                            if (!_getIsTemplatePartStr(currPart)) continue;
                            
                            let currElName = CmpUtils.getElType(currPart);
                            if (currElName === elName) {
                                if (_checkIfCloseTag(currPart, true)) {
                                    closeCount++;
                                    openCount++;
                                }
                                else if (_checkIfCloseTag(currPart, false)) closeCount++;
                                else openCount++;

                                if (openCount === closeCount) return splitedTemplate.slice(elIdx, i+1);
                            }
                        }
                        createError(cmp,`<${elName}> has no matching end tag`);
                    }
                }
                function _getAttrs(templatePart) {
                    var attrs = {};
            
                    var firstIdx = -1;
                    var secondIdx = -1;
            
                    var currVal = '';
                    var currKey = '';
            
                    for (let i = templatePart.length-1; i >= 0; i--) {
                        let curr = templatePart[i];
            
                        if (curr === '"') {
                            if (firstIdx === -1 && secondIdx === -1) firstIdx = i;
                            else if (firstIdx > -1 && secondIdx === -1) {
                                secondIdx = i;
                                currVal = templatePart.slice(secondIdx+1, firstIdx);
                                firstIdx = -1;
                            }
                        }
                        else if (curr === ' ' && firstIdx === -1 && secondIdx > -1) {
                            currKey = templatePart.slice(i+1, secondIdx-1);
                            attrs[currKey] = currVal;
                            currVal = '';
                            currKey = '';
                            secondIdx = -1;
                        }
                    }
            
                    return attrs;
                }

                function _cleanCommentsFromHTML(template) {
                    const COMMENT_START_STR = `<!--`;
                    const COMMENT_END_STR = `-->`;
                    let startIdx = -1;
                    let res = ``;
                    for (let i = 0; i < template.length; i++) {
                        if (template.substring(i, i + COMMENT_START_STR.length) === COMMENT_START_STR) {
                            startIdx = i;
                            i = i + COMMENT_START_STR.length;
                        } else if (startIdx >= 0) {
                            if (template.substring(i, i + COMMENT_END_STR.length) === COMMENT_END_STR) {
                                startIdx = -1;
                                i = i + COMMENT_END_STR.length;
                            }
                        } else if (startIdx === -1) res += template.charAt(i);
                    }
                    return res;
                }

                return function createTemplateTree(template, itarateFunc = undefined, cmp) {
                    // const ElIdAtrrName = 'elid';
                    template = _cleanCommentsFromHTML(template);
                    var splitted = _getSplitedTemplate(template);
                
                    /** @type {TemplateTree} */
                    var templateTree = {
                        type: CmpUtils.getElType(splitted[0]),
                        attributes: _getAttrs(splitted[0]),
                        children: [],
                        // vars: {},
                        // events: {},
                        // element: null
                    }
                    if (templateTree.attributes[ElIdAtrrName]) createError(cmp, `${ElIdAtrrName} is a saved attribute`);
                    else templateTree.attributes[ElIdAtrrName] = Utils.getRandomId();
                    
                    var splittedContent = splitted.slice(1, splitted.length-1);
                    for (let i = 0; i < splittedContent.length; i++) {
                        let curr = splittedContent[i];
                        if (_getIsTemplatePartStr(curr)) {
                            let currSplitted = _getFulSplitedlEl(splittedContent, i, cmp);
                            let child = createTemplateTree(currSplitted.join(''), itarateFunc, cmp)
                            // if (child === ErrorStr) return ErrorStr;
                            templateTree.children.push(child);
                            i += currSplitted.length-1;
                        }
                        else templateTree.children.push(curr);
                    }
                
                    if (itarateFunc) templateTree = (itarateFunc(templateTree) || templateTree);
                    
                    return templateTree;
                }
            })(),
            /**
             * // creates template string from template tree;
             * @param {TemplateTree} tTree 
             * @returns 
             */
            buildTemplateFromTree: function(tTree) {
                if (typeof(tTree) === 'string') return tTree;
                if (tTree.type === NoneTemplateType) return '';
            
                var attrsJSON = tTree.attributes && Object.keys(tTree.attributes).length ? JSON.stringify(tTree.attributes) : '';
                var AttrsStr = attrsJSON ? attrsJSON.substring(2, attrsJSON.length-2).split('":"').join('="').split('","').join('" ')+'"' : '';
                var childrenStr = tTree.children.map(curr => buildTemplateFromTree(curr)).join('');
                
                if (tTree.type === emptyTypeTemplateType) return childrenStr;
                else return `<${tTree.type || 'span'}${AttrsStr? ' '+AttrsStr : ''}>${childrenStr}</${tTree.type || 'span'}>`;
            },
            // gets the unic cmp ref name
            getCmpRefAtrrName: (cmp) => {
                return `ref_${cmp.name}_${cmp.id}`;
            }
        };
        const directives = {
            /**
             * // inner template A-if conditions
             * @param {TemplateTree} component 
             * @param {*} tTree 
             * @returns 
             */
            inlineConditions(component, tTree) {
                if (!tTree.attributes || !tTree.attributes[IfAtrr]) return tTree;
                var conditionStr = tTree.attributes[IfAtrr];
                var conditionVal = CmpUtils.getDataFromScriptStr(component, conditionStr, tTree.vars);
                if (!conditionVal) {
                    tTree.type = NoneTemplateType;
                    tTree.children = [];
                }
                delete tTree.attributes[IfAtrr];
                return tTree;
            },
            // inner template A-for loops
            inlineLoops: (() => {
                /**
                 * 
                 * @param {TemplateTree} tTree 
                 * @param {String} idEndPoint 
                 * @param {Object} vars 
                 * @param {*} searchVal 
                 * @param {*} replaceVal 
                 */
                function _updateTreeContent(tTree, idEndPoint, vars, searchVal, replaceVal) {
                    // const SavedAttrs = ['A-if', 'A-model', 'A-for'];
                    tTree.vars = {...tTree.vars, ...vars};                
                    tTree.attributes[ElIdAtrrName] += idEndPoint;
                
                    if (tTree.children) {
                        for (let i = 0; i < tTree.children.length; i++) {
                            let child = tTree.children[i];
                            if (typeof(child) === ('object')) _updateTreeContent(child, idEndPoint, vars, searchVal, replaceVal);
                        }
                    }
                }
            
                /**
                 * 
                 * @param {Object} component 
                 * @param {TemplateTree} tTree 
                 * @returns 
                 */
                function BindCmpList(component, tTree) {
                    // A-for="item,idx in items";
                    if (!tTree.attributes || !tTree.attributes[ForAtrr]) return tTree;
                
                    const loopCmd = tTree.attributes[ForAtrr];
                    const splittedCmd = loopCmd.split(' ').filter(curr => curr);
                
                    const [itemName, indexName] = splittedCmd[0].split(',');
                    let arrName = splittedCmd[splittedCmd.length-1];
                    
                    let arrData = [];
                    if (!isNaN(+arrName)) { // if the arrName is a number (A-for="i in 5");
                        arrName = +arrName;
                        for (let j = 1; j <= arrName; j++) arrData.push(j);
                    } else {
                        arrData = CmpUtils.getDataFromScriptStr(component, arrName, tTree.vars);
                    }
                    
                    var newChildren = [];
                    
                    /**
                     * @param {TemplateTree} childKey 
                     */
                    function _addChild(childKey) {
                        let newChild = JSON.parse(JSON.stringify(tTree));
                        let idEndPoint = `_${childKey}`;
                        let vars = {
                            [itemName]: arrData[childKey],
                            [indexName]: childKey
                        }
                        _updateTreeContent(newChild, idEndPoint, vars);
                        delete(newChild.attributes[ForAtrr]);
                        newChildren.push(newChild);
                    }
    
                    if (Array.isArray(arrData) || typeof(arrData) === 'string') {
                        for (let i = 0; i < arrData.length; i++) {
                            _addChild(i);
                        }
                    } else if (typeof(arrData) === 'object') {
                        for (let key in arrData) {
                            _addChild(key);
                        }
                    }

                    // tTree.type = emptyTypeTemplateType;
                    // tTree.children = newChildren;
                    // return tTree;

                    /** @type {TemplateTree} */
                    const res = {
                        type: emptyTypeTemplateType,
                        children: newChildren
                    }

                    return res;
                }
                return BindCmpList;
            })(),
            /**
             * // inner template A-model handling
             * @param {Object} component 
             * @param {TEmplateTree} tTree 
             * @returns 
             */
            dataBindingAmodel(component, tTree) {
                if (!tTree.attributes || !tTree.attributes[DataBindAtrr]) return tTree;
            
                var modelAttrVal = StateCPN+'.' + tTree.attributes[DataBindAtrr].trim();

                var objsTree;
                var objBindField;
                var parentObjStr; 
                var objBindFieldVal;

                if (modelAttrVal[modelAttrVal.length-1] === ']') {
                    objsTree = modelAttrVal.split('[').map((curr, idx) => idx === 0 ? curr : '['+curr);
                    objBindField = objsTree[objsTree.length-1].substring(1,objsTree[objsTree.length-1].length-1);
                    objsTree.pop();
                    parentObjStr = objsTree.join('');
                    objBindFieldVal = CmpUtils.getDataFromScriptStr(component, objBindField, tTree.vars);
                } else {
                    objsTree = modelAttrVal.split('.');
                    objBindField = objsTree[objsTree.length-1];
                    objsTree.pop();
                    parentObjStr = objsTree.join('.'); 
                }
            
                var parentObj = CmpUtils.getDataFromScriptStr(component, parentObjStr, tTree.vars);

                var actualField = (objBindFieldVal !== undefined)? objBindFieldVal : objBindField;
                var generatedFunc = domEvOrVal => {
                    if (domEvOrVal instanceof Event) parentObj[actualField] = domEvOrVal.target.value;
                    else parentObj[actualField] = domEvOrVal;
                }
                // if (!tTree.attributes.value) tTree.attributes.value = `{{${tTree.attributes[DataBindAtrr]}}}`; 
                if (!tTree.attributes.value) tTree.attributes.value = `${StartVarScope}${tTree.attributes[DataBindAtrr]}${FinishVarScope}`; 
                if (!tTree.events.input) tTree.events.input = [];
                tTree.events.input.push(generatedFunc);
                
                delete tTree.attributes[DataBindAtrr];

                return tTree;
            },
        }
        const CmpGFuncs = {
            
            // slots
            /**
             * 
             * @param {*} cmp 
             * @param {TemplateTree} tTree 
             * @param {*} globalCmps 
             * @param {*} setTreeFunc 
             * @param {*} CompileFunc 
             * @returns 
             */
            bindChildrenCmps(cmp, tTree, globalCmps, setTreeFunc, CompileFunc) {
                const ContentName = 'content';
                const fixName = Utils.stringToLowerKabab;
            
                if (cmp[RootPropsCPN] && cmp[RootPropsCPN][ContentName] && tTree.type === ContentName) {
                    tTree.type = emptyTypeTemplateType;
                    tTree.children = cmp[RootPropsCPN][ContentName];
                    return;
                }
                
                var cmps = { ...globalCmps, ...cmp[ComponentsCPN]};
                var cmpKey = Object.keys(cmps).find(curr => fixName(curr) === fixName(tTree.type));
                if (!cmpKey) {
                    if (![...HtmlNativeElements, NoneTemplateType, TemplateCPN, fixName(RouterViewName)].includes(fixName(tTree.type))) createError(cmp, `Unknown costume element ${tTree.type}`);
                    return;
                }
                
                var fixedCmpKey = fixName(cmpKey);
                
                /**@type {RootProps} */
                var props = {
                    [propsRPN]: tTree.attributes, 
                    [eventsRPN]: tTree.events, 
                    [StoreCPN]: cmp[StoreCPN] || cmp[RootPropsCPN][StoreCPN], 
                    // [RouterViewName]: cmp[RootPropsCPN][RouterViewName],
                    [ContentName]: [],
                    i18n: cmp.i18n || cmp[RootPropsCPN].i18n

                };
            
                if (tTree.children && tTree.children.length) {
                    tTree.children = tTree.children.map(child => {
                        if (typeof(child) === 'object') {
                            child = setTreeFunc(child);
                        }
                        props[ContentName].push(child);
                        return child;
                    });
                }
            
                let genCmp;
            
                let cmpTemplateKey = tTree.attributes[KeyAttrName];
                let cmpGeneratedKey = (fixedCmpKey === fixName(RouterViewName))? RouterViewName : `${cmpKey}_${cmpTemplateKey || tTree.attributes[ElIdAtrrName]}`;
            
                if (cmps[cmpKey].isRouter) {
                    genCmp = CompileFunc(cmps[cmpKey].instance, props);
                }
                else {
                    let cmpToBind = (cmp[GeneratedChildCmpsCPN][cmpGeneratedKey] && typeof(cmp[GeneratedChildCmpsCPN][cmpGeneratedKey].cmp) !== 'string') 
                                                                    ? cmp[GeneratedChildCmpsCPN][cmpGeneratedKey].cmp 
                                                                    : cmps[cmpKey];
                    genCmp = CompileFunc(cmpToBind, props);
                }
                
                let isExist = (typeof(genCmp) === 'string' && genCmp)? true : (!genCmp[IsDestroyedCPN])? true : false;
            
                /**@type {GeneratedCmpObj} */
                cmp[GeneratedChildCmpsCPN][cmpGeneratedKey] = {
                    isExist,
                    cmp: genCmp
                };
                if (genCmp instanceof Element) tTree.element = genCmp;
                else if (isExist) tTree.element = typeof(genCmp) === 'string'? genCmp : genCmp[GeneratedElementCPN];
                else {
                    tTree.element = '';
                }
            },  
            
            /**
             * // inner template events (@click)
             * @param {Component} cmp 
             * @param {TemplateTree} tTree 
             * @returns 
             */
            bindInlineEvents(cmp, tTree) {
                if (!cmp[MethodsCPN]) return cmp;
                if (!cmp[MethodsCPN]) cmp[MethodsCPN] = {};
        
                let {events} = tTree;
                for (let evName in events) {
                    let curr = events[evName];
                    if (typeof(curr) === 'function') continue;
                    let method = CmpUtils.getDataFromScriptStr(cmp, curr.methodName, tTree.vars);
                    const inlineArgs = curr.argsStrs.map(arg => CmpUtils.getDataFromScriptStr(cmp, arg, tTree.vars));
                    let endPoints = curr.endPoints;
        
                    let bindedMethod = (domEvent, ...args) => {
                        if (endPoints.includes('prevent')) domEvent.preventDefault();
                        if (endPoints.includes('stop')) domEvent.stopPropagation();
        
                        method(...[...inlineArgs, ...args], domEvent);
                    }
                    events[evName] = [bindedMethod];
                    // events[evName] = bindedMethod;
                }
            },
            // inner template data interpolation
            handleTemplateInterpolation: (() => {
                // const StartScope = '{{';
                // const FinishScope = '}}';
                const StartScope = StartVarScope;
                const FinishScope = FinishVarScope;
                
                function _transInterpolation(string, component, isPosibleObj, extraVars) {
                    var startScopeIdx = -1;
                    var finishScopeIdx = -1;
                    let singleStartScopeCount = 0;
                    let singleEndScopeCount = 0;
            
                    for (let i = 0; i < string.length; i++) {
                        if (string.substring(i, i+StartScope.length) === StartScope && startScopeIdx === -1) startScopeIdx = i;
                        // else if (string.substring(i, i+FinishScope.length) === FinishScope && finishScopeIdx === -1) finishScopeIdx = i;
                        else if (string.substring(i, i+FinishScope.length) === FinishScope) finishScopeIdx = i;
                    
                        if (string[i] === '{') singleStartScopeCount++;
                        else if (string[i] === '}') singleEndScopeCount++;

                        if (startScopeIdx === -1 || finishScopeIdx === -1)  continue;

                        if (singleStartScopeCount !== singleEndScopeCount) continue;
            
                        let scopedVar = string.substring(startScopeIdx, finishScopeIdx+FinishScope.length);
                        let fullVar = scopedVar.substring(StartScope.length, scopedVar.length-FinishScope.length);
                        let bindedVal = CmpUtils.getDataFromScriptStr(component, fullVar, extraVars);
                        let fixedVal = (bindedVal && typeof(bindedVal) === 'object')? JSON.stringify(bindedVal, null, 2) : bindedVal;
                        
                        if (scopedVar.length === string.length && isPosibleObj) {
                            return bindedVal;
                        } else {
                            string = string.substring(0, startScopeIdx) + ((fixedVal || fixedVal === 0)? fixedVal : '') + string.substring(finishScopeIdx+FinishScope.length);
                            i = startScopeIdx + ((fixedVal || fixedVal === 0)? fixedVal.length : 1);
                    
                            startScopeIdx = -1;
                            finishScopeIdx = -1;

                            singleStartScopeCount = 0;
                            singleEndScopeCount = 0;
                        }
                    }
                    return string;
                }
            
                /**
                 * 
                 * @param {*} component 
                 * @param {TemplateTree} tTree 
                 */
                function handleTemplateInterpolation(component, tTree) {
                
                    tTree.type = _transInterpolation(tTree.type, component, false, tTree.vars);
                
                    for (let key in tTree.attributes) {
                        let curr = tTree.attributes[key];
                        if (typeof(curr) === 'string') tTree.attributes[key] = _transInterpolation(curr, component, true, tTree.vars);
                    }
                
                    for (let i = 0; i < tTree.children.length; i++) {
                        let child = tTree.children[i];
                        
                        if (typeof(child) === 'string') tTree.children[i] = _transInterpolation(child, component, false, tTree.vars);
                    }
                }
                return handleTemplateInterpolation;
            })(),
            // make component data reactive
            makeDataReactive: (() => {
                function _handleStateChange(cmp, dataPath, newVal, oldVal, evManager, isStore, debug) {
                    // if (!cmp[isCreatedCPN]) return;
                    if (cmp[WatchCPN] && cmp[WatchCPN][dataPath] && !cmp[IsDestroyedCPN] && !isStore) {
                        if (newVal !== oldVal) cmp[WatchCPN][dataPath](newVal, oldVal);
                    }
                    evManager.emit('SelectiveRender', cmp, undefined, debug);
                }
                return (cmp, evManager, isToStore) => {
                    if (isToStore) {
                        var cb = (val, oldVal, dataPath) => _handleStateChange(cmp, dataPath, val, oldVal, evManager, true, true);
                        Utils.watchOnObj(cmp[StoreCPN][StateCPN], cb, '', [], true, true);
                        return cmp;
                    }
                    if (!cmp[StateCPN]) return cmp;
                    
                    var cb = (val, oldVal, dataPath) => _handleStateChange(cmp, dataPath, val, oldVal, evManager, false);
                    Utils.watchOnObj(cmp[StateCPN], cb, '', [], true);                
                    return cmp;
                }
            })(),
            // create html element from compiled element tree
            createElFromTree: (() => {
                function _createEl(elString, isText = false) {
                    // elString = elString.trim();
                    if (isText) return document.createTextNode(elString);
                    var parentType = (() => {
                        const elType = CmpUtils.getElType(elString);
                        if (elType === 'tr') return 'table';
                        else if (elType === 'td') return 'tr';
                        return 'div';
                    })();
                    var elParent = document.createElement(parentType);
                    elParent.innerHTML = elString;
                    return elParent.firstChild;
                }
                
                /**
                 * 
                 * @param {TemplateTree} tTree 
                 * @param {String} id 
                 * @returns {HTMLElement}
                 */
                function createElFromTree(tTree = '', id = '') {
                    if (typeof(tTree) === 'string') return [_createEl(tTree, true)];
                    else if (tTree instanceof HTMLElement) return [tTree];
                    else if (tTree.type === NoneTemplateType) {
                        if (id) return [_createEl(`<no-element ${ElIdAtrrName}="${id}"></no-element>`)];
                        return [_createEl('', true)];
                    }
                    else if (tTree.element) {
                        if (typeof(tTree.element) === 'string') return [_createEl(tTree.element)];
                        return [tTree.element];
                    }

                    
                    let elements = [];
                    
                    if (tTree.type === emptyTypeTemplateType) {
                        elements = tTree.children.reduce((acc, c) => [...acc, ...createElFromTree(c)], []);
                    } else {
                        var element = (function() {
                            let elType = tTree.type || 'span';
                            var atrrsStr = '';
                            for (let name in tTree.attributes) atrrsStr += `${name}="${tTree.attributes[name] || ''}" `;
                            return _createEl(`<${elType} ${atrrsStr}></${elType}>`);
                        })();
                        const { events } = tTree;
                        for (let evName in events) {
                            const evs = events[evName];
                            evs.forEach(ev => element.addEventListener(evName, ev));
                            // element['on'+evName] = events[evName];
                        }
                        
                        for (let child of (tTree.children.filter(Boolean))) {
                            if (child.type === emptyTypeTemplateType) {
                                child.children.forEach(_child => {
                                    createElFromTree(_child).forEach(c => element.appendChild(c))
                                });
                            }
                            else {
                                createElFromTree(child).forEach(c => element.appendChild(c))
                            }
                        }
                        elements = [element];
                    }
                    return elements;
                }
                return createElFromTree;
            })(),
            // get ref elements from template to cmp object
            setRefs: (cmp) => {
                var cmpEl = cmp[GeneratedElementCPN];
                var cmpRefName = CmpUtils.getCmpRefAtrrName(cmp);
                var elRefs = cmpEl.querySelectorAll(`[${cmpRefName}]`);
                var refs = {};
                elRefs.forEach(el => {
                    let refName = el.getAttribute(`${cmpRefName}`);
                    refs[refName] = el;
                });
                cmp[ContextCPN][RefsCoPN] = refs;
            },
            // puts all the cpm properties on the cmp's this;
            setCmpDataOnThis: (() => {
                function activateWatch(cmp, basePath = '', oldVal, newVal) {
                    if (!cmp[WatchCPN] || !cmp[isCreatedCPN]) return;
                    if (cmp[WatchCPN][basePath] && (oldVal !== newVal)) cmp[WatchCPN][basePath](newVal, oldVal);
                    if (typeof(oldVal) === 'object') {
                        for (let key in oldVal) {
                            let path = basePath? `${basePath}.${key}` : key;
                            activateWatch(cmp, path, oldVal[key], newVal);
                        }
                    }
                }
                return (cmp) => {
                    if (!cmp[isCreatedCPN]) {
                        [OnCreatedCPN, OnDestroyedCPN, OnMountedCPN, OnRenderCPN].forEach(curr => {
                            if (cmp[curr]) cmp[curr] = cmp[curr].bind(cmp);
                        });
                        [WatchCPN, GettersCPN, MethodsCPN].forEach(curr => {
                            let obj = cmp[curr];
                            if (obj) {
                                for (let key in obj) {
                                    obj[key] = obj[key].bind(cmp);
                                }
                            }
                        });
                    }

                    function setOnCmp(obj, isToWath, isToExecute = false, debug) {
                        for (let key in obj) {
                            if (AllSavedCmpPropNames.includes(key)) createError(cmp, `'${key}' is a saved property`)
                            // if (isFunc) obj[key] = obj[key].bind(cmp);
                            let oldVal = cmp[key];
                            cmp[key] = (isToExecute) ? obj[key]() : obj[key];
                            let newVal = cmp[key];
                            if (isToWath) activateWatch(cmp, key, oldVal, newVal);
                        }
                    }
                    
                    var {[StateCPN] : state, [GettersCPN] : getters, [MethodsCPN] : methods, [PropsCPN] : props, [RootPropsCPN]: rootProps} = cmp;
                    
                    if (rootProps && rootProps[propsRPN] && props) {
                        let propsFromRoot = rootProps[propsRPN];
                        var propsToCmp = {};
                        props.forEach(curr => propsToCmp[curr] = propsFromRoot[curr]);
                        setOnCmp(propsToCmp, true);
                    }
                    
                    // if (props) setOnCmp(props, true);
                    if (typeof(state) === 'function') state = cmp[StateCPN] = state.call(cmp);
                    if (state) setOnCmp(state, false);
                    if (methods) setOnCmp(methods, false, false);
                    if (getters) setOnCmp(getters, true, true, true);
                }
            })(),
        };
        /**
         * 
         * @param {TemplateTree} templateTree 
         * @returns 
         */
        function _extraOperationOnTemplateTree(templateTree) {
            templateTree.vars = {};
            templateTree.events = {};
            for (let atrrName in templateTree.attributes) {
                if (atrrName[0] !== '@') continue;
                let atrrVal = templateTree.attributes[atrrName];
                delete templateTree.attributes[atrrName];
    
                let eventFullKey = atrrName.substring(1);
                let splittedEventKey = eventFullKey.split('.');
                let eventName = splittedEventKey[0];
                let endPoints = splittedEventKey.slice(1);
    
                let methodName = atrrVal.split('(')[0];
                let methodArgsStr = '';
                if (atrrVal.includes('(') && atrrVal.includes(')')) {
                    methodArgsStr = atrrVal.split('(')[1].split(')')[0];
                }
                let argsStrs = [];
                if (methodArgsStr) argsStrs = methodArgsStr.split(',').map(curr => curr.trim());
                
                templateTree.events[eventName] = {eventName, methodName, argsStrs, endPoints};
            }
            return templateTree;
        }
        /**
         * 
         * @param {TemplateTree} tTree 
         * @param {*} cmp 
         */
        function _fixRefAttrNamesOnTree(tTree, cmp) {
            if (tTree.attributes.ref) {
                tTree.attributes[CmpUtils.getCmpRefAtrrName(cmp)] = tTree.attributes.ref;
                delete tTree.attributes.ref;
            }
            for (let i = 0; i < tTree.children.length; i++) {
                let currChild = tTree.children[i];
                if (typeof(currChild) === 'object') _fixRefAttrNamesOnTree(currChild, cmp);
            }
        }
        function copyCmp(cmp) {
            var copied = {...cmp};
            var objKeys = [GettersCPN, WatchCPN, MethodsCPN];
            objKeys.forEach(curr => {
                if (copied[curr]) copied[curr] = {...copied[curr]};
            });
            return copied;
        }

        return class ComponentService {
            constructor(eventManager) {this.EventManager = eventManager;}
            RouterService = null;
            RenderService = null;
        
            static GlobalCmps = {};
            static Component = (name, cmp) => {
                ComponentService.GlobalCmps[name] = cmp;
            }
        
            static getCmpType = (cmp, props) => {
                if (cmp instanceof Element) return 'element'
                if (typeof(cmp) === 'string') return 'string';
                else if (typeof(cmp) === 'object') return 'object';
                else if (typeof(cmp) === 'function') {
                    // try {
                    //     let temp = cmp(props);
                    //     if (temp) return 'function'
                    //     else return 'constructor'
                    // } catch(e) {return 'constructor'};
                    try {
                        let temp = new cmp(props);
                        if (temp) return 'constructor'
                        else return 'function'
                    } catch(e) {return 'function'};
                }
            }

            static getPreCompiledCmp(cmp, rootProps = {}, props = {}) {
                const CmpType = ComponentService.getCmpType(cmp, props);
                if (CmpType === 'element') return cmp;
                if (CmpType === 'string') return cmp;
                if (CmpType === 'function') return ComponentService.getPreCompiledCmp(cmp(props, rootProps), rootProps, rootProps[propsRPN]);            
                if (CmpType === 'constructor') {
                    cmp = new cmp(props, rootProps);
                }
                if (CmpType === 'object') {
                    if (cmp[IsInitedCPN]) return cmp;
                    else {
                        cmp = copyCmp(cmp);
                    }
                }
                ComponentService.checkIfValidCmpFields(cmp);
                cmp[IsInitedCPN] = true;
                return cmp;
            }

            static checkIfValidCmpFields(cmp) {
                for (let key of SavedCmpGPropNames) {
                    if (cmp[key]) createError(cmp, `'${key}' is a saved property name`);
                }
                if (cmp[ComponentsCPN] && cmp[ComponentsCPN][RouterViewName]) createError(cmp, `'${RouterViewName}' is a saved component name`);
                if (!cmp[TemplateCPN] && !cmp[RenderCPN]) createError(cmp, 'class or object components must have a template property or render function that returns a template. template is a HTML like string.')
            }

            createCmp(cmp, rootProps = {}) {
                cmp[RootPropsCPN] = rootProps;
                cmp[idCPN] = Utils.getRandomId();
                if (cmp[RoutesCPN] && this.RouterService) {
                    const RouterView = this.RouterService.RouterCmp(cmp[RoutesCPN]);
                    if (!cmp[ComponentsCPN]) cmp[ComponentsCPN] = {};
                    cmp[ComponentsCPN][RouterViewName] = RouterView;
                }
                if (cmp.i18n) {
                    cmp.i18n = new i18nService(cmp.i18n.local, cmp.i18n.translations);
                    cmp.$t = cmp.i18n.$t.bind(cmp.i18n);
                } else if (cmp[RootPropsCPN].i18n) {
                    cmp.i18n = cmp[RootPropsCPN].i18n;
                    cmp.$t = cmp[RootPropsCPN].i18n.$t;
                }
                let context = {};
                if (cmp[StoreCPN]) {
                    CmpGFuncs.makeDataReactive(cmp, this.EventManager, true);
                    context[StoreCPN] = cmp[StoreCPN];
                } else if (cmp[RootPropsCPN][StoreCPN]) {
                    context[StoreCPN] = cmp[RootPropsCPN][StoreCPN];
                }
                this._listenToRouterEvents(cmp);

                cmp[InitTemplateTreeCPN] = CmpUtils.createTemplateTree(cmp[TemplateCPN] || cmp[RenderCPN](), _extraOperationOnTemplateTree, cmp);
                _fixRefAttrNamesOnTree(cmp[InitTemplateTreeCPN], cmp);
                cmp[InitTemplateTreeCPN].attributes[ElIdAtrrName] = cmp[idCPN];

                context[routerCoPN] = this.RouterService.Router;
                
                cmp[ContextCPN] = context;
                cmp.setEvents = () => {
                    let {[eventsRPN] : events} = rootProps;
                    cmp[ContextCPN][emitCoPN] = (evName, ...args) => {
                        // if (events[evName]) events[evName](...args);
                        if (events[evName]) {
                            Array.isArray(events[evName]) ? 
                                events[evName].forEach(c => c(...args.reverse())) :
                                events[evName](...args.reverse());
                        }
                    }
                }
                cmp.setEvents();
                
                CmpGFuncs.setCmpDataOnThis(cmp);
                CmpGFuncs.makeDataReactive(cmp, this.EventManager, false);

                cmp[isCreatedCPN] = true;
                if (cmp[OnCreatedCPN]) cmp[OnCreatedCPN]();
                if (cmp[OnMountedCPN]) {
                    let off = this.EventManager.on('RenderFinished', () => {
                        cmp[OnMountedCPN]();
                        off();
                    });
                }

                if (cmp.style) {
                    const styleStr = typeof cmp.style === 'string'?
                                    cmp.style :
                                    Utils.createStyleEl(`[elid="${cmp[idCPN]}"]`, cmp.style);
                    const styleEl = document.createElement('style');
                    styleEl.id = cmp[idCPN];
                    styleEl.innerHTML = styleStr;
                    document.head.appendChild(styleEl);
                }
            }
            
            CompileCmp = (cmp, rootProps = {}) => {
                cmp = ComponentService.getPreCompiledCmp(cmp, rootProps, rootProps[propsRPN]);
                if (cmp instanceof Element) return cmp;
                if (typeof cmp === 'string') return cmp;
            
                if (!cmp[isCreatedCPN]) {
                    this.createCmp(cmp, rootProps);
                }
                else {
                    cmp[RootPropsCPN] = rootProps;
                    CmpGFuncs.setCmpDataOnThis(cmp);
                    cmp.setEvents();
                }
                if (cmp[OnRenderCPN]) {
                    let off = this.EventManager.on('RenderFinished', () => {
                        cmp[OnRenderCPN]();
                        off();
                    });
                }

                ComponentService._setCmpsBeforBinding(cmp);
            
                cmp[GeneratedTemplateTreeCPN] = JSON.parse(JSON.stringify(cmp[InitTemplateTreeCPN]));
            
                const bindTreeDataAndDirectives = (tTree) => {
                    if (tTree.isSetted) return tTree;
                    
                    CmpGFuncs.bindInlineEvents(cmp, tTree);
                    for (let directiveName in directives) {
                        tTree = directives[directiveName](cmp, tTree);
                    }
                    CmpGFuncs.handleTemplateInterpolation(cmp, tTree);
                    CmpGFuncs.bindChildrenCmps(cmp, tTree, ComponentService.GlobalCmps, bindTreeDataAndDirectives, this.CompileCmp);

                    tTree = {
                        ...CmpUtils.getEmptyTemplateTree(),
                        ...tTree
                    }

                    if (tTree.children) {
                        tTree.children = tTree.children.map(child => {
                            if (typeof(child) === 'object') child = bindTreeDataAndDirectives(child, tTree);
                            return child
                        });
                    }
                    tTree.isSetted = true;
                    return tTree;
                }
                cmp[GeneratedTemplateTreeCPN] = bindTreeDataAndDirectives(cmp[GeneratedTemplateTreeCPN], undefined);
                this.destroyCmps(cmp);
                
                var cmpEl = CmpGFuncs.createElFromTree(cmp[GeneratedTemplateTreeCPN], cmp[idCPN])[0];
                cmp[GeneratedElementCPN] = cmpEl;
                CmpGFuncs.setRefs(cmp);
            
                return cmp;
            }
        
            static _setCmpsBeforBinding = (component) => {
                if (!component[ComponentsCPN]) component[ComponentsCPN] = {}
                if (component[RootPropsCPN][RouterViewName]) component[ComponentsCPN][RouterViewName] = component[RootPropsCPN][RouterViewName];
                if (!component[GeneratedChildCmpsCPN]) component[GeneratedChildCmpsCPN] = {};
                else {
                    for (let cmpName in component[GeneratedChildCmpsCPN]) {
                        component[GeneratedChildCmpsCPN][cmpName].isExist = false;
                }}
            }
        
            destroyCmps = (cmp, isSelfDestroy, isDestroyAll) => {
                const destroyCmp = (cmp) => {
                    if (cmp[OnDestroyedCPN] && cmp[isCreatedCPN]) {
                        cmp[OnDestroyedCPN]();
                    }
                    if (typeof(cmp) === 'object') cmp[IsDestroyedCPN] = true;
                    if (cmp.disconnectEvents) cmp.disconnectEvents();
                    if (cmp[GeneratedChildCmpsCPN]) this.destroyCmps(cmp, false, true);
                    
                    if (cmp.style) {
                        const styleEl = document.querySelector('style#' + cmp[idCPN]);
                        if (styleEl) styleEl.parentElement.removeChild(styleEl);
                    }
                }
                
                for (let cmpName in cmp[GeneratedChildCmpsCPN]) {
                    let currCmp = cmp[GeneratedChildCmpsCPN][cmpName];
                    if (!currCmp.isExist || isDestroyAll) {
                        destroyCmp(currCmp.cmp);
                        delete cmp[GeneratedChildCmpsCPN][cmpName];
                    }
                }
                if (isSelfDestroy) destroyCmp(cmp);
            }
        
            _listenToRouterEvents = (cmp) => {
                let offFuncs = [];
                cmp.disconnectEvents = () => offFuncs.forEach(curr => curr());
                if (!cmp[WatchCPN]) return;
            
                var watchEvents = cmp[WatchCPN];
                for (let key in watchEvents) {
                    if (key.substring(0, routerCoPN.length+1) === routerCoPN + '.') {
                        offFuncs.push(this.EventManager.on(key, (...args) => watchEvents[key](...args)));
                        
                    }
                }
            }
        
            
        }
    })();

    class RouterService {
        static getHash() {
            return window.location.hash ? window.location.hash.split('#')[1] : '';
        }
        Routes = null;
        constructor(EventManager, CmpService, renderService) {
            this.EventManager = EventManager;
            this.CmpService = CmpService;;
            this.executeFuncAfterRender = renderService.executeFuncAfterRender;
    
            window.addEventListener('hashchange', (x) => {
                this.setRoutes(RouterService.getHash());
            });
        }
        
        _setRouterParams = (params) => {
            let oldParams = {...this.Router.params};
            let newParams = {...params};
            let allParamsKeys = new Set([...Object.keys(this.Router.params), ...Object.keys(params)]);
            for (let key of allParamsKeys) {
                let oldVal = this.Router.params[key];
                let val = params[key];
                if (!params[key]) delete this.Router.params[key];
                else this.Router.params[key] = params[key];
                if (oldParams[key] !== newParams[key]) {
                    let currPath = 'router.params.'+key;
                    this.executeFuncAfterRender(() => {
                        this.EventManager.emit(currPath, val, oldVal);
                    });
                }
            }
        } 
        
        setRoutes(path) {
            var prevPath = this.Router.path;
            this.Router.path = path;
            if (!this.Routes) return;
            let routesRes = RouterService._getCmpsTreeRes(path.split('/'), this.Routes);
            let isNewPath = prevPath !== path;
            if (isNewPath) this.EventManager.emit('RenderApp');
            else this._setRouterParams(routesRes.routerParams);
        }

        push = (path) => {
            if (typeof path === 'object') path = RouterService.getPathFromRouteItem(path, this.Routes);
            if (path === this.Router.path) return;
            window.location.hash = path;
        }
        Router = {
            params: {},   
            path: RouterService.getHash(),  
            routerPath: '/',
            push: this.push
        }
    
        RouterCmp = (routes) => {
            // window.Routes = routes;
            this.Routes = routes;
            this.Router.params = RouterService._getCmpsTreeRes(this.Router.path.split('/'), this.Routes).routerParams;
            return {
                isRouter: true,
                instance: (_, RootProps) => this._createRouterView(routes, RootProps)
            };
        }
        
        _createRouterView = (routes, RootProps) => {
            RouterService._setRoutsBeforeBinding(routes);
        
            var splitedPath = this.Router.path.split('/');
        
            var routesRes = RouterService._getCmpsTreeRes(splitedPath, routes);
            this._setRouterParams(routesRes.routerParams);
            var cmpsTree = routesRes.cmps;
            // if (cmpsTree[cmpsTree.length-1] === '') cmpsTree.pop();
            var routerPath = '';
            var RouterView = '';
            var prevInstance = '';
            for (var i = cmpsTree.length-1; i >= 0 ; i--) {
                let curr = cmpsTree[i];
                routerPath = curr.path + routerPath;

                let currInstance = ComponentService.getPreCompiledCmp(curr.generatedCmp || curr.component, {});
                if (!currInstance) continue;
                if (typeof currInstance === 'string') {
                    prevInstance = currInstance;
                    RouterView = currInstance;
                    curr.generatedCmp = currInstance;
                    curr.isExist = true;
                    continue;
                }
                if (!currInstance[ComponentsCPN]) currInstance[ComponentsCPN] = {};
                if (prevInstance) currInstance[ComponentsCPN][RouterViewName] = prevInstance;
                else delete currInstance[ComponentsCPN][RouterViewName];
                curr.generatedCmp = currInstance;
                curr.isExist = true;
                prevInstance = currInstance;
                RouterView = currInstance;
            }
            this.Router.routerPath = routerPath;
            this._destroyOldRouts(routes);
            return RouterView;
        }
    
        static _getCmpsTreeRes(splitedPath, routes) {
            const routeLike = {component:''};
            // const routeLike = new RouterChild();
            if (splitedPath[0] === '') splitedPath = splitedPath.slice(1);
            var defaultComponent = RouterService._getDefaultRoutesChild(routes);
            if (!splitedPath.length || (splitedPath.length === 1 && !splitedPath[0])) return {cmps: [defaultComponent], routerParams: {}};
            var cmps = [];
            var currParent = routes;
            var routerParams = {};
    
            var isNextChild = true;
            while (isNextChild) {
                //finding closest cmp
                let currDefaultComponent = RouterService._getDefaultRoutesChild(currParent);
                let closestCmp;
                let closestPathLength = 0;
                for (let i = 0; i < currParent.length; i++) {
                    let currCmp = currParent[i];
                    let cmpSplitedPath = currCmp.path.split('/');
                    if (cmpSplitedPath[0] === '') cmpSplitedPath = cmpSplitedPath.slice(1);
                    
                    let currPathLength = 0;
                    let currPathParams = {};
            
                    for (let j = 0; j < cmpSplitedPath.length; j++) {
                        if (cmpSplitedPath[j] !== splitedPath[j] && cmpSplitedPath[j][0] !== ':') {
                            break;
                        } else {
                            currPathLength++;
                            if (cmpSplitedPath[j][0] === ':') {
                                var paramName = cmpSplitedPath[j].slice(1);
                                currPathParams[paramName] = splitedPath[j];
                            }
                            if (currPathLength > closestPathLength) {
                                closestPathLength = currPathLength;
                                closestCmp = currCmp;
                                for (let key in currPathParams) {
                                    routerParams[key] = currPathParams[key];
                                }
                            }
                        }
                    }
                }
                
                if (!closestCmp) closestCmp = currDefaultComponent || routeLike;  // CREATES AN INFINITE LOOP //
    
                cmps.push(closestCmp);
                splitedPath = splitedPath.splice(closestPathLength);
                if (closestCmp.children) currParent = closestCmp.children;
                else isNextChild = false;
            }
            if (!cmps.length && !cmps[0]) cmps = defaultComponent ? [defaultComponent] : [routeLike];
            return {cmps, routerParams};
        }

        static getPathFromRouteItem(routeItem, routes, basePath = '') {
            for (let route of routes) {
                let currPath = basePath + route.path
                if (route.name === routeItem.name) {
                    if (routeItem.params) {
                        currPath = currPath.split('/').filter(Boolean).map(pathPart => {
                            if (pathPart[0] === ':') {
                                const paramName = pathPart.slice(1);
                                return routeItem.params[paramName];
                            } else return pathPart;
                        }).join('/');
                    }
                    // return '/'+currPath;
                    return currPath;
                }
                else if (route.children) {
                    let childRes = getPathFromRouteItem(routeItem, route.children, currPath);
                    if (childRes) return childRes;
                }
            }
        }
    
    
        static _getDefaultRoutesChild(routes) {
            return routes.find(route => route.path === '/') || null;
        }
    
        static _setRoutsBeforeBinding(routes) {
            for (let i = 0; i < routes.length; i++) {
                let curr = routes[i];
                curr.isExist = false;
                if (curr.children) RouterService._setRoutsBeforeBinding(curr.children);
            }
        }
    
        _destroyOldRouts = (routes) => {
            for (let i = 0; i < routes.length; i++) {
                let curr = routes[i];
                if (!curr.isExist && curr.generatedCmp) {
                    this.CmpService.destroyCmps(curr.generatedCmp, true);
                    delete curr.generatedCmp;
                }
                if (curr.children) this._destroyOldRouts(curr.children);
            }
        }
    }
    
    class RenderService {
        constructor(evManager, CmpService){
            this.EventManager = evManager;
            this.CmpService = CmpService;
            this.EventManager.on('SelectiveRender', this.selectiveRender);
        }
        Root = {
            cmp: null,
            instance: null,
            isRenderOn: false
        }
    
        RootComponent = (selector, component, props = {}) => {
            this.Root.instance = component;
            const renderApp = () => {
                let isFirst = this.Root.cmp ? false : true;
                let cmp = this.CmpService.CompileCmp(this.Root.cmp || this.Root.instance, {props});
                if (isFirst) {
                    this.Root.cmp = cmp;
                    // window.RootCmp = this.Root.cmp;
                    if (!window.RootApps) window.RootApps = [];
                    window.RootApps.push(cmp);
                }
                // RenderService.renderElement_noVD(cmp, selector, this.EventManager);
                if (selector) this.selectiveRender(cmp, selector);
                return cmp;
            }
            this.EventManager.on('RenderApp', renderApp); // only used when route change, maybe can be removed
            // this.EventManager.on('SelectiveRender', this.selectiveRender);
            // document.body.onload = renderApp;
            return renderApp();
        }
    
        selectiveRender = (component, selector, debug) => {
            this.Root.isRenderOn = true;
        
            var cmp = this.CmpService.CompileCmp(component, component[RootPropsCPN] || {});

            var activeElement = document.activeElement;
            var activeElId;
            var activeStartSelection;                   //FIND ACTIVE ELEMENT TO REACTIVE IT//
            var activeEndSelection;
            if (activeElement) {
                activeElId = activeElement.getAttribute(ElIdAtrrName);
                activeStartSelection = activeElement.selectionStart;
                activeEndSelection = activeElement.selectionEnd;
            };
            
            RenderService.renderElement_noVD(cmp, this.EventManager, selector, debug);
            // RenderService.renderElement_VD(cmp, this.EventManager, selector);
            
            if (activeElement && activeElId) {          //TRYING TO REACTIVE ELEMENT
                try {
                    let elToFocus = document.querySelector(`[${ElIdAtrrName}="${activeElId}"]`);
                    elToFocus.focus();
                    elToFocus.selectionStart = activeStartSelection;
                    elToFocus.selectionEnd = activeEndSelection;
                } catch(err) {console.error('failed to focuse after render')};
            }
        
            this.Root.isRenderOn = false;
        }
    
        static renderElement_noVD(cmp, evManager, selector, debug) {
            let oldEl = document.querySelector(`[${ElIdAtrrName}="${cmp[idCPN]}"]`);
            if (oldEl) {
                let elParent = oldEl.parentNode;
                elParent.replaceChild(cmp[GeneratedElementCPN], oldEl);
            }
            else if (selector) {
                document.querySelector(selector).appendChild(cmp[GeneratedElementCPN]);
            }
            evManager.emit('RenderFinished');
        }

        static renderElement_VD = (() => {
            function updateElBy(original, compare) {
                original.classList = compare.classList;

                var originalChildren = original.children;
                var compareChildren = compare.children;
                for (let i = 0; i < originalChildren.length; i++) {
                    let originalChild = originalChildren[i];
                    let childId = originalChild.getAttribute(ElIdAtrrName);
                    let compareChildIdx = findIdx(compareChildren, child => child.getAttribute(ElIdAtrrName) === childId);
                    if (compareChildIdx === -1) {
                        original.removeChild(originalChild);
                        continue;
                    } else if (compareChildIdx !== i) {
                        original.removeChild(originalChild);
                        original.insertBefore(originalChild, original.children[compareChildIdx+1]);
                    }
                    updateElBy(originalChild, compareChildren[compareChildIdx]);
                }
                for (let i = 0; i < compareChildren.length; i++) {
                    let compareChild = compareChildren[i];
                    let childId = compareChild.getAttribute(ElIdAtrrName);
                    let originalChildIdx = findIdx(originalChildren, child => child.getAttribute(ElIdAtrrName) === childId);
                    if (originalChildIdx === i) continue;
                    else if (originalChildIdx === -1) {
                        original.insertBefore(compareChild, original.children[i+1]);
                    } else if (originalChildIdx !== i) {
                        
                    }
                }
            }
            return (cmp, evManager, selector = '') => {
                let elInDom = document.querySelector(`[${ElIdAtrrName}="${cmp[idCPN]}"]`);
                let elInCmp = cmp[GeneratedElementCPN];
                if (elInDom && elInCmp) {
                    // VIRTUAL DOM FANCTIONALITY;
                    updateElBy(elInDom, elInCmp);
                } else if (selector) {
                    document.querySelector(selector).appendChild(cmp[GeneratedElementCPN]);
                }
                evManager.emit('RenderFinished');
            }
        })();
    
        executeFuncAfterRender = (cb) => {
            if (!this.Root.isRenderOn) return cb();
            let off = this.EventManager.on('RenderFinished', () => {
                off();
                cb();
            });
        }
    }


    class EventManager {
        Events = {};
    
        constructor(isDuplicatedEvents = true) {
            this.isDuplicatedEvents = isDuplicatedEvents;
        }
    
        on = (eventName, cb) => {
            if (!this.isDuplicatedEvents) {
                this.Events[eventName] = cb;
                return;
            }
            if (!this.Events[eventName]) this.Events[eventName] = [];
            this.Events[eventName].push(cb);
            return () => this.off(eventName, cb);
        }
    
        off = (eventName, cb) => {
            if (!this.isDuplicatedEvents || !cb) {
                delete this.Events[eventName];
                return;
            }
            var idx = this.Events[eventName].find(curr => curr === cb);
            if (idx === -1) throw new Error(`Something went wrong removing event "${eventName}"`);
            this.Events[eventName].splice(idx, 1);
        }
    
        emit = (eventName, ...args) => {
            if (!this.Events[eventName]) return;
            if (typeof (this.Events[eventName]) === 'function') return this.Events[eventName](...args);
            else this.Events[eventName].forEach(curr => curr(...args));
        }
    }

    class i18nService {
        constructor(local = 'en', translations = { en: {  } }) {
            this.translations = translations;
            this.local = local;
        }
        setLocal = localToSet => {
            this.local = localToSet;
        }
        $t = (key) => {
            const { local, translations : transs } = this;
            return Utils.getDeepVal(transs[local], key) || key;
        }
    }

    
    //////////////////// AvivJS ////////////////////
    //////////////////// AvivJS ////////////////////
    //////////////////// AvivJS ////////////////////
    //////////////////// AvivJS ////////////////////
    //////////////////// AvivJS ////////////////////

    class AvivJs {
        static EventManager = EventManager;
        
        static Component = ComponentService.Component;

        constructor() {
            const EvManager = new EventManager();
            
            const componentService = new ComponentService(EvManager);
            const renderService = new RenderService(EvManager, componentService);
            // const executeFuncAfterRender = renderService.executeFuncAfterRender;
            const routerService = new RouterService(EvManager, componentService, renderService);
            
            componentService.RouterService = routerService;
            componentService.RenderService = renderService;

            this.cmpService = componentService;
            this.renderService = renderService;
            this.routerService = routerService;

            this.RootCmp = renderService.RootComponent;
            this.RouterCmp = routerService.RouterCmp;
        }

        static element(component, props = {}) {
            var App = new AvivJs();
            var cmp = App.RootCmp(undefined, component, props);
            var el;
            if (typeof(cmp) === 'string') {
                var parent = document.createElement('div');
                parent.innerHTML = cmp;
                el = cmp.firstChild;
            } else el = cmp[GeneratedElementCPN];
            return el;
        }
    }

    
    //////////////////// BUILT IN CMPS ////////////////////
    //////////////////// BUILT IN CMPS ////////////////////
    //////////////////// BUILT IN CMPS ////////////////////
    //////////////////// BUILT IN CMPS ////////////////////
    //////////////////// BUILT IN CMPS ////////////////////

    class RouterLink {
        name = 'RouterLink';
        props = ['url', 'className'];
        // <a @click.prevent="changeUrl()" href="{{link}}" class="router-link {{className || ''}} {{exact && 'exact' || ''}}">
        template = `
            <a @click.prevent="changeUrl()" href="{{link}}" class="router-link {{extraClass}}">
                <content/>
            </a>
        `;
        getters = {
            link() {
                return '#' + this.url;
            },
            exact() {
                return this.url === this.context.router.path;
            },
            active() {
                return this.context.router.path.substring(0, this.url.length) === this.url;
            },
            extraClass() {
                let res = '';
                res += ` ${this.className || ''}`;
                res += ` ${this.active && 'active' || ''}`;
                res += ` ${this.exact && 'exact' || ''}`;
                return res;
            }
        }
        methods = {
            changeUrl: () => {
                this.context.router.push(this.url);
            }
        }
    }
    AvivJs.Component('RouterLink', RouterLink);

    return AvivJs;
})();

