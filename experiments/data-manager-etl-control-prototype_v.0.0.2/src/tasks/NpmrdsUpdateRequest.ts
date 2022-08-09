import { TaskI, EtlTaskName } from "../types";

export default class NpmrdsUpdateRequest implements TaskI {
  readonly name: EtlTaskName;

  private readonly _done: boolean;
  readonly doneData: Promise<Record<string, any>>;

  static readonly dependenciesNames = [];

  constructor(event: {
    type: string;
    payload: { state: string; year: number; month: number };
  }) {
    this.name = EtlTaskName.npmrds_update_request;

    this._done = true;

    console.log();
    console.log("==> task ${this.name} immediately done upon construction");
    console.log();

    this.doneData = Promise.resolve(event.payload);
  }

  receiveOthers() {}

  get done() {
    return this._done;
  }

  async step() {
    return;
  }
}
