import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/npmrds_travel_times/load-npmrds-state-yrmo";

import { PgEnvSchema } from "../../shared/postgres/schemas";
import { PostgresEnvironments } from "../../shared/postgres/index.d";
import { stateAbbr2FipsCode } from "../../shared/geo/stateFipsCodes";

import makeActionCreators from "../../data_manager/event_sourcing/utils/makeActionCreators";
import datamanagerNpmrdsViewBase from "../shared/datamanager";

export const dataSourceName = "USDOT/FHWA/NPMRDS/TRAVEL_TIME_DATA";

export type TaskParams = {
  npmrds_export_sqlite_db_path: string;
  pg_env: PostgresEnvironments;
};

export type ServiceContext = Context & {
  params: TaskParams;
};

export default {
  name: "npmrds_travel_times",
  actions: {
    run: {
      params: {
        npmrds_export_sqlite_db_path: { type: "string" },
        pg_env: PgEnvSchema,
      },
      handler: async (ctx: ServiceContext) => {
        const { params } = ctx;

        const dama = makeActionCreators(ctx, dataSourceName, "UPDATE");

        dama.start();

        try {
          const result: any = await main(params);

          const { state, year, month } = result;

          const mm = `0${month}`.slice(-2);
          const end_dd = new Date(year, month, 0).getDate();

          const data_table = `"${state}".npmrds_y${year}m${mm}`;
          const start_date = `${year}-${mm}-01`;
          const end_date = `${year}-${mm}-${end_dd}`;

          const geography_version = stateAbbr2FipsCode[state.toLowerCase()];

          const damaViewMeta = {
            ...datamanagerNpmrdsViewBase,
            data_source_name: dataSourceName,
            data_type: "TABULAR",
            interval_version: "MONTH",
            geography_version,
            data_table,
            start_date,
            end_date,
          };

          dama.done(result, damaViewMeta);
        } catch (err) {
          dama.error(err as Error);
        }
      },
    },
  },
};
