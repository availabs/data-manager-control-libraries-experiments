export enum EtlTaskName {
  npmrds_update_request = "npmrds_update_request",

  npmrds_request_export = "npmrds_request_export",
  npmrds_export_ready = "npmrds_export_ready",
  npmrds_download_export = "npmrds_download_export",
  npmrds_transform_export = "npmrds_transform_export",

  npmrds_load_tmc_identification = "npmrds_load_tmc_identification",
  npmrds_load_travel_times = "npmrds_load_travel_times",

  npmrds_prepublish_qa = "npmrds_prepublish_qa",
  npmrds_publish_travel_times = "npmrds_publish_travel_times",
  npmrds_publish_tmc_identification = "npmrds_publish_tmc_identification",

  mock_python_task = "mock_python_task",
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
