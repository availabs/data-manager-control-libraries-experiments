import _ from "lodash";
import { v4 as uuid } from "uuid";

import {
  TaskName,
  EtlContext,
  TaskContext,
  SubTaskI,
  SubTaskStatus,
  SubTaskClass,
} from "../../types";

import AbstractSubTask from "../AbstractSubTask";

import makeStepAsyncGenerator from "./utils/makeStepAsyncGenerator";

export default class MockSuperStepEtlController extends AbstractSubTask {
  protected subTaskDependencies: Record<TaskName, SubTaskI>;
  protected stepGenerator: AsyncGenerator<number>;
  protected etlSubContext: EtlContext;

  constructor(protected etlContext: EtlContext) {
    super(etlContext);

    this.stepGenerator = makeStepAsyncGenerator();

    this.subTaskDependencies = {};

    this.etlSubContext = {
      etlId: `${etlContext.etlId || ""}/${uuid()}`,
      etlTasks: {},
      spawnDependency: this.spawnDependency.bind(this),
    };
  }

  protected spawnDependency(S: SubTaskClass) {
    const { name } = <SubTaskClass>S;
    console.log("spawning", name);

    if (!this.subTaskDependencies[name]) {
      // this.subTaskDependencies[name] = new S(this.etlContext);
      this.subTaskDependencies[name] = new S(this.etlSubContext);
    }

    return this.subTaskDependencies[name];
  }

  protected getSubtasksByStatus() {
    return Object.values(this.subTaskDependencies).reduce((acc, task) => {
      acc[task.status] = acc[task.status] || [];
      acc[task.status].push(task);
      return acc;
    }, {});
  }

  protected logStatuses() {
    const subtasksByStatus = this.getSubtasksByStatus();
    const statuses = [];

    for (const s of Object.values(SubTaskStatus)) {
      for (const task of subtasksByStatus[s] || []) {
        statuses.push({
          status: s,
          taskName: task.name,
        });
      }
    }

    console.table(statuses);
  }

  protected get readyTasks(): SubTaskI[] {
    return this.getSubtasksByStatus()[SubTaskStatus.READY] || [];
  }

  protected get pendingTasks(): SubTaskI[] {
    return this.getSubtasksByStatus()[SubTaskStatus.PENDING] || [];
  }

  protected get doneTasks(): SubTaskI[] {
    return this.getSubtasksByStatus()[SubTaskStatus.DONE] || [];
  }

  protected get taskContext() {
    const taskContext = {};

    for (const task of this.doneTasks) {
      taskContext[task.name] = task.doneData;
    }

    return taskContext;
  }

  protected get allTasksDone() {
    const subtasksByStatus = this.getSubtasksByStatus();

    const allStatusNamesExceptDone = Object.keys(subtasksByStatus).filter(
      (status) => status !== SubTaskStatus.DONE
    );

    const allDone = !allStatusNamesExceptDone.some((status) => {
      // console.log("status:", status, "...", subtasksByStatus[status].length);
      return subtasksByStatus[status].length > 0;
    });

    // console.log("allDone:", allDone);

    return allDone;
  }

  async main(initialTaskContext: TaskContext): Promise<TaskContext> {
    console.log(this.constructor.name, ": step 0");

    Object.keys(initialTaskContext).forEach((taskName) => {
      // @ts-ignore
      this.subTaskDependencies[taskName] = {
        name: taskName,
        status: SubTaskStatus.DONE,
        doneData: initialTaskContext[taskName],
      };
    });
    // console.log(JSON.stringify(this.getSubtasksByStatus(), null, 4));

    // for await (const step of this.stepGenerator) {
    let step = 0;
    while (++step) {
      console.log(this.constructor.name, ": step", step);
      this.logStatuses();
      try {
        if (this.allTasksDone) {
          console.log("BREAK");
          break;
        }

        const { readyTasks, taskContext } = this;

        if (!readyTasks.length) {
          console.log("none ready");
          // console.log(JSON.stringify({ pending: this.pendingTasks }, null, 4));
          await new Promise((resolve) => setTimeout(resolve, 3000));
          continue;
        }

        // console.log(JSON.stringify({ readyTasks, taskContext }, null, 4));
        await Promise.all(readyTasks.map((t) => t.main(taskContext)));

        if (this.allTasksDone) {
          console.log("BREAK");
          break;
        }
      } catch (err) {
        console.error(err);
      }
    }

    return this.taskContext;
  }
}
