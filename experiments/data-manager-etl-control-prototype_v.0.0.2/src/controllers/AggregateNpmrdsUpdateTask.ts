import _ from "lodash";

import { SuperStepEtlController } from "../SuperStepEtlController";

import NpmrdsUpdateRequest from "../tasks/NpmrdsUpdateRequest";
import MockNpmrdsRequestExport from "../tasks/MockNpmrdsRequestExport";
import MockNpmrdsExportReady from "../tasks/MockNpmrdsExportReady";
import MockDownloadExport from "../tasks/MockDownloadExport";
import DownloadedNpmrdsExportIntoSqlite from "../tasks/DownloadedNpmrdsExportIntoSqlite";
import LoadNpmrdsTmcIdenfification from "../tasks/LoadNpmrdsTmcIdenfification";
import LoadNpmrdsTravelTimes from "../tasks/LoadNpmrdsTravelTimes";
import MockNpmrdsPrepublishQA from "../tasks/MockNpmrdsPrepublishQA";
import MockNpmrdsPublishTravelTimes from "../tasks/MockNpmrdsPublishTravelTimes";
import MockNpmrdsPublishTmcIdentification from "../tasks/MockNpmrdsPublishTmcIdentification";
import MockPythonTask from "../tasks/MockPythonTask";

export default class AggregateNpmrdsUpdateTask extends SuperStepEtlController {
  constructor(updateRequestTask: NpmrdsUpdateRequest) {
    super(
      // Using shuffle just to show task order below does not matter.
      // _.shuffle([
      [
        updateRequestTask,
        new MockNpmrdsRequestExport(),
        new MockNpmrdsExportReady(),
        new MockDownloadExport(),
        new DownloadedNpmrdsExportIntoSqlite(),
        new LoadNpmrdsTmcIdenfification(),
        new LoadNpmrdsTravelTimes(),
        new MockNpmrdsPrepublishQA(),
        new MockNpmrdsPublishTravelTimes(),
        new MockNpmrdsPublishTmcIdentification(),
        new MockPythonTask(),
      ]
      // ])
    );
  }
}
