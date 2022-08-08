import _ from "lodash";
import dedent from "dedent";

import { TestData, NodeID, GraphNode } from "../../../index.d";
import {
  isStagingConnection,
  SQLiteDatabaseConnection,
} from "../../../database";

function sleep(t = 100) {
  return new Promise((resolve) => setTimeout(resolve, t));
}

export function* makeTestDataGenerator(
  n = 5,
  cDomain = ["A", "B"]
): Generator<TestData> {
  for (let id = 0; id < n; ++id) {
    yield {
      id,
      c1: _.sample(cDomain),
      c2: _.sample(cDomain),
      c3: _.sample(cDomain),
      n1: _.round(Math.random() * 10),
      n2: _.round(Math.random() * 10),
      n3: _.round(Math.random() * 10),
    };
  }
}

export async function* makeTestDataAsyncGenerator(
  n?: number,
  cDomain?: string[]
) {
  const iter = makeTestDataGenerator(n, cDomain);

  for (const d of iter) {
    await sleep();
    yield d;
  }
}

export function createStagingTable(
  db: SQLiteDatabaseConnection,
  node_id: NodeID,
  isRoot: boolean
) {
  const sql = dedent(`
    DROP TABLE IF EXISTS table_${node_id} ;

    CREATE TABLE table_${node_id} (
      id  INTEGER NOT NULL ${isRoot ? "PRIMARY KEY" : ""},
      c1  TEXT NOT NULL,
      c2  TEXT NOT NULL,
      c3  TEXT NOT NULL,
      n1  REAL NOT NULL,
      n2  REAL NOT NULL,
      n3  REAL NOT NULL${
        isRoot
          ? ""
          : `,
      PRIMARY KEY (id, c1, c2, c3)`
      }
    ) ;
  `);

  db.exec(sql);
}

async function stageRootTable(db: SQLiteDatabaseConnection, node_id: NodeID) {
  await sleep();

  db.exec("BEGIN");

  await sleep();

  createStagingTable(db, node_id, true);

  await sleep();

  db.exec(`DELETE FROM table_${node_id} ;`);

  const insertStmt = db.prepare(
    dedent(`
      INSERT INTO table_${node_id} (
          id,
          c1,
          c2,
          c3,
          n1,
          n2,
          n3
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      ;
    `)
  );

  const iter = makeTestDataAsyncGenerator();

  for await (const { id, c1, c2, c3, n1, n2, n3 } of iter) {
    insertStmt.run([id, c1, c2, c3, n1, n2, n3]);
  }

  await sleep();

  db.exec("COMMIT");
}

async function stageNonRootTable(
  db: SQLiteDatabaseConnection,
  node_id: NodeID,
  dependencies: GraphNode["dependencies"]
) {
  await sleep();

  let unions = dependencies.map(
    (id) => `
          SELECT
              id,
              c1,
              c2,
              c3,
              n1,
              n2,
              n3
            FROM table_${id}`
  ).join(`
          UNION ALL
  `);

  const tableName = `main.table_${node_id}`;

  await sleep();

  db.exec("BEGIN;");

  await sleep();

  createStagingTable(db, node_id, false);

  db.exec(`DELETE FROM table_${node_id} ;`);

  const sql = dedent(`
    INSERT INTO ${tableName} (
      id,
      c1,
      c2,
      c3,
      n1,
      n2,
      n3
    )
      SELECT
          id,
          c1,
          c2,
          c3,
          SUM(n1) AS n1,
          MAX(n2) AS n2,
          AVG(n3) AS n3
        FROM (${unions}
        ) AS t
        GROUP BY id, c1, c2, c3
        ORDER BY id, c1, c2, c3
    ;
  `);

  await sleep();

  db.exec(sql);

  await sleep();

  db.exec("COMMIT");
}

export default async function stageDataUpdate(
  db: SQLiteDatabaseConnection,
  node_id: NodeID,
  dependencies?: GraphNode["dependencies"],
  initializing = false
) {
  if (!initializing && !isStagingConnection(db)) {
    throw new Error(
      "db connection passed to stageDataUpdate MUST be a staging connection"
    );
  }

  if (dependencies?.length === 0) {
    return await stageRootTable(db, node_id);
  }

  return await stageNonRootTable(db, node_id, dependencies);
}
