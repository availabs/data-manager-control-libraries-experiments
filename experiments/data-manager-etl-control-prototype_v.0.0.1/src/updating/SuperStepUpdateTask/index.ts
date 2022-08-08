import {
  createEtlDbConnection,
  SQLiteDatabaseConnection,
} from "../../database";

import { SuperStepTaskInterface } from "../SuperStepEtlController";

import stageDataUpdate from "./utils/stageDataUpdate";

import { NodeID } from "../../index.d";

export default class SuperStepUpdateTask implements SuperStepTaskInterface {
  private _done: boolean;
  private _resolveDoneData: Function;
  readonly doneData: Promise<Record<string, any>>;

  constructor(
    readonly etlId: number,
    readonly id: NodeID,
    private readonly dependencies: SuperStepUpdateTask[],
    private readonly db?: SQLiteDatabaseConnection
  ) {
    // console.log("SuperStepUpdateTask.constructor", id);

    this._done = false;

    this.doneData = new Promise((resolve) => (this._resolveDoneData = resolve));
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
      .map(({ id }) => id);

    if (pendingDeps.length) {
      console.log(`==> task ${this.id} is still awaiting ${pendingDeps}`);
      return;
    }

    const db = this.db || createEtlDbConnection(this.etlId);

    await stageDataUpdate(
      db,
      this.id,
      this.dependencies.map(({ id }) => id),
      Boolean(this.db)
    );

    this._done = true;

    process.nextTick(() => this._resolveDoneData(this.id));

    console.log(`==> task ${this.id} done`);
  }
}
