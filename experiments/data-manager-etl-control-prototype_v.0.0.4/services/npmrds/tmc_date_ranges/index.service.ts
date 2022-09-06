import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/tmc_date_ranges/refresh_tmc_date_ranges";

import makeActionCreators from "../../data_manager/event_sourcing/utils/makeActionCreators";

import { PgEnvSchema } from "../../shared/postgres/schemas";
import { PostgresEnvironments } from "../../shared/postgres/index.d";

enum DataManagerEvent {
	"START" = "NPMRDS/TMC_DATE_RANGES/START",
	"DONE" = "NPMRDS/TMC_DATE_RANGES/DONE",
	"ERROR" = "NPMRDS/TMC_DATE_RANGES/ERROR",
}
export type TaskParams = {
	state: string;
	pgEnv: PostgresEnvironments;
};

export type ServiceContext = Context & {
	params: TaskParams;
};

export default {
	name: "tmc_date_ranges",
	actions: {
		run: {
			params: {
				npmrds_export_sqlite_db_path: { type: "string" },
				pg_env: PgEnvSchema,
			},
			handler: async (ctx: ServiceContext) => {
				const { params } = ctx;
				const { state, pgEnv } = params;

				const dm = makeActionCreators(ctx, DataManagerEvent);

				dm.start();

				try {
					const result: any = main(state, pgEnv);

					dm.done(result);
				} catch (err) {
					dm.error(<Error>err);
				}
			},
		},
	},
};
