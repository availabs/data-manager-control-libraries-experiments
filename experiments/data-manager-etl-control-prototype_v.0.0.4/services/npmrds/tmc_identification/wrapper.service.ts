import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/tmc_identification/load-tmc-identification-file";

import { PgEnvSchema } from "../../shared/postgres/params_schemas";
import { PostgresEnvironments } from "../../shared/postgres/index.d";

export type TaskParams = {
	npmrds_export_sqlite_db_path: string;
	pg_env: PostgresEnvironments;
};

export type ServiceContext = Context & {
	params: TaskParams;
};

export default {
	name: "tmc_identification",
	actions: {
		run: {
			params: {
				npmrds_export_sqlite_db_path: { type: "string" },
				pg_env: PgEnvSchema,
			},
			handler: async (ctx: ServiceContext) => main(ctx.params),
		},
	},
};
