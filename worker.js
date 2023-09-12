const { parentPort, workerData } = require('worker_threads');
const getPcapData = require("./NAPI/build/Release/operations");

const index = workerData.index;
const indexInterface = workerData.indexInterface;

function checkDivisibility() {
  while (true) {
      let result = getPcapData.OperationsLiveCapture(parseInt(indexInterface));
      parentPort.postMessage(result);
  }
}

checkDivisibility();