const { mkdirSync } = require("fs");
const { basename, join } = require("path");
const { inspect } = require("util");

const main = require(".");

const dataDir = join(__dirname, "../../../../data");
mkdirSync(dataDir, { recursive: true });

module.exports = {
  add(ctx) {
    // console.log(inspect(ctx));

    const {
      params: { f, n },
    } = ctx;

    const b = basename(f);
    const file_path = join(dataDir, b);

    return main({ file_path, summand: n });
  },
};
