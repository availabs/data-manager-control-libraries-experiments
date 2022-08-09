import _ from "lodash";

// import EventBus from "../EventBus";

import { TaskI } from "../types";

export class PausableSuperStepController {
  private stepNum: number;
  private paused: boolean;
  private stopped: boolean;

  constructor(private interval_ms = 500) {
    this.stepNum = 0;
    this.paused = true;
    this.stopped = false;
  }

  pause() {
    this.paused = true;
  }

  step() {
    this.paused = false;
    process.nextTick(() => {
      this.paused = true;
    });
  }

  play() {
    this.paused = false;
  }

  stop() {
    this.stopped = true;
  }

  async *makeStepGenerator(): AsyncGenerator<number> {
    console.log("makeStepGenerator");
    while (true) {
      if (this.stopped) {
        break;
      }

      if (!this.paused) {
        yield ++this.stepNum;
      }

      await new Promise((resolve) => setTimeout(resolve, this.interval_ms));
    }
  }
}

export function makeStepAsyncGenerator(
  interval_ms = 500
): AsyncGenerator<number> {
  const contoller = new PausableSuperStepController(interval_ms);

  contoller.play();

  return contoller.makeStepGenerator();
}

export class SuperStepEtlController {
  private _done: boolean;
  private _resolveDoneData: Function;
  readonly doneData: Promise<Record<string, any>>;

  constructor(
    private readonly tasks: TaskI[],
    private readonly stepGenerator: AsyncGenerator<number> = makeStepAsyncGenerator()
  ) {
    tasks.forEach((t) => t.receiveOthers(tasks));

    this._done = false;

    this.doneData = new Promise((resolve) => (this._resolveDoneData = resolve));
  }

  get done() {
    return this._done;
  }

  async main() {
    let pending = _.shuffle(this.tasks.filter(({ done }) => !done));

    for await (const step of this.stepGenerator) {
      console.log("-".repeat(20));
      console.log();
      console.log("STEP:", step);
      console.log();

      // Because of SQLite locking issue, we need to run sequentially
      // for (const task of pending) {
      // await task.step();
      // }

      await Promise.all(pending.map((t) => t.step()));

      const wasPending = pending.slice();
      pending = _.shuffle(pending.filter((t) => !t.done));

      // const finished = _.difference(wasPending, pending);

      if (pending.length === 0) {
        break;
      }
    }

    pending = pending.filter((t) => !t.done);

    if (pending.length === 0) {
      console.error("ALL UPDATES COMPLETED");
    } else {
      console.error("UPDATES WERE STOPPED BEFORE ALL COMPLETED");
    }

    const doneData = this.tasks.reduce((acc, task) => {
      acc[task.name] = task.doneData;
      return acc;
    }, {});

    process.nextTick(() => this._resolveDoneData(doneData));

    this._done = true;

    return doneData;
  }
}
