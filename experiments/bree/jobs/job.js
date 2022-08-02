// https://github.com/breejs/bree/blob/bbfa7d945ca57c4cab1fb3a9ea23191178d99bab/examples/commonjs/jobs/job.js

const { parentPort } = require("node:worker_threads");
const process = require("node:process");

console.log("Hello Commonjs!");

// signal to parent that the job is done
if (parentPort) parentPort.postMessage("done");
// eslint-disable-next-line unicorn/no-process-exit
else process.exit(0);
