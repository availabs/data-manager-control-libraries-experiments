import { TaskI, EtlTaskName } from "../types";

export default class MockNpmrdsPublishTravelTimes implements TaskI {
  readonly name: EtlTaskName;

  private _done: boolean;
  private _resolveDoneData: Function;
  readonly doneData: Promise<Record<string, any>>;
  private dependencies: TaskI[];

  static readonly dependenciesNames = [
    EtlTaskName.npmrds_load_travel_times,
    EtlTaskName.npmrds_prepublish_qa,
  ];

  constructor() {
    this.name = EtlTaskName.npmrds_publish_travel_times;

    this._done = false;

    this.doneData = new Promise((resolve) => (this._resolveDoneData = resolve));
  }

  receiveOthers(others: TaskI[]) {
    this.dependencies = others.filter((o) =>
      MockNpmrdsPublishTravelTimes.dependenciesNames.includes(o.name)
    );
  }

  get done() {
    return this._done;
  }

  async step() {
    if (this.done) {
      return;
    }

    const pendingDeps = this.dependencies
      .filter((d) => !d.done)
      .map(({ name }) => name);

    if (pendingDeps.length) {
      console.log(`==> task ${this.name}: awaiting ${pendingDeps}`);
      return;
    }

    console.log();
    console.log(
      `==> MOCK ${this.name}: published new npmrds travel times table`
    );
    console.log();

    const doneData = {
      npmrds_table: "mock.npmrds_yYYYYmMM",
    };

    process.nextTick(() => this._resolveDoneData(doneData));

    this._done = true;
  }
}
