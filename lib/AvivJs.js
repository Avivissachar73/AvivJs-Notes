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
    const TemplateTemplateType = 'template';


    // Component props;            // 'CPN' stands for 'component prop name';

    const StateCPN = 'state';
    const ComputedCPN = 'computed';
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
    const GeneratedCmpsCPN = '__children';
    const GeneratedElementCPN = 'element';
    const ContextCPN = 'context';
    const RootPropsCPN = '__rootProps';
    const IsDestroyedCPN = '__isDestroyed'
    const IsInitedCPN = '__isInit';

    // context prop names; // 'CoPN' stands for 'context prop name';
    const RefsCoPN = 'refs';
    const emitCoPN = 'emit';
    const storeCoPN = 'store';
    const routerCoPN = 'Router';

    class CmpContext {
        constructor(refs = {}, emit = () => {}, store = {}, router = {}) {
            this.refs = refs;
            this.emit = emit;
            this.store = store;
            this.Router = router;
        }
    }

    const GeneratedTemplateCPN = '__generatedTemplate';

    
    const SavedCmpPropNames = [
        StateCPN,ComputedCPN,PropsCPN,MethodsCPN,OnCreatedCPN,OnDestroyedCPN,WatchCPN,NameCPN,
        ComponentsCPN,TemplateCPN,RenderCPN,OnMountedCPN,OnRenderCPN,StoreCPN
        
    ];
    const SavedCmpGPropNames = [
        isCreatedCPN,idCPN,GeneratedTemplateTreeCPN,InitTemplateTreeCPN,GeneratedCmpsCPN,GeneratedElementCPN,
        ContextCPN,GeneratedTemplateCPN,RootPropsCPN,IsDestroyedCPN
    ];
    const AllSavedCmpPropNames = SavedCmpPropNames.concat(SavedCmpGPropNames);

    const ErrorStr = 'Error';

    // Template tree props;    // 'TTPN' stands for 'template tree prop name';  // 'tTree' stands for 'template tree';
    const AttributesTTPN = 'attributes';
    const TypeTTPN = 'type';
    const ChildrenTTPN = 'children';
    // const SplitedTemplateTTPN = 'splittedTemplate';
    // const TemplateTTPN = 'template';
    const VarsTTPN = 'vars';
    const EventsTTPN = 'events';
    const ElementTTPN = 'element';

    class TemplateTree {
        constructor(type = '', attributes = {}, children = [], vars = {}, events = {}, element = null) {
            this.type = type;
            this.attributes = attributes;
            this.children = children;
            this.vars = vars;
            this.events = events;
            this.element = element;
        }
    }

    // RootProps props // 'RPN' stands for 'rootProps prop name';
    const propsRPN = 'props';
    const eventsRPN = 'events';
    // const storeRPN = 'store';

    class RootProps {
        constructor(props = {}, events = {}, store = null, content = []) {
            this.props = props;
            this.events = events;
            this.store = store;
            this.content = [];
        }
    }

    class GeneratedCmpObj {
        constructor(cmp = {}, isExist = true) {
            this.cmp = cmp;
            this.isExist = isExist;
        }
    }



    class RouterChild {
        constructor(path = '', component = {}, children = [], isExist = false, generatedCmp = null) {
            this.path = path;
            this.component = component;
            this.children = children;

            this.isExist = isExist;
            this.generatedCmp = generatedCmp;
        }
    }

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
            return `${pt3}-${pt1}-${pt2}`.toUpperCase();
        },
        watchOnObj(obj, cb, basePath = '', ignoreFilds = [], isDeep = true) {
            if (!obj || typeof(obj) !== 'object') return;
            // if (typeof(obj) !== 'object') return;
            // if (typeof(obj) !== 'object' || obj === null) return;
            let keys = Object.keys(obj);
            for (let key of keys) {
                let path = basePath + basePath.length ? `.${key}` : key;
                if (ignoreFilds.includes(path)) continue;
                const _key = key;
                if (!isNaN(+key)) key = +key; 
                let isCall = false;
                let initialVal = obj[key];
                let fieldName = key;
                Object.defineProperty(obj, key, {
                    set: function(val) {
                        let oldVal = key;
                        key = val;
                        if (isCall) cb(val, oldVal, path);
                        Utils.watchOnObj(val, cb, path, ignoreFilds, isDeep);
                    },
                    get: function() {
                        return key;
                    }
                });
                obj[fieldName] = initialVal;
                isCall = true;
                if (!isDeep) continue;
                if (typeof(obj[fieldName]) === 'object' && !Array.isArray(obj[fieldName]) && obj[fieldName]) Utils.watchOnObj(obj[fieldName], cb, path, ignoreFilds, isDeep);
                // if (typeof(obj[fieldName]) === 'object') Utils.watchOnObj(obj[fieldName], cb, path, ignoreFilds, isDeep);
                // if (typeof(obj[fieldName]) === 'object' && obj[fieldName]) watchOnObj(obj[fieldName], cb, path, ignoreFilds, isDeep);
            }
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
        }
    };
    
    function createError(cmp, msg) {
        let name = (cmp && cmp[NameCPN])? cmp[NameCPN] : 'Anonymus'; 
        throw new Error(`${msg} \n At: <${name}/>`)
    }

    function findIdx(list, cb) {
        for (let i = 0; i < list.length; i++) {
            if (cb(list[i], i, list)) return i;
        }
        return -1;
    }

    function splice(list, startIdx = 0, deleteCount = list.length - startIdx, ...items) {
        var deleted = [];
        for (let i = list.length-1; i >= startIdx; i--) {
            if (i < (deleteCount + startIdx)) {
                deleted.push(list[i]);
                // delete list[i];
                continue;
            }
            else list[i+items.length-deleteCount] = list[i];
        }
        for (let i = 0; i < items.length; i++) {
            list[i + startIdx] = items[i];
        }
        return deleted;
    }

    //////////////////// SERVICES ////////////////////
    //////////////////// SERVICES ////////////////////
    //////////////////// SERVICES ////////////////////
    //////////////////// SERVICES ////////////////////
    //////////////////// SERVICES ////////////////////

    
    const ComponentService = (() => {
        const HtmlNativeElements = ['h1','h2','h3','h4','h5','h6','p','div','section','main','header','footer','nav','ul','li','table','tbody','thead','tfoot','th','td','tr','title','head','body','html','script','style','marquee','center','strong','small','input','textarea','label','a','select','option','button','form','hr','br','audio','iframe','img','media','aside','b','u','i','canvas','link','ol','pre','span','svg'];
        const CmpUtils = {
            getDataFromStr: function(cmp, dataStr, vars = {}) {
                var allVars_AvivJs_SomeLongNameSoNoOneWillDeclareVarInThatName = {...cmp, ...vars};
                var varsStr = '';
                for (let key in allVars_AvivJs_SomeLongNameSoNoOneWillDeclareVarInThatName) {
                    varsStr += `var ${key} = allVars_AvivJs_SomeLongNameSoNoOneWillDeclareVarInThatName.${key};`;
                }
                try {
                    return eval(`(function(){${varsStr} return (${dataStr})})()`);
                } catch(err) {
                    createError(cmp, err.message);
                }
            },
            getElType: function(template) {
                if (template[0] === '<' && template[template.length-1] === '>') {
                    if (template[1] === '/') {
                        return template.split('/')[1].split(' ')[0].split('>')[0];
                    } 
                    else {
                        return template.split('<')[1].split(' ')[0].split('>')[0].split('/')[0];
                    }
                } else return;
            },
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

                return function createTemplateTree(template, itarateFunc = undefined, cmp) {
                    // const ElIdAtrrName = 'elid';
                    var splitted = _getSplitedTemplate(template);
                
                    var templateTree = {
                        [TypeTTPN]: CmpUtils.getElType(splitted[0]),
                        // [TemplateTTPN]: template,          // both template and splitted are not needed in the tree;
                        // [SplitedTemplateTTPN]: splitted,
                        // attributes: {..._getAttrs(splitted[0]), [ElIdAtrrName]: Utils.getRandomId()},
                        [AttributesTTPN]: _getAttrs(splitted[0]),
                        [ChildrenTTPN]: []
                    }
                    if (templateTree[AttributesTTPN][ElIdAtrrName]) createError(cmp, `${ElIdAtrrName} is a saved attribute`);
                    else templateTree[AttributesTTPN][ElIdAtrrName] = Utils.getRandomId();
                    
                    var splittedContent = splitted.slice(1, splitted.length-1);
                    for (let i = 0; i < splittedContent.length; i++) {
                        let curr = splittedContent[i];
                        if (_getIsTemplatePartStr(curr)) {
                            let currSplitted = _getFulSplitedlEl(splittedContent, i, cmp);
                            let child = createTemplateTree(currSplitted.join(''), itarateFunc, cmp)
                            // if (child === ErrorStr) return ErrorStr;
                            templateTree[ChildrenTTPN].push(child);
                            i += currSplitted.length-1;
                        }
                        else templateTree[ChildrenTTPN].push(curr);
                    }
                
                    if (itarateFunc) templateTree = (itarateFunc(templateTree) || templateTree);
                    
                    return templateTree;
                }
            })(),
            buildTemplateFromTree: function(tTree) {
                if (typeof(tTree) === 'string') return tTree;
                if (tTree[TypeTTPN] === NoneTemplateType) return '';
            
                var attrsJSON = tTree[AttributesTTPN] && Object.keys(tTree[AttributesTTPN]).length ? JSON.stringify(tTree[AttributesTTPN]) : '';
                var AttrsStr = attrsJSON ? attrsJSON.substring(2, attrsJSON.length-2).split('":"').join('="').split('","').join('" ')+'"' : '';
                var childrenStr = tTree[ChildrenTTPN].map(curr => buildTemplateFromTree(curr)).join('');
                
                if (tTree[TypeTTPN] === TemplateTemplateType) return childrenStr;
                else return `<${tTree[TypeTTPN] || 'span'}${AttrsStr? ' '+AttrsStr : ''}>${childrenStr}</${tTree[TypeTTPN] || 'span'}>`;
            },
            createCmpRefAtrrName: (cmp) => {
                return `ref_${cmp.name}_${cmp.id}`;
            }
        };
        const CmpGFuncs = {
            bindConditions(component, tTree) {
                if (!tTree[AttributesTTPN] || !tTree[AttributesTTPN][IfAtrr]) return;
            
                var conditionStr = tTree[AttributesTTPN][IfAtrr];
            
                var conditionVal = CmpUtils.getDataFromStr(component, conditionStr);
            
                if (!conditionVal) {
                    tTree[TypeTTPN] = NoneTemplateType;
                    tTree[ChildrenTTPN] = [];
                }
            
                delete tTree[AttributesTTPN][IfAtrr];
            },
            bindCmpList: (() => {
                function updateTreeContent(tTree, idEndPoint, vars, searchVal, replaceVal) {
                    // const SavedAttrs = ['A-if', 'A-model', 'A-for'];
                    tTree[VarsTTPN] = {...tTree[VarsTTPN], ...vars};
                
                    const {attributes} = tTree;
                
                    attributes[ElIdAtrrName] += idEndPoint;
                
                    if (tTree[ChildrenTTPN]) {
                        for (let i = 0; i < tTree[ChildrenTTPN].length; i++) {
                            let child = tTree[ChildrenTTPN][i];
                            if (typeof(child) === ('object')) updateTreeContent(child, idEndPoint, vars, searchVal, replaceVal);
                        }
                    }
                }
            
                return function BindCmpList(component, tTree, parentTree) {
                    if (!tTree[AttributesTTPN] || !tTree[AttributesTTPN][ForAtrr]) return;
                
                    var loopCmd = tTree[AttributesTTPN][ForAtrr];
                    var splittedCmd = loopCmd.split(' ').filter(curr => curr);
                
                    var itemsName = splittedCmd[0];
                    var itemName = itemsName.split(',')[0];
                    var indexName = itemsName.split(',')[1];
                    
                    var arrName = splittedCmd[splittedCmd.length-1];
                
                    
                    var arrToBind = [];
                    if (!isNaN(+arrName)) {
                        arrName = +arrName;
                        for (let j = 1; j <= arrName; j++) arrToBind.push(j);
                    } else {
                        arrToBind = CmpUtils.getDataFromStr(component, arrName, tTree[VarsTTPN]);
                    }
                    
                    var bindedTrees = [];

                    if (Array.isArray(arrToBind) || typeof(arrToBind) === 'string') {
                        for (let i = 0; i < arrToBind.length; i++) {
                            let copyTree = JSON.parse(JSON.stringify(tTree));
                    
                            let idEndPoint = `_${i}`;
                            
                            let vars = {
                                [itemName]: arrToBind[i],
                                [indexName]: i
                            }
                            
                            updateTreeContent(copyTree, idEndPoint, vars);
                            
                            delete(copyTree[AttributesTTPN][ForAtrr]);
                    
                            bindedTrees.push(copyTree);
                        }
                    } else if (typeof(arrToBind) === 'object') {
                        for (let key in arrToBind) {
                            let copyTree = JSON.parse(JSON.stringify(tTree));
                    
                            let idEndPoint = `_${key}`;
                            
                            let vars = {
                                [itemName]: arrToBind[key],
                                [indexName]: key
                            }
                            
                            updateTreeContent(copyTree, idEndPoint, vars);
                            
                            delete(copyTree[AttributesTTPN][ForAtrr]);
                    
                            bindedTrees.push(copyTree);
                        }

                    }
                
                    if (bindedTrees && parentTree) {
                        let children = parentTree[ChildrenTTPN];
                        let idx = children.findIndex(curr => typeof(curr) === 'object' && curr[AttributesTTPN][ElIdAtrrName] === tTree[AttributesTTPN][ElIdAtrrName]);
                        children.splice(idx, 1, ...bindedTrees);
                    }
                
                    return bindedTrees;
                }
            })(),
            bindCmpCmps(cmp, tTree, globalCmps, setTreeFunc, CompileFunc) {
                const ContentName = 'content';
                const fixName = Utils.stringToLowerKabab;
            
                if (cmp[RootPropsCPN] && cmp[RootPropsCPN][ContentName] && tTree[TypeTTPN] === 'content') {
                    tTree[TypeTTPN] = TemplateTemplateType;
                    tTree[ChildrenTTPN] = cmp[RootPropsCPN][ContentName];
                    return;
                }
                
                var cmps = { ...globalCmps, ...cmp[ComponentsCPN]};
                // if (!Object.keys(cmps).includes(tTree[TypeTTPN])) return;
                var cmpKey = Object.keys(cmps).find(curr => fixName(curr) === fixName(tTree[TypeTTPN]));
                if (!cmpKey) {
                    if (![...HtmlNativeElements, NoneTemplateType, TemplateCPN, fixName(RouterViewName)].includes(fixName(tTree[TypeTTPN]))) createError(cmp, `Unknown costume element ${tTree[TypeTTPN]}`);
                    return;
                }
                
                var fixedCmpKey = fixName(cmpKey);
                
                // var props = {
                //     [propsRPN]: tTree[AttributesTTPN], 
                //     [eventsRPN]: tTree[EventsTTPN], 
                //     [StoreCPN]: cmp[StoreCPN] || cmp[RootPropsCPN][StoreCPN], 
                //     // [RouterViewName]: cmp[RootPropsCPN][RouterViewName],
                //     [ContentName]: []
                // };

                var props = new RootProps(
                    tTree[AttributesTTPN],
                    tTree[EventsTTPN],
                    cmp[StoreCPN] || cmp[RootPropsCPN][StoreCPN],
                    []
                )
            
                if (tTree[ChildrenTTPN] && tTree[ChildrenTTPN].length) {
                    tTree[ChildrenTTPN].forEach(child => {
                        if (typeof(child) === 'object') {
                            setTreeFunc(child);
                        }
                        props[ContentName].push(child);
                    });
                }
            
                let genCmp;
            
                let cmpTemplateKey = tTree[AttributesTTPN][KeyAttrName];
                let cmpGeneratedKey = (fixedCmpKey === fixName(RouterViewName))? RouterViewName : `${cmpKey}_${cmpTemplateKey || tTree[AttributesTTPN][ElIdAtrrName]}`;
            
                if (cmps[cmpKey].isRouter) {
                    // cmps[cmpKey][GeneratedCmpsCPN] = {};
                    genCmp = CompileFunc(cmps[cmpKey].instance, props);
                }
                // else if (cmps[cmpKey][TemplateCPN] && !cmps[cmpKey][isCreatedCPN]) {  // validate if it is an object cmp;
                //     genCmp = CompileFunc(cmps[cmpKey], props);
                // }
                else {
                    let cmpToBind = (cmp[GeneratedCmpsCPN][cmpGeneratedKey] && typeof(cmp[GeneratedCmpsCPN][cmpGeneratedKey].cmp) !== 'string') 
                                                                    ? cmp[GeneratedCmpsCPN][cmpGeneratedKey].cmp 
                                                                    : cmps[cmpKey];
                    genCmp = CompileFunc(cmpToBind, props);
                }
                
                // let isExist = (typeof(genCmp) === 'string' && genCmp)? true : (genCmp[GeneratedTemplateCPN] && !genCmp[IsDestroyedCPN])? true : false;
                let isExist = (typeof(genCmp) === 'string' && genCmp)? true : (!genCmp[IsDestroyedCPN])? true : false;
            
                // cmp[GeneratedCmpsCPN][cmpGeneratedKey] = {
                //     isExist,
                //     cmp: genCmp
                // };
                cmp[GeneratedCmpsCPN][cmpGeneratedKey] = new GeneratedCmpObj(
                    genCmp,
                    isExist
                );
                // tTree[ElementTTPN] = typeof(genCmp) === 'string'? genCmp : genCmp[GeneratedElementCPN];
                if (genCmp instanceof Element) tTree[ElementTTPN] = genCmp;
                else if (isExist) tTree[ElementTTPN] = typeof(genCmp) === 'string'? genCmp : genCmp[GeneratedElementCPN];
                else {
                    tTree[ElementTTPN] = '';
                }
            },
            bindCmpModelData(component, tTree) {
                if (!tTree[AttributesTTPN] || !tTree[AttributesTTPN][DataBindAtrr]) return;
            
                var modelAttrVal = StateCPN+'.' + tTree[AttributesTTPN][DataBindAtrr].trim();

                var objsTree;
                var objBindField;
                var parentObjStr; 
                var objBindFieldVal;

                if (modelAttrVal[modelAttrVal.length-1] === ']') {
                    objsTree = modelAttrVal.split('[').map((curr, idx) => idx === 0 ? curr : '['+curr);
                    objBindField = objsTree[objsTree.length-1].substring(1,objsTree[objsTree.length-1].length-1);
                    objsTree.pop();
                    parentObjStr = objsTree.join('');
                    objBindFieldVal = CmpUtils.getDataFromStr(component, objBindField, tTree[VarsTTPN]);
                } else {
                    objsTree = modelAttrVal.split('.');
                    objBindField = objsTree[objsTree.length-1];
                    objsTree.pop();
                    parentObjStr = objsTree.join('.'); 
                }
            
                var parentObj = CmpUtils.getDataFromStr(component, parentObjStr, tTree[VarsTTPN]);

                var actualField = (objBindFieldVal !== undefined)? objBindFieldVal : objBindField;
                var generatedFunc = domEvOrVal => {
                    if (domEvOrVal instanceof Event) parentObj[actualField] = domEvOrVal.target.value;
                    else parentObj[actualField] = domEvOrVal;
                }
                // if (!tTree[AttributesTTPN].value) tTree[AttributesTTPN].value = `{{${tTree[AttributesTTPN][DataBindAtrr]}}}`; 
                if (!tTree[AttributesTTPN].value) tTree[AttributesTTPN].value = `${StartVarScope}${tTree[AttributesTTPN][DataBindAtrr]}${FinishVarScope}`; 
                tTree.events.input = generatedFunc;
                
                delete tTree[AttributesTTPN][DataBindAtrr];
            },
            bindEvents: (() => {
                return function BindCmpFuncs(cmp, tTree) {
                
                    if (!cmp[MethodsCPN]) return cmp;
                    if (!cmp[MethodsCPN]) cmp[MethodsCPN] = {};
            
                    let {[EventsTTPN] : events} = tTree;
                    for (let evName in events) {
                        let curr = events[evName];
                        if (typeof(curr) === 'function') continue;
                        let method = CmpUtils.getDataFromStr(cmp, curr.methodName, tTree[VarsTTPN]);
                        let inlineArgs = [];
                        if (curr.argsStrs.length) inlineArgs = curr.argsStrs.map(arg => CmpUtils.getDataFromStr(cmp, arg, tTree[VarsTTPN]));
                        let endPoints = curr.endPoints;
            
                        let bindedMethod = (domEvent, ...args) => {
                            if (endPoints.includes('prevent')) domEvent.preventDefault();
                            if (endPoints.includes('stop')) domEvent.stopPropagation();
            
                            method(...[...inlineArgs, ...args], domEvent);
                        }
            
                        events[evName] = bindedMethod;
                    }
                }
            })(),
            bindInlineData: (() => {
                // const StartScope = '{{';
                // const FinishScope = '}}';
                const StartScope = StartVarScope;
                const FinishScope = FinishVarScope;
                function _replaceScoped(string, component, isPosibleObj, extraVars) {
                    var startScopeIdx = -1;
                    var finishScopeIdx = -1;
            
                    for (let i = 0; i < string.length; i++) {
                        if (string.substring(i, i+StartScope.length) === StartScope && startScopeIdx === -1) startScopeIdx = i;
                        else if (string.substring(i, i+FinishScope.length) === FinishScope && finishScopeIdx === -1) finishScopeIdx = i;
                    
                        if (startScopeIdx === -1 || finishScopeIdx === -1)  continue;
            
                        let scopedVar = string.substring(startScopeIdx, finishScopeIdx+FinishScope.length);
            
                        
                        let fullVar = scopedVar.substring(StartScope.length, scopedVar.length-FinishScope.length);
                        
                        // let splittedVar = fullVar.split('.');
                        
                        // let bindedVal = component;
                        // for (let key of splittedVar) bindedVal = bindedVal[isNaN(+key) ? key : +key];
                        
                        let bindedVal = CmpUtils.getDataFromStr(component, fullVar, extraVars);
            
                        let fixedVal = (bindedVal && typeof(bindedVal) === 'object')? JSON.stringify(bindedVal, null, 2) : bindedVal;
                        
                        if (scopedVar.length === string.length && isPosibleObj) {
                            return bindedVal;
                        } else {
                            string = string.substring(0, startScopeIdx) + ((fixedVal || fixedVal === 0)? fixedVal : '') + string.substring(finishScopeIdx+FinishScope.length);
                        
                            i = startScopeIdx + ((fixedVal || fixedVal === 0)? fixedVal.length : 1);
                    
                            startScopeIdx = -1;
                            finishScopeIdx = -1;
                        }
                    }
                    return string;
                }
            
                return function bindInlineData(component, tTree) {
                
                    tTree[TypeTTPN] = _replaceScoped(tTree[TypeTTPN], component, false, tTree[VarsTTPN]);
                
                    for (let key in tTree[AttributesTTPN]) {
                        let curr = tTree[AttributesTTPN][key];
                        if (typeof(curr) === 'string') tTree[AttributesTTPN][key] = _replaceScoped(curr, component, true, tTree[VarsTTPN]);
                    }
                
                    for (let i = 0; i < tTree[ChildrenTTPN].length; i++) {
                        let child = tTree[ChildrenTTPN][i];
                        
                        if (typeof(child) === 'string') tTree[ChildrenTTPN][i] = _replaceScoped(child, component, false, tTree[VarsTTPN]);
                    }
                }
            })(),
            makeDataReactive: (() => {
                function _handleStateChange(cmp, path, newVal, oldVal, EventManager, isStore) {
                    // if (!cmp[isCreatedCPN]) return;
                    if (cmp[WatchCPN] && cmp[WatchCPN][path] && !cmp[IsDestroyedCPN] && !isStore) {
                        if (newVal !== oldVal) cmp[WatchCPN][path](newVal, oldVal);
                    }
                    EventManager.emit('SelectiveRender', cmp, undefined);
                }
                return (cmp, EventManager, isToStore) => {
                    if (isToStore) {
                        var cb = (val, oldVal, path) => _handleStateChange(cmp, path, val, oldVal, EventManager, true);
                        Utils.watchOnObj(cmp[StoreCPN][StateCPN], cb);
                        return cmp;
                    }
                    var cb = (val, oldVal, path) => _handleStateChange(cmp, path, val, oldVal, EventManager, false);
                    if (!cmp[StateCPN]) return cmp;
                
                    Utils.watchOnObj(cmp[StateCPN], cb, '', [], true);                
                    return cmp;
                }
            })(),
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
                return function createElFromTree(tTree, id = '') {
                    if (typeof(tTree) === 'string') return _createEl(tTree, true);
                    else if (tTree instanceof HTMLElement) return tTree;
                    else if (tTree[TypeTTPN] === NoneTemplateType) {
                        if (id) return _createEl(`<span ${ElIdAtrrName}="${id}"></span>`);
                        return _createEl('', true);
                    }
                    else if (tTree[ElementTTPN]) {
                        if (typeof(tTree[ElementTTPN]) === 'string') return _createEl(tTree[ElementTTPN]);
                        return tTree[ElementTTPN];
                    }
                    
                    var element = (function() {
                        let elType = tTree[TypeTTPN] || 'span';
                        var atrrsStr = '';
                        for (let name in tTree[AttributesTTPN]) atrrsStr += `${name}="${tTree[AttributesTTPN][name] || ''}" `;
                        return _createEl(`<${elType} ${atrrsStr}></${elType}>`);
                    })();
                
                    const {[EventsTTPN] : events} = tTree;
                    for (let evName in events) {
                        element['on'+evName] = events[evName];
                    }
                    
                    for (let child of (tTree[ChildrenTTPN])) {
                        if (child[TypeTTPN] === TemplateTemplateType) {
                            child[ChildrenTTPN].forEach(curr => {
                                element.appendChild(createElFromTree(curr));
                            });
                        }
                        else {
                            element.appendChild(createElFromTree(child));
                        }
                    }
                
                    return element;
                }
            })(),
            setRefs: (cmp) => {
                var cmpEl = cmp[GeneratedElementCPN];
                var cmpRefName = CmpUtils.createCmpRefAtrrName(cmp);
                var elRefs = cmpEl.querySelectorAll(`[${cmpRefName}]`);
                var refs = {};
                elRefs.forEach(el => {
                    let refName = el.getAttribute(`${cmpRefName}`);
                    refs[refName] = el;
                });
                cmp[ContextCPN][RefsCoPN] = refs;
            },
            setThis: (() => {
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
                        [WatchCPN, ComputedCPN, MethodsCPN].forEach(curr => {
                            let obj = cmp[curr];
                            if (obj) {
                                for (let key in obj) {
                                    obj[key] = obj[key].bind(cmp);
                                }
                            }
                        });
                    }

                    function setOnCmp(obj, isToWath, isToExecute = false) {
                        for (let key in obj) {
                            if (AllSavedCmpPropNames.includes(key)) createError(cmp, `'${key}' is a saved property`)
                            // if (isFunc) obj[key] = obj[key].bind(cmp);
                            let oldVal = cmp[key];
                            cmp[key] = (isToExecute) ? obj[key]() : obj[key];
                            let newVal = cmp[key];
                            if (isToWath) activateWatch(cmp, key, oldVal, newVal);
                        }
                    }
                    
                    var {[StateCPN] : state, [ComputedCPN] : computed, [MethodsCPN] : methods, [PropsCPN] : props, [RootPropsCPN]: rootProps} = cmp;
                    
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
                    if (computed) setOnCmp(computed, true, true);
                }
            })(),
        };
        function _extraOperationOnTemplateTree(templateTree) {
            templateTree = new TemplateTree(
                templateTree.type,
                templateTree.attributes,
                templateTree.children,
                {}, {}
            );
            templateTree.vars = {};
            setTreeAtrrsEvents(templateTree);
            function setTreeAtrrsEvents(templateTree) {
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
            }
            return templateTree;
        }  
        function _fixRefAttrNamesOnTree(tTree, cmp) {
            if (tTree[AttributesTTPN].ref) {
                tTree[AttributesTTPN][CmpUtils.createCmpRefAtrrName(cmp)] = tTree[AttributesTTPN].ref;
                delete tTree[AttributesTTPN].ref;
            }
            for (let i = 0; i < tTree[ChildrenTTPN].length; i++) {
                let currChild = tTree[ChildrenTTPN][i];
                if (typeof(currChild) === 'object') _fixRefAttrNamesOnTree(currChild, cmp);
            }
        }
        function copyCmp(cmp) {
            var copied = {...cmp};
            var objKeys = [ComputedCPN, WatchCPN, MethodsCPN];
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
                    try {
                        // let temp = new cmp(props);
                        // // if (temp[TemplateCPN] || temp[RenderCPN]) return 'constructor';
                        // if (typeof(temp) === 'object') return 'constructor';
                        // else return 'function';
                        // } catch(e) {return 'function'};
                        let temp = cmp(props);
                        if (temp) return 'function'
                        else return 'constructor'
                    } catch(e) {return 'constructor'};
                }
            }

            static getPreCompiledCmp(cmp, rootProps = {}, props = {}) {
                const CmpType = ComponentService.getCmpType(cmp, props);
                if (CmpType === 'element') return cmp;
                if (CmpType === 'string') return cmp;
                if (CmpType === 'function') return ComponentService.getPreCompiledCmp(cmp(props, rootProps), rootProps, rootProps[propsRPN]);            
                if (CmpType === 'constructor') {
                    cmp = new cmp(props, rootProps);
                    // cmp[IsInitedCPN] = true;
                    // return cmp;
                }
                if (CmpType === 'object') {
                    if (cmp[IsInitedCPN]) return cmp;
                    else {
                        cmp = copyCmp(cmp);
                        // cmp[IsInitedCPN] = true;
                        // return cmp;
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
            
            CompileCmp = (cmp, rootProps = {}) => {
                // var props = rootProps.props || {};

                const CmpType = ComponentService.getCmpType(cmp, rootProps[propsRPN]);
                cmp = ComponentService.getPreCompiledCmp(cmp, rootProps, rootProps[propsRPN]);
                if (cmp instanceof Element) return cmp;
                if (typeof cmp === 'string') return cmp;
            
                cmp[RootPropsCPN] = rootProps;
                function setEvents() {
                    let {[eventsRPN] : events} = rootProps;
                    cmp[ContextCPN][emitCoPN] = (evName, ...args) => {
                        // if (events[evName]) events[evName](...args);
                        if (events[evName]) events[evName](...args.reverse());
                    }
                }
                if (!cmp[isCreatedCPN]) {
                    cmp[idCPN] = Utils.getRandomId();
                    if (cmp[RoutesCPN] && this.RouterService) {
                        const RouterView = this.RouterService.RouterCmp(cmp[RoutesCPN]);
                        if (!cmp[ComponentsCPN]) cmp[ComponentsCPN] = {};
                        cmp[ComponentsCPN][RouterViewName] = RouterView;
                    }
                    let context = {};
                    if (cmp[StoreCPN]) {
                        CmpGFuncs.makeDataReactive(cmp, this.EventManager, true);
                        context[StoreCPN] = cmp[StoreCPN];
                    } else if (cmp[RootPropsCPN][StoreCPN]) {
                        context[StoreCPN] = cmp[RootPropsCPN][StoreCPN];
                    }
                    this._listenToRouterEvents(cmp);
                    // cmp[GeneratedTemplateCPN] = cmp[TemplateCPN] || cmp[RenderCPN]();
                    // cmp[InitTemplateTreeCPN] = CmpUtils.createTemplateTree(cmp[GeneratedTemplateCPN], _extraOperationOnTemplateTree, cmp);
                    cmp[InitTemplateTreeCPN] = CmpUtils.createTemplateTree(cmp[TemplateCPN] || cmp[RenderCPN](), _extraOperationOnTemplateTree, cmp);
                    _fixRefAttrNamesOnTree(cmp[InitTemplateTreeCPN], cmp);
                    cmp[InitTemplateTreeCPN].attributes[ElIdAtrrName] = cmp[idCPN];
                    
                    
                    context[routerCoPN] = this.RouterService.Router;

                    cmp[ContextCPN] = context;
                    setEvents();
                    
                    CmpGFuncs.setThis(cmp);
                    CmpGFuncs.makeDataReactive(cmp, this.EventManager, false);

                    cmp[isCreatedCPN] = true;
                    if (cmp[OnCreatedCPN]) cmp[OnCreatedCPN]();
                    if (cmp[OnMountedCPN]) {
                        let off = this.EventManager.on('RenderFinished', () => {
                            cmp[OnMountedCPN]();
                            off();
                        });
                    }
                }
                else {
                    CmpGFuncs.setThis(cmp);
                    setEvents();
                }
                if (cmp[OnRenderCPN]) {
                    let off = this.EventManager.on('RenderFinished', () => {
                        cmp[OnRenderCPN]();
                        off();
                    });
                }

                ComponentService._setCmpsBeforBinding(cmp);
            
                cmp[GeneratedTemplateTreeCPN] = JSON.parse(JSON.stringify(cmp[InitTemplateTreeCPN]));
            
                const setTree = (tTree, parentTree) => {
                    if (tTree.isSetted) return;
                    CmpGFuncs.bindConditions(cmp, tTree);
                    var listBindREs = CmpGFuncs.bindCmpList(cmp, tTree, parentTree);
                    if (listBindREs) return 'LIST_BINDED';
                    
                    CmpGFuncs.bindCmpModelData(cmp, tTree);
                    CmpGFuncs.bindInlineData(cmp, tTree);
                    CmpGFuncs.bindEvents(cmp, tTree);
                    CmpGFuncs.bindCmpCmps(cmp, tTree, ComponentService.GlobalCmps, setTree, this.CompileCmp);
            
                    tTree.isSetted = true;
                    
                    if (tTree[ChildrenTTPN]) {
                        for (let i = 0; i < tTree[ChildrenTTPN].length; i++) {
                            let child = tTree[ChildrenTTPN][i];
                            if (typeof(child) === 'object') {
                                let res = setTree(child, tTree);
                                if (res === 'LIST_BINDED') i--;
                            }
                        }
                    }
                }
                setTree(cmp[GeneratedTemplateTreeCPN], undefined);
                this.destroyCmps(cmp);
                
                var cmpEl = CmpGFuncs.createElFromTree(cmp[GeneratedTemplateTreeCPN], cmp[idCPN]);
                cmp[GeneratedElementCPN] = cmpEl;
                CmpGFuncs.setRefs(cmp);
            
                return cmp;
            }
        
            static _setCmpsBeforBinding = (component) => {
                if (!component[ComponentsCPN]) component[ComponentsCPN] = {}
                if (component[RootPropsCPN][RouterViewName]) component[ComponentsCPN][RouterViewName] = component[RootPropsCPN][RouterViewName];
                if (!component[GeneratedCmpsCPN]) component[GeneratedCmpsCPN] = {};
                else {
                    for (let cmpName in component[GeneratedCmpsCPN]) {
                        component[GeneratedCmpsCPN][cmpName].isExist = false;
                }}
            }
        
            destroyCmps = (cmp, isSelfDestroy, isDestroyAll) => {
                const destroyCmp = (cmp) => {
                    if (cmp[OnDestroyedCPN] && cmp[isCreatedCPN]) {
                        cmp[OnDestroyedCPN]();
                    }
                    if (typeof(cmp) === 'object') cmp[IsDestroyedCPN] = true;
                    if (cmp.disconnectEvents) cmp.disconnectEvents();
                    if (cmp[GeneratedCmpsCPN]) this.destroyCmps(cmp, false, true);
                }
            
                for (let cmpName in cmp[GeneratedCmpsCPN]) {
                    let currCmp = cmp[GeneratedCmpsCPN][cmpName];
                    if (!currCmp.isExist || isDestroyAll) {
                        destroyCmp(currCmp.cmp);
                        delete cmp[GeneratedCmpsCPN][cmpName];
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
                    if (key.substring(0, 7) === 'Router.') {
                        offFuncs.push(this.EventManager.on(key, watchEvents[key]));
                    }
                }
            }
        
            
        }
    })();

    class RouterService {
        static getHash() {
            // return window.location.href.split('#')[1]? window.location.href.split('#')[1].split('?')[0] : '/';
            return window.location.hash ? window.location.hash.split('#')[1] : '';
        }
        Routes = null;
        constructor(EventManager, CmpService, renderService) {
            this.EventManager = EventManager;
            // this.CmpService = CmpService;;
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
                    let currPath = 'Router.params.'+key;
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
            window.Routes = routes;
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
    
        selectiveRender = (component, selector) => {
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
            
            RenderService.renderElement_noVD(cmp, this.EventManager, selector);
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
    
        static renderElement_noVD(cmp, evManager, selector) {
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

    
    //////////////////// AvivJS ////////////////////
    //////////////////// AvivJS ////////////////////
    //////////////////// AvivJS ////////////////////
    //////////////////// AvivJS ////////////////////
    //////////////////// AvivJS ////////////////////

    class AvivJs {
        static EventManager = class {
            Events = {};
            on = (eventName, cbFunc, _id) => {
                if (!this.Events[eventName]) this.Events[eventName] = [];
                if (!_id) _id = Utils.getRandomId();
                var disConnectFunc = () => this.off(eventName, _id);
                var funcObj = {cbFunc, _id, off: disConnectFunc};
            
                this.Events[eventName].push(funcObj);
                return disConnectFunc;
            }
            off = (eventName, _id) => {
                var idx = this.Events[eventName].find(curr => curr._id === _id);
                if (idx === -1) throw new Error('Something went wrong');
                this.Events[eventName].splice(idx, 1);
            }
            emit = (eventName, ...args) => {
                if (!this.Events[eventName]) return;
                this.Events[eventName].forEach(curr => curr.cbFunc(...args));
            }
        }
        
        static Component = ComponentService.Component;

        constructor() {
            const EvManager = new AvivJs.EventManager();
            
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
        template = `
            <a @click.prevent="changeUrl()" href="{{link}}" class="Router-link {{className || ''}}">
                <content/>
            </a>
        `;
        computed = {
            link() {
                return '#' + this.url;
            }
        }
        methods = {
            changeUrl: () => {
                this.context.Router.push(this.url);
            }
        }
    }
    AvivJs.Component('RouterLink', RouterLink);

    return AvivJs;
})();