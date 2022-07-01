import { useCallback, useEffect, useState } from "react";
import ReactFlow, { Background, BackgroundVariant, Controls, Node, Edge, useNodesState, useEdgesState, applyNodeChanges, applyEdgeChanges, ReactFlowInstance, NodeChange } from "react-flow-renderer";
import ELK, { ElkNode } from "elkjs/lib/elk.bundled";
import { WorkflowCanvas } from "./workflo/WorkflowCanvas";

export type ReactFlowElements = { nodes: Node[], edges: Edge[] };
  
/**
 * The MainPanel component props.
 */
export type MainPanelProps = {
    /** The behaviour tree definition. */
    definition: string;

    /** The behaviour tree ReactFlow elements. */
    elements: ReactFlowElements;
}

/**
 * The MainPanel component.
 */
 export const MainPanel: React.FunctionComponent<MainPanelProps> = ({ definition, elements }) => {
    return (
        <WorkflowCanvas
            nodes={[]}
            connectors={[]}
            nodeComponents={{}} />
    );
  }
  