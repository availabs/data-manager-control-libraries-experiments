import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/tmc_identification/load-tmc-identification-file";

import { PgEnvSchema } from "../../shared/postgres/schemas";
import { PostgresEnvironments } from "../../shared/postgres/index.d";
import { stateAbbr2FipsCode } from "../../shared/geo/stateFipsCodes";

import makeActionCreators from "../../data_manager/event_sourcing/utils/makeActionCreators";
import datamanagerNpmrdsViewBase from "../shared/datamanager";

export const dataSourceName = "USDOT/FHWA/NPMRDS/TMC_IDENTIFICATION";

export type TaskParams = {
  npmrds_export_sqlite_db_path: string;
  pg_env: PostgresEnvironments;
};

export type ServiceContext = Context & {
  params: TaskParams;
};

export type EventMetadata = object & { pg_env: PostgresEnvironments };

export default {
  name: "npmrds_tmc_identification",
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

          const { state, year, download_timestamp } = result;

          const data_table = `"${state}".tmc_identification_${year}_v${download_timestamp}`;
          const start_date = `${year}-01-01`;
          const end_date = `${year}-12-31`;

          const geography_version = stateAbbr2FipsCode[state.toLowerCase()];

          const damaViewMeta = {
            ...datamanagerNpmrdsViewBase,
            data_source_name: dataSourceName,
            data_type: "TABULAR",
            interval_version: "YEAR",
            geography_version,
            data_table,
            start_date,
            end_date,
          };

          console.log(JSON.stringify(damaViewMeta, null, 4));

          dama.done(result, damaViewMeta);
        } catch (err) {
          dama.error(err as Error);
        }
      },
    },
  },
};
