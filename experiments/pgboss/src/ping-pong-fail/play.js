#!/usr/bin/env node

const { fork } = require("child_process");
const { join } = require("path");

const PgBoss = require("pg-boss");

const postgresConnectionString = require("../../config/postgresConnectionString");

async function main() {
  fork(join(__dirname, "./ping"));
  fork(join(__dirname, "./pong"));

  const boss = new PgBoss(postgresConnectionString);

  await boss.start();

  const queue = "some-queue";

  boss.send(queue, { type: "PONG" });
}

main();
