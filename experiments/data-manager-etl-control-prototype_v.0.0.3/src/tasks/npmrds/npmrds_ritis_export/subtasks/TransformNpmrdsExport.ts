import AbstractSubTask from "../../../../core/AbstractSubTask";

import { SubTaskClass } from "../../../../types";

import DownloadNpmrdsExport, {
  DoneData as DownloadNpmrdsExportDoneData,
} from "./DownloadNpmrdsExport";

import main from "../../../../other_repos_soft_links/avail-datasources-watcher/tasks/downloadedExportsIntoSqlite/src/createExportSqliteDb";

export type TaskContext = {
  // @ts-ignore
  [DownloadNpmrdsExport.name]: DownloadNpmrdsExportDoneData;
};

export type DoneData = {
  state: string;
  year: number;
  month: number;
  npmrds_export_sqlite_db_path: string;
};

class MockTransformNpmrdsExport extends AbstractSubTask {
  static readonly taskDependencies = [DownloadNpmrdsExport];

  async main(context: TaskContext): Promise<DoneData> {
    const {
      // @ts-ignore
      [DownloadNpmrdsExport.name]: { state, year, month, npmrds_export_name },
    } = context;

    const npmrds_export_sqlite_db_path = main(npmrds_export_name);

    console.log("==> MockTransformNpmrdsExport DONE");

    return {
      state,
      year,
      month,
      npmrds_export_sqlite_db_path: npmrds_export_sqlite_db_path,
    };
  }
}

export default <SubTaskClass>MockTransformNpmrdsExport;
