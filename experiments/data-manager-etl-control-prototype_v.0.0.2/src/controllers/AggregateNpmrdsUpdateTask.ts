import { SuperStepEtlController } from "../SuperStepEtlController";

import DownloadedNpmrdsExportIntoSqlite from "../tasks/DownloadedNpmrdsExportIntoSqlite";
import LoadNpmrdsTmcIdenfification from "../tasks/LoadNpmrdsTmcIdenfification";
import LoadNpmrdsTravelTimes from "../tasks/LoadNpmrdsTravelTimes";
import MockDownloadExport from "../tasks/MockDownloadExport";

export default class AggregateNpmrdsUpdateTask extends SuperStepEtlController {
  constructor() {
    super([
      new MockDownloadExport(),
      new DownloadedNpmrdsExportIntoSqlite(),
      new LoadNpmrdsTmcIdenfification(),
      new LoadNpmrdsTravelTimes(),
    ]);
  }
}
