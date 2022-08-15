export default class PausableSuperStepController {
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
