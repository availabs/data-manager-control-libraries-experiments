const main = require(".");

const builder = {
  file_path: {
    desc: "Path to the file containing the number to add to.",
    type: "string",
    demand: true,
    alias: "f",
  },

  summand: {
    desc: "The number to add to the number in file_path.",
    type: "number",
    demand: true,
    alias: "n",
  },
};

const add = {
  desc: "Read the number contained in the specified file, add the specified summand to it, and write the sum back to the file.",
  command: "add",
  builder,
  async handler(argv) {
    await main(argv);
  },
};

module.exports = { add };
