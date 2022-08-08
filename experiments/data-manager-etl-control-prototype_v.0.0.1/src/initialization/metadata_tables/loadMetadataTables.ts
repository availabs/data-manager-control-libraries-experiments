import { createDbConnection } from "../../database";

import generateDataSourcesDAG from "./utils/generateDataSourcesDAG";

const D = 9; // Depth of the dependencies
const N = 10; // Initialial number of root nodes
const P = 0.5; // Probability of connecting
const A = true; // Allow connecting to ancestors, not just parents.

const graphCreationConfig = {
  depth: D,
  num_root_nodes: N,
  prob_connect: P,
  direct_ancestor_connections: A,
};

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

  const dataSrcDAG = generateDataSourcesDAG(graphCreationConfig);

  db.exec("BEGIN;");

  for (const { node_id, dependencies } of dataSrcDAG) {
    insrtStmt.run(node_id, JSON.stringify(dependencies));
  }

  db.exec("COMMIT;");
}
