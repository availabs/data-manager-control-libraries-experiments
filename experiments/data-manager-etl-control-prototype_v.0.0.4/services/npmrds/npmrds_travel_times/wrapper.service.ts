import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/npmrds_travel_times/load-npmrds-state-yrmo";

export type TaskParams = {
	npmrds_export_sqlite_db_path: string;
	pg_env: "development" | "production";
};

export type ServiceContext = Context & {
	params: TaskParams;
};

export default {
	name: "npmrds_travel_times",
	actions: {
		async run(ctx: ServiceContext) {
			return main(ctx.params);
		},
	},
};
