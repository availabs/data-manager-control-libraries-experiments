import { TaskI, EtlTaskName } from "../types";

import main from "../other_repos_soft_links/avail-datasources-watcher/tasks/downloadedExportsIntoSqlite/src/createExportSqliteDb";

export default class DownloadedNpmrdsExportIntoSqliteTask implements TaskI {
  readonly name: EtlTaskName;

  private _done: boolean;
  private _resolveDoneData: Function;
  readonly doneData: Promise<Record<string, any>>;
  private dependencies: TaskI[];

  static readonly dependenciesNames = [EtlTaskName.npmrds_download_export];

  constructor() {
    this.name = EtlTaskName.npmrds_transform_export;

    this._done = false;

    this.doneData = new Promise((resolve) => (this._resolveDoneData = resolve));
  }

  receiveOthers(others: TaskI[]) {
    this.dependencies = others.filter((o) =>
      DownloadedNpmrdsExportIntoSqliteTask.dependenciesNames.includes(o.name)
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

    console.log(
      `==> task ${this.name}: all dependencies met. Proceeding with ETL.\n`
    );

    const { npmrds_export_name } = await this.dependencies[0].doneData;

    const npmrds_export_sqlite_db_path = main(npmrds_export_name);

    process.nextTick(() =>
      this._resolveDoneData({ npmrds_export_sqlite_db_path })
    );

    this._done = true;
  }
}
