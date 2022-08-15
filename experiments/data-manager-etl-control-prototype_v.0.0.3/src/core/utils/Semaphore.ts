import AbstractSubTask from "../AbstractSubTask";

import { EtlContext } from "../../types";

export default class Semaphore extends AbstractSubTask {
  readonly $isEtlControl: true;

  constructor(protected etlContext: EtlContext) {
    super(etlContext);
    this.$isEtlControl = true;
  }

  async main(): Promise<null> {
    return null;
  }
}
