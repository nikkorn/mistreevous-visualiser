import { useCallback, useState } from "react";
import ReactFlow, { Background, BackgroundVariant, Controls, Node, Edge, useNodesState, useEdgesState, applyNodeChanges, applyEdgeChanges } from "react-flow-renderer";

export type ReactFlowElements = { nodes: Node[], edges: Edge[] };
  
/**
 * The MainPanel component props.
 */
export type MainPanelProps = {
    elements: ReactFlowElements;
}

/**
 * The MainPanel component.
 */
 export const MainPanel: React.FunctionComponent<MainPanelProps> = ({ elements }) => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const onNodesChange = useCallback((changes: any) => setNodes((ns) => applyNodeChanges(changes, ns) as any), []);
    const onEdgesChange = useCallback((changes: any) => setEdges((es) => applyEdgeChanges(changes, es) as any), []);

    if (nodes.length != elements.nodes.length) {
        setNodes(elements.nodes as any);
    }

    if (edges.length != elements.edges.length) {
        setEdges(elements.edges as any);
    }

    return (
        <div className="main-panel reactflow-wrapper">
            <ReactFlow
                onInit={(instance) => instance.fitView()}
                maxZoom={1.5}
				minZoom={0.6}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}>
                <Controls />
                <Background variant={BackgroundVariant.Lines} gap={20} size={0.5} />
            </ReactFlow>
        </div>
    );
  }
  