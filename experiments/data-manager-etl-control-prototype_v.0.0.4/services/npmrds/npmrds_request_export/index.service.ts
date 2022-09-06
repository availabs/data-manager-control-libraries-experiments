import { Context } from "moleculer";

import main, {
	RequestNpmrdsExportParams,
} from "../../../other_repos/avail-datasources-watcher/tasks/requestNpmrdsExport/request_npmrds_export";

import makeActionCreators from "../../data_manager/event_sourcing/utils/makeActionCreators";

export type ServiceContext = Context & {
	params: RequestNpmrdsExportParams;
};

export enum DataManagerEvent {
	"START" = "NPMRDS/ETL_REQUEST_EXPORT/START",
	"DONE" = "NPMRDS/ETL_REQUEST_EXPORT/DONE",
	"ERROR" = "NPMRDS/ETL_REQUEST_EXPORT/ERROR",
}

export default {
	name: "npmrds_request_export",
	actions: {
		run: {
			params: {
				states: { type: "array", items: { type: "string", length: 2 } },
				start_year: { type: "number" },
				start_month: { type: "string" },
				end_year: { type: "number" },
				end_month: { type: "string" },
				is_expanded: { type: "boolean", default: true },
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
