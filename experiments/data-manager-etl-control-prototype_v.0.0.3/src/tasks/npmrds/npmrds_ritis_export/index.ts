import SuperStepEtlController from "../../../core/SuperStepEtlController";
// import { EtlContext } from '../../../types'

import NpmrdsRequestUpdate, {
  DoneData as NpmrdsRequestUpdateDoneData,
} from "../npmrds_admin/NpmrdsRequestUpdate";

import _Initial from "./subtasks/_Initial";
import _Final, { DoneData as _FinalDoneData } from "./subtasks/_Final";
import { EtlContext } from "../../../types";

export type TaskContext = {
  [NpmrdsRequestUpdate.name]: NpmrdsRequestUpdateDoneData;
};

export type DoneData = _FinalDoneData;

export default class NpmrdsExportAggregate extends SuperStepEtlController {
  static readonly taskDependencies = [NpmrdsRequestUpdate];

  constructor(protected etlContext: EtlContext) {
    super(etlContext);

    this.etlSubContext.spawnDependency(_Final);
  }

  async main(taskContext: TaskContext): Promise<DoneData> {
    const doneTaskContext = await super.main(taskContext);

    return doneTaskContext[_Final.name];
  }
}

console.log(
  "NpmrdsExportAggregate.taskDependencies:",
  NpmrdsExportAggregate.taskDependencies
);
