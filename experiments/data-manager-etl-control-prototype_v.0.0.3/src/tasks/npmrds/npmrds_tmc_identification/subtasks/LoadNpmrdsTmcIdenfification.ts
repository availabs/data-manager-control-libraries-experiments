import AbstractSubTask from "../../../../core/AbstractSubTask";
// import Semaphore from "../../../core/utils/Semaphore";

import { SubTaskClass } from "../../../../types";

import main from "../../../../other_repos_soft_links/NPMRDS_Database/src/npmrds/tmc_identification/load-tmc-identification-file";

import NpmrdsExportAggregate, {
  DoneData as NpmrdsExportAggregateDoneData,
} from "../../npmrds_ritis_export";

export type TaskContext = {
  // @ts-ignore
  [NpmrdsRequestUpdate.name]: NpmrdsExportAggregateDoneData;
};

export type DoneData = {
  state: string;
  year: number;
  month: number;
  tableschema: string;
  tablename: string;
};

// class DatabaseLoaderSemaphore extends Semaphore {}

class MockLoadNpmrdsTmcIdentification extends AbstractSubTask {
  static readonly taskDependencies = [NpmrdsExportAggregate];

  async main(taskContext: TaskContext): Promise<DoneData> {
    const {
      // @ts-ignore
      [NpmrdsExportAggregate.name]: {
        state,
        year,
        month,
        npmrds_export_sqlite_db_path,
      },
    } = taskContext;

    console.log("v".repeat(80));

    console.log(JSON.stringify({ taskContext }, null, 4));

    // We will need to modify the main to return the tableschema and tablename.
    await main({
      npmrds_export_sqlite_db_path,
      pg_env: "development",
    });

    const mm = `0${month}`.slice(-2);
    const mockDoneData = {
      tableschema: state,
      tablename: `tmc_identification_y${year}m${mm}_mock_version`,
    };

    const { tableschema, tablename } = mockDoneData;

    return {
      state,
      year,
      month,
      tableschema,
      tablename,
    };
  }
}

export default <SubTaskClass>MockLoadNpmrdsTmcIdentification;
