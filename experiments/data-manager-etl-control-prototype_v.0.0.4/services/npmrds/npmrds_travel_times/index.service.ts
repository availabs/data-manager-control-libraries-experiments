import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/npmrds_travel_times/load-npmrds-state-yrmo";

import makeActionCreators from "../../data_manager/event_sourcing/utils/makeActionCreators";

import { PgEnvSchema } from "../../shared/postgres/schemas";
import { PostgresEnvironments } from "../../shared/postgres/index.d";

export enum DataManagerEvent {
	"START" = "NPMRDS/TRAVEL_TIMES/START",
	"DONE" = "NPMRDS/TRAVEL_TIMES/DONE",
	"ERROR" = "NPMRDS/TRAVEL_TIMES/ERROR",
}

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
		load: {
			params: {
				npmrds_export_sqlite_db_path: { type: "string" },
				pg_env: PgEnvSchema,
			},
			handler: async (ctx: ServiceContext) => {
				const { params } = ctx;

				const dama = makeActionCreators(ctx, DataManagerEvent);

				dama.start();

				try {
					const result: any = await main(params);

					dama.done(result);
				} catch (err) {
					dama.error(<Error>err);
				}
			},
		},
	},
};
