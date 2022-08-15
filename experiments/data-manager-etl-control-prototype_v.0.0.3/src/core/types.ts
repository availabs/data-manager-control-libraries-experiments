export type TaskName = string;

export type TaskDoneData = any;

//  Thin wrapper for ETL Tasks implemented in other repositories.
//
//  ETL Tasks are oblivious to the ETL Workflow System.
//    The ONLY requirement for ETL Tasks is that they export a main function that
//      * accepts the configuration and
//      * returns metadata used to configure downstream tasks.
export interface TaskI {
  name: TaskName;
  main(context?: any): Promise<TaskDoneData>;
}

export type TaskClass = {
  new (): TaskI;
};

export type EtlContext = {
  etlId: number | string;
  etlTasks: Record<TaskName, { doneData: any; status: SubTaskStatus }>;
  spawnDependency: (C: SubTaskClass) => SubTaskI;
  verbose?: boolean;
};

export type EtlInitialContext = {
  etlDoneTasks: Record<TaskName, { doneData: any; status: SubTaskStatus.DONE }>;
  eltObjectives: SubTaskClass[];
};

export type TaskContext = Record<TaskName, any>;

// These are the Wrappers for
export type SubTaskExecuteContext = Record<TaskName, TaskDoneData>;

export enum SubTaskStatus {
  AWAITING = "AWAITING",
  READY = "READY",
  PENDING = "PENDING",
  DONE = "DONE",
}

export interface SubTaskI extends TaskI {
  status: SubTaskStatus;

  // For the tasks to be skipped on resume, the done data must be serializable.
  doneData: any;

  main(context?: SubTaskExecuteContext): Promise<TaskDoneData>;
}

export type SubTaskClass = Function & {
  readonly name: string;
  readonly taskDependencies?: SubTaskClass[];
  new (etlContext: EtlContext): SubTaskI;
};

export interface EtlControlSubTaskI extends SubTaskI {
  readonly $isEtlControl: true;
}
