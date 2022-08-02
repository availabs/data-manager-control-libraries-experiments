import { inspect } from "util";

import { Worker } from "bullmq";

const paintCar = (color: string) =>
  new Promise<"done">((resolve) => {
    console.log("Start painting car", color);

    setTimeout(() => {
      console.log("Done painting car ", color);

      resolve("done");
    }, 1000);
  });

export default function startPaintJobWorkers(verbose = false) {
  new Worker("Paint", async (job) => {
    if (verbose) {
      console.log(inspect(job));
    }

    if (job.name === "cars") {
      const status = await paintCar(job.data.color);
      console.log(status);
    }
  });
}
