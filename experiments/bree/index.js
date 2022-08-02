const Bree = require("bree");

const bree = new Bree({
  jobs: ["job"],
});

(async () => {
  await bree.start();
})();
