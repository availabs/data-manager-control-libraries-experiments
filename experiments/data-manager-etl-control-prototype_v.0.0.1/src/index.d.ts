export type NodeID = number;

export type GraphNode = {
  node_id: NodeID;
  dependencies: NodeID[];
};

export type Graph = GraphNode[];

export type TestData = {
  id: number;
  c1: string;
  c2: string;
  c3: string;
  n1: number;
  n2: number;
  n3: number;
};
