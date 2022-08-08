import { TaskI, EtlTaskName } from "../types";

import main from "../other_repos_soft_links/NPMRDS_Database/src/npmrds/npmrds_travel_times/load-npmrds-state-yrmo";

/*
  export default async function main({                                
    npmrds_export_sqlite_db_path,                                
    pg_env = "development",                                
  }: {                                        
    npmrds_export_sqlite_db_path: string;                                
    pg_env: "development" | "production";                                
  })
*/
export default class LoadNpmrdsTravelTimes implements TaskI {
  readonly name: EtlTaskName;

  private _done: boolean;
  private _resolveDoneData: Function;
  readonly doneData: Promise<Record<string, any>>;
  private dependencies: TaskI[];

  static readonly dependenciesNames = [EtlTaskName.npmrds_transform_export];

  constructor() {
    this.name = EtlTaskName.npmrds_load_travel_times;

    this._done = false;

    this.doneData = new Promise((resolve) => (this._resolveDoneData = resolve));
  }

  receiveOthers(others: TaskI[]) {
    this.dependencies = others.filter((o) =>
      LoadNpmrdsTravelTimes.dependenciesNames.includes(o.name)
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
      `\n==> task ${this.name}: all dependencies met. Proceeding with task.\n`
    );

    const { npmrds_export_sqlite_db_path } = await this.dependencies[0]
      .doneData;

    const doneData = await main({
      npmrds_export_sqlite_db_path,
      pg_env: "development",
    });

    process.nextTick(() => this._resolveDoneData(doneData));

    this._done = true;
  }
}
