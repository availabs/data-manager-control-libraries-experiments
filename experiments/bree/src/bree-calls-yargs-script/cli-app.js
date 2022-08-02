#!/usr/bin/env node

// https://github.com/yargs/yargs/blob/f91d9b334ad9cfce79a89c08ff210c622b7c528f/docs/examples.md#with-yargs-the-options-be-just-a-hash

var argv = require("yargs/yargs")(process.argv.slice(2)).argv;

if (argv.ships > 3 && argv.distance < 53.5) {
  console.log("Plunder more riffiwobbles!");
} else {
  console.log("Retreat from the xupptumblers!");
}
