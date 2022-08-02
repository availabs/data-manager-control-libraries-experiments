#!/usr/bin/env node

// https://github.com/timgit/pg-boss/blob/dbd8f981b955f53ae503cc9cac6d835fa7bae33d/README.md

const PgBoss = require("pg-boss");

const postgresConnectionString = require("../../config/postgresConnectionString");

async function main() {
  const boss = new PgBoss(postgresConnectionString);

  await boss.start();

  const queue = "pong-queue";

  await boss.subscribe("PONG", queue);

  setInterval(async () => {
    const job = await boss.fetch(queue);

    if (job) {
      try {
        if (job.data.type === "PONG") {
          console.log("==== PING ====");

          await boss.publish("PING", { type: "PING" });
        } else {
          console.log("ping received", job.data.type);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, 1000);
}

main();
