export enum EtlTaskName {
  npmrds_download_export = "npmrds_download_export",
  npmrds_transform_export = "npmrds_transform_export",
  npmrds_load_tmc_identification = "npmrds_load_tmc_identification",
  npmrds_load_travel_times = "npmrds_load_travel_times",
}

export interface TaskI {
  name: EtlTaskName;
  done: boolean;
  doneData: Promise<any>;
  receiveOthers(others: TaskI[]): void;
  step(): Promise<void>;
}

export interface SuperStepTaskI {
  id: string | number;
  done: boolean;
  doneData: Promise<any>;
  step(): Promise<void>;
}
