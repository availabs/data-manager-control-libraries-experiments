const { readFileSync } = require("fs");
const { join } = require("path");

const dotenv = require("dotenv");

const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = dotenv.parse(
  readFileSync(join(__dirname, "./postgres.env"), { encoding: "utf8" })
);

// https://github.com/timgit/pg-boss/blob/master/docs/readme.md#newconnectionstring
const connectionString = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`;

module.exports = connectionString;
