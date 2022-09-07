// @ts-ignore
import { readFile as readFileAsync } from "fs/promises";
import { join } from "path";

import _ from "lodash";

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

        if (ctx.params.error) {
          const { message, stack } = ctx.params.payload;

          this.logger.error(JSON.stringify({ message, stack }, null, 4));
        } else {
          this.logger.info(JSON.stringify(ctx.params, null, 4));
        }
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

        if (payload.damaViewMeta) {
          await this.updateDataManagerViewMetadata(
            db,
            payload.damaViewMeta,
            meta.end_time
          );
        }
      }
    },

    async updateDataManagerViewMetadata(
      db: NodePgConnection,
      damaViewMeta: any,
      last_updated: string
    ) {
      if (damaViewMeta.version) {
        throw new Error(
          "_data_manager_admin.data_views_proto.version MUST be set automatically."
        );
      }

      if (damaViewMeta.last_updated) {
        throw new Error(
          "_data_manager_admin.data_views_proto.last_updated MUST be set automatically."
        );
      }

      const colsQ = `
    SELECT
    column_name
    FROM information_schema.columns
    WHERE (
    ( table_schema = '_data_manager_admin' )
    AND
    ( table_name = 'data_views_proto' )
    )
    ;`;

      const { rows: colsQRows } = await db.query(colsQ);

      const columnNames = colsQRows.map(({ column_name }) => column_name);

      const viewMeta = {
        ..._.pick(damaViewMeta, columnNames),
        last_updated,
      };

      const cols: string[] = [];
      const queryParams: any[] = [];

      const selectClauses = Object.keys(viewMeta)
        .map((k) => {
          cols.push(k);
          const i = queryParams.push(viewMeta[k]);

          if (k === "last_updated") {
            return `$${i}::TIMESTAMP AS ${k}`;
          }

          if (/_date$/.test(k)) {
            return `$${i}::DATE AS ${k}`;
          }

          return `$${i} AS ${k}`;
        })
        .join(", ");

      const { data_source_name } = damaViewMeta;

      const insertQ = `
        WITH cte_d AS (
        SELECT
          ${selectClauses},
          MAX(a.source_id)::INTEGER AS source_id,
          (MAX(COALESCE(b.version, '0'))::INTEGER + 1) as version
        FROM (
          SELECT
          id AS source_id
          FROM _data_manager_admin.data_sources_proto
          WHERE ( name = $${queryParams.push(data_source_name)} )
        ) AS a
          LEFT OUTER JOIN _data_manager_admin.data_views_proto AS b
          USING ( source_id )
        )
        INSERT INTO _data_manager_admin.data_views_proto (
          ${cols.join(", ")}, source_id, version
        )
        SELECT ${cols}, source_id, version FROM cte_d
        ;
      `;

      const result = await db.query(insertQ, queryParams);
    },

    async getDb(pg_env: PgEnv) {
      const local = this._local_ as LocalVariables;

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
