import _ from "lodash";

import { NodeID, Graph } from "../../../index.d";

const D = 9; // Depth of the dependencies
const N = 10; // Initialial number of root nodes
const P = 0.5; // Probability of connecting
const A = true; // Allow connecting to ancestors, not just parents.

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
  direct_ancestor_connections = A,
} = {}): Graph {
  console.log(JSON.stringify({ depth, num_root_nodes, prob_connect }, null, 4));

  let nodeId = 0;

  const nodeDependencies = {};

  let dependencyCandidates = [];

  for (let d = 0; d < depth; ++d) {
    const currentGenerationNodeIds = [];

    for (let i = 0; i < num_root_nodes + d; ++i) {
      const id = ++nodeId;

      nodeDependencies[id] = chooseDependencies(
        dependencyCandidates,
        prob_connect
      );

      currentGenerationNodeIds.push(id);
    }

    if (direct_ancestor_connections) {
      dependencyCandidates.push(...currentGenerationNodeIds);
    } else {
      dependencyCandidates = currentGenerationNodeIds;
    }
  }

  const graph = Object.keys(nodeDependencies)
    .sort((a, b) => +a - +b)
    .map((id) => ({ node_id: +id, dependencies: nodeDependencies[id] }));

  return graph;
}
