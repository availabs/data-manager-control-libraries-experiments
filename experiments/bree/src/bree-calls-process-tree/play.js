#!/usr/bin/env node

const { fork } = require("child_process");
const { join } = require("path");

const ping = fork(join(__dirname, "./subtasks/ping"));
const pong = fork(join(__dirname, "./subtasks/pong"));

let counter = 0;

function limitPlay() {
  if (counter++ > 3) {
    console.log("That's enough");
    process.exit();
  }
}

ping.on("message", (msg) => {
  limitPlay();
  console.log(msg.type);
  pong.send(msg);
});

pong.on("message", (msg) => {
  limitPlay();
  console.log(msg.type);
  ping.send(msg);
});

ping.send({ type: "PONG" });
