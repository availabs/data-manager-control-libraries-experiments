#!/usr/bin/env node

// https://github.com/timgit/pg-boss/blob/dbd8f981b955f53ae503cc9cac6d835fa7bae33d/README.md

const PgBoss = require("pg-boss");

const postgresConnectionString = require("../../config/postgresConnectionString");

async function main() {
  const boss = new PgBoss(postgresConnectionString);

  boss.on("error", (error) =>
    console.log(JSON.stringify({ type: "PGBOSS/ERROR", error }, null, 4))
  );

  boss.on("maintenance", (event) =>
    console.log(
      JSON.stringify({ type: "PGBOSS/MAINTENANCE", payload: event }, null, 4)
    )
  );

  boss.on("monitor-states", (event) =>
    console.log(
      JSON.stringify({ type: "PGBOSS/MONITOR-STATES", payload: event }, null, 4)
    )
  );

  boss.on("wip", (event) =>
    console.log(JSON.stringify({ type: "PGBOSS/WIP", payload: event }, null, 4))
  );

  boss.on("stopped", (event) =>
    console.log(
      JSON.stringify({ type: "PGBOSS/STOPPED", payload: event }, null, 4)
    )
  );

  await boss.start();

  const queue = "some-queue";

  let jobId = await boss.send(queue, { type: "foo" });

  console.log(`created job in queue ${queue}: ${jobId}`);

  jobId = await boss.send(queue, { type: "bar" });

  console.log(`created job in queue ${queue}: ${jobId}`);

  await boss.work(queue, someAsyncJobHandler);
}

async function someAsyncJobHandler(job) {
  console.log(`job ${job.id} received with data:`);
  console.log(JSON.stringify(job, null, 4));

  try {
    const result = await doSomethingAsyncWithThis(job.data);

    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

const doSomethingAsyncWithThis = (data) =>
  new Promise((resolve, reject) => {
    switch (data.type) {
      case "foo":
        return resolve("FOO");
      case "bar":
        return resolve("BAR");
      default:
        return reject(new Error("Unrecognized Event Type"));
    }
  });

main();
