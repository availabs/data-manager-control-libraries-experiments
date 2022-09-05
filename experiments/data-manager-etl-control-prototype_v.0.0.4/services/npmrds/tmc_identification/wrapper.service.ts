import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/tmc_identification/load-tmc-identification-file";

export type TaskParams = {
	npmrds_export_sqlite_db_path: string;
	pg_env: "development" | "production";
};

export type ServiceContext = Context & {
	params: TaskParams;
};

export default {
	name: "tmc_identification",
	actions: {
		async run(ctx: ServiceContext) {
			return main(ctx.params);
		},
	},
};
