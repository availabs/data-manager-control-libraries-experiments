const { workerData } = require("node:worker_threads");
const process = require("node:process");

console.log(JSON.stringify(workerData, null, 4));

process.exit(0);
