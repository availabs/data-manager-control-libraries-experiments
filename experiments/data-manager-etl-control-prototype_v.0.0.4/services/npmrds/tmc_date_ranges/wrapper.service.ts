import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/tmc_date_ranges/refresh_tmc_date_ranges";

export type TaskParams = {
	state: string;
	pgEnv: "development" | "production";
};

export type ServiceContext = Context & {
	params: TaskParams;
};

export default {
	name: "tmc_date_ranges",
	actions: {
		async run(ctx: ServiceContext) {
			const {
				params: { state, pgEnv },
			} = ctx;

			return main(state, pgEnv);
		},
	},
};
