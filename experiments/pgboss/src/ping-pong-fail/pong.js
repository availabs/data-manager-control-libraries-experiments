#!/usr/bin/env node

// https://github.com/timgit/pg-boss/blob/dbd8f981b955f53ae503cc9cac6d835fa7bae33d/README.md

const PgBoss = require("pg-boss");

const postgresConnectionString = require("../../config/postgresConnectionString");

class Pong {
  constructor(boss, queue) {
    this.boss = boss;
    this.queue = queue;
  }

  async someAsyncJobHandler(job) {
    if (job.data.type === "PING") {
      console.log("==== PONG ====");
      await new Promise((resolve) =>
        setTimeout(async () => {
          await this.boss.send(this.queue, { type: "PONG" });
          resolve();
        }, 1000)
      );
    } else {
      // If this isn't the handler for the event type, need to resend it.
      // Very poor model.
      //   Requires luck that the proper handler eventually gets the event.
      console.log("Pong passing along", job.data.type);
      await this.boss.send(this.queue, job.data);
    }
  }
}

async function main() {
  const boss = new PgBoss(postgresConnectionString);

  await boss.start();

  const queue = "some-queue";

  const pong = new Pong(boss, queue);

  console.log("Starting Pong");
  await boss.work(queue, pong.someAsyncJobHandler.bind(pong));
}

main();
