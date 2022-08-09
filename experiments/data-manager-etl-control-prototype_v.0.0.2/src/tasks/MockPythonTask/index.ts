import { join } from "path";

import { exec } from "teen_process";

import { TaskI, EtlTaskName } from "../../types";

export default class MockPythonTask implements TaskI {
  readonly name: EtlTaskName;

  private _done: boolean;
  private _resolveDoneData: Function;
  private _rejectDoneData: Function;
  readonly doneData: Promise<Record<string, any>>;
  private dependencies: TaskI[];

  static readonly dependenciesNames = [
    EtlTaskName.npmrds_publish_travel_times,
    EtlTaskName.npmrds_publish_tmc_identification,
  ];

  constructor() {
    this.name = EtlTaskName.mock_python_task;

    this._done = false;

    this.doneData = new Promise((resolve, reject) => {
      this._resolveDoneData = resolve;
      this._rejectDoneData = reject;
    });
  }

  receiveOthers(others: TaskI[]) {
    this.dependencies = others.filter((o) =>
      MockPythonTask.dependenciesNames.includes(o.name)
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

    try {
      const { stdout, stderr, code } = await exec(
        join(__dirname, "./mockPythonTask.py"),
        [],
        { env: { ETL_CONTROL_MSG: "Hello, MOCK Python Task" } }
      );

      console.log();
      console.log(`==> MOCK ${this.name}`);
      console.table({ stdout, stderr, code });
      console.log();

      const doneData = {
        mock_python_etl_task_success: code === 0,
      };

      process.nextTick(() => this._resolveDoneData(doneData));
      this._done = true;
    } catch (err) {
      this._done = true;
      this._rejectDoneData(err);
    }
  }
}
