export const TestSuite = (desc = '', tests = [{ desc: '', expect: 'example', got: 'example', deep: false }], config = { dontLog: false }) => {
  const _deepCompare = (item1, item2) => {
    if ((typeof item1) !== (typeof item2)) return false;
    if (typeof item1 !== 'object') return item1 === item2;
    if (Array.isArray(item1)) {
      if (!Array.isArray(item2)) return false;
      return item1.every((c, i) => _deepCompare(c, item2[i]));
    }
    for (let key in item1) {
      if (!_deepCompare(item1[key], item2[key])) return false;
    }
    return true;
  }
  const _msg = (...msgs) => {if (!config.dontLog) console.log(...msgs);}
  _msg('#######################\n###### TEST SUIT ######\n#######################');
  _msg('## Test:', desc);
  let successCount = 0;
  tests.forEach((c, i) => {
    const {expect, got, desc: currDesc, deep} = c;
    const currSuccess = deep? _deepCompare(expect, got) : expect === got;
    if (currSuccess) successCount++;
    // ❌✔
    // else 
    _msg(`#### ${currSuccess? 'SUCCESS' : 'FAIL  !'} | Test ${i+1}: ${currDesc} ${ !currSuccess && ` | Expect: ${expect}, Got: ${got}` || ''}`);    
  });
  const isSuccess = successCount === tests.length;
  _msg(`## Finish! Success: ${successCount} / ${tests.length}`);
  _msg('#######################\n#### END TEST SUIT ####\n#######################');
  return isSuccess;
}

// TestSuite('Test example', [
//   {
//     desc: 'test 1 equals to 1',
//     expect: 1,
//     got: 1
//   },
//   {
//     desc: 'fail test 1 equals to 1',
//     expect: 1,
//     got: 2
//   },
//   {
//     desc: 'deep test',
//     deep: true,
//     expect: { name: 'aviv' },
//     got: { name: 'aviv' }
//   },
// ]);