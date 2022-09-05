import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/tmc_metadata/load-state-year-tmc-metadata";

import { PgEnvSchema } from "../../shared/postgres/params_schemas";
import { PostgresEnvironments } from "../../shared/postgres/index.d";

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
			handler: async ({
				params: { state, year, pg_env },
			}: ServiceContext) => main(state, year, pg_env),
		},
	},
};
