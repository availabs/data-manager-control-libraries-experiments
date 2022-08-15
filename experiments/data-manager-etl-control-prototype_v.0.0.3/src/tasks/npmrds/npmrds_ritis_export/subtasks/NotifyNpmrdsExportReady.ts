import AbstractSubTask from "../../../../core/AbstractSubTask";

import { SubTaskClass } from "../../../../types";

import RequestNpmrdsExport, {
  DoneData as RequestNpmrdsExportDoneData,
} from "./RequestNpmrdsExport";

export type TaskContext = {
  // @ts-ignore
  [RequestNpmrdsExport.name]: RequestNpmrdsExportDoneData;
};

export type DoneData = {
  npmrds_export_request_id: string;
};

class MockNotifyNpmrdsExportReady extends AbstractSubTask {
  static readonly taskDependencies = [RequestNpmrdsExport];

  async main(context: TaskContext): Promise<DoneData> {
    const {
      // @ts-ignore
      [RequestNpmrdsExport.name]: { npmrds_export_request_id },
    } = context;

    console.log("==> MockNotifyNpmrdsExportReady DONE");

    return {
      npmrds_export_request_id,
    };
  }
}

export default <SubTaskClass>MockNotifyNpmrdsExportReady;
