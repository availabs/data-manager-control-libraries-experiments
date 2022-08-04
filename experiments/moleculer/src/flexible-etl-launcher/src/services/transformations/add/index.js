const { existsSync } = require("fs");

const {
  readFile: readFileAsync,
  writeFile: writeFileAsync,
} = require("fs/promises");

module.exports = async function add({ file_path, summand }) {
  const n = +summand;

  if (!Number.isFinite(n)) {
    throw new Error(`Invalid summand: ${summand}`);
  }

  let initial = 0;

  if (existsSync(file_path)) {
    const s = await readFileAsync(file_path, { encoding: "utf8" });
    initial = +s;

    if (!Number.isFinite(initial)) {
      throw new Error(`${file_path} does not include a valid number: ${s}`);
    }
  }

  const sum = initial + summand;

  await writeFileAsync(file_path, `${sum}`);
};
