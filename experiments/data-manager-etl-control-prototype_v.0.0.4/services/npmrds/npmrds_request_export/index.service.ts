import { Context } from "moleculer";

/*
import main, {
	RequestNpmrdsExportParams,
} from "../../../other_repos/avail-datasources-watcher/tasks/requestNpmrdsExport/request_npmrds_export";
*/

const main = async (...args: any[]) => {
  console.log("==> requestNpmrdsExport MOCK");
  console.log(JSON.stringify(args, null, 4));
};
type RequestNpmrdsExportParams = any;

import makeActionCreators from "../../data_manager/event_sourcing/utils/makeActionCreators";

export const dataSourceName = "USDOT/FHWA/NPMRDS/RITIS_MDD_EXPORT_REQUEST";

export type ServiceContext = Context & {
  params: RequestNpmrdsExportParams;
};

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

        const dama = makeActionCreators(ctx, dataSourceName, "REQUEST");

        dama.start();

        try {
          const result: any = await main(params);

          dama.done(result);
        } catch (err) {
          dama.error(err as Error);
        }
      },
    },
  },
};
