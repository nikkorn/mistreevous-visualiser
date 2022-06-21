import ReactFlow, { Background, BackgroundVariant, Controls, Node, Edge, useNodesState, useEdgesState } from "react-flow-renderer";

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
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    if (nodes != elements.nodes) {
        setNodes(elements.nodes);
    }

    if (edges != elements.edges) {
        setEdges(elements.edges);
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
  