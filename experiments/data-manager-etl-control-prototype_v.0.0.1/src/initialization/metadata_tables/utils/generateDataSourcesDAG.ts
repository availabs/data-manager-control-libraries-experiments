import _ from "lodash";

import { NodeID, Graph } from "../../../index.d";

const D = 5;
const N = 3;
const P = 0.5;

function chooseDependencies(
  dependencyCandidates: NodeID[] = [],
  prob_connect = 1
) {
  let dependencies = dependencyCandidates.filter(
    () => prob_connect >= Math.random()
  );

  // If not a root node, must have at least one dependency
  if (dependencyCandidates.length && dependencies.length < 1) {
    dependencies = [_.sample(dependencyCandidates)];
  }

  return dependencies;
}

export default function generateDataSourcesDAG({
  depth = D,
  num_root_nodes = N,
  prob_connect = P,
} = {}): Graph {
  console.log(JSON.stringify({ depth, num_root_nodes, prob_connect }, null, 4));

  let nodeId = 0;

  const nodeDependencies = {};

  let previousGenerationNodeIds = [];

  for (let d = 0; d < depth; ++d) {
    const currentGenerationNodeIds = [];

    for (let i = 0; i < num_root_nodes + d; ++i) {
      const id = ++nodeId;

      nodeDependencies[id] = chooseDependencies(
        previousGenerationNodeIds,
        prob_connect
      );

      currentGenerationNodeIds.push(id);
    }

    previousGenerationNodeIds = currentGenerationNodeIds;
  }

  const graph = Object.keys(nodeDependencies)
    .sort((a, b) => +a - +b)
    .map((id) => ({ node_id: +id, dependencies: nodeDependencies[id] }));

  return graph;
}
