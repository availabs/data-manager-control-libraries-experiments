import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/tmc_metadata/load-state-year-tmc-metadata";

import makeActionCreators from "../../data_manager/event_sourcing/utils/makeActionCreators";

import { PgEnvSchema } from "../../shared/postgres/schemas";
import { PostgresEnvironments } from "../../shared/postgres/index.d";

export const dataSourceName = "USDOT/FHWA/NPMRDS/TMC_METADATA";

export type TaskParams = {
  state: string;
  year: number;
  pg_env: PostgresEnvironments;
};

export type ServiceContext = Context & {
  params: TaskParams;
};

export default {
  name: "tmc_metadata",
  actions: {
    run: {
      params: {
        state: { type: "string" },
        year: { type: "number" },
        pg_env: PgEnvSchema,
      },
      handler: async (ctx: ServiceContext) => {
        const { params } = ctx;

        const dama = makeActionCreators(ctx, dataSourceName, "UPDATE");

        dama.start();

        try {
          const { state, year, pg_env } = params;
          const result: any = main(state, year, pg_env);

          dama.done(result);
        } catch (err) {
          dama.error(err as Error);
        }
      },
    },
  },
};
