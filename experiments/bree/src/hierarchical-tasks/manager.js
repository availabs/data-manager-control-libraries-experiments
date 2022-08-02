const { join } = require("path");

const Bree = require("bree");

const bree = new Bree({
  jobs: [
    {
      name: "worker_1",
      path: join(__dirname, "./worker_1.js"),
    },
    {
      name: "worker_2",
      path: join(__dirname, "./worker_2.js"),
    },
  ],
  root: false,
});

(async () => {
  await bree.start();
})();
