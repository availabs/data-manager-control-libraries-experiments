import { createDbConnection } from "../../database";

import generateDataSourcesDAG from "./utils/generateDataSourcesDAG";

export default function loadMetadataTables(db = createDbConnection()) {
  const tableHasData = db
    .prepare(
      `
        SELECT EXISTS (
          SELECT
              1
            FROM metadata.data_sources
        ) ;
      `
    )
    .pluck()
    .get();

  if (tableHasData) {
    throw new Error("The metadata.data_sources TABLE is already loaded.");
  }

  const insrtSql = `
    INSERT INTO metadata.data_sources (
        source_id,
        dependencies
      ) VALUES ( ?, json(?) )
    ;
  `;

  const insrtStmt = db.prepare(insrtSql);

  const dataSrcDAG = generateDataSourcesDAG();

  db.exec("BEGIN;");

  for (const { node_id, dependencies } of dataSrcDAG) {
    insrtStmt.run(node_id, JSON.stringify(dependencies));
  }

  db.exec("COMMIT;");
}
