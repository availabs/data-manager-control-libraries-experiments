import EventBus from "../EventBus";

import { TaskI, EtlTaskName } from "../types";

export default class MockNpmrdsPrepublishQA implements TaskI {
  readonly name: EtlTaskName;

  private _done: boolean;
  private _resolveDoneData: Function;
  readonly doneData: Promise<Record<string, any>>;
  private dependencies: TaskI[];

  private approved: null | boolean;

  static readonly dependenciesNames = [
    EtlTaskName.npmrds_load_travel_times,
    EtlTaskName.npmrds_load_tmc_identification,
  ];

  constructor() {
    this.name = EtlTaskName.npmrds_prepublish_qa;

    this._done = false;
    this.approved = null;

    this.doneData = new Promise((resolve) => (this._resolveDoneData = resolve));
  }

  receiveOthers(others: TaskI[]) {
    this.dependencies = others.filter((o) =>
      MockNpmrdsPrepublishQA.dependenciesNames.includes(o.name)
    );
  }

  get done() {
    return this._done;
  }

  async step() {
    if (this.done) {
      return;
    }

    if (this.approved === false) {
      return;
    }

    const pendingDeps = this.dependencies
      .filter((d) => !d.done)
      .map(({ name }) => name);

    if (pendingDeps.length) {
      console.log(`==> task ${this.name}: awaiting ${pendingDeps}`);
      return;
    }

    if (this.approved === null) {
      this.approved = false;

      console.log();
      console.log(`==> MOCK ${this.name}: Awaiting admin user QA approval`);

      EventBus.emit("ETL_CONTROL_REQUIRES_ADMIN_APPROVAL", {
        type: "ETL_CONTROL_REQUIRES_ADMIN_APPROVAL",
      });

      await new Promise<void>((resolve) => {
        EventBus.once("ADMIN_APPROVES_ETL_CONTROL", (event) => {
          console.log(event);
          this.approved = true;
          resolve();
        });
      });

      return;
    }

    console.log(`==> MOCK ${this.name}: Admin user approved`);
    console.log();

    const doneData = {
      npmrds_prepublish_qa: "PASSED",
    };

    process.nextTick(() => this._resolveDoneData(doneData));

    this._done = true;
  }
}
