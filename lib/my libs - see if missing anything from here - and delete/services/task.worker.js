const { TaskManager } = require("./TaskManager");
const dbService = require('./db.service');


const COLLECTION_NAME = 'task';

async function runWorker(loopTime = 10000){
  await runTasks();
  setTimeout(runWorker, loopTime);
}
runWorker();

module.exports = {
  createHandleCb,
  appendTask
}

async function runTasks() {
  const collection = await dbService.getCollection(COLLECTION_NAME);
  const tasksToDo = await collection.find({ done: false }).toArray();
  const relevantTasks = tasksToDo.filter(c => c.startAt <= Date.now());
  const Tasker = new TaskManager(executeCb, 3, 10, onError, undefined, true);
  // await Tasker.appendTasks(relevantTasks);
  await Promise.all(relevantTasks.map(async c => {
    const resolvedTask = await Tasker.appendTask(c);
    c.status = resolvedTask.status;
    c.errors = resolvedTask.errors;
    c.done = true;
    await collection.updateOne({ _id: c._id }, { $set: c });
  }));
}


const handleTaskMap = {};
async function executeCb(taskData) {
  if (handleTaskMap[taskData.type]) return handleTaskMap[taskData.type](taskData.data);
}

function createHandleCb(handleType, handleCb) {
  handleTaskMap[handleType] = handleCb;
}

async function onError() {

}

async function appendTask(type, data, startAt) {
  const task = {
    type,
    startAt: startAt || Date.now(),
    status: 'pending',
    data,
    errors: [],
    done: false,
    createdAt: Date.now()
  }
  const collection = await dbService.getCollection(COLLECTION_NAME);
  collection.insertOne(task);
}