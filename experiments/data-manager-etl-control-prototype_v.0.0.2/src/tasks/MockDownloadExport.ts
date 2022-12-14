import { TaskI, EtlTaskName } from "../types";

export default class MockDownloadExport implements TaskI {
  readonly name: EtlTaskName;

  private _done: boolean;
  private _resolveDoneData: Function;
  readonly doneData: Promise<Record<string, any>>;
  private dependencies: TaskI[];

  static readonly dependenciesNames = [EtlTaskName.npmrds_export_ready];

  constructor() {
    this.name = EtlTaskName.npmrds_download_export;

    this._done = false;

    this.doneData = new Promise((resolve) => (this._resolveDoneData = resolve));
  }

  receiveOthers(others: TaskI[]) {
    this.dependencies = others.filter((o) =>
      MockDownloadExport.dependenciesNames.includes(o.name)
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
      `==> MOCK ${this.name}: download of ${npmrds_export_request_id} COMPLETE`
    );
    console.log();

    // FIXME: For this proof-of-concept, I'm using an existing NPMRDS export on my laptop
    const doneData = {
      npmrds_export_name: "npmrdsx_vt_201601_v20220307T175956",
    };

    process.nextTick(() => this._resolveDoneData(doneData));

    this._done = true;
  }
}
