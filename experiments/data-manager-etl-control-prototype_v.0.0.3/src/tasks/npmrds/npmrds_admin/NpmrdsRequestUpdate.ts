// This Task works as an Identity function linking external request sources and ETL Control
//   * Admin Server/UI
//   * CLI app
//   * JobScheduler
//
// We can use eltControlDependencies to inject instances of this Task with
//   an AccessControl dependency to allow a single export request at a time.

import AbstractSubTask from "../../../core/AbstractSubTask";

export type TaskContext = void;

export type DoneData = {
  state: string;
  year: number;
  month: number;
};

export default class MockRequestNpmrdsUpdate extends AbstractSubTask {
  async main(taskContext: any): Promise<DoneData> {
    const { state, year, month } = taskContext;

    return { state, year, month };
  }
}
