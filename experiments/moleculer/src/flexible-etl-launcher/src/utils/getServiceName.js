const { join, relative } = require("path");

const root = join(__dirname, "../../src/services");

module.exports = function getServiceName(servicePath) {
  return relative(root, servicePath);
};
