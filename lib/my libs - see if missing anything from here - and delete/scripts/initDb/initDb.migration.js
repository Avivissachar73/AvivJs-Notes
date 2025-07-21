const dbService = require('../../services/db.service');

const initDb = async (log = true) => {
  const dataToInsert = [
    { // example collection
      col: require('../../api/example/example.service').col,
      items: require('../../api/example/example.collection.js').defaultExamples,
    },
    { // activity collection
      col: require('../../api/activity/activity.service').col,
      items: require('../../api/activity//activity.collection.js').defaultActivities,
    },
    { // account collection
      col: require('../../api/account/account.service').col,
      items: require('../../api/account/account.collection.js').defaultAccounts,
    },
    { // settings collection
      col: require('../../api/settings/settings.service').col,
      items: require('../../api/settings/settings.collection').defaultSettings,
    },
    { // organization collection
      col: require('../../api/organization/organization.service').col,
      items: require('../../api/organization/organization.collection').defaultOrgs,
    },
    { // post collection
      col: require('../../api/post/post.service').col,
      items: require('../../api/post/post.collection').defaultPosts,
    },
    { // comment collection
      col: require('../../api/comment/comment.service').col,
      items: require('../../api/comment/comment.collection').defaultComments,
    },
    { // bug collection
      col: require('../../api/bug/bug.service').col,
      items: require('../../api/bug/bug.collection').defaultBugs,
    },
    { // shopping_list collection
      col: require('../../api/shoppingList/shoppingList.service').col,
      items: require('../../api/shoppingList/shoppingList.collection').defaultShoppingLists,
    },
  ];

  if (log) console.log('INSERTING DATA TO ENV: ' + process.env.NODE_ENV);

  const _dbService = dbService.getService();
  
  const db = await _dbService.connect();
  let allCols = await db.listCollections().toArray();
  allCols = allCols.map(c => c.name);

  const prms = dataToInsert.map(async data => {
    if (log) console.log('##');
    if (log) console.log('## INSERTING COLLECTION: ' + data.col);
    try {
      // if (!db.collectionExists(data.col)) await db.createCollection(data.col);
      if (!allCols.includes(data.col)) await db.createCollection(data.col);
      if (data.items.length) await _dbService.insert(data.col, data.items);
      if (log) console.log('## DONE INSERTING COLLECTION: ' + data.col, data.items.length, ' ITEMS');
    } catch(err) {
      if (log) console.log('## ERROR WHILE INSERTING COLLECTION: ' + data.col);
      console.error(err);
    }
    if (log) console.log('##');
    return true;
  });
  
  const res = await Promise.all(prms);
  if (log) console.log('DONE INSERTING DATA TO ENV: ' + process.env.NODE_ENV);
  return res;
};

module.exports = initDb;