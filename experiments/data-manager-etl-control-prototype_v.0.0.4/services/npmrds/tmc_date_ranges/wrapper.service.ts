import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/tmc_date_ranges/refresh_tmc_date_ranges";

import { PgEnvSchema } from "../../shared/postgres/params_schemas";
import { PostgresEnvironments } from "../../shared/postgres/index.d";

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
			handler: async ({ params: { state, pgEnv } }: ServiceContext) =>
				main(state, pgEnv),
		},
	},
};
