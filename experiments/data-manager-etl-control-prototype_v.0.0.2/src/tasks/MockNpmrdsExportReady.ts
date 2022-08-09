import { TaskI, EtlTaskName } from "../types";

//  Watcher tasks start running on first step and resolve doneData awaited event occurs.

export default class MockNpmrdsExportReady implements TaskI {
  readonly name: EtlTaskName;

  private _done: boolean;
  private _resolveDoneData: Function;
  readonly doneData: Promise<Record<string, any>>;
  private dependencies: TaskI[];

  static readonly dependenciesNames = [EtlTaskName.npmrds_request_export];

  constructor() {
    this.name = EtlTaskName.npmrds_export_ready;

    this._done = false;

    this.doneData = new Promise((resolve) => (this._resolveDoneData = resolve));
  }

  receiveOthers(others: TaskI[]) {
    this.dependencies = others.filter((o) =>
      MockNpmrdsExportReady.dependenciesNames.includes(o.name)
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

    const { npmrds_export_request_id } = await this.dependencies[0].doneData;

    console.log();
    console.log(
      `==> MOCK ${this.name}: ${npmrds_export_request_id} READY FOR DOWNLOAD`
    );
    console.log();

    const doneData = {
      npmrds_export_request_id,
    };

    process.nextTick(() => this._resolveDoneData(doneData));

    this._done = true;
  }
}
