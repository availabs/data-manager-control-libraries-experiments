#!/usr/bin/env node

const { fork } = require("child_process");
const { join } = require("path");

const PgBoss = require("pg-boss");

const postgresConnectionString = require("../../config/postgresConnectionString");

async function main() {
  fork(join(__dirname, "./ping"));
  fork(join(__dirname, "./pong"));

  const boss = await new PgBoss(postgresConnectionString).start();

  boss.publish("PONG", { type: "PONG" });
}

main();
