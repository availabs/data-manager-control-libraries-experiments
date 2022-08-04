const getServiceName = require("../../utils/getServiceName");

const addAction = require("./add/service_action");
const multiplyAction = require("./multiply/service_action");

module.exports = {
  name: getServiceName(__dirname),
  actions: { ...addAction, ...multiplyAction },
};
