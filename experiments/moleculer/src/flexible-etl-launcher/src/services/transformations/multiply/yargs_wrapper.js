const main = require(".");

const builder = {
  file_path: {
    desc: "Path to the file containing the number to add to.",
    type: "string",
    demand: true,
    alias: "f",
  },

  multiplier: {
    desc: "The number to multiply to the number in file_path.",
    type: "number",
    demand: true,
    alias: "n",
  },
};

const multiply = {
  desc: "Read the number contained in the specified file, multiply it by the specified multiplier, and write the product back to the file.",
  command: "multiply",
  builder,
  async handler(argv) {
    await main(argv);
  },
};

module.exports = { multiply };
