#!/usr/bin/env node

const { fork } = require("child_process");
const { join } = require("path");

const PgBoss = require("pg-boss");

const postgresConnectionString = require("../../config/postgresConnectionString");

const ping = join(__dirname, "ping.js");
const pong = join(__dirname, "pong.js");

async function doPing() {
  try {
    await new Promise((resolve, reject) =>
      fork(ping).on("error", reject).on("exit", resolve)
    );
  } catch (err) {
    console.error(err);
  }
}

async function doPong() {
  try {
    await new Promise((resolve, reject) =>
      fork(pong).on("error", reject).on("exit", resolve)
    );
  } catch (err) {
    console.error(err);
  }
}

async function manager(job) {
  try {
    switch (job.data.type) {
      case "PING":
        return await doPong();
      case "PONG":
        return await doPing();
      default:
        throw new Error("What?");
    }
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  try {
    const boss = new PgBoss(postgresConnectionString);

    await boss.start();

    const queue = "some-queue";

    await doPing();

    boss.work(queue, manager);
  } catch (err) {
    console.error(err);
  }
}

main();
