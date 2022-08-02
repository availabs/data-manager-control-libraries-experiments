// If using the test redis server provided in this repository,
//   the configuration is set in ../../redis/docker/config/redis.config

const username = "";
const password = "dev3loper";
const host = "127.0.0.1";

module.exports = `redis://${username}:${password}/@${host}:${port}`;
