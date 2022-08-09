import { TaskI, EtlTaskName } from "../types";

export default class MockNpmrdsRequestExport implements TaskI {
  readonly name: EtlTaskName;

  private _done: boolean;
  private _resolveDoneData: Function;
  readonly doneData: Promise<Record<string, any>>;
  private dependencies: TaskI[];

  static readonly dependenciesNames = [EtlTaskName.npmrds_update_request];

  constructor() {
    this.name = EtlTaskName.npmrds_request_export;

    this._done = false;

    this.doneData = new Promise((resolve) => (this._resolveDoneData = resolve));
  }

  receiveOthers(others: TaskI[]) {
    console.log("==> MockNpmrdsRequestExport.receiveOthers");
    console.log(JSON.stringify(others.map((o) => o.name)));

    this.dependencies = others.filter((o) =>
      MockNpmrdsRequestExport.dependenciesNames.includes(o.name)
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

    const { state, year, month } = await this.dependencies[0].doneData;

    const doneData = {
      npmrds_export_request_id: "mock-npmrds-export-request-id",
    };

    const mm = `0${month}`.slice(-2);

    console.log();
    console.log(
      `==> MOCK ${this.name}: request export for ${state} ${year}/${mm} COMPLETE`
    );
    console.log();

    process.nextTick(() => this._resolveDoneData(doneData));

    this._done = true;
  }
}
