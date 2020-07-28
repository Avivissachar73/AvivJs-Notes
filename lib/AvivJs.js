'use strict';

// export const AvivJs = (() => {
window.AvivJs = (() => {
    
    //////////////////// CONSTANTS ////////////////////
    //////////////////// CONSTANTS ////////////////////
    //////////////////// CONSTANTS ////////////////////
    //////////////////// CONSTANTS ////////////////////
    //////////////////// CONSTANTS ////////////////////

    const ElIdAtrrName = 'elid';

    const IfAtrr = 'A-if';
    const ForAtrr = 'A-for';
    const DataBindAtrr = 'A-model';
    const SavedAttrs = [IfAtrr, ForAtrr, DataBindAtrr];

    const StartVarScope = '{{';
    const FinishVarScope = '}}';

    const RouterViewName = 'RouterView';
    
    const NoneTemplateType = 'none';
    const templateTemplateType = 'template';


    // Component props;            // 'CPN' stands for 'component prop name';

    const StateCPN = 'state';
    const ComputedCPN = 'computed';
    const PropsCPN = 'props';
    // const GetPropsCPN = 'props';
    const MethodsCPN = 'methods';
    const OnCreatedCPN = 'onCreated';
    const OnDestroyedCPN = 'onDestroyed';
    const WatchCPN = 'watch';
    const NameCPN = 'name';
    const ComponentsCPN = 'components';
    const TemplateCPN = 'template';
    const RenderCPN = 'render';
    const OnMountedCPN = 'onMounted';
    const RootPropsCPN = 'rootProps';
    const StoreCPN = 'store';
    const IsDestroyedCPN = 'isDestroyed'
    const IsInitedCPN = 'isInit';

    // generatedCmp props;
    const isCreatedCPN = 'isCreated';
    const idCPN = 'id';
    const GeneratedTemplateTreeCPN = 'generatedTree';
    const InitTemplateTreeCPN = 'initTemplateTree';
    const GeneratedCmpsCPN = 'generatedCmps';
    const GeneratedElementCPN = 'element';
    const ContextCPN = 'context';

    const GeneratedTemplateCPN = 'generatedTemplate';

    const SavedCmpPropNames = [
        StateCPN,ComputedCPN,PropsCPN,MethodsCPN,OnCreatedCPN,OnDestroyedCPN,WatchCPN,NameCPN,
        ComponentsCPN,TemplateCPN,RenderCPN,OnMountedCPN,
        isCreatedCPN,idCPN,GeneratedTemplateTreeCPN,InitTemplateTreeCPN,GeneratedCmpsCPN,GeneratedElementCPN,
        ContextCPN,GeneratedTemplateCPN,RootPropsCPN,StoreCPN,IsDestroyedCPN
    ];

    const ErrorStr = 'Error';

    // Template tree props;

    // const treeAtrrsPropName = 'attributes';
    // const treeTypePropName = 'type';
    // const treeChildrenPropName = 'children';
    // const treeSplittedTemplatePropName = 'splittedTemplate';
    // const treeTemplatePropName = 'template';


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
                if (ignoreFilds.includes(key)) continue;
                const _key = key;
                if (!isNaN(+key)) key = +key; 
                let isCall = false;
                let path = basePath;
                path += path.length ? `.${key}` : key;
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
            const letterVals = Object.values(letterMap);
            let fixedStr = '';
            for (let i = 0; i < str.length; i++) {
                let curr = str[i];
                let lowerCurr = curr.toLowerCase();
                if (letterVals.includes(curr)) {
                    if (i === 0) fixedStr += lowerCurr;
                    if (str[i-1] && (str[i-1] !== ' ')) fixedStr += `-${lowerCurr}`;
                } else fixedStr += lowerCurr;
            }
            return fixedStr;
        }
    };
    
    function createError(cmp, msg) {
        let name = (cmp && cmp.name)? cmp.name : 'Anonymus'; 
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
                        type: CmpUtils.getElType(splitted[0]),
                        template: template,
                        splittedTemplate: splitted,
                        // attributes: {..._getAttrs(splitted[0]), [ElIdAtrrName]: Utils.getRandomId()},
                        attributes: _getAttrs(splitted[0]),
                        children: []
                    }
                    if (templateTree.attributes[ElIdAtrrName]) createError(cmp, `${ElIdAtrrName} is a saved attribute`);
                    templateTree.attributes[ElIdAtrrName] = Utils.getRandomId();
                    
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
                
                    if (itarateFunc) itarateFunc(templateTree);
                    
                    return templateTree;
                }
            })(),
            buildTemplateFromTree: function(tree) {
                if (typeof(tree) === 'string') return tree;
                if (tree.type === NoneTemplateType) return '';
            
                var attrsJSON = tree.attributes && Object.keys(tree.attributes).length ? JSON.stringify(tree.attributes) : '';
                var AttrsStr = attrsJSON ? attrsJSON.substring(2, attrsJSON.length-2).split('":"').join('="').split('","').join('" ')+'"' : '';
                var childrenStr = tree.children.map(curr => buildTemplateFromTree(curr)).join('');
                
                if (tree.type === templateTemplateType) return childrenStr;
                else return `<${tree.type || 'span'}${AttrsStr? ' '+AttrsStr : ''}>${childrenStr}</${tree.type || 'span'}>`;
            },
            createCmpRefAtrrName: (cmp) => {
                return `ref_${cmp.name}_${cmp.id}`;
            }
        };
        const CmpGFuncs = {
            bindConditions(component, tree) {
                if (!tree.attributes || !tree.attributes[IfAtrr]) return;
            
                var conditionStr = tree.attributes[IfAtrr];
            
                var conditionVal = CmpUtils.getDataFromStr(component, conditionStr);
            
                if (!conditionVal) {
                    tree.type = NoneTemplateType;
                    tree.children = [];
                }
            
                delete tree.attributes[IfAtrr];
            },
            bindCmpList: (() => {
                function updateTreeContent(tree, idEndPoint, vars, searchVal, replaceVal) {
                    // const SavedAttrs = ['A-if', 'A-model', 'A-for'];
                    tree.vars = {...tree.vars, ...vars};
                
                    const {attributes} = tree;
                
                    attributes[ElIdAtrrName] += idEndPoint;
                
                    if (tree.children) {
                        for (let i = 0; i < tree.children.length; i++) {
                            let child = tree.children[i];
                            if (typeof(child) === ('object')) updateTreeContent(child, idEndPoint, vars, searchVal, replaceVal);
                        }
                    }
                }
            
                return function BindCmpList(component, tree, parentTree) {
                    if (!tree.attributes || !tree.attributes[ForAtrr]) return;
                
                    var loopCmd = tree.attributes[ForAtrr];
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
                        arrToBind = CmpUtils.getDataFromStr(component, arrName, tree.vars);
                    }
                    
                    var bindedTrees = [];

                    if (Array.isArray(arrToBind) || typeof(arrToBind) === 'string') {
                        for (let i = 0; i < arrToBind.length; i++) {
                            let copyTree = JSON.parse(JSON.stringify(tree));
                    
                            let idEndPoint = `_${i}`;
                            
                            let vars = {
                                [itemName]: arrToBind[i],
                                [indexName]: i
                            }
                            
                            updateTreeContent(copyTree, idEndPoint, vars);
                            
                            delete(copyTree.attributes[ForAtrr]);
                    
                            bindedTrees.push(copyTree);
                        }
                    } else if (typeof(arrToBind) === 'object') {
                        for (let key in arrToBind) {
                            let copyTree = JSON.parse(JSON.stringify(tree));
                    
                            let idEndPoint = `_${key}`;
                            
                            let vars = {
                                [itemName]: arrToBind[key],
                                [indexName]: key

                            }
                            
                            updateTreeContent(copyTree, idEndPoint, vars);
                            
                            delete(copyTree.attributes[ForAtrr]);
                    
                            bindedTrees.push(copyTree);
                        }

                    }
                
                    if (bindedTrees && parentTree) {
                        let children = parentTree.children;
                        let idx = children.findIndex(curr => typeof(curr) === 'object' && curr.attributes.elid === tree.attributes.elid);
                        children.splice(idx, 1, ...bindedTrees);
                    }
                
                    return bindedTrees;
                }
            })(),
            bindCmpCmps(cmp, tree, globalCmps, setTreeFunc, CompileFunc) {
                const ContentName = 'content';
                const fixName = Utils.stringToLowerKabab;
            
                if (cmp[RootPropsCPN] && cmp[RootPropsCPN][ContentName] && tree.type === 'content') {
                    tree.type = 'template';
                    tree.children = cmp[RootPropsCPN][ContentName];
                    return;
                }
                
                var cmps = { ...globalCmps, ...cmp[ComponentsCPN]};
                // if (!Object.keys(cmps).includes(tree.type)) return;
                var cmpKey = Object.keys(cmps).find(curr => fixName(curr) === fixName(tree.type));
                if (!cmpKey) {
                    if (![...HtmlNativeElements, NoneTemplateType, TemplateCPN, fixName(RouterViewName)].includes(fixName(tree.type))) createError(cmp, `Unknown costume element ${tree.type}`);
                    return;
                }
                
                var fixedCmpKey = fixName(cmpKey);
                
                var props = {
                    props: tree.attributes, 
                    events: tree.events, 
                    [StoreCPN]: cmp[StoreCPN] || cmp[RootPropsCPN][StoreCPN], 
                    // [RouterViewName]: cmp[RootPropsCPN][RouterViewName],
                    [ContentName]: []
                };
            
                if (tree.children && tree.children.length) {
                    tree.children.forEach(child => {
                        if (typeof(child) === 'object') {
                            setTreeFunc(child);
                        }
                        props[ContentName].push(child);
                    });
                }
            
                let genCmp;
            
                let cmpTemplateKey = tree.attributes.key;
                let cmpGeneratedKey = (fixedCmpKey === fixName(RouterViewName))? RouterViewName : `${cmpKey}_${cmpTemplateKey || tree.attributes[ElIdAtrrName]}`;
            
                if (cmps[cmpKey].isRouter) {
                    cmps[cmpKey][GeneratedCmpsCPN] = {};
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
                
                let isExist = (typeof(genCmp) === 'string' && genCmp)? true : (genCmp[GeneratedTemplateCPN] && !genCmp[IsDestroyedCPN])? true : false;
            
                cmp[GeneratedCmpsCPN][cmpGeneratedKey] = {
                    isExist,
                    cmp: genCmp
                };
                if (isExist) tree.element = typeof(genCmp) === 'string'? genCmp : genCmp[GeneratedElementCPN];
                else {
                    tree.element = '';
                }
            },
            bindCmpModelData(component, tree) {
                if (!tree.attributes || !tree.attributes[DataBindAtrr]) return;
            
                var modelAttrVal = StateCPN+'.' + tree.attributes[DataBindAtrr].trim();

                var objsTree;
                var objBindField;
                var parentObjStr; 
                var objBindFieldVal;

                if (modelAttrVal[modelAttrVal.length-1] === ']') {
                    objsTree = modelAttrVal.split('[').map((curr, idx) => idx === 0 ? curr : '['+curr);
                    objBindField = objsTree[objsTree.length-1].substring(1,objsTree[objsTree.length-1].length-1);
                    objsTree.pop();
                    parentObjStr = objsTree.join('');
                    objBindFieldVal = CmpUtils.getDataFromStr(component, objBindField, tree.vars);
                } else {
                    objsTree = modelAttrVal.split('.');
                    objBindField = objsTree[objsTree.length-1];
                    objsTree.pop();
                    parentObjStr = objsTree.join('.'); 
                }
            
                var parentObj = CmpUtils.getDataFromStr(component, parentObjStr, tree.vars);

                var actualField = (objBindFieldVal !== undefined)? objBindFieldVal : objBindField;
                var generatedFunc = domEvOrVal => {
                    if (domEvOrVal instanceof Event) parentObj[actualField] = domEvOrVal.target.value;
                    else parentObj[actualField] = domEvOrVal;
                }
                // if (!tree.attributes.value) tree.attributes.value = `{{${tree.attributes[DataBindAtrr]}}}`; 
                if (!tree.attributes.value) tree.attributes.value = `${StartVarScope}${tree.attributes[DataBindAtrr]}${FinishVarScope}`; 
                tree.events.input = generatedFunc;
                
                delete tree.attributes[DataBindAtrr];
            },
            bindEvents: (() => {
                return function BindCmpFuncs(cmp, tree) {
                
                    if (!cmp[MethodsCPN]) return cmp;
                    if (!cmp[MethodsCPN]) cmp[MethodsCPN] = {};
            
                    let {events} = tree;
                    for (let evName in events) {
                        let curr = events[evName];
                        if (typeof(curr) === 'function') continue;
                        let method = CmpUtils.getDataFromStr(cmp, curr.methodName, tree.vars);
                        let inlineArgs = [];
                        if (curr.argsStrs.length) inlineArgs = curr.argsStrs.map(arg => CmpUtils.getDataFromStr(cmp, arg, tree.vars));
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
            
                return function bindInlineData(component, tree) {
                
                    tree.type = _replaceScoped(tree.type, component, false, tree.vars);
                
                    for (let key in tree.attributes) {
                        let curr = tree.attributes[key];
                        if (typeof(curr) === 'string') tree.attributes[key] = _replaceScoped(curr, component, true, tree.vars);
                    }
                
                    for (let i = 0; i < tree.children.length; i++) {
                        let child = tree.children[i];
                        
                        if (typeof(child) === 'string') tree.children[i] = _replaceScoped(child, component, false, tree.vars);
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
                    var elParentType = (() => {
                        const elType = CmpUtils.getElType(elString);
                        if (elType === 'tr') return 'table';
                        else if (elType === 'td') return 'tr';
                        return 'div';
                    })();
                    var elParent = document.createElement(elParentType);
                    elParent.innerHTML = elString;
                    return elParent.firstChild;
                }
                return function createElFromTree(tree, id = '') {
                    if (typeof(tree) === 'string') return _createEl(tree, true);
                    else if (tree instanceof HTMLElement) return tree;
                    else if (tree.type === NoneTemplateType) {
                        if (id) return _createEl(`<span ${ElIdAtrrName}="${id}"></span>`);
                        return _createEl('', true);
                    }
                    else if (tree.element) {
                        if (typeof(tree.element) === 'string') return _createEl(tree.element);
                        return tree.element;
                    }
                    
                    var element = (function() {
                        let elType = tree.type || 'span';
                        var atrrsStr = '';
                        for (let name in tree.attributes) atrrsStr += `${name}="${tree.attributes[name] || ''}" `;
                        return _createEl(`<${elType} ${atrrsStr}></${elType}>`);
                    })();
                
                    const {events} = tree;
                    for (let evName in events) {
                        element['on'+evName] = events[evName];
                    }
                    
                    for (let child of (tree.children)) {
                        if (child.type === templateTemplateType) {
                            child.children.forEach(curr => {
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
                cmp[ContextCPN].refs = refs;
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
                        [OnCreatedCPN, OnDestroyedCPN, OnMountedCPN].forEach(curr => {
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
                            if (SavedCmpPropNames.includes(key)) createError(cmp, `'${key}' is a saved property`)
                            // if (isFunc) obj[key] = obj[key].bind(cmp);
                            let oldVal = cmp[key];
                            cmp[key] = (isToExecute) ? obj[key]() : obj[key];
                            let newVal = cmp[key];
                            if (isToWath) activateWatch(cmp, key, oldVal, newVal);
                        }
                    }
                    
                    var {[StateCPN] : state, [ComputedCPN] : computed, [MethodsCPN] : methods, [PropsCPN] : props, [RootPropsCPN]: rootProps} = cmp;
                    
                    if (rootProps && rootProps.props && props) {
                        let propsFromRoot = rootProps.props;
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
        }  
        function _fixRefAttrNamesOnTree(tree, cmp) {
            if (tree.attributes.ref) {
                tree.attributes[CmpUtils.createCmpRefAtrrName(cmp)] = tree.attributes.ref;
                delete tree.attributes.ref;
            }
            for (let i = 0; i < tree.children.length; i++) {
                let currChild = tree.children[i];
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
        
            static _getCmpType = (cmp, props) => {
                if (typeof(cmp) === 'string') return 'string';
                else if (typeof(cmp) === 'object') return 'object';
                else if (typeof(cmp) === 'function') {
                    try {
                        let temp = new cmp(props);
                        if (temp[TemplateCPN] || temp[RenderCPN]) return 'constructor';
                        else return 'function';
                    } catch(e) {return 'function'};
                }
            }

            static getPreCompiledCmp(cmp, rootProps = {}, props = {}) {
                const CmpType = ComponentService._getCmpType(cmp, props);
                if (CmpType === 'string') return cmp;
                if (CmpType === 'object') {
                    // return cmp;
                    // if (cmp.name === 'note-list') console.log(cmp.name, cmp[IsInitedCPN]);
                    if (cmp[IsInitedCPN]) return cmp;
                    else {
                        cmp = copyCmp(cmp);
                        cmp[IsInitedCPN] = true;
                        return cmp;
                    }
                }
                if (CmpType === 'function') return ComponentService.getPreCompiledCmp(cmp(props, rootProps), rootProps);            
                if (CmpType === 'constructor') {
                    cmp = new cmp(props, rootProps);
                    cmp[IsInitedCPN] = true;
                    return cmp;
                }
                // return cmp;
            }
            
            CompileCmp = (cmp, rootProps = {}) => {
                // var props = rootProps.props || {};

                const CmpType = ComponentService._getCmpType(cmp, rootProps.props);
                cmp = ComponentService.getPreCompiledCmp(cmp, rootProps, rootProps.props);
                if (typeof cmp === 'string') return cmp;
            
                cmp[RootPropsCPN] = rootProps;
                function setEvents() {
                    let {events} = rootProps;
                    cmp[ContextCPN].emit = (evName, ...args) => {
                        // if (events[evName]) events[evName](...args);
                        if (events[evName]) events[evName](...args.reverse());
                    }
                }
                if (!cmp[isCreatedCPN]) {
                    cmp[idCPN] = Utils.getRandomId();
                    let context = {};
                    if (cmp[StoreCPN]) {
                        CmpGFuncs.makeDataReactive(cmp, this.EventManager, true);
                        context[StoreCPN] = cmp[StoreCPN];
                    } else if (cmp[RootPropsCPN][StoreCPN]) {
                        context[StoreCPN] = cmp[RootPropsCPN][StoreCPN];
                    }
                    this._listenToRouterEvents(cmp);
                    cmp[GeneratedTemplateCPN] = cmp[TemplateCPN] || cmp[RenderCPN]();
                    cmp[InitTemplateTreeCPN] = CmpUtils.createTemplateTree(cmp[GeneratedTemplateCPN], _extraOperationOnTemplateTree, cmp);
                    _fixRefAttrNamesOnTree(cmp[InitTemplateTreeCPN], cmp);
                    cmp[InitTemplateTreeCPN].attributes[ElIdAtrrName] = cmp[idCPN];
                    
                    
                    context.Router = this.RouterService.Router;

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

                ComponentService._setCmpsBeforBinding(cmp);
            
                cmp[GeneratedTemplateTreeCPN] = JSON.parse(JSON.stringify(cmp[InitTemplateTreeCPN]));
            
                const setTree = (tree, parentTree) => {
                    if (tree.isSetted) return;
                    CmpGFuncs.bindConditions(cmp, tree);
                    var listBindREs = CmpGFuncs.bindCmpList(cmp, tree, parentTree);
                    if (listBindREs) return 'LIST_BINDED';
                    
                    CmpGFuncs.bindCmpModelData(cmp, tree);
                    CmpGFuncs.bindInlineData(cmp, tree);
                    CmpGFuncs.bindEvents(cmp, tree);
                    CmpGFuncs.bindCmpCmps(cmp, tree, ComponentService.GlobalCmps, setTree, this.CompileCmp);
            
                    tree.isSetted = true;
                    
                    if (tree.children) {
                        for (let i = 0; i < tree.children.length; i++) {
                            let child = tree.children[i];
                            if (typeof(child) === 'object') {
                                let res = setTree(child, tree);
                                if (res === 'LIST_BINDED') i--;
                            }
                        }
                    }
                }
                setTree(cmp[GeneratedTemplateTreeCPN], undefined);
                this.destroyCmps(cmp);
                
                var cmpEl = CmpGFuncs.createElFromTree(cmp[GeneratedTemplateTreeCPN], cmp.id);
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
        
            destroyCmps = (component, isSelfDestroy, isDestroyAll) => {
                const destroyCmp = (cmp) => {
                    if (cmp[OnDestroyedCPN] && cmp[isCreatedCPN]) {
                        cmp[OnDestroyedCPN]();
                    }
                    if (typeof(cmp) === 'object') cmp[IsDestroyedCPN] = true;
                    if (cmp.disconnectEvents) cmp.disconnectEvents();
                    if (cmp[GeneratedCmpsCPN]) this.destroyCmps(cmp, false, true);
                }
            
                for (let cmpName in component[GeneratedCmpsCPN]) {
                    let currCmp = component[GeneratedCmpsCPN][cmpName];
                    if (!currCmp.isExist || isDestroyAll) {
                        destroyCmp(currCmp.cmp);
                        delete component[GeneratedCmpsCPN][cmpName];
                    }
                }
                if (isSelfDestroy) destroyCmp(component);
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
        constructor(EventManager, CmpService, executeFuncAfterRender) {
            this.EventManager = EventManager;
            // this.CmpService = CmpService;;
            this.executeFuncAfterRender = executeFuncAfterRender;
    
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
        push = (path) => {
            // if (typeof(path) !== 'string') return;
            if (path === this.Router.path) return;
    
            window.location.hash = path;
        }
        setRoutes(path) {
            var prevPath = this.Router.path;
            this.Router.path = path;
            let routesRes = RouterService._getCmpsTreeRes(path.split('/'), this.Routes);
            let isNewPath = prevPath !== path;
            if (isNewPath) this.EventManager.emit('RenderApp');
            else this._setRouterParams(routesRes.routerParams);
    
        }
        Router = {
            params: {},   
            path: RouterService.getHash(),  
            routerPath: '/',
            push: this.push
        }
    
        RouterCmp = (routes) => {
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
            if (splitedPath[0] === '') splitedPath = splitedPath.slice(1);
            var defaultComponent = RouterService._getDefaultPath(routes);
            if (!splitedPath.length || (splitedPath.length === 1 && !splitedPath[0])) return {cmps: [defaultComponent], routerParams: {}};
            var cmps = [];
            var currParent = routes;
            var routerParams = {};
    
            var isNextChild = true;
            while (isNextChild) {
                //finding closest cmp
                let currDefaultComponent = RouterService._getDefaultPath(currParent);
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
                
                if (!closestCmp) closestCmp = currDefaultComponent || '';  // CREATES AN INFINITE LOOP //
    
                cmps.push(closestCmp);
                splitedPath = splitedPath.splice(closestPathLength);
                if (closestCmp.children) currParent = closestCmp.children;
                else isNextChild = false;
            }
            if (!cmps.length && !cmps[0]) cmps = defaultComponent ? [defaultComponent] : [''];
            return {cmps, routerParams};
        }
    
    
        static _getDefaultPath(routes) {
            return routes.find(route => route.path === '/' || route.path === '/') || null;
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
        }
        Root = {
            cmp: null,
            instance: null,
            isRenderOn: false
        }
    
        RootComponent = (selector, component) => {
            this.Root.instance = component;
            const renderApp = () => {
                let isFirst = this.Root.cmp ? false : true;
                let cmp = this.CmpService.CompileCmp(this.Root.cmp || this.Root.instance);
                if (isFirst) {
                    this.Root.cmp = cmp;
                    window.RootCmp = this.Root.cmp;
                }
                // RenderService.renderElement_noVD(cmp, selector, this.EventManager);
                this.selectiveRender(cmp, selector);
            }
            this.EventManager.on('RenderApp', renderApp);
            this.EventManager.on('SelectiveRender', this.selectiveRender);
            document.body.onload = renderApp;
        }
    
        selectiveRender = (component, selctor) => {
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
            
            RenderService.renderElement_noVD(cmp, this.EventManager, selctor);
            // RenderService.render(cmp, this.EventManager, selctor);
            
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
                elParent.replaceChild(cmp.element, oldEl);
            }
            else if (selector) {
                document.querySelector(selector).appendChild(cmp.element);
            }
            evManager.emit('RenderFinished');
        }

        static render = (() => {
            function updateElBy(original, compare) {
                // if (typeof(original) !== 'object') return compare;
                // if (!compare) return compare;
                // let allKeys = new Set([...Object.keys(original), ...Object.keys(compare)]);
                // let allKeys = [...Object.keys(original), ...Object.keys(compare)];
                // for (let i = 0; i < allKeys.length; i++) {
                    // let key = allKeys[i];
                // for (let key of allKeys) {
                // for (let key in original) {
                //     continue;
                //     console.log(key);
                //     if (key === 'children') continue;
                //     if (Array.isArray(original[key])) continue;
                //     // if (original[key] === undefined) original[key] = compare[key];
                //     else original[key] = updateElBy(original[key], compare[key]);
                //     // else original[key] = compare[key];
                // }
                // original.classList = compare.classList;

                // var originalAtrrs = original.attributes;
                // var compareAttrs = compare.attributes;
                // var allAttrs = {...originalAtrrs, ...compareAttrs};
                // var attrsKeys = [...Object.keys(allAttrs)];
                // // console.log(attrsKeys);
                // attrsKeys = attrsKeys.map(curr => allAttrs[curr].name);
                // // console.log(attrsKeys);
                // for (let key of attrsKeys) {
                //     // let originalVal = originalAtrrs[key].value;
                //     // let compareVal = compareAttrs[key].value;
                //     // original.setAttribute(key, allAttrs[key] && allAttrs[key].value || '');
                //     // if (key === 'class') console.log(allAttrs[key] && allAttrs[key].value);
                //     if (key === 'class') continue;
                //     original[key] = allAttrs[key]? allAttrs[key].value : '';
                // }
                
                for (let i = 0; i < original.children.length; i++) {
                    let child = original.children[i];
                    let currId = child.getAttribute(ElIdAtrrName);
                    let currInCompareIdx = findIdx(compare.children, curr => curr.getAttribute(ElIdAtrrName) === currId);
                    if (currInCompareIdx === -1) {
                        original.removeChild(child);
                        continue;
                    }
                    else if (i !== currInCompareIdx) {
                        original.removeChild(child);
                        original.insertBefore(child, original.children[currInCompareIdx+1]);
                    }
                    else {
                        let childInCompare = compare.children[currInCompareIdx];
                        updateElBy(child, childInCompare);
                    }
                }
                for (let i = 0 ; i < compare.children.length; i++) {
                    let child = compare.children[i];
                    let currId = child.getAttribute(ElIdAtrrName);
                    let originalIdx = findIdx(original.children, curr => curr.getAttribute(ElIdAtrrName) === currId);
                    // if (child.classList[0] === 'note-list1') console.log(compare);
                    let childInOriginal = original.children[originalIdx];
                    // if (child.localName === 'main') console.log('child in compare:', originalIdx, child);
                    if (originalIdx === -1) {
                        // console.log('nononno!');
                        // original.insertBefore(child, original.children[i+1]);
                        original.appendChild(child);
                    } else {
                        updateElBy(childInOriginal, child);
                        // console.log(originalIdx, original);
                        // original.appendChild(child);
                        // original.replaceChild(child, original.children[originalIdx])
                        // console.log('equal idxs:', child);
                    }
                }
                
                return original;
            }
            return (cmp, evManager, selector = '') => {
                let elInDom = document.querySelector(`[${ElIdAtrrName}="${cmp[idCPN]}"]`);
                let elInCmp = cmp.element;
                // console.log('rendering..:', cmp.name, selector);
                // console.dir(elInCmp);
                if (elInDom && elInCmp) {
                    // VIRTUAL DOM FANCTIONALITY;
                    // console.dir(elInDom);
                    // console.dir(elInCmp);
                    updateElBy(elInDom, elInCmp);
                    // let elParent = elInDom.parentNode;
                    // elParent.replaceChild(elInCmp, elInDom);
                } else if (selector) {
                    // console.log('rendering with selector', cmp.name);
                    document.querySelector(selector).appendChild(cmp.element);
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
            const executeFuncAfterRender = renderService.executeFuncAfterRender;
            this.RootComponent = renderService.RootComponent;
            
            const routerService = new RouterService(EvManager, componentService, executeFuncAfterRender);
            this.RouterCmp = routerService.RouterCmp;
            componentService.RouterService = routerService;
            componentService.RenderService = renderService;
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