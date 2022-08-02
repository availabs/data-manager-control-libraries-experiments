#!/usr/bin/env node

// https://github.com/timgit/pg-boss/blob/dbd8f981b955f53ae503cc9cac6d835fa7bae33d/README.md

const PgBoss = require("pg-boss");

const postgresConnectionString = require("../../config/postgresConnectionString");

class Ping {
  constructor(boss, queue) {
    this.boss = boss;
    this.queue = queue;
  }

  async someAsyncJobHandler(job) {
    if (job.data.type === "PONG") {
      console.log("==== PING ====");

      await new Promise((resolve) =>
        setTimeout(async () => {
          await this.boss.send(this.queue, { type: "PING" });
          resolve();
        }, 1000)
      );
    } else {
      // If this isn't the handler for the event type, need to resend it.
      // Very poor model.
      //   Requires luck that the proper handler eventually gets the event.
      console.log("Ping passing along", job.data.type);
      await this.boss.send(this.queue, job.data);
    }
  }
}
async function main() {
  const boss = new PgBoss(postgresConnectionString);

  await boss.start();

  const queue = "some-queue";

  const ping = new Ping(boss, queue);

  console.log("Starting Ping");

  await boss.work(queue, ping.someAsyncJobHandler.bind(ping));
}

main();
