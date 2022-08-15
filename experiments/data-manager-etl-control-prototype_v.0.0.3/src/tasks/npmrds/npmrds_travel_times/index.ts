import SuperStepEtlController from "../../../core/SuperStepEtlController";

import NpmrdsExportAggregate, {
  DoneData as NpmrdsExportAggregateDoneData,
} from "../npmrds_ritis_export";

import _Initial from "./subtasks/_Initial";
import _Final, { DoneData as _FinalDoneData } from "./subtasks/_Final";
import { EtlContext } from "../../../types";

export type TaskContext = {
  // @ts-ignore tsserver 1170
  [NpmrdsExportAggregate.name]: NpmrdsExportAggregateDoneData;
};

export type DoneData = _FinalDoneData;

export default class NpmrdsTravelTimes extends SuperStepEtlController {
  static readonly taskDependencies = [_Initial];

  constructor(protected etlContext: EtlContext) {
    super(etlContext);

    this.subTaskDependencies[NpmrdsExportAggregate.name] =
      etlContext[NpmrdsExportAggregate.name];

    this.etlSubContext.spawnDependency(_Final);
  }

  async main(taskContext: TaskContext): Promise<DoneData> {
    const doneTaskContext = await super.main(taskContext);

    return doneTaskContext[_Final.name];
  }
}

console.log(
  "NpmrdsTravelTimes.taskDependencies:",
  NpmrdsTravelTimes.taskDependencies
);
