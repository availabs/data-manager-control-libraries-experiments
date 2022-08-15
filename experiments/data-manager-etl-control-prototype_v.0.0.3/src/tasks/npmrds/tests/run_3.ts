import _ from "lodash";

import RootEtlController from "../../../core/RootEtlController";

import { TaskI, SubTaskStatus, EtlInitialContext } from "../../../core/types";

import NpmrdsRequestUpdate from "../npmrds_admin/NpmrdsRequestUpdate";

import NpmrdsTravelTimes from "../npmrds_travel_times";
import NpmrdsTmcIdentification from "../npmrds_tmc_identification";

type Config = {
  state: string;
  year: number;
  month: number;
};

export default class NpmrdsUpdateRunner implements TaskI {
  readonly name: string;

  readonly state: string;
  readonly year: number;
  readonly month: number;

  constructor(config: Config) {
    this.name = "NpmrdsUpdateRunner";

    this.state = config.state;
    this.year = config.year;
    this.month = config.month;
  }
  async main() {
    try {
      const { state, year, month } = this;

      const etlDoneTasks = {
        // @ts-ignore
        [NpmrdsRequestUpdate.name]: {
          doneData: {
            state,
            year,
            month,
          },
          status: SubTaskStatus.DONE,
        },
      };

      const etlInitalContext = <EtlInitialContext>{
        etlDoneTasks,
        eltObjectives: [NpmrdsTravelTimes, NpmrdsTmcIdentification],
      };

      const task = new RootEtlController(etlInitalContext);

      const taskContext = {
        [NpmrdsRequestUpdate.name]: {
          state,
          year,
          month,
        },
      };

      console.log("STARTING");
      console.log(JSON.stringify({ taskContext }, null, 4));
      await task.main(taskContext);
      console.log("DONE");
    } catch (err) {
      console.error(err);
    }
  }
}

new NpmrdsUpdateRunner({
  state: "vt",
  year: 2016,
  month: 1,
}).main();
