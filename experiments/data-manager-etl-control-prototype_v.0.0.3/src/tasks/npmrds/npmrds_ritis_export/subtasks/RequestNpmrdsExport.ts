import AbstractSubTask from "../../../../core/AbstractSubTask";
// import Semaphore from "../../../core/utils/Semaphore";

import { SubTaskClass } from "../../../../types";

import NpmrdsRequestUpdate, {
  DoneData as NpmrdsRequestUpdateDoneData,
} from "../../npmrds_admin/NpmrdsRequestUpdate";

export type TaskContext = {
  // @ts-ignore
  [NpmrdsRequestUpdate.name]: NpmrdsRequestUpdateDoneData;
};

export type DoneData = {
  npmrds_export_request_id: string;
};

// class RequestSemaphore extends Semaphore {}

class MockRequestNpmrdsExport extends AbstractSubTask {
  static readonly taskDependencies = [];

  async main(taskContext: TaskContext): Promise<DoneData> {
    console.log("MockRequestNpmrdsExport.main");
    console.log(
      JSON.stringify(
        { lookingFor: NpmrdsRequestUpdate.name, taskContext },
        null,
        4
      )
    );
    const {
      // @ts-ignore
      [NpmrdsRequestUpdate.name]: { state: _state, year: _year, month: _month },
    } = taskContext;

    console.log("==> MockRequestNpmrdsExport DONE");

    return {
      npmrds_export_request_id: "mock-npmrds-export-request-id",
    };
  }
}

export default <SubTaskClass>MockRequestNpmrdsExport;
