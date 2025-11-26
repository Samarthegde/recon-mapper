import { Node, Edge } from '@xyflow/react';

export interface Flow {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  nodeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface FlowStorage {
  flows: Flow[];
  activeFlowId: string | null;
}
