import _ from "lodash";

import { NodeID, Graph } from "../../index.d";

// NOTE: Assumes nodes may depend ONLY on nodes with lower node_ids
export default function getUpdateSubnet(graph: Graph, updating: NodeID[]) {
  const subgraphNodeIds = new Set<NodeID>(updating);

  for (const { node_id, dependencies } of graph) {
    const isDependent = dependencies.some((id) => subgraphNodeIds.has(id));

    if (isDependent) {
      subgraphNodeIds.add(node_id);
    }
  }

  const subGraph = graph.filter(({ node_id }) => subgraphNodeIds.has(node_id));

  return subGraph;
}
