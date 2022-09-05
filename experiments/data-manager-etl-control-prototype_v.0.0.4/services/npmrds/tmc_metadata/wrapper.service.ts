import { Context } from "moleculer";

import main from "../../../other_repos/NPMRDS_Database/src/npmrds/tmc_metadata/load-state-year-tmc-metadata";

export type TaskParams = {
	state: string;
	year: number;
	pgEnv: "development" | "production";
};

export type ServiceContext = Context & {
	params: TaskParams;
};

export default {
	name: "tmc_metadata",
	actions: {
		async run(ctx: ServiceContext) {
			const {
				params: { state, year, pgEnv },
			} = ctx;

			return main(state, year, pgEnv);
		},
	},
};
