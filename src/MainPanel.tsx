import { useCallback, useEffect, useState } from "react";
import ReactFlow, { Background, BackgroundVariant, Controls, Node, Edge, useNodesState, useEdgesState, applyNodeChanges, applyEdgeChanges, ReactFlowInstance, NodeChange } from "react-flow-renderer";
import ELK, { ElkNode } from "elkjs/lib/elk.bundled";
import { WorkflowCanvas } from "./workflo/WorkflowCanvas";
import { DefaultNode } from "./workflo/DefaultNode";

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

const initialNodes = [
    { id: "1", caption: "hello", variant: "default", position: { x: 100, y: 100 } },
    { id: "2", caption: "world", variant: "default", position: { x: 200, y: 200 } }
];

const initialConnectors = [
    { id: "1", from: "1", to: "2" }
];

/**
 * The MainPanel component.
 */
 export const MainPanel: React.FunctionComponent<MainPanelProps> = ({ definition, elements }) => {
    return (
        <WorkflowCanvas
            nodes={initialNodes}
            connectors={initialConnectors}
            nodeComponents={{
                "default": DefaultNode
            }} />
    );
  }
  