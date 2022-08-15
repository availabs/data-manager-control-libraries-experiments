import AbstractSubTask from "../../../../core/AbstractSubTask";
// import Semaphore from "../../../../core/utils/Semaphore";

import { SubTaskClass } from "../../../../types";

import _Initial, { DoneData as _InitialDoneData } from "./_Initial";

import NotifyNpmrdsExportReady, {
  DoneData as NotifyNpmrdsExportReadyDoneData,
} from "./NotifyNpmrdsExportReady";

export type TaskContext = {
  [_Initial.name]: _InitialDoneData;
  [NotifyNpmrdsExportReady.name]: NotifyNpmrdsExportReadyDoneData;
};

export type DoneData = {
  state: string;
  year: number;
  month: number;
  npmrds_export_name: string;
};

// class DownloadSemaphore extends Semaphore {}

class MockDownloadNpmrdsExport extends AbstractSubTask {
  static readonly taskDependencies = [
    NotifyNpmrdsExportReady,
    // DownloadSemaphore,
  ];

  async main(context: TaskContext): Promise<DoneData> {
    console.log("=".repeat(50));
    console.log(
      JSON.stringify(
        { taskName: MockDownloadNpmrdsExport.name, context },
        null,
        4
      )
    );
    const {
      MockRequestNpmrdsUpdate: { state, year, month },
      [NotifyNpmrdsExportReady.name]: { npmrds_export_request_id },
    } = context;

    if (!(state === "vt" && year === 2016 && month === 1)) {
      console.log(JSON.stringify({ state, year, month }, null, 4));
      throw new Error("MockDownloadNpmrdsExport supports ONLY vt 2016/01");
      process.exit(1);
    }

    const mockTimestamp = "20220307T175956";
    const mm = `0${month}`;

    console.log("==> MockDownloadNpmrdsExport DONE");

    return {
      state,
      year,
      month,
      // FIXME: For this proof-of-concept, I'm using an existing NPMRDS export on my laptop
      npmrds_export_name: `npmrdsx_${state}_${year}${mm}_v${mockTimestamp}`,
    };
  }
}

export default <SubTaskClass>MockDownloadNpmrdsExport;
