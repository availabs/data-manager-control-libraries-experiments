import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/tmc_identification/load-tmc-identification-file";

import { PgEnvSchema } from "../../shared/postgres/schemas";
import { PostgresEnvironments } from "../../shared/postgres/index.d";

import makeActionCreators from "../../data_manager/event_sourcing/utils/makeActionCreators";

export type TaskParams = {
	npmrds_export_sqlite_db_path: string;
	pg_env: PostgresEnvironments;
};

export type ServiceContext = Context & {
	params: TaskParams;
};

export type EventMetadata = object & { pg_env: PostgresEnvironments };

export enum DataManagerEvent {
	"START" = "NPMRDS/TMC_IDENTIFICATION/START",
	"DONE" = "NPMRDS/TMC_IDENTIFICATION/DONE",
	"ERROR" = "NPMRDS/TMC_IDENTIFICATION/ERROR",
}

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
