import { createDbConnection, SQLiteDatabaseConnection } from "../../database";

import { SuperStepEtlController } from "../../updating/SuperStepEtlController";
import SuperStepUpdateTask from "../../updating/SuperStepUpdateTask";

import { Graph } from "../../index.d";

function getDataSourcesDAG(): Graph {
  const sql = `
    SELECT
        source_id AS node_id,
        dependencies AS deps
      FROM metadata.data_sources
      ORDER BY 1
  `;

  const graph = createDbConnection()
    .prepare(sql)
    .all()
    .map(({ node_id, deps }) => ({
      node_id,
      dependencies: JSON.parse(deps),
    }));

  return graph;
}

export default async function loadDataTables() {
  const graph = getDataSourcesDAG();

  const tasksByNodeId = {};

  // create all tasks
  for (const { node_id, dependencies } of graph) {
    const dependencyTasks = dependencies.map((id) => tasksByNodeId[id]);

    tasksByNodeId[node_id] = new SuperStepUpdateTask(
      0,
      node_id,
      dependencyTasks,
      createDbConnection()
    );
  }

  const controller = new SuperStepEtlController(Object.values(tasksByNodeId));

  // run it
  await controller.main();
}
