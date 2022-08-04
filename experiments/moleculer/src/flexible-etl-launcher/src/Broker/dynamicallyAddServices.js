const { join } = require("path");

const find = require("find");

const BrokerSingleton = require("./BrokerSingleton");

const rootDir = join(__dirname, "../services/");

console.log(rootDir);
const serviceDefPaths = find.fileSync(/service.js$/, rootDir);

console.log(JSON.stringify({ serviceDefPaths }, null, 4));

for (const f of serviceDefPaths) {
  const def = require(f);
  BrokerSingleton.createService(def);
}
