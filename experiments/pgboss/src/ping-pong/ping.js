#!/usr/bin/env node

// https://github.com/timgit/pg-boss/blob/dbd8f981b955f53ae503cc9cac6d835fa7bae33d/README.md

const PgBoss = require("pg-boss");

const postgresConnectionString = require("../../config/postgresConnectionString");

async function main() {
  console.log("==== PING ====");

  const boss = new PgBoss(postgresConnectionString);

  await boss.start();

  const queue = "some-queue";

  await boss.send(queue, { type: "PING" });

  await boss.stop();
}

main();
