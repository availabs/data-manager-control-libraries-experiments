import { Context } from "moleculer";
import pgFormat from "pg-format";
import _ from "lodash";

import { FSA } from "flux-standard-action";

import stageTmcIdentification from "../../../other_repos/NPMRDS_Database/src/npmrds/tmc_identification/load-tmc-identification-file";
import publishTmcIdentification from "../../../other_repos/NPMRDS_Database/src/npmrds/tmc_identification/publish-tmc-identification";

import { PgEnvSchema } from "../../shared/postgres/schemas";
import { PostgresEnvironments } from "../../shared/postgres/index.d";
import { stateAbbr2FipsCode } from "../../shared/geo/stateFipsCodes";

import datamanagerNpmrdsViewBase from "../shared/datamanager";

export const dataSourceName = "USDOT/FHWA/NPMRDS/TMC_IDENTIFICATION";

export type TaskParams = {
  npmrds_export_sqlite_db_path: string;
  pg_env: PostgresEnvironments;
};

export type ServiceContext = Context & {
  params: TaskParams;
};

export type EventMetadata = object & { pg_env: PostgresEnvironments };

const commonDammaMetaProps = ["DAMAA", "etl_context_id", "pg_env"];

export default {
  name: "npmrds_tmc_identification",

  events: {
    [`${dataSourceName}::LOAD_REQUEST`]: {
      context: true,
      // params: FSAEventParam,
      async handler(ctx: ServiceContext) {
        await this.stage(ctx.params);
      },
    },
    [`${dataSourceName}::QA_APPROVED`]: {
      context: true,
      // params: FSAEventParam,
      async handler(ctx: ServiceContext) {
        await this.makeViewMetadataTemplate(ctx.params);
      },
    },
    [`${dataSourceName}::VIEW_METADATA_SUBMITTED`]: {
      context: true,
      // params: FSAEventParam,
      async handler(ctx: ServiceContext) {
        await this.publish(ctx.params);
      },
    },
    // [`${dataSourceName}::PUBLISH`]: {
    // context: true,
    // // params: FSAEventParam,
    // async handler(ctx: ServiceContext) {
    // await this.stage(ctx.params);
    // },
    // },
  },

  methods: {
    stage: {
      // params: {
      // payload: {
      // npmrds_export_sqlite_db_path: { type: "string" },
      // },
      // meta: {
      // etl_context_id: { type: "number" },
      // pg_env: PgEnvSchema,
      // },
      // },
      async handler(event: FSA | /* FIXME */ any) {
        const {
          payload: { npmrds_export_sqlite_db_path },
          meta: { etl_context_id: parent_context_id = null, pg_env },
        } = event;

        const etl_context_id = await this.broker.call(
          "dama_dispatcher.spawnDamaContext",
          { etl_context_id: parent_context_id, pg_env }
        );

        const start_timestamp = new Date().toISOString();

        const payload: any = await stageTmcIdentification({
          npmrds_export_sqlite_db_path,
          pg_env,
        });

        const loadedEvent = {
          type: `${dataSourceName}::LOADED`,
          payload,
          meta: {
            INITIAL: true,
            DAMAA: true,
            checkpoint: true,
            parent_context_id,
            etl_context_id,
            pg_env,
            start_timestamp,
            end_timestamp: new Date().toISOString(),
          },
        };

        const damaEvent = await this.broker.call(
          "dama_dispatcher.dispatch",
          loadedEvent
        );

        process.nextTick(() => this.requestQA(loadedEvent));

        return damaEvent;
      },
    },
    requestQA: {
      // params: {
      // payload: {
      // state: { type: "string" },
      // year: { type: "number" },
      // download_timestamp: { type: "string" },
      // },
      // meta: {
      // etl_context_id: { type: "number" },
      // pg_env: PgEnvSchema,
      // },
      // },
      async handler(event: FSA | /* FIXME */ any) {
        const { payload, meta } = event;

        const damaEvent = await this.broker.call("dama_dispatcher.dispatch", {
          type: `${dataSourceName}::QA_REQUEST`,
          payload,
          meta: {
            ..._.pick(meta, commonDammaMetaProps),
            checkpoint: true,
            timestamp: new Date().toISOString(),
          },
        });

        return damaEvent;
      },
    },

    makeViewMetadataTemplate: {
      params: {
        payload: {
          state: { type: "string" },
          year: { type: "number" },
          download_timestamp: { type: "string" },
        },
        meta: {
          etl_context_id: { type: "number" },
          pg_env: PgEnvSchema,
        },
      },
      async handler(event: FSA) {
        const {
          payload: { state, year, download_timestamp },
          meta: { etl_context_id, pg_env },
        } = event;

        const table_schema = state;
        const table_name = `tmc_identification_${year}_v${download_timestamp}`;
        const data_table = pgFormat("%I.%I", table_schema, table_name);
        const start_date = `${year}-01-01`;
        const end_date = `${year}-12-31`;

        const geography_version = stateAbbr2FipsCode[state.toLowerCase()];

        const type = `${dataSourceName}::VIEW_METADATA_TEMPLATE`;

        const payload = {
          ...datamanagerNpmrdsViewBase,
          data_source_name: dataSourceName,
          data_type: "TABULAR",
          interval_version: "YEAR",
          geography_version,
          table_schema,
          table_name,
          data_table,
          start_date,
          end_date,
        };

        const meta = {
          DAMAA: true,
          etl_context_id,
          pg_env,
          timestamp: new Date().toISOString(),
          checkpoint: true,
        };

        const e = {
          type,
          payload,
          meta,
        };

        const damaEvent = await this.broker.call("dama_dispatcher.dispatch", e);

        console.log(JSON.stringify({ e, damaEvent }, null, 4));

        return damaEvent;
      },
    },

    publish: {
      /* NOTE:  The DAMAA event should the PUBLISH event sent from the client.
       *        The PUBLISH event payload MUST be the final version of the VIEW_METADATA.
      params: {
        payload: {
          state: { type: "string" },
          year: { type: "number" },
          download_timestamp: { type: "string" },
        },
        meta: {
          etl_context_id: { type: "number" },
          pg_env: PgEnvSchema,
        },
      },
      */
      async handler(event: FSA) {
        const { payload: oldPayload, meta } = event;

        const { table_schema, table_name } = oldPayload;
        const { pg_env } = meta;

        const oldMeta = _.pick(meta, commonDammaMetaProps);

        const start_timestamp = new Date().toISOString();

        const newPayload = await publishTmcIdentification({
          table_schema,
          table_name,
          pg_env,
        });

        const end_timestamp = new Date().toISOString();

        const type = `${dataSourceName}::PUBLISHED`;

        const e = {
          type,
          payload: newPayload,
          meta: { ...oldMeta, DAMAA: true, start_timestamp, end_timestamp },
        };

        const damaEvent = await this.broker.call("dama_dispatcher.dispatch", e);

        return damaEvent;
      },
    },
  },
};
