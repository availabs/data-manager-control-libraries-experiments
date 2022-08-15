import _ from "lodash";
import { v4 as uuid } from "uuid";

import {
  TaskName,
  EtlContext,
  EtlInitialContext,
  SubTaskI,
  SubTaskStatus,
} from "../../types";

import SuperStepEtlController from "../SuperStepEtlController";

export default class MockRootEtlController extends SuperStepEtlController {
  protected subTaskDependencies: Record<TaskName, SubTaskI>;
  protected stepGenerator: AsyncGenerator<number>;
  protected etlSubContext: EtlContext;

  constructor(protected etlInitalContext: EtlInitialContext) {
    const { etlDoneTasks, eltObjectives } = etlInitalContext;

    const etlContext = {
      etlId: uuid(),
      etlTasks: etlDoneTasks,
      spawnDependency: function rootSpawn(...args: any[]) {
        console.log(
          "rootSpawn ...args:",
          JSON.stringify(
            args.map((c) => c.name),
            null,
            4
          )
        );
        throw new Error("Root don't spawn");
      },
    };

    super(etlContext);

    Object.entries(etlDoneTasks).forEach(([name, { doneData }]) => {
      console.log(JSON.stringify({ etlDoneTask: { name, doneData } }, null, 4));

      this.subTaskDependencies[name] = <SubTaskI>{
        name,
        status: SubTaskStatus.DONE,
        doneData,
      };
    });

    for (const objective of eltObjectives) {
      console.log("spawning objective:", objective.name);
      this.etlSubContext.spawnDependency(objective);
    }
  }
}
