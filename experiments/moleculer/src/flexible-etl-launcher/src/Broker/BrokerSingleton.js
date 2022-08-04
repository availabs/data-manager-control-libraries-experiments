const { ServiceBroker } = require("moleculer");

const broker = new ServiceBroker({ logger: console });

broker.start();

module.exports = broker;
