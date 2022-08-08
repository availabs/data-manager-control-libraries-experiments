import { TaskI, EtlTaskName } from "../types";

export default class MockDownloadExport implements TaskI {
  readonly name: EtlTaskName;

  private _done: boolean;
  private _resolveDoneData: Function;
  readonly doneData: Promise<Record<string, any>>;
  static readonly dependenciesNames = [];

  constructor() {
    this.name = EtlTaskName.npmrds_download_export;

    this._done = false;

    this.doneData = new Promise((resolve) => (this._resolveDoneData = resolve));
  }

  receiveOthers(_others: TaskI[]) {
    // This mock has no dependencies
  }

  get done() {
    return this._done;
  }

  async step() {
    if (this.done) {
      return;
    }

    // FIXME: For this proof-of-concept, I'm using an existing NPMRDS export on my laptop
    const doneData = {
      npmrds_export_name: "npmrdsx_vt_201602_v20220307T181553",
    };

    process.nextTick(() => this._resolveDoneData(doneData));

    this._done = true;
  }
}
