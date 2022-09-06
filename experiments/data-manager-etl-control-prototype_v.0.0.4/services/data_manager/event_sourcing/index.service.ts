// @ts-ignore
import { readFile as readFileAsync } from "fs/promises";
import { join } from "path";

import { Context } from "moleculer";

import { FSA } from "flux-standard-action";

import {
	PgEnv,
	NodePgConnection,
	getConnectedNodePgClient,
} from "../../shared/postgres/PostgreSQL";
import { FSAEventParam } from "../../shared/events/schemas";

export type ServiceContext = Context & {
	params: FSA;
};

type LocalVariables = {
	databaseConnections: Record<PgEnv, Promise<NodePgConnection>>;
};

export default {
	name: "data_manager_controller",

	events: {
		"data_manager.*": {
			context: true,
			params: FSAEventParam,
			async handler(ctx: ServiceContext) {
				await this.insertEvent(ctx);

				this.logger.info(JSON.stringify(ctx.params, null, 4));
			},
		},
	},

	methods: {
		async insertEvent(ctx: ServiceContext) {
			const { params } = ctx;
			// @ts-ignore
			const { meta: { pg_env } = {} } = params;

			if (pg_env) {
				const db = await this.getDb(pg_env);

				// @ts-ignore
				const { type, payload, meta = null, error = null } = params;

				const q = `
            INSERT INTO _data_manager_admin.event_store_prototype (
              type,
              payload,
              meta,
              error
            ) VALUES ( $1, $2, $3, $4 )
          `;

				await db.query(q, [type, payload, meta, error]);
			}
		},

		async getDb(pg_env: PgEnv) {
			const local = <LocalVariables>this._local_;

			if (!local.databaseConnections[pg_env]) {
				let ready: Function;

				local.databaseConnections[pg_env] = new Promise((resolve) => {
					ready = resolve;
				});

				const db = await getConnectedNodePgClient(pg_env);

				const createTablesSql = await readFileAsync(
					join(__dirname, "./sql/create_event_sourcing_table.sql"),
					{ encoding: "utf8" }
				);

				await db.query(createTablesSql);

				// @ts-ignore
				ready(db);
			}

			return local.databaseConnections[pg_env];
		},
	},

	created() {
		this._local_ = <LocalVariables>{
			databaseConnections: {},
		};
	},

	async stopped() {
		const local = <LocalVariables>this._local_;

		await Promise.all(
			Object.values(local.databaseConnections).map(async (dbP) => {
				const db = await dbP;
				db.end();
			})
		);
	},
};
