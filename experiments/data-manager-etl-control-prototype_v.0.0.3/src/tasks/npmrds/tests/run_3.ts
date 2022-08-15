import _ from "lodash";

import RootEtlController from "../../../core/RootEtlController";

import { SubTaskStatus, EtlInitialContext } from "../../../core/types";

import NpmrdsRequestUpdate from "../npmrds_admin/NpmrdsRequestUpdate";

import NpmrdsTravelTimes from "../npmrds_travel_times";
import NpmrdsTmcIdentification from "../npmrds_tmc_identification";

const npmrdsStateYearMonth = { state: "vt", year: 2016, month: 1 };

async function main() {
  try {
    const etlDoneTasks = {
      // @ts-ignore
      [NpmrdsRequestUpdate.name]: {
        doneData: npmrdsStateYearMonth,
        status: SubTaskStatus.DONE,
      },
    };

    const etlInitalContext = <EtlInitialContext>{
      etlDoneTasks,
      eltObjectives: [NpmrdsTravelTimes, NpmrdsTmcIdentification],
    };

    const task = new RootEtlController(etlInitalContext);

    const taskContext = {
      [NpmrdsRequestUpdate.name]: npmrdsStateYearMonth,
    };

    console.log("STARTING");
    console.log(JSON.stringify({ taskContext }, null, 4));
    await task.main(taskContext);
    console.log("DONE");
  } catch (err) {
    console.error(err);
  }
}

main();
